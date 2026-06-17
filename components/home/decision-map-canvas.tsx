"use client";

import { useEffect, useRef } from "react";

type Dot = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  color: string;
  glow: number;
  phase: number;
  driftRange: number;
  driftSpeed: number;
  responsiveness: number;
  textOpacity: number;
};

type PointerState = {
  x: number;
  y: number;
  movementX: number;
  movementY: number;
  active: boolean;
};

type RippleWake = {
  x: number;
  y: number;
  movementX: number;
  movementY: number;
  age: number;
  strength: number;
};

const HERO_BLUE = "#3C5CCF";
const HERO_RED = "#D72638";
const HERO_BACKGROUND = "#070d18";
const CELL_SIZE = 120;
const DESKTOP_DOT_CAP = 9800;
const MOBILE_DOT_CAP = 3400;
const FRAME_INTERVAL = 1000 / 50;
const POINTER_RADIUS = 220;
const RIPPLE_RING_WIDTH = 92;
const MAX_RIPPLE_WAKES = 6;
const GLOW_THRESHOLD = 0.86;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  const progress = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

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
    return Math.min(MOBILE_DOT_CAP, Math.max(3000, Math.floor(area / 88)));
  }

  return Math.min(DESKTOP_DOT_CAP, Math.max(9000, Math.floor(area / 125)));
}

function getClusterColor(x: number, y: number, width: number, height: number) {
  const region =
    Math.sin((x / width) * Math.PI * 3.15 + (y / height) * Math.PI * 0.9) +
    Math.cos((y / height) * Math.PI * 3.45) +
    Math.sin(((x - y) / Math.max(width, height)) * Math.PI * 2.4);

  return region > 0.2 ? HERO_RED : HERO_BLUE;
}

function getTextAreaOpacity(x: number, y: number, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height * 0.48;
  const radiusX = width < 640 ? width * 0.42 : Math.min(width * 0.3, 450);
  const radiusY = width < 640 ? height * 0.23 : Math.min(height * 0.24, 240);
  const normalizedX = (x - centerX) / radiusX;
  const normalizedY = (y - centerY) / radiusY;
  const normalizedDistance = Math.hypot(normalizedX, normalizedY);
  const textAreaCalm = 1 - smoothstep(0.62, 1.16, normalizedDistance);

  return 1 - textAreaCalm * 0.48;
}

function createDotPosition(width: number, height: number) {
  const x = Math.random() * width;
  const y = Math.random() * height;

  return {
    x,
    y,
    textOpacity: getTextAreaOpacity(x, y, width, height)
  };
}

function createDots(width: number, height: number): Dot[] {
  return Array.from({ length: getDotCount(width, height) }, () => {
    const { x, y, textOpacity } = createDotPosition(width, height);
    const brightness = Math.random();
    const isLargeParticle = brightness > 0.82;
    const radius = isLargeParticle ? Math.random() * 2.5 + 2.8 : Math.random() * 1.55 + 1.55;

    return {
      baseX: x,
      baseY: y,
      x,
      y,
      velocityX: 0,
      velocityY: 0,
      radius,
      color: getClusterColor(x, y, width, height),
      glow: brightness,
      phase: Math.random() * Math.PI * 2,
      driftRange: Math.random() * 18 + 12,
      driftSpeed: Math.random() * 0.42 + 0.28,
      responsiveness: Math.random() * 0.55 + 0.65,
      textOpacity
    };
  });
}

function buildGrid(dots: Dot[]) {
  const grid = new Map<string, number[]>();

  dots.forEach((dot, index) => {
    const key = `${Math.floor(dot.baseX / CELL_SIZE)}:${Math.floor(dot.baseY / CELL_SIZE)}`;
    const bucket = grid.get(key);

    if (bucket) {
      bucket.push(index);
    } else {
      grid.set(key, [index]);
    }
  });

  return grid;
}

function getNearbyDotIndices(grid: Map<string, number[]>, x: number, y: number, radius: number) {
  const indices: number[] = [];
  const minX = Math.floor((x - radius) / CELL_SIZE);
  const maxX = Math.floor((x + radius) / CELL_SIZE);
  const minY = Math.floor((y - radius) / CELL_SIZE);
  const maxY = Math.floor((y + radius) / CELL_SIZE);

  for (let gridX = minX; gridX <= maxX; gridX += 1) {
    for (let gridY = minY; gridY <= maxY; gridY += 1) {
      const bucket = grid.get(`${gridX}:${gridY}`);

      if (bucket) {
        indices.push(...bucket);
      }
    }
  }

  return indices;
}

function getFlowTarget(dot: Dot, time: number, reducedMotion: boolean) {
  if (reducedMotion) {
    return { x: dot.baseX, y: dot.baseY };
  }

  const flowTime = time * 0.001 * dot.driftSpeed;
  const currentX =
    Math.sin(dot.baseY * 0.006 + flowTime + dot.phase) +
    Math.cos((dot.baseX + dot.baseY) * 0.0034 - flowTime * 1.28);
  const currentY =
    Math.cos(dot.baseX * 0.005 + flowTime * 1.15 + dot.phase) +
    Math.sin((dot.baseY - dot.baseX) * 0.003 + flowTime * 0.92);

  return {
    x: dot.baseX + currentX * dot.driftRange,
    y: dot.baseY + currentY * dot.driftRange * 0.86
  };
}

function canUseCursorInteraction(canvas: HTMLCanvasElement, finePointerQuery: MediaQueryList) {
  return finePointerQuery.matches && canvas.clientWidth >= 640;
}

export function DecisionMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Map<string, number[]>>(new Map());
  const rippleWakesRef = useRef<RippleWake[]>([]);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, movementX: 0, movementY: 0, active: false });
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

    const resetCursorState = () => {
      pointerRef.current.active = false;
      pointerRef.current.movementX = 0;
      pointerRef.current.movementY = 0;
      rippleWakesRef.current = [];
    };

    const applyCursorForces = (frameScale: number) => {
      if (
        reducedMotionRef.current ||
        !pointerRef.current.active ||
        !canUseCursorInteraction(canvas, finePointerQuery)
      ) {
        return;
      }

      const nearbyIndices = getNearbyDotIndices(gridRef.current, pointerRef.current.x, pointerRef.current.y, POINTER_RADIUS + 48);
      const pointerDistance = Math.hypot(pointerRef.current.movementX, pointerRef.current.movementY);
      const pointerSpeed = Math.min(pointerDistance, 64);
      const movementX = pointerDistance > 0 ? pointerRef.current.movementX / pointerDistance : 0;
      const movementY = pointerDistance > 0 ? pointerRef.current.movementY / pointerDistance : 0;

      if (pointerDistance > 2.5) {
        rippleWakesRef.current = [
          {
            x: pointerRef.current.x,
            y: pointerRef.current.y,
            movementX,
            movementY,
            age: 0,
            strength: clamp(pointerSpeed / 44, 0.42, 1)
          },
          ...rippleWakesRef.current
        ].slice(0, MAX_RIPPLE_WAKES);
      }

      nearbyIndices.forEach((index) => {
        const dot = dotsRef.current[index];
        const dx = dot.x - pointerRef.current.x;
        const dy = dot.y - pointerRef.current.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSquared = POINTER_RADIUS * POINTER_RADIUS;

        if (distanceSquared === 0 || distanceSquared > radiusSquared) {
          return;
        }

        const distance = Math.sqrt(distanceSquared);
        const proximity = 1 - distance / POINTER_RADIUS;
        const eased = proximity * proximity * (3 - 2 * proximity);
        const push = eased * dot.responsiveness * 8.6 * frameScale;
        const wake = proximity * pointerSpeed * dot.responsiveness * 0.22 * frameScale;
        const normalX = dx / distance;
        const normalY = dy / distance;

        dot.velocityX += normalX * push + movementX * wake;
        dot.velocityY += normalY * push + movementY * wake;
      });

      pointerRef.current.movementX = 0;
      pointerRef.current.movementY = 0;
    };

    const applyRippleWakes = (frameScale: number) => {
      if (
        reducedMotionRef.current ||
        !canUseCursorInteraction(canvas, finePointerQuery) ||
        rippleWakesRef.current.length === 0
      ) {
        return;
      }

      const activeWakes: RippleWake[] = [];

      rippleWakesRef.current.forEach((wake) => {
        const nextAge = wake.age + 0.038 * frameScale;

        if (nextAge >= 1) {
          return;
        }

        const radius = 28 + nextAge * 360;
        const nearbyIndices = getNearbyDotIndices(gridRef.current, wake.x, wake.y, radius + RIPPLE_RING_WIDTH);

        wake.age = nextAge;
        activeWakes.push(wake);

        nearbyIndices.forEach((index) => {
          const dot = dotsRef.current[index];
          const dx = dot.x - wake.x;
          const dy = dot.y - wake.y;
          const distance = Math.hypot(dx, dy);
          const ringDistance = Math.abs(distance - radius);

          if (distance === 0 || ringDistance > RIPPLE_RING_WIDTH) {
            return;
          }

          const ringPower =
            (1 - ringDistance / RIPPLE_RING_WIDTH) *
            (1 - nextAge) *
            wake.strength *
            dot.responsiveness *
            frameScale;
          const normalX = dx / distance;
          const normalY = dy / distance;

          dot.velocityX += (normalX * 3.4 + wake.movementX * 1.35) * ringPower;
          dot.velocityY += (normalY * 3.4 + wake.movementY * 1.35) * ringPower;
        });
      });

      rippleWakesRef.current = activeWakes;
    };

    const updateDots = (time: number, frameScale: number) => {
      if (!reducedMotionRef.current) {
        applyCursorForces(frameScale);
        applyRippleWakes(frameScale);
      }

      const spring = 0.024 * frameScale;
      const damping = Math.pow(0.89, frameScale);

      dotsRef.current.forEach((dot) => {
        const target = getFlowTarget(dot, time, reducedMotionRef.current);

        dot.velocityX += (target.x - dot.x) * spring * dot.responsiveness;
        dot.velocityY += (target.y - dot.y) * spring * dot.responsiveness;
        dot.velocityX *= damping;
        dot.velocityY *= damping;
        dot.x += dot.velocityX * frameScale;
        dot.y += dot.velocityY * frameScale;
      });
    };

    const drawDots = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const bluePath = new Path2D();
      const redPath = new Path2D();
      const blueSoftPath = new Path2D();
      const redSoftPath = new Path2D();
      const blueCalmPath = new Path2D();
      const redCalmPath = new Path2D();
      const blueGlowPath = new Path2D();
      const redGlowPath = new Path2D();

      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);
      context.fillStyle = HERO_BACKGROUND;
      context.fillRect(0, 0, width, height);

      dotsRef.current.forEach((dot) => {
        const path =
          dot.color === HERO_BLUE
            ? dot.textOpacity < 0.68
              ? blueCalmPath
              : dot.textOpacity < 0.9
                ? blueSoftPath
                : bluePath
            : dot.textOpacity < 0.68
              ? redCalmPath
              : dot.textOpacity < 0.9
                ? redSoftPath
                : redPath;
        const radius = dot.radius;

        path.moveTo(dot.x + radius, dot.y);
        path.arc(dot.x, dot.y, radius, 0, Math.PI * 2);

        const motionEnergy = Math.abs(dot.velocityX) + Math.abs(dot.velocityY);
        const shouldGlow =
          dot.textOpacity > 0.78 && (dot.glow > GLOW_THRESHOLD || (motionEnergy > 2.4 && dot.glow > 0.58));

        if (shouldGlow) {
          const glowPath = dot.color === HERO_BLUE ? blueGlowPath : redGlowPath;
          const glowRadius = radius * (1.8 + dot.glow * 0.7);

          glowPath.moveTo(dot.x + glowRadius, dot.y);
          glowPath.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
        }
      });

      context.globalCompositeOperation = "lighter";
      context.fillStyle = rgba(HERO_BLUE, 0.58);
      context.fill(bluePath);
      context.fillStyle = rgba(HERO_BLUE, 0.38);
      context.fill(blueSoftPath);
      context.fillStyle = rgba(HERO_BLUE, 0.22);
      context.fill(blueCalmPath);
      context.fillStyle = rgba(HERO_RED, 0.56);
      context.fill(redPath);
      context.fillStyle = rgba(HERO_RED, 0.36);
      context.fill(redSoftPath);
      context.fillStyle = rgba(HERO_RED, 0.2);
      context.fill(redCalmPath);

      context.shadowBlur = 12;
      context.shadowColor = rgba(HERO_BLUE, 0.48);
      context.fillStyle = rgba(HERO_BLUE, 0.2);
      context.fill(blueGlowPath);
      context.shadowColor = rgba(HERO_RED, 0.48);
      context.fillStyle = rgba(HERO_RED, 0.2);
      context.fill(redGlowPath);
      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";
    };

    const drawFrame = (time = 0) => {
      const elapsed = lastFrameTimeRef.current ? time - lastFrameTimeRef.current : FRAME_INTERVAL;

      if (!reducedMotionRef.current && elapsed < FRAME_INTERVAL) {
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);
        return;
      }

      const frameScale = clamp(elapsed / (1000 / 60), 0.7, 2.1);
      lastFrameTimeRef.current = time;

      updateDots(time, frameScale);
      drawDots();

      if (!reducedMotionRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);
      }
    };

    const stopAnimation = () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const resetDotsToBase = () => {
      dotsRef.current.forEach((dot) => {
        dot.x = dot.baseX;
        dot.y = dot.baseY;
        dot.velocityX = 0;
        dot.velocityY = 0;
      });
    };

    const resize = () => {
      stopAnimation();

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      dotsRef.current = createDots(width, height);
      gridRef.current = buildGrid(dotsRef.current);
      resetCursorState();
      lastFrameTimeRef.current = 0;
      drawFrame();
    };

    const updateMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;
      stopAnimation();
      resetCursorState();

      if (reducedMotionRef.current) {
        resetDotsToBase();
        drawFrame();
      } else {
        lastFrameTimeRef.current = 0;
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current || !canUseCursorInteraction(canvas, finePointerQuery)) {
        return;
      }

      const rect = canvas.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        resetCursorState();
        return;
      }

      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;
      const movementX = pointerRef.current.active ? nextX - pointerRef.current.x : 0;
      const movementY = pointerRef.current.active ? nextY - pointerRef.current.y : 0;

      pointerRef.current = {
        x: nextX,
        y: nextY,
        movementX,
        movementY,
        active: true
      };
    };

    resize();
    updateMotionPreference();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", resetCursorState);
    window.addEventListener("blur", resetCursorState);
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetCursorState);
      window.removeEventListener("blur", resetCursorState);
      motionQuery.removeEventListener("change", updateMotionPreference);
      stopAnimation();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full bg-[#070d18]" />;
}
