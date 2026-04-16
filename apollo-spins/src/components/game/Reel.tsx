import { Container } from "@pixi/react";
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

const TICK_INTERVAL = 100;

function getRandomSymbolId(): SymbolId {
  const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
  return SYMBOLS[randomIndex].id;
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
}: ReelProps) {
  const [visibleSymbols, setVisibleSymbols] =
    useState<[SymbolId, SymbolId, SymbolId]>(getInitialSymbols);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSpinning) {
      tickRef.current = setInterval(() => {
        setVisibleSymbols([
          getRandomSymbolId(),
          getRandomSymbolId(),
          getRandomSymbolId(),
        ]);
      }, TICK_INTERVAL);
    } else {
      // Stop spinning → show result
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }

      if (result) {
        setVisibleSymbols(result);
      }
    }

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [isSpinning, result]);

  const slotWidth = symbolSize + gap;

  return (
    <Container x={x} y={y}>
      {visibleSymbols.map((symbolId, index) => (
        <Symbol
          key={index}
          symbolId={symbolId}
          x={index * slotWidth}
          y={0}
          size={symbolSize}
        />
      ))}
    </Container>
  );
}