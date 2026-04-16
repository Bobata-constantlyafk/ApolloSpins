// src/hooks/useWinTextAnimation.ts

import { useRef } from "react";
import { useTick } from "@pixi/react";

export function useWinTextAnimation(containerRef: any, textRef: any, isWin: boolean) {
  const timeRef = useRef(0);

  useTick((delta) => {
    timeRef.current += delta * 0.05;
    const t = timeRef.current;

    const BOUNCE_DURATION = 0.4;

    let entryScale: number;
    if (t < BOUNCE_DURATION) {
      const p = t / BOUNCE_DURATION;
      entryScale =
        p < 0.6
          ? (p / 0.6) * 1.3
          : 1.3 - ((p - 0.6) / 0.4) * 0.3 + Math.sin((p - 0.6) * Math.PI) * 0.08;
    } else {
      entryScale = 1.0;
    }

    const floatY = t > BOUNCE_DURATION ? Math.sin(t * 2.2) * 4 : 0;
    const breathe = t > BOUNCE_DURATION ? 1 + Math.sin(t * 3.1) * 0.03 : 1;

    if (containerRef.current) {
      containerRef.current.scale.set(entryScale * breathe);
      containerRef.current.y = floatY;
    }

    if (textRef.current && isWin) {
      const pulse = (Math.sin(t * 4) + 1) / 2;
      const r = 0xff;
      const g = Math.round(0xd7 + pulse * (0xf4 - 0xd7));
      const b = Math.round(0x00 + pulse * 0xaa);
      textRef.current.style.fill = (r << 16) | (g << 8) | b;
    }
  });

  return {
    reset: () => {
      timeRef.current = 0;
    },
  };
}