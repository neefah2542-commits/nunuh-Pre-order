/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, OrderStatus, CatalogueItem, CustomerReview } from './types';

export const INITIAL_CATALOGUE: CatalogueItem[] = [
  {
    id: "cat-1",
    sku: "NNH-ABA-01",
    name: "Amira Luxury Abaya",
    description: "อาบายะห์หรูสไตล์อาหรับ ตัดเย็บด้วยผ้าพรีเมียมซิลค์เครป ตกแต่งระบายจีบผ้าชีฟองและปักดิ้นทองแฮนด์เมดรอบแขนเสื้อ มีดีไซน์สุภาพเรียบร้อยแต่แฝงด้วยความอลังการ",
    priceRange: "3,500 - 4,800 บาท",
    fabricRecommend: "Premium Silk Crepe & Chiffon",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
    category: "Abaya",
    features: ["ปักแฮนด์เมดรอบแขน", "ผ้าเครปทิ้งตัวมีน้ำหนัก", "มีสายคาดเอวถอดได้"],
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 3500, "M": 3800, "L": 4200, "XL": 4500 }
  },
  {
    id: "cat-2",
    sku: "NNH-SLP-02",
    name: "Serene Satin Slip Gown",
    description: "ชุดเดรสยาวผ้าซาตินเนื้อหนาเกรดนำเข้า ทรงเข้ารูปบริเวณเอวและปล่อยชายบานทรงหางปลา (Mermaid Accent) คอถ่วงหรูหรา สายเดี่ยวไขว้หลังปรับระดับได้ เหมาะสำหรับออกงานกลางคืน",
    priceRange: "4,200 - 5,500 บาท",
    fabricRecommend: "Heavy Premium Satin",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
    category: "Evening Gown",
    features: ["คอถ่วงสไตล์ฝรั่งเศส", "สายไขว้หลังปรับได้", "ผ่าหน้าสูงขึ้นเล็กน้อยเพื่อความคล่องตัว"],
    sizes: ["SS", "S", "M", "L"],
    sizePrices: { "SS": 4200, "S": 4500, "M": 4800, "L": 5200 }
  },
  {
    id: "cat-3",
    sku: "NNH-KAF-03",
    name: "Yasmin Lace Kaftan",
    description: "คาฟทันลูกไม้ฝรั่งเศสตัดต่อสลับซับในเนื้อนุ่ม คอวีลึกแต่งดีเทลลูกปัดคริสตัลระยิบระยับ แขนค้างคาวบานกว้าง ทรงหลวมเรียบหรู ใส่สบายและดูภูมิฐานสำหรับงานมงคล",
    priceRange: "3,800 - 5,000 บาท",
    fabricRecommend: "French Chantilly Lace & Soft Linings",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    category: "Traditional",
    features: ["คอวีปักเม็ดคริสตัล", "แขนบานระบายโปร่ง", "ซับในทั้งตัวสัมผัสเย็นสบาย"],
    sizes: ["M", "L", "XL"],
    sizePrices: { "M": 3800, "L": 4200, "XL": 4600 }
  },
  {
    id: "cat-4",
    sku: "NNH-BLZ-04",
    name: "Zahra Minimalist Blazer Gown",
    description: "ชุดเดรสสูทสไตล์มินิมอลเทเลอร์ ดีไซน์กระดุมสองแถว คอปกลึกเรียบเท่ ปรับสัดส่วนให้ดูเพรียวบางด้วยเข็มขัดผ้าเข้าชุด เหมาะทั้งใส่ออกงานทางการและงานสังสรรค์กึ่งลำลอง",
    priceRange: "3,900 - 5,200 บาท",
    fabricRecommend: "Italian Wool Blend & Soft Crepe",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    category: "Minimalist",
    features: ["ปกเสื้อเทเลอร์เนี้ยบ", "กระดุมคู่และเข็มขัดผ้าคู่ใจ", "มีกระเป๋าเจาะซ่อนสองข้าง"],
    sizes: ["S", "M", "L"],
    sizePrices: { "S": 3900, "M": 4300, "L": 4800 }
  },
  {
    id: "cat-5",
    sku: "NNH-PAS-05",
    name: "Noura Pastel Organza Dress",
    description: "ชุดเดรสราตรีผ้าออร์แกนซ่าสะท้อนแสงนวลพาสเทล ทรงแขนตุ๊กตาพองกำลังดี ตัดแต่งกระโปรงระบาย 2 ชั้นดูพริ้วไหวราวกับเจ้าหญิง ให้ลุคที่ดูหวานละมุน นุ่มนวล อ่อนเยาว์",
    priceRange: "4,500 - 5,800 บาท",
    fabricRecommend: "Luminous Organza & Silk Satin Linings",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
    category: "Casual-Chic",
    features: ["แขนพองตุ๊กตาหวานๆ", "กระโปรงระบาย 2 ชั้นชั้นนอกโปร่ง", "สม็อคหลังยืดหยุ่นได้ดี"],
    sizes: ["SS", "S", "M"],
    sizePrices: { "SS": 4500, "S": 4900, "M": 5300 }
  },
  {
    id: "cat-6",
    sku: "NNH-MKB-06",
    name: "Malika Bridal Kaftan",
    description: "คาฟทันเจ้าสาวสุดหรูหรา ออกแบบมาสำหรับวันสำคัญโดยเฉพาะ ตัดเย็บด้วยผ้าซิลค์ซาตินเกรดพรีเมียม ผสมผสานลูกไม้ดิ้นทองซาอุแท้ที่คอเสื้อและข้อมือ ตกแต่งการปักคริสตัลระยิบระยับแฮนด์เมดรอบลำตัวเพื่อความอลังการสง่างาม",
    priceRange: "5,500 - 7,200 บาท",
    fabricRecommend: "Premium Silk Satin & Dubai Golden Lace",
    image: "https://images.unsplash.com/photo-1583391265517-35bbadd01209?auto=format&fit=crop&q=80&w=600",
    category: "Traditional",
    features: ["ลูกไม้ดิ้นทองนำเข้า", "ปักคริสตัลสวารอฟสกี้แฮนด์เมด", "ผ้าสยายทรงปีกนกพลิ้วสง่า"],
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 5500, "M": 5900, "L": 6400, "XL": 6900 }
  },
  {
    id: "cat-7",
    sku: "NNH-KMA-07",
    name: "Kamilah Modern Abaya Set",
    description: "ชุดเซ็ตอาบายะห์ทันสมัย 3 ชิ้น (เสื้อตัวใน กระโปรง และผ้าคลุมฮิญาบชีฟองเข้าชุด) ดีไซน์เรียบหรูสไตล์อินเตอร์เนชันแนล ผลิตจากผ้านิด้าเกรดเอจากดูไบ สัมผัสนุ่มเย็น ใส่สบายไม่ร้อน ตกแต่งปลายแขนด้วยเทปทอลายพรีเมียม",
    priceRange: "4,000 - 5,200 บาท",
    fabricRecommend: "Dubai Nida Fabric & Premium Chiffon",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600",
    category: "Abaya",
    features: ["ชุดเซ็ต 3 ชิ้นพร้อมใส่", "ผ้านิด้าดูไบสัมผัสเย็นระบายอากาศ", "ตกแต่งเทปลายทอเรียบหรู"],
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 4000, "M": 4300, "L": 4700, "XL": 5100 }
  },
  {
    id: "cat-8",
    sku: "NNH-SOR-08",
    name: "Soraya Elegant Wrap Dress",
    description: "เดรสทรงป้ายหน้า (Wrap Dress) สุดคลาสสิกสไตล์มินิมอลแต่หรูหรา ตัดเย็บด้วยผ้าเครปญี่ปุ่นหนานุ่มมีน้ำหนักทิ้งตัวสวย โดดเด่นด้วยการประดับกระดุมไข่มุกน้ำจืดคัดพิเศษที่ปลายข้อมือ มีสายผูกเอวปรับขนาดได้เพื่อเน้นสัดส่วนให้เพรียวสมส่วน",
    priceRange: "3,800 - 4,800 บาท",
    fabricRecommend: "Japanese Double Crepe & Fresh Water Pearl",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    category: "Minimalist",
    features: ["ดีไซน์ผูกเอวเข้ารูปกระชับ", "ปลายแขนติดมุกน้ำจืดคู่", "ทิ้งตัวสวยไม่ต้องรีดบ่อย"],
    sizes: ["SS", "S", "M", "L", "XL"],
    sizePrices: { "SS": 3800, "S": 4000, "M": 4200, "L": 4500, "XL": 4800 }
  },
  {
    id: "cat-9",
    sku: "NNH-ZAH-09",
    name: "Zahara Royal Satin Gown",
    description: "ชุดเดรสราตรีราชาผ้าซาตินเนื้อหนาพิเศษ (Duchess Satin) อัดทรงโครงกระดูกงู (Corset Style) เสริมทรวดทรงให้เนี้ยบเป๊ะ สง่างามสะกดสายตา ตกแต่งลูกไม้ฝรั่งเศสฉลุลายสวยงามบริเวณแผ่นหลังและขอบเอว",
    priceRange: "5,800 - 8,500 บาท",
    fabricRecommend: "Royal Duchess Satin & French Beaded Lace",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
    category: "Evening Gown",
    features: ["คอร์เซ็ตเสริมกระดูกงูดันทรงเนี้ยบ", "ตกแต่งฉลุลูกไม้ช่วงไหล่และหลัง", "ผืนผ้าหนาทิ้งตัวเรียบหรูสไตล์ราชวงศ์"],
    sizes: ["SS", "S", "M", "L"],
    sizePrices: { "SS": 5800, "S": 6400, "M": 7100, "L": 7800 }
  },
  {
    id: "cat-10",
    sku: "NNH-DRS-E",
    name: "Dress E: Amal Pleated Panel Abaya",
    description: "อาบายะห์พรีเมียมสีดำสนิท ดีไซน์ผ่าหน้าเปิดโชว์แผงจีบพลีทเนื้อนุ่มสีเบจด้านใน ตกแต่งงานปักดิ้นลายดอกไม้ละเอียดประณีตตลอดแนวสาบเสื้อและปลายแขน",
    priceRange: "4,200 - 5,600 บาท",
    fabricRecommend: "Premium Silk Crepe & Chiffon Pleats",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
    category: "Abaya",
    features: ["แผงพลีทด้านในสีเบจพริ้วไหว", "ปักลายดอกไม้แฮนด์เมด", "ทรงยาวคลุมข้อเท้าสุภาพสง่างาม"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    sizePrices: { "S": 4200, "M": 4600, "L": 5000, "XL": 5400, "2XL": 5800 }
  },
  {
    id: "cat-11",
    sku: "NNH-DRS-K",
    name: "Dress K: Kinsley Botanical Rose Gown",
    description: "ชุดเดรสยาวพิมพ์ลายดอกกุหลาบวินเทจสีแดงเบอร์กันดีบนพื้นผ้าสีเขียวเข้มหรูหรา ทรงคอเหลี่ยมแขนพองวอลลุ่ม ทิ้งชายระบายหางปลาอ่อนช้อย",
    priceRange: "4,500 - 6,000 บาท",
    fabricRecommend: "Botanical Silk Satin",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    category: "Evening Gown",
    features: ["ลายพิมพ์ดอกกุหลาบวินเทจคมชัด", "คอเหลี่ยมเผยช่วงคอระหง", "แขนพองทรงเจ้าหญิง"],
    sizes: ["SS", "S", "M", "L", "XL"],
    sizePrices: { "SS": 4500, "S": 4800, "M": 5200, "L": 5600, "XL": 6000 }
  },
  {
    id: "cat-12",
    sku: "NNH-DRS-H",
    name: "Dress H: Hana Diamond Geometric Abaya",
    description: "อาบายะห์โมเดิร์นสีดำสนิท ตกแต่งลายปักเรขาคณิตรูปเพชร (Diamond Motif) สลับสีเบจตามแนวผ่าหน้าและปลายแขนเสื้อ ให้ลุคโฉบเฉี่ยวทันสมัย",
    priceRange: "3,900 - 5,200 บาท",
    fabricRecommend: "Korean Crepe & Gold Thread Embroidery",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    category: "Abaya",
    features: ["ลายปักเรขาคณิตทรงเพชรเรียงยาว", "ซิปซ่อนด้านหน้าสวมใส่ง่าย", "เนื้อผ้านิ่มไม่ยับง่าย"],
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 3900, "M": 4300, "L": 4700, "XL": 5200 }
  },
  {
    id: "cat-13",
    sku: "NNH-DRS-B",
    name: "Dress B: Bella 3D Ruffled Rose Gown",
    description: "ชุดเดรสราตรีสีดำทรงเข้ารูปเพรียว พร้อมแจ็คเก็ตคลุมไหล่แต่งขอบระบายดอกไม้ 3D สีแดงเบอร์กันดีแฮนด์เมดรอบปกและปลายแขนอย่างโดดเด่น",
    priceRange: "5,200 - 7,000 บาท",
    fabricRecommend: "Heavy Crepe & 3D Organza Petals",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
    category: "Evening Gown",
    features: ["ระบายดอกไม้ 3D แฮนด์เมด", "ทรงเข้ารูปเสริมบุคลิก", "ดีไซน์คอลเลกชันพิเศษ"],
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 5200, "M": 5700, "L": 6300, "XL": 7000 }
  },
  {
    id: "cat-14",
    sku: "NNH-DRS-J",
    name: "Dress J: Jasmine Giant Lily Art Gown",
    description: "ชุดเดรสสีขาวงาช้างเพ้นท์และปักลายดอกลิลลี่ยักษ์สีชมพูมาเจนตาและเบอร์กันดีพาดลำตัวและชายกระโปรง ผลงานศิลป์ผ้าเพ้นท์แฮนด์เมดเอกลักษณ์เฉพาะ NUNUH",
    priceRange: "5,500 - 7,500 บาท",
    fabricRecommend: "Pure Silk Satin & Hand-Painted Art",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600",
    category: "Evening Gown",
    features: ["ลายเพ้นท์ดอกลิลลี่แฮนด์เมดชิ้นต่อชิ้น", "คอตั้งพับนุ่มนวล", "ชายกระโปรงพริ้วทิ้งตัวสวย"],
    sizes: ["SS", "S", "M", "L"],
    sizePrices: { "SS": 5500, "S": 5900, "M": 6500, "L": 7200 }
  },
  {
    id: "cat-15",
    sku: "NNH-DRS-F",
    name: "Dress F: Fiona Lace Accent Gown",
    description: "ชุดเดรสเรียบหรูคอกลมสีดำสนิท ประดับลายปักโค้งรับช่วงคอ และเพิ่มความเซ็กซี่มีระดับด้วยชิ้นลูกไม้ซีทรูฉลุลายประดับสะโพกด้านหลัง",
    priceRange: "4,000 - 5,300 บาท",
    fabricRecommend: "Italian Silk Crepe & French Chantilly Lace",
    image: "https://images.unsplash.com/photo-1583391265517-35bbadd01209?auto=format&fit=crop&q=80&w=600",
    category: "Minimalist",
    features: ["งานปักโค้งช่วงคอพรีเมียม", "ดีเทลลูกไม้ซีทรูสะโพกหลัง", "ทรงหางปลาเบาๆ"],
    sizes: ["S", "M", "L", "XL"],
    sizePrices: { "S": 4000, "M": 4400, "L": 4800, "XL": 5300 }
  },
  {
    id: "cat-16",
    sku: "NNH-DRS-D",
    name: "Dress D: Delilah Floral Bouquet Wrap Gown",
    description: "ชุดเดรสคอวีป้ายหน้าแขนพองทรงเจ้าหญิง ตกแต่งช่อดอกไม้ผ้าสามมิติโทนสีแชมเปญพาสเทลประดับบริเวณช่วงเอว ให้ลุคหวานละมุนและภูมิฐาน",
    priceRange: "4,800 - 6,200 บาท",
    fabricRecommend: "Double Georgette Crepe & 3D Floral Applique",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600",
    category: "Abaya",
    features: ["ช่อดอกไม้ 3D ประดับเอว", "คอวีป้ายหน้าสวมใส่ง่าย", "แขนพองทรงบอลลูนสวยงาม"],
    sizes: ["SS", "S", "M", "L", "XL"],
    sizePrices: { "SS": 4800, "S": 5200, "M": 5600, "L": 6000, "XL": 6200 }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "order-1",
    orderNumber: "NU-26001",
    customerName: "คุณอมิรา ลาติฟ",
    customerPhone: "081-234-5678",
    customerSocial: "@amira.style",
    dressType: "อาบายะห์",
    fabricType: "Premium Silk Crepe",
    fabricColor: "Midnight Black & Gold",
    orderDate: "2026-06-20",
    deliveryDate: "2026-07-04", // วันเสาร์หน้า (รอบใกล้ส่ง)
    price: 4500,
    deposit: 2000,
    measurements: {
      chest: "34",
      waist: "27",
      hips: "38",
      shoulder: "15",
      sleeveLength: "22",
      armhole: "16",
      length: "56",
      neck: "14",
      height: "162",
      weight: "52",
      otherNotes: "ต้องการความยาวพิเศษเพื่อให้คลุมรองเท้าส้นสูง 2 นิ้ว แขนเสื้อปักแน่นพิเศษ"
    },
    status: OrderStatus.READY, // เสร็จแล้ว พร้อมจัดส่ง
    notes: "จัดเตรียมกล่องของขวัญ NUNUH ผูกโบว์ทองแนบไปด้วย ลูกค้ารีบใช้ใส่ออกงานแต่งงานเช้าวันที่ 5 ก.ค.",
    selectedDesignId: "cat-1",
    branch: "สาขานราธิวาส"
  },
  {
    id: "order-2",
    orderNumber: "NU-26002",
    customerName: "คุณมินทรา ศิริสุข",
    customerPhone: "092-888-7711",
    customerSocial: "Line: mint_sweet",
    dressType: "เดรสราตรี",
    fabricType: "Heavy Satin",
    fabricColor: "Emerald Green",
    orderDate: "2026-06-25",
    deliveryDate: "2026-07-08", // กลางสัปดาห์หน้า
    price: 4800,
    deposit: 2400,
    measurements: {
      chest: "32",
      waist: "25",
      hips: "35",
      shoulder: "14.5",
      sleeveLength: "0", // แขนกุด
      armhole: "14",
      length: "54",
      neck: "13",
      height: "158",
      weight: "47",
      otherNotes: "เอวเข้ารูปเน้นเอวคอดเป็นพิเศษ และคอวีลึกขึ้น 1 นิ้วจากแบบมาตราฐาน"
    },
    status: OrderStatus.SEWING, // กำลังเย็บ
    notes: "ลูกค้านัดขอฟิตติ้งโครงชุดคร่าวๆ วันที่ 4 ก.ค. เพื่อตรวจสอบรอบเอวก่อนเย็บประกอบจริง",
    selectedDesignId: "cat-2",
    branch: "สาขายะลา"
  },
  {
    id: "order-3",
    orderNumber: "NU-26003",
    customerName: "คุณซาร่า อานนท์",
    customerPhone: "089-777-6655",
    customerSocial: "IG: sarah_an",
    dressType: "เดรสสูทมินิมอล",
    fabricType: "Italian Wool Blend",
    fabricColor: "Dusty Rose",
    orderDate: "2026-06-28",
    deliveryDate: "2026-07-15", // กลางเดือนหน้า
    price: 3900,
    deposit: 1500,
    measurements: {
      chest: "36",
      waist: "29",
      hips: "40",
      shoulder: "16",
      sleeveLength: "21",
      armhole: "17",
      length: "42",
      neck: "15",
      height: "165",
      weight: "56",
      otherNotes: "เพิ่มกระเป๋าซับในด้านซ้ายสำหรับใส่การ์ดและโทรศัพท์มือถือ"
    },
    status: OrderStatus.CUTTING, // กำลังตัดผ้า
    notes: "ซับในสีนู้ดชมพูอ่อนอัดกาวปกสูทให้ขึ้นทรงสวยงาม",
    selectedDesignId: "cat-4",
    branch: "สาขาปัตตานี"
  },
  {
    id: "order-4",
    orderNumber: "NU-26004",
    customerName: "คุณแพรวา มิตรรัก",
    customerPhone: "085-333-2211",
    customerSocial: "@praewa.official",
    dressType: "ชุดมงคลสไตล์คาฟทัน",
    fabricType: "French Lace & Chiffon",
    fabricColor: "Off-White Cream",
    orderDate: "2026-06-29",
    deliveryDate: "2026-07-02", // วันนี้ (ส่งมอบสำเร็จแล้ว)
    price: 5000,
    deposit: 5000, // ชำระเต็มจำนวนแล้ว
    measurements: {
      chest: "35",
      waist: "28",
      hips: "39",
      shoulder: "15.5",
      sleeveLength: "20",
      armhole: "15",
      length: "55",
      neck: "13.5",
      height: "160",
      weight: "50",
      otherNotes: "ซับในแบบทึบพิเศษ ไม่โป๊ ไม่เห็นสัดส่วนด้านในเวลาต้องแสงแดด"
    },
    status: OrderStatus.COMPLETED, // ส่งมอบแล้ว
    notes: "จัดส่ง Messenger ด่วนถึงมือลูกค้าเรียบร้อยแล้วตอนเวลา 14:00 น. ลูกค้าชื่นชอบมาก",
    selectedDesignId: "cat-3",
    branch: "สาขาหาดใหญ่"
  },
  {
    id: "order-5",
    orderNumber: "NU-26005",
    customerName: "คุณมารีย์ พลพงษ์",
    customerPhone: "095-444-3322",
    customerSocial: "Line: marie_sweetie",
    dressType: "เดรสราตรีพาสเทล",
    fabricType: "Luminous Organza",
    fabricColor: "Lavender Mist",
    orderDate: "2026-07-01",
    deliveryDate: "2026-07-22", // ปลายเดือนหน้า
    price: 4500,
    deposit: 1500,
    measurements: {
      chest: "33",
      waist: "26",
      hips: "36",
      shoulder: "15",
      sleeveLength: "10", // แขนตุ๊กตา
      armhole: "15",
      length: "50",
      neck: "13",
      height: "161",
      weight: "48",
      otherNotes: "ความพองของแขนเอาแบบปานกลาง กระโปรงเพิ่มความบานด้วยผ้าชีฟองชั้นในเสริมพอง"
    },
    status: OrderStatus.RECEIVED, // เพิ่งได้รับออเดอร์
    notes: "มัดจำโอนมาแล้ว รอจัดหาผ้าม้วนพิเศษสี Lavender Mist ยี่ห้อ Solitaire นำเข้า",
    selectedDesignId: "cat-5",
    branch: "สาขานราธิวาส"
  },
  {
    id: "order-6",
    orderNumber: "NU-26006",
    customerName: "คุณดลยา กุลนา",
    customerPhone: "082-111-9999",
    customerSocial: "Line: don_ya_na",
    dressType: "เดรสราตรีร่วมสมัย (Custom Design)",
    fabricType: "Premium Silk Crepe",
    fabricColor: "Ruby Burgundy",
    orderDate: "2026-07-02", // วันนี้
    deliveryDate: "2026-07-10", // สัปดาห์ถัดไป (ฟิตติ้ง)
    price: 5200,
    deposit: 2600,
    measurements: {
      chest: "35",
      waist: "28",
      hips: "37",
      shoulder: "15",
      sleeveLength: "22",
      armhole: "15.5",
      length: "58",
      neck: "14",
      height: "163",
      weight: "51",
      otherNotes: "ปกคอจีนผสมผสานด้านหน้าผ่าลึก แขนกระดิ่งจับจีบรวบข้อมือ"
    },
    status: OrderStatus.DESIGNING, // ขั้นตอนสเก็ตช์/สรุปแบบ
    notes: "ลูกค้าเลือกทรง A-Line ตกแต่งคอจีนแบบลึก แขนกระดิ่งสวยสง่า มีกระเป๋าข้างสำหรับใส่ทิชชู่เบาๆ",
    customDesign: {
      silhouette: "A-Line",
      neckline: "High Neck (คอจีน)",
      sleeves: "Bell Sleeves (แขนกระดิ่ง)"
    },
    branch: "สาขายะลา"
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    orderId: "order-4",
    orderNumber: "NU-26004",
    customerName: "คุณแพรวา มิตรรัก",
    dressType: "ชุดมงคลสไตล์คาฟทัน",
    rating: 5,
    ratingDress: 5,
    ratingFabric: 5,
    ratingService: 5,
    comment: "งานเย็บประณีตละเอียดมากค่ะ ซับในหนาพอดีอย่างที่ตกลงกันไว้ ใส่ไปงานแต่งงานแล้วทุกคนชมว่าชุดหรูหรามาก ขอบคุณช่างและทีมงาน NUNUH ทุกคนนะคะ",
    reviewImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300",
    tailorNote: "ดีไซน์คอวีปักเม็ดคริสตัลลูกค้าประทับใจมาก ช่างตัดแพทเทิร์นได้สัดส่วนคอและแขนที่บานระบายโปร่งได้สวยสง่าพอดี",
    createdAt: "2026-07-03"
  },
  {
    id: "rev-2",
    orderId: "order-past-1",
    orderNumber: "NU-25999",
    customerName: "คุณนัสรินดา หะยี",
    dressType: "อาบายะห์ Amira Luxury",
    rating: 5,
    ratingDress: 5,
    ratingFabric: 5,
    ratingService: 5,
    comment: "งานปักสวยสง่าอลังการและประณีตมากค่ะ ผ้าพรีเมียมซิลค์ทิ้งตัวมีน้ำหนักดี ใส่สบายเดินสะดวกไม่รั้งสะโพกเลย คุ้มค่าราคารอคอยค่ะ",
    reviewImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=300",
    tailorNote: "การเพิ่มความยาวพิเศษเพื่อให้คลุมรองเท้าส้นสูงและรอบวงแขน 16 นิ้วเป็นสัดส่วนที่เหมาะกับลูกค้าคนนี้มาก",
    createdAt: "2026-06-28"
  },
  {
    id: "rev-3",
    orderId: "order-past-2",
    orderNumber: "NU-25998",
    customerName: "คุณอานิสา ยะโก๊ะ",
    dressType: "เดรสราตรีผ้าซาตินมรกต",
    rating: 4,
    ratingDress: 4,
    ratingFabric: 5,
    ratingService: 4,
    comment: "ชุดสวยเงางามหรูหรามากค่ะ เข้ารูปเน้นช่วงเอวคอดดีมาก แต่อาจจะฟิตไปนิดตอนทานอาหาร ช่างที่ยะลาช่วยปรับแก้ขยายตะเข็บข้างให้ฟรีทันใจเลยค่ะ บริการประทับใจสุดๆ",
    reviewImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300",
    tailorNote: "สำหรับสไตล์คอถ่วงผ้าซาตินและทรงหางปลาแบบนี้ ในอนาคตควรเพื่อตะเข็บซ่อนซับในให้ขยายได้ง่ายขึ้น 0.5 นิ้วเป็นมาตรฐาน",
    createdAt: "2026-06-25"
  }
];
