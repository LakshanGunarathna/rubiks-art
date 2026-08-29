import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faMugHot,
  faServer,
  faCode,
  faCubes,
  faShareNodes,
  faCheck,
  faCopy,
  faExternalLinkAlt,
  faComments,
  faBolt,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { useSiteConfig } from '../config/siteConfig';
import { updateMetaTags } from '../utils/seo';

export const SupportUs: React.FC = () => {
  const websiteName = useSiteConfig((state) => state.websiteName);
  const buyMeACoffeeUrl = useSiteConfig((state) => state.buyMeACoffeeUrl);

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    updateMetaTags(
      `Support Us - ${websiteName}`,
      `Support ${websiteName} to keep our 3D Rubik's Cube simulators, AI solvers, puzzle art galleries, and mosaic generator free and ad-free for everyone.`
    );
  }, [websiteName]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const impactItems = [
    {
      icon: faServer,
      title: 'High-Performance Cloud Servers',
      color: 'from-blue-500 to-cyan-500',
      description: 'Powers real-time cloud solvers, API compute, and high-speed algorithm solvers with near-zero latency.'
    },
    {
      icon: faCode,
      title: '3D WebGL Engine & Tools',
      color: 'from-purple-500 to-pink-500',
      description: 'Continuous development of smoother 3D rendering, custom cube shaders, and intuitive camera controls.'
    },
    {
      icon: faCubes,
      title: 'Mosaic Generator R&D',
      color: 'from-amber-500 to-orange-500',
      description: 'Building new dithering algorithms, custom palette matching, and multi-cube printable blueprint exporters.'
    },
    {
      icon: faBolt,
      title: '100% Free & Uninterrupted',
      color: 'from-emerald-500 to-teal-500',
      description: 'Ensuring Rubik\'s Art remains completely accessible, ad-free, and open to learners and speedcubers globally.'
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
        {/* Header / Hero Section */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <FontAwesomeIcon icon={faHeart} className="text-rose-500 animate-pulse" />
            Support Rubik's Art
          </span>
          <h1
            className="text-4xl mt-4 sm:text-5xl font-extrabold font-heading tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Help Keep Rubik's Art Free & Fast
          </h1>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            If you enjoy our interactive 3D cube simulators, instant step-by-step solvers, or custom mosaic generator, consider buying us a coffee! Every cup helps keep the servers running and new features rolling out.
          </p>
        </div>

        {/* Main Donation Section: Single Merged Buy Me a Coffee Card */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl text-left space-y-6">
          {/* Card Header & Intro */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 text-2xl shadow-lg shadow-amber-500/20 flex-shrink-0">
                <FontAwesomeIcon icon={faMugHot} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Community Driven
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                  Buy Us a Coffee
                </h2>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Directly support via the Buy Me a Coffee platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold self-start sm:self-auto">
              <FontAwesomeIcon icon={faCheck} />
              <span>100% Free & Ad-Free Platform</span>
            </div>
          </div>

          {/* Top Center: Prominent Buy Me a Coffee CTA Button */}
          <div className="max-w-xl mx-auto w-full text-center space-y-3 pt-1 pb-3">
            <a
              href={buyMeACoffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-extrabold text-base sm:text-lg transition-all shadow-xl hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <FontAwesomeIcon icon={faMugHot} className="text-xl group-hover:scale-110 transition-transform" />
              <span>Support on Buy Me a Coffee</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs opacity-75 ml-1" />
            </a>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>🔒 Secure checkout powered by Buy Me a Coffee</span>
              <span>•</span>
              <span>No account required</span>
            </div>
          </div>

          {/* Card Content Below the Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-t pt-6" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                Why Your Support Counts
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Unlike many platforms, Rubik's Art is committed to providing a clean, ad-free experience with full 3D capabilities for solvers and mosaic artists worldwide.
              </p>
              
              <ul className="space-y-3 pt-1">
                {[
                  '100% Ad-Free web experience',
                  'Unlimited access to 3D solvers (2x2 to 5x5)',
                  'Full-resolution mosaic pattern exports',
                  'Frequent updates & new puzzle visualizers'
                ].map((perk, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-xs flex-shrink-0">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Thanks Card */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-xs sm:text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2 font-bold text-base text-blue-600 dark:text-blue-400">
                  <FontAwesomeIcon icon={faStar} />
                  <span>Special Thanks</span>
                </div>
                <p className="leading-relaxed">
                  Thank you to every cuber, teacher, solver, and mosaic artist who supports this project. You make this platform possible and keep it growing!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Where Does the Support Go? (Impact Cards) */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              How Your Support Is Used
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every dollar contributed goes directly into keeping the service fast, reliable, and continuously improving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-md hover:shadow-lg transition-all text-left space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xl shadow-md`}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 className="text-lg font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Free Ways to Support Section */}
        <div className="rounded-3xl p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--glass-border)' }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Non-Monetary Support
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading mt-1" style={{ color: 'var(--text-primary)' }}>
                Other Ways to Support Us
              </h2>
              <p className="text-sm max-w-xl mt-1" style={{ color: 'var(--text-secondary)' }}>
                Can't donate right now? You can still make a huge impact through these simple actions:
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-sm font-bold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <FontAwesomeIcon icon={copiedLink ? faCheck : faCopy} />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Website Link'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faShareNodes} />
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Spread the Word</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Share Rubik's Art on Reddit, Discord, Twitter, or with friends and speedcubing clubs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faComments} />
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Give Feedback</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Found a bug or have an idea for a feature? <Link to="/contact" className="text-blue-500 underline">Send us a message</Link> to help improve our tools.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faCubes} />
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Create & Share Mosaics</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Use our <Link to="/mosaic-generator" className="text-blue-500 underline">Mosaic Generator</Link> to build real cube art and tag us when showing off your builds!
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
