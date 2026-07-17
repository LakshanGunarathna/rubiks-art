import React, { useState } from 'react';
import type { DragEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  onImageFile: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageFile }) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-xl mx-auto flex flex-col gap-6"
    >
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`rounded-3xl p-8 backdrop-blur-md border transition-all duration-350 shadow-xl flex flex-col items-center justify-center text-center gap-6 relative ${
          isDragActive 
            ? 'border-blue-500 bg-blue-500/5 scale-[1.02] ring-4 ring-blue-500/10' 
            : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-slate-300 dark:hover:border-slate-800'
        }`}
      >
        <label 
          htmlFor="mosaic-upload-input" 
          className="cursor-pointer w-16 h-16 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/20 hover:border-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Click to select file"
        >
          <Upload className="w-8 h-8" />
        </label>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold font-heading text-[var(--text-primary)]">Upload Your Image</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
            Drag and drop your photo here, or click to browse. Works best with high-contrast close-ups.
          </p>
        </div>

        <div className="w-full mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="mosaic-upload-input"
          />
          <label
            htmlFor="mosaic-upload-input"
            className="w-full flex items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 rounded-2xl py-4 px-6 cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-500/5 transition-all text-base font-bold text-[var(--text-primary)]"
          >
            <Upload className="w-5 h-5 text-blue-500" />
            Choose a File
          </label>
        </div>
      </div>

      <div className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-md flex flex-col gap-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Pro Tip for Better Mosaics
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Mosaics are built from pixels matching the 6 Rubik's Cube colors (White, Yellow, Orange, Red, Green, Blue). Images with simple backgrounds, close-up subjects, and dramatic lighting translate beautifully into puzzle art.
        </p>
      </div>
    </motion.div>
  );
};
