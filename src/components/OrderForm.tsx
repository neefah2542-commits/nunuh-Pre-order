/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, OrderStatus, Measurements, CatalogueItem, STANDARD_SIZE_CHART } from '../types';
import { Save, User, Sparkles, Ruler, CreditCard, ChevronRight, Check, Image as ImageIcon, UploadCloud, X } from 'lucide-react';

interface OrderFormProps {
  catalogue: CatalogueItem[];
  onAddOrder: (newOrder: Order) => void;
  nextOrderNumber: string;
}

export default function OrderForm({ catalogue, onAddOrder, nextOrderNumber }: OrderFormProps) {
  // ฟอร์มแบ่งออกเป็น 4 ส่วนหลักเพื่อความเป็นระเบียบเรียบร้อย (Bento layout)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerSocial, setCustomerSocial] = useState('');
  const [lineUserId, setLineUserId] = useState('');
  const [customerCategory, setCustomerCategory] = useState('IDD'); // ค่าเริ่มต้นเช่น IDD, IDH
  const [membershipTier, setMembershipTier] = useState<'PRIME' | 'PRIVILEGE' | 'TRADER' | 'MEMBER'>('MEMBER');
  const [externalOrderId, setExternalOrderId] = useState('');
  const [branch, setBranch] = useState('สาขานราธิวาส');
  
  const [dressType, setDressType] = useState('เดรสราตรี');
  const [customDressType, setCustomDressType] = useState('');
  const [fabricType, setFabricType] = useState('Heavy Premium Satin');
  const [customFabricType, setCustomFabricType] = useState('');
  const [fabricColor, setFabricColor] = useState('');
  
  const [selectedDesignId, setSelectedDesignId] = useState<string>('custom');
  const [customImage, setCustomImage] = useState<string>('');
  
  // Custom design details
  const [silhouette, setSilhouette] = useState('A-Line');
  const [neckline, setNeckline] = useState('V-Neck');
  const [sleeves, setSleeves] = useState('Long Sleeves');

  // Measurements
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [shoulder, setShoulder] = useState('');
  const [sleeveLength, setSleeveLength] = useState('');
  const [armhole, setArmhole] = useState('');
  const [length, setLength] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [frontChest, setFrontChest] = useState('');
  const [backChest, setBackChest] = useState('');
  const [frontLength, setFrontLength] = useState('');
  const [backLength, setBackLength] = useState('');
  const [wrist, setWrist] = useState('');
  const [otherNotes, setOtherNotes] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Pricing & Delivery
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [discount, setDiscount] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sku, setSku] = useState('');
  const [customerPhotoFront, setCustomerPhotoFront] = useState('');
  const [customerPhotoSide, setCustomerPhotoSide] = useState('');
  const [customerPhotoBack, setCustomerPhotoBack] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('เงินโอน');
  const [slipImage, setSlipImage] = useState<string>('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // จัดการเมื่อเลือกแบบในแคตตาล็อก
  const handleSelectDesign = (designId: string) => {
    setSelectedDesignId(designId);
    if (designId !== 'custom') {
      const selected = catalogue.find(item => item.id === designId);
      if (selected) {
        setDressType(selected.category === 'Abaya' ? 'อาบายะห์' : 'เดรสราตรี');
        setFabricType(selected.fabricRecommend.split(' & ')[0] || '');
        setSku(selected.sku || '');
        
        // ตรวจสอบราคาเฉพาะไซส์ที่เลือกไว้ก่อนหน้า ถ้ามีให้ใส่ราคานั้นทันที
        if (selectedSize && selected.sizePrices && selected.sizePrices[selectedSize]) {
          const customPrice = selected.sizePrices[selectedSize];
          setPrice(customPrice.toString());
          setDeposit((customPrice / 2).toString());
        } else {
          // แนะนำราคาเริ่มต้นจากช่วงราคาของแบบชุด
          const numMatch = selected.priceRange.match(/\d+,\d+/g);
          if (numMatch && numMatch[0]) {
            const cleanNum = numMatch[0].replace(',', '');
            setPrice(cleanNum);
            setDeposit((parseInt(cleanNum) / 2).toString());
          }
        }
      }
    } else {
      setSku('');
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!customerName.trim()) tempErrors.customerName = "กรุณากรอกชื่อลูกค้า";
    if (!customerPhone.trim()) tempErrors.customerPhone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!price || isNaN(Number(price))) tempErrors.price = "กรุณากรอกราคาให้ถูกต้อง";
    if (!deposit || isNaN(Number(deposit))) tempErrors.deposit = "กรุณากรอกมัดจำให้ถูกต้อง";
    if (!deliveryDate) tempErrors.deliveryDate = "กรุณาเลือกวันกำหนดส่งชุด";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // เลื่อนขึ้นไปแสดงข้อผิดพลาด
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const measurementsData: Measurements = {
      chest: chest || "-",
      waist: waist || "-",
      hips: hips || "-",
      shoulder: shoulder || "-",
      sleeveLength: sleeveLength || "-",
      armhole: armhole || "-",
      length: length || "-",
      neck: neck || "-",
      height: height || "-",
      weight: weight || "-",
      frontChest: frontChest || "-",
      backChest: backChest || "-",
      frontLength: frontLength || "-",
      backLength: backLength || "-",
      wrist: wrist || "-",
      otherNotes: otherNotes,
      standardSize: selectedSize || undefined
    };

    const finalDressType = dressType === 'อื่นๆ' ? customDressType : dressType;
    const finalFabricType = fabricType === 'อื่นๆ' ? customFabricType : fabricType;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: nextOrderNumber,
      customerName,
      customerPhone,
      customerSocial: customerSocial || undefined,
      lineUserId: lineUserId || undefined,
      dressType: finalDressType,
      fabricType: finalFabricType,
      fabricColor: fabricColor || "ตามแบบ",
      orderDate: todayStr,
      deliveryDate,
      price: parseInt(price),
      deposit: parseInt(deposit),
      discount: discount ? parseInt(discount) : 0,
      measurements: measurementsData,
      status: OrderStatus.RECEIVED,
      notes: notes || undefined,
      selectedDesignId: selectedDesignId !== 'custom' ? selectedDesignId : undefined,
      sku: sku.trim() || undefined,
      customDesign: selectedDesignId === 'custom' ? {
        silhouette,
        neckline,
        sleeves
      } : undefined,
      customImage: customImage || undefined,
      customerPhotoFront: customerPhotoFront || undefined,
      customerPhotoSide: customerPhotoSide || undefined,
      customerPhotoBack: customerPhotoBack || undefined,
      paymentMethod: paymentMethod || 'เงินโอน',
      slipImage: slipImage || undefined,
      customerCategory: customerCategory || undefined,
      membershipTier: membershipTier,
      externalOrderId: externalOrderId.trim() || undefined,
      branch: branch || 'สาขานราธิวาส'
    };

    onAddOrder(newOrder);
    setIsSuccess(true);
    
    // รีเซ็ตฟอร์ม
    setTimeout(() => {
      setIsSuccess(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerSocial('');
      setCustomerCategory('IDD');
      setMembershipTier('MEMBER');
      setExternalOrderId('');
      setBranch('สาขานราธิวาส');
      setFabricColor('');
      setSku('');
      setChest('');
      setWaist('');
      setHips('');
      setShoulder('');
      setSleeveLength('');
      setArmhole('');
      setLength('');
      setNeck('');
      setHeight('');
      setWeight('');
      setFrontChest('');
      setBackChest('');
      setFrontLength('');
      setBackLength('');
      setWrist('');
      setOtherNotes('');
      setPrice('');
      setDeposit('');
      setDiscount('');
      setDeliveryDate('');
      setNotes('');
      setSelectedDesignId('custom');
      setCustomImage('');
      setCustomerPhotoFront('');
      setCustomerPhotoSide('');
      setCustomerPhotoBack('');
      setPaymentMethod('เงินโอน');
      setSlipImage('');
      setSelectedSize('');
    }, 2000);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (size && STANDARD_SIZE_CHART[size]) {
      const config = STANDARD_SIZE_CHART[size];
      setChest(config.chest);
      setWaist(config.waist);
      setHips(config.hips);
      setShoulder(config.shoulder);
      setSleeveLength(config.sleeveLength);
      setLength(config.length);
    }

    // อัปเดตราคาและเงินมัดจำหากแบบชุดที่เลือกมีราคาเฉพาะไซส์นี้ตั้งไว้
    if (selectedDesignId !== 'custom' && size) {
      const selected = catalogue.find(item => item.id === selectedDesignId);
      if (selected && selected.sizePrices && selected.sizePrices[size]) {
        const customPrice = selected.sizePrices[size];
        setPrice(customPrice.toString());
        setDeposit((customPrice / 2).toString());
      }
    }
  };

  const autofillTemplate = () => {
    setCustomerName("คุณมัสยา มีสุข");
    setCustomerPhone("086-555-1234");
    setCustomerSocial("Line: massy_me");
    setCustomerCategory("IDD");
    setMembershipTier("PRIME");
    setFabricColor("Burgundy Deep Red");
    setChest("34");
    setWaist("26");
    setHips("37");
    setShoulder("15");
    setSleeveLength("22");
    setArmhole("15");
    setLength("56");
    setNeck("13.5");
    setHeight("163");
    setWeight("52");
    setFrontChest("13.5");
    setBackChest("14");
    setFrontLength("14.5");
    setBackLength("15.5");
    setWrist("6.5");
    setPrice("4500");
    setDeposit("2250");
    setDeliveryDate("2026-07-25");
    setNotes("ต้องการซับในหนานุ่มพิเศษ และผ่าปลายแขนใส่กระดุมปั๊มทอง");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-8 text-center animate-pulse flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-serif font-bold">บันทึกออเดอร์สำเร็จ!</h3>
          <p className="text-sm">ออเดอร์หมายเลข <span className="font-mono font-bold text-lg">{nextOrderNumber}</span> ได้รับการบันทึกเข้าระบบแล้ว</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex justify-between items-center bg-natural-sand p-4 rounded-2xl border border-natural-wheat">
            <div className="flex items-center space-x-3">
              <span className="bg-natural-espresso text-natural-cream font-mono text-sm px-3 py-1.5 rounded-lg font-bold">
                {nextOrderNumber}
              </span>
              <div>
                <p className="text-xs text-natural-espresso/60 font-medium">รหัสออเดอร์ใหม่ถัดไป</p>
                <p className="text-sm font-semibold text-natural-espresso">ระบบจะระบุเลขนี้โดยอัตโนมัติ</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={autofillTemplate}
              className="text-xs bg-natural-wheat hover:bg-natural-wheat/80 text-natural-espresso py-1.5 px-3 rounded-lg transition-all font-medium cursor-pointer"
            >
              🪄 ใช้ข้อมูลตัวอย่างด่วน
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1: ข้อมูลลูกค้า */}
            <div className="bg-white p-6 rounded-2xl border border-natural-wheat shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-3">
                <div className="p-1.5 bg-natural-sand rounded-lg text-natural-espresso">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso">1. ข้อมูลลูกค้า (Customer Info)</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-natural-espresso/70 mb-1">สาขาที่รับออเดอร์ <span className="text-natural-clay">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['สาขานราธิวาส', 'สาขายะลา', 'สาขาปัตตานี', 'สาขาหาดใหญ่'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBranch(b)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          branch === b
                            ? 'bg-natural-clay text-white border-natural-clay shadow-xs'
                            : 'bg-natural-cream/20 hover:bg-natural-sand text-natural-espresso border-natural-wheat'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ชื่อลูกค้า <span className="text-natural-clay">*</span></label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="เช่น คุณอาลีญา มะหมัด"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                  />
                  {errors.customerName && <p className="text-xs text-rose-500 mt-1">{errors.customerName}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-natural-espresso/70 mb-1">เบอร์โทรศัพท์ <span className="text-natural-clay">*</span></label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="08X-XXX-XXXX"
                      className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                    />
                    {errors.customerPhone && <p className="text-xs text-rose-500 mt-1">{errors.customerPhone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ช่องทางติดต่อโซเชียล</label>
                    <input
                      type="text"
                      value={customerSocial}
                      onChange={(e) => setCustomerSocial(e.target.value)}
                      placeholder="เช่น IG, Line id"
                      className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-natural-espresso/70 mb-1">LINE User ID (สำหรับเปิดแชท/ส่งข้อความโดยตรง)</label>
                  <input
                    type="text"
                    value={lineUserId}
                    onChange={(e) => setLineUserId(e.target.value)}
                    placeholder="เช่น U1234567890abcdef1234567890abcdef"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20 font-mono"
                  />
                  <p className="text-[10px] text-natural-espresso/50 mt-1.5 leading-relaxed bg-natural-sand/30 p-2 rounded-lg border border-natural-wheat/30">
                    💡 <strong>รหัสนี้คืออะไร?</strong> คือรหัสเฉพาะใน LINE สำหรับลิงก์ไปหน้าแชทคนนี้โดยตรง คุณสามารถได้รหัสนี้มา 2 วิธี:<br />
                    1. <strong>อัตโนมัติ:</strong> เพียงให้ลูกค้าแชทพิมพ์เบอร์โทรหรือเลขที่ออเดอร์ใน LINE ร้าน ระบบจะดึงรหัสนี้มาบันทึกให้เองทันที!<br />
                    2. <strong>คัดลอกมาวางเอง:</strong> เมื่อคุณคุยกับลูกค้าบนเบราว์เซอร์ ให้ก๊อปรหัสตัว "U" หลังคำว่า <code className="bg-white/80 px-1 font-mono text-[9px]">/user/</code> ในช่อง Address bar ด้านบน มาวางที่นี่ได้เลยค่ะ
                  </p>
                </div>



                {/* ประเภทงาน */}
                <div className="pt-1">
                  <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ประเภทงาน (Job Type)</label>
                  <div className="grid grid-cols-3 gap-1.5 max-w-xs">
                    {['IDD', 'IDH', 'ทั่วไป'].map((cat) => {
                      const isSelected = customerCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCustomerCategory(cat)}
                          className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                            isSelected
                              ? 'bg-natural-clay text-white border-natural-clay'
                              : 'bg-white hover:bg-natural-sand/20 text-natural-espresso/80 border-natural-wheat'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ประเภทบัตรสมาชิก */}
                <div className="pt-2 border-t border-natural-sand/30">
                  <label className="block text-xs font-medium text-natural-espresso/70 mb-1.5">ประเภทบัตรสมาชิก (Membership Card Type)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'PRIME', label: '1. PRIME' },
                      { id: 'PRIVILEGE', label: '2. PRIVILEGE' },
                      { id: 'TRADER', label: '3. TRADER' },
                      { id: 'MEMBER', label: '4. MEMBER' }
                    ] as const).map((tier) => {
                      const isSelected = membershipTier === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setMembershipTier(tier.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border flex items-center justify-between ${
                            isSelected
                              ? 'bg-natural-clay text-white border-natural-clay'
                              : 'bg-white hover:bg-natural-sand/20 text-natural-espresso/80 border-natural-wheat'
                          }`}
                        >
                          <span>{tier.label}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-white text-natural-clay border-white' : 'border-natural-wheat bg-natural-sand/20'
                          }`}>
                            {isSelected && <Check className="h-2.5 w-2.5 stroke-[4]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: การเลือกแบบชุด */}
            <div className="bg-white p-6 rounded-2xl border border-natural-wheat shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-3">
                <div className="p-1.5 bg-natural-sand rounded-lg text-natural-espresso">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso">2. เลือกแบบชุดเสนอลูกค้า (Design)</h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-natural-espresso/70 mb-1">รูปแบบดีไซน์พื้นฐาน</label>
                    <select
                      value={selectedDesignId}
                      onChange={(e) => handleSelectDesign(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                    >
                      <option value="custom">✨ ออกแบบใหม่ (Custom Tailoring)</option>
                      {catalogue.map((item) => (
                        <option key={item.id} value={item.id}>
                          🏷️ {item.name} ({item.category}) {item.sku ? `[${item.sku}]` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-natural-espresso/70 mb-1 flex items-center space-x-1">
                      <span>รหัสสินค้า / SKU</span>
                      <span className="text-[10px] text-natural-clay font-bold">(ดึงอัตโนมัติ/ระบุเพิ่ม)</span>
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="เช่น NNH-MKB-06"
                      className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20 font-mono uppercase font-bold text-natural-clay"
                    />
                  </div>
                </div>

                {selectedDesignId === 'custom' ? (
                  <div className="bg-natural-sand/30 p-3 rounded-xl border border-natural-wheat grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-natural-espresso/60 mb-1 uppercase">ทรงเสื้อผ้า (Silhouette)</label>
                      <select 
                        value={silhouette} 
                        onChange={(e) => setSilhouette(e.target.value)}
                        className="w-full px-1 py-1 rounded bg-white border border-natural-wheat text-natural-espresso"
                      >
                        <option>A-Line (บานเล็กน้อย)</option>
                        <option>Princess (บานอลังการ)</option>
                        <option>Column (ตรงเรียบหรู)</option>
                        <option>Mermaid (หางปลาเข้ารูป)</option>
                        <option>Fitted (ทรงสอบสกินนี่)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-espresso/60 mb-1 uppercase">สไตล์คอ (Neckline)</label>
                      <select 
                        value={neckline} 
                        onChange={(e) => setNeckline(e.target.value)}
                        className="w-full px-1 py-1 rounded bg-white border border-natural-wheat text-natural-espresso"
                      >
                        <option>V-Neck (คอวี)</option>
                        <option>Round (คอกลม)</option>
                        <option>Sweetheart (คอหัวใจ)</option>
                        <option>Off-shoulder (ปาดไหล่)</option>
                        <option>High Neck (คอจีน/คอตั้ง)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-espresso/60 mb-1 uppercase">แขนเสื้อ (Sleeves)</label>
                      <select 
                        value={sleeves} 
                        onChange={(e) => setSleeves(e.target.value)}
                        className="w-full px-1 py-1 rounded bg-white border border-natural-wheat text-natural-espresso"
                      >
                        <option>Sleeveless (แขนกุด)</option>
                        <option>Puff (แขนพองตุ๊กตา)</option>
                        <option>Long Sleeves (แขนกระบอกยาว)</option>
                        <option>Bell (แขนกระดิ่งระบาย)</option>
                        <option>Short (แขนสั้นสไตล์เรียบร้อย)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const matchedItem = catalogue.find(i => i.id === selectedDesignId);
                    if (!matchedItem) return null;
                    return (
                      <div className="bg-natural-sand/20 p-4 rounded-xl border border-natural-wheat text-xs text-natural-espresso space-y-3">
                        <div className="flex gap-3">
                          <img 
                            src={matchedItem.image} 
                            alt={matchedItem.name} 
                            className="h-20 w-20 object-cover rounded-lg border border-natural-wheat bg-white shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-serif font-bold text-natural-espresso text-sm">{matchedItem.name}</span>
                              <span className="text-[10px] bg-natural-espresso text-natural-cream px-1.5 py-0.5 rounded-full font-bold">{matchedItem.category}</span>
                            </div>
                            <p className="text-natural-espresso/80 text-[11px] leading-relaxed line-clamp-2">
                              {matchedItem.description}
                            </p>
                            <div className="text-[10px] text-natural-espresso/60 flex flex-wrap gap-x-2">
                              <span>🧵 ผ้าที่แนะนำ: <strong className="font-semibold text-natural-espresso">{matchedItem.fabricRecommend}</strong></span>
                              <span>|</span>
                              <span>💰 ราคาประเมิน: <strong className="font-semibold text-natural-espresso">{matchedItem.priceRange}</strong></span>
                            </div>
                          </div>
                        </div>
                        {matchedItem.features && matchedItem.features.length > 0 && (
                          <div className="pt-2 border-t border-natural-sand/50">
                            <p className="text-[10px] font-bold text-natural-espresso/60 uppercase mb-1">จุดเด่น / รายละเอียดดีไซน์หลัก:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {matchedItem.features.map((feat, i) => (
                                <span key={i} className="bg-white/85 text-natural-espresso px-2 py-0.5 rounded-md border border-natural-wheat/40 text-[10px]">
                                  ✨ {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {matchedItem.sizes && matchedItem.sizes.length > 0 && (
                          <div className="pt-2 border-t border-natural-sand/50">
                            <p className="text-[10px] font-bold text-natural-clay uppercase mb-1 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-natural-ochre" />
                              <span>เลือกขนาดที่แนะนำด่วน (คลิกสั่งไซส์มาตรฐานทันที):</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {matchedItem.sizes.map((sz, i) => {
                                const isSelected = selectedSize === sz;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSizeChange(sz)}
                                    className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-natural-clay text-white border-natural-clay shadow-xs'
                                        : 'bg-white hover:bg-natural-sand/20 text-natural-espresso border-natural-wheat'
                                    }`}
                                  >
                                    <span>ไซส์ {sz}</span>
                                    {isSelected && <Check className="h-3 w-3" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ประเภทชุดตัดเย็บ</label>
                    <select
                      value={dressType}
                      onChange={(e) => setDressType(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                    >
                      <option value="เดรสราตรี">เดรสราตรีออกงาน</option>
                      <option value="อาบายะห์">อาบายะห์ (Abaya)</option>
                      <option value="จั๊มสูท">จั๊มสูท (Jumpsuit)</option>
                      <option value="เดรสสั้น">เดรสสั้น (Short Dress)</option>
                      <option value="ชุดทำงาน">ชุดทำงาน / สูทสุภาพ</option>
                      <option value="ชุดไทย">ชุดไทยประยุกต์</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                    {dressType === 'อื่นๆ' && (
                      <input
                        type="text"
                        required
                        value={customDressType}
                        onChange={(e) => setCustomDressType(e.target.value)}
                        placeholder="ระบุประเภทชุด"
                        className="w-full text-xs mt-1.5 px-3 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-white"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ชนิดเนื้อผ้า</label>
                    <select
                      value={fabricType}
                      onChange={(e) => setFabricType(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                    >
                      <option value="Heavy Premium Satin">Heavy Premium Satin</option>
                      <option value="Premium Silk Crepe">Premium Silk Crepe</option>
                      <option value="French Chantilly Lace">French Chantilly Lace</option>
                      <option value="Italian Wool Blend">Italian Wool Blend</option>
                      <option value="Luminous Organza">Luminous Organza</option>
                      <option value="ผ้าลินินธรรมชาติ">ผ้าลินินธรรมชาติ (Linen)</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                    {fabricType === 'อื่นๆ' && (
                      <input
                        type="text"
                        required
                        value={customFabricType}
                        onChange={(e) => setCustomFabricType(e.target.value)}
                        placeholder="ระบุชนิดผ้า"
                        className="w-full text-xs mt-1.5 px-3 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-white"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-natural-espresso/70 mb-1">รหัสสี / สีผ้าที่ต้องการ</label>
                  <input
                    type="text"
                    value={fabricColor}
                    onChange={(e) => setFabricColor(e.target.value)}
                    placeholder="เช่น กรมท่าเข้ม, นู้ดชมพูอ่อน, แดงเบอร์กันดี"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                  />
                </div>

                {/* อัปโหลดรูปภาพที่ลูกค้าจะสั่งตัด */}
                <div className="pt-3 border-t border-natural-sand/55">
                  <label className="block text-xs font-bold text-natural-espresso/80 mb-2 flex items-center space-x-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-natural-clay" />
                    <span>แนบรูปภาพแบบชุดสั่งตัด (Design Reference Photo)</span>
                  </label>
                  
                  {customImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/10 p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={customImage} 
                          alt="Custom Design Reference" 
                          className="h-14 w-14 object-cover rounded-lg border border-natural-wheat shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-natural-espresso">แนบรูปภาพอ้างอิงเรียบร้อย ✓</p>
                          <p className="text-[10px] text-natural-espresso/50">รูปภาพจะถูกบันทึกและแสดงในประวัติออเดอร์</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomImage('')}
                        className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all cursor-pointer mr-1"
                        title="ลบรูปภาพ"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-natural-wheat hover:border-natural-clay/40 rounded-xl p-4 transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="คลิกหรือลากรูปภาพมาวางที่นี่"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <UploadCloud className="h-7 w-7 text-natural-clay/75" />
                        <p className="text-xs font-bold text-natural-espresso">คลิก หรือลากไฟล์ภาพแบบที่ต้องการมาวาง</p>
                        <p className="text-[10px] text-natural-espresso/40 font-medium">รองรับ JPG, PNG, WEBP (แปลงเก็บอัตโนมัติ)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* CARD 3: ตารางสัดส่วนวัดตัว (Measurements) */}
          <div className="bg-white p-6 rounded-2xl border border-natural-wheat shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-natural-sand pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-natural-sand rounded-lg text-natural-espresso">
                  <Ruler className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso">3. ตารางวัดตัวสัดส่วนลูกค้า (Measurements in inches)</h3>
              </div>
              <span className="text-[10px] bg-natural-sand text-natural-espresso/70 px-2 py-1 rounded font-bold uppercase">
                หน่วย: นิ้ว (Inches)
              </span>
            </div>

            {/* เลือกไซส์มาตรฐาน */}
            <div className="bg-natural-sand/20 p-4 rounded-xl border border-natural-wheat/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-natural-espresso flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-natural-ochre" />
                    <span>เลือกไซส์มาตรฐาน (Standard Size Preset)</span>
                  </h4>
                  <p className="text-[10px] text-natural-espresso/60">
                    เลือกไซส์มาตรฐานเพื่อกรอกข้อมูลสัดส่วนโดยอัตโนมัติ (สามารถปรับสัดส่วนหลวม/แน่น เพิ่มได้ทีละช่องหลังจากกด)
                  </p>
                </div>
                <span className="text-[10px] bg-natural-clay/10 text-natural-clay border border-natural-clay/20 px-2.5 py-0.5 rounded-full font-bold">
                  ตาราง SIZE มาตรฐาน NUNUH 👗
                </span>
              </div>

              {/* ปุ่มเลือกไซส์ */}
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const matchedItem = selectedDesignId !== 'custom' ? catalogue.find(item => item.id === selectedDesignId) : null;
                  return Object.keys(STANDARD_SIZE_CHART).map((size) => {
                    const isSelected = selectedSize === size;
                    const isRecommended = matchedItem && matchedItem.sizes ? matchedItem.sizes.includes(size) : false;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        className={`px-3 py-1.5 text-xs font-serif font-bold rounded-lg transition-all cursor-pointer flex flex-col items-center min-w-[55px] border relative ${
                          isSelected
                            ? 'bg-natural-clay text-white border-natural-clay shadow-xs'
                            : isRecommended
                              ? 'bg-natural-ochre/5 hover:bg-natural-ochre/15 text-natural-espresso border-natural-ochre/40'
                              : 'bg-white hover:bg-natural-sand/40 text-natural-espresso border-natural-wheat hover:border-natural-clay/30'
                        }`}
                      >
                        <span className="text-xs flex items-center gap-0.5">
                          {size}
                          {isRecommended && (
                            <span className="text-[8px] bg-natural-ochre text-white px-0.5 py-px rounded-xs leading-none font-sans" title="ไซส์ตรงปกแบบชุดนี้">
                              ★
                            </span>
                          )}
                        </span>
                        <span className={`text-[9px] mt-0.5 font-sans font-medium ${isSelected ? 'text-white/80' : isRecommended ? 'text-natural-ochre' : 'text-natural-espresso/45'}`}>
                          อก {STANDARD_SIZE_CHART[size].chest}"
                        </span>
                      </button>
                    );
                  });
                })()}
                <button
                  type="button"
                  onClick={() => handleSizeChange('')}
                  className={`px-3 py-1 text-xs font-serif font-bold rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center min-w-[55px] border ${
                    !selectedSize
                      ? 'bg-natural-clay text-white border-natural-clay shadow-xs'
                      : 'bg-white hover:bg-natural-sand/40 text-natural-espresso border-natural-wheat hover:border-natural-clay/30'
                  }`}
                >
                  <span className="text-xs">CUSTOM</span>
                  <span className={`text-[9px] mt-0.5 font-sans font-medium ${!selectedSize ? 'text-white/80' : 'text-natural-espresso/45'}`}>
                    วัดตัวพิเศษ
                  </span>
                </button>
              </div>

              {/* ตารางเปรียบเทียบด่วน */}
              <div className="overflow-x-auto rounded-lg border border-natural-wheat bg-white text-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-natural-sand/40 text-natural-espresso font-bold border-b border-natural-wheat">
                      <th className="p-1.5 text-center font-serif">ไซส์</th>
                      <th className="p-1.5 text-center">รอบอก (Chest)</th>
                      <th className="p-1.5 text-center">รอบเอว (Waist)</th>
                      <th className="p-1.5 text-center">สะโพก (Hips)</th>
                      <th className="p-1.5 text-center">ไหล่ (Shoulder)</th>
                      <th className="p-1.5 text-center">แขนยาว (Sleeve)</th>
                      <th className="p-1.5 text-center">ชุดยาว (Length)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(STANDARD_SIZE_CHART).map(([size, config]) => (
                      <tr 
                        key={size} 
                        onClick={() => handleSizeChange(size)}
                        className={`border-b border-natural-sand/50 hover:bg-natural-sand/15 transition-colors cursor-pointer text-center ${
                          selectedSize === size ? 'bg-natural-clay/5 font-bold text-natural-clay' : 'text-natural-espresso/85'
                        }`}
                      >
                        <td className="p-1 text-center font-serif font-bold bg-natural-sand/10 border-r border-natural-sand/50">{size}</td>
                        <td className="p-1">{config.chest}"</td>
                        <td className="p-1">{config.waist}"</td>
                        <td className="p-1">{config.hips}"</td>
                        <td className="p-1">{config.shoulder}"</td>
                        <td className="p-1">{config.sleeveLength}"</td>
                        <td className="p-1">{config.length}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* คำอธิบายเรื่องหน่วยวัดตัว */}
            <div className="bg-natural-sand/20 border border-natural-wheat/60 p-3 rounded-xl text-xs text-natural-espresso/80 space-y-1">
              <p className="font-bold text-natural-clay flex items-center gap-1.5">
                <Ruler className="h-4 w-4" />
                <span>คำชี้แจงเกี่ยวกับหน่วยวัดสัดส่วน (Measurement Unit Guidelines):</span>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                <li>
                  <span className="font-semibold text-natural-espresso">ตารางไซส์มาตรฐาน (ตารางด้านบน):</span> อ้างอิงและแสดงขนาดเป็นหน่วย <strong className="text-natural-clay font-bold">นิ้ว (″)</strong> ตามมาตรฐานชุดสำเร็จรูป
                </li>
                <li>
                  <span className="font-semibold text-natural-espresso">ช่องกรอกข้อมูลสัดส่วนเฉพาะบุคคล (ช่องกรอกด้านล่าง):</span> กรณีท่านระบุสัดส่วนที่ <strong className="text-natural-clay font-bold">วัดตัวด้วยตนเอง (Custom)</strong> กรุณากรอกตัวเลขโดยใช้หน่วยเป็น <strong className="text-natural-clay font-bold">เซนติเมตร (ซม.)</strong> เพื่อความละเอียดสูงสุดในการตัดเย็บ
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">รอบอก (Chest)</label>
                <input
                  type="text"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  placeholder="เช่น 86"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">รอบเอว (Waist)</label>
                <input
                  type="text"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="เช่น 76"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">สะโพก (Hips)</label>
                <input
                  type="text"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  placeholder="เช่น 97"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ไหล่กว้าง (Shoulder)</label>
                <input
                  type="text"
                  value={shoulder}
                  onChange={(e) => setShoulder(e.target.value)}
                  placeholder="เช่น 38"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ความยาวแขน (Sleeve)</label>
                <input
                  type="text"
                  value={sleeveLength}
                  onChange={(e) => setSleeveLength(e.target.value)}
                  placeholder="เช่น 56"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">วงแขน (Armhole)</label>
                <input
                  type="text"
                  value={armhole}
                  onChange={(e) => setArmhole(e.target.value)}
                  placeholder="เช่น 38"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ความยาวชุด (Length)</label>
                <input
                  type="text"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="เช่น 137"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ส่วนสูง ซม. (Height)</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="เช่น 160"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">น้ำหนัก กก. (Weight)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="เช่น 52"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">บ่าหน้า (Front Chest)</label>
                <input
                  type="text"
                  value={frontChest}
                  onChange={(e) => setFrontChest(e.target.value)}
                  placeholder="เช่น 34"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">บ่าหลัง (Back Chest)</label>
                <input
                  type="text"
                  value={backChest}
                  onChange={(e) => setBackChest(e.target.value)}
                  placeholder="เช่น 36"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ยาวหน้า (Front Length)</label>
                <input
                  type="text"
                  value={frontLength}
                  onChange={(e) => setFrontLength(e.target.value)}
                  placeholder="เช่น 35"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ยาวหลัง (Back Length)</label>
                <input
                  type="text"
                  value={backLength}
                  onChange={(e) => setBackLength(e.target.value)}
                  placeholder="เช่น 38"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-natural-espresso/60 mb-1">ข้อมือ (Wrist)</label>
                <input
                  type="text"
                  value={wrist}
                  onChange={(e) => setWrist(e.target.value)}
                  placeholder="เช่น 15"
                  className="w-full text-center text-sm px-2 py-1.5 rounded-lg border border-natural-wheat bg-natural-cream/20 focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-medium text-natural-espresso/40 mb-1">เก็บค่าข้อมูลย่อย</label>
                <span className="text-xs text-natural-espresso/50 block pt-2 text-center font-medium">กรอกเสร็จในตารางย่อย</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-natural-espresso/70 mb-1">รายละเอียดการวัดตัวและสัดส่วนเพิ่มเติม</label>
              <textarea
                value={otherNotes}
                onChange={(e) => setOtherNotes(e.target.value)}
                placeholder="เช่น ต้องการเสริมฟองน้ำบริเวณหน้าอก, ไหล่เอียงขวาเล็กน้อย, ต้องการปรับสัดส่วนหลวมหน้าท้องเพื่อใส่คลุมสบาย..."
                rows={2}
                className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
              />
            </div>

            {/* รูปถ่ายสัดส่วนลูกค้า (ด้านหน้า, ด้านข้าง, ด้านหลัง) */}
            <div className="pt-4 border-t border-natural-sand/55 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-natural-espresso flex items-center space-x-1.5" id="customer-photos-label">
                  <ImageIcon className="h-3.5 w-3.5 text-natural-clay" />
                  <span>รูปถ่ายหุ่น/สัดส่วนลูกค้า (Customer Body Photos)</span>
                </h4>
                <p className="text-[10px] text-natural-espresso/60">
                  แนบรูปถ่ายลูกค้าเพื่อช่วยประกอบการพิจารณาสรีระในการขึ้นแพทเทิร์นของช่างให้สมบูรณ์แบบที่สุด (ด้านหน้า, ด้านข้าง, ด้านหลัง)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* ด้านหน้า */}
                <div className="space-y-1.5" id="photo-front-container">
                  <span className="text-[11px] font-bold text-natural-espresso/70 block">📸 ภาพถ่ายลูกค้า ด้านหน้า</span>
                  {customerPhotoFront ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/10 p-1.5 flex items-center justify-between">
                      <img 
                        src={customerPhotoFront} 
                        alt="Front View" 
                        className="h-16 w-16 object-cover rounded-lg border border-natural-wheat shadow-xs"
                      />
                      <span className="text-[10px] text-emerald-700 font-bold ml-1">ด้านหน้าเรียบร้อย ✓</span>
                      <button
                        type="button"
                        onClick={() => setCustomerPhotoFront('')}
                        className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all cursor-pointer mr-1"
                        title="ลบรูปภาพ"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border border-dashed border-natural-wheat hover:border-natural-clay/40 rounded-xl p-3 transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center flex flex-col items-center justify-center h-[74px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomerPhotoFront(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="อัปโหลดรูปด้านหน้า"
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/70 mb-1" />
                      <span className="text-[10px] font-bold text-natural-espresso/80">อัปโหลดภาพ ด้านหน้า</span>
                    </div>
                  )}
                </div>

                {/* ด้านข้าง */}
                <div className="space-y-1.5" id="photo-side-container">
                  <span className="text-[11px] font-bold text-natural-espresso/70 block">📸 ภาพถ่ายลูกค้า ด้านข้าง</span>
                  {customerPhotoSide ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/10 p-1.5 flex items-center justify-between">
                      <img 
                        src={customerPhotoSide} 
                        alt="Side View" 
                        className="h-16 w-16 object-cover rounded-lg border border-natural-wheat shadow-xs"
                      />
                      <span className="text-[10px] text-emerald-700 font-bold ml-1">ด้านข้างเรียบร้อย ✓</span>
                      <button
                        type="button"
                        onClick={() => setCustomerPhotoSide('')}
                        className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all cursor-pointer mr-1"
                        title="ลบรูปภาพ"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border border-dashed border-natural-wheat hover:border-natural-clay/40 rounded-xl p-3 transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center flex flex-col items-center justify-center h-[74px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomerPhotoSide(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="อัปโหลดรูปด้านข้าง"
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/70 mb-1" />
                      <span className="text-[10px] font-bold text-natural-espresso/80">อัปโหลดภาพ ด้านข้าง</span>
                    </div>
                  )}
                </div>

                {/* ด้านหลัง */}
                <div className="space-y-1.5" id="photo-back-container">
                  <span className="text-[11px] font-bold text-natural-espresso/70 block">📸 ภาพถ่ายลูกค้า ด้านหลัง</span>
                  {customerPhotoBack ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/10 p-1.5 flex items-center justify-between">
                      <img 
                        src={customerPhotoBack} 
                        alt="Back View" 
                        className="h-16 w-16 object-cover rounded-lg border border-natural-wheat shadow-xs"
                      />
                      <span className="text-[10px] text-emerald-700 font-bold ml-1">ด้านหลังเรียบร้อย ✓</span>
                      <button
                        type="button"
                        onClick={() => setCustomerPhotoBack('')}
                        className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all cursor-pointer mr-1"
                        title="ลบรูปภาพ"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border border-dashed border-natural-wheat hover:border-natural-clay/40 rounded-xl p-3 transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center flex flex-col items-center justify-center h-[74px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomerPhotoBack(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="อัปโหลดรูปด้านหลัง"
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/70 mb-1" />
                      <span className="text-[10px] font-bold text-natural-espresso/80">อัปโหลดภาพ ด้านหลัง</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: ข้อมูลราคาและการจัดส่ง */}
          <div className="bg-white p-6 rounded-2xl border border-natural-wheat shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-natural-sand pb-3">
              <div className="p-1.5 bg-natural-sand rounded-lg text-natural-espresso">
                <CreditCard className="h-4 w-4" />
              </div>
              <h3 className="font-serif font-bold text-natural-espresso">4. ข้อมูลการเงิน และวันกำหนดส่งชุด (Pricing & Delivery)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ราคาค่าชุดรวมทั้งหมด (บาท) <span className="text-natural-clay">*</span></label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    // auto deposit 50%
                    if (e.target.value) {
                      setDeposit((parseInt(e.target.value) / 2).toString());
                    } else {
                      setDeposit('');
                    }
                  }}
                  placeholder="เช่น 4500"
                  className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                />
                {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-natural-espresso/70 mb-1">จำนวนเงินมัดจำ (บาท) <span className="text-natural-clay">*</span></label>
                <input
                  type="number"
                  required
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="มัดจำ 50% หรือระบุจำนวน"
                  className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                />
                {errors.deposit && <p className="text-xs text-rose-500 mt-1">{errors.deposit}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-natural-espresso/70 mb-1">ส่วนลดพิเศษ (บาท)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="ระบุส่วนลด (ถ้ามี)"
                  className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-natural-espresso/70 mb-1">กำหนดส่งชุดให้ลูกค้า <span className="text-natural-clay">*</span></label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
                />
                {errors.deliveryDate && <p className="text-xs text-rose-500 mt-1">{errors.deliveryDate}</p>}
              </div>
            </div>

            {/* ช่องทางการรับเงิน (Payment Method) */}
            <div className="pt-4 border-t border-natural-sand/40">
              <label className="block text-xs font-bold text-natural-espresso/80 mb-2">ช่องทางการรับเงิน / ชำระเงิน (Payment Method) <span className="text-natural-clay">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'เงินโอน', label: 'เงินโอน (Bank Transfer)', desc: 'โอนผ่านบัญชีธนาคาร/QR' },
                  { id: 'เงินสด', label: 'เงินสด (Cash)', desc: 'ชำระหน้าร้านด้วยเงินสด' },
                  { id: 'บัตรเครดิต', label: 'บัตรเครดิต (Credit Card)', desc: 'ชำระด้วยบัตร/รูดบัตร' }
                ].map((item) => {
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      className={`relative flex flex-col p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-natural-clay bg-natural-sand/20 shadow-xs' 
                          : 'border-natural-wheat hover:border-natural-clay/40 bg-natural-cream/5 hover:bg-natural-sand/10'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${isSelected ? 'text-natural-espresso' : 'text-natural-espresso/70'}`}>
                          {item.label}
                        </span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-natural-clay bg-natural-clay text-white' : 'border-natural-wheat bg-white'
                        }`}>
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-[10px] text-natural-espresso/50 mt-1 block">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* แนบสลิปชำระเงิน */}
            <div className="pt-4 border-t border-natural-sand/40">
              <label className="block text-xs font-bold text-natural-espresso/80 mb-2 flex items-center space-x-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-natural-clay" />
                <span>แนบหลักฐานสลิปการโอนเงิน (Payment Slip Upload)</span>
              </label>

              {slipImage ? (
                <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/10 p-2 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={slipImage} 
                      alt="Payment Slip Reference" 
                      className="h-16 w-12 object-contain bg-white rounded-lg border border-natural-wheat shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-bold text-natural-espresso">แนบสลิปสำเร็จแล้ว ✓</p>
                      <p className="text-[10px] text-natural-espresso/50">หลักฐานการชำระเงินนี้จะแนบไปกับออเดอร์</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlipImage('')}
                    className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all cursor-pointer mr-1"
                    title="ลบสลิป"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-natural-wheat hover:border-natural-clay/40 rounded-xl p-4 transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSlipImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="คลิกหรือลากไฟล์สลิปมาวางที่นี่"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <UploadCloud className="h-7 w-7 text-natural-clay/75" />
                    <p className="text-xs font-bold text-natural-espresso">คลิก หรือลากไฟล์สลิปการโอนเงินมาวางที่นี่</p>
                    <p className="text-[10px] text-natural-espresso/40 font-medium">รองรับรูปถ่ายสลิปทุกประเภท JPG, PNG, WEBP</p>
                  </div>
                </div>
              )}
            </div>

            {/* กล่องแสดงยอดสุทธิหลังหักมัดจำ */}
            {(price || deposit || discount) && (
              <div className="bg-natural-sand/20 p-4 rounded-xl border border-natural-wheat/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-natural-espresso">📊 สรุปยอดเงินคงเหลือสุทธิ (Net Balance Summary)</p>
                  <p className="text-[10px] text-natural-espresso/60">ยอดคงเหลือสุทธิที่ลูกค้าต้องชำระเพิ่มในวันรับชุด</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs w-full sm:w-auto justify-end">
                  <div className="bg-white px-2.5 py-1.5 rounded-lg border border-natural-wheat/40 text-center min-w-[80px] flex-1 sm:flex-initial">
                    <span className="block text-[9px] text-natural-espresso/45 font-bold uppercase">ราคาค่าชุด</span>
                    <strong className="text-xs text-natural-espresso font-mono font-extrabold">{(parseFloat(price) || 0).toLocaleString()} ฿</strong>
                  </div>
                  {parseFloat(discount) > 0 && (
                    <div className="bg-white px-2.5 py-1.5 rounded-lg border border-natural-wheat/40 text-center min-w-[80px] flex-1 sm:flex-initial">
                      <span className="block text-[9px] text-amber-600 font-bold uppercase">ส่วนลด</span>
                      <strong className="text-xs text-amber-600 font-mono font-extrabold">-{(parseFloat(discount) || 0).toLocaleString()} ฿</strong>
                    </div>
                  )}
                  <div className="bg-white px-2.5 py-1.5 rounded-lg border border-natural-wheat/40 text-center min-w-[80px] flex-1 sm:flex-initial">
                    <span className="block text-[9px] text-natural-clay/70 font-bold uppercase">หักค่ามัดจำ</span>
                    <strong className="text-xs text-natural-clay font-mono font-extrabold">-{(parseFloat(deposit) || 0).toLocaleString()} ฿</strong>
                  </div>
                  <div className="bg-natural-clay text-white px-3 py-1.5 rounded-lg text-center min-w-[110px] flex-1 sm:flex-initial shadow-xs">
                    <span className="block text-[9px] text-white/75 font-bold uppercase">คงเหลือวันรับชุด</span>
                    <strong className="text-xs font-mono font-extrabold">{Math.max(0, (parseFloat(price) || 0) - (parseFloat(deposit) || 0) - (parseFloat(discount) || 0)).toLocaleString()} ฿</strong>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-natural-espresso/70 mb-1">บันทึกเพิ่มเติมของดีไซเนอร์ / ช่างเย็บผ้า (Internal Notes)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="เช่น ลูกค้านัดขอรับเองที่หน้าร้าน, ซับในสีเดียวกับผ้าไหมนอก, มีสายรวบเอวสำรองให้ 1 เส้น..."
                className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-natural-clay hover:bg-natural-clay-dark text-white font-serif font-semibold text-sm py-3.5 px-8 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>บันทึกและออกรหัสออเดอร์</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
