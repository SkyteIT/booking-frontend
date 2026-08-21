import { useEffect, type RefObject } from "react";

// Tilts the hero stage slightly to follow the cursor.
export function useStageTilt(stageRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = stageRef.current;
      if (!el) return;
      const rx = (e.clientY / window.innerHeight - 0.5) * -6;
      const ry = (e.clientX / window.innerWidth - 0.5) * 8;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [stageRef]);
}
