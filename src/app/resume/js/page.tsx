import type { Metadata } from "next";
import { ResumeSheet } from "@/components/resume-sheet";

export const metadata: Metadata = {
  title: "เรซูเม่ (Full-stack JavaScript) — ณัฐพงษ์ ขวัญชัย",
  robots: { index: false },
};

export default function ResumeJsPage() {
  return <ResumeSheet variant="js" />;
}
