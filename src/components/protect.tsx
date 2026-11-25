import { Fragment } from "react";

/**
 * คำที่ห้ามตัดกลางคำเมื่อขึ้นบรรทัดใหม่ — ภาษาไทยไม่มีช่องว่าง เบราว์เซอร์จึงอาจตัดกลางคำประกอบ
 * (เช่น "ผู้รับ / เหมา") และชื่อเทคโนโลยีที่มีช่องว่าง (เช่น "Tailwind / CSS") เพิ่มคำที่เจอได้ที่นี่
 */
const TERMS = [
  "ชุดทดสอบ 626 check",
  "ลายเซ็นสอบทาน 3 ชั้น",
  "บริษัท บิ๊กสาระ จำกัด",
  "36 โมดูล 359 endpoint",
  "ผู้รับเหมา",
  "เลขออเดอร์",
  "พอร์ทัล",
  "คอมพิวเตอร์",
  "Tailwind CSS",
  "LINE API",
  "Next.js",
  "Supabase",
  "หน้าจอ",
  "5 ระบบ",
  "7 เดือน",
  "44 รอบ",
  "แก้ไฟล์",
  "หลายสาขา",
  "แยกสาขา",
  "ซ้ำหรือหาย",
  "ไม่ให้ข้อมูลเสีย",
  "หัก ณ ที่จ่าย",
  "Google Drive",
  "ไรเดอร์",
  "เขียนโค้ดเป็นหลัก",
  "ทดสอบเอง",
  "บริการของ Twilio",
  "ไม่ทำลายข้อมูล",
  "พื้นฐาน",
];

const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(`(${[...TERMS].sort((a, b) => b.length - a.length).map(escape).join("|")})`);

export function Protect({ children }: { children: string }) {
  // ติดเครื่องหมายคั่น “·” กับคำก่อนหน้า เพื่อให้มันอยู่ท้ายบรรทัดเสมอ ไม่ขึ้นต้นบรรทัดใหม่
  const text = children.replace(/ · /g, "\u00A0· ");
  // split ด้วยกลุ่มจับคู่: ชิ้นที่เป็นคำต้องห้ามตัดจะอยู่ตำแหน่งคี่
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
