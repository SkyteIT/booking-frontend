import { useEffect } from "react";

// Adds the "in" class to any .orbit-reveal element once it scrolls into view.
export function useRevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".orbit-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
