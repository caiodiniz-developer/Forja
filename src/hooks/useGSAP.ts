import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Lightweight useGSAP: runs the callback inside a gsap.context so every tween
 * and ScrollTrigger created within is reverted on unmount. Respects deps.
 */
export function useGSAP(cb: () => void, deps: unknown[] = []) {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(cb);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
