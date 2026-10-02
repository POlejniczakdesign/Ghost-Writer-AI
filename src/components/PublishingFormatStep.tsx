import React, { useState } from 'react';
import {
  Radio,
  BookOpen,
  Headphones,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  Sparkles,
  Volume2,
  FileText,
  Bookmark,
  Share2,
  RefreshCw,
  Award,
} from 'lucide-react';
import {
  BookBlueprint,
  GenreType,
  ManuscriptBackMatter,
  ManuscriptFrontMatter,
} from '../types/ghostwriter';

interface PublishingFormatStepProps {
  blueprint: BookBlueprint;
  genre: GenreType;
  frontMatter: ManuscriptFrontMatter;
  backMatter: ManuscriptBackMatter;
  onUpdateFrontMatter: (fm: ManuscriptFrontMatter) => void;
  onUpdateBackMatter: (bm: ManuscriptBackMatter) => void;
  onFormatAudioScript: (rawText: string, chapterTitle: string) => Promise<string>;
  onGenerateTtsAudition: (text: string, voice: string) => Promise<string>;
}

export const PublishingFormatStep: React.FC<PublishingFormatStepProps> = ({
  blueprint,
  genre,
  frontMatter,
  backMatter,
  onUpdateFrontMatter,
  onUpdateBackMatter,
  onFormatAudioScript,
  onGenerateTtsAudition,
}) => {
  const [activeTab, setActiveTab] = useState<'kindle' | 'audiobook'>('kindle');
  const [selectedVoice, setSelectedVoice] = useState('Fenrir');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioScriptMap, setAudioScriptMap] = useState<Record<string, string>>({});
  const [isFormattingAudio, setIsFormattingAudio] = useState(false);
  const [isAuditioningTts, setIsAuditioningTts] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compile total manuscript text
  const chaptersWithContent = blueprint.chapters.filter((c) =>
    c.sections.some((s) => !!s.content)
  );

  const getFullKindleManuscript = (): string => {
    let out = '';
    // Front Matter
    out += `# ${frontMatter.title.toUpperCase()}\n`;
    if (frontMatter.subtitle) out += `### ${frontMatter.subtitle}\n\n`;
    out += `By **${frontMatter.authorName}**\n\n`;
    out += `---\n\n`;
    out += `**Copyright © ${frontMatter.copyrightYear} by ${frontMatter.authorName}**\n`;
    out += `All rights reserved worldwide. No part of this publication may be reproduced or transmitted without written permission.\n\n`;
    out += `*Disclaimer: ${frontMatter.disclaimer}*\n\n`;
    out += `---\n\n`;
    out += `### Dedication\n\n*${frontMatter.dedication}*\n\n`;
    out += `---\n\n`;
    out += `### Table of Contents\n\n`;
    blueprint.chapters.forEach((ch) => {
      out += `- **Chapter ${ch.chapterNumber}:** ${ch.title}\n`;
    });
    out += `\n---\n\n`;
    out += `### Introduction\n\n${frontMatter.forewordOrIntro}\n\n`;
    out += `\n=========================================\n\n`;

    // Body Chapters
    blueprint.chapters.forEach((ch) => {
      out += `\n# CHAPTER ${ch.chapterNumber}\n## ${ch.title.toUpperCase()}\n\n`;
      ch.sections.forEach((sec) => {
        if (sec.content) {
          out += `### Section ${sec.sectionNumber}: ${sec.title}\n\n`;
          out += `${sec.content}\n\n* * *\n\n`;
        }
      });
    });

    // Back Matter
    out += `\n=========================================\n\n`;
    out += `### About the Author\n\n${backMatter.authorBio}\n\n`;
    out += `### A Personal Request for Your Review\n\n${backMatter.reviewCallToAction}\n\n`;
    out += `### Exclusive Reader VIP Magnet & Bonus Material\n\n${backMatter.newsletterLeadMagnet}\n\n`;
    out += `### Sneak Peek: What Lies Ahead\n\n${backMatter.nextBookTeaser}\n\n`;

    return out;
  };

  const fullKindleText = getFullKindleManuscript();
  const totalWords = fullKindleText.split(/\s+/).filter(Boolean).length;

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormatActiveChapterAudio = async (chapterIdx: number) => {
    const ch = blueprint.chapters[chapterIdx];
    const textToFormat = ch.sections
      .map((s) => s.content || '')
      .filter(Boolean)
      .join('\n\n');

    if (!textToFormat) return;

    setIsFormattingAudio(true);
    try {
      const script = await onFormatAudioScript(textToFormat, ch.title);
      setAudioScriptMap((prev) => ({
        ...prev,
        [`ch-${ch.chapterNumber}`]: script,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsFormattingAudio(false);
    }
  };

  const handleAuditionVoice = async (textSample: string) => {
    if (isPlayingAudio && currentAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
      return;
    }

    setIsAuditioningTts(true);
    try {
      const base64Wav = await onGenerateTtsAudition(textSample, selectedVoice);
      const audioUrl = `data:audio/wav;base64,${base64Wav}`;
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      audio.play();
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditioningTts(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <section className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5" />
            <span>STEP 4: AUDIBLE & KINDLE FORMATTING SUITE</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-zinc-100 mt-2">
            The Final Publishing Masterpiece
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-serif-book">
            Formatted for Amazon KDP standards (Front Matter, Table of Contents, Back Matter CTAs) and Audible human narration specifications (pacing brackets, pronunciation guides, SSML pauses).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-center">
            <span className="text-[10px] font-mono-tag text-zinc-500 block uppercase">Total Words</span>
            <span className="text-sm font-bold text-amber-400">{totalWords.toLocaleString()}</span>
          </div>
          <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 text-center">
            <span className="text-[10px] font-mono-tag text-zinc-500 block uppercase">Est. Audiobook</span>
            <span className="text-sm font-bold text-cyan-400">
              {Math.floor(totalWords / 150 / 60)}h {Math.round((totalWords / 150) % 60)}m
            </span>
          </div>
        </div>
      </section>

      {/* Mode Switcher: Kindle KDP vs Audible Narration */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('kindle')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'kindle'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-950/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kindle KDP Master Manuscript</span>
        </button>

        <button
          onClick={() => setActiveTab('audiobook')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'audiobook'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-950/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Audible Narration Script & Voice Studio</span>
        </button>
      </div>

      {/* TAB 1: KINDLE KDP MANUSCRIPT */}
      {activeTab === 'kindle' && (
        <div className="space-y-6">
          {/* Action Export Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Complete eBook Package: Front Matter + Chapters + Review CTAs</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(fullKindleText, 'kindle')}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === 'kindle' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Manuscript</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  handleDownloadFile(
                    fullKindleText,
                    `${blueprint.title.replace(/\s+/g, '_')}_KDP_Manuscript.md`,
                    'text/markdown'
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Markdown (.md)</span>
              </button>

              <button
                onClick={() =>
                  handleDownloadFile(
                    fullKindleText,
                    `${blueprint.title.replace(/\s+/g, '_')}_KDP_Manuscript.txt`,
                    'text/plain'
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Plain Text (.txt)</span>
              </button>
            </div>
          </div>

          {/* Front & Back Matter Customization Drawers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front Matter Controls */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-mono-tag font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Front Matter Customizer
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                    Author Pen Name
                  </label>
                  <input
                    type="text"
                    value={frontMatter.authorName}
                    onChange={(e) =>
                      onUpdateFrontMatter({ ...frontMatter, authorName: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                    Dedication
                  </label>
                  <input
                    type="text"
                    value={frontMatter.dedication}
                    onChange={(e) =>
                      onUpdateFrontMatter({ ...frontMatter, dedication: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                    Foreword / Intro
                  </label>
                  <textarea
                    value={frontMatter.forewordOrIntro}
                    onChange={(e) =>
                      onUpdateFrontMatter({ ...frontMatter, forewordOrIntro: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Back Matter Controls */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-mono-tag font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> Back Matter & Amazon Review CTAs
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                    Amazon Review Call to Action (Crucial for KDP ranking algorithm)
                  </label>
                  <textarea
                    value={backMatter.reviewCallToAction}
                    onChange={(e) =>
                      onUpdateBackMatter({ ...backMatter, reviewCallToAction: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                    VIP Newsletter / Reader Magnet Signup Link
                  </label>
                  <input
                    type="text"
                    value={backMatter.newsletterLeadMagnet}
                    onChange={(e) =>
                      onUpdateBackMatter({ ...backMatter, newsletterLeadMagnet: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase font-mono-tag block">
                    About the Author Bio
                  </label>
                  <textarea
                    value={backMatter.authorBio}
                    onChange={(e) =>
                      onUpdateBackMatter({ ...backMatter, authorBio: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full Manuscript Reader Viewport */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono-tag font-semibold text-zinc-400">
                Kindle Paperwhite / E-Reader Preview Canvas
              </span>
              <span className="text-xs text-amber-400 font-mono-tag">
                {blueprint.chapters.length} Chapters In Blueprint
              </span>
            </div>

            <div className="p-8 md:p-14 max-h-[700px] overflow-y-auto bg-zinc-950/60 font-serif-book text-zinc-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {fullKindleText}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIBLE AUDIO SCRIPT & VOICE STUDIO */}
      {activeTab === 'audiobook' && (
        <div className="space-y-6">
          {/* Audio Studio Control Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-cyan-400" />
                  Audible Narration Engine & ACX Audio Script Formatter
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-serif-book">
                  Transforms standard text into performance-ready narration scripts with bracketed pacing pauses (`[PAUSE 1.5s]`), delivery tone cues (`[Whispered, conspiratorial]`), and phonetic pronunciation guides (`[Vael-thor / pronounced VALE-thor]`). Fully compliant with ElevenLabs and human studio narrators.
                </p>
              </div>

              {/* Live Voice Audition Selection */}
              <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 shrink-0">
                <div>
                  <span className="text-[10px] font-mono-tag uppercase text-zinc-500 block">
                    Narrator Voice
                  </span>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2.5 py-1 text-zinc-200 focus:outline-none"
                  >
                    <option value="Fenrir">Fenrir (Epic, Deep, Authoritative)</option>
                    <option value="Kore">Kore (Warm, Expressive, Engaging)</option>
                    <option value="Puck">Puck (Lively, Bantering, Quick)</option>
                    <option value="Zephyr">Zephyr (Articulate, Executive, Smooth)</option>
                    <option value="Charon">Charon (Gravelly, Dark, Atmospheric)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Audio Script Generation Cards */}
          <div className="space-y-4">
            {blueprint.chapters.map((ch, idx) => {
              const scriptKey = `ch-${ch.chapterNumber}`;
              const hasScript = !!audioScriptMap[scriptKey];
              const chapterRawText = ch.sections
                .map((s) => s.content || '')
                .filter(Boolean)
                .join('\n\n');

              return (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono-tag font-bold text-amber-400 uppercase">
                        Audible Track {ch.chapterNumber}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-100">{ch.title}</h4>
                      <span className="text-xs text-zinc-500 font-mono-tag">
                        Raw Text: {chapterRawText ? `${chapterRawText.split(/\s+/).length} words` : 'Empty (needs drafting in Step 3)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {chapterRawText && (
                        <>
                          <button
                            onClick={() => handleFormatActiveChapterAudio(idx)}
                            disabled={isFormattingAudio}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${isFormattingAudio ? 'animate-spin' : ''}`} />
                            <span>{hasScript ? 'Regenerate Audio Script' : 'Generate Audio Script'}</span>
                          </button>

                          <button
                            onClick={() => handleAuditionVoice(audioScriptMap[scriptKey] || chapterRawText)}
                            disabled={isAuditioningTts}
                            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isPlayingAudio ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Pause Audition</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>Listen Audition ({selectedVoice})</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Audio Script Output Display */}
                  {hasScript ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-mono-tag">
                          Performance Narration Script (Formatted with [PAUSE] & [Tone] markers)
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopyText(audioScriptMap[scriptKey], scriptKey)}
                            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === scriptKey ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy Script</span>
                          </button>

                          <button
                            onClick={() =>
                              handleDownloadFile(
                                audioScriptMap[scriptKey],
                                `Chapter_${ch.chapterNumber}_Audio_Script.txt`,
                                'text/plain'
                              )
                            }
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download Script</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 font-mono-tag text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                        {audioScriptMap[scriptKey]}
                      </div>
                    </div>
                  ) : chapterRawText ? (
                    <div className="text-xs text-zinc-500 font-serif-book italic">
                      Click "Generate Audio Script" to insert voice actor cues and pronunciation guides.
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-600">
                      Draft sections in Step 3 before generating audio narration scripts.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
