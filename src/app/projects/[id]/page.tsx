import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, flows, moduleGroups, projects, type CaseStudyId } from "@/content/data";
import { Chip, KindChip, StatRow } from "@/components/blocks";
import { DavSequence, FlowSteps, OrderStateChain, ReconcilePipeline } from "@/components/diagrams";
import { ModuleGroups } from "@/components/modules";

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export async function generateMetadata(props: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const c = cases.find((x) => x.id === id);
  return c
    ? { title: `${c.title} — ณัฐพงษ์ ขวัญชัย`, description: c.tagline }
    : { title: "ไม่พบโปรเจกต์" };
}

function renderDiagram(id: CaseStudyId) {
  switch (id) {
    case "workpaper":
      return <DavSequence />;
    case "reconcile":
      return <ReconcilePipeline />;
    case "laundry":
      return <OrderStateChain />;
    case "customer-drive":
    case "auditfirm":
    case "order-tracking":
    case "contractor-billing": {
      const flow = flows[id];
      return flow ? <FlowSteps flow={flow} /> : null;
    }
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function H({ children }: { children: string }) {
  return <h2 className="m-0 mb-4 border-b-[3px] border-double border-ink-3/40 pb-2 text-[1.375rem] font-semibold leading-snug">{children}</h2>;
}

export default async function ProjectPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const c = cases.find((x) => x.id === id);
  const meta = projects.find((x) => x.id === id);
  if (!c || !meta) notFound();

  const groups = moduleGroups[c.id];
  const diagram = renderDiagram(c.id);

  return (
    <>
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-[860px] items-center justify-between px-5 py-3">
          <Link href="/#projects" className="font-medium text-accent no-underline hover:underline">
            ← กลับไปหน้าแรก
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-2 no-underline hover:text-accent"
          >
            เรซูเม่ (PDF)
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[860px] px-5 pb-20 pt-12">
        <KindChip kind={meta.kind} />
        <h1 className="mb-3 mt-4 text-[2rem] font-semibold leading-tight md:text-[2.5rem]">{c.title}</h1>
        <p className="m-0 mb-8 max-w-[36em] text-[1.125rem] text-ink-2">{c.tagline}</p>
        <StatRow stats={c.numbers} />

        <div className="mt-12 space-y-12">
          <section>
            <H>สิ่งที่ทำ</H>
            <ul className="m-0 space-y-2 pl-5 text-ink-2">
              {c.did.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>

          <section>
            <H>โจทย์</H>
            <p className="m-0 text-ink-2">{c.context}</p>
          </section>

          {diagram ? <section className="rounded-[6px] border border-rule bg-bg-soft p-5 md:p-6">{diagram}</section> : null}

          <section>
            <H>ส่วนที่ยากที่สุด</H>
            <ol className="m-0 list-none space-y-6 p-0">
              {c.hardest.map((h, i) => (
                <li key={h.title} className="grid grid-cols-[2rem_1fr]">
                  <span className="font-semibold text-accent">{i + 1}</span>
                  <div>
                    <p className="m-0 font-semibold">{h.title}</p>
                    <p className="m-0 mt-1 text-ink-2">{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <H>เรื่องที่ตัดสินใจ</H>
            <dl className="m-0 space-y-5">
              {c.decisions.map((d) => (
                <div key={d.title}>
                  <dt className="font-semibold">{d.title}</dt>
                  <dd className="m-0 mt-1 text-ink-2">{d.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          {groups ? (
            <section>
              <H>ภายในระบบ</H>
              <p className="m-0 mb-6 text-ink-3">กดที่ชื่อโมดูลเพื่อดูรายละเอียด</p>
              <ModuleGroups groups={groups} />
            </section>
          ) : null}

          <section className="grid gap-10 md:grid-cols-2">
            <div>
              <H>ตรวจงานยังไง</H>
              <ul className="m-0 space-y-2 pl-5 text-ink-2">
                {c.verification.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
            <div>
              <H>ที่ยังไม่ดี</H>
              <ul className="m-0 space-y-2 pl-5 text-ink-2">
                {c.limits.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            {c.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
