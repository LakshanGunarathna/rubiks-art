import React from 'react';
import { Cube3D } from './Cube3D';
import { useCubeEngine } from '../../hooks/useCubeEngine';

interface Cube3DWrapperProps {
  size: number;
  onEngineReady: (engine: any) => void;
  disableControls?: boolean;
  disableSliceMoves?: boolean;
}

const Cube3DWrapper: React.FC<Cube3DWrapperProps> = ({ size, onEngineReady, disableControls, disableSliceMoves }) => {
  const engine = useCubeEngine();
  
  React.useEffect(() => {
    onEngineReady(engine);
  }, [engine, onEngineReady]);

  return (
    <Cube3D
      size={size}
      engine={engine}
      isActive={true}
      disableControls={disableControls}
      disableSliceMoves={disableSliceMoves}
    />
  );
};

export default Cube3DWrapper;
