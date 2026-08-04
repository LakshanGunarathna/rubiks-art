import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faMagic, faPuzzlePiece, faImage, faLightbulb, faExclamationTriangle, faComments, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { updateMetaTags } from '../utils/seo';

export const AboutUs: React.FC = () => {
  useEffect(() => {
    updateMetaTags(
      "About Us - Rubik's Art",
      "Learn about Rubik's Art — your online destination for 3D Rubik's Cube simulators, step-by-step solvers, puzzle art galleries, and custom mosaic generator."
    );
  }, []);

  const features = [
    {
      icon: faCubes,
      title: "Interactive 3D Cubes",
      color: "from-blue-500 to-cyan-500",
      description: "Perform real-time rotations and explore 2x2, 3x3, 4x4, and 5x5 Rubik's Cubes with physics-based smooth 3D animations and customizable controls."
    },
    {
      icon: faMagic,
      title: "Step-by-Step Solvers",
      color: "from-purple-500 to-pink-500",
      description: "Input any state of your physical cube and receive instant step-by-step solution algorithms with visual playback instructions."
    },
    {
      icon: faPuzzlePiece,
      title: "Puzzle Art Gallery",
      color: "from-amber-500 to-orange-500",
      description: "Discover stunning artwork rendered entirely out of Rubik's Cubes, complete with cube count breakdowns and interactive layer inspect mode."
    },
    {
      icon: faImage,
      title: "Mosaic Generator",
      color: "from-emerald-500 to-teal-500",
      description: "Upload any photo or graphic to generate pixel-perfect Rubik's Cube mosaic blueprint guides with detailed color palettes and build lists."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            About Us
          </span>
          <h1 className="text-4xl mt-5 sm:text-5xl font-extrabold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Empowering Speedcubers & Visual Artists
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Rubik's Art is a modern web platform built for cube enthusiasts, puzzle solvers, and creative mosaic creators worldwide.
          </p>
        </div>

        {/* Mission Statement Card */}
        <div className="rounded-3xl p-8 sm:p-10 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-6 text-left relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg">
              <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Our Mission
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Combining mathematics, algorithmic speed, and creative art</p>
            </div>
          </div>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Whether you are picking up a Rubik's cube for the very first time, looking for an instant step-by-step solver algorithm, or designing massive multi-cube mosaic portraits, our mission is to provide intuitive, fast, and beautifully designed web tools that make cubing accessible to everyone.
          </p>
        </div>

        {/* Disclaimer Card */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-amber-500/30 bg-amber-500/5 text-left space-y-3">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
            <h2 className="text-xl font-bold font-heading">Trademark Disclaimer</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This website is NOT derived from, is NOT associated with and is NOT endorsed or sponsored by the owner of the Rubik's Cube's Trademark - Spin Master Toys UK Limited.
          </p>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              Website Features
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Explore the core tools and visualizers available on Rubik's Art
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xl shadow-md`}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feedback & Contact Us Link */}
        <div className="rounded-3xl p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 text-2xl mb-1">
            <FontAwesomeIcon icon={faComments} />
          </div>
          <h2 className="text-3xl font-extrabold font-heading" style={{ color: 'var(--text-primary)' }}>
            We'd Love Your Feedback!
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Have suggestions, feature requests, or comments? We are constantly improving our tools and would love to hear your thoughts.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/25 inline-flex items-center gap-2 text-sm"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              Give Feedback / Contact Us
            </Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
