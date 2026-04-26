import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Loader } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface SceneCanvasProps {
  children?: React.ReactNode;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ children }) => {
  return (
    <>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 45 }}
        className="w-full h-full rounded-2xl"
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          {/* Main 3D Content goes here */}
          {children || (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
            </mesh>
          )}

          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Suspense>

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

        {/* Postprocessing for bloom effect */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  );
};
