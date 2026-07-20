import React from 'react';
import { Order, STATUS_MAP, STANDARD_SIZE_CHART, CatalogueItem } from '../types';
import { INITIAL_CATALOGUE } from '../initialData';
import { Printer, X, Scissors, User, Phone, Calendar, DollarSign, Sparkles } from 'lucide-react';

interface PrintOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintOrderModal({ order, isOpen, onClose }: PrintOrderModalProps) {
  if (!isOpen || !order) return null;

  const discountVal = order.discount || 0;
  const unpaidAmount = Math.max(0, order.price - order.deposit - discountVal);

  // ดึงรูปภาพสำหรับพิมพ์ (จากอัปโหลด หรือจากแคตตาล็อก หรือรูปสเก็ตช์นางแบบตั้งต้น)
  let displayImage = order.customImage;
  let imageSourceLabel = "ภาพอ้างอิงดีไซน์สั่งตัด";

  if (!displayImage && order.selectedDesignId) {
    let catalogueList: CatalogueItem[] = [];
    try {
      const saved = localStorage.getItem('nunuh_catalogue');
      if (saved) {
        catalogueList = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    
    if (!catalogueList || catalogueList.length === 0) {
      catalogueList = INITIAL_CATALOGUE;
    }
    
    const matchedItem = catalogueList.find(item => item.id === order.selectedDesignId);
    if (matchedItem) {
      displayImage = matchedItem.image;
      imageSourceLabel = `แบบชุด: ${matchedItem.name}`;
    }
  }

  // หากไม่มีรูปเลย ให้แสดงภาพจำลองสำหรับสเก็ตช์ห้องเสื้อหรูหราของทางร้าน เพื่อให้ใบออเดอร์มีดีไซน์เสมอ
  if (!displayImage) {
    displayImage = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600";
    imageSourceLabel = "สเก็ตช์ดีไซน์สั่งตัดพิเศษ (Custom Atelier Sketch)";
  }

  const handlePrint = () => {
    window.print();
  };

  const formattedOrderDate = new Date(order.orderDate).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedDeliveryDate = new Date(order.deliveryDate).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-natural-espresso/45 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-natural-wheat flex flex-col max-h-[90vh]">
        
        {/* Top Control Header - No Print */}
        <div className="flex items-center justify-between p-4 border-b border-natural-wheat bg-natural-cream/30 no-print">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-lg bg-natural-clay/10 flex items-center justify-center text-natural-clay">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-natural-espresso text-sm">พิมพ์ใบสั่งตัดและวัดตัว</h4>
              <p className="text-[10px] text-natural-espresso/50">พิมพ์ใบออเดอร์ทางการสำหรับช่างตัดเย็บและลูกค้า</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-natural-clay hover:bg-natural-clay-dark text-white font-serif font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>พิมพ์ใบออเดอร์ (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="bg-natural-sand/50 hover:bg-natural-sand text-natural-espresso p-2 rounded-xl transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-8 overflow-y-auto bg-natural-sand/15 flex-1 flex justify-center">
          
          {/* Printable Sheet (Standard A4 Proportions on Screen) */}
          <div className="print-only-modal bg-white w-full max-w-3xl p-8 sm:p-12 border border-natural-wheat shadow-lg rounded-xl text-natural-espresso relative" id="nunuh-print-sheet">
            
            {/* Elegant Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-natural-clay via-natural-ochre to-natural-sage rounded-t-xl print:hidden"></div>

            {/* Header Shop Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-natural-wheat/80 pb-6 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-extrabold text-2xl tracking-widest text-natural-espresso">NUNUH</span>
                  <span className="text-xs bg-natural-clay/10 text-natural-clay px-2 py-0.5 rounded font-bold uppercase tracking-wider font-serif">Couture</span>
                </div>
                <p className="text-[10px] text-natural-espresso/60 leading-relaxed font-sans max-w-sm">
                  129/3 ซอยรามคำแหง 24 แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240 <br />
                  โทร: 086-555-1234 | LINE/IG: @nunuh.couture
                </p>
              </div>
              <div className="text-left sm:text-right space-y-1">
                <h2 className="font-serif font-bold text-xl text-natural-clay uppercase tracking-wider">ใบสั่งตัดชุดและวัดตัว</h2>
                <p className="text-xs font-mono font-bold text-natural-espresso">
                  No. <span className="text-natural-clay font-extrabold">{order.orderNumber}</span>
                </p>
                <div className="inline-flex items-center text-[10px] bg-natural-sand/40 border border-natural-wheat/60 px-2 py-0.5 rounded-full font-bold">
                  🟢 สถานะ: {STATUS_MAP[order.status]?.label || order.status}
                </div>
              </div>
            </div>

            {/* Customer & Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5 border-b border-natural-sand text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-natural-espresso/45 font-bold uppercase">ข้อมูลผู้สั่งซื้อ</p>
                <p className="font-bold text-natural-espresso flex items-center">
                  <User className="h-3 w-3 mr-1 text-natural-clay/60" /> {order.customerName}
                </p>
                <p className="text-natural-espresso/70 flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-natural-clay/60" /> {order.customerPhone}
                </p>
                {order.customerSocial && (
                  <p className="text-natural-espresso/60 font-medium">📱 IG/LINE: {order.customerSocial}</p>
                )}
                {order.customerCategory && (
                  <p className="text-natural-espresso/80 font-bold text-[11px] mt-0.5">🏷️ ประเภทงาน: <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px] inline-block">{order.customerCategory}</span></p>
                )}
                {order.membershipTier && (
                  <p className="text-natural-espresso/80 font-bold text-[11px] mt-0.5">💳 บัตรสมาชิก: <span className="text-yellow-800 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200 text-[10px] font-bold inline-block uppercase">{order.membershipTier}</span></p>
                )}
                {order.externalOrderId && (
                  <p className="text-natural-espresso/80 font-bold text-[11px] mt-0.5">🔗 รหัสจากกัน: <span className="text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[10px] font-mono inline-block">{order.externalOrderId}</span></p>
                )}
                {order.branch && (
                  <p className="text-natural-espresso/80 font-bold text-[11px] mt-0.5">🏪 สาขา: <span className="text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 text-[10px] inline-block">{order.branch}</span></p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-natural-espresso/45 font-bold uppercase">วันที่สั่งจองและจัดส่ง</p>
                <p className="font-semibold text-natural-espresso flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-natural-ochre" /> วันที่สั่งซื้อ: {formattedOrderDate}
                </p>
                <p className="font-bold text-natural-clay flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-natural-clay" /> วันกำหนดส่ง: {formattedDeliveryDate}
                </p>
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <p className="text-[10px] text-natural-espresso/45 font-bold uppercase">รายละเอียดประเภทงาน</p>
                <p className="font-bold text-natural-espresso">ประเภทชุด: {order.dressType}</p>
                <p className="text-natural-espresso/75">เนื้อผ้า: {order.fabricType}</p>
                <p className="text-natural-espresso/75">เฉดสี: {order.fabricColor}</p>
                {order.sku && (
                  <p className="text-natural-clay font-bold font-mono uppercase text-[11px]">SKU: {order.sku}</p>
                )}
              </div>
            </div>

            {/* Measurements Section */}
            <div className="py-5 border-b border-natural-sand">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-bold text-xs text-natural-espresso flex items-center">
                  <Scissors className="h-3.5 w-3.5 mr-1.5 text-natural-clay" /> ตารางขนาดสัดส่วนการวัดตัว (Tailoring Measurements)
                </h4>
                {order.measurements.standardSize && (
                  <span className="text-[9px] bg-natural-clay text-white px-2.5 py-0.5 rounded-full font-bold">
                    ไซส์มาตรฐาน: {order.measurements.standardSize}
                  </span>
                )}
              </div>

              {/* Grid Measurements */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs mb-4">
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">รอบอก</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.chest} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">รอบเอว</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.waist} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">สะโพก</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.hips} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ไหล่กว้าง</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.shoulder} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ความยาวแขน</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.sleeveLength} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">รอบวงแขน</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.armhole} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ความยาวชุด</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.length} ซม.</strong>
                </div>

                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ส่วนสูง</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.height} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">น้ำหนัก</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.weight || '-'} กก.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">บ่าหน้า</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.frontChest || '-'} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">บ่าหลัง</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.backChest || '-'} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ยาวหน้า</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.frontLength || '-'} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ยาวหลัง</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.backLength || '-'} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">ข้อมือ</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.wrist || '-'} ซม.</strong>
                </div>
                <div className="bg-natural-sand/20 p-2 rounded-lg border border-natural-wheat/40 flex flex-col justify-center">
                  <span className="block text-[9px] text-natural-espresso/50 font-bold uppercase">สไตล์สัดส่วน</span>
                  <strong className="text-[10px] font-bold text-natural-clay">
                    {order.measurements.standardSize ? `Standard ${order.measurements.standardSize}` : 'สั่งตัดส่วนตัว (Custom)'}
                  </strong>
                </div>
              </div>

              {order.measurements.otherNotes && (
                <div className="text-xs bg-natural-sand/20 p-2.5 rounded-lg border border-natural-wheat/40 leading-relaxed text-natural-espresso/80">
                  <strong className="text-natural-espresso">📌 รายละเอียดสัดส่วนพิเศษเพิ่มเติม:</strong> {order.measurements.otherNotes}
                </div>
              )}
            </div>

            {/* Design & Sketches Reference Section */}
            <div className="py-5 border-b border-natural-sand text-xs">
              <h4 className="font-serif font-bold text-xs text-natural-espresso flex items-center mb-3">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-natural-ochre" /> รายละเอียดดีไซน์และรูปภาพประกอบ (Design & Reference Illustration)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {order.customDesign && (
                      <div className="bg-natural-sand/20 p-3 rounded-lg border border-natural-wheat/30 space-y-1 text-xs">
                        <p className="font-bold text-natural-espresso border-b border-natural-sand/55 pb-1">📐 สไตล์ทรงสถาปัตย์ชุด</p>
                        <p><span className="text-natural-espresso/60">ทรงชุด (Silhouette):</span> <strong className="font-bold">{order.customDesign.silhouette}</strong></p>
                        <p><span className="text-natural-espresso/60">ดีไซน์คอ (Neckline):</span> <strong className="font-bold">{order.customDesign.neckline}</strong></p>
                        <p><span className="text-natural-espresso/60">ดีไซน์แขน (Sleeves):</span> <strong className="font-bold">{order.customDesign.sleeves}</strong></p>
                      </div>
                    )}
                    {order.notes ? (
                      <div className="p-3 bg-natural-cream/40 border border-natural-sand rounded-lg italic text-natural-espresso/75 leading-relaxed">
                        " {order.notes} "
                      </div>
                    ) : (
                      <div className="p-3 bg-natural-cream/25 border border-dashed border-natural-wheat rounded-lg text-natural-espresso/50 leading-relaxed text-center">
                        ไม่มีหมายเหตุดีไซน์เพิ่มเติม
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-natural-espresso/40 italic hidden md:block">
                    * รูปภาพด้านขวาใช้เป็นภาพอ้างอิงดีไซน์หลักสำหรับช่างแพทเทิร์นและช่างเย็บประกอบชุด
                  </div>
                </div>

                {displayImage && (
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <p className="text-[10px] text-natural-espresso/45 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>🖼️ {imageSourceLabel}</span>
                    </p>
                    <div className="border border-natural-wheat rounded-xl p-1 bg-natural-sand/10 flex items-center justify-center max-h-48 overflow-hidden print:max-h-44">
                      <img 
                        src={displayImage} 
                        alt="Design Reference for print" 
                        className="max-h-44 object-contain rounded-lg print:max-h-40"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="py-5 border-b border-natural-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-serif font-bold text-xs text-natural-espresso flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-natural-clay" /> รายการสรุปด้านการเงิน (Financial Statement)
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] text-natural-espresso/50">กรุณาตรวจสอบยอดชำระมัดจำ และยอดค้างจ่ายทั้งหมด</p>
                  {order.paymentMethod && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      ช่องทาง: {order.paymentMethod}
                    </span>
                  )}
                </div>
              </div>

              <div className={`grid gap-2 w-full sm:w-auto text-center text-xs ${order.discount ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                <div className="bg-white border border-natural-wheat p-2 rounded-xl min-w-[80px]">
                  <span className="block text-[9px] text-natural-espresso/45 font-bold uppercase">ราคาค่าชุด</span>
                  <strong className="text-sm font-mono font-bold text-natural-espresso">{order.price.toLocaleString()} ฿</strong>
                </div>
                {!!order.discount && (
                  <div className="bg-white border border-natural-wheat p-2 rounded-xl min-w-[80px]">
                    <span className="block text-[9px] text-amber-600 font-bold uppercase">ส่วนลด</span>
                    <strong className="text-sm font-mono font-bold text-amber-600">-{order.discount.toLocaleString()} ฿</strong>
                  </div>
                )}
                <div className="bg-white border border-natural-wheat p-2 rounded-xl min-w-[80px]">
                  <span className="block text-[9px] text-natural-clay font-bold uppercase">หักค่ามัดจำ</span>
                  <strong className="text-sm font-mono font-bold text-natural-clay">-{order.deposit.toLocaleString()} ฿</strong>
                </div>
                <div className="bg-natural-clay text-white p-2 rounded-xl min-w-[110px] shadow-xs col-span-2 sm:col-span-1">
                  <span className="block text-[9px] text-white/75 font-bold uppercase">คงค้าง ณ วันรับชุด</span>
                  <strong className="text-sm font-mono font-extrabold">{unpaidAmount.toLocaleString()} ฿</strong>
                </div>
              </div>
            </div>

            {/* Customer Body Photos Section (For tailors) */}
            {(order.customerPhotoFront || order.customerPhotoSide || order.customerPhotoBack) && (
              <div className="py-5 border-b border-natural-sand text-xs">
                <h4 className="font-serif font-bold text-xs text-natural-espresso flex items-center mb-3">
                  📸 ภาพถ่ายสัดส่วนสรีระลูกค้า (Customer Body Proportions)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {order.customerPhotoFront ? (
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-natural-espresso/60 font-bold">ด้านหน้า (Front)</p>
                      <div className="border border-natural-wheat rounded-lg p-1 bg-natural-sand/5 flex items-center justify-center max-h-36 overflow-hidden">
                        <img src={order.customerPhotoFront} alt="Front View" className="max-h-32 object-contain rounded" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-natural-espresso/60 font-bold">ด้านหน้า (Front)</p>
                      <div className="border border-dashed border-natural-sand rounded-lg h-32 flex items-center justify-center text-natural-espresso/30 italic text-[10px]">
                        ไม่มีภาพถ่าย
                      </div>
                    </div>
                  )}

                  {order.customerPhotoSide ? (
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-natural-espresso/60 font-bold">ด้านข้าง (Side)</p>
                      <div className="border border-natural-wheat rounded-lg p-1 bg-natural-sand/5 flex items-center justify-center max-h-36 overflow-hidden">
                        <img src={order.customerPhotoSide} alt="Side View" className="max-h-32 object-contain rounded" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-natural-espresso/60 font-bold">ด้านข้าง (Side)</p>
                      <div className="border border-dashed border-natural-sand rounded-lg h-32 flex items-center justify-center text-natural-espresso/30 italic text-[10px]">
                        ไม่มีภาพถ่าย
                      </div>
                    </div>
                  )}

                  {order.customerPhotoBack ? (
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-natural-espresso/60 font-bold">ด้านหลัง (Back)</p>
                      <div className="border border-natural-wheat rounded-lg p-1 bg-natural-sand/5 flex items-center justify-center max-h-36 overflow-hidden">
                        <img src={order.customerPhotoBack} alt="Back View" className="max-h-32 object-contain rounded" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <p className="text-[10px] text-natural-espresso/60 font-bold">ด้านหลัง (Back)</p>
                      <div className="border border-dashed border-natural-sand rounded-lg h-32 flex items-center justify-center text-natural-espresso/30 italic text-[10px]">
                        ไม่มีภาพถ่าย
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terms and Signatures */}
            <div className="pt-6 text-[10px] text-natural-espresso/60 space-y-8">
              <div className="bg-natural-sand/20 p-3 rounded-lg border border-natural-sand/50 leading-relaxed text-natural-espresso/70">
                <strong>เงื่อนไขการสั่งตัดและการรับชุด:</strong><br />
                1. ทางร้านขอสงวนสิทธิ์ไม่คืนเงินมัดจำในกรณีที่มีการยกเลิกออเดอร์โดยลูกค้า<br />
                2. ลูกค้าสามารถปรับแก้วัดตัว (Fitting) เพิ่มเติมได้ฟรี 1 ครั้งในวันนัดหมายก่อนรับสินค้า<br />
                3. กรุณาชำระยอดเงินคงเหลือสุทธิครบถ้วนก่อนรับชุดสั่งตัดของท่านออกไปจากสตูดิโอ
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-6 gap-6">
                <div className="text-center w-40 space-y-1">
                  <div className="border-b border-natural-espresso/30 h-10 w-full"></div>
                  <p className="font-semibold text-natural-espresso">ลงชื่อ: .......................................</p>
                  <p className="text-[9px] text-natural-espresso/40 font-bold uppercase">( ดีไซเนอร์ / ช่างผู้บันทึก )</p>
                </div>
                <div className="text-center w-40 space-y-1">
                  <div className="border-b border-natural-espresso/30 h-10 w-full"></div>
                  <p className="font-semibold text-natural-espresso">ลงชื่อ: .......................................</p>
                  <p className="text-[9px] text-natural-espresso/40 font-bold uppercase">( ลายมือชื่อลูกค้าผู้สั่งตัด )</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
