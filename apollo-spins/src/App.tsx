import { Stage, Container } from "@pixi/react";
import { useGameState } from "./hooks/useGameState";
import { useWindowSize } from "./hooks/useWindowSize";
import Reel from "./components/game/Reel";
import SpinButton from "./components/game/SpinButton";
import UI from "./components/game/UI";
import StarField from "./components/game/background/StarField";
import Sun from "./components/game/background/Sun";
import WaterfallEmitter from "./components/game/background/WaterfallEmitter";
import WaveEffect from "./components/game/background/WaveEffect";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

const SYMBOL_SIZE = 75;
const GAP = 20;
const REEL_WIDTH = SYMBOL_SIZE * 3 + GAP * 2;

const WATERFALL_WIDTH = 80;
const WATERFALL_HEIGHT = STAGE_HEIGHT - 60;

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

export default function App() {
  const {
    balance,
    spinCost,
    isSpinning,
    result,
    lastWin,
    canSpin,
    spin,
  } = useGameState();

  const { width, height } = useWindowSize();

  const scale = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const offsetX = (width - DESIGN_WIDTH * scale) / 2;
  const offsetY = (height - DESIGN_HEIGHT * scale) / 2;

  const canAfford = balance >= spinCost;

  return (
    <Stage
      width={width}
      height={height}
      options={{ backgroundColor: 0x1a1a2e, resizeTo: window }}
    >
      <Container x={offsetX} y={offsetY} scale={scale}>
        {/* Background */}
        <StarField />
        <Sun />

        <WaterfallEmitter
          x={0}
          spawnY={0}
          height={WATERFALL_HEIGHT}
          emitterWidth={WATERFALL_WIDTH}
          flipDrift={false}
        />

        <WaterfallEmitter
          x={STAGE_WIDTH - WATERFALL_WIDTH}
          spawnY={0}
          height={WATERFALL_HEIGHT}
          emitterWidth={WATERFALL_WIDTH}
          flipDrift={true}
        />

        <WaveEffect
          stageWidth={STAGE_WIDTH}
          y={STAGE_HEIGHT - 80}
          waveBodyHeight={80}
        />

        {/* UI */}
        <UI
          x={DESIGN_WIDTH / 2}
          y={225}
          balance={balance}
          lastWin={lastWin}
        />

        {/* Game */}
        <Reel
          x={DESIGN_WIDTH / 2 - REEL_WIDTH / 2 + SYMBOL_SIZE / 2}
          y={DESIGN_HEIGHT / 1.8}
          symbolSize={SYMBOL_SIZE}
          gap={GAP}
          result={result}
          isSpinning={isSpinning}
        />

        <SpinButton
          x={DESIGN_WIDTH / 2}
          y={DESIGN_HEIGHT - 150}
          onSpin={spin}
          disabled={!canSpin}
          spinCost={spinCost}
          // 👇 NEW SIGNALS (we'll use these next)
          isSpinning={isSpinning}
          canAfford={canAfford}
        />
      </Container>
    </Stage>
  );
}