import { Fragment, type ReactNode } from "react";
import { allProjects, experience, profile, resumeVariants } from "@/content/data";
import { photoSrc } from "@/content/photo";
import { activeAccent } from "@/content/theme";
import { Protect } from "@/components/protect";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="m-0 mb-2 border-b-2 border-brand pb-0.5 text-[15.5px] font-semibold leading-snug text-accent">{title}</h2>
      {children}
    </section>
  );
}

/** รายการสั้น ๆ คั่นด้วย “·” — แต่ละรายการไม่ถูกตัดกลาง และเครื่องหมายคั่นอยู่ท้ายบรรทัดเสมอ ไม่ขึ้นต้นบรรทัด */
function Items({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <p className={`m-0 text-pretty ${className}`}>
      {items.map((it, i) => (
        <Fragment key={it}>
          {i > 0 ? " " : null}
          {/* รายการสั้นห้ามตัดกลาง แต่รายการยาวกว่าแถบข้างต้องตัดบรรทัดได้ ไม่งั้นล้นขอบ */}
          <span className={it.length > 22 ? "" : "whitespace-nowrap"}>
            {it}
            {i < items.length - 1 ? " ·" : ""}
          </span>
        </Fragment>
      ))}
    </p>
  );
}

/** เรซูเม่ A4 หน้าเดียว — ทุกแบบใช้ข้อเท็จจริงชุดเดียวกันจาก data.ts เลือกแค่ลำดับและน้ำหนัก */
export function ResumeSheet({ variant }: { variant: keyof typeof resumeVariants }) {
  const v = resumeVariants[variant];
  const photo = photoSrc();
  const contacts = [
    ["อีเมล", profile.contact.email],
    ["โทร", profile.contact.phone],
    ["LINE", profile.contact.line],
    ["GitHub", profile.contact.github.replace(/^https?:\/\//, "")],
    ["LinkedIn", profile.contact.linkedin.replace(/^https?:\/\//, "")],
  ].filter(([, value]) => value);
  const shown = v.projectIds
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is (typeof allProjects)[number] => Boolean(p));

  return (
    <div className="paper-light" data-accent={v.accent ?? activeAccent}>
      <main className="a4" data-resume-ready="1">
        {/* ───── แถบซ้าย: รูป ติดต่อ ทักษะ การศึกษา ───── */}
        <aside className="flex flex-col gap-4 bg-bg-soft px-6 pb-8 pt-8 text-[13.5px]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              className="block h-[200px] w-full rounded-[6px] border border-rule object-cover object-top"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-[200px] w-full items-center justify-center rounded-[6px] border border-rule bg-bg text-[42px] font-semibold text-ink-3"
            >
              ณ
            </div>
          )}

          <div className="-mt-1">
            <h1 className="m-0 text-[21px] font-semibold leading-snug">{profile.name}</h1>
            <p className="m-0 text-[13px] text-ink-3">{profile.nameEn}</p>
            <p className="m-0 mt-1 text-[14px] font-semibold leading-snug text-accent">{v.role ?? profile.role}</p>
          </div>

          {contacts.length > 0 ? (
            <Block title="ติดต่อ">
              <ul className="m-0 list-none space-y-0.5 p-0">
                {contacts.map(([k, val]) => (
                  <li key={k} className="break-words text-ink-2">
                    {k === "LINE" ? <span className="text-ink-3">LINE: </span> : null}
                    {val}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          <Block title="ทักษะ">
            <div className="space-y-2.5">
              {v.skills.map((s) => (
                <div key={s.group}>
                  <p className="m-0 font-semibold">{s.group}</p>
                  {s.steps ? (
                    <ol className="m-0 mt-1 list-none space-y-1 p-0">
                      {s.items.map((it, i) => (
                        <li key={it} className="grid grid-cols-[1.1rem_1fr]">
                          <span className="font-semibold text-accent">{i + 1}</span>
                          <span className="text-pretty text-ink-2">
                            <Protect>{it}</Protect>
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <Items items={s.items} className="text-ink-2" />
                  )}
                </div>
              ))}
            </div>
          </Block>
        </aside>

        {/* ───── เนื้อหาหลัก ───── */}
        <div className="flex flex-col gap-5 px-8 pb-8 pt-9">
          <Block title="สรุป">
            <p className="m-0 text-pretty text-ink-2">
              <Protect>{v.summary}</Protect>
            </p>
          </Block>

          <Block title="การศึกษาและประสบการณ์">
            <div>
              <p className="m-0 font-semibold">{profile.education.university}</p>
              <p className="m-0 text-ink-2">
                {profile.education.faculty} {profile.education.program}
                {profile.education.gpa ? ` · GPA ${profile.education.gpa}` : ""}
              </p>
            </div>
            <div className="mt-2.5">
              <p className="m-0 font-semibold">{experience.position}</p>
              <p className="m-0 flex flex-wrap justify-between gap-x-3 text-ink-2">
                <span className="whitespace-nowrap">{experience.company}</span>
                <span className="whitespace-nowrap text-ink-3">{experience.period}</span>
              </p>
              <p className="m-0 text-[13.5px] text-ink-3">มีหนังสือรับรองการฝึกงาน (แนบแยก)</p>
            </div>
          </Block>

          <Block title="ผลงานเด่น">
            <ul className="m-0 list-none space-y-2.5 p-0">
              {shown.map((p) => (
                <li key={p.id}>
                  <p className="m-0 text-[14.5px] font-semibold">{p.title}</p>
                  <p className="m-0 text-pretty text-ink-2">
                    <Protect>{p.resumeLine}</Protect>
                  </p>
                  <Items items={p.tags} className="text-[13px] text-ink-3" />
                </li>
              ))}
              {(v.extra ?? []).map((x) => (
                <li key={x.title}>
                  <p className="m-0 text-[14.5px] font-semibold">{x.title}</p>
                  <p className="m-0 text-pretty text-ink-2">
                    <Protect>{x.line}</Protect>
                  </p>
                  <Items items={x.tags} className="text-[13px] text-ink-3" />
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </main>
    </div>
  );
}
