import { Container, Text, Sprite } from "@pixi/react";
import { TextStyle, Texture } from "pixi.js";
import { useMemo } from "react";
import btnSpin from "../../../public/assets/btnGreen.png";

const COIN_SIZE = 24;
const COIN_X    = -24;

const btnTexture  = Texture.from(btnSpin);
const coinTexture = Texture.from("/assets/skullcoint.png");

interface SpinButtonProps {
  x: number;
  y: number;
  onPress: () => void;
  disabled: boolean;
  spinCost: number;
  isSpinning: boolean;
  canAfford: boolean;
}

export default function SpinButton({
  x,
  y,
  onPress,
  disabled,
  spinCost,
  isSpinning,
  canAfford,
}: SpinButtonProps) {
  const label = !canAfford && !isSpinning
    ? "OUT OF FUNDS"
    : isSpinning
    ? "STOP"
    : null;

  const textStyle = useMemo(
    () =>
      new TextStyle({
        fontSize: 12,
        fontFamily: "Press Start 2P",
        fill: disabled ? 0xaaaaaa : 0xffffff,
      }),
    [disabled]
  );

  return (
    <Container
      x={x}
      y={y}
      interactive={!disabled}
      cursor={disabled ? "not-allowed" : "pointer"}
      pointertap={disabled ? undefined : onPress}
    >
      <Sprite texture={btnTexture} anchor={0.5} width={160} height={60} alpha={disabled ? 0.6 : 1} />

      {label ? (
        <Text text={label} anchor={0.5} x={0} y={0} style={textStyle} />
      ) : (
        <>
          <Text text="SPIN" anchor={{ x: 0.5, y: 0.5 }} x={COIN_X} y={0} style={textStyle} />
          <Text text={`(${spinCost}`} anchor={{ x: 0.5, y: 0.5 }} x={15} y={0} style={textStyle} />
          <Sprite texture={coinTexture} anchor={0.5} x={42} y={-1.5} width={COIN_SIZE} height={COIN_SIZE} />
          <Text text=" )" anchor={{ x: 0.5, y: 0.5 }} x={54} y={0} style={textStyle} />
        </>
      )}
    </Container>
  );
}
