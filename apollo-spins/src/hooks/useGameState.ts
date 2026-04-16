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
  isStopping: boolean;
  result: SpinResult | null;
  lastWin: WinResult | null;
  canSpin: boolean;
}

export interface GameActions {
  spin: () => void;
  stopSpin: () => void;
}

export function useGameState(): GameState & GameActions {
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);
  const spinCost = SPIN_COST;

  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [lastWin, setLastWin] = useState<WinResult | null>(null);

  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<SpinResult | null>(null);

  const canSpin = balance >= spinCost && !isSpinning;

  const resolveWin = useCallback((spinResult: SpinResult) => {
    const winResult = checkWin(spinResult, spinCost);
    if (winResult.multiplier > 0) {
      setBalance((prev) => prev + winResult.payout);
    }
    setLastWin(winResult);
    setIsSpinning(false);
    setIsStopping(false);
  }, [spinCost]);

  const spin = useCallback(() => {
    if (!canSpin) return;

    const spinResult = generateSpinResult();
    resultRef.current = spinResult;

    setBalance((prev) => prev - spinCost);
    setIsSpinning(true);
    setIsStopping(false);
    setLastWin(null);
    setResult(spinResult);

    spinTimeoutRef.current = setTimeout(() => {
      resolveWin(spinResult);
    }, SPIN_DURATION);
  }, [canSpin, spinCost, resolveWin]);

  // Called when user clicks spin during spinning — skips to result
  const stopSpin = useCallback(() => {
    if (!isSpinning || isStopping) return;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    setIsStopping(true);

    // Give Reel time to fly symbols off + land result
    // Reel will call back via onSpinComplete when done — but we resolve
    // win immediately so balance is ready
    if (resultRef.current) {
      setTimeout(() => resolveWin(resultRef.current!), 800);
    }
  }, [isSpinning, isStopping, resolveWin]);

  return {
    balance,
    spinCost,
    isSpinning,
    isStopping,
    result,
    lastWin,
    canSpin,
    spin,
    stopSpin,
  };
}