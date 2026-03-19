import { useEffect, useRef } from "react";

const HEX_CHARS = "0123456789ABCDEF";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const columns: number[] = [];
    const fontSize = 14;
    let w = 0;
    let h = 0;

    function resize() {
      w = canvas!.width = canvas!.offsetWidth * window.devicePixelRatio;
      h = canvas!.height = canvas!.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      const cols = Math.floor(canvas!.offsetWidth / fontSize);
      columns.length = 0;
      for (let i = 0; i < cols; i++) {
        columns.push(Math.random() * canvas!.offsetHeight);
      }
    }

    function draw() {
      ctx!.fillStyle = "rgba(10, 10, 10, 0.06)";
      ctx!.fillRect(0, 0, canvas!.offsetWidth, canvas!.offsetHeight);
      ctx!.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx!.fillStyle = "rgba(0, 255, 136, 0.6)";
        } else if (brightness > 0.85) {
          ctx!.fillStyle = "rgba(0, 180, 216, 0.3)";
        } else {
          ctx!.fillStyle = "rgba(0, 255, 136, 0.08)";
        }
        ctx!.fillText(char, i * fontSize, columns[i]);

        if (columns[i] > canvas!.offsetHeight && Math.random() > 0.98) {
          columns[i] = 0;
        }
        columns[i] += fontSize * 0.6;
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
    />
  );
}
