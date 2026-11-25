import Link from "next/link";
import { experience, heroFacts, profile, projects, skills } from "@/content/data";
import { photoSrc } from "@/content/photo";
import { Chip, KindChip, Section, StatRow } from "@/components/blocks";
import { Protect } from "@/components/protect";

export default function Home() {
  const photo = photoSrc();
  const featured = projects.filter((p) => p.detail);
  const others = projects.filter((p) => !p.detail);
  const contacts = (
    [
      ["อีเมล", profile.contact.email, profile.contact.email ? `mailto:${profile.contact.email}` : "", false],
      [
        "โทร",
        profile.contact.phone,
        profile.contact.phone ? `tel:${profile.contact.phone.replace(/[^+\d]/g, "")}` : "",
        false,
      ],
      ["LINE", profile.contact.line, "", false],
      ["GitHub", profile.contact.github.replace(/^https?:\/\//, ""), profile.contact.github, true],
      ["LinkedIn", profile.contact.linkedin.replace(/^https?:\/\//, ""), profile.contact.linkedin, true],
    ] as const
  ).filter(([, value]) => value);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-t-4 border-rule border-t-brand bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="font-semibold no-underline">
            {profile.name}
          </a>
          <nav aria-label="เมนูหลัก" className="hidden gap-7 text-ink-2 md:flex">
            <a href="#experience" className="no-underline transition-colors hover:text-accent">การศึกษา</a>
            <a href="#projects" className="no-underline transition-colors hover:text-accent">ผลงาน</a>
            <a href="#skills" className="no-underline transition-colors hover:text-accent">ทักษะ</a>
            <a href="#contact" className="no-underline transition-colors hover:text-accent">ติดต่อ</a>
          </nav>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[4px] bg-accent px-4 py-2 text-[0.9375rem] font-medium text-bg no-underline transition-opacity hover:opacity-90"
          >
            ดาวน์โหลดเรซูเม่
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[960px] px-5">
        {/* ───── แนะนำตัว ───── */}
        <section className="grid items-center gap-10 pb-14 pt-14 md:grid-cols-[1fr_auto] md:pt-20">
          <div>
            <p className="m-0 font-medium text-accent">{profile.role}</p>
            <h1 className="mb-5 mt-1 text-[2.5rem] font-semibold leading-tight md:text-[3.25rem]">{profile.name}</h1>
            <p className="m-0 mb-8 max-w-[34em] text-pretty text-[1.125rem] text-ink-2">
              <Protect>{profile.summary}</Protect>
            </p>
            <StatRow stats={heroFacts} />
          </div>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={`รูปถ่ายของ${profile.name}`}
              className="h-[220px] w-[176px] rounded-[6px] border border-rule object-cover object-top"
            />
          ) : null}
        </section>

        {/* ───── การศึกษาและประสบการณ์ ───── */}
        <Section id="experience" title="การศึกษาและประสบการณ์">
          <dl className="m-0 grid gap-8 md:grid-cols-2">
            <div>
              <dt className="mb-1 text-ink-3">การศึกษา</dt>
              <dd className="m-0">
                <p className="m-0 font-semibold">{profile.education.university}</p>
                <p className="m-0 text-ink-2">
                  {profile.education.faculty} {profile.education.program}
                </p>
                {profile.education.gpa ? (
                  <p className="m-0 mt-1 text-[0.9375rem] text-ink-3">เกรดเฉลี่ยสะสม {profile.education.gpa}</p>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-ink-3">ฝึกงาน</dt>
              <dd className="m-0">
                <p className="m-0 font-semibold">{experience.company}</p>
                <p className="m-0 text-pretty text-ink-2">
                  <span>{experience.position}</span>
                  {"\u00A0· "}
                  <span className="whitespace-nowrap">{experience.period}</span>
                </p>
                <p className="m-0 mt-1 text-[0.9375rem] text-ink-3">มีหนังสือรับรองการฝึกงาน ขอดูฉบับจริงได้</p>
              </dd>
            </div>
          </dl>
        </Section>

        {/* ───── ผลงาน ───── */}
        <Section id="projects" title="ผลงาน">
          <ul className="m-0 grid list-none gap-4 p-0">
            {featured.map((p) => (
              <li key={p.id} className="rounded-[6px] border border-rule p-5 md:p-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <KindChip kind={p.kind} />
                </div>
                <h3 className="m-0 text-[1.25rem] font-semibold leading-snug">{p.title}</h3>
                <p className="m-0 mt-1 text-pretty text-ink-2">
                  <Protect>{p.summary}</Protect>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {p.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <Link
                  href={`/projects/${p.id}`}
                  className="mt-4 inline-block font-medium text-accent underline decoration-transparent transition-colors underline-offset-4 hover:decoration-accent"
                >
                  ดูรายละเอียด →
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mb-4 mt-12 text-[1.125rem] font-semibold">ต้นแบบและงานอื่น</h3>
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.id} className="rounded-[6px] border border-rule p-4">
                <KindChip kind={p.kind} />
                <h4 className="m-0 mt-2 text-[1rem] font-semibold leading-snug">{p.title}</h4>
                <p className="m-0 mt-1 text-pretty text-[0.9375rem] leading-snug text-ink-2">
                  <Protect>{p.summary}</Protect>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ───── ทักษะ ───── */}
        <Section id="skills" title="ทักษะ">
          <div className="space-y-5">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-2 md:grid-cols-[12rem_1fr] md:gap-6">
                <p className="m-0 text-pretty font-medium">
                  <Protect>{s.group}</Protect>
                </p>
                {s.steps ? (
                  <ol className="m-0 list-none p-0">
                    {s.items.map((i, n) => (
                      <li
                        key={i}
                        className="relative grid grid-cols-[2.25rem_1fr] pb-5 last:pb-0"
                      >
                        {n < s.items.length - 1 ? (
                          <span aria-hidden className="absolute bottom-0 left-[0.8125rem] top-8 w-px bg-rule" />
                        ) : null}
                        <span
                          aria-hidden
                          className="flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-full bg-accent-soft text-[0.9375rem] font-semibold text-accent"
                        >
                          {n + 1}
                        </span>
                        <span>
                          <span className="block text-pretty font-medium leading-7">
                            <Protect>{i}</Protect>
                          </span>
                          {s.notes?.[n] ? (
                            <span className="block text-pretty text-ink-2">
                              <Protect>{s.notes[n]}</Protect>
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <Chip key={i}>{i}</Chip>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mb-0 mt-8 max-w-[40em] text-pretty text-ink-2">
            <Protect>{profile.about}</Protect>
          </p>
        </Section>

        {/* ───── ติดต่อ ───── */}
        <Section id="contact" title="ติดต่อ">
          {contacts.length > 0 ? (
            <ul className="m-0 list-none space-y-2 p-0">
              {contacts.map(([label, value, href, external]) => (
                <li key={label} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[6rem_minmax(0,1fr)]">
                  <span className="text-ink-3">{label}</span>
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="break-all underline decoration-rule underline-offset-4 hover:decoration-accent sm:break-normal"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="break-words">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-[960px] px-5 py-8 text-[0.9375rem] text-ink-3">
          {profile.name} · พอร์ตโฟลิโอ 2569
        </div>
      </footer>
    </>
  );
}
