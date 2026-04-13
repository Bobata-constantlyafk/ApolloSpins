import { useState, useCallback } from "react";
import {
    generateSpinResult,
    checkWin,
    type SpinResult,
    type WinResult,
    SPIN_COST,
    STARTING_BALANCE
} from "../game/logic";

export interface GameState{
    balance:number;
    isSpinning: boolean;
    result: SpinResult | null;
    lastWin: WinResult | null;
    canSpin:boolean;
}

export interface GameActions {
    spin: () => void;
    onSpinComplete: () => void;
}

export function useGameState(): GameState & GameActions {
    const [balance, setBalance]         = useState<number>(STARTING_BALANCE);
    const [isSpinning, setIsSpinning]   = useState<boolean>(false);
    const [result, setResult]           = useState<SpinResult | null>(null);
    const [lastWin, setLastWin]         = useState<WinResult | null>(null);

    const canSpin = balance >= SPIN_COST && !isSpinning;

    const spin = useCallback (() => {
        if(!canSpin) return;

        setBalance((prev)=> prev - SPIN_COST);
        setIsSpinning(true);
        setLastWin(null);

        const spinResult = generateSpinResult();
        setResult(spinResult);

        setTimeout(() => {
            setIsSpinning(false);
        }, 3000);
    },[canSpin]);

    const onSpinComplete = useCallback(()=> { // -b- use cb
        if(!result) return;

        const WinResult = checkWin(result, SPIN_COST);

        if(WinResult.multiplier > 0)
        {
            setBalance((prev)=> prev + WinResult.payout);
        }

        setLastWin(WinResult);
    }, [result]);

    return {
        balance,
        isSpinning,
        result,
        lastWin,
        canSpin,
        spin,
        onSpinComplete,
    };
}