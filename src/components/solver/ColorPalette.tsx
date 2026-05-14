import React from 'react';
import { RUBIKS_CUBE_COLORS } from '../../types/cube';

interface ColorPaletteProps {
  selectedColor: number;
  onSelectColor: (color: number) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
  const colors = [
    RUBIKS_CUBE_COLORS.white,
    RUBIKS_CUBE_COLORS.yellow,
    RUBIKS_CUBE_COLORS.blue,
    RUBIKS_CUBE_COLORS.green,
    RUBIKS_CUBE_COLORS.red,
    RUBIKS_CUBE_COLORS.orange,
  ];

  return (
    <div className="flex gap-4">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className={`
            w-10 h-10 aspect-square rounded-full border-2 flex-shrink-0 transition-transform hover:scale-110 active:scale-95
            ${selectedColor === color ? 'border-white scale-110 shadow-lg' : 'border-white/20'}
          `}
          style={{ backgroundColor: `#${color.toString(16).padStart(6, '0')}` }}
          title={`#${color.toString(16).padStart(6, '0')}`}
        />
      ))}
    </div>
  );
};
