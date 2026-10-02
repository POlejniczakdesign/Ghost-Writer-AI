import React from 'react';
import { Feather, BookOpen, Headphones, Sparkles, MessageSquareCode, RotateCcw } from 'lucide-react';
import { GenreType } from '../types/ghostwriter';

interface HeaderProps {
  genre: GenreType;
  onGenreChange: (g: GenreType) => void;
  totalWords: number;
  completedSections: number;
  totalSections: number;
  onOpenConsultant: () => void;
  onResetProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  genre,
  onGenreChange,
  totalWords,
  completedSections,
  totalSections,
  onOpenConsultant,
  onResetProject,
}) => {
  // Approximate audiobook calculation: ~150 words per minute
  const audioMinutesTotal = Math.round(totalWords / 150);
  const audioHours = Math.floor(audioMinutesTotal / 60);
  const audioMinutes = audioMinutesTotal % 60;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30 text-zinc-950">
            <Feather className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-amber-200">
                GHOST-WRITER AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono-tag font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Amazon KDP & Audible Publishing Strategist
            </p>
          </div>
        </div>

        {/* Live Manuscript Metrics */}
        <div className="hidden md:flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 px-4 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Words:</span>
            <span className="font-semibold text-zinc-200">{totalWords.toLocaleString()}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400">Audible:</span>
            <span className="font-semibold text-zinc-200">
              {audioHours > 0 ? `${audioHours}h ` : ''}{audioMinutes}m
            </span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Sections:</span>
            <span className="font-semibold text-zinc-200">
              {completedSections}/{totalSections}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Genre Quick Toggle */}
          <div className="relative">
            <select
              value={genre}
              onChange={(e) => onGenreChange(e.target.value as GenreType)}
              className="bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 text-xs font-medium text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="Business/Non-Fiction">Business / Non-Fiction</option>
              <option value="Romance/Harlequin">Romance / Harlequin</option>
              <option value="Fantasy">Fantasy & LitRPG</option>
            </select>
          </div>

          {/* Publishing Strategist AI Consultant */}
          <button
            onClick={onOpenConsultant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/40 text-xs font-medium text-amber-300 transition-colors shadow-sm cursor-pointer"
            title="Open Ghost-Writer AI Strategy Consultant"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ask Strategist</span>
          </button>

          {/* Reset / New Project */}
          <button
            onClick={onResetProject}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Start New Book Project"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
