/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Order, OrderStatus } from '../types';
import { 
  ShoppingBag, 
  Hourglass, 
  Calendar, 
  CheckCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface DashboardStatsProps {
  orders: Order[];
  onSelectTab: (tab: string) => void;
}

export default function DashboardStats({ orders, onSelectTab }: DashboardStatsProps) {
  // สถิติทั้งหมด
  const totalOrders = orders.length;
  
  // กำลังดำเนินการ (ไม่ใช่ COMPLETED)
  const activeOrders = orders.filter(o => o.status !== OrderStatus.COMPLETED).length;
  
  // พร้อมส่งมอบ (READY)
  const readyOrders = orders.filter(o => o.status === OrderStatus.READY).length;

  // ส่งมอบสำเร็จ (COMPLETED)
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

  // รายได้ทั้งหมด (รวมมัดจำหรือยอดสั่งซื้อทั้งหมด)
  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const totalDeposits = orders.reduce((sum, o) => sum + o.deposit, 0);

  const stats = [
    {
      id: "stat-total",
      label: "ออเดอร์ทั้งหมด",
      value: `${totalOrders} ชุด`,
      icon: ShoppingBag,
      color: "bg-natural-sand text-natural-espresso border-natural-wheat/80",
      description: "ประวัติการสั่งซื้อรวมทั้งหมด",
      actionLabel: "ดูงานทั้งหมด",
      onClick: () => onSelectTab("tracker")
    },
    {
      id: "stat-active",
      label: "กำลังดำเนินงาน",
      value: `${activeOrders} ชุด`,
      icon: Hourglass,
      color: "bg-[rgba(185,98,72,0.06)] text-natural-clay border-natural-clay/20",
      description: "กำลังตัดเย็บ / เตรียมงาน",
      actionLabel: "ติดตามสถานะงาน",
      onClick: () => onSelectTab("tracker")
    },
    {
      id: "stat-ready",
      label: "พร้อมส่งมอบ",
      value: `${readyOrders} ชุด`,
      icon: SparklesIcon, // We can use standard Sparkles icon from lucide
      color: "bg-[rgba(93,114,96,0.08)] text-natural-sage border-natural-sage/25",
      description: "เสร็จสิ้น QC รอส่งถึงมือลูกค้า",
      actionLabel: "ดูวันส่งชุด",
      onClick: () => onSelectTab("calendar")
    },
    {
      id: "stat-revenue",
      label: "มูลค่าออเดอร์รวม",
      value: `${totalRevenue.toLocaleString()} ฿`,
      icon: CreditCard,
      color: "bg-[rgba(194,141,84,0.08)] text-natural-ochre border-natural-ochre/25",
      description: `ได้รับมัดจำแล้ว ${totalDeposits.toLocaleString()} ฿`,
      actionLabel: "รับออเดอร์เพิ่ม",
      onClick: () => onSelectTab("orderForm")
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={stat.id}
            id={stat.id}
            className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${stat.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-80">{stat.label}</span>
                <IconComponent className="h-5 w-5 opacity-80" />
              </div>
              <h3 className="text-2xl font-serif font-bold tracking-tight mb-1">{stat.value}</h3>
              <p className="text-xs opacity-75">{stat.description}</p>
            </div>
            <button 
              onClick={stat.onClick}
              className="mt-4 text-xs font-medium underline underline-offset-4 text-left hover:opacity-80 transition-all cursor-pointer"
            >
              {stat.actionLabel} &rarr;
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Sparkles fallback or replacement
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}
