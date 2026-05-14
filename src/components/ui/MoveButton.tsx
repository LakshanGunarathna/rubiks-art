import React from 'react';

interface MoveButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const MoveButton: React.FC<MoveButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-bold transition-all
        bg-opacity-10 backdrop-blur-md border
        hover:bg-opacity-20 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        border-white border-opacity-20 text-white
      `}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      {label}
    </button>
  );
};
