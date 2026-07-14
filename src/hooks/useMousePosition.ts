import { useEffect, useState } from "react";

interface Pointer {
  x: number;
  y: number;
  /** normalized -1..1 from center */
  nx: number;
  ny: number;
}

/** Tracks the pointer, exposing both absolute and center-normalized coords. */
export function useMousePosition(): Pointer {
  const [pos, setPos] = useState<Pointer>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setPos({ x: e.clientX, y: e.clientY, nx, ny });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return pos;
}
