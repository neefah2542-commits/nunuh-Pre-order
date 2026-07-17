/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, OrderStatus, STATUS_MAP, StatusConfig } from '../types';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Instagram, 
  Calendar, 
  DollarSign, 
  Tag, 
  Ruler, 
  Scissors, 
  Compass, 
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Printer,
  Camera,
  Pencil,
  Globe,
  Send,
  ExternalLink,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import PrintOrderModal from './PrintOrderModal';
import EditOrderModal from './EditOrderModal';

interface OrderTrackerProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onEditOrder?: (updatedOrder: Order) => void;
}

export default function OrderTracker({ orders, onUpdateOrderStatus, onDeleteOrder, onEditOrder }: OrderTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL_ACTIVE'); // ALL, ALL_ACTIVE, or specific status
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [publicUrl, setPublicUrl] = useState(() => {
    return localStorage.getItem('nunuh_public_url') || window.location.origin;
  });
  const [showUrlSettings, setShowUrlSettings] = useState(false);

  const handleSavePublicUrl = (url: string) => {
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    setPublicUrl(cleanUrl);
    localStorage.setItem('nunuh_public_url', cleanUrl);
  };

  const getSocialInfo = (socialStr?: string) => {
    if (!socialStr) return null;
    const lower = socialStr.toLowerCase();
    
    if (lower.includes('ig:') || lower.includes('instagram') || lower.includes('@') || lower.includes('ig ')) {
      return {
        type: 'instagram',
        label: socialStr,
        cleanId: socialStr.replace(/^(ig\s*[:：-]\s*|instagram\s*[:：-]\s*|@)/i, '').trim(),
        icon: <Instagram className="h-3.5 w-3.5 text-pink-600 shrink-0" />
      };
    }
    
    if (lower.includes('fb:') || lower.includes('facebook') || lower.includes('เฟส') || lower.includes('fb ')) {
      return {
        type: 'facebook',
        label: socialStr,
        cleanId: socialStr.replace(/^(fb\s*[:：-]\s*|facebook\s*[:：-]\s*|เฟสบุ๊ค\s*[:：-]\s*|เฟส\s*[:：-]\s*)/i, '').trim(),
        icon: <MessageSquare className="h-3.5 w-3.5 text-blue-600 shrink-0" />
      };
    }
    
    // Default to LINE
    const cleanId = socialStr.replace(/^(line\s*id|line|ไลน์\s*ไอดี|ไลน์|id)\s*[:：-]\s*/i, '').replace(/^@/, '').trim();
    return {
      type: 'line',
      label: socialStr,
      cleanId,
      icon: <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
    };
  };

  const handleDirectLineChat = (order: Order) => {
    const currentStatusCfg = STATUS_MAP[order.status];
    const formattedDelivery = new Date(order.deliveryDate).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const portalUrl = `${publicUrl}?tab=customer&search=${order.customerPhone}&mode=customer`;
    const message = `⚜️ อัปเดตสถานะชุดสั่งตัด NUNUH Boutique ⚜️\n\nเรียนคุณ: ${order.customerName}\nรหัสออเดอร์: ${order.orderNumber}\nประเภทชุด: ${order.dressType}\n\n📍 สถานะปัจจุบัน: [${currentStatusCfg.label}]\n➡️ "${currentStatusCfg.description}"\n\n📅 กำหนดส่งมอบ: ${formattedDelivery}\n\nท่านสามารถตรวจสอบข้อมูลสัดส่วนและติดตามความคืบหน้าแบบละเอียดด้วยตนเองได้ที่นี่:\n🔗 ${portalUrl}\n\nขอขอบพระคุณที่เลือกใช้บริการค่ะ ✨`;

    try {
      navigator.clipboard.writeText(message);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    alert(
      `📲 คัดลอกข้อมูลและข้อความอัปเดตสถานะของ คุณ ${order.customerName} เรียบร้อยแล้ว!\n\n` +
      `• ลิงก์เช็คสถานะลูกค้า: "${portalUrl}"\n` +
      `• ชื่อลูกค้าสำหรับค้นหาแชท: "${order.customerName}"\n\n` +
      `เมื่อหน้าต่างใหม่เปิดขึ้น ให้แอดมินใช้คำว่า "${order.customerName}" ในช่องค้นหาแชท LINE Official ของร้านเพื่อวางข้อความและคุยได้ทันทีเลยค่ะ 💬`
    );

    window.open('https://chat.line.biz/U7ad64905450d2c18cf2eb27f61c5ea4c/chat', '_blank');
  };

  const handleOpenLineOaChat = (order: Order) => {
    if (!order.lineUserId || !order.lineUserId.trim()) {
      alert("ไม่พบรหัส LINE User ID ของลูกค้าท่านนี้ในระบบค่ะ");
      return;
    }
    const lineOaId = localStorage.getItem('nunuh_line_oa_id') || '@237ayntq';
    const cleanId = lineOaId.startsWith('@') ? lineOaId : `@${lineOaId}`;
    const url = `https://manager.line.biz/account/${cleanId}/chat/user/${order.lineUserId.trim()}`;
    window.open(url, '_blank');
  };

  const handleSendStatusDirectly = async (order: Order) => {
    if (!order.lineUserId || !order.lineUserId.trim()) {
      alert("ไม่พบรหัส LINE User ID ของลูกค้าท่านนี้ในระบบค่ะ");
      return;
    }

    const currentStatusCfg = STATUS_MAP[order.status];
    const discountVal = order.discount || 0;
    const formattedDelivery = new Date(order.deliveryDate).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const portalUrl = `${publicUrl}?tab=customer&search=${order.customerPhone}&mode=customer`;
    const message = `⚜️ อัปเดตสถานะชุดสั่งตัด NUNUH Boutique ⚜️\n\nเรียนคุณ: ${order.customerName}\nรหัสออเดอร์: ${order.orderNumber}\nประเภทชุด: ${order.dressType}\n\n📍 สถานะปัจจุบัน: [${currentStatusCfg.label}]\n➡️ "${currentStatusCfg.description}"\n\n📅 กำหนดส่งมอบ: ${formattedDelivery}\n\nท่านสามารถตรวจสอบข้อมูลสัดส่วนและติดตามความคืบหน้าแบบละเอียดด้วยตนเองได้ที่นี่:\n🔗 ${portalUrl}\n\nขอขอบพระคุณที่เลือกใช้บริการค่ะ ✨`;

    try {
      const response = await fetch('/api/send-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order.lineUserId.trim(),
          message
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.simulated) {
          alert(`📲 [Simulated] ส่งข้อความสถานะให้คุณ ${order.customerName} สำเร็จแล้ว (เนื่องจากยังไม่ได้ตั้งค่า LINE_CHANNEL_ACCESS_TOKEN บนเซิร์ฟเวอร์ค่ะ)\n\nข้อความที่ส่ง:\n${message}`);
        } else {
          alert(`✅ ส่งข้อความแจ้งสถานะอัปเดตไปยัง LINE ของคุณ ${order.customerName} เรียบร้อยแล้วค่ะ!`);
        }
      } else {
        const errText = await response.text();
        alert(`❌ ไม่สามารถส่งข้อความได้: ${errText}`);
      }
    } catch (err: any) {
      alert(`❌ เกิดข้อผิดพลาดในการส่งข้อมูล: ${err.message || err}`);
    }
  };

  // การกรองข้อมูล
  const filteredOrders = orders.filter((order) => {
    // กรองด้วยคำค้นหา (ชื่อ เบอร์ หรือเลขที่ออเดอร์ หรือ SKU)
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.dressType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.sku && order.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    // กรองด้วยสาขา
    const matchesBranch = branchFilter === 'ALL' || order.branch === branchFilter;

    // กรองด้วยสถานะ
    let matchesStatus = true;
    if (statusFilter === 'ALL') {
      matchesStatus = true;
    } else if (statusFilter === 'ALL_ACTIVE') {
      matchesStatus = order.status !== OrderStatus.COMPLETED;
    } else {
      matchesStatus = order.status === statusFilter;
    }

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getUnpaidBalance = (order: Order) => {
    return order.price - order.deposit;
  };

  const statusList = Object.values(OrderStatus);

  const generateTSV = () => {
    const headers = [
      'หมายเลขออเดอร์',
      'สาขา',
      'ชื่อลูกค้า',
      'เบอร์โทรศัพท์',
      'ช่องทางติดต่อ',
      'ประเภทงาน',
      'ประเภทบัตรสมาชิก',
      'รหัสออเดอร์จากกัน',
      'ประเภทชุด',
      'เนื้อผ้า',
      'เฉดสี',
      'สถานะ',
      'วันที่สั่งซื้อ',
      'กำหนดส่ง',
      'ราคา',
      'ส่วนลด',
      'มัดจำ',
      'ช่องทางการรับเงิน',
      'ยอดคงเหลือ',
      'อก',
      'เอว',
      'สะโพก',
      'ไหล่กว้าง',
      'ความยาวแขน',
      'รอบวงแขน',
      'ความยาวชุด',
      'รอบคอ',
      'ส่วนสูง',
      'น้ำหนัก',
      'บันทึกเพิ่มเติม'
    ];

    const rows = orders.map(o => [
      o.orderNumber,
      o.branch || 'สาขานราธิวาส',
      o.customerName,
      o.customerPhone,
      o.customerSocial || '-',
      o.customerCategory || '-',
      o.membershipTier || '-',
      o.externalOrderId || '-',
      o.dressType,
      o.fabricType,
      o.fabricColor || '-',
      STATUS_MAP[o.status]?.label || o.status,
      o.orderDate,
      o.deliveryDate,
      o.price,
      o.discount || 0,
      o.deposit,
      o.paymentMethod || 'เงินโอน',
      Math.max(0, o.price - o.deposit - (o.discount || 0)),
      o.measurements.chest,
      o.measurements.waist,
      o.measurements.hips,
      o.measurements.shoulder,
      o.measurements.sleeveLength,
      o.measurements.armhole,
      o.measurements.length,
      o.measurements.neck,
      o.measurements.height || '-',
      o.measurements.weight || '-',
      o.measurements.otherNotes || '-'
    ]);

    return [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
  };

  const downloadCSV = () => {
    const headers = [
      'Order Number', 'Customer Name', 'Phone', 'Social Contact', 'Job Type', 'Membership Card Type', 'External Order ID', 'Dress Type', 
      'Fabric Type', 'Fabric Color', 'Status', 'Order Date', 'Delivery Date', 
      'Price', 'Discount', 'Deposit', 'Payment Method', 'Unpaid Balance', 'Chest', 'Waist', 'Hips', 
      'Shoulder', 'Sleeve Length', 'Armhole', 'Dress Length', 'Neck', 'Height', 'Other Notes'
    ];

    const rows = orders.map(o => [
      `"${o.orderNumber}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${(o.customerSocial || '-').replace(/"/g, '""')}"`,
      `"${o.customerCategory || '-'}"`,
      `"${o.membershipTier || '-'}"`,
      `"${o.externalOrderId || '-'}"`,
      `"${o.dressType.replace(/"/g, '""')}"`,
      `"${o.fabricType.replace(/"/g, '""')}"`,
      `"${(o.fabricColor || '-').replace(/"/g, '""')}"`,
      `"${STATUS_MAP[o.status]?.label || o.status}"`,
      `"${o.orderDate}"`,
      `"${o.deliveryDate}"`,
      o.price,
      o.discount || 0,
      o.deposit,
      `"${o.paymentMethod || 'เงินโอน'}"`,
      Math.max(0, o.price - o.deposit - (o.discount || 0)),
      `"${o.measurements.chest}"`,
      `"${o.measurements.waist}"`,
      `"${o.measurements.hips}"`,
      `"${o.measurements.shoulder}"`,
      `"${o.measurements.sleeveLength}"`,
      `"${o.measurements.armhole}"`,
      `"${o.measurements.length}"`,
      `"${o.measurements.neck}"`,
      o.measurements.height || 0,
      `"${(o.measurements.otherNotes || '-').replace(/"/g, '""')}"`
    ]);

    const content = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NUNUH_Orders_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Public Render URL Config Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/30 border border-amber-200/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl">
            <Globe className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-natural-espresso flex items-center gap-1.5">
              <span>🔗 ลิงก์สาธารณะสำหรับแชร์ให้ลูกค้า (Render.com URL)</span>
            </h4>
            <p className="text-[10px] text-natural-espresso/60 font-medium">
              ปัจจุบันใช้: <strong className="text-amber-800 break-all">{publicUrl}</strong>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlSettings(!showUrlSettings)}
          className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-white hover:bg-amber-100/50 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors shadow-2xs cursor-pointer flex items-center space-x-1"
        >
          <span>{showUrlSettings ? '✕ ปิดตั้งค่า' : '⚙️ ตั้งค่าลิงก์ Render'}</span>
        </button>
      </div>

      {showUrlSettings && (
        <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-md space-y-3.5 animate-fadeIn">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-natural-espresso">ตั้งค่าลิงก์หลักของร้าน (Render App URL)</h5>
            <p className="text-[11px] text-natural-espresso/60 leading-relaxed">
              กรอกลิงก์เว็บไซต์ของร้านคุณที่ได้มาจาก Render.com (เช่น <code className="bg-natural-sand/50 px-1 py-0.5 rounded text-[10px] font-mono">https://nunuh.onrender.com</code>) เพื่อให้ระบบสร้างลิงก์เช็คสถานะออเดอร์ให้ลูกค้าในแชท LINE คัดลอกไปส่งได้ทันที แม้ว่าตัวผู้ดูแลร้านกำลังใช้งานระบบผ่านช่องทางผู้พัฒนา (AI Studio) อยู่ค่ะ
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-natural-espresso/40" />
              <input
                type="url"
                value={publicUrl}
                onChange={(e) => handleSavePublicUrl(e.target.value)}
                placeholder="เช่น https://nunuh.onrender.com"
                className="w-full text-xs pl-8.5 pr-4 py-2.5 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 bg-natural-cream/10 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                handleSavePublicUrl(window.location.origin);
                alert('รีเซ็ตลิงก์หลักกลับมาใช้ URL ปัจจุบันเรียบร้อยแล้วค่ะ');
              }}
              className="px-4 py-2 bg-natural-sand hover:bg-natural-wheat text-natural-espresso font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              🔄 ใช้ลิงก์ปัจจุบัน
            </button>
          </div>
          <p className="text-[10px] text-amber-600 font-bold">
            💡 ตัวอย่างลิงก์เช็คสถานะที่จะถูกส่ง: <span className="break-all font-mono text-[9px] bg-amber-50 px-1 py-0.5 rounded">{publicUrl}?tab=customer&search=086-555-1234&mode=customer</span>
          </p>
        </div>
      )}
      
      {/* Search and Filters Controls */}
      <div className="bg-white p-5 rounded-2xl border border-natural-wheat shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-natural-espresso/40" />
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, เบอร์โทรศัพท์, หมายเลขสั่งซื้อ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/20"
          />
        </div>

        {/* Filter Toggle Row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 text-xs text-natural-espresso/60 font-medium mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>ตัวกรอง:</span>
          </div>

          <button
            onClick={() => setStatusFilter('ALL_ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'ALL_ACTIVE'
                ? 'bg-natural-clay text-white border-natural-clay'
                : 'bg-natural-sand hover:bg-natural-wheat/60 text-natural-espresso border-transparent'
            }`}
          >
            📋 เฉพาะงานที่ดำเนินการอยู่
          </button>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-natural-clay text-white border-natural-clay'
                : 'bg-natural-sand hover:bg-natural-wheat/60 text-natural-espresso border-transparent'
            }`}
          >
            📂 ทั้งหมด ({orders.length})
          </button>

          <div className="relative inline-block text-left">
            <select
              value={statusList.includes(statusFilter as OrderStatus) ? statusFilter : "SELECT"}
              onChange={(e) => {
                if (e.target.value !== "SELECT") {
                  setStatusFilter(e.target.value);
                }
              }}
              className="text-xs bg-natural-sand border-transparent font-semibold px-3 py-2 rounded-xl text-natural-espresso focus:outline-none focus:ring-2 focus:ring-natural-clay/20 cursor-pointer"
            >
              <option value="SELECT">📍 กรองเฉพาะสถานะ...</option>
              {statusList.map((status) => (
                <option key={status} value={status}>
                  {STATUS_MAP[status].label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative inline-block text-left">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="text-xs bg-purple-50 text-purple-900 border border-purple-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
            >
              <option value="ALL">🏪 ทุกสาขา</option>
              <option value="สาขานราธิวาส">สาขานราธิวาส</option>
              <option value="สาขายะลา">สาขายะลา</option>
              <option value="สาขาปัตตานี">สาขาปัตตานี</option>
              <option value="สาขาหาดใหญ่">สาขาหาดใหญ่</option>
            </select>
          </div>

          {/* Google Sheets Sync & Export Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <span>📊 ส่งออก Google Sheets</span>
          </button>
        </div>

      </div>

      {/* Orders List Container */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-natural-sand/20 border border-dashed border-natural-wheat rounded-2xl py-12 px-6 text-center text-natural-espresso/60">
            <Compass className="h-8 w-8 mx-auto text-natural-espresso/30 mb-3" />
            <p className="font-medium">ไม่พบรายการออเดอร์ตัดเย็บตามที่เลือก</p>
            <p className="text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกสลับแท็บเพื่อดูรายการงานทั้งหมด</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentStatusCfg = STATUS_MAP[order.status];
            const isExpanded = expandedOrderId === order.id;
            const unpaid = getUnpaidBalance(order);

            return (
              <div 
                key={order.id}
                id={order.id}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm ${
                  isExpanded ? 'border-natural-clay/45 ring-2 ring-natural-clay/5' : 'border-natural-wheat hover:border-natural-ochre/40'
                }`}
              >
                
                {/* Main Card Header Area */}
                <div 
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  
                  {/* Left Side: Order Number & Customer Name */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-xs font-extrabold bg-natural-espresso text-natural-cream px-2 py-0.5 rounded">
                        {order.orderNumber}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentStatusCfg.colorClass}`}>
                        {currentStatusCfg.label}
                      </span>
                      {order.customerCategory && (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-200">
                          ประเภทงาน: {order.customerCategory}
                        </span>
                      )}
                      {order.membershipTier && (
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                          order.membershipTier === 'PRIME' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                          order.membershipTier === 'PRIVILEGE' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                          order.membershipTier === 'TRADER' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          'bg-stone-50 text-stone-800 border-stone-200'
                        }`}>
                          บัตร: {order.membershipTier}
                        </span>
                      )}
                      {order.externalOrderId && (
                        <span className="bg-sky-50 text-sky-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-sky-200">
                          รหัสอ้างอิง: {order.externalOrderId}
                        </span>
                      )}
                      {order.branch && (
                        <span className="bg-purple-50 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-purple-200">
                          🏪 {order.branch}
                        </span>
                      )}
                      {order.sku && (
                        <span className="bg-natural-clay/15 text-natural-clay text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-natural-clay/20 uppercase tracking-wide">
                          SKU: {order.sku}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-serif font-bold text-natural-espresso text-lg leading-tight">
                        {order.customerName}
                      </h4>
                      <p className="text-xs text-natural-espresso/60 flex items-center">
                        <Phone className="h-3 w-3 mr-1 inline" /> {order.customerPhone}
                      </p>
                    </div>
                    <p className="text-xs text-natural-espresso/80 font-medium">
                      ชุด: <span className="text-natural-espresso font-semibold">{order.dressType}</span> | ผ้า: <span className="text-natural-espresso">{order.fabricType} ({order.fabricColor})</span>
                    </p>
                  </div>

                  {/* Right Side: Delivery Target & Price / Expand button */}
                  <div className="flex items-center justify-between w-full md:w-auto md:space-x-6 border-t md:border-0 border-natural-sand pt-3 md:pt-0">
                    
                    <div className="text-left md:text-right space-y-0.5">
                      <p className="text-[10px] text-natural-espresso/40 font-bold uppercase tracking-wider flex items-center md:justify-end">
                        <Calendar className="h-3 w-3 mr-1" /> ส่งมอบวันที่
                      </p>
                      <p className="text-sm font-bold text-natural-espresso">
                        {new Date(order.deliveryDate).toLocaleDateString('th-TH', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-[10px] font-medium text-natural-espresso/60">
                        {(() => {
                          const diff = Math.ceil((new Date(order.deliveryDate).getTime() - new Date("2026-07-02").getTime()) / (1000 * 3600 * 24));
                          if (order.status === OrderStatus.COMPLETED) return "✨ ส่งมอบสำเร็จแล้ว";
                          if (diff === 0) return "🚨 ส่งมอบวันนี้!";
                          if (diff < 0) return `⚠️ เกินกำหนดส่ง ${Math.abs(diff)} วัน`;
                          return `⏳ อีก ${diff} วันส่งชุด`;
                        })()}
                      </p>
                    </div>

                    <div className="text-right space-y-0.5 pl-4 border-l border-natural-sand">
                      <p className="text-[10px] text-natural-espresso/40 font-bold uppercase tracking-wider flex items-center justify-end">
                        <DollarSign className="h-3 w-3" /> ยอดค้างชำระ
                      </p>
                      <p className={`text-sm font-extrabold ${unpaid > 0 ? 'text-natural-clay' : 'text-natural-sage font-semibold'}`}>
                        {unpaid > 0 ? `${unpaid.toLocaleString()} ฿` : 'ครบถ้วนแล้ว ✓'}
                      </p>
                      <p className="text-[10px] text-natural-espresso/50">
                        รวม {order.price.toLocaleString()} ฿
                      </p>
                    </div>

                    <div className="pl-3">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-natural-espresso/40" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-natural-espresso/40" />
                      )}
                    </div>
                  </div>

                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-natural-sand bg-natural-sand/20 p-5 rounded-b-2xl space-y-6">
                    
                    {/* Visual Progress Stepper */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-natural-espresso/60 uppercase tracking-wider flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5" /> ขั้นตอนติดตามงานตัดเย็บ (Update Status Pipeline)
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
                        {statusList.map((status, index) => {
                          const isActive = order.status === status;
                          const isPast = statusList.indexOf(order.status) > index;
                          const cfg = STATUS_MAP[status];

                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateOrderStatus(order.id, status);
                              }}
                              className={`p-2.5 rounded-xl text-center border text-xs transition-all relative flex flex-col justify-between h-20 group cursor-pointer ${
                                isActive 
                                  ? 'bg-natural-espresso border-natural-espresso text-natural-cream shadow-sm scale-[1.02]' 
                                  : isPast 
                                    ? 'bg-natural-sand/70 border-natural-wheat text-natural-espresso/60 hover:bg-natural-sand/90' 
                                    : 'bg-white border-natural-wheat text-natural-espresso/40 hover:border-natural-ochre/35'
                              }`}
                            >
                              <div className="font-bold block tracking-tight text-[11px]">
                                {index + 1}. {cfg.label}
                              </div>
                              <span className={`text-[9px] block text-left mt-1 font-normal leading-tight opacity-90 line-clamp-2 ${isActive ? 'text-natural-sand/80' : 'text-natural-espresso/50'}`}>
                                {cfg.description}
                              </span>
                              
                              {/* Hover tooltip hint */}
                              <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-all text-[8px] font-bold text-natural-clay">
                                คลิกเพื่อปรับ &rarr;
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* Sub-Card A: Measurements Table */}
                      <div className="bg-white p-4 rounded-xl border border-natural-wheat shadow-xs space-y-3 col-span-2">
                        <div className="flex items-center justify-between border-b border-natural-sand pb-2">
                          <h5 className="font-serif font-bold text-natural-espresso text-xs flex items-center">
                            <Ruler className="h-3.5 w-3.5 mr-1.5 text-natural-espresso/60" /> ตารางการวัดตัว (Customer Measurements)
                          </h5>
                          <div className="flex items-center space-x-1.5">
                            {order.measurements.standardSize && (
                              <span className="text-[10px] bg-natural-clay text-white px-2.5 py-0.5 rounded-full font-bold">
                                👗 ไซส์มาตรฐาน: {order.measurements.standardSize}
                              </span>
                            )}
                            {order.customDesign && (
                              <span className="text-[10px] bg-natural-sand border border-natural-wheat text-natural-clay px-2 py-0.5 rounded font-bold">
                                📐 ทรง: {order.customDesign.silhouette} | คอ: {order.customDesign.neckline} | แขน: {order.customDesign.sleeves}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">อก (Chest)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.chest}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">เอว (Waist)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.waist}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">สะโพก (Hips)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.hips}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">ไหล่ (Shoulder)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.shoulder}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">ยาวแขน (Sleeve)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.sleeveLength}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">วงแขน (Armhole)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.armhole}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">ยาวชุด (Length)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.length}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">รอบคอ (Neck)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.neck}″</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">ส่วนสูง (Height)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.height} cm</p>
                          </div>
                          <div className="p-1.5 bg-natural-cream/30 rounded-lg">
                            <p className="text-[10px] text-natural-espresso/45 font-bold">น้ำหนัก (Weight)</p>
                            <p className="text-sm font-mono font-bold text-natural-espresso">{order.measurements.weight || '-'} kg</p>
                          </div>
                          <div className="p-1.5 bg-natural-sand rounded-lg flex items-center justify-center">
                            <span className="text-[9px] text-natural-espresso/50 font-bold uppercase">หน่วยนิ้ว</span>
                          </div>
                        </div>

                        {order.measurements.otherNotes && (
                          <div className="mt-2 text-xs bg-natural-sand/30 p-2.5 rounded-lg border border-natural-wheat/40">
                            <span className="font-bold text-natural-espresso">📌 บันทึกสัดส่วนเพิ่มเติม:</span> {order.measurements.otherNotes}
                          </div>
                        )}
                      </div>

                      {/* Sub-Card B: Order Details & Contacts */}
                      <div className="bg-white p-4 rounded-xl border border-natural-wheat shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <h5 className="font-serif font-bold text-natural-espresso text-xs border-b border-natural-sand pb-2">
                            📝 รายละเอียดเพิ่มเติมของชิ้นงาน
                          </h5>
                          <div className="space-y-1.5 text-xs text-natural-espresso/80">
                            {order.sku && (
                              <div className="pb-1">
                                <span className="bg-natural-clay/10 text-natural-clay text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-natural-clay/20 uppercase">
                                  SKU: {order.sku}
                                </span>
                              </div>
                            )}
                            {order.customerSocial && (() => {
                              const socialInfo = getSocialInfo(order.customerSocial);
                              return (
                                <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                                  <span className="font-semibold text-natural-espresso/60 flex items-center gap-1 shrink-0">
                                    {socialInfo?.icon || <Instagram className="h-3.5 w-3.5 text-natural-clay" />}
                                    <span>ช่องทางติดต่อ:</span>
                                  </span>
                                  <span className="font-bold text-natural-espresso bg-natural-sand/50 px-1.5 py-0.5 rounded border border-natural-wheat/50 text-[11px]">
                                    {order.customerSocial}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDirectLineChat(order);
                                    }}
                                    className="bg-[#06C755] hover:bg-[#05b34c] text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-xs transition-all cursor-pointer inline-flex shrink-0 ml-1.5"
                                    title="คลิกเพื่อเปิดคุยแชท LINE กับลูกค้าทันที"
                                  >
                                    <span>คุย LINE 💬</span>
                                  </button>
                                </div>
                              );
                            })()}
                            {order.customerCategory && (
                              <p className="flex items-center">
                                <span className="font-semibold text-natural-espresso/60 mr-1.5">🏷️ ประเภทงาน:</span>
                                <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">{order.customerCategory}</span>
                              </p>
                            )}
                            {order.membershipTier && (
                              <p className="flex items-center">
                                <span className="font-semibold text-natural-espresso/60 mr-1.5">💳 ประเภทบัตรสมาชิก:</span>
                                <span className={`font-bold px-1.5 py-0.5 rounded border text-[10px] ${
                                  order.membershipTier === 'PRIME' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                                  order.membershipTier === 'PRIVILEGE' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                  order.membershipTier === 'TRADER' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  'bg-stone-50 text-stone-800 border-stone-200'
                                }`}>{order.membershipTier}</span>
                              </p>
                            )}

                            {order.externalOrderId && (
                              <p className="flex items-center">
                                <span className="font-semibold text-natural-espresso/60 mr-1.5">🔗 รหัสออเดอร์จากกัน:</span>
                                <span className="font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[10px] font-mono">{order.externalOrderId}</span>
                              </p>
                            )}
                            <p>
                              📅 <span className="font-semibold text-natural-espresso/50">วันที่สั่งซื้อ:</span> {order.orderDate}
                            </p>
                            <p>
                              💵 <span className="font-semibold text-natural-espresso/50">ราคาชุดทั้งหมด:</span> {order.price.toLocaleString()} บาท
                            </p>
                            {order.discount ? (
                              <p>
                                🏷️ <span className="font-semibold text-natural-espresso/50 text-amber-700">ส่วนลดพิเศษ:</span> <span className="text-amber-700 font-bold">-{order.discount.toLocaleString()} บาท</span>
                              </p>
                            ) : null}
                            <p>
                              💰 <span className="font-semibold text-natural-espresso/50">มัดจำโอนมา:</span> {order.deposit.toLocaleString()} บาท
                              {order.paymentMethod && (
                                <span className="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md inline-block">
                                  ช่องทาง: {order.paymentMethod}
                                </span>
                              )}
                            </p>
                            <p className="font-bold text-natural-clay bg-natural-sand/30 px-2 py-1 rounded-lg border border-natural-wheat/40 inline-block mt-1">
                              📊 ยอดคงเหลือสุทธิวันรับชุด: {Math.max(0, order.price - order.deposit - (order.discount || 0)).toLocaleString()} บาท
                            </p>
                            {order.fabricType && (
                              <p className="mt-1">
                                🧥 <span className="font-semibold text-natural-espresso/50">ประเภทเนื้อผ้า:</span> {order.fabricType}
                              </p>
                            )}
                          </div>

                          {order.notes && (
                            <div className="text-xs bg-natural-sand/30 p-2.5 rounded-lg border border-natural-wheat/40 text-natural-espresso/80 italic">
                              "{order.notes}"
                            </div>
                          )}

                          {order.customImage && (
                            <div className="pt-2 border-t border-natural-sand/50">
                              <p className="text-[10px] text-natural-espresso/45 font-bold mb-1.5 flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1 text-natural-clay" />
                                <span>รูปภาพแบบชุดสั่งตัด (Design Reference Photo)</span>
                              </p>
                              <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/5 max-h-48 group">
                                <img 
                                  src={order.customImage} 
                                  alt="Custom Reference" 
                                  className="w-full object-contain max-h-48 rounded-lg cursor-zoom-in"
                                  referrerPolicy="no-referrer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const imgWindow = window.open();
                                    if (imgWindow) {
                                      imgWindow.document.write(`<img src="${order.customImage}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {order.slipImage && (
                            <div className="pt-2 border-t border-natural-sand/50">
                              <p className="text-[10px] text-natural-espresso/45 font-bold mb-1.5 flex items-center">
                                <ImageIcon className="h-3 w-3 mr-1 text-natural-clay" />
                                <span>หลักฐานการชำระเงิน (Payment Slip Reference)</span>
                              </p>
                              <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/5 max-h-48 group flex justify-start">
                                <img 
                                  src={order.slipImage} 
                                  alt="Payment Slip" 
                                  className="h-40 w-auto object-contain rounded-lg cursor-zoom-in border border-natural-wheat"
                                  referrerPolicy="no-referrer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const imgWindow = window.open();
                                    if (imgWindow) {
                                      imgWindow.document.write(`<img src="${order.slipImage}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrintingOrder(order);
                              }}
                              className="bg-natural-clay hover:bg-natural-clay-dark text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs flex-1"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span>พิมพ์ใบออเดอร์ 🖨️</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDirectLineChat(order);
                              }}
                              className="bg-[#06C755] hover:bg-[#05b34c] text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs flex-1"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>คุย LINE (แอดมิน) 💬</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentStatusCfg = STATUS_MAP[order.status];
                                const discountVal = order.discount || 0;
                                const unpaid = Math.max(0, order.price - order.deposit - discountVal);
                                const formattedDelivery = new Date(order.deliveryDate).toLocaleDateString('th-TH', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                });
                                const portalUrl = `${publicUrl}?tab=customer&search=${order.customerPhone}&mode=customer`;
                                const message = `⚜️ อัปเดตสถานะชุดสั่งตัด NUNUH Boutique ⚜️\n\nเรียนคุณ: ${order.customerName}\nรหัสออเดอร์: ${order.orderNumber}\nประเภทชุด: ${order.dressType}\n\n📍 สถานะปัจจุบัน: [${currentStatusCfg.label}]\n➡️ "${currentStatusCfg.description}"\n\n📅 กำหนดส่งมอบ: ${formattedDelivery}\n\nท่านสามารถตรวจสอบข้อมูลสัดส่วนและติดตามความคืบหน้าแบบละเอียดด้วยตนเองได้ที่นี่:\n🔗 ${portalUrl}\n\nขอขอบพระคุณที่เลือกใช้บริการค่ะ ✨`;
                                
                                navigator.clipboard.writeText(message);
                                alert(`คัดลอกข้อความสถานะอัปเดตของ ${order.customerName} เรียบร้อยแล้ว! สามารถนำไปส่งให้ลูกค้าได้ทันทีค่ะ 📋`);
                              }}
                              className="bg-natural-sand hover:bg-natural-wheat/80 text-natural-espresso text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-natural-wheat/50 flex-1"
                            >
                              <span>คัดลอกข้อความ 📋</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenLineOaChat(order);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs flex-1"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>แชท LINE OA 🟢</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendStatusDirectly(order);
                              }}
                              className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs flex-1"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>ส่งสถานะเข้า LINE 🚀</span>
                            </button>
                          </div>
                        </div>

                        {/* Action buttons (Delete & Edit) */}
                        <div className="pt-3 border-t border-natural-sand flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingOrder(order);
                              }}
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 p-1 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>แก้ไขออเดอร์นี้</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`คุณต้องการยกเลิกและลบออเดอร์ของ ${order.customerName} ใช่หรือไม่?`)) {
                                  onDeleteOrder(order.id);
                                }
                              }}
                              className="text-[11px] text-natural-clay hover:text-natural-clay-dark font-semibold flex items-center space-x-1 p-1 hover:bg-natural-sand/40 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>ลบออเดอร์นี้</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleExpand(order.id)}
                            className="text-[11px] text-natural-espresso/60 hover:text-natural-espresso font-bold uppercase tracking-wider cursor-pointer"
                          >
                            ปิดรายละเอียด &uarr;
                          </button>
                        </div>

                      </div>

                    </div>

                    {/* Customer Body Photos Section */}
                    <div className="bg-white p-5 rounded-xl border border-natural-wheat shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-natural-sand pb-2">
                        <h5 className="font-serif font-bold text-natural-espresso text-xs flex items-center space-x-1.5">
                          <Camera className="h-3.5 w-3.5 text-natural-clay" />
                          <span>📸 รูปถ่ายลูกค้าสำหรับตัดเย็บ (Customer Body Proportions)</span>
                        </h5>
                        <span className="text-[10px] text-natural-espresso/50 font-medium">ภาพสัดส่วนเพื่อความแม่นยำในการทำแพทเทิร์น</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Front View */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-natural-espresso/70 text-center">ภาพถ่ายด้านหน้า (Front View)</p>
                          {order.customerPhotoFront ? (
                            <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/5 max-h-48 group flex items-center justify-center">
                              <img 
                                src={order.customerPhotoFront} 
                                alt="Front proportion" 
                                className="w-full object-contain max-h-48 rounded-lg cursor-zoom-in"
                                referrerPolicy="no-referrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const imgWindow = window.open();
                                  if (imgWindow) {
                                    imgWindow.document.write(`<img src="${order.customerPhotoFront}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="border border-dashed border-natural-sand rounded-xl p-6 text-center text-natural-espresso/45 bg-natural-cream/10 text-xs italic flex flex-col items-center justify-center h-32">
                              <span>ไม่มีรูปถ่ายด้านหน้า</span>
                            </div>
                          )}
                        </div>

                        {/* Side View */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-natural-espresso/70 text-center">ภาพถ่ายด้านข้าง (Side View)</p>
                          {order.customerPhotoSide ? (
                            <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/5 max-h-48 group flex items-center justify-center">
                              <img 
                                src={order.customerPhotoSide} 
                                alt="Side proportion" 
                                className="w-full object-contain max-h-48 rounded-lg cursor-zoom-in"
                                referrerPolicy="no-referrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const imgWindow = window.open();
                                  if (imgWindow) {
                                    imgWindow.document.write(`<img src="${order.customerPhotoSide}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="border border-dashed border-natural-sand rounded-xl p-6 text-center text-natural-espresso/45 bg-natural-cream/10 text-xs italic flex flex-col items-center justify-center h-32">
                              <span>ไม่มีรูปถ่ายด้านข้าง</span>
                            </div>
                          )}
                        </div>

                        {/* Back View */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-natural-espresso/70 text-center">ภาพถ่ายด้านหลัง (Back View)</p>
                          {order.customerPhotoBack ? (
                            <div className="relative rounded-xl overflow-hidden border border-natural-wheat bg-natural-sand/5 max-h-48 group flex items-center justify-center">
                              <img 
                                src={order.customerPhotoBack} 
                                alt="Back proportion" 
                                className="w-full object-contain max-h-48 rounded-lg cursor-zoom-in"
                                referrerPolicy="no-referrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const imgWindow = window.open();
                                  if (imgWindow) {
                                    imgWindow.document.write(`<img src="${order.customerPhotoBack}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="border border-dashed border-natural-sand rounded-xl p-6 text-center text-natural-espresso/45 bg-natural-cream/10 text-xs italic flex flex-col items-center justify-center h-32">
                              <span>ไม่มีรูปถ่ายด้านหลัง</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      <PrintOrderModal 
        order={printingOrder} 
        isOpen={printingOrder !== null} 
        onClose={() => setPrintingOrder(null)} 
      />

      {/* Google Sheets Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-natural-espresso/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-natural-wheat relative space-y-6">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-natural-espresso/40 hover:text-natural-espresso p-1.5 rounded-lg hover:bg-natural-sand transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Google Sheets Integration
              </span>
              <h3 className="text-xl font-serif font-extrabold text-natural-espresso">
                ส่งออกข้อมูลออเดอร์ไปยัง Google Sheets 📊
              </h3>
              <p className="text-xs text-natural-espresso/60">
                เลือกรูปแบบที่ต้องการเพื่อนำข้อมูลออเดอร์ตัดเย็บทั้งหมดไปใส่ใน Google Sheets หรือแชร์กับทีมงาน
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Copy-Paste TSV */}
              <div className="border border-natural-wheat hover:border-emerald-500/50 p-5 rounded-xl bg-natural-cream/10 space-y-3 transition-all flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-emerald-800 flex items-center space-x-1.5">
                    <span>📋 วิธีคัดลอก-วาง (แนะนำ)</span>
                  </h4>
                  <p className="text-xs text-natural-espresso/70 leading-relaxed">
                    คัดลอกข้อมูลทั้งหมดในรูปแบบตารางเว้นวรรค (TSV) แล้วนำไปกด <strong>Ctrl + V</strong> หรือ <strong>Cmd + V</strong> ใน Google Sheets ได้ทันที ไม่ต้องเซฟไฟล์!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const tsv = generateTSV();
                    await navigator.clipboard.writeText(tsv);
                    alert('คัดลอกข้อมูลตารางเรียบร้อยแล้ว! สามารถเปิด Google Sheets แล้วกดปุ่มวาง (Ctrl+V) ได้เลยค่ะ');
                  }}
                  className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  คัดลอกข้อมูลตาราง (Copy TSV)
                </button>
              </div>

              {/* Option 2: Download CSV */}
              <div className="border border-natural-wheat hover:border-emerald-500/50 p-5 rounded-xl bg-natural-cream/10 space-y-3 transition-all flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-emerald-800 flex items-center space-x-1.5">
                    <span>💾 ดาวน์โหลดไฟล์ CSV</span>
                  </h4>
                  <p className="text-xs text-natural-espresso/70 leading-relaxed">
                    ดาวน์โหลดเป็นไฟล์ CSV (เข้ารหัสภาษาไทย) เพื่อนำไปกดนำเข้า (Import) ใน Google Sheets, Microsoft Excel หรือโปรแกรมอื่นๆ ได้อย่างสมบูรณ์แบบ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    downloadCSV();
                    alert('ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้วค่ะ! ท่านสามารถอัปโหลดไฟล์นี้เข้า Google Sheets ได้เลย');
                  }}
                  className="w-full py-2 bg-neutral-800 text-white font-bold text-xs rounded-lg hover:bg-neutral-900 transition-colors shadow-xs cursor-pointer"
                >
                  ดาวน์โหลดไฟล์ CSV
                </button>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 space-y-3">
              <h5 className="font-bold text-xs text-emerald-800 uppercase tracking-wider">
                💡 ขั้นตอนการนำเข้า Google Sheets อย่างง่าย:
              </h5>
              <ol className="text-xs text-natural-espresso/80 space-y-2 list-decimal pl-4 leading-relaxed">
                <li>เปิดเว็บ <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">sheets.google.com</a> และสร้างสเปรดชีตใหม่</li>
                <li>คลิกที่ปุ่ม <strong>"คัดลอกข้อมูลตาราง (Copy TSV)"</strong> ด้านบน</li>
                <li>คลิกเลือกช่อง <strong>A1</strong> (ช่องแรกซ้ายบนสุด) ใน Google Sheets ของท่าน</li>
                <li>กดปุ่ม <strong>Ctrl + V</strong> (สำหรับ Windows) หรือ <strong>Cmd + V</strong> (สำหรับ Mac) บนคีย์บอร์ด ข้อมูลทั้งหมดจะแยกเป็นคอลัมน์ให้อย่างสวยงามทันที!</li>
              </ol>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-natural-sand hover:bg-natural-wheat text-natural-espresso font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={(updated) => {
            if (onEditOrder) {
              onEditOrder(updated);
            }
            setEditingOrder(null);
          }}
        />
      )}


    </div>
  );
}
