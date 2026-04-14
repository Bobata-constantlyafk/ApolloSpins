import { Stage, Container } from "@pixi/react";
import { useGameState } from "./hooks/useGameState";
import Reel from "./components/game/Reel";
import SpinButton from "./components/game/SpinButton";
import UI from "./components/game/UI";
import ParallaxBackground from "./components/ParallaxBackground";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

const SYMBOL_SIZE = 120;
const GAP = 20;

const REEL_WIDTH = SYMBOL_SIZE * 3 + GAP * 2;

export default function App() {
  const {
    balance,
    isSpinning,
    result,
    lastWin,
    canSpin,
    spin,
    onSpinComplete,
  } = useGameState();

  return (
    <>
      <ParallaxBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Stage
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          options={{ backgroundAlpha: 0 }}>
          <Container>
            {/* Reel — centered horizontally and vertically */}
            <Reel
              x={STAGE_WIDTH / 2 - REEL_WIDTH / 2 + SYMBOL_SIZE / 2}
              y={STAGE_HEIGHT / 2}
              symbolSize={SYMBOL_SIZE}
              gap={GAP}
              result={result}
              isSpinning={isSpinning}
              onSpinComplete={onSpinComplete}
            />

            {/* UI — balance and win message, top center */}
            <UI
              x={STAGE_WIDTH / 2}
              y={60}
              balance={balance}
              lastWin={lastWin}
            />

            {/* Spin button — bottom center */}
            <SpinButton
              x={STAGE_WIDTH / 2}
              y={STAGE_HEIGHT - 80}
              onSpin={spin}
              disabled={!canSpin}
            />
          </Container>
        </Stage>
      </div>
    </>
  );
}
