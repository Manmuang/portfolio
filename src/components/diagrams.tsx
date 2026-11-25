import { orderStates, type Flow } from "@/content/data";

/* ───────── 1) ลำดับคำขอ WebDAV: ทำไม Ctrl+S ถึงกลับเข้าเว็บ ───────── */

const W = {
  excel: 100,
  dav: 380,
  store: 660,
};

type Msg = { y: number; from: number; to: number; label: string; dashed?: boolean; trap?: boolean };

const messages: Msg[] = [
  { y: 112, from: W.excel, to: W.dav, label: "OPTIONS · PROPFIND" },
  { y: 148, from: W.dav, to: W.excel, label: "200 + ETag", dashed: true },
  { y: 184, from: W.excel, to: W.dav, label: "GET ไฟล์" },
  { y: 220, from: W.excel, to: W.dav, label: "LOCK", trap: true },
  { y: 256, from: W.excel, to: W.dav, label: "PUT (If: lock-token)" },
  { y: 292, from: W.dav, to: W.store, label: "จองเลขเวอร์ชัน → บันทึก v+1", trap: true },
  { y: 328, from: W.excel, to: W.dav, label: "PROPPATCH · UNLOCK" },
];

const traps = [
  { n: "1", x: W.excel + 8, y: 60, text: "ลิงก์ยาวไม่เกิน 216 ตัวอักษร ชื่อไทยไม่เข้ารหัส" },
  { n: "2", x: W.dav + 10, y: 220 - 26, text: "ต่ออายุล็อกต้องคืน lock token เดิม" },
  { n: "3", x: W.dav + 10, y: 292 - 26, text: "ล็อกแถวตอนจองเลขเวอร์ชัน" },
];

export function DavSequence({ fit = false }: { fit?: boolean }) {
  return (
    <figure className="m-0">
      <div className={fit ? "" : "overflow-x-auto"}>
        <svg
          viewBox="0 0 760 380"
          role="img"
          aria-label="ลำดับคำขอที่ Excel ส่งไปยัง WebDAV ตั้งแต่เปิดไฟล์จนถึงกด Ctrl+S แล้วได้เวอร์ชันใหม่ พร้อมจุดที่เป็นกับดักสามข้อ"
          className={`block h-auto w-full text-ink-2 ${fit ? "" : "min-w-[680px]"}`}
        >
          <defs>
            <marker id="dav-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          {[
            { x: W.excel, t: "Excel บนเครื่อง" },
            { x: W.dav, t: "/dav/{token}/ไฟล์" },
            { x: W.store, t: "ที่เก็บเวอร์ชัน" },
          ].map((c) => (
            <g key={c.t}>
              <rect x={c.x - 80} y={14} width={160} height={30} rx={4} className="fill-bg-soft stroke-rule" />
              <text x={c.x} y={34} textAnchor="middle" fontSize={13} className="fill-ink font-sans" fontWeight={500}>
                {c.t}
              </text>
              <line x1={c.x} y1={44} x2={c.x} y2={360} className="stroke-rule" strokeDasharray="3 4" />
            </g>
          ))}

          {messages
            .filter((m) => m.trap)
            .map((m) => (
              <rect key={`band-${m.y}`} x={W.excel - 80} y={m.y - 34} width={W.store - W.excel + 160} height={44} rx={4} className="fill-accent-soft" />
            ))}

          {messages.map((m) => {
            const dir = m.to > m.from ? 1 : -1;
            return (
              <g key={m.y}>
                <line
                  x1={m.from + dir * 2}
                  y1={m.y}
                  x2={m.to - dir * 4}
                  y2={m.y}
                  stroke="currentColor"
                  strokeWidth={m.trap ? 2 : 1}
                  strokeDasharray={m.dashed ? "5 4" : undefined}
                  markerEnd="url(#dav-arrow)"
                  className={m.trap ? "text-accent" : "text-ink-3"}
                />
                <text
                  x={(m.from + m.to) / 2}
                  y={m.y - 6}
                  textAnchor="middle"
                  fontSize={12}
                  className="fill-ink font-mono"
                >
                  {m.label}
                </text>
              </g>
            );
          })}

          {traps.map((t) => (
            <g key={t.n}>
              <circle cx={t.x + 9} cy={t.y} r={9} className="fill-accent" />
              <text x={t.x + 9} y={t.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-bg font-sans">
                {t.n}
              </text>
              <text x={t.x + 24} y={t.y + 4} fontSize={12} className="fill-accent font-sans">
                {t.text}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 text-[0.9375rem] text-ink-3">
        เส้นทางนี้ไม่มี cookie ยืนยันตัวด้วย token ใน URL ซึ่งผูกกับไฟล์เดียว ผู้ใช้เดียว และมีอายุ
      </figcaption>
    </figure>
  );
}

/* ───────── 2) สายเทียบสามแหล่ง ───────── */

const sources = ["PDF บิล", "ไฟล์ ASN (Excel)", "ไฟล์ VBRP (Excel)"];
const statuses = [
  { name: "สมบูรณ์", note: "ผ่านทุกข้อ", tone: "ok" },
  { name: "รอแก้ไข PDF", note: "ปุ่มแก้ไขแก้ให้ได้", tone: "warn" },
  { name: "รอแก้ไข ASN", note: "ต้องแก้ต้นทางแล้วนำเข้าใหม่", tone: "warn" },
  { name: "ผิดพลาด", note: "ต้องตรวจเอง", tone: "bad" },
] as const;

const toneClass = {
  ok: "border-ok text-ok",
  warn: "border-warn text-warn",
  bad: "border-ink-3 text-ink-2",
} as const;

export function ReconcilePipeline() {
  return (
    <figure className="m-0">
      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1.1fr_auto_1.2fr]">
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {sources.map((s) => (
            <li key={s} className="rounded-[4px] border border-rule bg-bg-soft px-3 py-2 text-[0.9375rem]">
              {s}
            </li>
          ))}
        </ol>
        <Arrow />
        <div className="flex flex-col justify-center rounded-[4px] border border-accent bg-accent-soft px-4 py-3 text-[0.9375rem]">
          <div className="font-medium text-accent">เทียบทีละรายการ</div>
          <div className="mt-1 text-ink-2">
            จำนวน · ยอดก่อน VAT · VAT · สาขา · บาร์โค้ด และยอดรวมท้ายบิลต้องตรงกับรายการของบิลเอง
          </div>
        </div>
        <Arrow />
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {statuses.map((s) => (
            <li key={s.name} className={`rounded-[4px] border px-3 py-2 text-[0.9375rem] ${toneClass[s.tone]}`}>
              <span className="font-medium">{s.name}</span>
              <span className="ml-2 text-ink-3">{s.note}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-[0.9375rem] text-ink-3">
        บิลได้สถานะที่แย่ที่สุดของรายการในบิล หลังจากนั้นกดแก้ไข แยก PDF เป็นไฟล์ละบิล และสั่งพิมพ์เป็นรอบแยกตามสาขา
      </figcaption>
    </figure>
  );
}

function Arrow() {
  return (
    <div aria-hidden className="flex items-center justify-center text-ink-3 md:px-1">
      <span className="rotate-90 md:rotate-0">→</span>
    </div>
  );
}

/* ───────── 3) เส้นทางสถานะของออเดอร์ ───────── */

const actors: Record<string, string> = {
  PENDING: "ลูกค้าสร้างออเดอร์",
  ACCEPTED: "แอดมินรับงาน",
  RIDER_PICKUP: "ไรเดอร์กดรับ (atomic)",
  PAID: "SlipOK ตรวจสลิป",
  RIDER_DELIVER: "แอดมินส่งงานให้ไรเดอร์",
  COMPLETED: "ไรเดอร์ส่ง + รูปหลักฐาน",
};

export function OrderStateChain() {
  return (
    <figure className="m-0">
      <ol className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-4 p-0 sm:grid-cols-4">
        {orderStates.map((s, i) => (
          <li key={s} className="relative">
            <div className="rounded-[4px] border border-rule bg-bg-soft px-3 py-2">
              <div className="font-mono text-[0.875rem] leading-tight text-ink">{s}</div>
              <div className="mt-1 min-h-[2.4em] text-[0.875rem] leading-snug text-ink-3">{actors[s] ?? " "}</div>
            </div>
            {i < orderStates.length - 1 && (
              <span aria-hidden className="absolute -right-2.5 top-3 hidden text-ink-3 sm:block">
                {(i + 1) % 4 === 0 ? "" : "→"}
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[0.9375rem] text-ink-3">
        ยกเลิก (CANCELLED) ได้จาก PENDING, ACCEPTED และ PAYMENT_PENDING เท่านั้น · ทุกการเปลี่ยนสถานะผ่าน
        <code className="mx-1 font-mono text-[0.9em]">updateOrderStatus</code>
        ที่เดียว
      </figcaption>
    </figure>
  );
}

/* ───────── 4) แผนภาพขั้นตอนทั่วไป (ใช้กับโปรเจกต์ที่ไม่มีแผนภาพเฉพาะ) ───────── */

export function FlowSteps({ flow }: { flow: Flow }) {
  return (
    <figure className="m-0">
      <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {flow.steps.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-[4px] border border-rule bg-bg p-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[0.8125rem] font-semibold text-bg"
            >
              {i + 1}
            </span>
            <span>
              <span className="block font-semibold leading-snug">{s.title}</span>
              {s.note ? <span className="block text-[0.9375rem] leading-snug text-ink-3">{s.note}</span> : null}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[0.9375rem] text-ink-3">{flow.caption}</figcaption>
    </figure>
  );
}
