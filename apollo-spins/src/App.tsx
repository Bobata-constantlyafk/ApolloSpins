import { Stage, Container, Sprite, TilingSprite } from "@pixi/react";
import { useState, useEffect, useRef } from "react";
import { useGameState } from "./hooks/useGameState";
import { useStageLayout } from "./hooks/useStageLayout";
import Reel from "./components/game/Reel";
import SpinButton from "./components/game/SpinButton";
import { WinText, BalanceText } from "./components/game/UI";
import ReelBorder from "./components/game/ReelBorder";
import MouseGlow from "./components/game/MouseGlow";
import SmokeLayer from "./components/game/SmokeLayer";
import { lichTexture, graveyardTexture, dungeonTexture } from "./textures";

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

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1em "Press Start 2P"').then(() => setFontsReady(true));
  }, []);

  const cursorRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const { balance, spinCost, isSpinning, result, lastWin, spin, stopSpin } = useGameState();
  const { width, height, scale, offsetX, offsetY } = useStageLayout();

  const canAfford = balance >= spinCost;
  const isWin     = lastWin ? lastWin.multiplier > 0 : false;

  if (!fontsReady) return null;

  return (
    <>
      <img
        ref={cursorRef}
        src="/assets/cursor.png"
        style={{ position: "fixed", top: 0, left: 0, width: 48, height: 48, pointerEvents: "none", transform: "translate(-9999px, -9999px)" }}
      />
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x1a1a2e, resizeTo: window }}
      >
        <Container x={offsetX} y={offsetY} scale={scale}>

          <Sprite texture={graveyardTexture} x={0} y={0} width={STAGE_WIDTH} height={STAGE_HEIGHT} />
          <SmokeLayer />
          <MouseGlow offsetX={offsetX} offsetY={offsetY} scale={scale} />

          <Container x={STAGE_WIDTH / 2} y={TOP_HEIGHT / 3}>
            {lastWin && <WinText message={lastWin.message} isWin={isWin} />}
          </Container>

          <Container x={PANEL_LEFT} y={TOP_HEIGHT}>
            <TilingSprite texture={dungeonTexture} width={PANEL_WIDTH} height={MIDDLE_HEIGHT} tilePosition={{ x: 0, y: 0 }} />
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
    </>
  );
}
