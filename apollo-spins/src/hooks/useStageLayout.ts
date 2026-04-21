import { useWindowSize } from "./useWindowSize";

const STAGE_WIDTH    = 1280;
const STAGE_HEIGHT   = 720;
const CONTENT_HEIGHT = 210 + 330 + 170;

export interface StageLayout {
  width:   number;
  height:  number;
  scale:   number;
  offsetX: number;
  offsetY: number;
}

export function useStageLayout(): StageLayout {
  const { width, height } = useWindowSize();
  const scale   = Math.max(width / STAGE_WIDTH, height / STAGE_HEIGHT);
  const offsetX = (width - STAGE_WIDTH * scale) / 2;
  const offsetY = (height - STAGE_HEIGHT * scale) / 2
                + (STAGE_HEIGHT - CONTENT_HEIGHT) / 2 * scale;
  return { width, height, scale, offsetX, offsetY };
}
