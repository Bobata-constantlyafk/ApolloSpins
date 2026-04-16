import { useApp } from "@pixi/react";
import { useEffect } from "react";
import * as PIXI from "pixi.js";

const SUN_X_RATIO = 0.5;   // horizontally centered
const SUN_Y = 90;           // from top
const SUN_RADIUS = 38;
const RAY_COUNT = 12;
const RAY_LENGTH = 28;
const RAY_GAP = 14;         // gap between sun edge and ray start

export default function Sun() {
  const app = useApp();

  useEffect(() => {
    const graphics = new PIXI.Graphics();
    app.stage.addChildAt(graphics, 1); // above stars, below everything else

    let angle = 0;

    const tick = (delta: number) => {
      angle += delta * 0.004;
      const g = graphics;
      g.clear();

      const cx = app.screen.width * SUN_X_RATIO;
      const cy = SUN_Y;

      // Outer glow ring
      g.beginFill(0xffd97d, 0.12);
      g.drawCircle(cx, cy, SUN_RADIUS + 22);
      g.endFill();

      // Mid glow ring
      g.beginFill(0xffd97d, 0.2);
      g.drawCircle(cx, cy, SUN_RADIUS + 12);
      g.endFill();

      // Sun body
      g.beginFill(0xffe566, 1);
      g.drawCircle(cx, cy, SUN_RADIUS);
      g.endFill();

      // Rays
      for (let i = 0; i < RAY_COUNT; i++) {
        const rayAngle = angle + (i / RAY_COUNT) * Math.PI * 2;
        const startX = cx + Math.cos(rayAngle) * (SUN_RADIUS + RAY_GAP);
        const startY = cy + Math.sin(rayAngle) * (SUN_RADIUS + RAY_GAP);
        const endX = cx + Math.cos(rayAngle) * (SUN_RADIUS + RAY_GAP + RAY_LENGTH);
        const endY = cy + Math.sin(rayAngle) * (SUN_RADIUS + RAY_GAP + RAY_LENGTH);

        g.lineStyle(2.5, 0xffe566, 0.7);
        g.moveTo(startX, startY);
        g.lineTo(endX, endY);
      }

      g.lineStyle(0);
    };

    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick);
      app.stage.removeChild(graphics);
      graphics.destroy();
    };
  }, [app]);

  return null;
}