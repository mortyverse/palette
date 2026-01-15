'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasToolbar } from './CanvasControls';
import { Button } from '@/components/ui/Button';

interface MentorWorkspaceProps {
  originalImageUrl: string;
  studentQuestion: string;
  onSubmit: (feedbackImageUrl: string, comment: string) => Promise<void>;
  isSubmitting?: boolean;
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

export function MentorWorkspace({
  originalImageUrl,
  studentQuestion,
  onSubmit,
  isSubmitting = false,
}: MentorWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(4);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [undoneStrokes, setUndoneStrokes] = useState<Stroke[]>([]);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setBgImage(img);
      const containerWidth = containerRef.current?.clientWidth || 800;
      const aspectRatio = img.width / img.height;
      const width = Math.min(containerWidth, 800);
      const height = width / aspectRatio;
      setCanvasSize({ width, height });
    };
    img.src = originalImageUrl;
  }, [originalImageUrl]);

  // Redraw canvas whenever strokes or bg changes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !bgImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

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

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (point: Point) => {
    setIsDrawing(true);
    setCurrentStroke({ points: [point], color: brushColor, size: brushSize });
    setUndoneStrokes([]);
  };

  const draw = (point: Point) => {
    if (!isDrawing || !currentStroke) return;
    setCurrentStroke({ ...currentStroke, points: [...currentStroke.points, point] });
  };

  const stopDrawing = () => {
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes([...strokes, currentStroke]);
    }
    setCurrentStroke(null);
    setIsDrawing(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => startDrawing(getPos(e));
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => draw(getPos(e));
  const handleMouseUp = () => stopDrawing();
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => { e.preventDefault(); startDrawing(getPos(e)); };
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => { e.preventDefault(); draw(getPos(e)); };
  const handleTouchEnd = () => stopDrawing();

  const undo = () => {
    if (strokes.length === 0) return;
    setUndoneStrokes([...undoneStrokes, strokes[strokes.length - 1]]);
    setStrokes(strokes.slice(0, -1));
  };

  const redo = () => {
    if (undoneStrokes.length === 0) return;
    setStrokes([...strokes, undoneStrokes[undoneStrokes.length - 1]]);
    setUndoneStrokes(undoneStrokes.slice(0, -1));
  };

  const clearAll = () => {
    setUndoneStrokes([...undoneStrokes, ...strokes]);
    setStrokes([]);
  };

  const handleSubmit = async () => {
    setError('');

    if (comment.length < 10) {
      setError('피드백 코멘트는 최소 10자 이상이어야 합니다.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setError('캔버스를 불러올 수 없습니다.');
      return;
    }

    const feedbackImageUrl = canvas.toDataURL('image/png');

    try {
      await onSubmit(feedbackImageUrl, comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : '피드백 제출에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Question */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">학생 질문</h3>
        <p className="text-blue-900">{studentQuestion}</p>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="space-y-4">
        <h3 className="font-semibold">이미지에 그려서 피드백하기</h3>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full border border-gray-300 rounded-lg cursor-crosshair touch-none bg-gray-100"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Canvas Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={undo}
            disabled={strokes.length === 0}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            실행취소
          </button>
          <button
            onClick={redo}
            disabled={undoneStrokes.length === 0}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            다시실행
          </button>
          <button
            onClick={clearAll}
            disabled={strokes.length === 0}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            전체지우기
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <CanvasToolbar
        brushColor={brushColor}
        brushSize={brushSize}
        onColorChange={setBrushColor}
        onSizeChange={setBrushSize}
      />

      {/* Comment */}
      <div className="space-y-2">
        <label className="block font-semibold">피드백 코멘트 *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="학생에게 전달할 피드백을 작성해주세요. (최소 10자)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          disabled={isSubmitting}
        />
        <div className="flex justify-end text-xs text-gray-500">
          {comment.length}/500
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || comment.length < 10}
        variant="primary"
        className="w-full"
      >
        {isSubmitting ? '제출 중...' : '피드백 제출하기'}
      </Button>
    </div>
  );
}
