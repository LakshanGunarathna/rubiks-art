import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../config/siteConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faPuzzlePiece, faMagic, faBars, faTimes, faChevronDown, faChevronUp, faHome, faSun, faMoon, faImage } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/Logo.png';

export const Navbar: React.FC = () => {
  const websiteName = useSiteConfig((state) => state.websiteName);
  const isDarkMode = useSiteConfig((state) => state.isDarkMode);
  const toggleDarkMode = useSiteConfig((state) => state.toggleDarkMode);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Separate state for mobile accordion
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/', icon: faHome },
    {
      name: "Rubik's Cubes",
      icon: faCubes,
      dropdown: [
        { name: "Rubik's Mini Cube (2x2x2)", path: '/cubes/2x2' },
        { name: "Rubik's Cube (3x3x3)", path: '/cubes/3x3' },
        { name: "Rubik's Revenge (4x4x4)", path: '/cubes/4x4' },
        { name: "Rubik's Professor's Cube (5x5x5)", path: '/cubes/5x5' },
      ],
    },
    {
      name: 'Solver',
      icon: faMagic,
      dropdown: [
        { name: '2x2x2 Solver (Mini Cube)', path: '/solvers/2x2' },
        { name: "3x3x3 Solver (Rubik's Cube)", path: '/solvers/3x3' },
        { name: '4x4x4 Solver (Revenge Cube)', path: '/solvers/4x4' },
        { name: "5x5x5 Solver (Professor's Cube)", path: '/solvers/5x5' },
      ],
    },
    { name: 'Puzzle Arts', path: '/arts', icon: faPuzzlePiece },
    { name: 'Mosaic Generator', path: '/mosaic-generator', icon: faImage },
  ];

  return (
    <>
      <nav
        className="fixed w-full z-40 top-0 start-0 border-b backdrop-blur-md"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-2 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
            <span
              className="self-center text-2xl font-semibold whitespace-nowrap font-heading tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {websiteName}
            </span>
          </Link>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors mr-2 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}
              style={{ color: 'var(--text-primary)' }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="lg" />
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-slate-100 focus:outline-none text-[var(--text-secondary)]"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block w-auto">
            <ul className="flex font-medium space-x-8 mt-0 border-0 bg-transparent">
              {navItems.map((item) => (
                <li key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div
                      className="flex items-center justify-between py-2 rounded hover:bg-transparent cursor-pointer transition-colors"
                      style={{
                        color: activeDropdown === item.name ? 'var(--accent-color)' : 'var(--text-secondary)'
                      }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={item.icon} />
                        {item.name}
                      </span>
                      <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-3 h-3" />
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 w-64 backdrop-blur-xl border rounded-lg shadow-xl overflow-hidden"
                            style={{ backgroundColor: 'var(--dropdown-bg)', borderColor: 'var(--nav-border)' }}
                          >
                            <ul className="py-2 text-sm text-[var(--text-secondary)]">
                              {item.dropdown.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.path}
                                    className="block px-4 py-4 hover:bg-[var(--accent-hover)]/10 hover:text-[var(--accent-color)] transition-colors"
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.path!}
                      className="flex items-center gap-2 py-2 rounded hover:bg-transparent transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm border-l z-50 md:hidden p-6 overflow-y-auto shadow-2xl flex flex-col"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--nav-border)' }}
            >
              <div className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: 'var(--nav-border)' }}>
                <div className="flex items-center gap-2">
                  <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
                  <span className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>{websiteName}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[var(--accent-color)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <FontAwesomeIcon icon={faTimes} size="xl" />
                </button>
              </div>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.name} className="flex flex-col">
                    {item.dropdown ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full text-left py-2 text-lg transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                        >
                          <span className="flex items-center gap-3">
                            <FontAwesomeIcon icon={item.icon} className="w-5" />
                            {item.name}
                          </span>
                          <FontAwesomeIcon
                            icon={mobileExpanded === item.name ? faChevronUp : faChevronDown}
                            className="w-3 h-3"
                            style={{ color: 'var(--text-secondary)' }}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.name && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-8 border-l ml-2 mt-2 space-y-2"
                              style={{ borderColor: 'var(--nav-border)' }}
                            >
                              {item.dropdown.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.path}
                                    className="block py-2 transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path!}
                        className="flex items-center gap-3 py-2 text-lg transition-colors text-[var(--text-primary)] hover:text-[var(--accent-color)]"
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={item.icon} className="w-5" />
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
