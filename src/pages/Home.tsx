import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faCubes, faPuzzlePiece, faMagic, faArrowRight, faCompass, faAward } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../assets/Logo.png';

// Motion animation configurations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const floatAnimation: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface CubeCardProps {
  title: string;
  subtitle: string;
  perm: string;
  tag: string;
  path: string;
  accentClass: string;
  tagClass: string;
  icon: any;
}

const CubePlaygroundCard: React.FC<CubeCardProps> = ({ title, subtitle, perm, tag, path, accentClass, tagClass, icon }) => (
  <motion.div variants={itemVariants} className="h-full">
    <Link to={path} className="group block h-full relative rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      {/* Decorative colored glow on hover */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 bg-gradient-to-br ${accentClass}`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${accentClass} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagClass}`}>
          {tag}
        </span>
      </div>

      <h3 className="text-xl font-bold font-heading mb-2 text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
        {title}
      </h3>
      <p className="text-sm mb-4 text-[var(--text-secondary)] leading-relaxed flex-grow">
        {subtitle}
      </p>
      
      <div className="pt-4 border-t border-[var(--nav-border)] flex justify-between items-center text-xs mt-auto">
        <span className="text-[var(--text-secondary)] font-medium">Permutations: <span className="font-semibold text-[var(--text-primary)]">{perm}</span></span>
        <span className="text-blue-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          Explore <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
        </span>
      </div>
    </Link>
  </motion.div>
);

const CubeSolverCard: React.FC<CubeCardProps> = ({ title, subtitle, tag, path, accentClass, tagClass, icon }) => (
  <motion.div variants={itemVariants} className="h-full">
    <Link to={path} className="group block h-full relative rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      {/* Dynamic hover overlay */}
      <div className={`absolute -left-16 -bottom-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 bg-gradient-to-br ${accentClass}`} />
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${accentClass} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h4 className="text-lg font-bold font-heading text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
            {title}
          </h4>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagClass}`}>
            {tag}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
        {subtitle}
      </p>

      <div className="text-xs font-semibold text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
        Open Solver Guide <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
      </div>
    </Link>
  </motion.div>
);

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = "Rubiks' Art";
  }, []);

  const cubesData = [
    {
      title: "Pocket Cube (2x2x2)",
      subtitle: "The smaller cousin of the traditional Rubik's cube. Perfect for beginners to learn basic puzzle configurations.",
      perm: "3.67 Million",
      tag: "Easy",
      path: "/cubes/2x2",
      accentClass: "from-emerald-500 to-teal-600",
      tagClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      icon: faCube,
    },
    {
      title: "Rubik's Cube (3x3x3)",
      subtitle: "The legendary classic puzzle that sparked a worldwide obsession. Ideal for testing and honing your algorithms.",
      perm: "43 Quintillion",
      tag: "Moderate",
      path: "/cubes/3x3",
      accentClass: "from-blue-500 to-indigo-600",
      tagClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      icon: faCube,
    },
    {
      title: "Rubik's Revenge (4x4x4)",
      subtitle: "Features center parities and missing fixed centers, offering a significant jump in complexity and visual pattern options.",
      perm: "7.40 × 10⁴⁵",
      tag: "Advanced",
      path: "/cubes/4x4",
      accentClass: "from-orange-500 to-red-600",
      tagClass: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      icon: faCubes,
    },
    {
      title: "Professor's Cube (5x5x5)",
      subtitle: "The grandmaster puzzle of speedcubing. Features fixed centers and 98 visible edge and corner components to coordinate.",
      perm: "2.83 × 10⁷⁴",
      tag: "Expert",
      path: "/cubes/5x5",
      accentClass: "from-purple-500 to-fuchsia-600",
      tagClass: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      icon: faCubes,
    },
  ];

  const solversData = [
    {
      title: "2x2 Solver",
      subtitle: "Guided visual sequence solver. Solve the Pocket Cube step-by-step using layer-by-layer methods.",
      tag: "Beginner Method",
      path: "/solvers/2x2",
      accentClass: "from-emerald-500 to-teal-600",
      tagClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      icon: faMagic,
    },
    {
      title: "3x3 Solver",
      subtitle: "Advanced step-by-step solver guide. Master the classic CFOP steps and layer-by-layer algorithms.",
      tag: "Layer-by-Layer / CFOP",
      path: "/solvers/3x3",
      accentClass: "from-blue-500 to-indigo-600",
      tagClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      icon: faMagic,
    },
    {
      title: "4x4 Solver",
      subtitle: "Tackle Center Parities and Edge pairing algorithms with detailed visual guides.",
      tag: "Reduction Method",
      path: "/solvers/4x4",
      accentClass: "from-orange-500 to-red-600",
      tagClass: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      icon: faMagic,
    },
    {
      title: "5x5 Solver",
      subtitle: "Learn the full reduction method, pairing complex centers, and managing edge alignments.",
      tag: "Reduction & Parity Handling",
      path: "/solvers/5x5",
      accentClass: "from-purple-500 to-fuchsia-600",
      tagClass: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      icon: faMagic,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col gap-16"
    >
      {/* 🚀 Hero Section */}
      <motion.div variants={itemVariants} className="relative py-8 lg:py-16 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 max-w-6xl mx-auto w-full">
        {/* Glow Ring Behind Logo */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 pointer-events-none" />

        {/* Animated Brand Logo */}
        <motion.div 
          variants={floatAnimation}
          animate="animate"
          className="relative z-10 w-44 h-44 lg:w-64 lg:h-64 cursor-pointer group flex-shrink-0"
        >
          <img 
            src={logoImg} 
            alt="Rubik's Art Logo" 
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-300" 
          />
        </motion.div>

        {/* Text and Actions */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start relative z-10">
          {/* Gradient Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500">
            Rubik's Art
          </h1>
          
          {/* Subheading Description */}
          <p 
            className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Experience beautiful high-fidelity 3D cube simulations, learn detailed algorithm solver guides, and transform simple Rubik's cubes into premium pixel-art canvas mosaics.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link 
              to="/arts" 
              className="px-8 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              Create Puzzle Art
            </Link>
            <a 
              href="#playgrounds" 
              className="px-8 py-3.5 rounded-2xl font-bold border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] hover:bg-[var(--glass-border)] hover:border-[var(--text-secondary)]/20 transition-all hover:-translate-y-0.5 shadow"
            >
              Explore Cubes
            </a>
            <a 
              href="#solvers" 
              className="px-8 py-3.5 rounded-2xl font-bold border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] hover:bg-[var(--glass-border)] hover:border-[var(--text-secondary)]/20 transition-all hover:-translate-y-0.5 shadow"
            >
              Solve a Cube
            </a>
          </div>
        </div>
      </motion.div>

      {/* 🎨 Featured Puzzle Arts Card Section */}
      <motion.div variants={itemVariants} className="w-full">
        <Link 
          to="/arts" 
          className="group block relative w-full rounded-3xl p-8 lg:p-12 overflow-hidden backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl hover:shadow-2xl transition-all duration-500"
        >
          {/* Radial accent hover backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl opacity-15 bg-gradient-to-br from-indigo-500 to-purple-500 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
                <FontAwesomeIcon icon={faAward} /> Featured Canvas Feature
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold font-heading text-[var(--text-primary)] mb-4 leading-tight group-hover:text-blue-500 transition-colors">
                Premium Puzzle Arts & Mosaic Gallery
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6 max-w-xl text-base">
                Discover a modern studio of pixel-art designs made entirely using Rubik's cubes. Filter by cube type or difficulty, select a pattern, and follow a fully animated 3D guide to turn your actual physical cube into a work of art.
              </p>
              <span className="inline-flex items-center gap-2 text-blue-500 font-bold group-hover:gap-3 transition-all">
                Enter Gallery and Studio <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </div>
            
            {/* Visual Icon Grid Representation */}
            <div className="w-full lg:w-auto flex items-center justify-center">
              <div className="relative p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-inner group-hover:scale-105 transition-transform duration-500">
                <div className="grid grid-cols-3 gap-3 w-40 h-40">
                  {/* Mock grid representing color pixel arts */}
                  <div className="bg-red-500 rounded-lg shadow-sm" />
                  <div className="bg-blue-500 rounded-lg shadow-sm" />
                  <div className="bg-orange-500 rounded-lg shadow-sm" />
                  <div className="bg-yellow-500 rounded-lg shadow-sm" />
                  <div className="bg-white rounded-lg shadow-sm" />
                  <div className="bg-green-500 rounded-lg shadow-sm" />
                  <div className="bg-blue-500 rounded-lg shadow-sm" />
                  <div className="bg-yellow-500 rounded-lg shadow-sm" />
                  <div className="bg-red-500 rounded-lg shadow-sm" />
                </div>
                {/* Floating overlay icon */}
                <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <FontAwesomeIcon icon={faPuzzlePiece} size="lg" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 🎮 3D Cubes Playground Section */}
      <div id="playgrounds" className="flex flex-col gap-6 scroll-mt-24">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-2">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              3D Interactive Playgrounds
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Select a size and interact with high-fidelity 3D models with responsive camera movement.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--glass-border)] text-[var(--text-secondary)] flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCompass} /> Simulated in WebGL
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cubesData.map((cube) => (
            <CubePlaygroundCard
              key={cube.title}
              title={cube.title}
              subtitle={cube.subtitle}
              perm={cube.perm}
              tag={cube.tag}
              path={cube.path}
              accentClass={cube.accentClass}
              tagClass={cube.tagClass}
              icon={cube.icon}
            />
          ))}
        </div>
      </div>

      {/* 🪄 3D Guided Solvers Section */}
      <div id="solvers" className="flex flex-col gap-6 scroll-mt-24">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-2">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              Interactive Solver Guides
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Follow step-by-step algorithms, historical trivia, and parity solutions.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solversData.map((solver) => (
            <CubeSolverCard
              key={solver.title}
              title={solver.title}
              subtitle={solver.subtitle}
              perm=""
              tag={solver.tag}
              path={solver.path}
              accentClass={solver.accentClass}
              tagClass={solver.tagClass}
              icon={solver.icon}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
