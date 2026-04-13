"use client";

import { useEffect, useMemo, useRef } from "react";

export type HeroBackgroundColorScheme = "dark" | "light";

interface HeroBackgroundAnimationProps {
  elementCount?: number;
  colorScheme?: HeroBackgroundColorScheme;
  className?: string;
}

interface Palette {
  orbColors: string[];
  orbHighlights: string[];
  panelFrom: string;
  panelTo: string;
  panelStroke: string;
  panelGlow: string;
  diamondFrom: string;
  diamondTo: string;
}

interface ShapeDefinition {
  type: "orb" | "panel" | "diamond";
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
  rotation: number;
}

interface Shape extends ShapeDefinition {
  centerX: number;
  centerY: number;
  fill: string;
  accent: string;
}

const PALETTES: Record<HeroBackgroundColorScheme, Palette> = {
  dark: {
    orbColors: [
      "rgba(56, 189, 248, 0.2)",
      "rgba(59, 130, 246, 0.18)",
      "rgba(34, 211, 238, 0.15)",
      "rgba(125, 211, 252, 0.14)",
    ],
    orbHighlights: [
      "rgba(186, 230, 253, 0.28)",
      "rgba(147, 197, 253, 0.24)",
      "rgba(103, 232, 249, 0.22)",
      "rgba(224, 242, 254, 0.18)",
    ],
    panelFrom: "rgba(255, 255, 255, 0.1)",
    panelTo: "rgba(15, 23, 42, 0.04)",
    panelStroke: "rgba(255, 255, 255, 0.16)",
    panelGlow: "rgba(8, 47, 73, 0.34)",
    diamondFrom: "rgba(56, 189, 248, 0.18)",
    diamondTo: "rgba(15, 23, 42, 0.05)",
  },
  light: {
    orbColors: [
      "rgba(14, 165, 233, 0.14)",
      "rgba(59, 130, 246, 0.12)",
      "rgba(99, 102, 241, 0.1)",
      "rgba(56, 189, 248, 0.1)",
    ],
    orbHighlights: [
      "rgba(224, 242, 254, 0.26)",
      "rgba(219, 234, 254, 0.24)",
      "rgba(224, 231, 255, 0.18)",
      "rgba(207, 250, 254, 0.18)",
    ],
    panelFrom: "rgba(255, 255, 255, 0.24)",
    panelTo: "rgba(226, 232, 240, 0.08)",
    panelStroke: "rgba(148, 163, 184, 0.24)",
    panelGlow: "rgba(148, 163, 184, 0.22)",
    diamondFrom: "rgba(14, 165, 233, 0.12)",
    diamondTo: "rgba(255, 255, 255, 0.06)",
  },
};

const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  {
    type: "orb",
    x: 0.08,
    y: 0.18,
    size: 0.32,
    width: 0,
    height: 0,
    radius: 0,
    opacity: 0.54,
    rotation: 0,
  },
  {
    type: "orb",
    x: 0.9,
    y: 0.08,
    size: 0.28,
    width: 0,
    height: 0,
    radius: 0,
    opacity: 0.5,
    rotation: 0,
  },
  {
    type: "panel",
    x: 0.86,
    y: 0.3,
    size: 0,
    width: 0.35,
    height: 0.2,
    radius: 0.08,
    opacity: 0.6,
    rotation: -11,
  },
  {
    type: "orb",
    x: 0.08,
    y: 0.84,
    size: 0.13,
    width: 0,
    height: 0,
    radius: 0,
    opacity: 0.4,
    rotation: 0,
  },
  {
    type: "panel",
    x: 0.72,
    y: 0.8,
    size: 0,
    width: 0.28,
    height: 0.16,
    radius: 0.07,
    opacity: 0.5,
    rotation: 8,
  },
  {
    type: "diamond",
    x: 0.95,
    y: 0.62,
    size: 0.1,
    width: 0,
    height: 0,
    radius: 0,
    opacity: 0.32,
    rotation: 14,
  },
  {
    type: "orb",
    x: 0.62,
    y: 0.1,
    size: 0.08,
    width: 0,
    height: 0,
    radius: 0,
    opacity: 0.28,
    rotation: 0,
  },
  {
    type: "diamond",
    x: 0.76,
    y: 0.18,
    size: 0.07,
    width: 0,
    height: 0,
    radius: 0,
    opacity: 0.24,
    rotation: -18,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const roundedRectPath = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
};

const createShapes = (
  width: number,
  height: number,
  elementCount: number,
  palette: Palette
): Shape[] => {
  const minDimension = Math.min(width, height);
  const maxElements = width < 640 ? 4 : width < 1024 ? 6 : 8;
  const count = clamp(Math.round(elementCount), 2, maxElements);

  return SHAPE_DEFINITIONS.slice(0, count).map((shape, index) => ({
    ...shape,
    centerX: width * shape.x,
    centerY: height * shape.y,
    size: minDimension * shape.size,
    width: minDimension * shape.width,
    height: minDimension * shape.height,
    radius: minDimension * shape.radius,
    fill:
      shape.type === "panel"
        ? palette.panelFrom
        : shape.type === "diamond"
          ? palette.diamondFrom
          : palette.orbColors[index % palette.orbColors.length],
    accent:
      shape.type === "panel"
        ? palette.panelTo
        : shape.type === "diamond"
          ? palette.diamondTo
          : palette.orbHighlights[index % palette.orbHighlights.length],
  }));
};

const drawOrb = (context: CanvasRenderingContext2D, shape: Shape) => {
  const gradient = context.createRadialGradient(
    shape.centerX - shape.size * 0.24,
    shape.centerY - shape.size * 0.28,
    shape.size * 0.06,
    shape.centerX,
    shape.centerY,
    shape.size
  );

  gradient.addColorStop(0, shape.accent);
  gradient.addColorStop(0.34, shape.fill);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.beginPath();
  context.fillStyle = gradient;
  context.arc(shape.centerX, shape.centerY, shape.size, 0, Math.PI * 2);
  context.fill();
};

const drawPanel = (
  context: CanvasRenderingContext2D,
  shape: Shape,
  palette: Palette
) => {
  const gradient = context.createLinearGradient(
    -shape.width / 2,
    -shape.height / 2,
    shape.width / 2,
    shape.height / 2
  );

  gradient.addColorStop(0, shape.fill);
  gradient.addColorStop(1, shape.accent);

  context.save();
  context.translate(shape.centerX, shape.centerY);
  context.rotate((shape.rotation * Math.PI) / 180);
  context.shadowColor = palette.panelGlow;
  context.shadowBlur = 28;
  context.shadowOffsetY = 10;
  context.fillStyle = gradient;
  roundedRectPath(
    context,
    -shape.width / 2,
    -shape.height / 2,
    shape.width,
    shape.height,
    shape.radius
  );
  context.fill();

  context.shadowBlur = 0;
  context.shadowOffsetY = 0;
  context.lineWidth = 1;
  context.strokeStyle = palette.panelStroke;
  roundedRectPath(
    context,
    -shape.width / 2,
    -shape.height / 2,
    shape.width,
    shape.height,
    shape.radius
  );
  context.stroke();

  context.beginPath();
  context.strokeStyle = "rgba(255, 255, 255, 0.06)";
  context.moveTo(-shape.width / 2 + 22, -shape.height / 2 + 22);
  context.lineTo(shape.width / 2 - 22, -shape.height / 2 + 22);
  context.stroke();
  context.restore();
};

const drawDiamond = (context: CanvasRenderingContext2D, shape: Shape) => {
  context.save();
  context.translate(shape.centerX, shape.centerY);
  context.rotate(((shape.rotation + 45) * Math.PI) / 180);

  const gradient = context.createLinearGradient(-shape.size, -shape.size, shape.size, shape.size);
  gradient.addColorStop(0, shape.fill);
  gradient.addColorStop(1, shape.accent);

  context.fillStyle = gradient;
  roundedRectPath(
    context,
    -shape.size / 2,
    -shape.size / 2,
    shape.size,
    shape.size,
    shape.size * 0.22
  );
  context.fill();

  context.lineWidth = 1;
  context.strokeStyle = "rgba(255, 255, 255, 0.05)";
  roundedRectPath(
    context,
    -shape.size / 2,
    -shape.size / 2,
    shape.size,
    shape.size,
    shape.size * 0.22
  );
  context.stroke();
  context.restore();
};

const HeroBackgroundAnimation = ({
  elementCount = 6,
  colorScheme = "dark",
  className,
}: HeroBackgroundAnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const palette = useMemo(() => PALETTES[colorScheme], [colorScheme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || typeof window === "undefined") return;

    const context = canvas.getContext("2d");

    if (!context) return;

    let width = 0;
    let height = 0;
    let resizeFrame = 0;

    const draw = () => {
      if (!width || !height) return;

      const shapes = createShapes(width, height, elementCount, palette);
      context.clearRect(0, 0, width, height);

      shapes.forEach((shape) => {
        context.save();
        context.globalAlpha = clamp(shape.opacity, 0.12, 0.88);

        if (shape.type === "orb") {
          drawOrb(context, shape);
        } else if (shape.type === "panel") {
          drawPanel(context, shape, palette);
        } else {
          drawDiamond(context, shape);
        }

        context.restore();
      });
    };

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);

      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      draw();
    };

    const scheduleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(resizeCanvas);
    };

    resizeCanvas();

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", scheduleResize);
    }

    return () => {
      window.cancelAnimationFrame(resizeFrame);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", scheduleResize);
      }
    };
  }, [elementCount, palette]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-95"
        style={{ mixBlendMode: colorScheme === "dark" ? "screen" : "normal" }}
      />
      <div className="hero-grid absolute inset-0 opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(2,6,23,0.16)_100%)]" />
    </div>
  );
};

export default HeroBackgroundAnimation;
