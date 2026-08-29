import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Home } from './pages/Home';

import { CubeView } from './pages/CubeView';
import { SolverView } from './pages/SolverView';
import { PuzzleArts } from './pages/PuzzleArts';
import { MosaicGenerator } from './pages/MosaicGenerator';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { SupportUs } from './pages/SupportUs';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/cubes/:type" element={<CubeView />} />
      <Route path="/solvers/:type" element={<SolverView />} />
      <Route path="/arts" element={<PuzzleArts />} />
      <Route path="/arts/:artSlug" element={<PuzzleArts />} />
      <Route path="/mosaic-generator" element={<MosaicGenerator />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/support" element={<SupportUs />} />
      <Route path="/donate" element={<SupportUs />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
