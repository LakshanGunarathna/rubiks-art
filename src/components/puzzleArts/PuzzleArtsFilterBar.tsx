import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faCubes, faTrophy, faChevronDown, faChevronUp, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

export const CUBE_TYPES = [
  { id: '2x2x2', label: 'Mini (2x2)' },
  { id: '3x3x3', label: 'Standard (3x3)' },
  { id: '4x4x4', label: 'Revenge (4x4)' },
  { id: '5x5x5', label: "Professor (5x5)" },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Extreme', 'Ultra'];

export interface PuzzleArtsFilterBarProps {
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  diffFilter: string;
  setDiffFilter: (filter: string) => void;
  totalCount: number;
  currentCount: number;
  typeCounts: Record<string, number>;
  diffCounts: Record<string, number>;
}

export const PuzzleArtsFilterBar: React.FC<PuzzleArtsFilterBarProps> = ({
  typeFilter,
  setTypeFilter,
  diffFilter,
  setDiffFilter,
  totalCount,
  currentCount,
  typeCounts,
  diffCounts,
}) => {
  const isFiltered = typeFilter !== 'All' || diffFilter !== 'All';
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    setTypeFilter('All');
    setDiffFilter('All');
  };

  const activeCubeLabel = CUBE_TYPES.find(t => t.id === typeFilter)?.label;

  return (
    <div 
      className="w-full rounded-2xl p-4 border backdrop-blur-md shadow-sm transition-all duration-300"
      style={{ backgroundColor: 'var(--dropdown-bg)', borderColor: 'var(--nav-border)' }}
    >
      {/* Slim Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Filter Toggle & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-all cursor-pointer border border-blue-500/20"
          >
            <FontAwesomeIcon icon={faFilter} className="text-xs" />
            <span>Filter Patterns</span>
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-[10px] ml-1" />
          </button>

          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Showing <strong className="text-blue-500">{currentCount}</strong> of {totalCount}
          </span>
        </div>

        {/* Middle: Active Filter Badges when collapsed */}
        <div className="flex items-center gap-2 flex-wrap">
          {typeFilter !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              <FontAwesomeIcon icon={faCubes} className="text-[10px]" />
              {activeCubeLabel}
              <button onClick={() => setTypeFilter('All')} className="hover:text-blue-800 dark:hover:text-blue-200 ml-0.5">
                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
              </button>
            </span>
          )}

          {diffFilter !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <FontAwesomeIcon icon={faTrophy} className="text-[10px]" />
              {diffFilter}
              <button onClick={() => setDiffFilter('All')} className="hover:text-amber-800 dark:hover:text-amber-200 ml-0.5">
                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
              </button>
            </span>
          )}

          {/* Reset button */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
              title="Reset all filters"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-dashed space-y-3 transition-all duration-300" style={{ borderColor: 'var(--nav-border)' }}>
          
          {/* Cube Size Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-bold min-w-[90px] flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <FontAwesomeIcon icon={faCubes} className="text-blue-400 text-xs" />
              Cube Size:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setTypeFilter('All')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  typeFilter === 'All'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Cubes
              </button>
              {CUBE_TYPES.map(type => {
                const active = typeFilter === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setTypeFilter(active ? 'All' : type.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type.label}
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      active ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {typeCounts[type.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-bold min-w-[90px] flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <FontAwesomeIcon icon={faTrophy} className="text-amber-400 text-xs" />
              Difficulty:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setDiffFilter('All')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  diffFilter === 'All'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Levels
              </button>
              {DIFFICULTIES.map(diff => {
                const active = diffFilter === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setDiffFilter(active ? 'All' : diff)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      active ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {diffCounts[diff]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
