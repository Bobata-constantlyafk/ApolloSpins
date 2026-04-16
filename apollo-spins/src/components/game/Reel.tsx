import { Container } from "@pixi/react";
import { useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import { SYMBOLS, type SymbolId } from "../../game/symbols";
import Symbol from "./Symbol";

interface ReelProps {
  x: number;
  y: number;
  symbolSize?: number;
  gap?: number;
  result: [SymbolId, SymbolId, SymbolId] | null;
  isSpinning: boolean;
}

interface SlotState {
  current: SymbolId;
  next: SymbolId | null;
  offsetY: number;
}

type Phase = "idle" | "spinning" | "landing";


const TICK_INTERVAL  = 450;
const SLIDE_SPEED    = 12;
const LAND_SPEED     = 21;
const LAND_STAGGER   = 450;
const OVERSHOOT      = 3;


function getRandom(): SymbolId {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id;
}

function makeSlot(id: SymbolId): SlotState {
  return { current: id, next: null, offsetY: 0 };
}


interface SlotProps {
  state: SlotState;
  size: number;
}

function AnimatedSlot({ state, size }: SlotProps) {
  const stride = size + 20;

  return (
    <Container>
      {state.next !== null && (
        <Container y={state.offsetY - stride}>
          <Symbol symbolId={state.next} x={0} y={0} size={size} />
        </Container>
      )}

      <Container y={state.offsetY}>
        <Symbol symbolId={state.current} x={0} y={0} size={size} />
      </Container>
    </Container>
  );
}


export default function Reel({
  x,
  y,
  symbolSize = 100,
  gap = 20,
  result,
  isSpinning,
}: ReelProps) {
  const slotWidth = symbolSize + gap;
  const stride    = symbolSize + 20;

  const [slots, setSlots] = useState<[SlotState, SlotState, SlotState]>(() => [
    makeSlot(getRandom()),
    makeSlot(getRandom()),
    makeSlot(getRandom()),
  ]);

  const phaseRef       = useRef<Phase>("idle");
  const offsetsRef     = useRef<[number, number, number]>([0, 0, 0]);
  const nextSymbolsRef = useRef<[SymbolId, SymbolId, SymbolId] | null>(null);
  const landingRef     = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const landedRef      = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const overshootRef   = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const tickTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSpinning) {
      phaseRef.current     = "spinning";
      landingRef.current   = [false, false, false];
      landedRef.current    = [false, false, false];
      overshootRef.current = [false, false, false];
      offsetsRef.current   = [0, 0, 0];

      tickTimerRef.current = setInterval(() => {
        setSlots((prev) => [
          { ...prev[0], next: getRandom() },
          { ...prev[1], next: getRandom() },
          { ...prev[2], next: getRandom() },
        ]);
      }, TICK_INTERVAL);

    } else {
      if (phaseRef.current === "spinning") {
        clearInterval(tickTimerRef.current!);
        tickTimerRef.current    = null;
        phaseRef.current        = "landing";
        nextSymbolsRef.current  = result;

        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            landingRef.current[i as 0 | 1 | 2] = true;
          }, i * LAND_STAGGER);
        }
      }
    }

    return () => clearInterval(tickTimerRef.current!);
  }, [isSpinning, result]);

  useTick(() => {
    if (phaseRef.current === "idle") return;

    let anyChange = false;

    const newSlots = slots.map((slot, i) => {
      const idx = i as 0 | 1 | 2;

      if (phaseRef.current === "spinning") {
        if (!slot.next) return slot;

        offsetsRef.current[idx] += SLIDE_SPEED;

        if (offsetsRef.current[idx] >= stride) {
          offsetsRef.current[idx] = 0;
          anyChange = true;
          return { current: slot.next, next: getRandom(), offsetY: 0 };
        }

        anyChange = true;
        return { ...slot, offsetY: offsetsRef.current[idx] };
      }

      if (phaseRef.current === "landing") {
        if (!landingRef.current[idx]) {
          if (!slot.next) return slot;

          offsetsRef.current[idx] += SLIDE_SPEED * 0.55;
          if (offsetsRef.current[idx] >= stride) {
            offsetsRef.current[idx] = 0;
            return { current: slot.next, next: getRandom(), offsetY: 0 };
          }
          anyChange = true;
          return { ...slot, offsetY: offsetsRef.current[idx] };
        }

        if (landedRef.current[idx]) return slot;

        const target = nextSymbolsRef.current?.[idx] ?? slot.current;

        if (!overshootRef.current[idx]) {
          offsetsRef.current[idx] += LAND_SPEED;

          if (offsetsRef.current[idx] >= stride) {
            offsetsRef.current[idx] = -OVERSHOOT;
            overshootRef.current[idx] = true;
            anyChange = true;
            return { current: target, next: null, offsetY: -OVERSHOOT };
          }

          anyChange = true;
          return {
            current: slot.next ?? slot.current,
            next: getRandom(),
            offsetY: offsetsRef.current[idx],
          };
        } else {
          offsetsRef.current[idx] *= 0.72;

          if (Math.abs(offsetsRef.current[idx]) < 0.5) {
            offsetsRef.current[idx] = 0;
            landedRef.current[idx] = true;

            if (landedRef.current.every(Boolean)) {
              phaseRef.current = "idle";
            }

            anyChange = true;
            return { current: target, next: null, offsetY: 0 };
          }

          anyChange = true;
          return { ...slot, offsetY: offsetsRef.current[idx] };
        }
      }

      return slot;
    }) as [SlotState, SlotState, SlotState];

    if (anyChange) setSlots(newSlots);
  });

  return (
    <Container x={x} y={y}>
      {slots.map((slot, i) => (
        <Container key={i} x={i * slotWidth}>
          <AnimatedSlot state={slot} size={symbolSize} />
        </Container>
      ))}
    </Container>
  );
}