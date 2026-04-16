import { Container, Text, Sprite } from "@pixi/react";
import { TextStyle, Texture } from "pixi.js";
import { useMemo } from "react";
import btnSpin from "../../../public/assets/btnPurple.png";

interface SpinButtonProps {
  x: number;
  y: number;
  onSpin: () => void;
  disabled: boolean;
  spinCost: number;
  isSpinning: boolean;
  canAfford: boolean;
}

const texture = Texture.from(btnSpin);

export default function SpinButton({
  x,
  y,
  onSpin,
  disabled,
  spinCost,
  isSpinning,
  canAfford,
}: SpinButtonProps) {
  const label = !canAfford
    ? "OUT OF FUNDS"
    : isSpinning
    ? "SPINNING..."
    : `SPIN (€${spinCost})`;

  const textStyle = useMemo(
    () =>
      new TextStyle({
        fontSize: 22,
        fontFamily: "Quicksand",
        fontWeight: "bold",
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
      pointertap={disabled ? undefined : onSpin}
    >
      <Sprite
        texture={texture}
        anchor={0.5}
        width={160}
        height={60}
        alpha={disabled ? 0.6 : 1}
      />

      <Text
        text={label}
        anchor={0.5}
        x={0}
        y={0}
        style={textStyle}
      />
    </Container>
  );
}