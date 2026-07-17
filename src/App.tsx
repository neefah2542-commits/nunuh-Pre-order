/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus, CatalogueItem } from './types';
import { INITIAL_ORDERS, INITIAL_CATALOGUE } from './initialData';

// Components
import DashboardStats from './components/DashboardStats';
import OrderForm from './components/OrderForm';
import OrderTracker from './components/OrderTracker';
import DeliveryCalendar from './components/DeliveryCalendar';
import DressCatalogue from './components/DressCatalogue';
import CustomerPortal from './components/CustomerPortal';

// Icons
import { 
  ClipboardCheck, 
  Scissors, 
  Calendar as CalendarIcon, 
  Sparkles, 
  PlusCircle, 
  Heart,
  Store,
  Layers
} from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('tracker'); // tracker, orderForm, calendar, catalogue
  const [isCustomerMode, setIsCustomerMode] = useState<boolean>(false);

  // ฟังก์ชันผสานข้อมูลออเดอร์โดยไม่ให้ข้อมูลทับกันหรือสูญหาย (Smart Order Merge)
  const mergeOrders = (current: Order[], incoming: Order[]): Order[] => {
    const map = new Map<string, Order>();
    for (const o of current) {
      map.set(o.id, o);
    }
    for (const o of incoming) {
      if (!map.has(o.id)) {
        map.set(o.id, o);
      } else {
        // หากมีอยู่แล้ว เลือกข้อมูลที่อัปเดตล่าสุดหรือเก็บไว้ทั้งคู่
        const existing = map.get(o.id)!;
        // หากสถานะหรือข้อมูลใหม่กว่า ให้แทนที่ หรือคงเวอร์ชันที่สมบูรณ์ที่สุด
        map.set(o.id, { ...existing, ...o });
      }
    }
    // เรียงลำดับตามวันที่สร้างหรือเลขที่ออเดอร์ล่าสุดให้อยู่ด้านบน
    return Array.from(map.values()).sort((a, b) => {
      return b.orderNumber.localeCompare(a.orderNumber, undefined, { numeric: true });
    });
  };

  // ซิงค์ข้อมูลกับ Server Backend
  const syncWithServer = async (ordersToUpload?: Order[]) => {
    try {
      const storedLocal = localStorage.getItem('nunuh_orders');
      let currentLocal: Order[] = [];
      if (storedLocal) {
        currentLocal = JSON.parse(storedLocal);
      }
      
      const targetOrders = ordersToUpload || currentLocal;
      const publicUrl = localStorage.getItem('nunuh_public_url') || window.location.origin;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: targetOrders, publicUrl })
      });
      
      if (response.ok) {
        const mergedFromServer = await response.json();
        if (Array.isArray(mergedFromServer)) {
          // ผสานข้อมูลฝั่งเซิร์ฟเวอร์กลับลง LocalStorage
          const finalMerged = mergeOrders(currentLocal, mergedFromServer);
          setOrders(finalMerged);
          localStorage.setItem('nunuh_orders', JSON.stringify(finalMerged));
        }
      }
    } catch (e) {
      console.warn('Backend sync is temporarily unavailable, running in local-only mode:', e);
    }
  };

  // โหลดข้อมูลออเดอร์และแคตตาล็อกจาก LocalStorage หรือตั้งค่าด้วยชุดข้อมูลเริ่มต้น
  useEffect(() => {
    let initialOrders = INITIAL_ORDERS;
    const savedOrders = localStorage.getItem('nunuh_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialOrders = mergeOrders(INITIAL_ORDERS, parsed);
        }
      } catch (e) {
        initialOrders = INITIAL_ORDERS;
      }
    }
    setOrders(initialOrders);
    localStorage.setItem('nunuh_orders', JSON.stringify(initialOrders));

    const savedCatalogue = localStorage.getItem('nunuh_catalogue');
    if (savedCatalogue) {
      try {
        const parsed = JSON.parse(savedCatalogue) as CatalogueItem[];
        const missingItems = INITIAL_CATALOGUE.filter(item => !parsed.some(p => p.id === item.id));
        if (missingItems.length > 0) {
          const merged = [...parsed, ...missingItems];
          setCatalogue(merged);
          localStorage.setItem('nunuh_catalogue', JSON.stringify(merged));
        } else {
          setCatalogue(parsed);
        }
      } catch (e) {
        setCatalogue(INITIAL_CATALOGUE);
        localStorage.setItem('nunuh_catalogue', JSON.stringify(INITIAL_CATALOGUE));
      }
    } else {
      setCatalogue(INITIAL_CATALOGUE);
      localStorage.setItem('nunuh_catalogue', JSON.stringify(INITIAL_CATALOGUE));
    }

    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'customer') {
      setIsCustomerMode(true);
      setActiveTab('customer');
    } else {
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }

    // เริ่มต้นซิงค์ข้อมูลกับ Backend ทันทีตอนหน้าเว็บโหลด
    syncWithServer();
  }, []);

  // ซิงค์สตรีมข้อมูลเรียลไทม์ข้ามแท็บและหลายผู้ใช้งานที่ใช้ลิงก์เดียวกัน (BroadcastChannel + Storage Event + Polling)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('nunuh_multiuser_sync_channel');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'ORDERS_UPDATE' && Array.isArray(event.data.orders)) {
          setOrders(prev => mergeOrders(prev, event.data.orders));
        }
      };
    } catch (e) {}

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nunuh_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setOrders(prev => mergeOrders(prev, parsed));
          }
        } catch (err) {}
      }
      if (e.key === 'nunuh_catalogue' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCatalogue(parsed);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // ตรวจสอบข้อมูลจาก localStorage ทุกๆ 2.5 วินาที เพื่อให้ผู้ใช้หลายคนส่งออเดอร์พร้อมกันผ่านลิงก์เดียวกันแล้วข้อมูลซิงค์ทันทีไม่สูญหาย
    const pollInterval = setInterval(() => {
      try {
        const stored = localStorage.getItem('nunuh_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setOrders(prev => {
              const merged = mergeOrders(prev, parsed);
              if (merged.length !== prev.length || JSON.stringify(merged) !== JSON.stringify(prev)) {
                return merged;
              }
              return prev;
            });
          }
        }
      } catch (e) {}
    }, 2500);

    // ตรวจสอบข้อมูลจาก Server ทุกๆ 8 วินาที เพื่อความเรียลไทม์ข้ามเครื่อง
    const serverPollInterval = setInterval(() => {
      syncWithServer();
    }, 8000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
      clearInterval(pollInterval);
      clearInterval(serverPollInterval);
    };
  }, []);

  // บันทึกข้อมูลลง LocalStorage พร้อมผสานข้อมูลป้องกันการชนกัน (Concurrent Save Safety)
  const saveOrdersToStorage = (updatedOrders: Order[]) => {
    try {
      const stored = localStorage.getItem('nunuh_orders');
      let currentStored: Order[] = [];
      if (stored) {
        currentStored = JSON.parse(stored);
      }
      // ผสานระหว่างข้อมูลที่มีอยู่ล่าสุดในเครื่อง กับข้อมูลที่กำลังบันทึกใหม่
      const fullyMerged = mergeOrders(currentStored, updatedOrders);
      
      setOrders(fullyMerged);
      localStorage.setItem('nunuh_orders', JSON.stringify(fullyMerged));

      // ซิงค์ส่งขึ้น Server ทันที
      syncWithServer(fullyMerged);

      // ส่งสัญญาณ BroadcastChannel ไปยังแท็บหรืออุปกรณ์อื่นทันที
      try {
        const channel = new BroadcastChannel('nunuh_multiuser_sync_channel');
        channel.postMessage({ type: 'ORDERS_UPDATE', orders: fullyMerged });
        channel.close();
      } catch (e) {}
    } catch (e) {
      setOrders(updatedOrders);
      localStorage.setItem('nunuh_orders', JSON.stringify(updatedOrders));
      syncWithServer(updatedOrders);
    }
  };

  // การเพิ่มออเดอร์ใหม่
  const handleAddOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
    // หลังบันทึกย้ายแท็บไปหน้าติดตามงาน
    setActiveTab('tracker');
  };

  // ปรับปรุงสถานะติดตามงาน (Update Status)
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    });
    saveOrdersToStorage(updated);
  };

  // ลบออเดอร์
  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId);
    saveOrdersToStorage(updated);
  };

  // แก้ไขรายละเอียดออเดอร์ทั้งหมด
  const handleUpdateOrder = (updatedOrder: Order) => {
    const updated = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    saveOrdersToStorage(updated);
  };

  // ฟังก์ชันเลือกแบบชุดจากแคตตาล็อกเพื่อนำมาใส่หน้าฟอร์มรับออเดอร์ทันที
  const handleSelectDesignForOrder = (designId: string) => {
    setActiveTab('orderForm');
    // โครงสร้างฟอร์มจะดึงไอดีการเลือกนี้ไปเปิดอัตโนมัติเนื่องจากถูกเลือกและส่งต่อไปที่คอมโพเนนต์
    setTimeout(() => {
      const designSelect = document.querySelector('select');
      if (designSelect) {
        designSelect.value = designId;
        // ทริกเกอร์อีเวนต์จำลองเพื่อให้อัพเดตสเตตในคอมโพเนนต์ลูก
        const event = new Event('change', { bubbles: true });
        designSelect.dispatchEvent(event);
      }
    }, 200);
  };

  // การอัปโหลด / เพิ่มแบบชุดใหม่เข้าไปยังแคตตาล็อกของทางร้าน
  const handleAddCatalogueItem = (newItem: CatalogueItem) => {
    const updated = [...catalogue, newItem];
    setCatalogue(updated);
    localStorage.setItem('nunuh_catalogue', JSON.stringify(updated));
  };

  // การลบแบบชุดออกจากแคตตาล็อก
  const handleDeleteCatalogueItem = (designId: string) => {
    const updated = catalogue.filter(item => item.id !== designId);
    setCatalogue(updated);
    localStorage.setItem('nunuh_catalogue', JSON.stringify(updated));
  };

  // คำนวณรหัสออเดอร์ถัดไปแบบอัตโนมัติ (เช่น NU-26007)
  const getNextOrderNumber = () => {
    if (orders.length === 0) return "NU-26001";
    
    // ค้นหารหัสสูงสุดที่มีเลขต่อท้าย
    const orderNumbers = orders
      .map(o => {
        const match = o.orderNumber.match(/NU-(\d+)/);
        return match ? parseInt(match[1]) : 26000;
      });
    const maxNum = Math.max(...orderNumbers, 26000);
    return `NU-${maxNum + 1}`;
  };

  return (
    <div className="min-h-screen bg-natural-cream text-natural-espresso pb-16 font-sans">
      
      {/* 1. BRAND HERO HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-natural-wheat sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Elegant Logo Group */}
            <div className={`flex items-center space-x-3.5 ${isCustomerMode ? 'mx-auto' : ''}`}>
              <div className="h-11 w-11 rounded-2xl bg-natural-espresso flex items-center justify-center text-natural-cream shadow-sm">
                <Store className="h-5 w-5 text-natural-ochre" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black tracking-widest text-natural-espresso uppercase">
                  NUNUH
                </h1>
                <p className="text-[9px] font-bold tracking-widest text-natural-espresso/50 uppercase">
                  {isCustomerMode ? 'CUSTOMER HUB • SECURE PORTAL' : 'ATELIER & COUTURE ORDER SYSTEM'}
                </p>
              </div>
            </div>

            {/* Top Workspace Tab Navs */}
            {!isCustomerMode && (
              <nav className="flex items-center space-x-1 bg-natural-sand/50 p-1.5 rounded-2xl border border-natural-wheat/40">
                <button
                  onClick={() => setActiveTab('tracker')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    activeTab === 'tracker'
                      ? 'bg-natural-clay text-white shadow-xs'
                      : 'text-natural-espresso/70 hover:bg-natural-sand/80 hover:text-natural-espresso'
                  }`}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">ติดตามงาน</span>
                </button>

                <button
                  onClick={() => setActiveTab('orderForm')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    activeTab === 'orderForm'
                      ? 'bg-natural-clay text-white shadow-xs'
                      : 'text-natural-espresso/70 hover:bg-natural-sand/80 hover:text-natural-espresso'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">รับออเดอร์ใหม่</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    activeTab === 'calendar'
                      ? 'bg-natural-clay text-white shadow-xs'
                      : 'text-natural-espresso/70 hover:bg-natural-sand/80 hover:text-natural-espresso'
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">ตารางกำหนดส่งชุด</span>
                </button>

                <button
                  onClick={() => setActiveTab('catalogue')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    activeTab === 'catalogue'
                      ? 'bg-natural-clay text-white shadow-xs'
                      : 'text-natural-espresso/70 hover:bg-natural-sand/80 hover:text-natural-espresso'
                  }`}
                >
                  <Scissors className="h-4 w-4" />
                  <span className="hidden sm:inline">แบบชุดเสนอแนะนำ</span>
                </button>

                <button
                  onClick={() => setActiveTab('customer')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    activeTab === 'customer'
                      ? 'bg-natural-clay text-white shadow-xs'
                      : 'text-natural-espresso/70 hover:bg-natural-sand/80 hover:text-natural-espresso'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-natural-ochre" />
                  <span>สำหรับลูกค้า</span>
                </button>
              </nav>
            )}

          </div>
        </div>
      </header>

      {/* 2. MAIN CORE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Dynamic Stats Banner */}
        {!isCustomerMode && <DashboardStats orders={orders} onSelectTab={setActiveTab} />}

        {/* Tab Content Display Area with Framer Motion Transition */}
        <div className="mt-2 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeTab === 'tracker' && (
                <div className="space-y-4">
                  <div className="border-b border-natural-wheat pb-3">
                    <h2 className="text-xl font-serif font-bold text-natural-espresso">ระบบติดตามและอัพเดตสเตตัสงาน (Order Tracking Board)</h2>
                    <p className="text-xs text-natural-espresso/60">คลิกการ์ดรายการเพื่อขยายข้อมูลความต้องการ สรุปยอดค้างชำระ และข้อมูลสัดส่วนการวัดตัวลูกค้า</p>
                  </div>
                  <OrderTracker 
                    orders={orders} 
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onDeleteOrder={handleDeleteOrder}
                    onEditOrder={handleUpdateOrder}
                  />
                </div>
              )}

              {activeTab === 'orderForm' && (
                <div className="space-y-4">
                  <div className="border-b border-natural-wheat pb-3">
                    <h2 className="text-xl font-serif font-bold text-natural-espresso">ลงบันทึกออเดอร์ตัดเย็บใหม่ (Create Custom Order)</h2>
                    <p className="text-xs text-natural-espresso/60">กรอกข้อมูลผู้จอง สเปกแบบตัดเย็บ รายการเนื้อผ้า อัตราสัดส่วนวัดตัว ตลอดจนราคาและกำหนดส่งมอบชุด</p>
                  </div>
                  <OrderForm 
                    catalogue={catalogue} 
                    onAddOrder={handleAddOrder}
                    nextOrderNumber={getNextOrderNumber()}
                  />
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="border-b border-natural-wheat pb-3">
                    <h2 className="text-xl font-serif font-bold text-natural-espresso">ตารางเวลาจัดเตรียมและจัดส่งเสื้อผ้า (Timeline & Calendar)</h2>
                    <p className="text-xs text-natural-espresso/60">ตรวจสอบกำหนดการส่งงานแบบปฏิทินรายวัน และดูจัดลำดับรอบเตรียมแพ็คจัดส่งที่รอคุณอยู่อย่างง่ายดาย</p>
                  </div>
                  <DeliveryCalendar 
                    orders={orders} 
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                  />
                </div>
              )}

              {activeTab === 'catalogue' && (
                <div className="space-y-4">
                  <div className="border-b border-natural-wheat pb-3">
                    <h2 className="text-xl font-serif font-bold text-natural-espresso">คลังแบบชุดและชุดเสนอแนะเฉพาะตัว (Designer Catalogue Panel)</h2>
                    <p className="text-xs text-natural-espresso/60">แคตตาล็อกแบบพรีเมียมพร้อมเครื่องมือผสมผสานสไตล์ชุดแบบด่วน เพื่อแชร์เป็นข้อความทางการประเมินราคาส่งให้ลูกค้า</p>
                  </div>
                  <DressCatalogue 
                    catalogue={catalogue} 
                    onSelectDesignForOrder={handleSelectDesignForOrder}
                    onAddCatalogueItem={handleAddCatalogueItem}
                    onDeleteCatalogueItem={handleDeleteCatalogueItem}
                  />
                </div>
              )}

              {activeTab === 'customer' && (
                <div className="space-y-4">
                  <div className="border-b border-natural-wheat pb-3">
                    <h2 className="text-xl font-serif font-bold text-natural-espresso">ศูนย์บริการและติดตามความคืบหน้าของลูกค้า (Customer Care & Booking)</h2>
                    <p className="text-xs text-natural-espresso/60">พื้นที่สำหรับลูกค้าเพื่อจองแบบสไตล์คอลเลกชัน ค้นหาคิวประวัติ และประเมินความคืบหน้าง่ายๆ ด้วยเบอร์โทรศัพท์</p>
                  </div>
                  <CustomerPortal 
                    orders={orders}
                    catalogue={catalogue}
                    onAddOrder={handleAddOrder}
                    onUpdateOrders={saveOrdersToStorage}
                    nextOrderNumber={getNextOrderNumber()}
                    isCustomerLocked={isCustomerMode}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* 3. ATELIER FOOTER */}
      <footer className="mt-20 border-t border-natural-wheat bg-white/40 py-10 text-center text-natural-espresso/50 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif font-bold tracking-widest uppercase text-natural-espresso">NUNUH BOUTIQUE</p>
          <p className="font-medium text-natural-espresso/60">ระบบคูตูร์แฮนด์เมดและจัดการรายการรับออเดอร์ลูกค้าอย่างมีระดับ</p>
          <p className="pt-2 text-[10px] text-natural-espresso/40">NUNUH Atelier © 2026. All rights reserved. Designed with precision for premium clothing salons.</p>
        </div>
      </footer>

    </div>
  );
}
