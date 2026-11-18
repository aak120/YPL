"use client";
export function ConfirmButton({ children, message }: { children: React.ReactNode; message: string }) {
  return (
    <button type="submit" className="btn btn-danger btn-sm" onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
