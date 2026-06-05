import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb,
  faCalendarAlt,
  faCubes,
  faBolt,
  faStopwatch,
  faLayerGroup,
  faHistory,
  faInfoCircle,
  faBrain,
  faTrophy,
  faPuzzlePiece,
  faExclamationTriangle,
  faCube
} from '@fortawesome/free-solid-svg-icons';

export interface FactStat {
  icon: string;
  number: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  accent: string;
}

export interface FactCard {
  title: string;
  desc: string;
  icon: string;
  accent: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  wide?: boolean;
}

export interface TimelineItem {
  year: string;
  label: string;
  color: string;
}

export interface FactsContent {
  subtitle: string;
  stats: FactStat[];
  cards: FactCard[];
  timeline: TimelineItem[];
}

interface CubeFactsSectionProps {
  facts: FactsContent;
}

const ICON_MAP: Record<string, any> = {
  calendar: faCalendarAlt,
  cubes: faCubes,
  bolt: faBolt,
  stopwatch: faStopwatch,
  layerGroup: faLayerGroup,
  history: faHistory,
  info: faInfoCircle,
  brain: faBrain,
  trophy: faTrophy,
  puzzle: faPuzzlePiece,
  exclamation: faExclamationTriangle,
};

const formatText = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-blue-600 dark:text-blue-400">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export const CubeFactsSection: React.FC<CubeFactsSectionProps> = ({ facts }) => {
  return (
    <>
      {/* Divider */}
      <div className="w-full flex items-center my-12">
        <div className="flex-grow border-t font-sans" style={{ borderColor: 'var(--nav-border)' }}></div>
        <div className="px-4 text-[var(--text-secondary)] flex items-center gap-2">
          <FontAwesomeIcon icon={faCube} size="lg" />
        </div>
        <div className="flex-grow border-t" style={{ borderColor: 'var(--nav-border)' }}></div>
      </div>

      {/* Facts Section */}
      <section className="w-full relative px-2 sm:px-4 select-none">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4 border border-orange-500/20 text-orange-500">
            <FontAwesomeIcon icon={faLightbulb} size="lg" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2 text-[var(--text-primary)]">
            Interesting Facts & Information
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-2xl mx-auto">
            {facts.subtitle}
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
          {facts.stats.map((stat, idx) => {
            const icon = ICON_MAP[stat.icon] || faInfoCircle;
            return (
              <div 
                key={idx}
                className="relative rounded-3xl p-6 border backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center overflow-hidden"
                style={{
                  borderColor: stat.border,
                  backgroundColor: stat.bg,
                }}
              >
                {/* Top accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ background: stat.accent }}
                />
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border text-lg"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderColor: stat.border,
                    color: stat.color 
                  }}
                >
                  <FontAwesomeIcon icon={icon} />
                </div>
                <div className="text-2xl font-bold font-heading mb-1 text-[var(--text-primary)]">
                  {stat.number}
                </div>
                <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 relative z-10">
          {facts.cards.map((card, idx) => {
            const icon = ICON_MAP[card.icon] || faInfoCircle;
            return (
              <div 
                key={idx}
                className={`p-6 rounded-3xl border backdrop-blur-md bg-white/40 dark:bg-slate-900/40 shadow-sm transition-all duration-300 hover:shadow-md ${card.wide ? 'md:col-span-2' : 'col-span-1'}`}
                style={{ borderColor: 'var(--nav-border)' }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 text-lg"
                    style={{ 
                      backgroundColor: card.iconBg,
                      borderColor: card.iconBorder,
                      color: card.iconColor
                    }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2 text-[var(--text-primary)]">
                      {card.title}
                    </h4>
                    <div className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {formatText(card.desc)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Section */}
        <div className="text-center mb-8 relative z-10">
          <h3 className="text-xl font-bold font-heading text-[var(--text-primary)] mb-1">
            Historical Timeline
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Milestones and major historical achievements
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-stretch gap-6 md:gap-4 md:before:content-[''] md:before:absolute md:before:top-1/2 md:before:left-4 md:before:right-4 md:before:h-0.5 md:before:bg-[var(--nav-border)] md:before:-translate-y-1/2 relative z-10">
          {facts.timeline.map((item, idx) => (
            <div 
              key={idx}
              className="relative flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-2 bg-white/30 dark:bg-slate-900/30 md:bg-transparent md:dark:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-[var(--nav-border)] md:flex-1"
            >
              {/* Timeline marker */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm md:mx-auto z-10"
                style={{ backgroundColor: item.color }}
              >
                {item.year.match(/\d{4}/)?.[0] || '•'}
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)] md:mt-2">
                  {item.year}
                </div>
                <div className="text-xs text-[var(--text-secondary)] font-medium leading-tight">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
