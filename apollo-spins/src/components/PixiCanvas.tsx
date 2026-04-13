import { useEffect, useRef } from "react";
import { Application } from "pixi.js";

export default function PixiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const app = new Application();


    // Cleanup on unmount
    return () => {
      app.destroy(false, { children: true });
    };
  }, []);

  return <canvas ref={canvasRef} />;
}