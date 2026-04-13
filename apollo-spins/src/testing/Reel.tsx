// import { Container } from "@pixi/react";
// import { useEffect, useRef, useState } from "react";
// import { SYMBOLS, type SymbolId } from "../../game/symbols";
// import Symbol from "./Symbol";

// interface ReelProps {
//   x: number;
//   y: number;
//   symbolSize?: number;
//   gap?: number;
//   result: [SymbolId, SymbolId, SymbolId] | null;
//   isSpinning: boolean;
//   onSpinComplete: () => void;
// }

// const SPIN_DURATION_MS = 3000;
// const TICK_INTERVAL_MS = 100; // how fast symbols shuffle during spin

// function getRandomSymbolId(): SymbolId {
//   return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id;
// }

// function getInitialSymbols(): [SymbolId, SymbolId, SymbolId] {
//   return [getRandomSymbolId(), getRandomSymbolId(), getRandomSymbolId()];
// }

// export default function Reel({
//   x,
//   y,
//   symbolSize = 100,
//   gap = 20,
//   result,
//   isSpinning,
//   onSpinComplete,
// }: ReelProps) {
//   const [visibleSymbols, setVisibleSymbols] = useState
//     [SymbolId, SymbolId, SymbolId]
//   >(getInitialSymbols());

//   const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const onSpinCompleteRef = useRef(onSpinComplete);

//   // Keep ref in sync so we don't have stale closures in timers
//   useEffect(() => {
//     onSpinCompleteRef.current = onSpinComplete;
//   }, [onSpinComplete]);

//   useEffect(() => {
//     if (isSpinning) {
//       // Shuffle symbols rapidly during spin
//       tickRef.current = setInterval(() => {
//         setVisibleSymbols([
//           getRandomSymbolId(),
//           getRandomSymbolId(),
//           getRandomSymbolId(),
//         ]);
//       }, TICK_INTERVAL_MS);

//       // After spin duration, land on the result
//       spinTimerRef.current = setTimeout(() => {
//         clearInterval(tickRef.current!);

//         if (result) {
//           setVisibleSymbols(result);
//         }

//         onSpinCompleteRef.current();
//       }, SPIN_DURATION_MS);
//     }

//     return () => {
//       clearInterval(tickRef.current!);
//       clearTimeout(spinTimerRef.current!);
//     };
//   }, [isSpinning, result]);

//   const slotHeight = symbolSize + gap;

//   return (
//     <Container x={x} y={y}>
//       {visibleSymbols.map((symbolId, index) => (
//         <Symbol
//           key={index}
//           symbolId={symbolId}
//           x={0}
//           y={index * slotHeight}
//           size={symbolSize}
//         />
//       ))}
//     </Container>
//   );
// }