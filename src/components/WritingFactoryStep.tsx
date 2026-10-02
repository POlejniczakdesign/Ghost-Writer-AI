import React, { useState } from 'react';
import {
  PenTool,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  Headphones,
  Edit3,
  Eye,
  Sliders,
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Wand2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookBlueprint, GenreType, OutlineSection } from '../types/ghostwriter';

interface WritingFactoryStepProps {
  blueprint: BookBlueprint;
  genre: GenreType;
  currentChapterIdx: number;
  currentSectionIdx: number;
  onSelectSection: (chIdx: number, secIdx: number) => void;
  onStreamWriteSection: (
    targetWordCount: number,
    tone: string,
    directives: string,
    sceneNumber?: number,
    appendMode?: boolean
  ) => Promise<void>;
  onReviseSection: (instructions: string) => Promise<void>;
  onApproveSection: () => void;
  onUpdateSectionContent: (newContent: string) => void;
  onProceedToPublishing: () => void;
  isStreaming: boolean;
  streamingText: string;
}

export const WritingFactoryStep: React.FC<WritingFactoryStepProps> = ({
  blueprint,
  genre,
  currentChapterIdx,
  currentSectionIdx,
  onSelectSection,
  onStreamWriteSection,
  onReviseSection,
  onApproveSection,
  onUpdateSectionContent,
  onProceedToPublishing,
  isStreaming,
  streamingText,
}) => {
  const [targetWordCount, setTargetWordCount] = useState<number>(750);
  const [currentSceneNumber, setCurrentSceneNumber] = useState<number>(1);
  const [tonePreset, setTonePreset] = useState<string>(
    genre.includes('Romance')
      ? 'Electric Banter & High Emotional Tension'
      : genre.includes('Fantasy')
      ? 'Visceral Sensory World-Building & Sharp Pacing'
      : 'Authoritative, Actionable & Case-Driven'
  );
  const [customDirectives, setCustomDirectives] = useState('');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isManualEditMode, setIsManualEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentChapter = blueprint.chapters[currentChapterIdx] || blueprint.chapters[0];
  const currentSection: OutlineSection =
    currentChapter?.sections[currentSectionIdx] || currentChapter?.sections[0];

  const sectionContent = isStreaming ? streamingText : currentSection?.content || '';
  const wordCount = sectionContent ? sectionContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.ceil(wordCount / 220);
  const audioTimeMin = Math.ceil(wordCount / 150);

  // Total book completed count
  const allSections = blueprint.chapters.flatMap((c) => c.sections);
  const completedCount = allSections.filter((s) => s.status === 'completed').length;
  const totalCount = allSections.length;

  const handleStartWritingScene = (sceneNum = currentSceneNumber, append = false) => {
    onStreamWriteSection(targetWordCount, tonePreset, customDirectives, sceneNum, append);
  };

  const handleApplyRevision = (instruction?: string) => {
    const feedback = instruction || revisionFeedback;
    if (!feedback.trim()) return;
    onReviseSection(feedback);
    setRevisionFeedback('');
  };

  const handleApproveWithCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#10b981'],
    });
    onApproveSection();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Notice: The Critical Ghost-Writer Quality Mandate */}
      <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tag font-bold text-amber-400 uppercase tracking-wider">
                STEP 3: THE WRITING FACTORY
              </span>
              <span className="text-[11px] text-zinc-500">•</span>
              <span className="text-xs font-semibold text-zinc-300">
                Quality Mandate: Iterative Section-by-Section Synthesis
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-serif-book">
              We never dump a generic 50k manuscript at once. We write each section targeting 1,500–2,500 words, review & revise, then bridge to the next beat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] font-mono-tag text-zinc-500 block">Progress</span>
            <span className="text-xs font-bold text-zinc-200">
              {completedCount} of {totalCount} Sections Sealed
            </span>
          </div>
          <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.max(5, (completedCount / totalCount) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Chapter & Section Navigator */}
        <div
          className={`lg:col-span-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-4 ${
            sidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Manuscript Tree
              </h3>
            </div>
            <span className="text-[11px] font-mono-tag text-amber-400">
              Ch {currentChapterIdx + 1}, Sec {currentSectionIdx + 1}
            </span>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {blueprint.chapters.map((ch, chIdx) => {
              const isCurrentChapter = chIdx === currentChapterIdx;

              return (
                <div
                  key={chIdx}
                  className={`rounded-xl border transition-all ${
                    isCurrentChapter
                      ? 'border-amber-500/40 bg-zinc-950/70'
                      : 'border-zinc-800/80 bg-zinc-950/30'
                  }`}
                >
                  <div className="p-3 border-b border-zinc-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-zinc-800 text-amber-400 text-[10px] font-mono-tag font-bold flex items-center justify-center shrink-0">
                        {ch.chapterNumber}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">
                        {ch.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    {ch.sections.map((sec, secIdx) => {
                      const isSelected = chIdx === currentChapterIdx && secIdx === currentSectionIdx;
                      const isDone = sec.status === 'completed';
                      const hasDraft = !!sec.content;

                      return (
                        <button
                          key={secIdx}
                          onClick={() => onSelectSection(chIdx, secIdx)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                              : isDone
                              ? 'bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/30'
                              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] font-mono-tag opacity-75">
                              §{sec.sectionNumber}
                            </span>
                            <span className="truncate">{sec.title}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-950' : 'text-emerald-400'}`} />
                            ) : hasDraft ? (
                              <span className={`text-[10px] font-mono-tag px-1.5 py-0.2 rounded ${isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-amber-500/10 text-amber-400'}`}>
                                Draft
                              </span>
                            ) : (
                              <span className="text-[10px] opacity-40 font-mono-tag">Pending</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick jump to Step 4 if all or multiple sections completed */}
          {completedCount > 0 && (
            <button
              onClick={onProceedToPublishing}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Format for Kindle & Audible ({completedCount} sealed)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Section: Active Writing Canvas & Ghost-Writer AI Engine */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section Blueprint Objective Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-tag font-bold text-amber-400 uppercase tracking-wider">
                  Chapter {currentChapter.chapterNumber} • Section {currentSection.sectionNumber}
                </span>
                <h2 className="font-display text-lg md:text-xl font-bold text-zinc-100">
                  {currentSection.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono-tag hidden sm:inline">
                  {currentSection.estimatedWordTarget}
                </span>
                <span
                  className={`text-[10px] font-mono-tag font-bold uppercase px-2 py-0.5 rounded-full border ${
                    currentSection.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : currentSection.content
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {currentSection.status === 'completed'
                    ? 'Sealed'
                    : currentSection.content
                    ? 'Draft Under Review'
                    : 'Unwritten'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                  Scene Objective
                </span>
                <p className="text-zinc-200 mt-0.5">{currentSection.objective}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                  Core Friction / Concept
                </span>
                <p className="text-zinc-300 mt-0.5">{currentSection.conflictOrCoreConcept}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                  Sensory / Framework Focus
                </span>
                <p className="text-zinc-300 mt-0.5">{currentSection.sensoryOrFrameworkFocus}</p>
              </div>
            </div>

            {/* Scene-by-Scene Architecture Selector */}
            <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono-tag font-bold text-amber-400 uppercase">
                  Scene:
                </span>
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                  {[1, 2, 3].map((sNum) => (
                    <button
                      key={sNum}
                      onClick={() => setCurrentSceneNumber(sNum)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        currentSceneNumber === sNum
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Scene {sNum}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono-tag bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
                  ~600–800 words (Zero-Timeout)
                </span>
              </div>

              {/* Target Word Depth */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-medium">Depth:</span>
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                  {[600, 750, 900].map((count) => (
                    <button
                      key={count}
                      onClick={() => setTargetWordCount(count)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono-tag transition-colors cursor-pointer ${
                        targetWordCount === count
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {count}w
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Directives Selector */}
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={tonePreset}
                  onChange={(e) => setTonePreset(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 text-xs rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Visceral Sensory Depth & High Tension">
                    Visceral Sensory Depth & High Tension
                  </option>
                  <option value="Electric Banter & High Emotional Tension">
                    Electric Banter & High Emotional Tension
                  </option>
                  <option value="Authoritative, Actionable & Case-Driven">
                    Authoritative, Actionable & Case-Driven
                  </option>
                  <option value="Atmospheric, Lyrical & Expansive World-Building">
                    Atmospheric, Lyrical & Expansive World-Building
                  </option>
                  <option value="Fast-Paced, Punchy & Magnetic Pacing">
                    Fast-Paced, Punchy & Magnetic Pacing
                  </option>
                </select>
              </div>

              {/* Ghost-Writer Action Buttons */}
              <div className="flex items-center gap-2">
                {currentSection.content && (
                  <button
                    onClick={() => handleStartWritingScene(currentSceneNumber + 1, true)}
                    disabled={isStreaming}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Append Scene {currentSceneNumber < 3 ? currentSceneNumber + 1 : 'Beat'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleStartWritingScene(currentSceneNumber, false)}
                  disabled={isStreaming}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-950/40 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isStreaming ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing Scene {currentSceneNumber}...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-3.5 h-3.5" />
                      <span>{currentSection.content ? `Rewrite Scene ${currentSceneNumber}` : `Write Scene ${currentSceneNumber} Now`}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Manuscript Canvas Viewport */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Viewport Top Bar */}
            <div className="p-3.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-1.5 font-mono-tag">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    <strong className="text-zinc-200">{wordCount.toLocaleString()}</strong> words
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono-tag">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>~{readingTimeMin} min read</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono-tag">
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                  <span>~{audioTimeMin} min audio</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsManualEditMode(!isManualEditMode)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isManualEditMode
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {isManualEditMode ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Reader View</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Directly</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reading / Editing Area */}
            <div className="p-6 md:p-10 min-h-[450px] max-h-[700px] overflow-y-auto bg-zinc-950/40">
              {isStreaming ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-tag">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Ghost-Writer AI v1.0 is typing live...</span>
                  </div>
                  <div className="font-serif-book text-base md:text-lg text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {streamingText}
                    <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse" />
                  </div>
                </div>
              ) : isManualEditMode ? (
                <textarea
                  value={sectionContent}
                  onChange={(e) => onUpdateSectionContent(e.target.value)}
                  placeholder="Type or paste manuscript text here..."
                  rows={20}
                  className="w-full bg-transparent border-0 font-serif-book text-base text-zinc-200 leading-relaxed focus:outline-none resize-none"
                />
              ) : sectionContent ? (
                <div className="font-serif-book text-base md:text-lg text-zinc-200 leading-relaxed whitespace-pre-wrap space-y-4">
                  {sectionContent}
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <PenTool className="w-10 h-10 text-zinc-600 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-zinc-300">
                      Section Manuscript Awaiting Synthesis
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto font-serif-book">
                      Click the button below to generate {targetWordCount} words with deep dialogue, sensory details, and authoritative pacing.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartWritingScene(1, false)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-950/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Compose Scene 1 Now (~700 words)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CRITICAL QUALITY GATE: Review & Approval Section */}
          {sectionContent && !isStreaming && (
            <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      Ghost-Writer Quality Approval Gate
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Rule: Never rush forward. Review this section carefully. Request polish or approve to seal and bridge to the next section.
                  </p>
                </div>

                <button
                  onClick={handleApproveWithCelebration}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Section & Advance</span>
                </button>
              </div>

              {/* Quick AI Revision Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono-tag font-semibold text-zinc-400 uppercase">
                  Quick AI Polish & Re-Voice Options:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Deepen sensory textures & environmental grounding',
                    'Punch up dialogue subtext, banter, and friction',
                    'Increase internal emotional stakes & vulnerability',
                    'End with an irresistible cliffhanger hook',
                    'Expand tactical frameworks with numbered steps',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyRevision(chip)}
                      className="text-xs bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500/50 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Revision Instruction Form */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="Custom instruction, e.g., 'Have Mei taste the bitter ash in the tea steam' or 'Add a SaaS pricing table'"
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleApplyRevision()}
                  disabled={!revisionFeedback.trim()}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Request AI Revision</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
