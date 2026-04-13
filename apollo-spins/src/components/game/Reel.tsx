import { Container } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import { SYMBOLS, type SymbolId } from "../../game/symbols";
import Symbol from "./Symbol";

interface ReelProps {
    x:number;
    y:number;
    symbolSize?:number;
    gap?: number;
    result: [SymbolId, SymbolId, SymbolId] | null;
    isSpinning: boolean;
    onSpinComplete: () => void;
}

const SPIN_DURATION = 3000;
const TICK_INVERVAL = 100;

function getRandomSymbolId(): SymbolId {
    let randomID = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[randomID].id;
}

function getInitialSymbols(): [SymbolId, SymbolId, SymbolId] {
    return [getRandomSymbolId(), getRandomSymbolId(), getRandomSymbolId()];
}


export default function Reel({
    x,
    y,
    symbolSize = 100,
    gap = 20,
    result,
    isSpinning,
    onSpinComplete,
}:ReelProps) 
{
    const[visibleSymbols, setVisibleSymbols] =
    useState <[SymbolId, SymbolId, SymbolId]>
    (getInitialSymbols());

    const tickRef = useRef<ReturnType<typeof setInterval> | null> (null);
    const spinTimerRef = useRef<ReturnType<typeof setInterval> | null> (null);
    const onSpinCompleteRef = useRef(onSpinComplete) // -b- common React gotcha

    useEffect(() => {
        onSpinCompleteRef.current = onSpinComplete;
    }, [onSpinComplete]);

    useEffect(() => {
        if(isSpinning) {
            tickRef.current = setInterval(() => {
                setVisibleSymbols([
                    getRandomSymbolId(),
                    getRandomSymbolId(),
                    getRandomSymbolId(),
                ]);
            }, TICK_INVERVAL);

            spinTimerRef.current = setTimeout(()=> { // -b- clear
                clearInterval(tickRef.current!);

                if(result){
                    setVisibleSymbols(result);
                }

                onSpinCompleteRef.current();
            }, SPIN_DURATION);
        }

        return () => {
            clearInterval(tickRef.current!);
            clearTimeout(spinTimerRef.current!);
        };
    }, [isSpinning, result])

    const slotWidth = symbolSize + gap;

    return(
        <Container x={x} y={y}>
            {visibleSymbols.map((symbolId, index) => (
                <Symbol
                    key={index}
                    symbolId={symbolId}
                    x={index*slotWidth}
                    y={0}
                    size={symbolSize}
                />
            ))}
        </Container>
    )

}

