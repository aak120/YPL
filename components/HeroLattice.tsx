/**
 * Abstract hero figure: a city grid read as a dataset, with a single route
 * tracing evidence → analysis → recommendation. Pure SVG, no imagery.
 */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function HeroLattice() {
  const r = rng(42);
  const W = 400;
  const H = 420;
  const streets: string[] = [];
  for (let i = 0; i < 11; i++) {
    const y = 30 + i * 34 + (r() - 0.5) * 10;
    const tilt = (r() - 0.5) * 22;
    streets.push(`M0 ${y.toFixed(1)} L${W} ${(y + tilt).toFixed(1)}`);
  }
  for (let i = 0; i < 10; i++) {
    const x = 24 + i * 40 + (r() - 0.5) * 12;
    const tilt = (r() - 0.5) * 26;
    streets.push(`M${x.toFixed(1)} 0 L${(x + tilt).toFixed(1)} ${H}`);
  }
  const blocks: { x: number; y: number; w: number; h: number; o: number }[] = [];
  for (let i = 0; i < 26; i++) {
    blocks.push({ x: Math.floor(r() * 9) * 40 + 30, y: Math.floor(r() * 11) * 34 + 36, w: 14 + r() * 16, h: 10 + r() * 14, o: 0.05 + r() * 0.12 });
  }
  const nodes = [
    { x: 62, y: 330, label: "01 · Evidence" },
    { x: 146, y: 262 },
    { x: 214, y: 210, label: "02 · Analysis" },
    { x: 282, y: 150 },
    { x: 338, y: 84, label: "03 · Policy" },
  ];
  const route = nodes.map((n, i) => `${i ? "L" : "M"}${n.x} ${n.y}`).join(" ");

  return (
    <figure className="hero-figure" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="lattice" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#b9b3a6" opacity=".55" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#dots)" />
        <g stroke="#586374" strokeWidth="0.6" opacity=".35" fill="none">
          {streets.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path d="M-20 300 C 90 250, 120 360, 220 320 S 380 250, 430 290" stroke="#2a6b6e" strokeWidth="0.8" fill="none" opacity=".35" />
        <path d="M-20 318 C 90 268, 120 378, 220 338 S 380 268, 430 308" stroke="#2a6b6e" strokeWidth="0.6" fill="none" opacity=".2" />
        <circle cx="210" cy="200" r="150" stroke="#0c1a2e" strokeWidth="0.7" fill="none" opacity=".18" strokeDasharray="2 5" />
        <g fill="#0c1a2e">
          {blocks.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} opacity={b.o} />
          ))}
        </g>
        <path d={route} className="draw" stroke="#0c1a2e" strokeWidth="1.6" fill="none" />
        {nodes.map((n, i) => (
          <g key={i}>
            {n.label && <circle cx={n.x} cy={n.y} r="9" fill="#2a6b6e" className="pulse" style={{ animationDelay: `${i * 0.4}s` }} />}
            <circle cx={n.x} cy={n.y} r={n.label ? 4.5 : 2.5} fill={n.label ? "#2a6b6e" : "#0c1a2e"} stroke="#fffefb" strokeWidth="1.5" />
            {n.label && (
              <text x={i === nodes.length - 1 ? n.x - 12 : n.x + 12} y={i === nodes.length - 1 ? n.y + 22 : n.y - 10} textAnchor={i === nodes.length - 1 ? "end" : "start"} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="#0c1a2e">
                {n.label.toUpperCase()}
              </text>
            )}
          </g>
        ))}
      </svg>
      <figcaption>
        <span>Fig. 1 — Research → Policy</span>
        <span>28.46°N 77.03°E</span>
      </figcaption>
    </figure>
  );
}

/** Small schematic map motif for the Gurgaon brief cover. */
export function GurgaonMotif() {
  return (
    <svg viewBox="0 0 200 110" className="gg-map" aria-hidden="true">
      <g stroke="currentColor" fill="none" strokeWidth="0.7">
        <path d="M0 80 L200 52" />
        <path d="M0 40 L200 66" opacity=".6" />
        <path d="M40 0 L70 110" opacity=".6" />
        <path d="M120 0 L104 110" />
        <path d="M168 0 L180 110" opacity=".5" />
        <path d="M10 104 C 60 90, 90 100, 140 84 S 190 70, 200 72" stroke="#a7813d" strokeWidth="1.2" />
      </g>
      <circle cx="108" cy="62" r="3.5" fill="#a7813d" />
      <circle cx="108" cy="62" r="9" stroke="#a7813d" fill="none" strokeWidth="0.7" />
    </svg>
  );
}
