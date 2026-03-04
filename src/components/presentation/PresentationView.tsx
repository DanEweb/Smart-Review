"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Pen,
  Highlighter,
  Eraser,
  Trash2,
} from "lucide-react";

interface Slide {
  html: string;
  title: string;
}

interface PresentationViewProps {
  content: string; // HTML string from editor
  onExit: () => void;
}

type AnnotationTool = "pen" | "highlighter" | "eraser" | null;

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  opacity: number;
}

const PEN_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#000000",
  "#ffffff",
];

function parseSlides(html: string): Slide[] {
  if (typeof window === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const children = Array.from(doc.body.children);

  if (children.length === 0) {
    return [{ html: "<p>Empty document</p>", title: "Untitled" }];
  }

  const slides: Slide[] = [];
  let currentSlide: Element[] = [];
  let currentTitle = "Untitled";

  for (const child of children) {
    if (child.tagName === "H1") {
      // Start a new slide
      if (currentSlide.length > 0) {
        slides.push({
          html: currentSlide.map((el) => el.outerHTML).join(""),
          title: currentTitle,
        });
      }
      currentSlide = [child];
      currentTitle = child.textContent || "Untitled";
    } else {
      currentSlide.push(child);
    }
  }

  // Push last slide
  if (currentSlide.length > 0) {
    slides.push({
      html: currentSlide.map((el) => el.outerHTML).join(""),
      title: currentTitle,
    });
  }

  return slides.length > 0
    ? slides
    : [{ html, title: "Untitled" }];
}

export function PresentationView({ content, onExit }: PresentationViewProps) {
  const { t } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTool, setActiveTool] = useState<AnnotationTool>(null);
  const [penColor, setPenColor] = useState("#ef4444");
  const [showControls, setShowControls] = useState(true);
  const [strokes, setStrokes] = useState<Map<number, Stroke[]>>(new Map());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const slides = parseSlides(content);
  const totalSlides = slides.length;

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onExit();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          goPrev();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit, goNext, goPrev]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = setTimeout(() => {
        if (!activeTool) setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [activeTool]);

  // Redraw canvas when slide changes
  useEffect(() => {
    redrawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, strokes]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const slideStrokes = strokes.get(currentSlide);
    if (!slideStrokes) return;

    for (const stroke of slideStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.globalAlpha = stroke.opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!activeTool) return;

    isDrawingRef.current = true;

    if (activeTool === "eraser") {
      // Erase strokes near the point
      const slideStrokes = strokes.get(currentSlide) || [];
      const filtered = slideStrokes.filter((stroke) => {
        return !stroke.points.some(
          (pt) =>
            Math.abs(pt.x - e.clientX) < 20 && Math.abs(pt.y - e.clientY) < 20
        );
      });
      setStrokes((prev) => {
        const next = new Map(prev);
        next.set(currentSlide, filtered);
        return next;
      });
      return;
    }

    currentStrokeRef.current = {
      points: [{ x: e.clientX, y: e.clientY }],
      color: penColor,
      width: activeTool === "highlighter" ? 20 : 3,
      opacity: activeTool === "highlighter" ? 0.4 : 1,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    if (activeTool === "eraser") {
      const slideStrokes = strokes.get(currentSlide) || [];
      const filtered = slideStrokes.filter((stroke) => {
        return !stroke.points.some(
          (pt) =>
            Math.abs(pt.x - e.clientX) < 20 && Math.abs(pt.y - e.clientY) < 20
        );
      });
      setStrokes((prev) => {
        const next = new Map(prev);
        next.set(currentSlide, filtered);
        return next;
      });
      return;
    }

    currentStrokeRef.current.points.push({ x: e.clientX, y: e.clientY });

    // Live draw
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !currentStrokeRef.current) return;

    const pts = currentStrokeRef.current.points;
    if (pts.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = currentStrokeRef.current.color;
    ctx.lineWidth = currentStrokeRef.current.width;
    ctx.globalAlpha = currentStrokeRef.current.opacity;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current && activeTool !== "eraser") {
      setStrokes((prev) => {
        const next = new Map(prev);
        const existing = next.get(currentSlide) || [];
        next.set(currentSlide, [...existing, currentStrokeRef.current!]);
        return next;
      });
      currentStrokeRef.current = null;
    }
  };

  const clearAnnotations = () => {
    setStrokes((prev) => {
      const next = new Map(prev);
      next.delete(currentSlide);
      return next;
    });
    redrawCanvas();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <div
          className="prose prose-invert prose-lg sm:prose-xl max-w-4xl w-full px-12 py-8"
          dangerouslySetInnerHTML={{
            __html: slides[currentSlide]?.html || "",
          }}
        />

        {/* Canvas overlay for annotations */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 ${activeTool ? "cursor-crosshair" : "pointer-events-none"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      {/* Bottom controls */}
      <div
        className={`flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Left: Annotation tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool(activeTool === "pen" ? null : "pen")}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === "pen"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            title={t.presentation.pen}
          >
            <Pen className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setActiveTool(activeTool === "highlighter" ? null : "highlighter")
            }
            className={`p-2 rounded-lg transition-colors ${
              activeTool === "highlighter"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            title={t.presentation.highlighter}
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setActiveTool(activeTool === "eraser" ? null : "eraser")
            }
            className={`p-2 rounded-lg transition-colors ${
              activeTool === "eraser"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            title={t.presentation.eraser}
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Color picker */}
          {(activeTool === "pen" || activeTool === "highlighter") && (
            <div className="flex items-center gap-1 ml-2 border-l border-white/20 pl-2">
              {PEN_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPenColor(color)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    penColor === color
                      ? "border-white scale-125"
                      : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          <button
            onClick={clearAnnotations}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 ml-1"
            title={t.presentation.clearAll}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            title={t.presentation.prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-white/80 text-sm font-mono min-w-[60px] text-center">
            {currentSlide + 1} / {totalSlides}
          </span>

          <button
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            title={t.presentation.nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Exit */}
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">
            {t.presentation.pressEscToExit}
          </span>
          <button
            onClick={onExit}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10"
            title={t.presentation.exitPresentation}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
