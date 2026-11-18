import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconSearch = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
);
export const IconMenu = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconClose = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconChevron = (p: P) => (
  <svg viewBox="0 0 10 6" {...base} {...p}><path d="M1 1l4 4 4-4" /></svg>
);
export const IconArrow = (p: P) => (
  <svg viewBox="0 0 16 16" width="14" height="14" {...base} {...p} className={`arrow ${p.className ?? ""}`}><path d="M2 8h11M9 4l4 4-4 4" /></svg>
);
export const IconDownload = (p: P) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);
export const IconExternal = (p: P) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...base} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg>
);
export const IconChat = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 5.5h16v10H9l-5 4v-14z" /><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth="2.2" /></svg>
);
export const IconSend = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M4 12l16-7-6 16-3-6.5L4 12z" /></svg>
);
export const IconCheck = (p: P) => (
  <svg viewBox="0 0 48 48" {...base} {...p}><circle cx="24" cy="24" r="21" /><path d="M15 24.5l6 6 12-13" strokeWidth="2" /></svg>
);
export const IconAlert = (p: P) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" strokeWidth="2" /></svg>
);
export const IconDocument = (p: P) => (
  <svg viewBox="0 0 72 88" {...base} strokeWidth={1.2} {...p}>
    <path d="M6 2h44l18 18v64a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
    <path d="M50 2v18h18" />
    <path d="M16 38h40M16 46h40M16 54h28M16 66h18" opacity=".6" />
  </svg>
);
export const IconLinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4V21H3V9.75zM9.5 9.75h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-3.9V9.75z" /></svg>
);
export const IconInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" strokeWidth="2.2" /></svg>
);
export const IconX = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M17.6 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.8 3h6.4l4.4 5.9L17.6 3zm-1.1 16.2h1.7L7.6 4.7H5.8l10.7 14.5z" /></svg>
);
export const IconRss = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 5a14 14 0 0114 14M5 11a8 8 0 018 8" /><circle cx="6" cy="18" r="1" fill="currentColor" /></svg>
);

/* Principle glyphs — simple geometric marks */
export const Glyph = ({ kind, ...p }: P & { kind: number }) => {
  const shapes = [
    <g key="0"><circle cx="17" cy="17" r="13" /><path d="M17 4v26M4 17h26" opacity=".5" /></g>,
    <g key="1"><rect x="4" y="4" width="26" height="26" /><path d="M4 30L30 4" opacity=".5" /></g>,
    <g key="2"><path d="M17 3l14 26H3z" /><path d="M17 15v6" opacity=".6" /></g>,
    <g key="3"><circle cx="17" cy="17" r="13" /><circle cx="17" cy="17" r="5" /></g>,
    <g key="4"><path d="M4 26h26M8 26V14M14 26V8M20 26V16M26 26V11" /></g>,
    <g key="5"><circle cx="11" cy="17" r="8" /><circle cx="23" cy="17" r="8" /></g>,
    <g key="6"><path d="M4 9h26M4 17h26M4 25h26" /><circle cx="12" cy="9" r="2.5" fill="currentColor" /><circle cx="22" cy="17" r="2.5" fill="currentColor" /><circle cx="15" cy="25" r="2.5" fill="currentColor" /></g>,
  ];
  return <svg viewBox="0 0 34 34" {...base} strokeWidth={1.2} {...p} className={`glyph ${p.className ?? ""}`}>{shapes[kind % shapes.length]}</svg>;
};
