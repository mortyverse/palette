'use client';

import React from 'react';

const PRESET_COLORS = [
  '#ff0000', // Red
  '#ff6600', // Orange
  '#ffcc00', // Yellow
  '#00cc00', // Green
  '#0066ff', // Blue
  '#9933ff', // Purple
  '#ff66cc', // Pink
  '#000000', // Black
  '#ffffff', // White
];

const BRUSH_SIZES = [2, 4, 8, 12, 16];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">색상</label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform ${
              selectedColor === color
                ? 'border-blue-500 scale-110'
                : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`색상 선택: ${color}`}
          />
        ))}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          aria-label="사용자 정의 색상 선택"
        />
      </div>
    </div>
  );
}

interface BrushControlsProps {
  brushSize: number;
  onSizeChange: (size: number) => void;
}

export function BrushControls({ brushSize, onSizeChange }: BrushControlsProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        브러시 크기: {brushSize}px
      </label>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange(size)}
              className={`flex items-center justify-center w-10 h-10 rounded border transition-colors ${
                brushSize === size
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className="rounded-full bg-gray-800"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="24"
          value={brushSize}
          onChange={(e) => onSizeChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}

interface CanvasToolbarProps {
  brushColor: string;
  brushSize: number;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
}

export function CanvasToolbar({
  brushColor,
  brushSize,
  onColorChange,
  onSizeChange,
}: CanvasToolbarProps) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
      <ColorPicker selectedColor={brushColor} onColorChange={onColorChange} />
      <BrushControls brushSize={brushSize} onSizeChange={onSizeChange} />
    </div>
  );
}
