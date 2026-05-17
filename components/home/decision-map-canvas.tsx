"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  drift: number;
  color: string;
  opacity: number;
  glow: number;
  pushX: number;
  pushY: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const HERO_BLUE = "#3C5CCF";
const HERO_ORANGE = "#D72638";
const HERO_BACKGROUND = "#070d18";
const CELL_SIZE = 96;
const POINTER_RADIUS = 170;
const FRAME_INTERVAL = 33;

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const numberValue = Number.parseInt(value, 16);

  return {
    r: (numberValue >> 16) & 255,
    g: (numberValue >> 8) & 255,
    b: numberValue & 255
  };
}

function rgba(hex: string, opacity: number) {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
}

function getDotCount(width: number, height: number) {
  const area = width * height;

  if (width < 640) {
    return Math.min(4200, Math.max(3200, Math.floor(area / 96)));
  }

  return Math.min(11000, Math.max(9500, Math.floor(area / 132)));
}

function getClusterColor(x: number, y: number, width: number, height: number) {
  const region =
    Math.sin((x / width) * Math.PI * 3.2 + (y / height) * Math.PI * 0.8) +
    Math.cos((y / height) * Math.PI * 3.5);

  return region > 0.22 ? HERO_ORANGE : HERO_BLUE;
}

function createDots(width: number, height: number): Dot[] {
  return Array.from({ length: getDotCount(width, height) }, () => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const brightness = Math.random();

    return {
      x,
      y,
      radius: brightness > 0.84 ? Math.random() * 1.5 + 1 : Math.random() * 0.85 + 0.55,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.45 + 0.12,
      color: getClusterColor(x, y, width, height),
      opacity: 0.2 + brightness * 0.62,
      glow: brightness,
      pushX: 0,
      pushY: 0
    };
  });
}

function buildGrid(dots: Dot[]) {
  const grid = new Map<string, number[]>();

  dots.forEach((dot, index) => {
    const key = `${Math.floor(dot.x / CELL_SIZE)}:${Math.floor(dot.y / CELL_SIZE)}`;
    const bucket = grid.get(key);

    if (bucket) {
      bucket.push(index);
    } else {
      grid.set(key, [index]);
    }
  });

  return grid;
}

function getNearbyDotIndices(grid: Map<string, number[]>, pointer: PointerState) {
  const indices: number[] = [];
  const minX = Math.floor((pointer.x - POINTER_RADIUS) / CELL_SIZE);
  const maxX = Math.floor((pointer.x + POINTER_RADIUS) / CELL_SIZE);
  const minY = Math.floor((pointer.y - POINTER_RADIUS) / CELL_SIZE);
  const maxY = Math.floor((pointer.y + POINTER_RADIUS) / CELL_SIZE);

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      const bucket = grid.get(`${x}:${y}`);

      if (bucket) {
        indices.push(...bucket);
      }
    }
  }

  return indices;
}

export function DecisionMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Map<string, number[]>>(new Map());
  const activePushIndicesRef = useRef<Set<number>>(new Set());
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const reducedMotionRef = useRef(false);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    reducedMotionRef.current = motionQuery.matches;

    const updatePointerPush = () => {
      if (reducedMotionRef.current || !pointerRef.current.active || !finePointerQuery.matches) {
        activePushIndicesRef.current.forEach((index) => {
          const dot = dotsRef.current[index];

          if (!dot) {
            return;
          }

          dot.pushX *= 0.86;
          dot.pushY *= 0.86;

          if (Math.abs(dot.pushX) + Math.abs(dot.pushY) < 0.08) {
            dot.pushX = 0;
            dot.pushY = 0;
            activePushIndicesRef.current.delete(index);
          }
        });

        return;
      }

      const nearbyIndices = getNearbyDotIndices(gridRef.current, pointerRef.current);
      const nearbySet = new Set(nearbyIndices);

      nearbyIndices.forEach((index) => {
        const dot = dotsRef.current[index];

        if (!dot) {
          return;
        }

        const dx = dot.x - pointerRef.current.x;
        const dy = dot.y - pointerRef.current.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSquared = POINTER_RADIUS * POINTER_RADIUS;

        if (distanceSquared > radiusSquared || distanceSquared === 0) {
          return;
        }

        const distance = Math.sqrt(distanceSquared);
        const strength = (1 - distance / POINTER_RADIUS) * 38;
        const targetX = (dx / distance) * strength;
        const targetY = (dy / distance) * strength;

        dot.pushX += (targetX - dot.pushX) * 0.16;
        dot.pushY += (targetY - dot.pushY) * 0.16;
        activePushIndicesRef.current.add(index);
      });

      activePushIndicesRef.current.forEach((index) => {
        if (nearbySet.has(index)) {
          return;
        }

        const dot = dotsRef.current[index];

        if (!dot) {
          return;
        }

        dot.pushX *= 0.9;
        dot.pushY *= 0.9;

        if (Math.abs(dot.pushX) + Math.abs(dot.pushY) < 0.08) {
          dot.pushX = 0;
          dot.pushY = 0;
          activePushIndicesRef.current.delete(index);
        }
      });
    };

    const draw = (time = 0) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);
      context.fillStyle = HERO_BACKGROUND;
      context.fillRect(0, 0, width, height);

      updatePointerPush();

      context.globalCompositeOperation = "lighter";

      dotsRef.current.forEach((dot) => {
        const flowTime = time * 0.00022;
        const flowX =
          reducedMotionRef.current
            ? 0
            : (Math.sin(dot.y * 0.006 + flowTime + dot.phase) +
                Math.cos((dot.x + dot.y) * 0.0035 + flowTime * 1.4)) *
              dot.drift *
              19;
        const flowY =
          reducedMotionRef.current
            ? 0
            : (Math.cos(dot.x * 0.005 + flowTime * 1.2 + dot.phase) +
                Math.sin((dot.y - dot.x) * 0.003 + flowTime)) *
              dot.drift *
              16;
        const shimmer = reducedMotionRef.current
          ? 1
          : 0.78 + Math.sin(time * 0.00055 + dot.phase) * 0.16 + Math.cos(dot.x * 0.01 + time * 0.00028) * 0.06;
        const opacity = Math.max(0.12, Math.min(0.92, dot.opacity * shimmer));
        const x = dot.x + flowX + dot.pushX;
        const y = dot.y + flowY + dot.pushY;

        if (dot.glow > 0.72) {
          context.beginPath();
          context.fillStyle = rgba(dot.color, (0.035 + dot.glow * 0.045) * shimmer);
          context.arc(x, y, dot.radius * 5.2, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = rgba(dot.color, opacity);
        context.arc(x, y, dot.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      dotsRef.current = createDots(width, height);
      gridRef.current = buildGrid(dotsRef.current);
      activePushIndicesRef.current.clear();
      draw();
    };

    const animate = (time: number) => {
      if (time - lastFrameTimeRef.current >= FRAME_INTERVAL) {
        draw(time);
        lastFrameTimeRef.current = time;
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const updateMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;
      stopAnimation();

      if (reducedMotionRef.current) {
        pointerRef.current.active = false;
        dotsRef.current.forEach((dot) => {
          dot.pushX = 0;
          dot.pushY = 0;
        });
        activePushIndicesRef.current.clear();
        draw();
      } else {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current || !finePointerQuery.matches) {
        return;
      }

      const rect = canvas.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        pointerRef.current.active = false;
        return;
      }

      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    resize();
    updateMotionPreference();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      motionQuery.removeEventListener("change", updateMotionPreference);
      stopAnimation();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full bg-[#070d18]" />;
}
