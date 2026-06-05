import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faBrain, 
  faSlidersH, 
  faCubes, 
  faCheckCircle, 
  faTrophy 
} from '@fortawesome/free-solid-svg-icons';

export interface GuideStep {
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}

export interface GuideCard {
  title: string;
  desc: string | string[];
  icon: string;
  accent: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  wide?: boolean;
}

export interface GuideContent {
  title: string;
  subtitle: string;
  steps: GuideStep[];
  colorLayoutSub: string;
  cards: GuideCard[];
}

interface SolverGuideSectionProps {
  guide: GuideContent;
}

const ICON_MAP: Record<string, any> = {
  sliders: faSlidersH,
  cubes: faCubes,
  check: faCheckCircle,
  trophy: faTrophy,
};

const COLOR_LAYOUT = [
  { label: 'White', face: 'Top (U)', bg: '#ffffff', text: 'text-black border border-black/10' },
  { label: 'Yellow', face: 'Bottom (D)', bg: '#ffd500', text: 'text-black' },
  { label: 'Red', face: 'Front (F)', bg: '#b71234', text: 'text-white' },
  { label: 'Orange', face: 'Back (B)', bg: '#ff5800', text: 'text-white' },
  { label: 'Blue', face: 'Right (R)', bg: '#0046ad', text: 'text-white' },
  { label: 'Green', face: 'Left (L)', bg: '#009b48', text: 'text-white' },
];

const formatText = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderDesc = (desc: string | string[]) => {
  if (Array.isArray(desc)) {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {desc.map((item, i) => (
          <li key={i}>{formatText(item)}</li>
        ))}
      </ul>
    );
  }
  return <p>{formatText(desc)}</p>;
};

export const SolverGuideSection: React.FC<SolverGuideSectionProps> = ({ guide }) => {
  return (
    <>
      {/* Solver Guide & Information Divider */}
      <div className="w-full flex items-center my-12">
        <div className="flex-grow border-t font-sans" style={{ borderColor: 'var(--nav-border)' }}></div>
        <div className="px-4 text-[var(--text-secondary)] flex items-center gap-2">
          <FontAwesomeIcon icon={faBrain} size="lg" />
        </div>
        <div className="flex-grow border-t" style={{ borderColor: 'var(--nav-border)' }}></div>
      </div>

      {/* Solver Guide Section */}
      <section className="w-full relative px-2 sm:px-4 select-none">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20 text-blue-500">
            <FontAwesomeIcon icon={faBookOpen} size="lg" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2" style={{ color: 'var(--text-primary)' }}>
            {guide.title}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-2xl mx-auto">
            {guide.subtitle}
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {guide.steps.map((step, idx) => (
            <div 
              key={idx}
              className="border rounded-3xl p-6 backdrop-blur-md transition-all duration-300 shadow-sm"
              style={{ 
                borderColor: step.border,
                backgroundColor: step.bg
              }}
            >
              <div 
                className="w-8 h-8 rounded-xl font-bold flex items-center justify-center mb-4 text-sm text-white"
                style={{ backgroundColor: step.color }}
              >
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {renderDesc(step.desc)}
              </div>
            </div>
          ))}
        </div>

        {/* Color Reference */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold font-heading mb-1" style={{ color: 'var(--text-primary)' }}>
            Standard Color Layout
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {guide.colorLayoutSub}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {COLOR_LAYOUT.map((color, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center p-4 bg-white/40 dark:bg-slate-900/40 border rounded-2xl min-w-[110px] text-center shadow-sm"
              style={{ borderColor: 'var(--nav-border)' }}
            >
              <div 
                className={`w-8 h-8 rounded-full shadow-inner mb-2 ${color.text || ''}`}
                style={{ backgroundColor: color.bg }}
              />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {color.label}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {color.face}
              </span>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guide.cards.map((card, idx) => {
            const icon = ICON_MAP[card.icon] || faCheckCircle;
            return (
              <div 
                key={idx}
                className={`p-6 rounded-3xl border backdrop-blur-md bg-white/40 dark:bg-slate-900/40 shadow-sm transition-all duration-300 hover:shadow-md ${card.wide ? 'md:col-span-2' : 'col-span-1'}`}
                style={{ borderColor: 'var(--nav-border)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ 
                      backgroundColor: card.iconBg,
                      borderColor: card.iconBorder,
                      color: card.iconColor
                    }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </div>
                  <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {card.title}
                  </h4>
                </div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {renderDesc(card.desc)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
