import Link from "next/link";
import { PageHero } from "./PageHero";
import { DynamicForm } from "./DynamicForm";
import type { PathwayInfo } from "@/lib/pathways";

export function PathwayPage({ p, formTitle, submitLabel }: { p: PathwayInfo; formTitle: string; submitLabel: string }) {
  return (
    <>
      <PageHero
        eyebrow={`Get Involved · ${p.title}`}
        title={p.id === "team" ? "Join the YPL team" : p.id === "board" ? "Apply to the YPL board" : "Join the advisory network"}
        lede={p.intro}
        crumbs={[{ label: "Get Involved", href: "/get-involved" }, { label: p.title }]}
      />
      <section className="section tight">
        <div className="container">
          <dl className="def-list">
            <div>
              <dt>Who it&apos;s for</dt>
              <dd><ul>{p.who.map((x) => <li key={x}>{x}</li>)}</ul></dd>
            </div>
            <div>
              <dt>Responsibilities</dt>
              <dd><ul>{p.responsibilities.map((x) => <li key={x}>{x}</li>)}</ul></dd>
            </div>
            <div>
              <dt>Expectations</dt>
              <dd><ul>{p.expectations.map((x) => <li key={x}>{x}</li>)}</ul></dd>
            </div>
            <div>
              <dt>Process</dt>
              <dd><ol style={{ margin: 0, paddingLeft: "1.1rem" }}>{p.process.map((x) => <li key={x}>{x}</li>)}</ol></dd>
            </div>
          </dl>
          {p.note && <div className={`callout ${p.id === "board" ? "gold" : ""} mt-3`}><p>{p.note}</p></div>}
        </div>
      </section>
      <section className="section section-tint" id="apply" aria-labelledby="apply-title">
        <div className="container">
          <div className="split rev">
            <div>
              <p className="eyebrow">Application</p>
              <h2 id="apply-title" className="h2 mt-2" style={{ marginBottom: "2.5rem" }}>{formTitle}</h2>
              <DynamicForm
                formId={p.id}
                submitLabel={submitLabel}
                success={{
                  title: "Application received",
                  body: (
                    <>
                      <p>
                        Thank you — your application has been securely saved and will be reviewed by the YPL team. If you are shortlisted, we will
                        contact you at the email address you provided.
                      </p>
                      {p.id === "board" && <p>Submitting an application does not guarantee a board position.</p>}
                    </>
                  ),
                }}
              />
            </div>
            <aside className="sticky-col">
              <div className="form-aside">
                <h3 className="h4">Before you apply</h3>
                <ul className="help" style={{ paddingLeft: "1.1rem", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
                  <li>The form takes about {p.id === "advisor" ? "10" : "15–20"} minutes. Drafting long answers elsewhere first is a good idea.</li>
                  <li>We only ask for what we need to assess your application. Please don&apos;t include your home address, ID numbers or other sensitive details.</li>
                  <li>Your answers are visible only to authorised YPL reviewers and are never published.</li>
                </ul>
                <p className="help mt-2">
                  See the <Link href="/privacy">privacy notice</Link> or <Link href="/contact">ask us a question</Link>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
