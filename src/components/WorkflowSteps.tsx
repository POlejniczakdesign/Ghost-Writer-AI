import React from 'react';
import { Compass, Network, PenTool, Radio } from 'lucide-react';

export type WorkflowStepId = 1 | 2 | 3 | 4;

interface WorkflowStepsProps {
  currentStep: WorkflowStepId;
  onSelectStep: (step: WorkflowStepId) => void;
  canNavigateToStep: (step: WorkflowStepId) => boolean;
}

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  currentStep,
  onSelectStep,
  canNavigateToStep,
}) => {
  const steps = [
    {
      id: 1 as WorkflowStepId,
      number: 'STEP 1',
      title: 'Niche Research & Concept',
      subtitle: 'Brainstorm 3 Unsaturated Angles',
      icon: Compass,
    },
    {
      id: 2 as WorkflowStepId,
      number: 'STEP 2',
      title: 'Comprehensive Outline',
      subtitle: 'The 10-Chapter & Character Blueprint',
      icon: Network,
    },
    {
      id: 3 as WorkflowStepId,
      number: 'STEP 3',
      title: 'Iterative Writing',
      subtitle: 'The Section-by-Section Factory',
      icon: PenTool,
    },
    {
      id: 4 as WorkflowStepId,
      number: 'STEP 4',
      title: 'Audible & Kindle Formatting',
      subtitle: 'KDP Manuscript & Audio Narration Script',
      icon: Radio,
    },
  ];

  return (
    <nav className="border-b border-zinc-800/80 bg-zinc-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id;
            const isAccessible = canNavigateToStep(s.id);

            return (
              <button
                key={s.id}
                onClick={() => isAccessible && onSelectStep(s.id)}
                disabled={!isAccessible}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-950/20'
                    : isAccessible
                    ? 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    : 'bg-zinc-950/40 border-zinc-900/80 text-zinc-600 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/40'
                      : isAccessible
                      ? 'bg-zinc-800 text-amber-300'
                      : 'bg-zinc-900 text-zinc-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono-tag font-bold tracking-wider ${
                        isActive ? 'text-amber-400' : 'text-zinc-500'
                      }`}
                    >
                      {s.number}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-semibold truncate ${
                      isActive ? 'text-zinc-100' : isAccessible ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    {s.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
