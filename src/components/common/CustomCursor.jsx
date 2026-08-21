import React, { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on desktop (screen width > 768px) and non-touch devices
    if (window.innerWidth <= 768 || matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e) => {
      const target = e.target.closest("button, a, input, [role='button'], .card-luxury-3d, .category-card-3d");
      if (target) {
        setIsHovered(true);
        if (target.classList.contains("card-luxury-3d") || target.closest(".card-luxury-3d")) {
          setCursorText("VIEW");
        } else {
          setCursorText("");
        }
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Small Dot */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#7FFFD4] rounded-full pointer-events-none z-[9999] transition-transform duration-75 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Outer Ring / VIEW Text Badge */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-[#D6B77A]/60 pointer-events-none z-[9998] transition-all duration-300 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-[9px] tracking-widest text-[#F4EFE6] bg-[#151918]/60 backdrop-blur-xs ${
          isHovered
            ? cursorText === "VIEW"
              ? "w-14 h-14 border-[#7FFFD4] scale-100 opacity-100"
              : "w-10 h-10 border-[#D6B77A] scale-100 opacity-100"
            : "w-8 h-8 opacity-40 scale-75"
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {cursorText}
      </div>
    </>
  );
};
