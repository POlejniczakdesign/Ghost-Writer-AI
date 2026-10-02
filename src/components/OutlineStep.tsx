import React, { useState } from 'react';
import {
  Network,
  Users,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Edit3,
  CheckCircle,
  Plus,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { BookBlueprint, GenreType, OutlineChapter } from '../types/ghostwriter';

interface OutlineStepProps {
  blueprint: BookBlueprint | null;
  genre: GenreType;
  isLoading: boolean;
  onRegenerateOutline: (feedback?: string) => Promise<void>;
  onApproveAndProceed: () => void;
  onUpdateBlueprint: (updated: BookBlueprint) => void;
}

export const OutlineStep: React.FC<OutlineStepProps> = ({
  blueprint,
  genre,
  isLoading,
  onRegenerateOutline,
  onApproveAndProceed,
  onUpdateBlueprint,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'characters' | 'chapters'>('chapters');
  const [feedbackText, setFeedbackText] = useState('');
  const [expandedChapterIndex, setExpandedChapterIndex] = useState<number>(0);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [titleEdit, setTitleEdit] = useState(blueprint?.title || '');
  const [subtitleEdit, setSubtitleEdit] = useState(blueprint?.subtitle || '');
  const [loglineEdit, setLoglineEdit] = useState(blueprint?.logline || '');

  if (!blueprint) {
    return (
      <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-4">
        <Network className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
        <h3 className="text-lg font-semibold text-zinc-100">Architecting Your Manuscript Blueprint...</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto font-serif-book">
          Ghost-Writer AI v1.0 is engineering character dossiers, world-building constraints, and a comprehensive 10-chapter logical framework.
        </p>
        <button
          onClick={() => onRegenerateOutline()}
          disabled={isLoading}
          className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Generate Blueprint Now</span>
        </button>
      </div>
    );
  }

  const isFiction = genre === 'Romance/Harlequin' || genre === 'Fantasy';

  const handleSaveMeta = () => {
    onUpdateBlueprint({
      ...blueprint,
      title: titleEdit,
      subtitle: subtitleEdit,
      logline: loglineEdit,
    });
    setIsEditingMeta(false);
  };

  const handleAddChapter = () => {
    const newChapterNum = blueprint.chapters.length + 1;
    const newChapter: OutlineChapter = {
      chapterNumber: newChapterNum,
      title: `Chapter ${newChapterNum}: The Crucial Turning Point`,
      actOrPhase: 'Act II - Complications',
      synopsis: 'A vital development shifts the stakes and forces immediate confrontation.',
      keyTakeawayOrCliffhanger: 'A revelation that changes everything.',
      sections: [
        {
          sectionNumber: 1,
          title: 'Section 1: The Inciting Collision',
          objective: 'Establish immediate scene tension and reveal a crucial clue.',
          conflictOrCoreConcept: 'Opposing interests between key forces.',
          sensoryOrFrameworkFocus: 'Atmospheric pressure, sensory claustrophobia.',
          estimatedWordTarget: '1,800 words',
          status: 'pending',
        },
        {
          sectionNumber: 2,
          title: 'Section 2: The Escalation & Aftermath',
          objective: 'Force a difficult choice with permanent consequences.',
          conflictOrCoreConcept: 'Failure to retreat leads to higher vulnerability.',
          sensoryOrFrameworkFocus: 'Visceral reaction and closing cliffhanger.',
          estimatedWordTarget: '1,800 words',
          status: 'pending',
        },
      ],
    };

    onUpdateBlueprint({
      ...blueprint,
      chapters: [...blueprint.chapters, newChapter],
    });
    setExpandedChapterIndex(blueprint.chapters.length);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isLoading) return;
    onRegenerateOutline(feedbackText);
    setFeedbackText('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Blueprint Header */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-tag font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                STEP 2: THE ARCHITECTURE BLUEPRINT
              </span>
              <span className="text-xs text-zinc-500">
                {blueprint.chapters.length} Chapters •{' '}
                {blueprint.chapters.reduce((acc, c) => acc + c.sections.length, 0)} Granular Sections
              </span>
            </div>

            {isEditingMeta ? (
              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={titleEdit}
                  onChange={(e) => setTitleEdit(e.target.value)}
                  placeholder="Book Title"
                  className="w-full bg-zinc-950 border border-amber-500 rounded px-3 py-1.5 text-base font-bold text-zinc-100"
                />
                <input
                  type="text"
                  value={subtitleEdit}
                  onChange={(e) => setSubtitleEdit(e.target.value)}
                  placeholder="Subtitle"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-300"
                />
                <textarea
                  value={loglineEdit}
                  onChange={(e) => setLoglineEdit(e.target.value)}
                  placeholder="Logline"
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-300"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingMeta(false)}
                    className="text-xs px-3 py-1 rounded bg-zinc-800 text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMeta}
                    className="text-xs px-3 py-1 rounded bg-amber-500 text-zinc-950 font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100">
                    {blueprint.title}
                  </h1>
                  <button
                    onClick={() => {
                      setTitleEdit(blueprint.title);
                      setSubtitleEdit(blueprint.subtitle);
                      setLoglineEdit(blueprint.logline);
                      setIsEditingMeta(true);
                    }}
                    className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-xs md:text-sm text-amber-300/90 font-medium mt-0.5">
                  {blueprint.subtitle}
                </p>
                <p className="text-xs text-zinc-400 mt-2 font-serif-book italic max-w-3xl">
                  "{blueprint.logline}"
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onRegenerateOutline()}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate Blueprint</span>
            </button>

            <button
              onClick={onApproveAndProceed}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve & Open Writing Factory</span>
            </button>
          </div>
        </div>

        {/* Blueprint Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'chapters'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Chapter & Scene Architecture ({blueprint.chapters.length})</span>
          </button>

          {isFiction && blueprint.fictionDossier && (
            <button
              onClick={() => setActiveTab('characters')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'characters'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Character Profiles ({blueprint.fictionDossier.characters.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'architecture'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>
              {isFiction ? 'World Rules & Emotional Core' : 'Non-Fiction Thesis & Frameworks'}
            </span>
          </button>
        </div>

        {/* TAB 1: CHAPTERS & SCENES ARCHITECTURE */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">
                Structure Engine: <strong className="text-amber-400">{blueprint.structureType}</strong>
              </span>
              <button
                onClick={handleAddChapter}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Extra Chapter</span>
              </button>
            </div>

            <div className="space-y-3">
              {blueprint.chapters.map((ch, chIdx) => {
                const isExpanded = expandedChapterIndex === chIdx;

                return (
                  <div
                    key={chIdx}
                    className="border border-zinc-800 bg-zinc-950/50 rounded-xl overflow-hidden transition-all"
                  >
                    {/* Chapter Bar */}
                    <div
                      onClick={() => setExpandedChapterIndex(isExpanded ? -1 : chIdx)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-xs font-mono-tag font-bold text-amber-400">
                          {ch.chapterNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono-tag font-semibold text-zinc-500 uppercase">
                              {ch.actOrPhase}
                            </span>
                            <span className="text-[10px] text-zinc-600">•</span>
                            <span className="text-[10px] text-zinc-500">
                              {ch.sections.length} Section{ch.sections.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-zinc-200">
                            {ch.title}
                          </h4>
                        </div>
                      </div>

                      <div className="text-xs text-zinc-500 font-mono-tag">
                        {isExpanded ? 'Collapse' : 'Expand Beats'}
                      </div>
                    </div>

                    {/* Expanded Chapter Details */}
                    {isExpanded && (
                      <div className="p-4 pt-2 border-t border-zinc-800/80 bg-zinc-900/30 space-y-4">
                        {/* Synopsis */}
                        <div className="text-xs text-zinc-300 font-serif-book italic bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                          <strong>Narrative Arc:</strong> {ch.synopsis}
                        </div>

                        {/* Sections List */}
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-mono-tag font-bold text-amber-400 uppercase tracking-wider">
                            Iterative Writing Sections:
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ch.sections.map((sec, secIdx) => (
                              <div
                                key={secIdx}
                                className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono-tag font-bold text-zinc-400">
                                    Section {sec.sectionNumber}
                                  </span>
                                  <span className="text-[10px] text-amber-400 font-mono-tag">
                                    Target: {sec.estimatedWordTarget}
                                  </span>
                                </div>
                                <h5 className="text-xs font-semibold text-zinc-200">
                                  {sec.title}
                                </h5>
                                <div className="space-y-1 text-[11px]">
                                  <p className="text-zinc-400">
                                    <strong className="text-zinc-300">Objective:</strong> {sec.objective}
                                  </p>
                                  <p className="text-zinc-400">
                                    <strong className="text-zinc-300">Core Tension/Concept:</strong> {sec.conflictOrCoreConcept}
                                  </p>
                                  <p className="text-zinc-400">
                                    <strong className="text-zinc-300">Sensory Focus:</strong> {sec.sensoryOrFrameworkFocus}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Chapter Cliffhanger / Key Takeaway */}
                        <div className="text-[11px] bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-amber-300">
                            <strong>Closing Hook:</strong> {ch.keyTakeawayOrCliffhanger}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHARACTER PROFILES (FOR FICTION) */}
        {activeTab === 'characters' && isFiction && blueprint.fictionDossier && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Psychological Character Dossiers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blueprint.fictionDossier.characters.map((char, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-zinc-100">
                        {char.name}
                      </h4>
                      <span className="text-[10px] font-mono-tag font-semibold text-amber-400 uppercase">
                        {char.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Driving Goal:</span>
                      <p className="text-zinc-200">{char.goal}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Fatal Flaw / Blindspot:</span>
                      <p className="text-zinc-300">{char.flaw}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Guarded Secret:</span>
                      <p className="text-zinc-300">{char.secret}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Stakes (What happens if they fail):</span>
                      <p className="text-amber-300/90 font-medium">{char.stakes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WORLD RULES & CORE FRAMEWORKS */}
        {activeTab === 'architecture' && (
          <div className="space-y-5">
            {isFiction && blueprint.fictionDossier ? (
              <div className="space-y-4">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-mono-tag font-bold text-amber-400 uppercase">
                    Emotional Core & Romantic / Heroic Friction
                  </h4>
                  <p className="text-xs text-zinc-200 leading-relaxed font-serif-book">
                    {blueprint.fictionDossier.emotionalCore}
                  </p>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-mono-tag font-bold text-amber-400 uppercase">
                    World-Building Constraints & Magic / Setting Mechanics
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {blueprint.fictionDossier.worldBuildingRules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : blueprint.nonFictionFramework ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-mono-tag font-bold text-amber-400 uppercase">
                    Core Thesis
                  </h4>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {blueprint.nonFictionFramework.coreThesis}
                  </p>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-mono-tag font-bold text-amber-400 uppercase">
                    Primary Signature Model
                  </h4>
                  <p className="text-xs text-amber-300 font-semibold">
                    {blueprint.nonFictionFramework.primaryModelName}
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {blueprint.nonFictionFramework.transformationPromise}
                  </p>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-2 md:col-span-2">
                  <h4 className="text-xs font-mono-tag font-bold text-emerald-400 uppercase">
                    Target Reader Transformation Outcome
                  </h4>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {blueprint.nonFictionFramework.targetReaderOutcome}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* Author Adjustments & Feedback Loop */}
      <section className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Author Feedback & Blueprint Adjustments
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Want to change a character's secret, add a rival romance subplot, alter the midpoint twist, or insert a specific case study? Instruct Ghost-Writer AI below:
        </p>

        <form onSubmit={handleFeedbackSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="e.g., 'Make the romantic lead more reluctant to accept the contract' or 'Add a chapter on pricing psychology'"
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={isLoading || !feedbackText.trim()}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Apply Adjustments</span>
          </button>
        </form>
      </section>

      {/* Proceed to Writing Factory CTA */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-zinc-900 border border-amber-500/40 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono-tag font-bold uppercase text-amber-300">
              Architecture Approved
            </span>
          </div>
          <h4 className="text-base font-semibold text-zinc-100">
            Commence Step 3: Iterative Section Writing
          </h4>
          <p className="text-xs text-zinc-400 font-serif-book">
            Ghost-Writer AI v1.0 will write <strong>Chapter 1, Section 1</strong> targeting ~1,800 words with deep sensory immersion, realistic dialogue, and engaging pacing.
          </p>
        </div>

        <button
          onClick={onApproveAndProceed}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Open Writing Factory</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
