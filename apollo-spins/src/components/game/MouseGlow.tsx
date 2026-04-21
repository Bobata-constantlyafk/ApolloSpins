import { Graphics } from "@pixi/react";
import { useTick } from "@pixi/react";
import { useRef, useEffect } from "react";
import { BLEND_MODES } from "pixi.js";
import type { Graphics as PixiGraphics } from "pixi.js";

const STAGE_W    = 1280;
const STAGE_H    = 720;
const GLOW_COLOR = 0x44ffaa;
const STEPS      = 18;
const LERP       = 0.055;

const WISPS = [
  { x: 110,  y: 560, r: 88,  alpha: 0.11, speed: 0.016, amt: 6,  phase: 0.0,  px: 0.13, py: 0.07 },
  { x: 1170, y: 500, r: 72,  alpha: 0.09, speed: 0.013, amt: 5,  phase: 1.3,  px: 0.08, py: 0.05 },
  { x: 75,   y: 290, r: 58,  alpha: 0.08, speed: 0.020, amt: 7,  phase: 2.5,  px: 0.16, py: 0.09 },
  { x: 1210, y: 185, r: 52,  alpha: 0.07, speed: 0.015, amt: 5,  phase: 0.9,  px: 0.10, py: 0.06 },
  { x: 195,  y: 655, r: 48,  alpha: 0.08, speed: 0.018, amt: 4,  phase: 3.7,  px: 0.06, py: 0.04 },
  { x: 1060, y: 635, r: 64,  alpha: 0.09, speed: 0.011, amt: 6,  phase: 1.9,  px: 0.11, py: 0.07 },
  { x: 640,  y: 668, r: 44,  alpha: 0.07, speed: 0.022, amt: 4,  phase: 4.2,  px: 0.05, py: 0.03 },
] as const;

interface MouseGlowProps {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export default function MouseGlow({ offsetX, offsetY, scale }: MouseGlowProps) {
  const gRef   = useRef<PixiGraphics>(null);
  const shift  = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const time   = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX - offsetX) / scale - STAGE_W / 2,
        y: (e.clientY - offsetY) / scale - STAGE_H / 2,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [offsetX, offsetY, scale]);

  useTick((delta) => {
    const g = gRef.current;
    if (!g) return;

    time.current += delta;
    shift.current.x += (target.current.x - shift.current.x) * LERP * delta;
    shift.current.y += (target.current.y - shift.current.y) * LERP * delta;

    g.blendMode = BLEND_MODES.ADD;
    g.clear();

    for (const w of WISPS) {
      const cx = w.x + shift.current.x * w.px;
      const cy = w.y + Math.sin(time.current * w.speed + w.phase) * w.amt
                     + shift.current.y * w.py;

      for (let i = STEPS; i >= 0; i--) {
        const r     = (i / STEPS) * w.r;
        const alpha = (1 - i / STEPS) * w.alpha;
        g.beginFill(GLOW_COLOR, alpha);
        g.drawCircle(cx, cy, r);
        g.endFill();
      }
    }
  });

  return <Graphics ref={gRef} />;
}
