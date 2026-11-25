import type { ModuleGroup } from "@/content/data";

/**
 * รายการโมดูลภายในระบบ แต่ละโมดูลกดขยายดูรายละเอียดได้ (ใช้ <details> มาตรฐาน ไม่ต้องใช้ JavaScript)
 * ปิดไว้เป็นค่าตั้งต้น เพื่อให้หน้าไม่ยาวเกินไป ผู้ที่อยากรู้ลึกกดเข้าไปดูเอง
 */
export function ModuleGroups({ groups }: { groups: ModuleGroup[] }) {
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <div key={g.heading}>
          {g.heading !== "ภายในระบบ" ? (
            <h3 className="m-0 text-[1.125rem] font-semibold leading-snug">{g.heading}</h3>
          ) : null}
          {g.intro ? <p className="m-0 mt-1 text-pretty text-ink-3">{g.intro}</p> : null}
          <div className="mt-4 divide-y divide-rule rounded-[6px] border border-rule">
            {g.modules.map((m) => (
              <details key={m.name} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-3 hover:bg-bg-soft [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block font-semibold">{m.name}</span>
                    <span className="block text-[0.9375rem] leading-snug text-ink-2">{m.summary}</span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-[1.25rem] leading-none text-accent transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <ul className="m-0 space-y-2 px-4 pb-4 pl-9 text-[1rem] text-ink-2">
                  {m.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
