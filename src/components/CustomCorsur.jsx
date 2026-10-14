
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomCursor.css";

const TAIL_LENGTH = 16;

const createTail = () =>
  Array.from({ length: TAIL_LENGTH }, () => ({
    x: -100,
    y: -100,
  }));

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [idle, setIdle] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [tail, setTail] = useState(createTail);

  const position = useRef({ x: -100, y: -100 });
  const tailRef = useRef(createTail());
  const idleTimer = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    let frame;

    const resetIdle = () => {
      setIdle(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIdle(true), 1500);
    };

    const onMove = (e) => {
      position.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      resetIdle();
    };

    const onOver = (e) => {
      setHovering(
        !!e.target.closest("a, button, [data-cursor]")
      );
    };

    const onDown = (e) => {
      setClicking(true);
      resetIdle();

      const id = Date.now();

      setClicks((prev) => [
        ...prev,
        { id, x: e.clientX, y: e.clientY },
      ]);

      setTimeout(() => {
        setClicks((prev) =>
          prev.filter((click) => click.id !== id)
        );
      }, 650);
    };

    const onUp = () => setClicking(false);

    const onLeave = () => {
      setVisible(false);
      setIdle(false);
    };

    const animate = () => {
      const previous = tailRef.current;
      const next = [position.current];

      for (let i = 1; i < TAIL_LENGTH; i++) {
        next.push({
          x: previous[i - 1].x +
            (previous[i].x - previous[i - 1].x) * 0.3,
          y: previous[i - 1].y +
            (previous[i].y - previous[i - 1].y) * 0.3,
        });
      }

      tailRef.current = next;
      setTail(next);
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener(
        "mouseleave", onLeave
      );

      cancelAnimationFrame(frame);
      clearTimeout(idleTimer.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return null;
  }

  return (
    <>
      {visible && tail.map((point, i) => {
        const progress = 1 - i / TAIL_LENGTH;

        return (
          <div
            key={i}
            className="cursor-trail"
            style={{
              left: point.x,
              top: point.y,
              width: Math.max(2, 7 * progress),
              height: Math.max(2, 7 * progress),
              opacity: progress * 0.5,
              filter: `blur(${i < 5 ? (5 - i) * 0.35 : 0}px)`,
            }}
          />
        );
      })}

      {visible && (
        <div
          className={`custom-cursor
            ${hovering ? "is-hovering" : ""}
            ${clicking ? "is-clicking" : ""}
            ${idle ? "is-idle" : ""}`}
          style={{
            left: tail[0]?.x ?? -100,
            top: tail[0]?.y ?? -100,
          }}
        />
      )}

      <AnimatePresence>
        {clicks.map((click) => (
          <motion.div
            key={click.id}
            className="cursor-ripple"
            style={{
              left: click.x,
              top: click.y,
            }}
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
