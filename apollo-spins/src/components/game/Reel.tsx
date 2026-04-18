import { Container } from "@pixi/react";
import { type SymbolId } from "../../game/symbols";
import Symbol from "./Symbol";
import { useReelSpin } from "../../hooks/useReelSpin";

interface ReelProps {
  x: number;
  y: number;
  symbolSize?: number;
  gap?: number;
  symbolSpacing?: number;
  result: [SymbolId, SymbolId, SymbolId] | null;
  isSpinning: boolean;
}

export default function Reel({
  x,
  y,
  symbolSize = 100,
  gap = 20,
  symbolSpacing,
  result,
  isSpinning,
}: ReelProps) {
  const stride  = symbolSize + gap;
  const hStride = symbolSpacing ?? stride;
  const slots   = useReelSpin(stride, isSpinning, result);

  return (
    <Container x={x} y={y}>
      {slots.map((slot, i) => (
        <Container key={i} x={i * hStride}>
          {slot.offsetY > 0 && (
            <Container y={slot.offsetY - stride}>
              <Symbol symbolId={slot.nextId} x={0} y={0} size={symbolSize} />
            </Container>
          )}
          <Container y={slot.offsetY}>
            <Symbol symbolId={slot.symbolId} x={0} y={0} size={symbolSize} />
          </Container>
        </Container>
      ))}
    </Container>
  );
}
