import { useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import { SYMBOLS, type SymbolId } from "../game/symbols";

export interface SlotState {
  symbolId: SymbolId;
  nextId: SymbolId;
  offsetY: number;
}

const SPIN_SPEED   = 12;
const SLOW_SPEED   = 3;
const BOUNCE       = 9;
const DAMPING      = 0.60;
const STOP_STAGGER = 900;

function random(): SymbolId {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id;
}

function makeSlot(): SlotState {
  return { symbolId: random(), nextId: random(), offsetY: 0 };
}

type Phase = "idle" | "spinning" | "stopping";

export function useReelSpin(
  stride: number,
  isSpinning: boolean,
  result: [SymbolId, SymbolId, SymbolId] | null
): [SlotState, SlotState, SlotState] {
  const [slots, setSlots] = useState<[SlotState, SlotState, SlotState]>(() => [
    makeSlot(), makeSlot(), makeSlot(),
  ]);

  const phase    = useRef<Phase>("idle");
  const offsets  = useRef<[number, number, number]>([0, 0, 0]);
  const resultRef = useRef<[SymbolId, SymbolId, SymbolId] | null>(null);
  const stopping = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const bouncing = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const locked   = useRef<[boolean, boolean, boolean]>([false, false, false]);

  useEffect(() => {
    if (isSpinning) {
      phase.current    = "spinning";
      offsets.current  = [0, 0, 0];
      stopping.current = [false, false, false];
      bouncing.current = [false, false, false];
      locked.current   = [false, false, false];
    } else if (phase.current === "spinning") {
      phase.current      = "stopping";
      resultRef.current  = result;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          stopping.current[i as 0 | 1 | 2] = true;
        }, i * STOP_STAGGER);
      }
    }
  }, [isSpinning, result]);

  useTick(() => {
    if (phase.current === "idle") return;

    let dirty = false;

    const next = slots.map((slot, i) => {
      const idx = i as 0 | 1 | 2;

      if (locked.current[idx]) return slot;

      if (phase.current === "spinning" || !stopping.current[idx]) {
        offsets.current[idx] += SPIN_SPEED;
        if (offsets.current[idx] >= stride) {
          offsets.current[idx] -= stride;
          dirty = true;
          return { symbolId: slot.nextId, nextId: random(), offsetY: offsets.current[idx] };
        }
        dirty = true;
        return { ...slot, offsetY: offsets.current[idx] };
      }

      if (!bouncing.current[idx]) {
        offsets.current[idx] += SLOW_SPEED;
        if (offsets.current[idx] >= stride) {
          bouncing.current[idx] = true;
          offsets.current[idx]  = -BOUNCE;
          dirty = true;
          const target = resultRef.current![idx];
          return { symbolId: target, nextId: target, offsetY: -BOUNCE };
        }
        dirty = true;
        return { ...slot, offsetY: offsets.current[idx] };
      }

      offsets.current[idx] *= DAMPING;
      if (Math.abs(offsets.current[idx]) < 0.4) {
        offsets.current[idx] = 0;
        locked.current[idx]  = true;
        if (locked.current.every(Boolean)) phase.current = "idle";
        dirty = true;
        return { ...slot, offsetY: 0 };
      }
      dirty = true;
      return { ...slot, offsetY: offsets.current[idx] };
    }) as [SlotState, SlotState, SlotState];

    if (dirty) setSlots(next);
  });

  return slots;
}
