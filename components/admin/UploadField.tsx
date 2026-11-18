"use client";
import { useState } from "react";
import { createUploadUrl } from "@/app/admin/actions";

/** URL input with an "Upload file" button that sends the file directly to Supabase Storage. */
export function UploadField({ name, label, kind, defaultValue, help }: { name: string; label: string; kind: "pdf" | "image"; defaultValue?: string | null; help?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onFile(file: File) {
    const max = kind === "pdf" ? 50 : 8;
    if (file.size > max * 1024 * 1024) {
      setState("error");
      setMsg(`File is larger than ${max} MB.`);
      return;
    }
    setState("uploading");
    setMsg("");
    try {
      const { signedUrl, publicUrl } = await createUploadUrl(file.name, kind);
      const body = new FormData();
      body.append("cacheControl", "3600");
      body.append("", file);
      const res = await fetch(signedUrl, { method: "PUT", body, headers: { "x-upsert": "false" } });
      if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
      setUrl(publicUrl);
      setState("idle");
      setMsg("Uploaded. Remember to save.");
    } catch (e) {
      setState("error");
      setMsg((e as Error).message || "Upload failed.");
    }
  }

  return (
    <div className="field">
      <label className="label" htmlFor={`u-${name}`}>{label} <span className="opt">Optional</span></label>
      {help && <p className="help">{help}</p>}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input id={`u-${name}`} name={name} className="input" style={{ flex: "1 1 300px" }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder={kind === "pdf" ? "https://… or /files/publications/name.pdf" : "https://…"} />
        <label className="btn btn-outline btn-sm" style={{ minHeight: 48 }}>
          {state === "uploading" ? "Uploading…" : `Upload ${kind === "pdf" ? "PDF" : "image"}`}
          <input type="file" accept={kind === "pdf" ? "application/pdf" : "image/png,image/jpeg,image/webp"} className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} disabled={state === "uploading"} />
        </label>
      </div>
      {msg && <p className={state === "error" ? "error-msg" : "help"}>{msg}</p>}
      {url && kind === "pdf" && <p className="help"><a href={url} target="_blank" rel="noopener">Open current file ↗</a></p>}
    </div>
  );
}
