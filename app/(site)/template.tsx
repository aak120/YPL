/** Re-mounts on every navigation, giving a subtle page-enter transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
