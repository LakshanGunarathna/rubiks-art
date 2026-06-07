import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Loader2 } from 'lucide-react';

import { CubeView } from './pages/Cubes/CubeView';
import { SolverView } from './pages/Solvers/SolverView';
const PuzzleArts = lazy(() => import('./pages/PuzzleArts').then(m => ({ default: m.PuzzleArts })));


const LoadingFallback = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-white">
    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
    <p className="text-xl font-medium opacity-50">Loading Page...</p>
  </div>
);


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/cubes/:type" element={<CubeView />} />
          <Route path="/solvers/:type" element={<SolverView />} />
          <Route path="/arts" element={<PuzzleArts />} />
          <Route path="/arts/:artSlug" element={<PuzzleArts />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
