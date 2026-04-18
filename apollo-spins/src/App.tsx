import { Stage, Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useGameState } from "./hooks/useGameState";
import { useWindowSize } from "./hooks/useWindowSize";
import Reel from "./components/game/Reel";
import SpinButton from "./components/game/SpinButton";
import { WinText, BalanceText } from "./components/game/UI";
import ReelBorder from "./components/game/ReelBorder";

const STAGE_WIDTH  = 1280;
const STAGE_HEIGHT = 720;

const PANEL_WIDTH  = STAGE_WIDTH * 0.6;
const PANEL_LEFT   = (STAGE_WIDTH - PANEL_WIDTH) / 2;

const TOP_HEIGHT    = 210;
const MIDDLE_HEIGHT = 330;
const BOTTOM_HEIGHT = 170;

const SYMBOL_SIZE    = 90;
const SYMBOL_GAP     = 20;
const PANEL_PADDING  = 120;
const SYMBOL_SPACING = (PANEL_WIDTH - PANEL_PADDING * 2 - SYMBOL_SIZE) / 2;

const REEL_X = PANEL_PADDING + SYMBOL_SIZE / 2;
const REEL_Y = MIDDLE_HEIGHT / 2;

const BOTTOM_CENTER_Y = BOTTOM_HEIGHT / 2;

const LICH_SIZE = 240;
const LICH_Y    = -12;

const lichTexture = Texture.from("/assets/lich.png");

export default function App() {
  const {
    balance,
    spinCost,
    isSpinning,
    result,
    lastWin,
    spin,
    stopSpin,
  } = useGameState();

  const { width, height } = useWindowSize();

  const CONTENT_HEIGHT = TOP_HEIGHT + MIDDLE_HEIGHT + BOTTOM_HEIGHT;

  const scale          = Math.max(width / STAGE_WIDTH, height / STAGE_HEIGHT);

  const realWidth      =  width - STAGE_WIDTH * scale;
  const offsetX        =  realWidth / 2;

  const stageCenterY   = (height - STAGE_HEIGHT * scale) / 2;
  const contentCenterY = (STAGE_HEIGHT - CONTENT_HEIGHT) / 2 * scale;
  const offsetY        = stageCenterY + contentCenterY;

  const canAfford = balance >= spinCost;
  const isWin     = lastWin ? lastWin.multiplier > 0 : false;

  return (
    <Stage
      width={width}
      height={height}
      options={{ backgroundColor: 0x1a1a2e, resizeTo: window }}
    >
      <Container x={offsetX} y={offsetY} scale={scale}>

        <Container x={STAGE_WIDTH / 2} y={TOP_HEIGHT / 3}>
          {lastWin && <WinText message={lastWin.message} isWin={isWin} />}
        </Container>

        <Container x={PANEL_LEFT} y={TOP_HEIGHT}>
          <ReelBorder width={PANEL_WIDTH} height={MIDDLE_HEIGHT} />
          <Reel
            x={REEL_X}
            y={REEL_Y}
            symbolSize={SYMBOL_SIZE}
            gap={SYMBOL_GAP}
            symbolSpacing={SYMBOL_SPACING}
            result={result}
            isSpinning={isSpinning}
          />
        </Container>

        <Container x={PANEL_LEFT} y={TOP_HEIGHT + MIDDLE_HEIGHT}>
          <Container x={0} y={BOTTOM_CENTER_Y}>
            <BalanceText balance={balance} />
          </Container>
          <SpinButton
            x={PANEL_WIDTH / 2}
            y={BOTTOM_CENTER_Y}
            onPress={isSpinning ? stopSpin : spin}
            disabled={!canAfford && !isSpinning}
            spinCost={spinCost}
            isSpinning={isSpinning}
            canAfford={canAfford}
          />
        </Container>

        <Sprite
          texture={lichTexture}
          anchor={0.5}
          x={PANEL_LEFT + PANEL_WIDTH / 2}
          y={TOP_HEIGHT + LICH_Y}
          width={LICH_SIZE}
          height={LICH_SIZE}
        />

      </Container>
    </Stage>
  );
}
