import React, { useState } from 'react';
import type { DragEvent } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, ShieldCheck, Grid3x3, FileText, Sliders, ArrowRight, Image as ImageIcon, Cpu, Palette } from 'lucide-react';

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
      className="w-full max-w-4xl mx-auto flex flex-col gap-10 text-left"
    >
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`rounded-3xl p-8 backdrop-blur-md border transition-all duration-350 shadow-xl flex flex-col items-center justify-center text-center gap-6 relative ${isDragActive
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
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Drag and drop your photo here, or click to browse. Works best with high-contrast portraits, logos, and close-up photos.
          </p>
        </div>

        <div className="w-full max-w-md mt-2 flex flex-col items-center gap-3">
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

          {/* Privacy & Security Guarantee Badge */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Secure & Private — Images are processed locally in your browser & NEVER saved to any server.</span>
          </div>
        </div>
      </div>

      {/* Before & After Visual Conversion Demonstration */}
      <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              How Image to Mosaic Conversion Works
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Transforming continuous-tone photos into Rubik's Cube pixel art</p>
          </div>
        </div>

        {/* Visual Before & After Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Before: Original Photo Card */}
          <div className="p-4 rounded-2xl border border-[var(--glass-border)] bg-slate-500/5 flex flex-col items-center gap-3 text-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              1. Original Photo Input
            </span>
            <div className="w-full aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner border border-slate-300 dark:border-slate-700">
              <img
                src="public/mosaic-before.png"
                alt="Original Photo Input Preview"
                className="w-full h-full object-cover z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                <ImageIcon className="w-10 h-10 text-slate-400 mb-1 opacity-60" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Original Photo Placeholder</span>
              </div>
            </div>
          </div>

          {/* After: Rubik's Mosaic Card */}
          <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col items-center gap-3 text-center relative">
            <div className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 text-white items-center justify-center shadow-lg z-10">
              <ArrowRight className="w-4 h-4" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              2. Rubik's Cube Pixel Art
            </span>
            <div className="w-full aspect-[4/3] rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden shadow-inner border border-blue-500/30">
              <img
                src="public/mosaic-after.png"
                alt="Rubik's Cube Mosaic Art Preview"
                className="w-full h-full object-cover z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                <Sparkles className="w-10 h-10 text-blue-400 mb-1 opacity-70" />
                <span className="text-xs font-semibold text-blue-300">Mosaic Output Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works - 4 Step Process */}
      <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              4 Easy Steps to Create Your Mosaic
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>From image selection to physical cube assembly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Image</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Choose any photo from your phone or desktop. Images are kept 100% private in your browser.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Set Dimensions</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Adjust grid size (e.g. 20x30 cubes) and pick your cube type (2x2, 3x3, 4x4, 5x5).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Choose Style</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Compare 5 different dithering and color matching variations to pick your favorite look.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">4</div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Build & Export</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Download printable PDF guides, sticker count checklists, and layer-by-layer instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Mosaic Generator Feature Capabilities */}
      <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Comprehensive Mosaic Generator Features
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>In-depth breakdown of our interactive creation tools and processing engines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center gap-2.5 text-blue-500 font-bold text-base">
              <Palette className="w-5 h-5 shrink-0" />
              <h4 style={{ color: 'var(--text-primary)' }}>Perceptual Redmean Color Matching</h4>
            </div>
            <p className="text-xs leading-relaxed">
              Standard RGB color matching often fails on skin tones. Our studio uses the <strong>Redmean color distance formula</strong>, weighting color differences based on human eye sensitivity across Red, Green, and Blue spectrums. This ensures natural skin tones and smooth contrast boundaries when restricted to the 6 WCA Rubik's colors (White, Yellow, Orange, Red, Green, Blue).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center gap-2.5 text-indigo-500 font-bold text-base">
              <Grid3x3 className="w-5 h-5 shrink-0" />
              <h4 style={{ color: 'var(--text-primary)' }}>Multi-Cube & Custom Grid Scaling</h4>
            </div>
            <p className="text-xs leading-relaxed">
              Design any size artwork—from small desk displays (e.g. 5x5 cubes = 225 stickers) to giant wall murals (e.g. 50x50 cubes = 22,500 stickers). Supports <strong>2x2, 3x3, 4x4, 5x5, 6x6, 7x7 cubes</strong> as well as single-sticker flat grids.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center gap-2.5 text-emerald-500 font-bold text-base">
              <Sliders className="w-5 h-5 shrink-0" />
              <h4 style={{ color: 'var(--text-primary)' }}>Interactive Crop, Pan & Zoom Studio</h4>
            </div>
            <p className="text-xs leading-relaxed">
              Fine-tune your framing with precision controls. Adjust zoom level, drag to pan subjects, toggle grid overlays, and automatically lock aspect ratios matching your physical frame dimensions in real time.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center gap-2.5 text-purple-500 font-bold text-base">
              <Cpu className="w-5 h-5 shrink-0" />
              <h4 style={{ color: 'var(--text-primary)' }}>5 Advanced Dithering Algorithms</h4>
            </div>
            <p className="text-xs leading-relaxed">
              Explore 5 distinct mathematical variation methods: <strong>Floyd-Steinberg Error Diffusion</strong>, <strong>Grayscale Tone Mapping</strong>, <strong>Nearest-Neighbor Dithering</strong>, and <strong>Selective Channel Exclusion</strong> (No-Blue & No-Green for portraits).
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center gap-2.5 text-amber-500 font-bold text-base">
              <FileText className="w-5 h-5 shrink-0" />
              <h4 style={{ color: 'var(--text-primary)' }}>Printable PDF & Assembly Guides</h4>
            </div>
            <p className="text-xs leading-relaxed">
              Instantly generate layer-by-layer build lists, color breakdown charts (e.g. 420 Red, 380 White), interactive row inspectors, and printable PDF blueprint sheets to simplify physical construction.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center gap-2.5 text-teal-500 font-bold text-base">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h4 style={{ color: 'var(--text-primary)' }}>100% Private Local Browser Engine</h4>
            </div>
            <p className="text-xs leading-relaxed">
              All pixel processing, color conversions, and canvas rendering execute locally inside your web browser. Your private photos are <strong>never uploaded, saved, or shared</strong> on remote servers.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
