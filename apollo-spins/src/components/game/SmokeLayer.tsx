import { Sprite } from "@pixi/react";
import { useTick } from "@pixi/react";
import { useRef } from "react";
import { Texture, BLEND_MODES } from "pixi.js";
import type { Sprite as PixiSprite } from "pixi.js";

const STAGE_W     = 1280;
const smokeTexture = Texture.from("/assets/smoke.png");

const CONFIGS = [
  { x: -180, y: 590, speed:  0.35, sx: 1.4, sy: 0.7, alpha: 0.28 },
  { x:  250, y: 630, speed:  0.22, sx: 1.1, sy: 0.6, alpha: 0.22 },
  { x:  650, y: 660, speed:  0.40, sx: 0.9, sy: 0.5, alpha: 0.18 },
  { x:  950, y: 610, speed:  0.28, sx: 1.3, sy: 0.8, alpha: 0.24 },
  { x: -500, y: 645, speed:  0.18, sx: 1.6, sy: 0.6, alpha: 0.16 },
  { x: 1100, y: 580, speed: -0.25, sx: 1.2, sy: 0.7, alpha: 0.20 },
] as const;

function SmokeSprite({ cfg }: { cfg: typeof CONFIGS[number] }) {
  const ref = useRef<PixiSprite>(null);

  useTick((delta) => {
    const s = ref.current;
    if (!s) return;
    s.x += cfg.speed * delta;
    const w = s.width;
    if (cfg.speed > 0 && s.x >  STAGE_W + w)  s.x = -w;
    if (cfg.speed < 0 && s.x < -w)             s.x = STAGE_W + w;
  });

  return (
    <Sprite
      ref={ref}
      texture={smokeTexture}
      x={cfg.x}
      y={cfg.y}
      scale={{ x: cfg.sx, y: cfg.sy }}
      alpha={cfg.alpha}
      anchor={0.5}
      blendMode={BLEND_MODES.SCREEN}
    />
  );
}

export default function SmokeLayer() {
  return (
    <>
      {CONFIGS.map((cfg, i) => <SmokeSprite key={i} cfg={cfg} />)}
    </>
  );
}
