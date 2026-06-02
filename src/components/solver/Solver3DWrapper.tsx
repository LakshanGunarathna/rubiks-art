import React from 'react';
import { Cube3D } from '../cube/Cube3D';
import { useCubeEngine } from '../../hooks/useCubeEngine';

interface Solver3DWrapperProps {
  size: number;
  phase: string;
  onStickerClick: (cubie: any, sticker: any) => void;
  onEngineReady: (engine: any) => void;
}

const Solver3DWrapper: React.FC<Solver3DWrapperProps> = ({ size, phase, onStickerClick, onEngineReady }) => {
  const engine = useCubeEngine();
  
  // Pass engine back to parent so UI can use it
  React.useEffect(() => {
    onEngineReady(engine);
  }, [engine, onEngineReady]);

  return (
    <Cube3D
      size={size}
      engine={engine}
      isActive={true}
      isPaintingMode={phase === 'paint'}
      isSolverMode={true}
      onStickerClick={onStickerClick}
    />
  );
};

export default Solver3DWrapper;
