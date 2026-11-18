"use client";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconChat, IconClose, IconSend } from "./Icons";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is Youth Policy Lab?",
  "What research has YPL published?",
  "Summarise a policy paper.",
  "What are the Gurgaon Policy Briefs?",
  "What policy areas does YPL focus on?",
  "How can I join YPL?",
  "How can I become an advisor?",
];

const STORE_KEY = "ypl-chat-v1";

/* ---- Minimal, safe markdown: paragraphs, lists, **bold**, [links](url). No raw HTML. ---- */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[1] && m[2]) out.push(<SafeLink key={k} href={m[2]}>{m[1]}</SafeLink>);
    else if (m[3]) out.push(<strong key={k}>{m[3]}</strong>);
    else if (m[4]) out.push(<SafeLink key={k} href={m[4]}>{m[4]}</SafeLink>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function SafeLink({ href, children }: { href: string; children: ReactNode }) {
  let url: URL | null = null;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return <>{children}</>;
  }
  if (!/^https?:$/.test(url.protocol)) return <>{children}</>;
  if (url.origin === window.location.origin) return <Link href={url.pathname + url.search + url.hash}>{children}</Link>;
  return (
    <a href={url.toString()} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, bi) => {
        const lines = b.split("\n").filter((l) => l.trim());
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          const ordered = /^\s*\d+\./.test(lines[0]);
          const items = lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""), `${bi}-${li}`)}</li>);
          return ordered ? <ol key={bi}>{items}</ol> : <ul key={bi}>{items}</ul>;
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ""), `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore this session's conversation
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (!open || configured !== null) return;
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setConfigured(Boolean(d.configured)))
      .catch(() => setConfigured(false));
  }, [open, configured]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, 2000);
      if (!content || busy) return;
      setError(null);
      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages(next);
      setInput("");
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 503) setConfigured(false);
          setError(data.error || "The assistant could not respond. Please try again.");
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        setMessages((m) => [...m, { role: "assistant", content: "" }]);
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const copy = m.slice();
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("Network error — please check your connection and try again.");
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  };

  const lastIsEmptyBot = busy && messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].content;
  const waiting = busy && (messages[messages.length - 1]?.role === "user" || lastIsEmptyBot);

  return (
    <>
      {!open && (
        <button ref={fabRef} type="button" className="chat-fab" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Open the YPL assistant">
          <IconChat />
          <span className="lbl">Ask YPL</span>
        </button>
      )}
      {open && (
        <section className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title">
          <div className="chat-head">
            <div>
              <div className="t" id="chat-title">YPL Assistant</div>
              <div className="s">
                <span className={`dot ${configured === false ? "off" : ""}`} />
                {configured === false ? "Awaiting configuration" : "AI · answers from YPL content"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {messages.length > 0 && (
                <button type="button" className="icon-btn" onClick={reset} aria-label="Start a new conversation" title="New conversation">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>
                </button>
              )}
              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => fabRef.current?.focus(), 0);
                }}
                aria-label="Close assistant"
              >
                <IconClose />
              </button>
            </div>
          </div>

          <div className="chat-log" ref={logRef} aria-live="polite">
            <div className="msg bot">
              <p>
                Hello — I can answer questions about Youth Policy Lab: our research, the Mini Gurgaon Policy Briefs, initiatives, and how to get
                involved.
              </p>
            </div>
            {configured === false && (
              <div className="msg system" role="status">
                <strong>The AI assistant isn&apos;t switched on yet.</strong> The site administrator needs to add an <code>ANTHROPIC_API_KEY</code> on
                the server. Meanwhile, you can browse the <Link href="/research">research library</Link>, read <Link href="/about">about YPL</Link>,
                see <Link href="/get-involved">how to get involved</Link> or <Link href="/contact">contact us</Link>.
              </div>
            )}
            {messages.length === 0 && configured !== false && (
              <div className="suggestions" aria-label="Suggested questions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} disabled={busy || configured === null}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="msg user">
                  {m.content}
                </div>
              ) : m.content ? (
                <div key={i} className="msg bot">
                  <Markdown text={m.content} />
                </div>
              ) : null,
            )}
            {waiting && (
              <div className="msg bot typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            )}
            {error && (
              <div className="msg system" role="alert">
                {error}
              </div>
            )}
          </div>

          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={2000}
              placeholder={configured === false ? "Assistant not configured" : "Ask about YPL's research…"}
              disabled={configured === false}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button type="submit" className="btn btn-accent" disabled={busy || !input.trim() || configured === false} aria-label="Send">
              <IconSend />
            </button>
          </form>
          <p className="chat-disclaimer">
            Responses are AI-generated from YPL&apos;s published website content and may contain mistakes. Check the linked source pages. Don&apos;t
            share personal information.
          </p>
        </section>
      )}
    </>
  );
}
