import { Container, Text } from "@pixi/react";
import { useRef, useEffect, useMemo } from "react";
import type { WinResult } from "../../game/logic";
import { TextStyle } from "@pixi/text";
import { useWinTextAnimation } from "../../hooks/useWinTextAnimation";
import type { Container as PixiContainer, Text as PixiText } from "pixi.js";

interface UIProps {
  x: number;
  y: number;
  balance: number;
  lastWin: WinResult | null;
}

interface WinTextProps {
  message: string;
  isWin: boolean;
}

function WinText({ message, isWin }: WinTextProps) {
  const containerRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiText | null>(null);

  const { reset } = useWinTextAnimation(containerRef, textRef, isWin);

  useEffect(() => {
    reset();
  }, [message, isWin]);

  const textStyle = useMemo(
    () =>
      new TextStyle({
        fontSize: isWin ? 26 : 20,
        fontWeight: "bold",
        fill: isWin ? 0xffd700 : 0xff6b6b,
        dropShadow: isWin,
        dropShadowColor: 0xffaa00,
        dropShadowBlur: 12,
      }),
    [isWin]
  );

  return (
    <Container ref={containerRef}>
      <Text
        ref={textRef}
        text={message}
        anchor={0.5}
        style={textStyle}
      />
    </Container>
  );
}

export default function UI({ x, y, balance, lastWin }: UIProps) {
  const isWin = lastWin ? lastWin.multiplier > 0 : false;

  const balanceStyle = useMemo(
    () =>
      new TextStyle({
        fontSize: 28,
        fontWeight: "bold",
        fill: 0xffffff,
      }),
    []
  );

  return (
    <Container x={x} y={y}>
      <Text
        text={`Balance: €${balance}`}
        anchor={0.5}
        x={0}
        y={0}
        style={balanceStyle}
      />

      {lastWin && (
        <Container x={0} y={88}>
          <WinText message={lastWin.message} isWin={isWin} />
        </Container>
      )}
    </Container>
  );
}