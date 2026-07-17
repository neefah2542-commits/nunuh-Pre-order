import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, CatalogueItem, STATUS_MAP, Measurements, STANDARD_SIZE_CHART } from '../types';
import { 
  Search, 
  Sparkles, 
  Phone, 
  Calendar, 
  DollarSign, 
  Clock, 
  Ruler, 
  CheckCircle2, 
  Scissors, 
  Instagram, 
  User, 
  FileText, 
  Info, 
  Check, 
  ChevronRight, 
  X,
  MessageSquare,
  Share2,
  Bookmark,
  Image as ImageIcon,
  UploadCloud,
  Printer,
  Award,
  CreditCard,
  History,
  Camera,
  Trash2
} from 'lucide-react';
import PrintOrderModal from './PrintOrderModal';

interface CustomerPortalProps {
  orders: Order[];
  catalogue: CatalogueItem[];
  onAddOrder: (newOrder: Order) => void;
  onUpdateOrders?: (updatedOrders: Order[]) => void;
  nextOrderNumber: string;
  isCustomerLocked?: boolean;
}

export default function CustomerPortal({ orders, catalogue, onAddOrder, onUpdateOrders, nextOrderNumber, isCustomerLocked = false }: CustomerPortalProps) {
  // States for Order Tracking
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // States for Customer Profile & Loyalty Card
  const [profileAvatar, setProfileAvatar] = useState<string>('');
  const [showPrivileges, setShowPrivileges] = useState<boolean>(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'all' | 'active' | 'completed'>('all');

  // Customer Profile Editing States
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editSocial, setEditSocial] = useState<string>('');

  // Sync avatar when searchedOrders changes
  useEffect(() => {
    if (searchedOrders && searchedOrders.length > 0) {
      const cleanPhone = searchedOrders[0].customerPhone.replace(/[\s-()]/g, '');
      const savedAvatar = localStorage.getItem(`nunuh_customer_avatar_${cleanPhone}`);
      if (savedAvatar) {
        setProfileAvatar(savedAvatar);
      } else {
        setProfileAvatar('');
      }
    } else {
      setProfileAvatar('');
    }
  }, [searchedOrders]);

  // Handle Avatar Portrait upload & conversion to Base64
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && searchedOrders && searchedOrders.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64 = uploadEvent.target.result as string;
          const cleanPhone = searchedOrders[0].customerPhone.replace(/[\s-()]/g, '');
          localStorage.setItem(`nunuh_customer_avatar_${cleanPhone}`, base64);
          setProfileAvatar(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    if (searchedOrders && searchedOrders.length > 0) {
      const cleanPhone = searchedOrders[0].customerPhone.replace(/[\s-()]/g, '');
      localStorage.removeItem(`nunuh_customer_avatar_${cleanPhone}`);
      setProfileAvatar('');
    }
  };

  const startEditingProfile = (currentName: string, currentPhone: string, currentSocial: string) => {
    setEditName(currentName.replace(/^คุณ\s*/, '').trim());
    setEditPhone(currentPhone);
    setEditSocial(currentSocial === 'ไม่มีระบุช่องทางติดต่อ' ? '' : currentSocial);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!searchedOrders || searchedOrders.length === 0 || !onUpdateOrders) return;

    const originalPhone = searchedOrders[0].customerPhone;
    const cleanOriginalPhone = originalPhone.replace(/[\s-()]/g, '');
    const cleanNewPhone = editPhone.replace(/[\s-()]/g, '');

    const finalName = editName.trim().startsWith('คุณ') ? editName.trim() : `คุณ ${editName.trim()}`;
    const finalPhone = editPhone.trim();
    const finalSocial = editSocial.trim();

    // 1. Update all orders in the global list that belong to this customer
    const updatedGlobalOrders = orders.map(order => {
      const orderCleanPhone = order.customerPhone.replace(/[\s-()]/g, '');
      if (orderCleanPhone === cleanOriginalPhone) {
        return {
          ...order,
          customerName: finalName,
          customerPhone: finalPhone,
          customerSocial: finalSocial || undefined
        };
      }
      return order;
    });

    // 2. Sync localStorage items if phone changed
    if (cleanOriginalPhone !== cleanNewPhone) {
      // Copy avatar
      const savedAvatar = localStorage.getItem(`nunuh_customer_avatar_${cleanOriginalPhone}`);
      if (savedAvatar) {
        localStorage.setItem(`nunuh_customer_avatar_${cleanNewPhone}`, savedAvatar);
        localStorage.removeItem(`nunuh_customer_avatar_${cleanOriginalPhone}`);
      }
      // Copy birthday or other localStorage customer-specific settings if any
      const savedBirthday = localStorage.getItem(`nunuh_customer_birthday_${cleanOriginalPhone}`);
      if (savedBirthday) {
        localStorage.setItem(`nunuh_customer_birthday_${cleanNewPhone}`, savedBirthday);
        localStorage.removeItem(`nunuh_customer_birthday_${cleanOriginalPhone}`);
      }
    }

    // 3. Trigger global state save
    onUpdateOrders(updatedGlobalOrders);

    // 4. Update local searchedOrders state to reflect the edited profile and orders
    const updatedSearchedOrders = searchedOrders.map(order => {
      return {
        ...order,
        customerName: finalName,
        customerPhone: finalPhone,
        customerSocial: finalSocial || undefined
      };
    });
    setSearchedOrders(updatedSearchedOrders);

    // If search query matches the phone number, update it to keep the search query updated too
    if (searchQuery.replace(/[\s-()]/g, '') === cleanOriginalPhone) {
      setSearchQuery(finalPhone);
    }

    setIsEditingProfile(false);
  };

  // Auto-search if search param is provided in URL or stored in localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let searchQueryParam = params.get('search');
    
    if (searchQueryParam) {
      localStorage.setItem('nunuh_customer_portal_phone', searchQueryParam);
    } else {
      searchQueryParam = localStorage.getItem('nunuh_customer_portal_phone');
    }

    if (searchQueryParam) {
      setSearchQuery(searchQueryParam);
      
      const query = searchQueryParam.trim().toLowerCase();
      const cleanQuery = query.replace(/[\s-()]/g, '');

      const matched = orders.filter(order => {
        const cleanPhone = order.customerPhone.replace(/[\s-()]/g, '');
        const orderNum = order.orderNumber.toLowerCase();
        const customerName = order.customerName.toLowerCase();

        if (isCustomerLocked) {
          return cleanPhone === cleanQuery || orderNum === query;
        }

        return (
          cleanPhone.includes(cleanQuery) || 
          orderNum.includes(query) || 
          customerName.includes(query) ||
          (order.sku && order.sku.toLowerCase().includes(query))
        );
      });

      setSearchedOrders(matched);
      setHasSearched(true);
    }
  }, [orders, isCustomerLocked]);

  // Handle Search Orders
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Save to localStorage for future visits!
    localStorage.setItem('nunuh_customer_portal_phone', query);

    // Strip out dashes, spaces, parentheses for phone number search matching
    const cleanQuery = query.replace(/[\s-()]/g, '');

    const matched = orders.filter(order => {
      const cleanPhone = order.customerPhone.replace(/[\s-()]/g, '');
      const orderNum = order.orderNumber.toLowerCase();
      const customerName = order.customerName.toLowerCase();

      if (isCustomerLocked) {
        return cleanPhone === cleanQuery || orderNum === query;
      }

      return (
        cleanPhone.includes(cleanQuery) || 
        orderNum.includes(query) || 
        customerName.includes(query) ||
        (order.sku && order.sku.toLowerCase().includes(query))
      );
    });

    setSearchedOrders(matched);
    setHasSearched(true);
  };

  // Get Progress Percentage based on Status
  const getStatusProgress = (status: OrderStatus): number => {
    switch (status) {
      case OrderStatus.RECEIVED: return 15;
      case OrderStatus.DESIGNING: return 30;
      case OrderStatus.CUTTING: return 48;
      case OrderStatus.SEWING: return 66;
      case OrderStatus.FITTING: return 80;
      case OrderStatus.READY: return 95;
      case OrderStatus.COMPLETED: return 100;
      default: return 0;
    }
  };



  return (
    <div className="space-y-12">
      
      {/* HEADER SECTION */}
      <div className="bg-natural-espresso text-natural-cream p-8 rounded-3xl text-center space-y-3 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-natural-clay/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-natural-ochre/15 rounded-full blur-3xl"></div>
        
        <div className="mx-auto bg-natural-sand/15 w-14 h-14 rounded-2xl flex items-center justify-center mb-2">
          <Sparkles className="h-7 w-7 text-natural-ochre" />
        </div>
        
        <h3 className="font-serif font-extrabold text-2xl sm:text-3xl tracking-wide text-natural-sand">
          NUNUH Customer Lounge
        </h3>
        <p className="text-sm max-w-xl mx-auto text-natural-cream/80 leading-relaxed">
          ยินดีต้อนรับเข้าสู่พื้นที่พิเศษสำหรับลูกค้าคนสำคัญ คุณสามารถตรวจสอบสถานะ คิวตัดเย็บ และขนาดสัดส่วนการวัดตัวของท่าน หรือเลือกสรรดีไซน์ชุดที่ต้องการส่งต่อให้ทางดีไซเนอร์พิจารณาได้ทันทีค่ะ
        </p>
      </div>

      {/* SECTION 1: SEARCH & TRACK STATUS */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-natural-wheat shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-natural-sand pb-4">
          <div className="p-2 bg-natural-sand text-natural-clay rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-natural-espresso">ค้นหาประวัติการสั่งตัด & ตรวจสอบสถานะชุด</h4>
            <p className="text-xs text-natural-espresso/60">กรอกเบอร์โทรศัพท์ (เช่น 0812345678) หรือหมายเลขคำสั่งซื้อ (เช่น NU-26001)</p>
          </div>
        </div>

        {/* Search Bar */}
        {isCustomerLocked && hasSearched && searchedOrders && searchedOrders.length > 0 ? (
          <div className="bg-natural-sand/15 border border-natural-wheat rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex items-center space-x-3 pl-2">
              <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="pl-2">
                <p className="text-xs font-bold text-natural-espresso">
                  ระบบรักษาความปลอดภัยส่วนบุคคล (Secure Customer Portal)
                </p>
                <p className="text-[11px] text-natural-espresso/60 mt-0.5">
                  แสดงข้อมูลคิวงานสั่งตัดเฉพาะหมายเลข: <span className="font-mono font-bold text-natural-clay">{searchQuery}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
              🛡️ สิทธิ์การเข้าถึงแบบจำกัด
            </span>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-natural-espresso/45" />
              <input
                type="text"
                placeholder="ป้อนเบอร์มือถือ หรือ หมายเลขคิวออเดอร์ เพื่อติดตาม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-12 pr-4 py-3.5 rounded-xl border border-natural-wheat focus:outline-none focus:ring-2 focus:ring-natural-clay/20 focus:border-natural-clay bg-natural-cream/15 text-natural-espresso font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-natural-espresso hover:bg-natural-clay text-natural-cream hover:text-white font-serif font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
            >
              ค้นหารายการออเดอร์
            </button>
          </form>
        )}

        {/* Support LINE shortcut */}
        <div className="bg-[#06C755]/5 border border-[#06C755]/20 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full md:w-auto">
            <div className="p-2.5 bg-[#06C755] text-white rounded-xl shrink-0 animate-bounce shadow-md">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-natural-espresso">แชทติดต่อดีไซเนอร์ NUNUH ผ่าน LINE Official</p>
              <p className="text-xs text-natural-espresso/70 max-w-xl">
                กดปุ่ม <span className="font-bold text-[#05b34c]">"ไปยังไลน์ @237aynfq"</span> เพื่อเพิ่มเพื่อนและคุยกัน สามารถแชทคุยกับแอดมิน/ดีไซเนอร์ได้ทันที หรือสแกน QR Code เพื่อเพิ่มเพื่อนผ่าน LINE ได้เลยค่ะ 📲
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto shrink-0 justify-center md:justify-end">
            {/* Elegant QR Code wrapper */}
            <div className="bg-white p-2 rounded-xl border border-[#06C755]/20 shadow-xs flex flex-col items-center shrink-0">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fline.me%2FR%2Fti%2Fp%2F%40237aynfq" 
                alt="LINE Official QR Code @237aynfq"
                className="w-20 h-20 md:w-24 md:h-24 transition-transform hover:scale-105 duration-200"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-bold text-[#05b34c] mt-1.5 flex items-center gap-1">
                <span>สแกน QR Code แอดไลน์</span>
              </span>
            </div>

            <a
              href="https://line.me/R/oaMessage/@237aynfq/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>ไปยังไลน์ @237aynfq 💬</span>
            </a>
          </div>
        </div>

        {/* Search Results Display */}
        <div className="space-y-6">
          {hasSearched && searchedOrders && searchedOrders.length > 0 && (() => {
            const mainOrder = searchedOrders[0];
            const cName = mainOrder.customerName;
            const cPhone = mainOrder.customerPhone;
            const cSocial = mainOrder.customerSocial || 'ไม่มีระบุช่องทางติดต่อ';
            const cCategory = mainOrder.customerCategory || 'ทั่วไป';
            const cMeasurements = mainOrder.measurements;

            const totalOrders = searchedOrders.length;
            const activeOrdersList = searchedOrders.filter(o => o.status !== OrderStatus.COMPLETED);
            const pastOrdersList = searchedOrders.filter(o => o.status === OrderStatus.COMPLETED);
            const totalSpent = searchedOrders.reduce((sum, o) => sum + o.price - (o.discount || 0), 0);
            const loyaltyPoints = Math.floor(totalSpent / 100);

            // Priority order of tiers: 1. PRIME, 2. PRIVILEGE, 3. TRADER, 4. MEMBER
            const tierPriority: Record<'PRIME' | 'PRIVILEGE' | 'TRADER' | 'MEMBER', number> = {
              'PRIME': 1,
              'PRIVILEGE': 2,
              'TRADER': 3,
              'MEMBER': 4
            };

            // Check if any order has an explicit membershipTier set and pick the highest priority one
            let explicitTier: 'PRIME' | 'PRIVILEGE' | 'TRADER' | 'MEMBER' | null = null;
            for (const order of searchedOrders) {
              if (order.membershipTier) {
                if (!explicitTier || tierPriority[order.membershipTier] < tierPriority[explicitTier]) {
                  explicitTier = order.membershipTier;
                }
              }
            }

            let tierId: 'PRIME' | 'PRIVILEGE' | 'TRADER' | 'MEMBER' = 'MEMBER';
            if (explicitTier) {
              tierId = explicitTier;
            } else {
              // Fallback based on job type and orders count
              if (cCategory === 'IDD') {
                tierId = 'PRIME';
              } else if (cCategory === 'IDH') {
                tierId = 'PRIVILEGE';
              } else if (totalOrders >= 3) {
                tierId = 'TRADER';
              } else {
                tierId = 'MEMBER';
              }
            }

            let tierName = tierId;
            let tierFullName = '';
            let tierCardBg = '';
            let tierBadgeBg = '';

            if (tierId === 'PRIME') {
              tierFullName = 'PRIME VIP ELITE';
              tierCardBg = 'bg-gradient-to-br from-black via-zinc-900 to-stone-950 text-yellow-100 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]';
              tierBadgeBg = 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30';
            } else if (tierId === 'PRIVILEGE') {
              tierFullName = 'PRIVILEGE ROYAL VIP';
              tierCardBg = 'bg-gradient-to-br from-[#3b0712] via-[#5c0d1e] to-[#1a0206] text-rose-100 border border-rose-500/30';
              tierBadgeBg = 'bg-rose-500/15 text-rose-700 border-rose-500/30';
            } else if (tierId === 'TRADER') {
              tierFullName = 'TRADER GOLD MEMBER';
              tierCardBg = 'bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#043e2e] text-emerald-100 border border-emerald-400/20';
              tierBadgeBg = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
            } else {
              tierFullName = 'STANDARD BOUTIQUE MEMBER';
              tierCardBg = 'bg-gradient-to-br from-[#2c221e] via-[#1a1311] to-[#2c221e] text-natural-cream border border-natural-wheat/25';
              tierBadgeBg = 'bg-natural-espresso/10 text-natural-espresso border-natural-espresso/20';
            }

            // Filter displayed list based on selection tab
            const displayedOrders = searchedOrders.filter(order => {
              if (activeHistoryTab === 'active') return order.status !== OrderStatus.COMPLETED;
              if (activeHistoryTab === 'completed') return order.status === OrderStatus.COMPLETED;
              return true;
            });

            return (
              <div className="space-y-8 animate-fade-in">
                {/* 1. CUSTOMER PROFILE & MEMBERSHIP CARD DASHBOARD */}
                <div id="customer-profile-dashboard" className="bg-gradient-to-br from-[#fbfaf8] via-white to-[#f6f4ee] p-6 sm:p-8 rounded-3xl border border-natural-wheat/70 shadow-xs space-y-8">
                  {/* TOP LEVEL */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-natural-sand pb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-natural-espresso text-natural-cream rounded-xl shadow-xs">
                        <User className="h-6 w-6 text-natural-ochre" />
                      </div>
                      <div>
                        <h3 className="font-serif font-extrabold text-xl text-natural-espresso">ข้อมูลโปรไฟล์ผู้สั่งตัด (Client Profile Dashboard)</h3>
                        <p className="text-xs text-natural-espresso/60">ขอบคุณที่คุณให้ NUNUH Boutique ได้ดูแลออกแบบสรรสร้างงานศิลปะแพทเทิร์นของคุณค่ะ</p>
                      </div>
                    </div>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Client Portrait */}
                    <div className="space-y-6 flex flex-col justify-between">
                      {/* Portrait Photo Upload & Display */}
                      <div className="bg-white p-5 rounded-2xl border border-natural-sand shadow-2xs space-y-4">
                        <h5 className="font-serif font-bold text-xs text-natural-espresso flex items-center space-x-2 border-b border-natural-sand pb-2">
                          <span>🖼️ รูปลูกค้าคนสำคัญ (Client Portrait)</span>
                        </h5>
                        
                        <div className="flex items-center space-x-5">
                          <div className="relative group flex-shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-natural-clay/30 bg-natural-sand/10 flex items-center justify-center relative shadow-inner">
                              {profileAvatar ? (
                                <img 
                                  src={profileAvatar} 
                                  alt="Client Portrait" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center text-natural-espresso/25 flex flex-col items-center">
                                  <User className="h-10 w-10 text-natural-espresso/20" />
                                  <span className="text-[9px] font-bold text-natural-espresso/40">No Photo</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Camera upload overlay */}
                            <label className="absolute bottom-0 right-0 bg-natural-clay text-white hover:bg-natural-clay-dark p-1.5 rounded-full shadow-md cursor-pointer transition-transform hover:scale-105 border border-white">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleAvatarUpload}
                              />
                              <Camera className="h-3.5 w-3.5" />
                            </label>
                          </div>
                          
                          <div className="space-y-1 flex-1">
                            {isEditingProfile ? (
                              <div className="space-y-2 w-full animate-fade-in text-xs">
                                <div>
                                  <label className="block text-[9px] font-bold text-natural-espresso/50 uppercase">ชื่อผู้สั่งตัด (Name)</label>
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full text-xs px-2 py-1 rounded border border-natural-sand focus:outline-none focus:ring-1 focus:ring-natural-clay bg-white text-natural-espresso font-medium"
                                    placeholder="ชื่อ-นามสกุล"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-natural-espresso/50 uppercase">เบอร์โทรศัพท์ (Phone)</label>
                                  <input
                                    type="text"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="w-full text-xs px-2 py-1 rounded border border-natural-sand focus:outline-none focus:ring-1 focus:ring-natural-clay bg-white text-natural-espresso font-medium"
                                    placeholder="เบอร์โทรศัพท์"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-natural-espresso/50 uppercase">Line / ช่องทางติดต่อ (Contact)</label>
                                  <input
                                    type="text"
                                    value={editSocial}
                                    onChange={(e) => setEditSocial(e.target.value)}
                                    className="w-full text-xs px-2 py-1 rounded border border-natural-sand focus:outline-none focus:ring-1 focus:ring-natural-clay bg-white text-natural-espresso font-medium"
                                    placeholder="Line ID / IG"
                                  />
                                </div>
                                <div className="flex gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={handleSaveProfile}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    บันทึก
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-750 px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    ยกเลิก
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1.5">
                                  <h4 className="font-serif font-black text-base text-natural-espresso leading-tight">
                                    คุณ {cName.replace('คุณ', '').trim()}
                                  </h4>
                                </div>
                                <p className="text-xs text-natural-espresso/70 font-medium flex items-center">
                                  <Phone className="h-3.5 w-3.5 mr-1.5 text-natural-clay" /> {cPhone}
                                </p>
                                <div className="text-xs text-natural-espresso/60 font-medium flex flex-wrap items-center gap-1.5">
                                  <span className="text-natural-clay">✉️ ช่องทางติดต่อ:</span>
                                  <a 
                                    href="https://line.me/R/oaMessage/@237aynfq/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#06C755]/10 hover:bg-[#06C755]/20 text-[#05b34c] font-black px-2 py-0.5 rounded border border-[#06C755]/30 inline-flex items-center space-x-1 transition-all"
                                    title="คลิกเพื่อแชทกับแอดมิน @237aynfq บน LINE ทันที"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{cSocial} (LINE @237aynfq)</span>
                                  </a>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingProfile(cName, cPhone, cSocial)}
                                    className="text-[10px] text-natural-clay hover:text-natural-clay/85 font-bold underline cursor-pointer"
                                  >
                                    แก้ไขข้อมูล
                                  </button>
                                  
                                  {profileAvatar && (
                                    <button 
                                      type="button"
                                      onClick={handleRemoveAvatar}
                                      className="text-[10px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer"
                                    >
                                      ลบรูปโปรไฟล์
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Support Summary (replacing loyalty card) */}
                    <div className="space-y-6 flex flex-col justify-between">
                      <div className="bg-white p-5 rounded-2xl border border-natural-sand shadow-2xs space-y-4 flex-1 flex flex-col justify-center">
                        <h5 className="font-serif font-bold text-xs text-natural-espresso flex items-center space-x-2 border-b border-natural-sand pb-2">
                          <span>📊 ประวัติการสนับสนุน (Boutique Support Summary)</span>
                        </h5>
                        {/* Mini Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-natural-sand/10 p-4 rounded-2xl border border-natural-sand/40">
                            <p className="text-[10px] text-natural-espresso/50 font-bold uppercase tracking-wider">ชุดสั่งตัดรวม</p>
                            <p className="text-base font-serif font-black text-natural-clay mt-1">{totalOrders} ชุด</p>
                          </div>
                          <div className="bg-natural-sand/10 p-4 rounded-2xl border border-natural-sand/40">
                            <p className="text-[10px] text-natural-espresso/50 font-bold uppercase tracking-wider">ยอดสนับสนุนทั้งหมด</p>
                            <p className="text-base font-serif font-black text-natural-clay mt-1">฿{totalSpent.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. TAB SELECTION FOR NEW VS OLD ORDERS */}
                <div className="border-b border-natural-sand pb-1 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveHistoryTab('all')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeHistoryTab === 'all'
                          ? 'bg-natural-espresso text-natural-cream shadow-xs'
                          : 'bg-natural-sand/40 hover:bg-natural-sand text-natural-espresso/70'
                      }`}
                    >
                      🗂️ ออเดอร์ทั้งหมด ({totalOrders})
                    </button>
                    <button
                      onClick={() => setActiveHistoryTab('active')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeHistoryTab === 'active'
                          ? 'bg-natural-clay text-white shadow-xs'
                          : 'bg-natural-sand/40 hover:bg-natural-sand text-natural-espresso/70'
                      }`}
                    >
                      🛍️ กำลังตัดเย็บชุดใหม่ ({activeOrdersList.length})
                    </button>
                    <button
                      onClick={() => setActiveHistoryTab('completed')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        activeHistoryTab === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-natural-sand/40 hover:bg-natural-sand text-natural-espresso/70'
                      }`}
                    >
                      📜 ประวัติชุดเก่าสำเร็จแล้ว ({pastOrdersList.length})
                    </button>
                  </div>
                  
                  <span className="text-[11px] text-natural-espresso/45 font-bold italic font-serif hidden sm:inline">
                    NUNUH Customer History Journal
                  </span>
                </div>

                {/* 3. CONDITIONAL RENDERED LIST */}
                <div className="space-y-6">
                  {displayedOrders.length === 0 ? (
                    <div className="bg-natural-sand/10 border border-dashed border-natural-wheat rounded-2xl py-8 px-4 text-center text-natural-espresso/50">
                      <History className="h-8 w-8 mx-auto text-natural-espresso/25 mb-2" />
                      <p className="font-semibold text-xs">ไม่มีรายการออเดอร์ในหมวดหมู่นี้</p>
                      <p className="text-[10px] mt-0.5">ลองเลือกดูหมวดหมู่อื่นเพื่อตรวจสอบความถูกต้องค่ะ</p>
                    </div>
                  ) : (
                    displayedOrders.map((order) => {
                      const isCompleted = order.status === OrderStatus.COMPLETED;
                      const progress = getStatusProgress(order.status);
                      const currentStatus = STATUS_MAP[order.status];
                      const unpaid = Math.max(0, order.price - order.deposit - (order.discount || 0));

                      {/* RENDERING ACTIVE ORDER (NEW/IN PROGRESS) */}
                      if (!isCompleted) {
                        return (
                          <div 
                            key={order.id} 
                            className="p-5 sm:p-7 rounded-2xl border border-natural-wheat bg-white space-y-6 shadow-sm relative overflow-hidden"
                          >
                            {/* Status accent strip */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-natural-clay"></div>

                            {/* Order Head */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-natural-sand pb-4">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs font-black bg-natural-espresso text-natural-cream px-2 py-0.5 rounded">
                                    {order.orderNumber}
                                  </span>
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentStatus.colorClass}`}>
                                    {currentStatus.label}
                                  </span>
                                  {order.sku && (
                                    <span className="bg-natural-clay/10 text-natural-clay text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-natural-clay/25 uppercase">
                                      SKU: {order.sku}
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-serif font-bold text-base text-natural-espresso mt-1.5">
                                  ชุดใหม่: {order.dressType} — สี {order.fabricColor}
                                </h5>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-natural-espresso/40">กำหนดจัดส่ง/ส่งมอบ</p>
                                <p className="text-sm font-bold text-natural-espresso">
                                  {new Date(order.deliveryDate).toLocaleDateString('th-TH', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Stepper Pipeline */}
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-natural-espresso/70 flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1.5 text-natural-clay" /> 
                                  ความคืบหน้าการจัดทำแบบชุดของท่าน:
                                </span>
                                <span className="text-xs font-mono font-bold text-natural-clay">
                                  {progress}%
                                </span>
                              </div>

                              {/* Progress bar background */}
                              <div className="w-full bg-natural-sand h-3.5 rounded-full overflow-hidden border border-natural-wheat/50 p-0.5">
                                <div 
                                  className="bg-natural-clay h-full rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>

                              {/* Stepper Steps Labels */}
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
                                {Object.entries(STATUS_MAP).map(([statusKey, cfg]) => {
                                  const isCurrent = order.status === statusKey;
                                  const isPassed = getStatusProgress(order.status) >= getStatusProgress(statusKey as OrderStatus);

                                  return (
                                    <div 
                                      key={statusKey}
                                      className={`p-2 rounded-xl border text-center transition-all ${
                                        isCurrent 
                                          ? 'bg-natural-espresso border-natural-espresso text-natural-cream scale-[1.02] shadow-xs' 
                                          : isPassed 
                                            ? 'bg-natural-sand/60 border-natural-wheat text-natural-espresso/80' 
                                            : 'bg-white border-natural-wheat/40 text-natural-espresso/30'
                                      }`}
                                    >
                                      <p className="text-[10px] font-bold leading-tight truncate">
                                        {cfg.label}
                                      </p>
                                      {isCurrent && (
                                        <p className="text-[8px] font-medium leading-tight opacity-90 mt-1">
                                          สเตตัสปัจจุบัน
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Current Step Description Card */}
                              <div className="bg-natural-sand/20 border border-natural-wheat/60 p-4 rounded-xl flex items-start space-x-3">
                                <Info className="h-5 w-5 text-natural-clay flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-natural-espresso">
                                    รายละเอียดขั้นตอนนี้:
                                  </p>
                                  <p className="text-xs text-natural-espresso/80 mt-1 leading-relaxed">
                                    {currentStatus.description}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Technical details Grid (Specs, Measurements, Balances) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                              
                              {/* Sub-Card: Dress Details */}
                              <div className="bg-white p-4 rounded-xl border border-natural-wheat space-y-3 shadow-3xs">
                                <h6 className="font-serif font-bold text-xs text-natural-espresso border-b border-natural-sand pb-1.5 flex items-center">
                                  <Scissors className="h-3.5 w-3.5 mr-1.5 text-natural-clay" /> รายละเอียดชิ้นงาน
                                </h6>
                                <div className="space-y-1.5 text-xs text-natural-espresso/80">
                                  <p><span className="font-semibold text-natural-espresso/50">ประเภทชุด:</span> {order.dressType}</p>
                                  <p><span className="font-semibold text-natural-espresso/50">ชนิดเนื้อผ้า:</span> {order.fabricType}</p>
                                  <p><span className="font-semibold text-natural-espresso/50">สีที่เลือกตัด:</span> {order.fabricColor}</p>
                                  {order.customDesign && (
                                    <p className="bg-natural-sand/35 p-1.5 rounded text-[11px] font-medium border border-natural-wheat/40 mt-1 text-natural-espresso/90">
                                      📐 {order.customDesign.silhouette} | {order.customDesign.neckline} | {order.customDesign.sleeves}
                                    </p>
                                  )}
                                  {order.customImage && (
                                    <div className="mt-2.5 pt-2.5 border-t border-natural-sand/60">
                                      <p className="text-[10px] text-natural-espresso/45 font-bold mb-1 uppercase tracking-wider">รูปภาพแบบชุดอ้างอิง</p>
                                      <div className="relative rounded-lg overflow-hidden border border-natural-wheat h-28 bg-natural-sand/5 flex items-center justify-center">
                                        <img 
                                          src={order.customImage} 
                                          alt="Design Reference" 
                                          className="h-full object-contain cursor-zoom-in"
                                          referrerPolicy="no-referrer"
                                          onClick={() => {
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
                                    <div className="mt-2.5 pt-2.5 border-t border-natural-sand/60">
                                      <p className="text-[10px] text-natural-espresso/45 font-bold mb-1 uppercase tracking-wider">หลักฐานการชำระเงิน (สลิปโอนเงิน)</p>
                                      <div className="relative rounded-lg overflow-hidden border border-natural-wheat h-28 bg-natural-sand/5 flex items-center justify-center">
                                        <img 
                                          src={order.slipImage} 
                                          alt="Payment Slip" 
                                          className="h-full object-contain cursor-zoom-in"
                                          referrerPolicy="no-referrer"
                                          onClick={() => {
                                            const imgWindow = window.open();
                                            if (imgWindow) {
                                              imgWindow.document.write(`<img src="${order.slipImage}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Sub-Card: Measurements */}
                              <div className="bg-white p-4 rounded-xl border border-natural-wheat space-y-3 shadow-3xs">
                                <h6 className="font-serif font-bold text-xs text-natural-espresso border-b border-natural-sand pb-1.5 flex items-center">
                                  <Ruler className="h-3.5 w-3.5 mr-1.5 text-natural-clay" /> สัดส่วนเฉพาะออเดอร์นี้
                                </h6>
                                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                                  <div className="bg-natural-cream/35 p-1 rounded">
                                    <p className="text-[9px] text-natural-espresso/45 font-bold">อก</p>
                                    <p className="font-mono font-bold text-natural-espresso">{order.measurements.chest}″</p>
                                  </div>
                                  <div className="bg-natural-cream/35 p-1 rounded">
                                    <p className="text-[9px] text-natural-espresso/45 font-bold">เอว</p>
                                    <p className="font-mono font-bold text-natural-espresso">{order.measurements.waist}″</p>
                                  </div>
                                  <div className="bg-natural-cream/35 p-1 rounded">
                                    <p className="text-[9px] text-natural-espresso/45 font-bold">สะโพก</p>
                                    <p className="font-mono font-bold text-natural-espresso">{order.measurements.hips}″</p>
                                  </div>
                                  <div className="bg-natural-cream/35 p-1 rounded">
                                    <p className="text-[9px] text-natural-espresso/45 font-bold">ไหล่</p>
                                    <p className="font-mono font-bold text-natural-espresso">{order.measurements.shoulder}″</p>
                                  </div>
                                  <div className="bg-natural-cream/35 p-1 rounded">
                                    <p className="text-[9px] text-natural-espresso/45 font-bold">ความยาว</p>
                                    <p className="font-mono font-bold text-natural-espresso">{order.measurements.length}″</p>
                                  </div>
                                  <div className="bg-natural-cream/35 p-1 rounded">
                                    <p className="text-[9px] text-natural-espresso/45 font-bold">ส่วนสูง</p>
                                    <p className="font-mono font-bold text-natural-espresso">{order.measurements.height}cm</p>
                                  </div>
                                </div>
                              </div>

                              {/* Sub-Card: Payments */}
                              <div className="bg-white p-4 rounded-xl border border-natural-wheat space-y-3 flex flex-col justify-between shadow-3xs">
                                <div className="space-y-1">
                                  <h6 className="font-serif font-bold text-xs text-natural-espresso border-b border-natural-sand pb-1.5 flex items-center">
                                    <DollarSign className="h-3.5 w-3.5 mr-1 text-natural-clay" /> การเงิน & สัญญาจองคิว
                                  </h6>
                                  <div className="flex justify-between items-center text-xs pt-1">
                                    <span className="text-natural-espresso/50 font-medium">ราคาสุทธิ:</span>
                                    <span className="font-bold text-natural-espresso">{order.price.toLocaleString()} ฿</span>
                                  </div>
                                  {!!order.discount && (
                                    <div className="flex justify-between items-center text-xs text-amber-700">
                                      <span className="font-medium">ส่วนลด:</span>
                                      <span className="font-bold">-{order.discount.toLocaleString()} ฿</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-natural-espresso/50 font-medium">มัดจำแล้ว:</span>
                                    <span className="font-bold text-natural-sage">{order.deposit.toLocaleString()} ฿</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-natural-sand flex justify-between items-center">
                                  <span className="text-[10px] text-natural-espresso/40 font-bold uppercase">ยอดคงค้างชำระ</span>
                                  <span className={`text-sm font-black ${unpaid > 0 ? 'text-natural-clay' : 'text-natural-sage'}`}>
                                    {unpaid > 0 ? `${unpaid.toLocaleString()} ฿` : 'ชำระครบถ้วนแล้ว ✓'}
                                  </span>
                                </div>
                              </div>

                            </div>

                            {/* Support note & contact button */}
                            <div className="pt-4 border-t border-natural-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                              <p className="text-natural-espresso/50 flex items-center italic">
                                <Info className="h-3.5 w-3.5 mr-1" /> หากพบจุดคลาดเคลื่อนของสัดส่วน กรุณาติดต่อสตูดิโอเพื่อปรับแต่งโครงสร้างก่อนช่างลงกรรไกรตัดผ้าค่ะ
                              </p>
                              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                                <a 
                                  href="https://line.me/R/oaMessage/@237aynfq/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  <span>แชท LINE @237aynfq 💬</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setPrintingOrder(order)}
                                  className="bg-natural-clay hover:bg-natural-clay-dark text-white font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  <span>พิมพ์ใบออเดอร์เฉพาะจุด 🖨️</span>
                                </button>
                                <a 
                                  href={`tel:${order.customerPhone}`}
                                  className="bg-natural-sand hover:bg-natural-wheat text-natural-espresso font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer border border-natural-wheat/30"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>โทรติดต่อห้องเสื้อ</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      {/* RENDERING PAST ORDER (COMPLETED/OLD) */}
                      return (
                        <div 
                          key={order.id} 
                          className="p-5 sm:p-6 rounded-2xl border border-emerald-200/60 bg-emerald-50/10 hover:bg-emerald-50/25 transition-colors space-y-4 shadow-2xs relative overflow-hidden"
                        >
                          {/* Completed accent strip */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>

                          {/* Completed Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-natural-sand pb-3">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-mono text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow-3xs">
                                {order.orderNumber}
                              </span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> ส่งมอบเรียบร้อยสำเร็จ ✓
                              </span>
                              {order.sku && (
                                <span className="text-natural-espresso/40 font-mono text-[10px] font-bold">
                                  SKU: {order.sku}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] font-medium text-natural-espresso/50">
                              ส่งมอบเมื่อ: {new Date(order.deliveryDate).toLocaleDateString('th-TH', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>

                          {/* Info Body */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* Portrait Thumbnail */}
                            <div className="flex items-center space-x-3.5 md:col-span-2">
                              <div className="w-14 h-14 bg-natural-sand rounded-xl overflow-hidden border border-natural-wheat flex-shrink-0">
                                <img 
                                  src={order.customImage || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200"} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-0.5 text-xs">
                                <p className="font-serif font-extrabold text-natural-espresso">{order.dressType}</p>
                                <p className="text-natural-espresso/75 font-medium">ชนิดผ้า: {order.fabricType} | สี: {order.fabricColor}</p>
                                <p className="text-[10px] text-natural-espresso/45">วันที่สั่งจอง: {new Date(order.orderDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                            </div>

                            {/* Standard specs */}
                            <div className="text-xs space-y-1 bg-natural-sand/20 p-2.5 rounded-xl border border-natural-wheat/40">
                              <p className="text-[9px] text-natural-espresso/45 font-bold uppercase tracking-wider">ขนาดชุดที่ตัดสำเร็จ</p>
                              <div className="font-mono font-bold text-natural-espresso/85 grid grid-cols-3 gap-1 text-center text-[10px]">
                                <div>อก: {order.measurements.chest}″</div>
                                <div>เอว: {order.measurements.waist}″</div>
                                <div>สะโพก: {order.measurements.hips}″</div>
                              </div>
                            </div>

                            {/* Mini financials */}
                            <div className="text-right text-xs">
                              <p className="text-[10px] text-natural-espresso/45 font-bold uppercase">ราคาชำระแล้ว (Paid)</p>
                              <p className="text-base font-serif font-black text-emerald-800">฿{(order.price - (order.discount || 0)).toLocaleString()}</p>
                              <p className="text-[10px] text-emerald-700/75 font-bold">ชำระเต็มจำนวนแล้ว ✓</p>
                            </div>
                          </div>

                          {/* Print details button for specific historical order */}
                          <div className="pt-2 border-t border-natural-sand/50 flex justify-between items-center text-xs">
                            <span className="text-[10px] text-natural-espresso/40 flex items-center gap-1">
                              📖 บันทึกไว้ในคลังประวัติความพึงพอใจของห้องเสื้อ NUNUH
                            </span>
                            
                            <div className="flex items-center space-x-2.5">
                              <a 
                                href="https://line.me/R/oaMessage/@237aynfq/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#05b34c] hover:text-[#04943f] font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>คุยผ่าน LINE @237aynfq 💬</span>
                              </a>
                              <span className="text-natural-sand">|</span>
                              <button
                                type="button"
                                onClick={() => setPrintingOrder(order)}
                                className="text-natural-clay hover:text-natural-clay-dark font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Printer className="h-3.5 w-3.5" />
                                <span>พิมพ์ใบเสร็จ & รายละเอียดชุดย้อนหลัง 🖨️</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}

          {hasSearched && searchedOrders && searchedOrders.length === 0 && (
            <div className="bg-natural-sand/15 border border-dashed border-natural-wheat rounded-2xl py-12 px-6 text-center text-natural-espresso/60 animate-fade-in">
              <User className="h-10 w-10 mx-auto text-natural-espresso/25 mb-3" />
              <p className="font-medium">ไม่พบคิวออเดอร์ตัดเย็บของคุณ</p>
              <p className="text-xs mt-1 max-w-sm mx-auto">
                ลองตรวจสอบตัวสะกดเบอร์โทรศัพท์อีกครั้ง หรือตรวจสอบกับทางดีไซเนอร์ว่ามีการลงบันทึกเบอร์โทรของท่านตรงกันหรือไม่ค่ะ
              </p>
            </div>
          )}
        </div>
      </div>

      <PrintOrderModal 
        order={printingOrder} 
        isOpen={printingOrder !== null} 
        onClose={() => setPrintingOrder(null)} 
      />
    </div>
  );
}
