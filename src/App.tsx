import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { CubeView } from './pages/Cubes/CubeView';
import { SolverView } from './pages/Solvers/SolverView';
import { PuzzleArts } from './pages/PuzzleArts';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/cubes/:type" element={<CubeView />} />
        <Route path="/solvers/:type" element={<SolverView />} />
        <Route path="/arts" element={<PuzzleArts />} />
      </Routes>
    </AnimatePresence>
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
