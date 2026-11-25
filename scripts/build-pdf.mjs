/**
 * สร้างเรซูเม่ A4 หน้าเดียวจากหน้า /resume ที่ build เป็น static แล้ว (โฟลเดอร์ out/)
 *
 *   npm run build && npm run pdf
 *
 * ได้สองไฟล์:
 *   public/resume.pdf                 แบบทั่วไป (ปุ่มดาวน์โหลดบนเว็บชี้มาที่ไฟล์นี้)
 *   private/resume-fullstack-js.pdf   แบบเน้น Full-stack JavaScript ไว้แนบสมัครงานที่ใช้สแตกนั้น
 *
 * ถ้าเนื้อหายาวเกิน 1 หน้า สคริปต์จะหยุดพร้อมบอกว่าล้นกี่ px — ให้ตัดเนื้อหา ไม่ใช่ลดขนาดตัวอักษร
 * ใส่ --shot เพื่อบันทึกภาพไว้ตรวจที่ private/resume*.png
 */
import { createServer } from "node:http";
import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = join(root, "out");
const wantShot = process.argv.includes("--shot");

const targets = [
  { route: "/resume", pdf: join(root, "public", "resume.pdf"), shot: "resume.png", copyToOut: true },
  { route: "/resume/js", pdf: join(root, "private", "resume-fullstack-js.pdf"), shot: "resume-js.png", copyToOut: false },
];

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const base = join(outDir, clean);
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (candidate.startsWith(outDir) && (await exists(candidate))) return candidate;
  }
  return null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = await resolveFile(pathname);
  if (!file) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": mime[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

async function render({ route, pdf, shot, copyToOut }) {
  const context = await browser.newContext({ viewport: { width: 794, height: 1123 }, colorScheme: "light" });
  const page = await context.newPage();
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-resume-ready]");
  await page.evaluate(() => document.fonts.ready);

  // ความสูงที่เนื้อหาต้องใช้จริงของแต่ละคอลัมน์ (วัดจากองค์ประกอบสุดท้าย + ระยะขอบล่าง 32px)
  const free = await page.evaluate(() => {
    const sheet = document.querySelector(".a4");
    const top = sheet.getBoundingClientRect().top;
    return [...sheet.children].map((col) => {
      const last = col.lastElementChild;
      const needed = last.getBoundingClientRect().bottom - top + 32;
      return Math.round(sheet.clientHeight - needed);
    });
  });
  if (Math.min(...free) < 0) {
    throw new Error(`${route} ล้นหน้า A4 ไป ${-Math.min(...free)}px — ให้ตัดเนื้อหาใน src/content/data.ts`);
  }

  if (wantShot) {
    await mkdir(join(root, "private"), { recursive: true });
    await page.locator(".a4").screenshot({ path: join(root, "private", shot) });
  }

  await mkdir(join(pdf, ".."), { recursive: true });
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (copyToOut) {
    await mkdir(outDir, { recursive: true });
    await copyFile(pdf, join(outDir, "resume.pdf"));
  }
  await context.close();
  console.log(`✓ ${route} → ${pdf}  (พื้นที่เหลือ: แถบซ้าย ${free[0]}px, เนื้อหาหลัก ${free[1]}px)`);
}

try {
  for (const t of targets) await render(t);
} finally {
  await browser.close();
  server.close();
}
