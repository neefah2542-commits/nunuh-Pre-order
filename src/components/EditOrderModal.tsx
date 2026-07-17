/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Measurements, STATUS_MAP, STANDARD_SIZE_CHART } from '../types';
import { X, Save, User, Sparkles, Ruler, CreditCard, Image as ImageIcon, UploadCloud, Check } from 'lucide-react';

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
}

export default function EditOrderModal({ order, onClose, onSave }: EditOrderModalProps) {
  // Customer info states
  const [customerName, setCustomerName] = useState(order.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone || '');
  const [customerSocial, setCustomerSocial] = useState(order.customerSocial || '');
  const [customerCategory, setCustomerCategory] = useState(order.customerCategory || 'ทั่วไป');
  const [membershipTier, setMembershipTier] = useState<'PRIME' | 'PRIVILEGE' | 'TRADER' | 'MEMBER'>(order.membershipTier || 'MEMBER');
  const [externalOrderId, setExternalOrderId] = useState(order.externalOrderId || '');

  // Dress specification states
  const [dressType, setDressType] = useState(order.dressType || 'เดรสราตรี');
  const [fabricType, setFabricType] = useState(order.fabricType || 'Heavy Premium Satin');
  const [fabricColor, setFabricColor] = useState(order.fabricColor || '');
  const [sku, setSku] = useState(order.sku || '');
  const [notes, setNotes] = useState(order.notes || '');

  // Pricing & Date states
  const [price, setPrice] = useState(order.price.toString());
  const [discount, setDiscount] = useState((order.discount || 0).toString());
  const [deposit, setDeposit] = useState(order.deposit.toString());
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || 'เงินโอน');
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate || '');
  const [status, setStatus] = useState<OrderStatus>(order.status || OrderStatus.RECEIVED);
  const [branch, setBranch] = useState(order.branch || 'สาขานราธิวาส');

  // Measurements states
  const [chest, setChest] = useState(order.measurements.chest || '');
  const [waist, setWaist] = useState(order.measurements.waist || '');
  const [hips, setHips] = useState(order.measurements.hips || '');
  const [shoulder, setShoulder] = useState(order.measurements.shoulder || '');
  const [sleeveLength, setSleeveLength] = useState(order.measurements.sleeveLength || '');
  const [armhole, setArmhole] = useState(order.measurements.armhole || '');
  const [length, setLength] = useState(order.measurements.length || '');
  const [neck, setNeck] = useState(order.measurements.neck || '');
  const [height, setHeight] = useState((order.measurements.height || '').toString());
  const [weight, setWeight] = useState((order.measurements.weight || '').toString());
  const [otherNotes, setOtherNotes] = useState(order.measurements.otherNotes || '');
  const [selectedSize, setSelectedSize] = useState<string>(order.measurements.standardSize || '');

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
  };

  // Image states
  const [customImage, setCustomImage] = useState(order.customImage || '');
  const [customerPhotoFront, setCustomerPhotoFront] = useState(order.customerPhotoFront || '');
  const [customerPhotoSide, setCustomerPhotoSide] = useState(order.customerPhotoSide || '');
  const [customerPhotoBack, setCustomerPhotoBack] = useState(order.customerPhotoBack || '');

  // Ensure body scroll is managed when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleImageUpload = (file: File, type: 'custom' | 'front' | 'side' | 'back') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'custom') setCustomImage(base64String);
      if (type === 'front') setCustomerPhotoFront(base64String);
      if (type === 'side') setCustomerPhotoSide(base64String);
      if (type === 'back') setCustomerPhotoBack(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์ของลูกค้า');
      return;
    }

    const updatedMeasurements: Measurements = {
      chest: chest.trim(),
      waist: waist.trim(),
      hips: hips.trim(),
      shoulder: shoulder.trim(),
      sleeveLength: sleeveLength.trim(),
      armhole: armhole.trim(),
      length: length.trim(),
      neck: neck.trim(),
      height: height.trim(),
      weight: weight.trim(),
      otherNotes: otherNotes.trim(),
      standardSize: selectedSize || undefined
    };

    const updatedOrder: Order = {
      ...order,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerSocial: customerSocial.trim() || undefined,
      customerCategory: customerCategory.trim() || undefined,
      membershipTier,
      externalOrderId: externalOrderId.trim() || undefined,
      branch: branch.trim() || undefined,
      dressType: dressType.trim(),
      fabricType: fabricType.trim(),
      fabricColor: fabricColor.trim(),
      sku: sku.trim() || undefined,
      notes: notes.trim() || undefined,
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
      deposit: parseFloat(deposit) || 0,
      paymentMethod,
      deliveryDate,
      status,
      measurements: updatedMeasurements,
      customImage: customImage || undefined,
      customerPhotoFront: customerPhotoFront || undefined,
      customerPhotoSide: customerPhotoSide || undefined,
      customerPhotoBack: customerPhotoBack || undefined
    };

    onSave(updatedOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-natural-cream rounded-3xl border border-natural-wheat shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white px-6 py-5 border-b border-natural-sand flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-natural-espresso text-natural-cream font-mono text-xs px-2.5 py-1 rounded-md font-extrabold uppercase">
                {order.orderNumber}
              </span>
              <h2 className="text-xl font-serif font-bold text-natural-espresso">แก้ไขข้อมูลออเดอร์ตัดเย็บ (Edit Order Details)</h2>
            </div>
            <p className="text-xs text-natural-espresso/60">อัปเดตสเปกชุด สัญญาราคา การจ่ายชำระ และข้อมูลวัดตัวสัดส่วนลูกค้าได้ตามสะดวก</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-natural-espresso/40 hover:text-natural-espresso hover:bg-natural-sand/50 rounded-full transition-all cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section 1: Customer Information */}
            <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-2.5">
                <div className="p-1 bg-natural-sand rounded-md text-natural-espresso">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso text-sm">1. ข้อมูลลูกค้า (Customer Info)</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">สาขาที่รับออเดอร์ <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['สาขานราธิวาส', 'สาขายะลา', 'สาขาปัตตานี', 'สาขาหาดใหญ่'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBranch(b)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          branch === b
                            ? 'bg-natural-clay text-white border-natural-clay shadow-xs'
                            : 'bg-natural-cream/10 hover:bg-natural-sand text-natural-espresso border-natural-wheat'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ชื่อลูกค้า <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ช่องทางติดต่อ (IG/LINE)</label>
                  <input
                    type="text"
                    value={customerSocial}
                    onChange={(e) => setCustomerSocial(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>



                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ประเภทงาน (Job Type)</label>
                  <select
                    value={customerCategory}
                    onChange={(e) => setCustomerCategory(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 cursor-pointer"
                  >
                    <option value="IDD">IDD (พรีเมียมตัดเฉพาะตัว)</option>
                    <option value="IDH">IDH (กึ่งกูตูร์)</option>
                    <option value="ทั่วไป">ทั่วไป (Standard Work)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">บัตรสมาชิก (Membership)</label>
                  <select
                    value={membershipTier}
                    onChange={(e) => setMembershipTier(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 cursor-pointer"
                  >
                    <option value="MEMBER">MEMBER (Standard)</option>
                    <option value="TRADER">TRADER (Gold)</option>
                    <option value="PRIVILEGE">PRIVILEGE (Royal VIP)</option>
                    <option value="PRIME">PRIME (VIP Elite)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">รหัสออเดอร์เชื่อมโยง/รหัสจากกัน</label>
                  <input
                    type="text"
                    value={externalOrderId}
                    onChange={(e) => setExternalOrderId(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Dress Details */}
            <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-2.5">
                <div className="p-1 bg-natural-sand rounded-md text-natural-espresso">
                  <Sparkles className="h-4 w-4 text-natural-ochre" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso text-sm">2. รายละเอียดชุดสั่งตัด (Dress Spec)</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ประเภทชุด</label>
                  <select
                    value={dressType}
                    onChange={(e) => setDressType(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 cursor-pointer"
                  >
                    <option value="เดรสราตรี">เดรสราตรีออกงาน</option>
                    <option value="อาบายะห์">อาบายะห์ (Abaya)</option>
                    <option value="จั๊มสูท">จั๊มสูท (Jumpsuit)</option>
                    <option value="เดรสสั้น">เดรสสั้น (Short Dress)</option>
                    <option value="ชุดทำงาน">ชุดทำงาน / สูทสุภาพ</option>
                    <option value="ชุดไทย">ชุดไทยประยุกต์</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ชนิดเนื้อผ้า</label>
                  <input
                    type="text"
                    value={fabricType}
                    onChange={(e) => setFabricType(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">เฉดสีผ้า / รหัสสี</label>
                  <input
                    type="text"
                    value={fabricColor}
                    onChange={(e) => setFabricColor(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">รหัสสินค้า / SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 font-mono uppercase"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">หมายเหตุเพิ่มเติมของชุด (Dress Notes)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                    placeholder="ความต้องการพิเศษ รายละเอียดกระดุม บล็อก ซับใน..."
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pricing and Payment */}
            <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-2.5">
                <div className="p-1 bg-natural-sand rounded-md text-natural-espresso">
                  <CreditCard className="h-4 w-4 text-natural-clay" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso text-sm">3. สัญญาราคาและการชำระเงิน (Price & Payments)</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ราคาเต็มชุด (บาท)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ส่วนลดลดเพิ่ม (บาท)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 text-amber-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ยอดเงินมัดจำรับมา (บาท)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">ช่องทางรับเงิน (Payment Method)</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 cursor-pointer"
                  >
                    <option value="เงินโอน">เงินโอนธนาคาร</option>
                    <option value="เงินสด">ชำระเงินสด</option>
                    <option value="บัตรเครดิต">บัตรเครดิต/เดบิต</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">กำหนดส่งมอบชุด</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-natural-espresso/70 mb-1">สถานะออเดอร์</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/10 cursor-pointer font-bold"
                  >
                    {Object.values(OrderStatus).map((os) => (
                      <option key={os} value={os}>
                        {STATUS_MAP[os].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 pt-1">
                  <div className="bg-natural-sand/30 border border-natural-wheat/50 p-2.5 rounded-xl text-center text-xs text-natural-espresso">
                    <span>ค้างจ่ายคงเหลือกำหนดรับชุด: </span>
                    <strong className="text-natural-clay text-sm font-extrabold ml-1">
                      {Math.max(0, (parseFloat(price) || 0) - (parseFloat(deposit) || 0) - (parseFloat(discount) || 0)).toLocaleString()} บาท
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Customer Proportion Measurements */}
            <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-2.5">
                <div className="p-1 bg-natural-sand rounded-md text-natural-espresso">
                  <Ruler className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso text-sm">4. ตารางประวัติสัดส่วนวัดตัว (Measurements)</h3>
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
                  {Object.keys(STANDARD_SIZE_CHART).map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        className={`px-3 py-1.5 text-xs font-serif font-bold rounded-lg transition-all cursor-pointer flex flex-col items-center min-w-[55px] border relative ${
                          isSelected
                            ? 'bg-natural-clay text-white border-natural-clay shadow-xs'
                            : 'bg-white hover:bg-natural-sand/40 text-natural-espresso border-natural-wheat hover:border-natural-clay/30'
                        }`}
                      >
                        <span className="text-xs flex items-center gap-0.5">
                          {size}
                        </span>
                        <span className={`text-[9px] mt-0.5 font-sans font-medium ${isSelected ? 'text-white/80' : 'text-natural-espresso/45'}`}>
                          อก {STANDARD_SIZE_CHART[size].chest}"
                        </span>
                      </button>
                    );
                  })}
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

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">รอบอก (นิ้ว)</label>
                  <input
                    type="text"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    placeholder="เช่น 34"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">รอบเอว (นิ้ว)</label>
                  <input
                    type="text"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="เช่น 26"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">รอบสะโพก (นิ้ว)</label>
                  <input
                    type="text"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    placeholder="เช่น 37"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">ไหล่กว้าง (นิ้ว)</label>
                  <input
                    type="text"
                    value={shoulder}
                    onChange={(e) => setShoulder(e.target.value)}
                    placeholder="เช่น 15"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">ความยาวแขน (นิ้ว)</label>
                  <input
                    type="text"
                    value={sleeveLength}
                    onChange={(e) => setSleeveLength(e.target.value)}
                    placeholder="เช่น 22"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">รอบวงแขน (นิ้ว)</label>
                  <input
                    type="text"
                    value={armhole}
                    onChange={(e) => setArmhole(e.target.value)}
                    placeholder="เช่น 15"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">ความยาวชุด (นิ้ว)</label>
                  <input
                    type="text"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="เช่น 56"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">รอบคอ (นิ้ว)</label>
                  <input
                    type="text"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    placeholder="เช่น 13.5"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">ส่วนสูงลูกค้า (ซม.)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="เช่น 163"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>
                <div>
                  <label className="block font-medium text-natural-espresso/70 mb-0.5">น้ำหนักลูกค้า (กก.)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="เช่น 52"
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-natural-wheat focus:outline-none focus:ring-1 focus:ring-natural-clay bg-natural-cream/5"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-medium text-natural-espresso/70 mb-1">หมายเหตุการวัดตัวอื่นๆ</label>
                  <textarea
                    value={otherNotes}
                    onChange={(e) => setOtherNotes(e.target.value)}
                    rows={2}
                    placeholder="ไหล่สโลปพิเศษ, อกห่าง 7 นิ้ว, เอวคอดช่วงสูง..."
                    className="w-full text-sm px-3 py-2 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/5"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Order Photo uploads */}
            <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-xs space-y-4 md:col-span-2">
              <div className="flex items-center space-x-2 border-b border-natural-sand pb-2.5">
                <div className="p-1 bg-natural-sand rounded-md text-natural-espresso">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-natural-espresso text-sm">5. แนบหรือเปลี่ยนภาพถ่ายประกอบ (Photos Attachment)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Design Reference */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-natural-espresso/75 text-center">ภาพดีไซน์อ้างอิง</p>
                  {customImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat h-36 bg-natural-sand/5 flex items-center justify-center group">
                      <img src={customImage} alt="Ref" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      <button 
                        type="button" 
                        onClick={() => setCustomImage('')} 
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-natural-sand/50 hover:border-natural-clay/40 rounded-xl h-36 flex flex-col items-center justify-center transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'custom')} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/60 mb-1" />
                      <span className="text-[10px] text-natural-espresso/50">อัปโหลดภาพแบบชุด</span>
                    </div>
                  )}
                </div>

                {/* Front View */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-natural-espresso/75 text-center">สัดส่วน ด้านหน้า</p>
                  {customerPhotoFront ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat h-36 bg-natural-sand/5 flex items-center justify-center group">
                      <img src={customerPhotoFront} alt="Front" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      <button 
                        type="button" 
                        onClick={() => setCustomerPhotoFront('')} 
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-natural-sand/50 hover:border-natural-clay/40 rounded-xl h-36 flex flex-col items-center justify-center transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'front')} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/60 mb-1" />
                      <span className="text-[10px] text-natural-espresso/50">อัปโหลดด้านหน้า</span>
                    </div>
                  )}
                </div>

                {/* Side View */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-natural-espresso/75 text-center">สัดส่วน ด้านข้าง</p>
                  {customerPhotoSide ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat h-36 bg-natural-sand/5 flex items-center justify-center group">
                      <img src={customerPhotoSide} alt="Side" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      <button 
                        type="button" 
                        onClick={() => setCustomerPhotoSide('')} 
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-natural-sand/50 hover:border-natural-clay/40 rounded-xl h-36 flex flex-col items-center justify-center transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'side')} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/60 mb-1" />
                      <span className="text-[10px] text-natural-espresso/50">อัปโหลดด้านข้าง</span>
                    </div>
                  )}
                </div>

                {/* Back View */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-natural-espresso/75 text-center">สัดส่วน ด้านหลัง</p>
                  {customerPhotoBack ? (
                    <div className="relative rounded-xl overflow-hidden border border-natural-wheat h-36 bg-natural-sand/5 flex items-center justify-center group">
                      <img src={customerPhotoBack} alt="Back" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      <button 
                        type="button" 
                        onClick={() => setCustomerPhotoBack('')} 
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-natural-sand/50 hover:border-natural-clay/40 rounded-xl h-36 flex flex-col items-center justify-center transition-all bg-natural-cream/5 hover:bg-natural-sand/10 text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'back')} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <UploadCloud className="h-5 w-5 text-natural-clay/60 mb-1" />
                      <span className="text-[10px] text-natural-espresso/50">อัปโหลดด้านหลัง</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-natural-sand flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-natural-wheat hover:bg-natural-sand text-sm font-bold text-natural-espresso transition-all cursor-pointer"
            >
              ยกเลิก (Cancel)
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-natural-espresso hover:bg-stone-800 text-white text-sm font-bold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>บันทึกการแก้ไข (Save Changes)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
