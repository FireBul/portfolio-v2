import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';

export const MouseHeatmap: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const positionsRef = useRef<{ x: number; y: number; w: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTrackRef = useRef(0);

  // Track mouse movement (throttled 60ms)
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTrackRef.current < 60) return;
      lastTrackRef.current = now;
      positionsRef.current.push({
        x: e.pageX,
        y: e.pageY,
        w: 1,
      });
      if (positionsRef.current.length > 3000) positionsRef.current.shift();
      setPointCount(positionsRef.current.length);
    };

    const handleClick = (e: MouseEvent) => {
      positionsRef.current.push({
        x: e.pageX,
        y: e.pageY,
        w: 4,
      });
      if (positionsRef.current.length > 3500) positionsRef.current.shift();
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Build color palette (blue → cyan → green → yellow → red)
  const buildPalette = useCallback(() => {
    const palette: [number, number, number][] = [];
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let r: number, g: number, b: number;
      if (t < 0.25) {
        const s = t / 0.25;
        r = 0; g = Math.round(s * 255); b = 255;
      } else if (t < 0.5) {
        const s = (t - 0.25) / 0.25;
        r = 0; g = 255; b = Math.round((1 - s) * 255);
      } else if (t < 0.75) {
        const s = (t - 0.5) / 0.25;
        r = Math.round(s * 255); g = 255; b = 0;
      } else {
        const s = (t - 0.75) / 0.25;
        r = 255; g = Math.round((1 - s) * 255); b = 0;
      }
      palette.push([r, g, b]);
    }
    return palette;
  }, []);

  // Draw heatmap
  const drawHeatmap = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'heatmap-canvas';
    canvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:8500;opacity:.55;mix-blend-mode:screen;';
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw intensity
    const shadow = document.createElement('canvas');
    shadow.width = canvas.width;
    shadow.height = canvas.height;
    const sctx = shadow.getContext('2d');
    if (!sctx) return;

    positionsRef.current.forEach((p) => {
      const radius = p.w > 1 ? 45 : 30;
      const alpha = p.w > 1 ? 0.35 : 0.06;
      const g = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      g.addColorStop(0, `rgba(0,0,0,${alpha})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = g;
      sctx.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);
    });

    // Colorize
    const imageData = sctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const palette = buildPalette();

    for (let i = 0; i < pixels.length; i += 4) {
      const intensity = pixels[i + 3];
      if (intensity < 3) {
        pixels[i + 3] = 0;
        continue;
      }
      const idx = Math.min(intensity, 255);
      pixels[i] = palette[idx][0];
      pixels[i + 1] = palette[idx][1];
      pixels[i + 2] = palette[idx][2];
      pixels[i + 3] = Math.min(intensity * 1.8, 220);
    }

    ctx.putImageData(imageData, 0, 0);
  }, [buildPalette]);

  // Remove heatmap
  const removeHeatmap = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }
  }, []);

  const toggle = () => {
    if (isActive) {
      removeHeatmap();
    } else {
      drawHeatmap();
    }
    setIsActive(!isActive);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => removeHeatmap();
  }, [removeHeatmap]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="fixed bottom-5 left-[270px] z-[9050] flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all
          bg-black/80 backdrop-blur-xl text-zinc-300 border border-white/10 hover:bg-black/90 hover:text-white shadow-lg"
      >
        <span
          className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`}
        />
        <Flame className="w-3.5 h-3.5" />
        {isActive ? '히트맵 OFF' : '히트맵'}
      </button>

      {/* Top Banner */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[8600] bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2.5 px-4 text-sm"
          >
            <span className="font-semibold">🔥 히트맵 ON</span> — 마우스 이동과 클릭 위치를
            시각화합니다.{' '}
            <span className="text-white/70">
              {pointCount.toLocaleString()}개 데이터 포인트 · UX 리서치 역량 라이브 데모
            </span>
            <button
              onClick={() => {
                removeHeatmap();
                setIsActive(false);
              }}
              className="ml-3 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4 inline" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
