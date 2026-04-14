import { SYMBOLS, type SymbolId } from "./symbols";

export const SPIN_COST = 1;
export const STARTING_BALANCE = 100;

export type SpinResult = [SymbolId, SymbolId, SymbolId];

export interface WinResult {
    multiplier: 0 | 2 | 3;
    payout: number;
    message: string;
}

export function generateSpinResult():SpinResult {
    const roll = () =>
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id; // -b- math

    return [roll(), roll(), roll()];
}

export function checkWin(result:SpinResult, bet:number):WinResult
{
    const [a,b,c] = result;

    if (a == b && b == c) {
      const payout = bet * 3;
      return {
        multiplier: 3,
        payout,
        message: `Jackpot! Payout: €${payout} 💰`,
      };
    } else if (a == b || b == c || c == a) {
      const payout = bet * 2;
      return {
        multiplier: 2,
        payout,
        message: `Lucky! Payout: € ${payout} 💶`,
      };
    }

    return{multiplier:0, payout:0, message:`Try again 😭😭`}
}

// export function checkWin(result)