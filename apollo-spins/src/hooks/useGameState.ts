import { useState, useCallback, useRef } from "react";
import {
  generateSpinResult,
  checkWin,
  type SpinResult,
  type WinResult,
  SPIN_COST,
  STARTING_BALANCE,
} from "../game/logic";

const SPIN_DURATION = 3000;

export interface GameState {
  balance: number;
  spinCost: number;
  isSpinning: boolean;
  result: SpinResult | null;
  lastWin: WinResult | null;
  canSpin: boolean;
}

export interface GameActions {
  spin: () => void;
}

export function useGameState(): GameState & GameActions {
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);
  const spinCost = SPIN_COST;

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [lastWin, setLastWin] = useState<WinResult | null>(null);

  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canSpin = balance >= spinCost && !isSpinning;

  const spin = useCallback(() => {
    if (!canSpin) return;

    const spinResult = generateSpinResult();

    // Deduct cost immediately
    setBalance((prev) => prev - spinCost);
    setIsSpinning(true);
    setLastWin(null);
    setResult(spinResult);

    // Resolve spin AFTER duration
    spinTimeoutRef.current = setTimeout(() => {
      const winResult = checkWin(spinResult, spinCost);

      if (winResult.multiplier > 0) {
        setBalance((prev) => prev + winResult.payout);
      }

      setLastWin(winResult);
      setIsSpinning(false);
    }, SPIN_DURATION);
  }, [canSpin, spinCost]);

  return {
    balance,
    spinCost,
    isSpinning,
    result,
    lastWin,
    canSpin,
    spin,
  };
}