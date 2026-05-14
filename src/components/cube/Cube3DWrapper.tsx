import React from 'react';
import { Cube3D } from './Cube3D';
import { useCubeEngine } from '../../hooks/useCubeEngine';

interface Cube3DWrapperProps {
  size: number;
  onEngineReady: (engine: any) => void;
}

const Cube3DWrapper: React.FC<Cube3DWrapperProps> = ({ size, onEngineReady }) => {
  const engine = useCubeEngine();
  
  React.useEffect(() => {
    onEngineReady(engine);
  }, [engine, onEngineReady]);

  return (
    <Cube3D
      size={size}
      engine={engine}
      isActive={true}
    />
  );
};

export default Cube3DWrapper;
