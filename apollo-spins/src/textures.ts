import { Texture, BaseTexture, Rectangle } from "pixi.js";
import { SYMBOLS, type SymbolId } from "./game/symbols";

export const coinTexture      = Texture.from("/assets/skullcoint.png");
export const lichTexture      = Texture.from("/assets/lich.png");
export const graveyardTexture = Texture.from("/assets/graveyard.png");
export const btnTexture       = Texture.from("/assets/btnGreen.png");
export const dungeonTexture   = new Texture(
  BaseTexture.from("/assets/tiles.png"),
  new Rectangle(80, 320, 95, 45),
);
export const reelBorderTexture = new Texture(
  BaseTexture.from("/assets/Ground_rocks.png"),
  new Rectangle(356, 353, 24, 60),
);

export const symbolTextures = Object.fromEntries(
  SYMBOLS.map((s) => [s.id, Texture.from(s.asset)]),
) as Record<SymbolId, Texture>;
