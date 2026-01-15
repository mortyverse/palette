'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface CanvasEditorProps {
  backgroundImageUrl: string;
  onSave?: (dataUrl: string) => void;
  width?: number;
  height?: number;
  brushColor?: string;
  brushSize?: number;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

export function CanvasEditor({
  backgroundImageUrl,
  onSave,
  width = 800,
  height = 600,
  brushColor = '#ff0000',
  brushSize = 4,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [undoneStrokes, setUndoneStrokes] = useState<Stroke[]>([]);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [actualSize, setActualSize] = useState({ width, height });

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setBgImage(img);
      // Adjust canvas size to maintain aspect ratio
      const aspectRatio = img.width / img.height;
      const containerWidth = containerRef.current?.clientWidth || width;
      const newWidth = Math.min(containerWidth, width);
      const newHeight = newWidth / aspectRatio;
      setActualSize({ width: newWidth, height: newHeight });
    };
    img.src = backgroundImageUrl;
  }, [backgroundImageUrl, width, height]);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !bgImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Draw all strokes
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [bgImage, strokes, currentStroke]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (point: Point) => {
    setIsDrawing(true);
    setCurrentStroke({
      points: [point],
      color: brushColor,
      size: brushSize,
    });
    setUndoneStrokes([]);
  };

  const draw = (point: Point) => {
    if (!isDrawing || !currentStroke) return;
    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, point],
    });
  };

  const stopDrawing = () => {
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes([...strokes, currentStroke]);
    }
    setCurrentStroke(null);
    setIsDrawing(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    startDrawing(getMousePos(e));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    draw(getMousePos(e));
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(getTouchPos(e));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(getTouchPos(e));
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  const undo = () => {
    if (strokes.length === 0) return;
    const lastStroke = strokes[strokes.length - 1];
    setUndoneStrokes([...undoneStrokes, lastStroke]);
    setStrokes(strokes.slice(0, -1));
  };

  const redo = () => {
    if (undoneStrokes.length === 0) return;
    const lastUndone = undoneStrokes[undoneStrokes.length - 1];
    setStrokes([...strokes, lastUndone]);
    setUndoneStrokes(undoneStrokes.slice(0, -1));
  };

  const clear = () => {
    setUndoneStrokes([...undoneStrokes, ...strokes]);
    setStrokes([]);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSave) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={actualSize.width}
        height={actualSize.height}
        className="w-full border border-gray-300 rounded-lg cursor-crosshair touch-none"
        style={{ maxWidth: '100%', height: 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <div className="flex gap-2 mt-4">
        <button
          onClick={undo}
          disabled={strokes.length === 0}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          실행취소
        </button>
        <button
          onClick={redo}
          disabled={undoneStrokes.length === 0}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          다시실행
        </button>
        <button
          onClick={clear}
          disabled={strokes.length === 0}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          전체지우기
        </button>
        {onSave && (
          <button
            onClick={save}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
            type="button"
          >
            저장
          </button>
        )}
      </div>
    </div>
  );
}

