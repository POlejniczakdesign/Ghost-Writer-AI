import React, { useState, useEffect } from 'react';
import { GenreType, NicheProposal, BookBlueprint, ManuscriptFrontMatter, ManuscriptBackMatter } from './types/ghostwriter';
import { DEFAULT_NICHES_BY_GENRE } from './data/defaultNiches';
import { Header } from './components/Header';
import { WorkflowSteps, WorkflowStepId } from './components/WorkflowSteps';
import { NicheStep } from './components/NicheStep';
import { OutlineStep } from './components/OutlineStep';
import { WritingFactoryStep } from './components/WritingFactoryStep';
import { PublishingFormatStep } from './components/PublishingFormatStep';
import { ConsultantModal } from './components/ConsultantModal';

export default function App() {
  const [genre, setGenre] = useState<GenreType>('Business/Non-Fiction');
  const [currentStep, setCurrentStep] = useState<WorkflowStepId>(1);
  const [niches, setNiches] = useState<NicheProposal[]>(DEFAULT_NICHES_BY_GENRE['Business/Non-Fiction']);
  const [selectedNiche, setSelectedNiche] = useState<NicheProposal | null>(DEFAULT_NICHES_BY_GENRE['Business/Non-Fiction'][0]);
  const [blueprint, setBlueprint] = useState<BookBlueprint | null>(null);
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState<boolean>(false);

  // Front & Back Matter defaults
  const [frontMatter, setFrontMatter] = useState<ManuscriptFrontMatter>({
    title: 'The $10K Solopreneur Engine',
    subtitle: 'How to Build 80% Automated Micro-SaaS Using Autonomous AI Agents',
    authorName: 'A. R. Vance',
    copyrightYear: new Date().getFullYear(),
    disclaimer: 'This book contains tactical business frameworks and operational guides. Results vary based on execution, market conditions, and technical capability.',
    dedication: 'To the creators and builders who dare to design their freedom.',
    forewordOrIntro: 'In 2026, the traditional 60-hour agency model collapsed under the weight of headcount overhead. This book is the blueprint for the sovereign solo creator who replaces meetings with automated intelligence.',
  });

  const [backMatter, setBackMatter] = useState<ManuscriptBackMatter>({
    authorBio: 'A. R. Vance is a bestselling author, ghostwriter, and publishing strategist who advises fractional executives and niche creators globally.',
    reviewCallToAction: 'If this book provided even a single breakthrough idea that saved you ten hours or earned you your next contract, I would be profoundly grateful if you left an honest review on Amazon. Reviews are the lifeblood of independent authors.',
    newsletterLeadMagnet: 'Claim the companion Notion Resource Pack, SOP templates, and video walkthroughs at https://author.example.com/vault',
    nextBookTeaser: 'Coming Summer: The Autonomous Agency: Scaling from $10k to $100k Monthly Retainers with Headless AI.',
  });

  // Keep niches in sync when user toggles genre
  const handleGenreChange = (newGenre: GenreType) => {
    setGenre(newGenre);
    const defaults = DEFAULT_NICHES_BY_GENRE[newGenre] || [];
    setNiches(defaults);
    setSelectedNiche(defaults[0] || null);
  };

  // Step 1: Generate Custom Niches via API
  const handleGenerateCustomNiches = async (customAngle: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ghostwriter/niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, customAngle }),
      });
      const data = await res.json();
      if (data.niches && data.niches.length > 0) {
        setNiches(data.niches);
        setSelectedNiche(data.niches[0]);
      }
    } catch (err) {
      console.error('Error generating niches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Generate Blueprint from Selected Niche
  const handleGenerateOutline = async (feedback?: string) => {
    if (!selectedNiche) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ghostwriter/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          niche: selectedNiche,
          customPreferences: feedback,
        }),
      });
      const data = await res.json();
      if (data.outline) {
        // Initialize sections status
        const outlineWithStatus = {
          ...data.outline,
          chapters: data.outline.chapters.map((ch: any) => ({
            ...ch,
            sections: ch.sections.map((sec: any) => ({
              ...sec,
              status: sec.status || 'pending',
              content: sec.content || '',
            })),
          })),
        };
        setBlueprint(outlineWithStatus);
        setFrontMatter((prev) => ({
          ...prev,
          title: data.outline.title || prev.title,
          subtitle: data.outline.subtitle || prev.subtitle,
        }));
      }
    } catch (err) {
      console.error('Error generating outline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToOutline = async () => {
    setCurrentStep(2);
    if (!blueprint) {
      await handleGenerateOutline();
    }
  };

  // Step 3: Stream Iterative Section/Scene Writing
  const handleStreamWriteSection = async (
    targetWordCount: number,
    tone: string,
    directives: string,
    sceneNumber = 1,
    appendMode = false
  ) => {
    if (!blueprint) return;
    const currentChapter = blueprint.chapters[currentChapterIdx];
    const currentSection = currentChapter.sections[currentSectionIdx];

    // Determine previous section summary for narrative continuity bridging
    let previousSectionSummary = '';
    if (currentSectionIdx > 0) {
      const prev = currentChapter.sections[currentSectionIdx - 1];
      previousSectionSummary = `Section ${prev.sectionNumber}: ${prev.title} - ${prev.objective}`;
    } else if (currentChapterIdx > 0) {
      const prevCh = blueprint.chapters[currentChapterIdx - 1];
      previousSectionSummary = `Chapter ${prevCh.chapterNumber}: ${prevCh.title} - ${prevCh.keyTakeawayOrCliffhanger}`;
    }

    const existingContent = currentSection.content || '';
    const baseContent = appendMode && existingContent ? `${existingContent}\n\n* * *\n\n` : '';

    setIsStreaming(true);
    setStreamingText(baseContent);

    try {
      const response = await fetch('/api/ghostwriter/write-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          bookTitle: blueprint.title,
          outlineOverview: blueprint.logline,
          chapterNumber: currentChapter.chapterNumber,
          chapterTitle: currentChapter.title,
          sectionNumber: currentSection.sectionNumber,
          sectionTitle: currentSection.title,
          sceneNumber,
          totalScenes: 3,
          sectionObjective: currentSection.objective,
          conflictOrFocus: currentSection.conflictOrCoreConcept,
          contextData: blueprint.fictionDossier || blueprint.nonFictionFramework,
          previousSectionSummary,
          existingSceneContent: existingContent,
          targetWordCount,
          toneStyle: tone,
          userDirectives: directives,
        }),
      });

      if (!response.body) throw new Error('No readable stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = baseContent;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.replace('data: ', ''));
              if (parsed.text) {
                accumulated += parsed.text;
                setStreamingText(accumulated);
              }
            } catch (e) {
              // Ignore partial JSON
            }
          }
        }
      }

      // Save drafted text into current section
      handleUpdateSectionContent(accumulated);
    } catch (err) {
      console.error('Streaming error:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  // AI Revision of Section
  const handleReviseSection = async (instructions: string) => {
    if (!blueprint) return;
    const currentChapter = blueprint.chapters[currentChapterIdx];
    const currentSection = currentChapter.sections[currentSectionIdx];
    const currentContent = currentSection.content || streamingText;

    if (!currentContent) return;

    setIsStreaming(true);
    setStreamingText('');

    try {
      const response = await fetch('/api/ghostwriter/revise-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionContent: currentContent,
          instructions,
          genre,
          sectionTitle: currentSection.title,
        }),
      });

      if (!response.body) throw new Error('No stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.replace('data: ', ''));
              if (parsed.text) {
                accumulated += parsed.text;
                setStreamingText(accumulated);
              }
            } catch (e) {
              // ignore partial
            }
          }
        }
      }

      handleUpdateSectionContent(accumulated);
    } catch (err) {
      console.error('Revision error:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleUpdateSectionContent = (content: string) => {
    if (!blueprint) return;
    const updatedChapters = [...blueprint.chapters];
    const chapter = updatedChapters[currentChapterIdx];
    if (chapter && chapter.sections[currentSectionIdx]) {
      chapter.sections[currentSectionIdx].content = content;
      setBlueprint({ ...blueprint, chapters: updatedChapters });
    }
  };

  // Section Approval: mark as completed and advance to next
  const handleApproveSection = () => {
    if (!blueprint) return;
    const updatedChapters = [...blueprint.chapters];
    const chapter = updatedChapters[currentChapterIdx];
    if (!chapter) return;

    chapter.sections[currentSectionIdx].status = 'completed';
    setBlueprint({ ...blueprint, chapters: updatedChapters });

    // Advance to next section or next chapter
    if (currentSectionIdx + 1 < chapter.sections.length) {
      setCurrentSectionIdx(currentSectionIdx + 1);
    } else if (currentChapterIdx + 1 < blueprint.chapters.length) {
      setCurrentChapterIdx(currentChapterIdx + 1);
      setCurrentSectionIdx(0);
    } else {
      // Finished all sections in all chapters!
      setCurrentStep(4);
    }
  };

  // Step 4: Format Audible Script via API
  const handleFormatAudioScript = async (rawText: string, chapterTitle: string): Promise<string> => {
    const res = await fetch('/api/ghostwriter/format-audiobook-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText,
        chapterTitle,
        charactersOrTerms: blueprint?.fictionDossier?.characters.map((c) => c.name) || [],
      }),
    });
    const data = await res.json();
    return data.script || rawText;
  };

  // Step 4: TTS Audition via Gemini TTS
  const handleGenerateTtsAudition = async (text: string, voice: string): Promise<string> => {
    const res = await fetch('/api/ghostwriter/tts-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    const data = await res.json();
    if (!data.audioBase64) throw new Error('TTS failed');
    return data.audioBase64;
  };

  // Calculate global manuscript stats
  const totalWords =
    blueprint?.chapters.reduce(
      (acc, ch) =>
        acc +
        ch.sections.reduce(
          (sAcc, s) => sAcc + (s.content ? s.content.trim().split(/\s+/).filter(Boolean).length : 0),
          0
        ),
      0
    ) || 0;

  const allSections = blueprint?.chapters.flatMap((c) => c.sections) || [];
  const completedSections = allSections.filter((s) => s.status === 'completed').length;
  const totalSections = allSections.length;

  const canNavigateToStep = (step: WorkflowStepId): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!selectedNiche;
    if (step === 3) return !!blueprint;
    if (step === 4) return !!blueprint && completedSections > 0;
    return false;
  };

  const handleResetProject = () => {
    if (confirm('Start a new book project? This will reset your active draft.')) {
      setBlueprint(null);
      setCurrentStep(1);
      setCurrentChapterIdx(0);
      setCurrentSectionIdx(0);
      setStreamingText('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Header */}
      <Header
        genre={genre}
        onGenreChange={handleGenreChange}
        totalWords={totalWords}
        completedSections={completedSections}
        totalSections={totalSections}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onResetProject={handleResetProject}
      />

      {/* 4-Step Interactive Stepper */}
      <WorkflowSteps
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentStep === 1 && (
          <NicheStep
            genre={genre}
            onGenreSelect={handleGenreChange}
            niches={niches}
            selectedNiche={selectedNiche}
            onSelectNiche={(n) => setSelectedNiche(n)}
            onGenerateCustomNiches={handleGenerateCustomNiches}
            isLoading={isLoading}
            onProceedToOutline={handleProceedToOutline}
          />
        )}

        {currentStep === 2 && (
          <OutlineStep
            blueprint={blueprint}
            genre={genre}
            isLoading={isLoading}
            onRegenerateOutline={handleGenerateOutline}
            onApproveAndProceed={() => setCurrentStep(3)}
            onUpdateBlueprint={(up) => setBlueprint(up)}
          />
        )}

        {currentStep === 3 && blueprint && (
          <WritingFactoryStep
            blueprint={blueprint}
            genre={genre}
            currentChapterIdx={currentChapterIdx}
            currentSectionIdx={currentSectionIdx}
            onSelectSection={(chIdx, secIdx) => {
              setCurrentChapterIdx(chIdx);
              setCurrentSectionIdx(secIdx);
            }}
            onStreamWriteSection={handleStreamWriteSection}
            onReviseSection={handleReviseSection}
            onApproveSection={handleApproveSection}
            onUpdateSectionContent={handleUpdateSectionContent}
            onProceedToPublishing={() => setCurrentStep(4)}
            isStreaming={isStreaming}
            streamingText={streamingText}
          />
        )}

        {currentStep === 4 && blueprint && (
          <PublishingFormatStep
            blueprint={blueprint}
            genre={genre}
            frontMatter={frontMatter}
            backMatter={backMatter}
            onUpdateFrontMatter={setFrontMatter}
            onUpdateBackMatter={setBackMatter}
            onFormatAudioScript={handleFormatAudioScript}
            onGenerateTtsAudition={handleGenerateTtsAudition}
          />
        )}
      </main>

      {/* Ghost-Writer Publishing Consultant Drawer */}
      <ConsultantModal
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        genre={genre}
        blueprint={blueprint}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-4 text-center text-xs text-zinc-500 font-mono-tag">
        Ghost-Writer AI v1.0 • Amazon KDP & Audible Publishing Engine • Master-Class Quality Doctrine
      </footer>
    </div>
  );
}
