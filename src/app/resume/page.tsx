import type { Metadata } from "next";
import { ResumeSheet } from "@/components/resume-sheet";

export const metadata: Metadata = {
  title: "เรซูเม่ — ณัฐพงษ์ ขวัญชัย",
  robots: { index: false },
};

export default function ResumePage() {
  return <ResumeSheet variant="default" />;
}
