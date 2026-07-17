import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateMetaTags } from '../utils/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { cubeArts } from '../data/cubeArts';
import { ArtPlayer } from '../components/puzzleArts/ArtPlayer';

import { PuzzleArtsFilterBar, CUBE_TYPES, DIFFICULTIES } from '../components/puzzleArts/PuzzleArtsFilterBar';

function getDifficulty(moveCount: number) {
  if (moveCount <= 10) return 'Easy';
  if (moveCount <= 20) return 'Medium';
  if (moveCount <= 35) return 'Hard';
  if (moveCount <= 50) return 'Extreme';
  return 'Ultra';
}

export const PuzzleArts: React.FC = () => {
  const { artSlug } = useParams<{ artSlug: string }>();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [diffFilter, setDiffFilter] = useState<string>('All');

  const activeArt = useMemo(() => {
    if (!artSlug) return null;
    return cubeArts.find(art => art.slug === artSlug) || null;
  }, [artSlug]);

  React.useEffect(() => {
    if (activeArt) {
      updateMetaTags(
        `${activeArt.name} | Puzzle Arts | Rubiks' Art`,
        `Follow this interactive 3D guide to build the "${activeArt.name}" mosaic pattern on a ${activeArt.type} cube. Moves: ${activeArt.moves}`,
        activeArt.imageUrl
      );
    } else {
      updateMetaTags(
        "Puzzle Arts | Rubiks' Art",
        "Create premium pixel-art mosaics using Rubik's Cubes. Select patterns, filter by difficulty, and follow animated 3D guides to build stunning puzzle art.",
        "/assets/og-arts.png"
      );
    }
  }, [activeArt]);

  const artsWithMetadata = useMemo(() => {
    return cubeArts.map(art => {
      const moveCount = art.moves.trim().split(/\s+/).filter(m => m).length;
      const difficulty = getDifficulty(moveCount);
      return { ...art, moveCount, difficulty };
    });
  }, []);

  const filteredArts = useMemo(() => {
    return artsWithMetadata.filter(art => {
      if (typeFilter !== 'All' && art.type !== typeFilter) return false;
      if (diffFilter !== 'All' && art.difficulty !== diffFilter) return false;
      return true;
    });
  }, [artsWithMetadata, typeFilter, diffFilter]);

  // Counts
  const totalCount = artsWithMetadata.length;

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CUBE_TYPES.forEach(t => counts[t.id] = 0);
    artsWithMetadata.forEach(art => {
      if (diffFilter === 'All' || art.difficulty === diffFilter) {
        if (counts[art.type] !== undefined) counts[art.type]++;
      }
    });
    return counts;
  }, [artsWithMetadata, diffFilter]);

  const diffCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DIFFICULTIES.forEach(d => counts[d] = 0);
    artsWithMetadata.forEach(art => {
      if (typeFilter === 'All' || art.type === typeFilter) {
        if (counts[art.difficulty] !== undefined) counts[art.difficulty]++;
      }
    });
    return counts;
  }, [artsWithMetadata, typeFilter]);

  const currentCount = filteredArts.length;

  if (activeArt) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="player"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full min-h-[calc(100vh-6rem)]"
        >
          <ArtPlayer art={activeArt} onExit={() => navigate('/arts')} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-7xl mx-auto flex flex-col gap-6 pt-4 pb-12"
    >
      {/* Top Filter Bar */}
      <PuzzleArtsFilterBar
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        diffFilter={diffFilter}
        setDiffFilter={setDiffFilter}
        totalCount={totalCount}
        currentCount={currentCount}
        typeCounts={typeCounts}
        diffCounts={diffCounts}
      />

      {/* Gallery Grid */}
      <main className="flex-1">
        {filteredArts.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-gray-800">No patterns found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArts.map(art => (
              <motion.div
                key={art.id}
                onClick={() => navigate(`/arts/${art.slug}`)}
                className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:-translate-y-[10px] hover:scale-[1.02] hover:border-blue-500/40 dark:hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)]"
              >
                {/* Image Container */}
                <div className="w-full aspect-[4/3] rounded-[24px] bg-[#eef6fc] dark:bg-slate-800/50 overflow-hidden relative mb-4">
                  <img
                    src={art.imageUrl}
                    alt={`${art.name} - Rubik's Cube Art Pattern (${art.type})`}
                    title={`${art.name} - Rubik's Cube Art Pattern (${art.type})`}
                    className="w-full h-full object-cover filter drop-shadow-sm transition-transform duration-400 ease-in-out group-hover:scale-[1.35]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x225.png?text=${art.id}`;
                    }}
                  />
                </div>

                {/* Card Info */}
                <div className="px-1">
                  <h3 className="text-[1.1rem] font-bold text-[#1e293b] dark:text-white mb-1 truncate">{art.name}</h3>
                  <div className="text-sm text-[#64748b] dark:text-slate-400 font-medium mb-4">#{art.id}</div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 transition-all duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {art.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 transition-all duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {art.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 transition-all duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {art.moveCount} Moves
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
};
