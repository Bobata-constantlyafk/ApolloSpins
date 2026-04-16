import { useRef, useCallback } from "react";
import { Container, Graphics } from "@pixi/react";
import { useTick } from "@pixi/react";
import * as PIXI from "pixi.js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vy: number;       // vertical speed
  vx: number;       // horizontal drift
  alpha: number;
  width: number;
  height: number;
  color: number;
  life: number;     // 0–1, decreases over time
  lifeDecay: number;
}

interface WaterfallEmitterProps {
  /** X position of the emitter strip (top-left corner of the emitter column) */
  x: number;
  /** Y where particles spawn (top of the waterfall) */
  spawnY: number;
  /** Total height the waterfall should cover */
  height: number;
  /** Width of the emitter column */
  emitterWidth: number;
  /** Number of particles in the pool */
  poolSize?: number;
  /** Flip horizontal drift direction (for right-side waterfall) */
  flipDrift?: boolean;
}


// strip invalid hex literals above – safe palette:
const PALETTE = [0x7ec8e3, 0x4fa3c0, 0xa0d8ef, 0x5bb8d4, 0x93d4e8, 0x3d9bbf];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function createParticle(
  emitterX: number,
  emitterWidth: number,
  spawnY: number,
  flipDrift: boolean
): Particle {
  return {
    x: emitterX + Math.random() * emitterWidth,
    y: spawnY + randomBetween(-10, 20),
    vy: randomBetween(2.5, 5.5),
    vx: (flipDrift ? 1 : -1) * randomBetween(0.05, 0.35),
    alpha: randomBetween(0.55, 0.9),
    width: randomBetween(2, 5),
    height: randomBetween(8, 18),
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    life: 1,
    lifeDecay: randomBetween(0.004, 0.01),
  };
}

// ─── Inner animated component (needs useTick inside @pixi/react tree) ─────────

interface InnerProps extends WaterfallEmitterProps {
  gfxRef: React.MutableRefObject<PIXI.Graphics | null>;
}

function WaterfallTicker({
  x,
  spawnY,
  height,
  emitterWidth,
  poolSize = 120,
  flipDrift = false,
  gfxRef,
}: InnerProps) {
  const particlesRef = useRef<Particle[]>([]);

  // Initialise pool once
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < poolSize; i++) {
      const p = createParticle(x, emitterWidth, spawnY, flipDrift);
      // Distribute vertically so it doesn't look like they all start together
      p.y = spawnY + Math.random() * height;
      p.life = Math.random();
      particlesRef.current.push(p);
    }
  }

  useTick((delta) => {
    const gfx = gfxRef.current;
    if (!gfx) return;

    gfx.clear();

    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.y += p.vy * delta;
      p.x += p.vx * delta;
      p.life -= p.lifeDecay * delta;

      // Recycle when fallen past bottom or life exhausted
      if (p.y > spawnY + height + 20 || p.life <= 0) {
        const fresh = createParticle(x, emitterWidth, spawnY, flipDrift);
        particles[i] = fresh;
        continue;
      }

      // Fade near end of life
      const alphaMultiplier = p.life < 0.2 ? p.life / 0.2 : 1;
      const finalAlpha = p.alpha * alphaMultiplier;

      gfx.beginFill(p.color, finalAlpha);
      // Draw a small rounded rectangle for each drop
      gfx.drawRoundedRect(p.x, p.y, p.width, p.height, p.width / 2);
      gfx.endFill();
    }

    // Spray / mist effect at the bottom: larger faint circles
    for (let i = 0; i < 6; i++) {
      const mistX = x + Math.random() * emitterWidth;
      const mistY = spawnY + height - randomBetween(0, 30);
      const mistR = randomBetween(3, 10);
      if (Math.random() > 0.85) {
        gfx.beginFill(0xa8dff0, randomBetween(0.05, 0.18));
        gfx.drawCircle(mistX, mistY, mistR);
        gfx.endFill();
      }
    }
  });

  return null;
}

// ─── Public Component ─────────────────────────────────────────────────────────

export default function WaterfallEmitter(props: WaterfallEmitterProps) {
  const gfxRef = useRef<PIXI.Graphics | null>(null);

  const drawRef = useCallback((gfx: PIXI.Graphics | null) => {
    gfxRef.current = gfx;
  }, []);

  return (
    <Container>
      {/* Static channel / stream background */}
      <Graphics
        draw={(gfx) => {
          gfx.clear();
          // Soft glowing column behind the particles
          for (let i = 0; i < 4; i++) {
            const layerAlpha = 0.04 - i * 0.008;
            const expand = i * 3;
            gfx.beginFill(0x5bc8e8, layerAlpha);
            gfx.drawRoundedRect(
              props.x - expand,
              props.spawnY,
              props.emitterWidth + expand * 2,
              props.height,
              8
            );
            gfx.endFill();
          }
        }}
      />

      {/* Particle graphics (mutated each tick) */}
      <Graphics ref={drawRef} />

      {/* Ticker logic */}
      <WaterfallTicker {...props} gfxRef={gfxRef} />
    </Container>
  );
}