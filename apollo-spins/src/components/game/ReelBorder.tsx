import { TilingSprite, Container } from "@pixi/react";
import { reelBorderTexture } from "../../textures";

const TILE_H  = 60;
const BORDER  = 40;
const V_SCALE = BORDER / TILE_H;

interface ReelBorderProps {
  width: number;
  height: number;
}

export default function ReelBorder({ width, height }: ReelBorderProps) {
  return (
    <Container>
      <TilingSprite texture={reelBorderTexture} width={width}          height={BORDER}              tileScale={{ x: 1, y: V_SCALE }} tilePosition={{ x: 0, y: 0 }} x={0}              y={0}               />
      <TilingSprite texture={reelBorderTexture} width={width}          height={BORDER}              tileScale={{ x: 1, y: V_SCALE }} tilePosition={{ x: 0, y: 0 }} x={0}              y={height - BORDER} />
      <TilingSprite texture={reelBorderTexture} width={BORDER}         height={height - BORDER * 2}                                  tilePosition={{ x: 0, y: 0 }} x={0}              y={BORDER}          />
      <TilingSprite texture={reelBorderTexture} width={BORDER}         height={height - BORDER * 2}                                  tilePosition={{ x: 0, y: 0 }} x={width - BORDER} y={BORDER}          />
    </Container>
  );
}
