import type { Metadata } from "next";
import { Noto_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { activeAccent } from "@/content/theme";

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ใช้กับตัวอักษรละตินในแผนภาพเท่านั้น (เช่น ชื่อคำสั่ง WebDAV)
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "ณัฐพงษ์ ขวัญชัย | PHP / Full-stack Developer";
const description =
  "พอร์ตโฟลิโอของณัฐพงษ์ ขวัญชัย นักพัฒนาเว็บสาย PHP, Laravel และ Next.js ฝึกงาน 7 เดือนที่บริษัท บิ๊กสาระ จำกัด พัฒนาระบบงานจริงและต้นแบบ 7 โปรเจกต์";
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "th_TH",
    title,
    description,
    images: [{ url: "/photo.jpg", alt: "ณัฐพงษ์ ขวัญชัย" }],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/photo.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" data-accent={activeAccent} className={`${notoThai.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
