import { useApp } from "@pixi/react";
import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const STAR_COUNT = 80;
const MAX_STAR_RADIUS = 2;
const STAR_ZONE_HEIGHT = 180;

interface Star {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  baseAlpha: number;
}

function generateStars(width: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * STAR_ZONE_HEIGHT,
    radius: 0.5 + Math.random() * MAX_STAR_RADIUS,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.8,
    baseAlpha: 0.4 + Math.random() * 0.5,
  }));
}

export default function StarField() {
  const app = useApp();
  const graphicsRef = useRef<PIXI.Graphics | null>(null);
  const starsRef = useRef<Star[]>([]);
  const tickerRef = useRef<PIXI.Ticker | null>(null);

  useEffect(() => {
    const graphics = new PIXI.Graphics();
    app.stage.addChildAt(graphics, 0);
    graphicsRef.current = graphics;

    starsRef.current = generateStars(app.screen.width);

    let elapsed = 0;

    const tick = (delta: number) => {
      elapsed += delta * 0.02;
      const g = graphicsRef.current!;
      g.clear();

      for (const star of starsRef.current) {
        const alpha =
          star.baseAlpha +
          Math.sin(elapsed * star.speed + star.phase) * 0.3;

        g.beginFill(0xffffff, Math.max(0, Math.min(1, alpha)));
        g.drawCircle(star.x, star.y, star.radius);
        g.endFill();
      }
    };

    app.ticker.add(tick);
    tickerRef.current = app.ticker;

    return () => {
      app.ticker.remove(tick);
      app.stage.removeChild(graphics);
      graphics.destroy();
    };
  }, [app]);

  return null;
}