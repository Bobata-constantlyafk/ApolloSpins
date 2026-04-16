import { useRef, useCallback } from "react";
import { Container, Graphics } from "@pixi/react";
import { useTick } from "@pixi/react";
import * as PIXI from "pixi.js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaveEffectProps {
  /** Total canvas width */
  stageWidth: number;
  /** Y position where the wave sits (bottom of the stage) */
  y: number;
  /** How tall the wave body extends downward */
  waveBodyHeight?: number;
}

interface WaveLayer {
  amplitude: number;
  frequency: number;       // radians per pixel
  speed: number;           // phase shift per tick
  color: number;
  alpha: number;
  yOffset: number;         // vertical offset from props.y
  phase: number;           // current phase (mutated each tick)
}

// ─── Wave layer definitions ───────────────────────────────────────────────────

function buildLayers(): WaveLayer[] {
  return [
    // Back layer — slowest, tallest, darkest
    {
      amplitude: 18,
      frequency: 0.018,
      speed: 0.022,
      color: 0x1a6b8a,
      alpha: 0.55,
      yOffset: 8,
      phase: 0,
    },
    // Mid layer
    {
      amplitude: 13,
      frequency: 0.025,
      speed: 0.034,
      color: 0x2d9bbf,
      alpha: 0.65,
      yOffset: 2,
      phase: 1.2,
    },
    // Front layer — fastest, shortest, brightest
    {
      amplitude: 9,
      frequency: 0.033,
      speed: 0.048,
      color: 0x5dd0ec,
      alpha: 0.75,
      yOffset: -4,
      phase: 2.6,
    },
    // Foam / highlight layer — very fast, tiny amplitude
    {
      amplitude: 5,
      frequency: 0.045,
      speed: 0.07,
      color: 0xb8eaf5,
      alpha: 0.45,
      yOffset: -10,
      phase: 0.5,
    },
  ];
}

// ─── Ticker logic ─────────────────────────────────────────────────────────────

interface TickerProps extends WaveEffectProps {
  gfxRef: React.MutableRefObject<PIXI.Graphics | null>;
  layers: React.MutableRefObject<WaveLayer[]>;
}

function WaveTicker({ stageWidth, y, waveBodyHeight = 80, gfxRef, layers }: TickerProps) {
  useTick((delta) => {
    const gfx = gfxRef.current;
    if (!gfx) return;

    gfx.clear();

    const STEP = 4; // pixel resolution — lower = smoother, higher = faster

    for (const layer of layers.current) {
      // Advance phase
      layer.phase += layer.speed * delta;

      const baseY = y + layer.yOffset;

      gfx.beginFill(layer.color, layer.alpha);
      gfx.moveTo(0, baseY);

      // Draw the sine wave top edge left → right
      for (let px = 0; px <= stageWidth; px += STEP) {
        const waveY = baseY + Math.sin(px * layer.frequency + layer.phase) * layer.amplitude;
        gfx.lineTo(px, waveY);
      }

      // Close the shape: down the right side, across the bottom, back up the left
      gfx.lineTo(stageWidth, y + waveBodyHeight);
      gfx.lineTo(0, y + waveBodyHeight);
      gfx.closePath();
      gfx.endFill();
    }

    // Optional: thin bright foam line on the very front wave crest
    const foam = layers.current[layers.current.length - 1];
    gfx.lineStyle(1.5, 0xffffff, 0.25);
    gfx.moveTo(0, y + foam.yOffset + Math.sin(foam.phase) * foam.amplitude);
    for (let px = STEP; px <= stageWidth; px += STEP) {
      const waveY =
        y + foam.yOffset + Math.sin(px * foam.frequency + foam.phase) * foam.amplitude;
      gfx.lineTo(px, waveY);
    }
    gfx.lineStyle(0);
  });

  return null;
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function WaveEffect({ stageWidth, y, waveBodyHeight = 80 }: WaveEffectProps) {
  const gfxRef = useRef<PIXI.Graphics | null>(null);
  const layers = useRef<WaveLayer[]>(buildLayers());

  const drawRef = useCallback((gfx: PIXI.Graphics | null) => {
    gfxRef.current = gfx;
  }, []);

  return (
    <Container>
      <Graphics ref={drawRef} />
      <WaveTicker
        stageWidth={stageWidth}
        y={y}
        waveBodyHeight={waveBodyHeight}
        gfxRef={gfxRef}
        layers={layers}
      />
    </Container>
  );
}