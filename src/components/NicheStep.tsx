import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Flame,
  Briefcase,
  Heart,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { GenreType, NicheProposal } from '../types/ghostwriter';

interface NicheStepProps {
  genre: GenreType;
  onGenreSelect: (genre: GenreType) => void;
  niches: NicheProposal[];
  selectedNiche: NicheProposal | null;
  onSelectNiche: (niche: NicheProposal) => void;
  onGenerateCustomNiches: (customAngle: string) => Promise<void>;
  isLoading: boolean;
  onProceedToOutline: () => void;
}

export const NicheStep: React.FC<NicheStepProps> = ({
  genre,
  onGenreSelect,
  niches,
  selectedNiche,
  onSelectNiche,
  onGenerateCustomNiches,
  isLoading,
  onProceedToOutline,
}) => {
  const [customAngleInput, setCustomAngleInput] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');

  const genresList: {
    type: GenreType;
    label: string;
    icon: any;
    desc: string;
    kdpAngle: string;
  }[] = [
    {
      type: 'Business/Non-Fiction',
      label: 'Business / Non-Fiction',
      icon: Briefcase,
      desc: 'Actionable playbooks, tactical frameworks, executive guides & zero-employee manuals.',
      kdpAngle: 'High paperback/Kindle prices ($14.99–$24.99) & lucrative corporate audio sales.',
    },
    {
      type: 'Romance/Harlequin',
      label: 'Romance / Harlequin',
      icon: Heart,
      desc: 'High-tension tropes, billionaire rivals, fake marriage, enemies-to-lovers & small-town healing.',
      kdpAngle: '#1 highest Kindle Unlimited page-read velocity & rabid BookTok fandoms.',
    },
    {
      type: 'Fantasy',
      label: 'Fantasy & LitRPG',
      icon: Wand2,
      desc: 'Cozy low-stakes portal fantasy, hard magic LitRPG, progression dungeons & gaslamp mysteries.',
      kdpAngle: 'Audible credit dominance with 10+ hour audiobooks and fervent series read-through.',
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAngleInput.trim() || isLoading) return;
    onGenerateCustomNiches(customAngleInput);
  };

  const handleApplyCustomTitle = (niche: NicheProposal) => {
    if (customTitle.trim()) {
      onSelectNiche({ ...niche, workingTitle: customTitle.trim() });
    }
    setEditingTitleId(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Ghost-Writer AI Official Introduction */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-amber-950/20 p-6 md:p-8 shadow-xl shadow-black/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>GHOST-WRITER AI v1.0 MASTER STRATEGIST</span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-100">
              Transform Untapped Niches into Bestselling <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Kindle eBooks & Audible Audiobooks
              </span>
            </h1>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-serif-book">
              Greetings. I am your professional author, ghost-writer, and niche publishing strategist. 
              My doctrine is uncompromising: <strong className="text-amber-200">we never write an entire book in a single shallow AI dump.</strong> 
              Instead, we construct books the way commercial masterminds do: identifying unsaturated KDP search demand, 
              architecting a watertight chapter blueprint, and writing section-by-section with visceral sensory detail, 
              realistic dialogue, and magnetic pacing.
            </p>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 p-4 rounded-xl shrink-0 w-full md:w-64 space-y-2">
            <div className="text-[11px] font-mono-tag font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Market Focus
            </div>
            <p className="text-xs text-zinc-300">
              3 High-Profit Publishing Arenas ready for commercial deployment:
            </p>
            <div className="text-[11px] space-y-1 text-zinc-400 pt-1 border-t border-zinc-800">
              <div>✓ Business / Non-Fiction</div>
              <div>✓ Romance / Harlequin</div>
              <div>✓ Fantasy & LitRPG</div>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Selector */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Which high-profit genre are we conquering today?
          </h2>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Click any genre to reveal targeted commercial proposals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {genresList.map((g) => {
            const Icon = g.icon;
            const isSelected = genre === g.type;

            return (
              <button
                key={g.type}
                onClick={() => onGenreSelect(g.type)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                    : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-amber-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono-tag font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      ACTIVE GENRE
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-zinc-100">{g.label}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{g.desc}</p>
                <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] text-amber-300/80">
                  {g.kdpAngle}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Custom Idea / Seed Bar */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <form onSubmit={handleCustomSubmit} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Have a specific idea or creative twist? (Optional)
            </label>
            <span className="text-[11px] text-zinc-500">
              Or leave blank and browse Ghost-Writer AI's top 3 proposals below
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customAngleInput}
              onChange={(e) => setCustomAngleInput(e.target.value)}
              placeholder="e.g., 'A cozy tea shop fantasy with an amnesiac dragon' or 'B2B Fractional AI COO guide'"
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !customAngleInput.trim()}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate 3 Targeted Niches</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 3 Specific Profitable Niche Proposals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              3 Unsaturated, High-Profit Niche Proposals for {genre}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Vetted for high Kindle Unlimited page reads, high Amazon review velocity, and Audible narration appeal.
            </p>
          </div>
          <button
            onClick={() => onGenerateCustomNiches('Provide 3 fresh, innovative, high-converting alternative niches')}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate Proposals</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {niches.map((niche, idx) => {
            const isSelected = selectedNiche?.id === niche.id;

            return (
              <div
                key={niche.id || idx}
                onClick={() => onSelectNiche(niche)}
                className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 shadow-xl shadow-amber-950/30 ring-2 ring-amber-500/40'
                    : 'bg-zinc-900/70 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                {/* Header Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-tag font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      Option {idx + 1}: {niche.subgenre}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  {/* Catchy Working Title */}
                  <div>
                    {editingTitleId === niche.id ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-amber-500 rounded p-2 text-xs text-zinc-100 focus:outline-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingTitleId(null)}
                            className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyCustomTitle(niche)}
                            className="text-[11px] px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold"
                          >
                            Save Title
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-display font-bold text-sm md:text-base text-zinc-100 leading-snug group flex items-start justify-between">
                        <span>{niche.workingTitle}</span>
                      </h3>
                    )}
                  </div>

                  {/* Irresistible Blurb Hook */}
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
                    <p className="text-xs text-zinc-300 font-serif-book italic leading-relaxed">
                      "{niche.hook}"
                    </p>
                  </div>

                  {/* Target Audience Profile */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                      <Target className="w-3 h-3 text-cyan-400" />
                      <span>Target Audience:</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {niche.targetAudience}
                    </p>
                  </div>

                  {/* Profit Angle / Low Competition Edge */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>KDP & Audible Profit Angle:</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {niche.profitAngle}
                    </p>
                  </div>

                  {/* Core Tropes or Frameworks */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono-tag uppercase text-zinc-500 font-semibold">
                      Core Frameworks / Tropes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {niche.coreTropesOrFrameworks?.map((trope, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700/60"
                        >
                          {trope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Selection Button */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono-tag text-zinc-500">
                    {niche.estimatedWordCount}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNiche(niche);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Choose Niche'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step Progression Callout */}
      {selectedNiche && (
        <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-zinc-900 border border-amber-500/40 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slideUp">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono-tag font-bold uppercase text-amber-300">
                Niche Selected: {selectedNiche.subgenre}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-zinc-100">
              Ready to construct the Comprehensive 10-Chapter & Character Blueprint
            </h4>
            <p className="text-xs text-zinc-400 font-serif-book">
              Ghost-Writer AI v1.0 will now engineer the complete architectural dossier: character goals, fatal flaws, world-building mechanics, and chapter-by-chapter scene beats.
            </p>
          </div>

          <button
            onClick={onProceedToOutline}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 2: The Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}
    </div>
  );
};
