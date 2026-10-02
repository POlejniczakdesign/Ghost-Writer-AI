import { GenreType, NicheProposal } from '../types/ghostwriter';

export const DEFAULT_NICHES_BY_GENRE: Record<GenreType, NicheProposal[]> = {
  'Business/Non-Fiction': [
    {
      id: 'biz-1',
      workingTitle: 'The $10K Solopreneur Engine: How to Build 80% Automated Micro-SaaS and Productized Services Using Autonomous AI Agents',
      subgenre: 'Solopreneur AI Automation & Productized Services',
      hook: 'Stop trading 60 hours a week for client zoom calls. Discover the zero-employee blueprint that generated $180,000 ARR in 9 months using headless AI workflows.',
      targetAudience: 'Burned-out freelancers, agency owners, and technical solo founders seeking hands-off cashflow without hiring employees.',
      profitAngle: 'Explosive KDP keyword search volume with high Kindle Unlimited page reads and massive Audible commuter download demand for tactical playbooks.',
      coreTropesOrFrameworks: [
        'The 4-Pillar Autonomous Agent Stack',
        'Asynchronous Client Retainers',
        'Zero-Headcount SOP Automation',
        'The 7-Day Micro-Product Sprint'
      ],
      estimatedWordCount: '50,000 - 60,000 words (approx. 6 hrs audiobook)'
    },
    {
      id: 'biz-2',
      workingTitle: 'The Fractional Executive Playbook: Transition from Corporate Middle Management to $250/hr Advisory Contracts Without Cold Calling',
      subgenre: 'High-Ticket Fractional Consulting & Executive Advisory',
      hook: 'Layoffs are accelerating, but companies are desperately renting C-suite brains 10 hours a month. Here is your turnkey roadmap to land three $5k monthly retainers.',
      targetAudience: 'Senior corporate directors, VPs, and specialized managers (35-55) seeking independence and prestige consulting revenue.',
      profitAngle: 'High-ticket buyers with corporate credit cards who readily pay $19.99 for Kindle and $29.95 for Audible editions, commanding premium royalty margins.',
      coreTropesOrFrameworks: [
        'The 90-Day Diagnostic Audit Framework',
        'Value-Anchored Retainer Pricing',
        'The "Linchpin" Inbound LinkedIn Flywheel',
        'The Anti-Burnout Multi-Client Matrix'
      ],
      estimatedWordCount: '48,000 - 55,000 words (approx. 5.5 hrs audiobook)'
    },
    {
      id: 'biz-3',
      workingTitle: 'Unf*ck Your Focus: The Neuro-Divergent Guide to Ruthless Time Blocking, Dopamine Auditing, and Finishing What You Start',
      subgenre: 'Actionable Neuro-Productivity & Executive Dysfunction',
      hook: 'Traditional time management fails ADHD and overstimulated minds. Replace guilt with an evidence-based dopamine architecture that gets work done in 90-minute hyper-sprints.',
      targetAudience: 'Creatives, founders, and modern knowledge workers struggling with cognitive fatigue, digital doom-scrolling, and unfinished projects.',
      profitAngle: 'Evergreen perennial seller with immense viral TikTok/Instagram BookTok cross-appeal and phenomenal audio listen-through completion rates.',
      coreTropesOrFrameworks: [
        'The Dopamine Cost-Benefit Ledger',
        'Friction-Inversion Protocol',
        'Visual Body-Doubling Systems',
        'The 3-Item Daily Velocity Canvas'
      ],
      estimatedWordCount: '45,000 - 52,000 words (approx. 5 hrs audiobook)'
    }
  ],

  'Romance/Harlequin': [
    {
      id: 'rom-1',
      workingTitle: 'Terms of Enmity: A Grumpy/Sunshine Fake Marriage Romance with My Ruthless Corporate Rival',
      subgenre: 'Billionaire Enemies-to-Lovers / Forced Proximity / Fake Engagement',
      hook: 'He destroyed my father’s hedge fund. Now to secure an offshore trust, he needs a respectable wife for six months—and I need his billions to buy back my family’s estate.',
      targetAudience: 'Voracious Kindle Unlimited romance readers obsessed with slow-burn tension, sharp bantering dialogue, and dual-POV emotional fireworks.',
      profitAngle: 'The #1 highest page-read grossing subgenre on Amazon KDP. Massive fan engagement on BookTok and high Audible dual-narrator demand.',
      coreTropesOrFrameworks: [
        'Enemies to Lovers',
        'Only One Bed at the Gala',
        'Fake Engagement with strict non-romantic rules',
        '"Who Did This To You?" Protective Moment'
      ],
      estimatedWordCount: '75,000 - 85,000 words (approx. 9 hrs audiobook)'
    },
    {
      id: 'rom-2',
      workingTitle: 'The Mountain Haven Remedy: A Grumpy Single-Dad Small-Town Second Chance Romance',
      subgenre: 'Small-Town Contemporary Romance / Single Dad / Healing',
      hook: 'Returning to Silver Falls after a public scandal was supposed to be temporary. Then I collided with the town’s reclusive carpenter—my high school sweetheart who still looks at me like I stole his breath.',
      targetAudience: 'Readers seeking heartwarming, emotionally resonant love stories featuring protective fathers, adorable kids, and tight-knit cozy communities.',
      profitAngle: 'Perennial holiday and seasonal bestseller with fierce reader loyalty and high series read-through rates (Books 1-5 box sets).',
      coreTropesOrFrameworks: [
        'Single Dad & Town Sweetheart',
        'Second Chance at Love',
        'Small-Town Gossip & Whispered Secrets',
        'Snowed-in Cabin Confession'
      ],
      estimatedWordCount: '70,000 - 80,000 words (approx. 8.5 hrs audiobook)'
    },
    {
      id: 'rom-3',
      workingTitle: 'Crown of Salt and Starlight: A Morally Grey Shadow Prince & Reluctant Healer Fantasy Romance',
      subgenre: 'Romantasy / Dark Court Intrigue / High Stakes Banter',
      hook: 'I was sent to poison the heir to the Obsidian Throne. Instead, the lethal prince caught my blade with bare fingers—and offered me a throne of my own.',
      targetAudience: 'The exploding Romantasy market (Sarah J. Maas / Rebecca Yarros fans) craving high romantic stakes paired with dangerous magic.',
      profitAngle: 'Unrivaled pre-order velocities, special edition hardcovers, and passionate Audible fandoms driven by epic female protagonists.',
      coreTropesOrFrameworks: [
        'Morally Grey Hero who would burn the world for her',
        'Arranged Shadow Court Alliance',
        'Touch Her and You Perish',
        'Enemies with Hidden Vulnerabilities'
      ],
      estimatedWordCount: '85,000 - 95,000 words (approx. 10.5 hrs audiobook)'
    }
  ],

  'Fantasy': [
    {
      id: 'fan-1',
      workingTitle: 'The Teahouse at the End of the World: A Cozy Low-Stakes Portal Fantasy of Magic, Cinnamon, and Ancient Spirits',
      subgenre: 'Cozy Low-Stakes Portal Fantasy / Slice of Life',
      hook: 'After collapsing from corporate burnout in Tokyo, Mei wakes up in a sun-dappled valley with a dormant dragon and a run-down apothecary teahouse that brews memories into tea.',
      targetAudience: 'Fans of Legends & Lattes, cozy fantasy lovers, and stressed readers craving warm, uplifting, restorative escapism.',
      profitAngle: 'Low competition, massive viral word-of-mouth momentum, and exceptional audio narration appeal featuring cozy sound design and gentle voices.',
      coreTropesOrFrameworks: [
        'Cozy Found Family',
        'Magical Culinary & Herbal Crafting',
        'Low-Stakes Community Quests',
        'Gentle Mystery with ancient benevolent guardians'
      ],
      estimatedWordCount: '65,000 - 75,000 words (approx. 8 hrs audiobook)'
    },
    {
      id: 'fan-2',
      workingTitle: 'Ironclad Scribe: A LitRPG Progression Fantasy of Runes, Hard Limits, and Forgotten Dungeons',
      subgenre: 'Progression Fantasy / Hard Magic LitRPG / Dungeon Crawler',
      hook: 'In a kingdom where warriors gain stats by slaughter, an exiled archivist discovers the forbidden art of Rune Inscription—and turns bureaucratic math into god-slaying spells.',
      targetAudience: 'Progression fantasy enthusiasts, gamers, and Audible listeners who love incremental power scaling, hard magic rules, and clever underdogs.',
      profitAngle: 'Audible credit powerhouses: listeners devour 15+ hour audiobooks, leaving thousands of 5-star reviews on release day.',
      coreTropesOrFrameworks: [
        'Hard Magic System with strict costs',
        'Brain-over-Brawn System Optimization',
        'Dungeon Delving with high tactical stakes',
        'Zero-to-Hero Arc with intricate loot'
      ],
      estimatedWordCount: '90,000 - 110,000 words (approx. 12 hrs audiobook)'
    },
    {
      id: 'fan-3',
      workingTitle: 'The Clockwork Necromancer: A Gaslamp Steampunk Fantasy of Forbidden Aether and Murdered Aristocrats',
      subgenre: 'Gaslamp Victorian Steampunk / Occult Mystery Fantasy',
      hook: 'In soot-choked New Dunwall, reviving the dead is a capital crime. But when the Prime Minister is assassinated by an automaton, the Chief Inquisitor has only one option: hire the city’s most notorious illegal mechanist.',
      targetAudience: 'Fans of intricate world-building, gothic steam-tech, clever detective mysteries, and morally complex anti-heroes.',
      profitAngle: 'High cross-genre appeal between fantasy and mystery readers, commanding high Kindle box set sales and multi-character audio adaptations.',
      coreTropesOrFrameworks: [
        'Aether-Powered Clockwork Magic',
        'Reluctant Detective Partnership',
        'Victorian High Society vs Slum Underground',
        'Ticking Clock Mystery with occult conspiracies'
      ],
      estimatedWordCount: '80,000 - 90,000 words (approx. 9.5 hrs audiobook)'
    }
  ]
};
