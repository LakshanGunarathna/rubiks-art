import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface SceneCanvasProps {
  children?: React.ReactNode;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ children }) => {
  return (
    <>
      <Canvas

        className="w-full h-full rounded-2xl"
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

        {/* Postprocessing for bloom effect */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  );
};
