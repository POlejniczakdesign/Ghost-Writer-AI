import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Google Gen AI Client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// STEP 1: Generate 3 Profitable Unsaturated Niches for KDP & Audible
app.post('/api/ghostwriter/niches', async (req: Request, res: Response) => {
  try {
    const { genre, customAngle } = req.body;
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    const systemPrompt = `You are Ghost-Writer AI v1.0, a master-class professional ghostwriter, bestselling author, and niche publishing strategist specializing in the global Amazon KDP and Audible markets.
You operate across 3 distinct high-profit genres:
1. Business/Non-Fiction (Actionable frameworks, playbooks, tactical guides)
2. Romance/Harlequin (Tropes, high emotional tension, banter, electric pacing)
3. Fantasy (World-building, hard/soft magic, portal/progression/cozy/dark fantasy, character arcs)

Your goal is to propose 3 highly specific, commercially viable, profitable, and unsaturated niches for the chosen genre.
Avoid generic tropes or saturated cliches. Think of specific reader subcultures, underserved search keywords on Amazon KDP, high Kindle Unlimited read-through potential, and strong Audible narration hooks.`;

    const userPrompt = `Target Genre: ${genre}
${customAngle ? `User's initial seed/creative thoughts: "${customAngle}"` : ''}

Generate exactly 3 distinct, highly profitable, and unsaturated niche proposals. For each provide:
- id: unique slug (e.g. niche-1)
- workingTitle: a punchy, high-converting Amazon KDP title with subtitle
- subgenre: exact specific subgenre (e.g., "Cozy Low-Stakes Portal Fantasy", "Solopreneur Micro-SaaS AI Playbook", "Grumpy-Sunshine Fake Marriage Billionaire Romance")
- hook: 1-2 sentence irresistible back-cover blurb hook
- targetAudience: demographic and psychological reader profile (who is buying this and why)
- profitAngle: why this niche has low competition and high Kindle Unlimited/Audible velocity
- coreTropesOrFrameworks: array of 3-4 specific tropes (for fiction) or frameworks/tactics (for non-fiction)
- estimatedWordCount: recommended total target word count for maximum KDP & Audible profitability (e.g., "55,000 - 65,000 words / 6-7 hours audiobook")`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              workingTitle: { type: Type.STRING },
              subgenre: { type: Type.STRING },
              hook: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              profitAngle: { type: Type.STRING },
              coreTropesOrFrameworks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              estimatedWordCount: { type: Type.STRING },
            },
            required: [
              'id',
              'workingTitle',
              'subgenre',
              'hook',
              'targetAudience',
              'profitAngle',
              'coreTropesOrFrameworks',
              'estimatedWordCount',
            ],
          },
        },
      },
    });

    const text = response.text || '[]';
    const niches = JSON.parse(text);
    res.json({ niches });
  } catch (error: any) {
    console.error('Error generating niches:', error);
    res.status(500).json({ error: error.message || 'Failed to generate niches' });
  }
});

// STEP 2: Generate Comprehensive Outline (The Architecture)
app.post('/api/ghostwriter/outline', async (req: Request, res: Response) => {
  try {
    const { genre, niche, customPreferences } = req.body;
    if (!genre || !niche) {
      return res.status(400).json({ error: 'Genre and niche are required' });
    }

    const systemPrompt = `You are Ghost-Writer AI v1.0, master publishing architect.
Your task is to design a comprehensive, master-class book blueprint for Amazon KDP and Audible.

CRITICAL QUALITY ARCHITECTURE:
- For Non-Fiction / Business:
  Create a logical 10-chapter progression framework with executive sub-sections, real-world case templates, actionable checklists/frameworks, and reader key takeaways.
- For Fiction (Romance / Harlequin or Fantasy):
  Create full character dossiers (Protagonist, Deuteragonist/Love-Interest/Rival, Antagonist/Catalyst, fatal flaws, deep secrets, internal/external stakes), world-building rules (magic limits, societal tensions, or corporate/small-town rules), emotional core/tropes, and a chapter-by-chapter plot outline based on professional 3-Act Structure or Save the Cat beats (Opening, Inciting Catalyst, Crossing the Threshold, Fun & Games/Tension, Midpoint Shift, Bad Guys Close In / Complications, All Hope is Lost, Climax, Resolution).
  Each chapter must have 2 to 3 distinct narrative scenes/sections with clear scene objectives, conflict, sensory focus, and narrative cliffhangers/hooks.`;

    const userPrompt = `Genre: ${genre}
Selected Niche:
- Title: ${niche.workingTitle}
- Subgenre: ${niche.subgenre}
- Hook: ${niche.hook}
- Target Audience: ${niche.targetAudience}
- Core Tropes/Frameworks: ${JSON.stringify(niche.coreTropesOrFrameworks)}
${customPreferences ? `User Custom Instructions/Adjustments: "${customPreferences}"` : ''}

Generate the high-level concept and the 10 chapter titles and brief 1-sentence logline for each chapter. Keep it concise, rapid, and structured as JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            genre: { type: Type.STRING },
            logline: { type: Type.STRING },
            structureType: { type: Type.STRING },
            fictionDossier: {
              type: Type.OBJECT,
              properties: {
                emotionalCore: { type: Type.STRING },
                worldBuildingRules: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                characters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      goal: { type: Type.STRING },
                      flaw: { type: Type.STRING },
                      secret: { type: Type.STRING },
                      stakes: { type: Type.STRING },
                    },
                    required: ['name', 'role', 'goal', 'flaw', 'secret', 'stakes'],
                  },
                },
              },
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  chapterNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  actOrPhase: { type: Type.STRING },
                  synopsis: { type: Type.STRING },
                  keyTakeawayOrCliffhanger: { type: Type.STRING },
                  sections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        sectionNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        objective: { type: Type.STRING },
                        conflictOrCoreConcept: { type: Type.STRING },
                        sensoryOrFrameworkFocus: { type: Type.STRING },
                        estimatedWordTarget: { type: Type.STRING },
                      },
                      required: [
                        'sectionNumber',
                        'title',
                        'objective',
                        'conflictOrCoreConcept',
                        'sensoryOrFrameworkFocus',
                        'estimatedWordTarget',
                      ],
                    },
                  },
                },
                required: [
                  'chapterNumber',
                  'title',
                  'actOrPhase',
                  'synopsis',
                  'keyTakeawayOrCliffhanger',
                ],
              },
            },
          },
          required: [
            'title',
            'subtitle',
            'genre',
            'logline',
            'structureType',
            'chapters',
          ],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    // Ensure every chapter has at least 2 structured scene sections
    if (parsed.chapters) {
      parsed.chapters = parsed.chapters.map((ch: any) => ({
        ...ch,
        sections: ch.sections && ch.sections.length > 0 ? ch.sections : [
          {
            sectionNumber: 1,
            title: `Scene 1: Inciting Momentum & Hook`,
            objective: `Establish immediate scene tension and sensory grounding`,
            conflictOrCoreConcept: ch.synopsis || `Key story progression beat`,
            sensoryOrFrameworkFocus: `Sensory immersion, environmental details, subtext`,
            estimatedWordTarget: '600–800 words',
            status: 'pending',
          },
          {
            sectionNumber: 2,
            title: `Scene 2: Escalation & Cliffhanger`,
            objective: `Escalate the stakes and leave reader hooked`,
            conflictOrCoreConcept: ch.keyTakeawayOrCliffhanger || `Turning point`,
            sensoryOrFrameworkFocus: `Emotional resonance and closing hook`,
            estimatedWordTarget: '600–800 words',
            status: 'pending',
          },
        ],
      }));
    }

    res.json({ outline: parsed });
  } catch (error: any) {
    console.error('Error generating outline:', error);
    res.status(500).json({ error: error.message || 'Failed to generate outline' });
  }
});

// STEP 3: Iterative Section Writing (Scene-by-Scene 600–800 words for extreme depth & zero timeout)
app.post('/api/ghostwriter/write-section', async (req: Request, res: Response) => {
  try {
    const {
      genre,
      bookTitle,
      outlineOverview,
      chapterNumber,
      chapterTitle,
      sectionNumber,
      sectionTitle,
      sceneNumber = 1,
      totalScenes = 3,
      sectionObjective,
      conflictOrFocus,
      contextData, // fiction dossiers or non-fiction core thesis
      previousSectionSummary,
      existingSceneContent = '',
      targetWordCount = 750,
      toneStyle = 'Visceral Sensory Depth & Sharp Pacing',
      userDirectives = '',
    } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const isFiction = genre.toLowerCase().includes('romance') || genre.toLowerCase().includes('fantasy');

    const systemInstruction = `You are Ghost-Writer AI v1.0, an elite ghost-writer and bestselling author for Amazon KDP and Audible.

CRITICAL ARCHITECTURE: SCENE-BY-SCENE WRITING (600–800 WORDS PER SCENE)
1. Write focused SCENES (sub-sections) of roughly ${targetWordCount} words (range: 600–800 words). This guarantees extreme sensory depth, zero timeouts, natural breathing room, and realistic dialogue.
2. ${
      isFiction
        ? `FICTION MASTERY:
- Apply rigorous 'Show, Don't Tell'. Ground scenes in all five senses (scent of rain on rusted iron, cedar shavings, cold drafts, micro-expressions).
- Realistic, snappy dialogue with subtext, banter, unsaid friction, and distinct character voices.
- Deep internal monologue, sensory texture, visceral pacing, and an irresistible closing hook or cliffhanger.`
        : `NON-FICTION MASTERY:
- Write with authoritative, engaging, mentor-like conviction.
- Structure with clear markdown headings, bulleted playbooks, concrete case examples, step-by-step frameworks.
- Highly actionable, conversational yet professional, keeping the reader leaning forward.`
    }
3. Write in clean, beautiful Markdown format. Do NOT include meta-commentary like "Here is Scene 1". Start directly with the scene prose.`;

    const userPrompt = `Book Title: "${bookTitle}"
Genre: ${genre}
Manuscript Architecture Context: ${outlineOverview || 'Bestseller outline'}
Architecture Specifics: ${JSON.stringify(contextData || {})}

NOW WRITING:
Chapter ${chapterNumber}: "${chapterTitle}"
Section ${sectionNumber}: "${sectionTitle}"
SCENE: Scene ${sceneNumber} of ${totalScenes}
Scene Objective: ${sectionObjective || 'Establish immediate scene tension and sensory grounding'}
Key Conflict or Core Concept: ${conflictOrFocus || ''}
${existingSceneContent ? `PRIOR SCENE IN THIS SECTION:\n"${existingSceneContent.slice(-800)}"\n(Continue seamlessly from the immediate beat above without repetition)` : previousSectionSummary ? `Bridge from Previous Section: "${previousSectionSummary}"` : 'This is the opening scene of the chapter. Hook the reader from the very first sentence.'}
${userDirectives ? `User Custom Editorial Directives for this scene: "${userDirectives}"` : ''}

Generate Scene ${sceneNumber} (approx. 600–800 words) with deep sensory immersion now:`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error writing section:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Failed to stream writing' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Stream error' })}\n\n`);
      res.end();
    }
  }
});

// Revision / Polish Section
app.post('/api/ghostwriter/revise-section', async (req: Request, res: Response) => {
  try {
    const { sectionContent, instructions, genre, sectionTitle } = req.body;
    if (!sectionContent || !instructions) {
      return res.status(400).json({ error: 'Section content and instructions required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemInstruction = `You are Ghost-Writer AI v1.0, master editor and ghost-writer.
Revise and enhance the provided section based precisely on the author's editorial notes.
Maintain the high literary prose, sensory depth, emotional resonance, and consistent character/framework voice.
Output ONLY the revised manuscript section in clean markdown without conversational filler.`;

    const prompt = `Section Title: ${sectionTitle}
Genre: ${genre}
User Editorial Instructions: "${instructions}"

Current Section Draft:
---
${sectionContent}
---

Produce the improved, expanded, or polished full section draft:`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error revising section:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Revision failed' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Stream error' })}\n\n`);
      res.end();
    }
  }
});

// STEP 4: Convert Text into Master-Class Audible Audio Script
app.post('/api/ghostwriter/format-audiobook-script', async (req: Request, res: Response) => {
  try {
    const { rawText, chapterTitle, charactersOrTerms } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: 'Raw text is required' });
    }

    const systemInstruction = `You are Ghost-Writer AI v1.0, Audible & ACX audio production master.
Transform the provided book section into a professional Audiobook Narrator Recording Script (suitable for voice actors or advanced AI narration engines like ElevenLabs).

FORMATTING RULES:
1. Insert bracketed pacing and performance cues:
   - [PAUSE 1.5s], [PAUSE 2.5s - Scene Shift]
   - Tone directives: [Whispered], [Conspiratorial whisper], [Authoritative, measured pace], [Building intensity], [Warm, intimate]
2. Pronunciation Guides:
   - For any fantasy names, foreign words, technical acronyms, or uncommon terms, provide an immediate phonetic breakdown bracket: e.g. "Lord Vaelthor [pronounced VALE-thor]", "EBITDA [ee-bit-DAH]".
3. Natural Narration Flow:
   - Replace complex visual symbols or awkward dashes with conversational spoken phrasing.
   - Insert clear introductory chapter slate: e.g. "Chapter One. [Title]. [PAUSE 2s]".
4. Return clean, formatted script with clear narrator cues.`;

    const prompt = `Chapter Title: ${chapterTitle || 'Chapter'}
Specific Character Names or Technical Terms: ${JSON.stringify(charactersOrTerms || [])}

Raw Manuscript Text:
---
${rawText}
---

Format this into an Audible Narration Script:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ script: response.text });
  } catch (error: any) {
    console.error('Error formatting audio script:', error);
    res.status(500).json({ error: error.message || 'Failed to format audio script' });
  }
});

// STEP 4 BONUS: Audible Voice Narration Audition (using gemini-3.8-flash-lite-tts)
app.post('/api/ghostwriter/tts-preview', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Fenrir', style = 'Masterclass audiobook narrator with dramatic pacing' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS audition' });
    }

    // Limit audition sample to ~120 words for instant responsive audio preview
    const sampleText = text.split(/\s+/).slice(0, 140).join(' ');

    // Available prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const validVoices = ['Fenrir', 'Kore', 'Puck', 'Charon', 'Zephyr'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Fenrir';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: sampleText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by model' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      sampleText,
      voice: chosenVoice,
    });
  } catch (error: any) {
    console.error('Error generating TTS audition:', error);
    res.status(500).json({ error: error.message || 'TTS generation failed' });
  }
});

// Interactive Ghostwriting Consultant Chat
app.post('/api/ghostwriter/consultant', async (req: Request, res: Response) => {
  try {
    const { message, history = [], bookContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are Ghost-Writer AI v1.0, master ghost-writer and Amazon KDP/Audible publishing strategist.
You provide sharp, tactical, master-class advice on tropes, character arcs, hooks, pacing, high-converting titles, Kindle Unlimited strategies, and Audible narration design.
Be insightful, encouraging, deeply knowledgeable, and direct.`;

    const contents = [
      ...history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: `Current Book Context: ${JSON.stringify(bookContext || {})}\n\nUser Question/Request: ${message}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in consultant chat:', error);
    res.status(500).json({ error: error.message || 'Consultant failed' });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ghost-Writer AI v1.0 running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
