import { TilingSprite, Container } from "@pixi/react";
import { useMemo } from "react";
import { BaseTexture, Texture, Rectangle } from "pixi.js";

const TILE_W  = 24;
const TILE_H  = 60;
const BORDER  = 40;
const V_SCALE = BORDER / TILE_H;

interface ReelBorderProps {
  width: number;
  height: number;
}

export default function ReelBorder({ width, height }: ReelBorderProps) {
  const texture = useMemo(() => {
    const base = BaseTexture.from("/assets/Ground_rocks.png");
    return new Texture(base, new Rectangle(356, 353, TILE_W, TILE_H));
  }, []);

  return (
    <Container>
      <TilingSprite texture={texture} width={width}   height={BORDER}                 tileScale={{ x: 1, y: V_SCALE }} tilePosition={{ x: 0, y: 0 }} x={0}              y={0}               />
      <TilingSprite texture={texture} width={width}   height={BORDER}                 tileScale={{ x: 1, y: V_SCALE }} tilePosition={{ x: 0, y: 0 }} x={0}              y={height - BORDER} />
      <TilingSprite texture={texture} width={BORDER}  height={height - BORDER * 2}                                      tilePosition={{ x: 0, y: 0 }} x={0}              y={BORDER}          />
      <TilingSprite texture={texture} width={BORDER}  height={height - BORDER * 2}                                     tilePosition={{ x: 0, y: 0 }} x={width - BORDER} y={BORDER}          />
    </Container>
  );
}
