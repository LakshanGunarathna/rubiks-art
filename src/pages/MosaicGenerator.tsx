import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { updateMetaTags } from '../utils/seo';

// Import sub-components dynamically (code-splitting)
const ImageUploader = lazy(() => import('../components/mosaic/ImageUploader').then(m => ({ default: m.ImageUploader })));
const ImageAdjuster = lazy(() => import('../components/mosaic/ImageAdjuster').then(m => ({ default: m.ImageAdjuster })));
const MethodSelector = lazy(() => import('../components/mosaic/MethodSelector').then(m => ({ default: m.MethodSelector })));
const MosaicViewer = lazy(() => import('../components/mosaic/MosaicViewer').then(m => ({ default: m.MosaicViewer })));

// Rubik's Cube color palette definition
interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  textClass: string;
  code: string;
}

const PALETTE: PaletteColor[] = [
  { name: 'White', hex: '#FFFFFF', rgb: [255, 255, 255], textClass: 'text-slate-800 font-bold', code: 'W' },
  { name: 'Yellow', hex: '#FFD500', rgb: [255, 213, 0], textClass: 'text-slate-800 font-bold', code: 'Y' },
  { name: 'Orange', hex: '#FF5800', rgb: [255, 88, 0], textClass: 'text-white font-bold', code: 'O' },
  { name: 'Red', hex: '#C41E3A', rgb: [196, 30, 58], textClass: 'text-white font-bold', code: 'R' },
  { name: 'Green', hex: '#009E60', rgb: [0, 158, 96], textClass: 'text-white font-bold', code: 'G' },
  { name: 'Blue', hex: '#0051BA', rgb: [0, 81, 186], textClass: 'text-white font-bold', code: 'B' }
];

export const MosaicGenerator: React.FC = () => {
  // Wizard steps: 1 = Upload, 2 = Adjust, 3 = Select Method, 4 = Result & Instructions
  const [step, setStep] = useState<number>(1);

  // Configuration state
  const [cubesWide, setCubesWide] = useState<number>(20);
  const [cubesHigh, setCubesHigh] = useState<number>(30);
  const [cubeType, setCubeType] = useState<string>('3x3');
  const [showCubeGrid, setShowCubeGrid] = useState<boolean>(true);
  const [showStickerGrid, setShowStickerGrid] = useState<boolean>(true);

  // Crop & image states
  const [imageSrc, setImageSrc] = useState<string>('');
  const [croppedImageSrc, setCroppedImageSrc] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1.2);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  // Processed and selected outputs
  const [rawCroppedData, setRawCroppedData] = useState<Uint8ClampedArray | null>(null);
  const [initialParams, setInitialParams] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');



  // Set page meta tags and inject JSON-LD structured data for SEO
  useEffect(() => {
    updateMetaTags(
      "Online Rubik's Cube Mosaic Generator | Rubiks' Art",
      "Convert your photos into stunning Rubik's Cube pixel mosaics. Upload images, adjust crop/zoom, select grid sizes and cube types (1x1 to 5x5), apply dithering, download patterns, and follow a step-by-step building guide."
    );

    // Create and inject JSON-LD script for rich search results
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Rubik's Cube Mosaic Generator",
      "description": "Convert any image or photo into a Rubik's Cube mosaic pattern. Features adjustable grid sizes, cube types (1x1 to 7x7), perception-based color matching, Floyd-Steinberg dithering, and step-by-step physical assembly guides with PDF export.",
      "url": "https://www.rubiks-art.com/mosaic-generator",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 canvas support and JavaScript.",
      "creator": {
        "@type": "Organization",
        "name": "Rubiks' Art"
      },
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'mosaic-generator-jsonld';
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      // Clean up the injected script on unmount
      const existingScript = document.getElementById('mosaic-generator-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Scroll to top when wizard step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);



  // Get current cube edge size in stickers
  const cubeSize = useMemo(() => {
    switch (cubeType) {
      case '1x1': return 1;
      case '2x2': return 2;
      case '3x3': return 3;
      case '4x4': return 4;
      case '5x5': return 5;
      case '6x6': return 6;
      case '7x7': return 7;
      default: return 3;
    }
  }, [cubeType]);

  // Bounded viewport display dimensions
  const viewportDim = useMemo(() => {
    const aspect = cubesWide / cubesHigh;
    let width = 450;
    let height = 450 / aspect;
    if (height > 400) {
      height = 400;
      width = 400 * aspect;
    }
    return { width, height };
  }, [cubesWide, cubesHigh]);

  // Handle image file selection/drop
  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setZoom(1.2);
        setPanX(0);
        setPanY(0);
        setStep(2); // Go to adjustment step
      }
    };
    reader.readAsDataURL(file);
  };



  // Callback when first-choice style is finalized in fine-tuning
  const handleSelectMethod = (methodName: string, _indices: Uint8Array, params: any) => {
    setSelectedMethod(methodName);
    setInitialParams(params);
    setStep(4); // Go to details & assembly step
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-100 dark:border-blue-500/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Rubik's Art Creator Studio
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500">
          Rubik's Cube Mosaic Generator
        </h1>
        {step === 1 && (
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            Upload any picture and instantly design a realistic mosaic layout built entirely from Rubik's Cubes. Tailor dimensions, choose approximation algorithms, and download printable patterns.
          </p>
        )}
      </div>

      {/* Step Indicators */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between px-4">
        {[
          { num: 1, label: 'Upload' },
          { num: 2, label: 'Crop & Size' },
          { num: 3, label: 'Select Style' },
          { num: 4, label: 'Build Guide' }
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1.5 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border transition-all ${step === s.num
                    ? 'bg-blue-600 border-blue-700 text-white shadow-md ring-4 ring-blue-500/20 scale-105'
                    : step > s.num
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[var(--text-secondary)]'
                  }`}
              >
                {s.num}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${step === s.num ? 'text-blue-500' : 'text-[var(--text-secondary)]'}`}>
                {s.label}
              </span>
            </div>
            {idx < 3 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.num + 1 ? 'bg-emerald-500' : step > s.num ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Wizard Step Components */}
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-[var(--text-secondary)]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Loading panel...</p>
          </div>
        }>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <ImageUploader
                key="uploader"
                onImageFile={handleImageFile}
              />
            )}

            {step === 2 && (
              <ImageAdjuster
                key="adjuster"
                imageSrc={imageSrc}
                zoom={zoom}
                setZoom={setZoom}
                panX={panX}
                setPanX={setPanX}
                panY={panY}
                setPanY={setPanY}
                cubesWide={cubesWide}
                setCubesWide={setCubesWide}
                cubesHigh={cubesHigh}
                setCubesHigh={setCubesHigh}
                cubeType={cubeType}
                setCubeType={setCubeType}
                showCubeGrid={showCubeGrid}
                setShowCubeGrid={setShowCubeGrid}
                showStickerGrid={showStickerGrid}
                setShowStickerGrid={setShowStickerGrid}
                onGenerate={(rawData, croppedBase64) => {
                  setRawCroppedData(rawData);
                  setCroppedImageSrc(croppedBase64);
                  setStep(3); // Go to selection step
                }}
                onBack={() => {
                  setImageSrc('');
                  setCroppedImageSrc('');
                  setStep(1);
                }}
                viewportDim={viewportDim}
                cubeSize={cubeSize}
              />
            )}

            {step === 3 && rawCroppedData && (
              <MethodSelector
                key="selector"
                rawCroppedData={rawCroppedData}
                cubesWide={cubesWide}
                cubesHigh={cubesHigh}
                cubeSize={cubeSize}
                onSelectMethod={handleSelectMethod}
                onBack={() => setStep(2)}
                PALETTE={PALETTE}
              />
            )}

            {step === 4 && rawCroppedData && initialParams && (
              <MosaicViewer
                key="viewer"
                methodName={selectedMethod}
                rawCroppedData={rawCroppedData}
                initialParams={initialParams}
                cubesWide={cubesWide}
                cubesHigh={cubesHigh}
                cubeSize={cubeSize}
                cubeType={cubeType}
                showCubeGrid={showCubeGrid}
                setShowCubeGrid={setShowCubeGrid}
                showStickerGrid={showStickerGrid}
                setShowStickerGrid={setShowStickerGrid}
                onBackToAdjust={() => setStep(2)}
                onBackToSelect={() => setStep(3)}
                PALETTE={PALETTE}
                imageSrc={croppedImageSrc || imageSrc}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </div>


    </div>
  );
};
