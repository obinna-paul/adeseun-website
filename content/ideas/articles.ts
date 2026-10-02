export type IdeaPillar = {
  slug: string;
  label: string;
  description: string;
};

export type IdeaSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
  quote?: string;
};

export type IdeaArticle = {
  slug: string;
  title: string;
  dek: string;
  seoDescription: string;
  publishedAt: string;
  modifiedAt: string;
  pillar: IdeaPillar["slug"];
  topics: string[];
  featured?: boolean;
  sample?: boolean;
  hero: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    objectPosition?: string;
  };
  keyIdea: string;
  introduction: string[];
  sections: IdeaSection[];
  conclusion: string;
  related: string[];
};

export const IDEA_PILLARS = [
  {
    slug: "leadership-enterprise",
    label: "Leadership & Enterprise",
    description: "Building organisations, directing creative work, and turning useful ideas into durable institutions.",
  },
  {
    slug: "media-african-stories",
    label: "Media & African Stories",
    description: "How platforms, people, and patient editorial choices shape the stories a culture keeps.",
  },
  {
    slug: "architecture-design",
    label: "Architecture & Design",
    description: "Spaces, systems, and the quiet decisions that influence how people move, work, and belong.",
  },
  {
    slug: "purpose-communication",
    label: "Purpose, Communication & Relationships",
    description: "Language, faith, identity, and the human work of understanding one another well.",
  },
] as const satisfies readonly IdeaPillar[];

export const AUTHOR = {
  name: "Adeseun Oyeneye",
  slug: "adeseun-oyeneye",
  url: "/about",
  image: "/images/adeseun-portrait-approachable.jpg",
  role: "Entrepreneur, media executive, architect, interior designer, author, and corporate adviser",
  bio: "Adeseun Oyeneye works across enterprise, media, architecture, publishing, and social impact. Her writing examines how ideas become institutions, how environments shape people, and how thoughtful communication can create more durable work and relationships.",
} as const;

const ALL_IDEA_ARTICLES: readonly IdeaArticle[] = [
  {
    slug: "ideas-need-structure",
    title: "Ideas Need Structure Before They Need Scale",
    dek: "The leap from inspiration to institution is rarely a matter of enthusiasm. It is a matter of giving an idea a shape that can carry responsibility.",
    seoDescription:
      "A practical essay on turning promising ideas into durable organisations through clarity, systems, ownership, and patient execution.",
    publishedAt: "2026-09-26T09:00:00+01:00",
    modifiedAt: "2026-09-26T09:00:00+01:00",
    pillar: "leadership-enterprise",
    topics: ["creative leadership", "institution building", "execution"],
    featured: true,
    sample: true,
    hero: {
      src: "/images/adeseun-architecture-drafting.jpg",
      alt: "Architectural drawings and working materials arranged on a drafting surface",
      caption: "A useful idea becomes durable when its structure is visible enough to test.",
      width: 456,
      height: 230,
      objectPosition: "50% 50%",
    },
    keyIdea:
      "Scale magnifies whatever already exists. Before asking how an idea can grow, ask whether its purpose, decisions, ownership, and standards are clear enough to survive growth.",
    introduction: [
      "Ideas often arrive whole in the imagination and incomplete in the world. We can see the finished company, platform, programme, or movement long before we can explain how a decision will be made on an ordinary Tuesday. That distance between vision and operation is where many promising ideas become fragile.",
      "Structure is not the enemy of creativity. It is the form that allows creativity to keep its promise after the excitement of the beginning has passed. A well-structured idea can be shared, questioned, improved, and carried by people other than its originator.",
    ],
    sections: [
      {
        id: "name-the-problem",
        title: "Name the problem before naming the brand",
        paragraphs: [
          "A name, logo, launch date, and social account can make an idea feel real very quickly. None of them answers the harder question: what useful change will exist because this work exists? When the problem is vague, every opportunity appears relevant and the organisation begins to move in several directions at once.",
          "A clear problem statement creates a boundary. It identifies who the work serves, what is presently insufficient, and what a meaningful improvement looks like. That boundary helps a team say no without losing imagination. It also gives future decisions a standard more reliable than taste or urgency.",
        ],
        list: [
          "Who is experiencing the problem?",
          "What is the cost of leaving it unresolved?",
          "What change can this organisation credibly produce?",
          "What work is outside the promise?",
        ],
      },
      {
        id: "design-the-decisions",
        title: "Design the decisions, not only the departments",
        paragraphs: [
          "An organisational chart can show reporting lines while leaving authority completely unclear. The more useful design question is where decisions live. Who can commit money? Who protects quality? Who speaks for the audience? Which choices need consultation, and which choices need one accountable owner?",
          "Good structure reduces the number of decisions that must travel to the founder. It does not remove leadership; it makes leadership more deliberate. When routine judgement is distributed well, senior attention can return to direction, people, risk, and the few decisions that genuinely cannot be delegated.",
        ],
      },
      {
        id: "turn-values-into-behaviour",
        title: "Turn values into observable behaviour",
        paragraphs: [
          "Values become useful when they change what people do. “Excellence” is too broad until a team can describe what it means for a proposal, a programme, a client conversation, or a deadline. “Respect” becomes operational when it determines how quickly people respond, how disagreement is handled, and whose knowledge is invited into the room.",
          "A short set of behaviour-based standards is more powerful than a long declaration. It allows people to recognise quality, coach one another, and repair inconsistency without turning every correction into a debate about personality.",
        ],
      },
      {
        id: "build-a-rhythm",
        title: "Build a rhythm that makes progress visible",
        paragraphs: [
          "Institutions are built through repeated cycles of attention. A simple rhythm—weekly operating decisions, monthly learning reviews, quarterly strategic choices—creates places for different kinds of thinking. Without that rhythm, urgent work occupies every meeting and the important work remains permanently postponed.",
          "The goal is not administrative theatre. Every recurring meeting, report, and approval should help someone make a better decision. If a ritual no longer does that, redesign it. Structure earns its place by making responsibility clearer and useful work easier.",
        ],
        quote: "A durable organisation is an idea with enough structure to be trusted by other people.",
      },
    ],
    conclusion:
      "The right time to think about structure is not after growth has created confusion. It is while the idea is still small enough to examine honestly. Clarify the promise, locate decisions, translate values into behaviour, and establish a learning rhythm. Then scale has something sound to multiply.",
    related: ["building-an-ecosystem-not-just-a-brand", "the-quiet-work-of-creative-leadership"],
  },
  {
    slug: "designing-spaces-that-shape-behaviour",
    title: "Designing Spaces That Shape Behaviour",
    dek: "A room is never only a container. Its proportions, thresholds, light, and sequence quietly tell people what kind of behaviour belongs there.",
    seoDescription:
      "Explore how architecture and interior design influence behaviour through thresholds, circulation, light, material, and human-centred observation.",
    publishedAt: "2026-09-18T09:00:00+01:00",
    modifiedAt: "2026-09-18T09:00:00+01:00",
    pillar: "architecture-design",
    topics: ["architecture", "interior design", "human-centred design"],
    hero: {
      src: "/images/adeseun-architecture-site.jpg",
      alt: "An architectural project under construction with structural lines visible",
      caption: "The life of a space is shaped long before the finishing layer arrives.",
      width: 534,
      height: 386,
      objectPosition: "50% 48%",
    },
    keyIdea:
      "Good spatial design begins with the life that must happen inside a place. Form, material, and beauty become stronger when they support attention, dignity, movement, and belonging.",
    introduction: [
      "Every environment teaches. A narrow entrance can slow the body. A long shared table can encourage exchange. A badly placed door can turn a simple journey into a daily irritation. People may never name these effects, but they experience them repeatedly.",
      "This is why design cannot begin and end with appearance. The most convincing room is not the one with the most visual ideas. It is the one in which purpose, movement, light, sound, material, and maintenance have been considered together.",
    ],
    sections: [
      {
        id: "begin-with-life",
        title: "Begin with the life of the place",
        paragraphs: [
          "A brief often lists rooms and dimensions. A richer brief describes moments: arriving with bags in hand, holding a confidential conversation, preparing food while remaining part of a gathering, finding quiet after a demanding day. These moments reveal needs that a room schedule alone cannot show.",
          "Observe before drawing. Notice who uses the place, how their routines overlap, what they carry, what they avoid, and where friction already exists. The design becomes more precise when it responds to behaviour rather than an abstract picture of a user.",
        ],
      },
      {
        id: "thresholds-and-sequence",
        title: "Use thresholds and sequence deliberately",
        paragraphs: [
          "A threshold prepares a person for what comes next. The transition from public to private, bright to quiet, compressed to open, can create orientation without a sign. When every room is revealed at once, a building may be easy to photograph but emotionally flat to inhabit.",
          "Sequence creates meaning over time. A thoughtful arrival, a moment of pause, and a clear destination can make even a modest space feel composed. Architecture is experienced in movement, not as a single still image.",
        ],
      },
      {
        id: "light-material-maintenance",
        title: "Let light, material, and maintenance agree",
        paragraphs: [
          "Material is not only a palette. It carries temperature, sound, weight, memory, and the evidence of use. The most appropriate finish is one whose beauty can survive the way the space will actually be occupied and maintained.",
          "Light completes that material story. Daylight can support alertness and reveal texture, but glare can make a beautiful desk unusable. Warm evening light can invite rest, but poor task lighting creates strain. Design quality lives in those practical relationships.",
        ],
        list: [
          "Where does the eye rest on arrival?",
          "Which movement should feel effortless?",
          "Where are privacy and acoustic control essential?",
          "How will the material age under real use?",
        ],
      },
      {
        id: "design-for-belonging",
        title: "Design for belonging, not spectacle",
        paragraphs: [
          "A memorable space does not have to demand attention at every moment. It can offer clarity, comfort, and enough restraint for people to bring their own life into it. This is especially important in workplaces, homes, cultural spaces, and places of worship, where identity should not be reduced to decoration.",
          "Belonging grows when people understand how to use a place and recognise something of themselves within it. The designer's signature is strongest when it is expressed through coherence and care rather than constant display.",
        ],
      },
    ],
    conclusion:
      "Design shapes behaviour most responsibly when it does so with humility. Begin with observation, compose the journey, choose materials for real life, and leave room for people to belong. The result is not merely a space that looks complete; it is a place capable of supporting the life entrusted to it.",
    related: ["ideas-need-structure", "the-quiet-work-of-creative-leadership"],
  },
  {
    slug: "african-stories-need-institutions",
    title: "African Stories Need Institutions, Not Only Moments",
    dek: "A powerful story can travel quickly. Keeping a culture's stories visible, searchable, and useful requires patient editorial and institutional work.",
    seoDescription:
      "Why African storytelling needs durable media institutions, archives, editorial standards, distribution systems, and investment beyond viral moments.",
    publishedAt: "2026-09-09T09:00:00+01:00",
    modifiedAt: "2026-09-09T09:00:00+01:00",
    pillar: "media-african-stories",
    topics: ["African media", "storytelling", "cultural preservation"],
    hero: {
      src: "/images/adeseun-portrait-media-bw.jpg",
      alt: "Adeseun Oyeneye in a black-and-white media portrait",
      caption: "Visibility is a moment. Cultural memory requires continuity.",
      width: 388,
      height: 763,
      objectPosition: "50% 24%",
    },
    keyIdea:
      "Representation becomes durable when stories are supported by institutions that can commission, edit, preserve, distribute, and revisit them over time.",
    introduction: [
      "A story may become visible because one clip travels, one event captures attention, or one person breaks through. That visibility matters, but it is not the same as continuity. When attention moves elsewhere, what remains accessible? Who can find the work, learn from it, challenge it, or build on it?",
      "The long future of African storytelling depends not only on talented creators but on the systems around them: editorial judgement, archives, rights, training, financing, distribution, and leadership. These systems decide whether a moment becomes part of memory.",
    ],
    sections: [
      {
        id: "from-visibility-to-memory",
        title: "Move from visibility to memory",
        paragraphs: [
          "Platforms are excellent at surfacing what is immediate. They are less reliable at preserving context. A creator may reach thousands of people and still lose access to the audience, the source files, or the economic value of the work. Cultural memory cannot depend entirely on a changing feed.",
          "An institution preserves more than files. It preserves the relationships between a story, its maker, its moment, and the communities it describes. Useful archives need descriptions, dates, rights information, durable formats, and people responsible for their care.",
        ],
      },
      {
        id: "editorial-standards",
        title: "Treat editorial standards as infrastructure",
        paragraphs: [
          "Standards are sometimes mistaken for restrictions on creative freedom. At their best, they are a form of care. Verification protects the subject. Clear attribution protects the creator. Thoughtful editing protects the audience from confusion without erasing the texture of a voice.",
          "A strong editorial institution can hold several truths at once: urgency and accuracy, reach and depth, local specificity and global intelligibility. That balance is learned through practice and passed from one generation of makers to another.",
        ],
      },
      {
        id: "own-the-path",
        title: "Own more of the path from creation to audience",
        paragraphs: [
          "Distribution determines which stories are repeatedly encountered. When creators and African media organisations own too little of that path, they remain vulnerable to priorities set elsewhere. Ownership does not require isolation; it requires enough control to negotiate partnerships without surrendering the work's future.",
          "That control may include a direct audience relationship, clear rights agreements, reusable archives, multiple formats, and revenue that can fund the next commission. Each part makes creative independence more practical.",
        ],
        list: [
          "Commission with clear rights and responsibilities.",
          "Preserve masters and complete metadata.",
          "Build direct channels alongside third-party platforms.",
          "Invest in editors, producers, researchers, and archivists as well as visible talent.",
        ],
      },
      {
        id: "measure-continuity",
        title: "Measure continuity, not only reach",
        paragraphs: [
          "Reach answers how many people encountered a story. Continuity asks what the story made possible afterward. Was a new creator commissioned? Did an archive become easier to use? Did an audience return? Did the work enter a classroom, a policy conversation, or another body of creative work?",
          "These outcomes are slower and harder to display, but they are closer to cultural impact. Institutions make them visible because institutions can observe change across years rather than campaigns.",
        ],
        quote: "A culture keeps what its institutions make possible to find again.",
      },
    ],
    conclusion:
      "African stories deserve the energy of the moment and the discipline of continuity. The work is to build institutions capable of holding talent, context, rights, memory, and audience together. That is how visibility becomes inheritance.",
    related: ["building-an-ecosystem-not-just-a-brand", "purpose-that-survives-the-spotlight"],
  },
  {
    slug: "the-discipline-of-thoughtful-communication",
    title: "Thoughtful Communication Is a Discipline",
    dek: "Speaking well is not simply choosing softer words. It is learning to notice what a moment requires before language makes the moment larger.",
    seoDescription:
      "A practical framework for thoughtful communication: pause, understand the real issue, choose proportionate language, and make repair possible.",
    publishedAt: "2026-08-30T09:00:00+01:00",
    modifiedAt: "2026-08-30T09:00:00+01:00",
    pillar: "purpose-communication",
    topics: ["communication", "relationships", "self-awareness"],
    hero: {
      src: "/images/adeseun-think-before-you-speak.jpg",
      alt: "Adeseun Oyeneye with a copy of Think Before You Speak",
      caption: "The quality of a response begins before the first word.",
      width: 720,
      height: 782,
      objectPosition: "50% 25%",
    },
    keyIdea:
      "The pause before speaking is not emptiness. It is the working space in which intention, fact, emotion, consequence, and care can be brought into the same decision.",
    introduction: [
      "Words can clarify a problem or multiply it. The difference is not always eloquence. Often it is whether the speaker has taken enough time to understand the real issue, the emotional temperature, and the outcome the conversation should make possible.",
      "Thoughtful communication is therefore less about performing calmness and more about practising attention. It asks us to notice our own urgency, listen for what has not yet been said, and choose language proportionate to the moment.",
    ],
    sections: [
      {
        id: "pause-with-purpose",
        title: "Pause with purpose",
        paragraphs: [
          "A pause is useful when it creates room for a better response. It gives the body time to settle and the mind time to separate what happened from what has been assumed. Even a few seconds can prevent a passing emotion from becoming a permanent sentence.",
          "Pausing does not mean avoiding difficult conversations. Avoidance stores confusion. A purposeful pause prepares us to return with more accuracy, not to disappear from responsibility.",
        ],
      },
      {
        id: "separate-fact-story-need",
        title: "Separate the fact, the story, and the need",
        paragraphs: [
          "In conflict, three layers often become entangled. There is what can be observed, the story we have formed about why it happened, and the need or fear underneath our reaction. When all three are presented as fact, the other person is forced to defend against conclusions they may not recognise.",
          "Naming the layers separately creates a more workable conversation: what occurred, how it was interpreted, and what would help now. It also leaves room for information that may change the interpretation without denying the original impact.",
        ],
        list: [
          "What do I know directly?",
          "What meaning have I added?",
          "What feeling is influencing my tone?",
          "What useful outcome am I asking for?",
        ],
      },
      {
        id: "choose-proportion",
        title: "Choose language in proportion to the problem",
        paragraphs: [
          "Absolute language makes ordinary problems feel final. Words such as always, never, everyone, and nothing can turn a specific behaviour into a judgement about a whole person. Precision is kinder because it gives the conversation something that can actually be examined and changed.",
          "Proportion also applies to audience. Not every correction belongs in public, and not every disagreement needs a long written record. The medium should serve clarity, privacy, and the dignity of the people involved.",
        ],
      },
      {
        id: "leave-a-door-for-repair",
        title: "Leave a door open for repair",
        paragraphs: [
          "Communication fails sometimes, even with good intentions. Trust grows not from perfect speech but from the ability to recognise harm, correct the record, apologise without qualification, and change the behaviour that made the apology necessary.",
          "A conversation designed only to win leaves little room for repair. A conversation designed to understand and move forward can still be firm. It simply refuses to treat the other person's humiliation as evidence of success.",
        ],
      },
    ],
    conclusion:
      "Thoughtful speech begins with attention and ends with responsibility. Pause, separate fact from interpretation, use proportionate language, and leave a path for repair. Those practices do not make every conversation easy. They make more conversations useful.",
    related: ["purpose-that-survives-the-spotlight", "ideas-need-structure"],
  },
  {
    slug: "building-an-ecosystem-not-just-a-brand",
    title: "Build an Ecosystem, Not a Collection of Brands",
    dek: "Several ventures become an ecosystem only when each one has a clear role, a reason to connect, and enough independence to do its work well.",
    seoDescription:
      "How to design a coherent business ecosystem through shared purpose, distinct roles, reusable capabilities, and disciplined brand architecture.",
    publishedAt: "2026-08-21T09:00:00+01:00",
    modifiedAt: "2026-08-21T09:00:00+01:00",
    pillar: "leadership-enterprise",
    topics: ["brand architecture", "business ecosystems", "strategy"],
    hero: {
      src: "/images/adeseun-threesixty.jpg",
      alt: "Adeseun Oyeneye pictured in a media and enterprise setting",
      caption: "Coherence is created by relationships, not by making every venture look the same.",
      width: 720,
      height: 828,
      objectPosition: "50% 24%",
    },
    keyIdea:
      "An ecosystem is a portfolio of distinct promises supported by shared capabilities and a common direction. Similar ownership alone does not create strategic coherence.",
    introduction: [
      "Entrepreneurs often build in response to several real opportunities. One venture serves an audience, another develops a capability, and a third responds to a community need. Over time, the portfolio can become powerful—or confusing.",
      "The answer is not to force every venture into one name or visual identity. The answer is to define the relationship between them. Coherence comes from purpose, roles, shared assets, and clear boundaries.",
    ],
    sections: [
      {
        id: "shared-purpose-distinct-promise",
        title: "Share a purpose, keep each promise distinct",
        paragraphs: [
          "A portfolio needs a reason to belong together that is deeper than common ownership. That reason might be an audience, a capability, a geography, or a long-term social and commercial ambition. It should help explain why the group is better positioned because these ventures coexist.",
          "Within that shared direction, each brand needs one understandable promise. When several ventures make the same claim to the same audience, they compete for attention and investment inside their own house.",
        ],
      },
      {
        id: "map-value-flow",
        title: "Map how value moves between ventures",
        paragraphs: [
          "The useful connections in an ecosystem are specific. One company may create intellectual property, another may distribute it, and another may translate the audience knowledge into a service. Shared finance, legal, production, research, or technology can reduce duplication without erasing specialised judgement.",
          "Draw those flows. If a connection cannot be described, it may be only a story the portfolio tells about itself. If every connection requires founder intervention, the ecosystem has not yet become a system.",
        ],
      },
      {
        id: "choose-architecture",
        title: "Choose the right brand architecture",
        paragraphs: [
          "Some ventures benefit from a visible parent name. Others need distance because they serve different audiences or carry different kinds of risk. A branded house, house of brands, and endorsed model each make different promises about trust and independence.",
          "Choose the architecture after clarifying strategy, not before. Visual similarity should express a real relationship; it should not be used to manufacture one.",
        ],
        list: [
          "What trust should transfer from the parent?",
          "Where does a venture need its own voice?",
          "Which capabilities can be shared without slowing decisions?",
          "What risk should remain contained?",
        ],
      },
      {
        id: "govern-the-whole",
        title: "Govern the whole without suffocating the parts",
        paragraphs: [
          "Portfolio leadership needs two views at once: the health of each venture and the health of the whole. Shared capital and reputation require group-level discipline. Market knowledge and creative execution require authority close to the work.",
          "A small set of group standards—financial visibility, risk, people, quality, and strategic fit—can coexist with freedom in product, audience, and expression. The purpose of governance is to make good independence possible.",
        ],
      },
    ],
    conclusion:
      "A coherent ecosystem is not a row of logos. It is a designed relationship between purpose, promises, capabilities, and accountability. Make those relationships explicit, and the portfolio can create value that no single venture could create alone.",
    related: ["ideas-need-structure", "african-stories-need-institutions"],
  },
  {
    slug: "the-quiet-work-of-creative-leadership",
    title: "The Quiet Work of Creative Leadership",
    dek: "Creative leadership is visible in the final decision, but much of its value is created earlier—in the conditions that help other people think clearly.",
    seoDescription:
      "A thoughtful guide to creative leadership through better briefs, useful critique, decision clarity, constraints, and protection of the team's attention.",
    publishedAt: "2026-08-12T09:00:00+01:00",
    modifiedAt: "2026-08-12T09:00:00+01:00",
    pillar: "leadership-enterprise",
    topics: ["creative leadership", "teams", "decision making"],
    hero: {
      src: "/images/adeseun-about-hero.jpg",
      alt: "Adeseun Oyeneye seated at a working table in a dark architectural interior",
      caption: "Leadership creates the conditions in which considered work can emerge.",
      width: 1448,
      height: 1086,
      objectPosition: "62% 30%",
    },
    keyIdea:
      "A creative leader's most important output is not always an idea. It is often the clarity, trust, constraint, and decision rhythm that allow many people to produce their best work together.",
    introduction: [
      "The most visible creative leaders are often associated with taste: the ability to recognise the stronger direction and reject the weaker one. Taste matters, but it is only the final portion of the work. Before a team can present a meaningful choice, someone has to frame the problem well.",
      "Creative leadership is the practice of improving that environment. It gives people enough direction to move, enough room to contribute, and enough honesty to revise the work without losing confidence or purpose.",
    ],
    sections: [
      {
        id: "write-better-briefs",
        title: "Write briefs that create a useful field",
        paragraphs: [
          "A brief should define the problem, audience, desired change, constraints, and decision owner. It should not prescribe every expression of the answer. When a brief is too vague, the team guesses at strategy. When it is too controlling, the team decorates a conclusion that has already been made.",
          "The best brief creates a field wide enough for discovery and narrow enough for relevance. It also distinguishes what is fixed from what can be challenged.",
        ],
      },
      {
        id: "critique-the-work",
        title: "Critique the work without reducing the person",
        paragraphs: [
          "Useful critique is specific about the gap between the work and its purpose. “I do not like it” offers preference without direction. “The opening does not yet establish why this matters to the audience” gives the team a problem it can solve.",
          "Directness and respect are not opposites. A clear critique can protect time and raise the standard while preserving the dignity of the maker. That distinction is essential in creative environments, where the work often carries a great deal of personal investment.",
        ],
      },
      {
        id: "make-decisions-visible",
        title: "Make decisions and their reasons visible",
        paragraphs: [
          "Teams lose energy when decisions repeatedly reopen without new evidence. Record what was decided, who decided it, the reason, and what information would justify reconsideration. This creates continuity across meetings and helps people learn the judgement behind the direction.",
          "Visible reasoning also makes leadership more teachable. The team begins to understand not only what the leader prefers, but how trade-offs are evaluated.",
        ],
        list: [
          "What problem are we solving?",
          "Which criterion matters most here?",
          "What trade-off are we accepting?",
          "What would cause us to revisit this decision?",
        ],
      },
      {
        id: "protect-attention",
        title: "Protect the conditions for deep work",
        paragraphs: [
          "Creative work is damaged by constant partial attention. Leaders shape the environment through meeting culture, response expectations, planning quality, and the number of simultaneous priorities they permit.",
          "Protecting attention does not mean removing urgency from real deadlines. It means refusing to manufacture urgency through indecision. A team that knows what matters can concentrate with greater confidence.",
        ],
        quote: "The leader does not need to occupy every idea. The leader needs to make good work more possible.",
      },
    ],
    conclusion:
      "Creative leadership becomes stronger when it is less dependent on performance and more committed to conditions. Frame the work well, critique precisely, make decisions visible, and protect attention. The final output will carry the intelligence of more than one person—and still feel coherent.",
    related: ["ideas-need-structure", "designing-spaces-that-shape-behaviour"],
  },
  {
    slug: "purpose-that-survives-the-spotlight",
    title: "Purpose That Survives the Spotlight",
    dek: "Public attention can amplify meaningful work, but it can also quietly replace the work with the performance of being seen to do it.",
    seoDescription:
      "An essay on protecting purpose through private practice, accountable measures, community proximity, and a definition of success that outlives attention.",
    publishedAt: "2026-08-03T09:00:00+01:00",
    modifiedAt: "2026-08-03T09:00:00+01:00",
    pillar: "purpose-communication",
    topics: ["purpose", "leadership", "social impact"],
    hero: {
      src: "/images/adeseun-invitation.jpg",
      alt: "Adeseun Oyeneye standing in a composed portrait setting",
      caption: "Purpose is clearest in the work that continues when attention moves elsewhere.",
      width: 720,
      height: 948,
      objectPosition: "50% 22%",
    },
    keyIdea:
      "A durable purpose is translated into repeated practice, accountable outcomes, and relationships close enough to correct the story an organisation tells about itself.",
    introduction: [
      "Attention is useful. It can attract partners, resources, and people who need the work. But attention has its own incentives: simplify the story, foreground the visible person, and favour the moment that can be shared over the process that creates lasting change.",
      "Purpose survives when it has a life outside that spotlight. It is present in budgets, schedules, hiring, evaluation, and the ordinary choices that receive no public acknowledgement.",
    ],
    sections: [
      {
        id: "translate-purpose",
        title: "Translate purpose into a repeated practice",
        paragraphs: [
          "A purpose statement explains why the work matters. A practice determines whether that belief changes behaviour. If an organisation claims to develop people, where is the time for teaching, feedback, and progression? If it exists to preserve culture, where are the resources for documentation and care?",
          "The translation should be visible enough to examine. Repetition turns a noble intention into an institutional habit.",
        ],
      },
      {
        id: "measure-what-matters",
        title: "Measure what changed, not only what happened",
        paragraphs: [
          "Events, campaigns, and publications are outputs. They are necessary, but they do not automatically describe an outcome. A more demanding question is what became possible for people because the output existed.",
          "Good measures may include progress that is qualitative, slow, or shared with other organisations. The goal is not to force every human effect into a number. It is to prevent activity from becoming its own evidence of impact.",
        ],
      },
      {
        id: "stay-close",
        title: "Stay close enough to be corrected",
        paragraphs: [
          "Distance allows an organisation to mistake its intention for another person's experience. Purpose-led work needs relationships close enough to reveal when a programme is inconvenient, a message is incomplete, or a solution is answering the wrong question.",
          "Feedback is most useful when it can influence resources and decisions. Listening sessions without a path to change may create the appearance of participation while protecting the original plan from challenge.",
        ],
        list: [
          "Who can challenge the organisation's account of its impact?",
          "What evidence would change the plan?",
          "Which outcomes matter after the campaign has ended?",
          "What work continues if recognition disappears?",
        ],
      },
      {
        id: "share-the-credit",
        title: "Share the credit and strengthen the continuity",
        paragraphs: [
          "Public narratives often compress collective work into one visible face. Responsible leadership names the people, communities, and institutions that made the outcome possible. This is not modesty as performance; it is an accurate account of how change happens.",
          "Shared credit also strengthens succession. When knowledge, relationships, and recognition are distributed, the work becomes less dependent on one person's constant presence.",
        ],
      },
    ],
    conclusion:
      "The spotlight can serve purpose, but it cannot define it. Anchor the work in repeated practice, measure change honestly, remain close enough to be corrected, and distribute credit. Purpose becomes durable when it can continue without needing to be watched.",
    related: ["the-discipline-of-thoughtful-communication", "african-stories-need-institutions"],
  },
] as const;

/**
 * Only explicitly approved entries are exposed by the public registry. The
 * remaining essays stay available as draft reference copy without generating
 * routes, cards, sitemap entries, or feed items.
 */
export const IDEA_ARTICLES: readonly IdeaArticle[] = ALL_IDEA_ARTICLES.filter(
  (article) => article.sample,
);

export function getIdeaArticle(slug: string): IdeaArticle | undefined {
  return IDEA_ARTICLES.find((article) => article.slug === slug);
}

export function getIdeaPillar(slug: string): IdeaPillar {
  return IDEA_PILLARS.find((pillar) => pillar.slug === slug) ?? IDEA_PILLARS[0];
}

export function getRelatedIdeas(article: IdeaArticle): IdeaArticle[] {
  const explicit = article.related
    .map((slug) => getIdeaArticle(slug))
    .filter((candidate): candidate is IdeaArticle => Boolean(candidate));

  if (explicit.length >= 3) return explicit.slice(0, 3);

  const fallbacks = IDEA_ARTICLES.filter(
    (candidate) => candidate.slug !== article.slug && !explicit.some((item) => item.slug === candidate.slug),
  ).sort((a, b) => Number(b.pillar === article.pillar) - Number(a.pillar === article.pillar));

  return [...explicit, ...fallbacks].slice(0, 3);
}

export function articleWordCount(article: IdeaArticle): number {
  const text = [
    article.title,
    article.dek,
    article.keyIdea,
    ...article.introduction,
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.list ?? []),
      ...(section.quote ? [section.quote] : []),
    ]),
    article.conclusion,
  ].join(" ");

  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function articleReadingMinutes(article: IdeaArticle): number {
  return Math.max(1, Math.ceil(articleWordCount(article) / 220));
}

export function formatIdeaDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
}
