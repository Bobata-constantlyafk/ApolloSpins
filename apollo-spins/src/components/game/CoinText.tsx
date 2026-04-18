import { Container, Text, Sprite } from "@pixi/react";
import { Texture, TextMetrics } from "pixi.js";
import { useMemo } from "react";
import type { TextStyle } from "pixi.js";

const COIN_GAP    = 4;
const coinTexture = Texture.from("/assets/skullcoint.png");

interface CoinTextProps {
  text: string;
  style: TextStyle;
  centered?: boolean;
  y?: number;
}

export function CoinText({ text, style, centered = false, y = 0 }: CoinTextProps) {
  const coinSize = (style.fontSize as number) ?? 16;

  const layout = useMemo(() => {
    const parts = text.split("€");
    let xPos = 0;

    const elements = parts.flatMap((part, i) => {
      const result = [];

      if (part) {
        const w = TextMetrics.measureText(part, style).width;
        result.push({ type: "text" as const, content: part, x: xPos, width: w });
        xPos += w;
      }

      if (i < parts.length - 1) {
        result.push({ type: "coin" as const, x: xPos, width: coinSize + COIN_GAP * 2 });
        xPos += coinSize + COIN_GAP * 2;
      }

      return result;
    });

    return { elements, totalWidth: xPos };
  }, [text, style.fontSize, style.fontFamily]);

  const offsetX = centered ? -layout.totalWidth / 2 : 0;

  return (
    <Container y={y}>
      {layout.elements.map((el, i) =>
        el.type === "text" ? (
          <Text
            key={i}
            text={el.content!}
            style={style}
            anchor={{ x: 0, y: 0.5 }}
            x={offsetX + el.x}
            y={0}
          />
        ) : (
          <Sprite
            key={i}
            texture={coinTexture}
            anchor={{ x: 0, y: 0.5 }}
            x={offsetX + el.x + COIN_GAP}
            y={0}
            width={coinSize}
            height={coinSize}
          />
        )
      )}
    </Container>
  );
}
