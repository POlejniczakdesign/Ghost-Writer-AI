export type GenreType = 'Business/Non-Fiction' | 'Romance/Harlequin' | 'Fantasy';

export interface NicheProposal {
  id: string;
  workingTitle: string;
  subgenre: string;
  hook: string;
  targetAudience: string;
  profitAngle: string;
  coreTropesOrFrameworks: string[];
  estimatedWordCount: string;
}

export interface CharacterDossier {
  name: string;
  role: string;
  goal: string;
  flaw: string;
  secret: string;
  stakes: string;
}

export interface FictionDossier {
  characters: CharacterDossier[];
  worldBuildingRules: string[];
  emotionalCore: string;
}

export interface NonFictionFramework {
  coreThesis: string;
  primaryModelName: string;
  transformationPromise: string;
  targetReaderOutcome: string;
}

export interface OutlineSection {
  sectionNumber: number;
  title: string;
  objective: string;
  conflictOrCoreConcept: string;
  sensoryOrFrameworkFocus: string;
  estimatedWordTarget: string;
  content?: string;
  audioScript?: string;
  status: 'pending' | 'drafting' | 'completed';
}

export interface OutlineChapter {
  chapterNumber: number;
  title: string;
  actOrPhase: string;
  synopsis: string;
  sections: OutlineSection[];
  keyTakeawayOrCliffhanger: string;
}

export interface BookBlueprint {
  title: string;
  subtitle: string;
  genre: GenreType;
  logline: string;
  structureType: string;
  fictionDossier?: FictionDossier;
  nonFictionFramework?: NonFictionFramework;
  chapters: OutlineChapter[];
  authorPenName?: string;
}

export interface ManuscriptFrontMatter {
  title: string;
  subtitle: string;
  authorName: string;
  copyrightYear: number;
  disclaimer: string;
  dedication: string;
  forewordOrIntro: string;
}

export interface ManuscriptBackMatter {
  authorBio: string;
  reviewCallToAction: string;
  newsletterLeadMagnet: string;
  nextBookTeaser: string;
}

export interface PublishingProject {
  id: string;
  genre: GenreType;
  selectedNiche: NicheProposal | null;
  blueprint: BookBlueprint | null;
  currentChapterIndex: number;
  currentSectionIndex: number;
  frontMatter: ManuscriptFrontMatter;
  backMatter: ManuscriptBackMatter;
  createdAt: string;
  updatedAt: string;
}
