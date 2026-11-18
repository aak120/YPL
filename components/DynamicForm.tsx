"use client";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { formDefs, isVisible, validateField, type Field, type FormValues } from "@/lib/forms";
import { IconAlert, IconArrow, IconCheck } from "./Icons";

function FieldControl({
  f,
  value,
  error,
  onChange,
  onBlur,
}: {
  f: Field;
  value: FormValues[string] | undefined;
  error?: string;
  onChange: (v: FormValues[string]) => void;
  onBlur: () => void;
}) {
  const id = `f-${f.name}`;
  const helpId = f.help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(" ") || undefined;
  const common = { id, name: f.name, "aria-invalid": Boolean(error), "aria-describedby": describedBy, onBlur };

  const label = (
    <span className="label">
      {f.label}
      {f.required ? <span className="req" aria-hidden>*</span> : <span className="opt">Optional</span>}
    </span>
  );
  const help = f.help && <p className="help" id={helpId}>{f.help}</p>;
  const err = error && (
    <p className="error-msg" id={errId}>
      <IconAlert /> {error}
    </p>
  );

  if (f.type === "consent") {
    return (
      <div className={`field ${error ? "invalid" : ""}`}>
        <label className="consent">
          <input type="checkbox" {...common} checked={value === true} onChange={(e) => onChange(e.target.checked)} required={f.required} />
          <span>
            {f.label} {f.name === "consent" && <Link href="/privacy" target="_blank">Read the privacy notice</Link>}
            {f.required && <span className="req" style={{ color: "var(--danger)" }} aria-hidden> *</span>}
          </span>
        </label>
        {err}
      </div>
    );
  }

  if (f.type === "radio" || f.type === "checkboxes") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <fieldset className={`field ${error ? "invalid" : ""}`} style={{ border: 0, padding: 0, margin: 0 }} aria-describedby={describedBy}>
        <legend style={{ padding: 0, marginBottom: "0.45rem" }}>{label}</legend>
        {help}
        <div className="choices">
          {f.options!.map((o) => (
            <label key={o} className="choice">
              {f.type === "radio" ? (
                <input type="radio" name={f.name} value={o} checked={value === o} onChange={() => onChange(o)} onBlur={onBlur} />
              ) : (
                <input
                  type="checkbox"
                  name={f.name}
                  value={o}
                  checked={arr.includes(o)}
                  onChange={(e) => onChange(e.target.checked ? [...arr, o] : arr.filter((x) => x !== o))}
                  onBlur={onBlur}
                />
              )}
              <span>{o}</span>
            </label>
          ))}
        </div>
        {err}
      </fieldset>
    );
  }

  const str = typeof value === "string" ? value : "";
  return (
    <div className={`field ${error ? "invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {help}
      {f.type === "textarea" ? (
        <>
          <textarea className="textarea" {...common} value={str} maxLength={f.maxLength} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
          {f.maxLength && (
            <span className="counter" aria-hidden>
              {str.length}/{f.maxLength}
              {f.minLength && str.length < f.minLength ? ` · min ${f.minLength}` : ""}
            </span>
          )}
        </>
      ) : f.type === "select" ? (
        <select className="select" {...common} value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          className="input"
          {...common}
          type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
          inputMode={f.type === "email" ? "email" : f.type === "url" ? "url" : undefined}
          autoComplete={f.autoComplete}
          value={str}
          maxLength={f.maxLength}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {err}
    </div>
  );
}

export function DynamicForm({
  formId,
  submitLabel,
  success,
}: {
  formId: keyof typeof formDefs;
  submitLabel: string;
  success: { title: string; body: ReactNode };
}) {
  const def = formDefs[formId];
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const started = useRef(Date.now());
  const hpRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const allFields = def.sections.flatMap((s) => s.fields);

  const update = (name: string, v: FormValues[string]) => {
    const next = { ...values, [name]: v };
    setValues(next);
    if (touched[name] || errors[name]) {
      const f = allFields.find((x) => x.name === name)!;
      const e = validateField(f, next);
      setErrors((prev) => {
        const copy = { ...prev };
        if (e) copy[name] = e;
        else delete copy[name];
        return copy;
      });
    }
  };

  const valuesRef = useRef(values);
  valuesRef.current = values;

  // Validation on blur is deferred slightly: showing an error message shifts
  // the layout, which would otherwise make a click that caused the blur miss.
  const blur = (name: string) => setTimeout(() => validateOnBlur(name), 220);
  const validateOnBlur = (name: string) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const f = allFields.find((x) => x.name === name)!;
    const e = validateField(f, valuesRef.current);
    setErrors((prev) => {
      const copy = { ...prev };
      if (e) copy[name] = e;
      else delete copy[name];
      return copy;
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const f of allFields) {
      const err = validateField(f, values);
      if (err) errs[f.name] = err;
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      setServerError(`Please correct ${Object.keys(errs).length} field${Object.keys(errs).length === 1 ? "" : "s"} below.`);
      setStatus("error");
      const first = allFields.find((f) => errs[f.name]);
      if (first) document.getElementById(`f-${first.name}`)?.focus() ?? document.getElementsByName(first.name)[0]?.focus();
      return;
    }
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch(`/api/submit/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, hp: hpRef.current?.value ?? "", started: started.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(data.error || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("Network error — your submission was not sent. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div ref={topRef} className="success-panel" role="status" tabIndex={-1}>
        <IconCheck className="check" />
        <h2 className="h3">{success.title}</h2>
        <div className="muted">{success.body}</div>
        <div className="btn-row mt-3">
          <Link href="/" className="btn btn-outline btn-sm">Return home</Link>
          <Link href="/research" className="btn btn-sm">Explore our research</Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef}>
      <form className="form" onSubmit={onSubmit} noValidate aria-describedby="form-req-note">
        <p id="form-req-note" className="help">
          Fields marked <span style={{ color: "var(--danger)" }}>*</span> are required.
        </p>
        {serverError && (
          <div className="form-status error" role="alert">
            {serverError}
          </div>
        )}
        {def.sections.map((s) => {
          const visible = s.fields.filter((f) => isVisible(f, values));
          const rows: Field[][] = [];
          for (let i = 0; i < visible.length; i++) {
            const f = visible[i];
            if (f.half && visible[i + 1]?.half) {
              rows.push([f, visible[i + 1]]);
              i++;
            } else rows.push([f]);
          }
          return (
            <fieldset className="fieldset" key={s.legend}>
              <legend>{s.legend}</legend>
              {rows.map((row) =>
                row.length === 2 ? (
                  <div className="field-row" key={row[0].name}>
                    {row.map((f) => (
                      <FieldControl key={f.name} f={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => update(f.name, v)} onBlur={() => blur(f.name)} />
                    ))}
                  </div>
                ) : (
                  <FieldControl key={row[0].name} f={row[0]} value={values[row[0].name]} error={errors[row[0].name]} onChange={(v) => update(row[0].name, v)} onBlur={() => blur(row[0].name)} />
                ),
              )}
            </fieldset>
          );
        })}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor={`hp-${formId}`}>Leave this field empty</label>
          <input ref={hpRef} id={`hp-${formId}`} type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="flex-between">
          <button type="submit" className="btn btn-accent" disabled={status === "submitting"} aria-busy={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <span className="spinner" aria-hidden /> Submitting…
              </>
            ) : (
              <>
                {submitLabel} <IconArrow />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
