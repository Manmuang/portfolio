import { existsSync } from "node:fs";
import { join } from "node:path";

const candidates = ["photo.jpg", "photo.jpeg", "photo.png", "photo.webp"];

/** คืน path ของรูปถ่ายถ้ามีไฟล์ public/photo.* ไม่งั้นคืน null (ตรวจตอน build) */
export function photoSrc(): string | null {
  const found = candidates.find((name) => existsSync(join(process.cwd(), "public", name)));
  return found ? `/${found}` : null;
}
