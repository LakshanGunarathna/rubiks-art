import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../config/siteConfig';
import logoImg from '../../assets/Logo.png';

export const Footer: React.FC = () => {
  const websiteName = useSiteConfig((state) => state.websiteName);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (window.location.pathname === path) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <footer className="w-full border-t backdrop-blur-md mt-12 py-8 relative z-20" style={{ borderColor: 'var(--nav-border)', backgroundColor: 'var(--nav-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        
        {/* Brand / Copy */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
            <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>{websiteName}</h3>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} {websiteName}. All rights reserved.
          </p>
        </div>

        {/* Quick Links - Hidden on Mobile */}
        <div className="hidden md:flex flex-wrap gap-8">
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Rubik's Cubes</h4>
            <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li><Link to="/cubes/2x2" onClick={(e) => handleLinkClick(e, '/cubes/2x2')} className="transition-colors hover:text-[var(--accent-color)]">Mini Cube (2x2x2)</Link></li>
              <li><Link to="/cubes/3x3" onClick={(e) => handleLinkClick(e, '/cubes/3x3')} className="transition-colors hover:text-[var(--accent-color)]">Rubik's Cube (3x3x3)</Link></li>
              <li><Link to="/cubes/4x4" onClick={(e) => handleLinkClick(e, '/cubes/4x4')} className="transition-colors hover:text-[var(--accent-color)]">Revenge (4x4x4)</Link></li>
              <li><Link to="/cubes/5x5" onClick={(e) => handleLinkClick(e, '/cubes/5x5')} className="transition-colors hover:text-[var(--accent-color)]">Professor's (5x5x5)</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Solvers</h4>
            <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li><Link to="/solvers/2x2" onClick={(e) => handleLinkClick(e, '/solvers/2x2')} className="transition-colors hover:text-[var(--accent-color)]">2x2x2 Solver</Link></li>
              <li><Link to="/solvers/3x3" onClick={(e) => handleLinkClick(e, '/solvers/3x3')} className="transition-colors hover:text-[var(--accent-color)]">3x3x3 Solver</Link></li>
              <li><Link to="/solvers/4x4" onClick={(e) => handleLinkClick(e, '/solvers/4x4')} className="transition-colors hover:text-[var(--accent-color)]">4x4x4 Solver</Link></li>
              <li><Link to="/solvers/5x5" onClick={(e) => handleLinkClick(e, '/solvers/5x5')} className="transition-colors hover:text-[var(--accent-color)]">5x5x5 Solver</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Gallery</h4>
            <ul className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li><Link to="/arts" onClick={(e) => handleLinkClick(e, '/arts')} className="transition-colors hover:text-[var(--accent-color)]">Puzzle Arts</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};
