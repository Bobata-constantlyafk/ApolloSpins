import { Sprite } from "@pixi/react";
import { type SymbolId } from "../../game/symbols";
import { symbolTextures } from "../../textures";

interface SymbolProps {
  symbolId: SymbolId;
  x: number;
  y: number;
  size?: number;
}

export default function Symbol({ symbolId, x, y, size = 100 }: SymbolProps) {
  return (
    <Sprite
      texture={symbolTextures[symbolId]}
      x={x}
      y={y}
      width={size}
      height={size}
      anchor={0.5}
    />
  );
}
