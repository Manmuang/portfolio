import type { ReactNode } from "react";
import type { Stat } from "@/content/data";
import { Protect } from "@/components/protect";

export function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "accent" }) {
  return (
    <span
      className={
        tone === "accent"
          ? "inline-block rounded-[4px] bg-accent-soft px-3 py-0.5 text-[0.9375rem] font-medium leading-7 text-accent"
          : "inline-block rounded-[4px] border border-rule px-3 py-0.5 text-[0.9375rem] leading-7 text-ink-2"
      }
    >
      {children}
    </span>
  );
}

const kindLabel = {
  internship: "ฝึกงานที่บิ๊กสาระ",
  personal: "โปรเจกต์ส่วนตัว",
  course: "โปรเจกต์วิชา",
} as const;

export function KindChip({ kind }: { kind: keyof typeof kindLabel }) {
  if (kind === "personal") return null;
  return <Chip tone={kind === "internship" ? "accent" : "plain"}>{kindLabel[kind]}</Chip>;
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 py-12">
      <h2 className="m-0 mb-8 border-b-[3px] border-double border-ink-3/40 pb-3 text-[1.75rem] font-semibold leading-snug">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function StatRow({ stats }: { stats: Stat[] }) {
  const cols = stats.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-4";
  return (
    <dl className={`m-0 grid grid-cols-2 gap-x-8 gap-y-5 ${cols}`}>
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="m-0">
            <span className="block text-[1.75rem] font-semibold leading-tight tabular-nums">{s.value}</span>
            <span className="block text-pretty text-[0.9375rem] leading-snug text-ink-3">
              <Protect>{s.label}</Protect>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
