import { Container, Text, Sprite } from "@pixi/react";
import { useRef, useEffect, useMemo } from "react";
import { TextStyle } from "@pixi/text";
import { useWinTextAnimation } from "../../hooks/useWinTextAnimation";
import type { Container as PixiContainer, Text as PixiText } from "pixi.js";
import { coinTexture } from "../../textures";

const COIN_SIZE = 45;


interface WinTextProps {
  message: string;
  isWin: boolean;
}

export function WinText({ message, isWin }: WinTextProps) {
  const containerRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiText | null>(null);
  const { reset } = useWinTextAnimation(containerRef, textRef, isWin);

  useEffect(() => {
    reset();
  }, [message, isWin]);

  const textStyle = useMemo(
    () =>
      new TextStyle({
        fontFamily: "Press Start 2P",
        fontSize: isWin ? 21 : 15,
        fill: isWin ? 0xffd700 : 0xff6b6b,
        dropShadow: isWin,
        dropShadowColor: 0xffaa00,
        dropShadowBlur: 12,
      }),
    [isWin],
  );

  return (
    <Container ref={containerRef}>
      <Text
        ref={textRef}
        text={message + " "}
        anchor={0.5}
        x={0}
        y={0}
        style={textStyle}
      />
      {isWin && (
        <Sprite
          texture={coinTexture}
          anchor={{ x: 0, y: 0.5 }}
          x={180}
          y={0}
          width={COIN_SIZE}
          height={COIN_SIZE}
        />
      )}
    </Container>
  );
}

interface BalanceTextProps {
  balance: number;
}

export function BalanceText({ balance }: BalanceTextProps) {
  const style = useMemo(
    () =>
      new TextStyle({
        fontFamily: "Press Start 2P",
        fontSize: 13,
        fill: 0xffffff,
      }),
    [],
  );

  return (
    <Container>
      <Text
        text="Balance:"
        anchor={{ x: 0, y: 0.5 }}
        x={0}
        y={0}
        style={style}
      />
      <Text
        text={`${balance}`}
        anchor={{ x: 0, y: 0.5 }}
        x={105}
        y={0}
        style={style}
      />
      <Sprite
        texture={coinTexture}
        anchor={{ x: 0, y: 0.5 }}
        x={150}
        y={0}
        width={COIN_SIZE - 15}
        height={COIN_SIZE - 15}
      />
    </Container>
  );
}
