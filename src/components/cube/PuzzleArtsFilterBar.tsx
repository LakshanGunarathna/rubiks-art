import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faSlidersH, faCubes, faTrophy, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export const CUBE_TYPES = [
  { id: '2x2x2', label: 'Mini Cube (2x2x2)' },
  { id: '3x3x3', label: 'Standard Cube (3x3x3)' },
  { id: '4x4x4', label: 'Revenge Cube (4x4x4)' },
  { id: '5x5x5', label: "Professor's Cube (5x5x5)" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleReset = () => {
    setTypeFilter('All');
    setDiffFilter('All');
  };

  return (
    <div 
      className="w-full rounded-3xl p-5 border backdrop-blur-md shadow-sm transition-all duration-300"
      style={{ backgroundColor: 'var(--dropdown-bg)', borderColor: 'var(--nav-border)' }}
    >
      {/* Header Info + Reset */}
      <div 
        className="flex items-center justify-between gap-4 pb-4 border-b border-dashed mb-4" 
        style={{ borderColor: 'var(--nav-border)' }}
      >
        <div 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between flex-1 lg:flex-initial cursor-pointer lg:cursor-default select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <FontAwesomeIcon icon={faSlidersH} size="lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Filters</h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Showing <span className="font-semibold text-blue-500">{currentCount}</span> of {totalCount} patterns
              </p>
            </div>
          </div>
          
          <button className="lg:hidden ml-4 p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <FontAwesomeIcon icon={mobileOpen ? faChevronUp : faChevronDown} className="w-4 h-4" />
          </button>
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Filters</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </div>

      {/* Filter Rows */}
      <div className={`${mobileOpen ? 'flex' : 'hidden lg:flex'} flex-col gap-5`}>
        {/* Cubes Selection */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <span className="text-sm font-bold min-w-[120px] flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <FontAwesomeIcon icon={faCubes} className="w-4 text-blue-400" />
            Cube Size:
          </span>
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setTypeFilter('All')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                typeFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/35'
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
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/35'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {type.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    active 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {typeCounts[type.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <span className="text-sm font-bold min-w-[120px] flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <FontAwesomeIcon icon={faTrophy} className="w-4 text-amber-400" />
            Difficulty:
          </span>
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setDiffFilter('All')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                diffFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/35'
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
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/35'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {diff}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    active
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {diffCounts[diff]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
