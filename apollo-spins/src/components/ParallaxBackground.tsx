import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const l3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      if (l1.current) l1.current.style.transform = `translate(${dx * -8}px, ${dy * -5}px)`;
      if (l2.current) l2.current.style.transform = `translate(${dx * -18}px, ${dy * -10}px)`;
      if (l3.current) l3.current.style.transform = `translate(${dx * -32}px, ${dy * -16}px)`;
    };

    const handleMouseLeave = () => {
      if (l1.current) l1.current.style.transform = "translate(0,0)";
      if (l2.current) l2.current.style.transform = "translate(0,0)";
      if (l3.current) l3.current.style.transform = "translate(0,0)";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="parallax-scene">
      {/* Layer 1: Sky + moon (slowest) */}
      <div className="parallax-layer" ref={l1}>
        <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="640" cy="200" rx="120" ry="120" fill="url(#moonGlow)"/>
          <circle cx="640" cy="200" r="36" fill="#fff8dc" opacity="0.9"/>
          {/* Stars */}
          {[
            [120,60],[300,35],[520,80],[750,25],[900,55],[1100,40],
            [200,110],[450,45],[700,90],[1000,70],[80,130],[1200,50],
          ].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity={0.4 + (i % 3) * 0.2}/>
          ))}
        </svg>
      </div>

      {/* Layer 2: Temple silhouette (mid speed) */}
      <div className="parallax-layer" ref={l2}>
        <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a1a5e" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#0d0820" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <polygon points="440,260 640,140 840,260" fill="url(#templeGrad)"/>
          <rect x="420" y="260" width="440" height="24" fill="url(#templeGrad)"/>
          {[440,500,560,620,680,740,800].map((x, i) => (
            <rect key={i} x={x} y={284} width={28} height={260} fill="url(#templeGrad)"/>
          ))}
          <rect x="405" y="544" width="470" height="14" fill="url(#templeGrad)"/>
          <rect x="390" y="558" width="500" height="14" fill="url(#templeGrad)"/>
          <rect x="373" y="572" width="534" height="148" fill="#0d0820"/>
        </svg>
      </div>

      {/* Golden glow — pulsing behind reels */}
      <div className="glow-aura"/>

      {/* Layer 3: Foreground columns (fastest) */}
      <div className="parallax-layer" ref={l3}>
        <svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
          <rect x="60" y="200" width="48" height="520" fill="#110828" opacity="0.85"/>
          <rect x="52" y="194" width="64" height="18" fill="#110828" opacity="0.85"/>
          <rect x="50" y="700" width="68" height="20" fill="#110828" opacity="0.85"/>
          <rect x="1172" y="200" width="48" height="520" fill="#110828" opacity="0.85"/>
          <rect x="1164" y="194" width="64" height="18" fill="#110828" opacity="0.85"/>
          <rect x="1162" y="700" width="68" height="20" fill="#110828" opacity="0.85"/>
          <rect x="0" y="690" width="1280" height="30" fill="#0d0820"/>
        </svg>
      </div>
    </div>
  );
}