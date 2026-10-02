export type IdeaPillar = {
  slug: string;
  label: string;
  description: string;
};

export type IdeaImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type IdeaSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
  quote?: string;
  image?: IdeaImage;
};

export type IdeaReference = {
  title: string;
  authors: string;
  publication: string;
  year: string;
  url: string;
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
  hero: IdeaImage;
  keyIdea: string;
  introduction: string[];
  sections: IdeaSection[];
  conclusion: string;
  references: IdeaReference[];
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

export const IDEA_ARTICLES: readonly IdeaArticle[] = [
  {
    slug: "ideas-need-structure",
    title: "Ideas Need Structure Before They Need Scale",
    dek: "Growth does not repair an organisation. It magnifies what is already there—its clarity, its confusion, its discipline, and its dependence on a few people.",
    seoDescription:
      "A research-backed guide to building the decision rights, management systems, operating rhythms, and learning culture an idea needs before it scales.",
    publishedAt: "2026-10-02T21:30:00+01:00",
    modifiedAt: "2026-10-02T21:30:00+01:00",
    pillar: "leadership-enterprise",
    topics: ["organisational structure", "business scaling", "decision rights", "management systems", "leadership"],
    featured: true,
    hero: {
      src: "/images/ideas/ideas-need-structure-hero.webp",
      alt: "Architectural plans and a modular wooden structure expanding from a small central block",
      caption: "Structure turns growth from a leap of faith into a sequence of choices that can be understood, tested, and improved.",
      width: 1920,
      height: 1080,
      objectPosition: "50% 50%",
    },
    keyIdea:
      "Scale is an amplifier, not a cure. Before an idea grows, its purpose, decision rights, information flows, standards, and learning rhythm must be clear enough for other people to carry the work responsibly.",
    introduction: [
      "A promising idea can feel complete in the imagination long before it is ready to survive contact with growth. The founder can see the destination, make the judgement calls, correct the work, and explain the intention in real time. At a small scale, that personal attention can hold the whole enterprise together. It is also easy to mistake that closeness for an operating system.",
      "Then demand increases. More people join. Projects overlap. Clients expect consistency. Decisions that once happened across a desk begin to travel through several hands. The organisation becomes busy, but busyness conceals an important question: has the idea become clear enough to be carried by people who were not present at its beginning?",
      "That is why structure must come before scale. Structure is not bureaucracy for its own sake. It is the practical architecture of responsibility: what the organisation is promising, who may decide, what information must move, which standards cannot be traded away, and how the team learns when reality challenges the plan.",
    ],
    sections: [
      {
        id: "scale-is-an-amplifier",
        title: "Scale is an amplifier, not a cure",
        paragraphs: [
          "Growth increases volume, but it also increases distance. There is more distance between the founder and the customer, between a decision and its consequences, and between the original intention and the person executing it. Every ambiguity that one person once resolved instinctively becomes a question that several people can answer differently.",
          "Research on management practices helps explain why this matters. A large study of more than 11,000 firms across 34 countries found that differences in management practices account for a meaningful share of productivity differences both within and between countries. Another US Census-linked study of roughly 32,000 manufacturing plants found that structured management practices explained about one-fifth of the variation in productivity—comparable to the contribution associated with research and development and greater than that associated with information technology in the study.",
          "These findings do not mean every organisation should look the same. They show that management itself is productive work. Monitoring what matters, setting usable targets, developing people, and acting on evidence are not administrative extras added after the ‘real’ work. They are part of how the real work becomes reliable.",
        ],
        quote: "When an organisation grows, every unwritten rule becomes a potential point of friction.",
      },
      {
        id: "define-the-promise",
        title: "Define the promise before designing the organisation",
        paragraphs: [
          "Structure should begin with purpose, not an organisational chart. A chart can distribute titles while leaving the central promise untouched. The more useful starting point is to describe the change the organisation exists to create, the people it exists to serve, and the boundaries of what it will not attempt.",
          "A clear promise is an operating constraint. It allows a team to distinguish an attractive opportunity from a relevant one. It gives product decisions, hiring choices, partnerships, and budgets a common reference point. Without that constraint, scale often becomes a collection of unrelated yeses: more offers, more platforms, more activity, and less coherence.",
          "The promise must be specific enough to guide an ordinary week. If it appears only in a vision statement, it is too distant from the work. Teams should be able to use it when deciding what to prioritise, what quality looks like, and when a request falls outside the organisation's responsibility.",
        ],
        list: [
          "Who is the work for, and what problem are they trusting us to solve?",
          "What observable change should exist because we did the work well?",
          "Which standards are part of the promise rather than optional preferences?",
          "What will we deliberately refuse, even when it could produce short-term revenue or attention?",
        ],
      },
      {
        id: "design-decision-rights",
        title: "Design decision rights before adding departments",
        paragraphs: [
          "An organisational chart shows where people sit. It does not necessarily show where judgement lives. Two people can share a reporting line and still disagree about who may approve a spend, change a deadline, speak for the brand, accept a client, or stop work that does not meet the standard.",
          "Decision rights make responsibility visible. For each recurring decision, the organisation should identify the person who owns the final call, the people whose knowledge must be consulted, the information required, and the conditions that trigger escalation. Consultation can be broad; final accountability should be clear.",
          "This is also how a founder protects attention. If every choice must return to one person, the organisation has not scaled—it has lengthened the queue around that person. The goal is not to remove the founder from the work. It is to reserve senior judgement for direction, talent, risk, capital, and the decisions whose consequences genuinely justify it.",
        ],
        image: {
          src: "/images/ideas/decision-rights-structure.webp",
          alt: "Wooden blocks connected by brass paths from one decision point to three clear endpoints",
          caption: "Clear decision rights give each recurring choice an owner, an information path, and an escalation point.",
          width: 1200,
          height: 900,
        },
        list: [
          "Name the decision, not only the role.",
          "Give one person final accountability for routine choices.",
          "State who contributes evidence and who must be informed.",
          "Define the threshold at which the decision moves upward.",
        ],
      },
      {
        id: "information-enables-delegation",
        title: "Build the information that makes delegation safe",
        paragraphs: [
          "Delegation is often discussed as a matter of trust. Trust matters, but information makes trust actionable. A manager cannot take responsibility for an outcome if the relevant costs, customer signals, quality measures, deadlines, or risks are invisible. In that condition, delegation becomes guesswork and centralisation begins to feel safer than it is.",
          "A field experiment in Indian textile plants offers unusually concrete evidence. Plants that adopted a set of modern management practices raised productivity by an average of 11 percent through improvements in quality, efficiency, and inventory. The researchers also observed greater decentralisation: better information flows enabled owners to delegate more decisions to middle managers.",
          "The lesson is not that every organisation needs a dense dashboard. It needs a small set of truthful signals tied to decisions. A useful measure has an owner, a review rhythm, and a consequence. If nobody acts when the number changes, the organisation is collecting data rather than creating information.",
        ],
        list: [
          "What must the decision-maker know before acting?",
          "Where does that information come from, and how current is it?",
          "Which signal requires action rather than discussion?",
          "Who checks whether the action produced the intended result?",
        ],
      },
      {
        id: "values-as-behaviour",
        title: "Translate values into behaviour and trade-offs",
        paragraphs: [
          "Values become structural when they change a decision. ‘Excellence’ is not yet a standard until the team knows what must be checked before work is released. ‘Respect’ is not yet a practice until it shapes response times, disagreement, credit, and the treatment of people with less formal power. ‘Integrity’ becomes real when the organisation is willing to lose an opportunity rather than misrepresent what it can deliver.",
          "This translation matters most under pressure. When time is short or revenue is uncertain, abstract values compete badly with immediate demands. Behaviour-based standards make the trade-off explicit before the crisis arrives. They also make coaching fairer: feedback can refer to an agreed practice instead of becoming a judgement about personality.",
          "The strongest cultures do not rely on slogans to produce alignment. They connect purpose, expected behaviour, decision rights, and consequences. People understand not only what the organisation celebrates, but what it will correct and what it will never excuse.",
        ],
      },
      {
        id: "build-an-operating-rhythm",
        title: "Create an operating rhythm that separates urgency from importance",
        paragraphs: [
          "An organisation needs recurring places for different kinds of thought. Daily coordination should not consume the time intended for learning. A financial review should not become a substitute for a customer conversation. A strategy meeting should not be overtaken by tasks that could have been resolved by one accountable owner.",
          "A simple rhythm can protect these distinctions: short weekly operating reviews for commitments and obstacles; monthly learning reviews for customers, quality, people, and cash; and quarterly choices about direction, investment, and what the organisation should stop doing. The precise cadence will vary, but each meeting should have a decision purpose, a prepared evidence set, and a named owner for the next action.",
          "Rhythm is valuable because it makes reality harder to avoid. Assumptions meet evidence at a known time. Problems do not need to become emergencies before they receive attention. Progress becomes visible, and the team can adjust the system instead of repeatedly improvising around the same weakness.",
        ],
        image: {
          src: "/images/ideas/operating-rhythm-learning.webp",
          alt: "A measured sequence of handmade paper circles and geometric markers linked by graphite arrows",
          caption: "A useful operating rhythm repeats what works while leaving deliberate room to adjust what does not.",
          width: 1200,
          height: 900,
        },
      },
      {
        id: "minimum-viable-management-system",
        title: "Install a minimum viable management system",
        paragraphs: [
          "The fear that systems will suffocate entrepreneurial energy is understandable—and often overstated. Stanford researchers studying high-growth companies found that young firms commonly encounter an ‘entrepreneurial crisis’ as they move from a personal to a professional management style, often around 50 to 100 employees. In their research, earlier adoption of management systems was associated with faster growth, larger scale, and lower CEO turnover.",
          "The answer is not to import the machinery of a large corporation into a small team. It is to build the minimum system the present level of complexity requires. Every process should solve a recurring coordination, quality, risk, or learning problem. If it cannot explain the decision it improves, it should be simplified or removed.",
          "A minimum viable management system is light enough to use and strong enough to create continuity. It normally includes a clear strategic promise, explicit decision rights, a few operating measures, a planning and review rhythm, basic financial control, an intentional hiring and onboarding method, and a way to document the lessons the organisation cannot afford to relearn.",
        ],
        quote: "Structure earns its place when it makes good judgement easier to repeat.",
      },
      {
        id: "structure-must-learn",
        title: "Build a structure that can learn, not only comply",
        paragraphs: [
          "A system can be orderly and still be wrong. This is why structure must include a way for people to challenge assumptions, report errors, and surface weak signals without paying an unnecessary interpersonal price. Harvard professor Amy Edmondson's research on psychological safety links a climate of interpersonal safety with learning behaviours such as asking for help, experimenting, and discussing mistakes.",
          "Psychological safety is not the absence of standards or accountability. It is the confidence that candour is welcome in service of the work. Leaders create it by responding constructively to unwelcome information, admitting what they do not know, and distinguishing an intelligent experiment from careless repetition.",
          "As the organisation grows, this learning capacity becomes a form of risk control. Senior leaders will know less about the edge of the work than the people closest to customers, operations, and communities. A structure that moves information upward—and permits the plan to change—can remain coherent without becoming rigid.",
        ],
        list: [
          "Can someone stop work when quality or safety is at risk?",
          "Can a junior colleague question an assumption without being labelled difficult?",
          "Are mistakes examined for system causes as well as individual responsibility?",
          "Does evidence change the plan, or is feedback collected after the decision is already fixed?",
        ],
      },
    ],
    conclusion:
      "The right time to design structure is before growth turns every ambiguity into a recurring cost. Define the promise. Make decisions and escalation paths visible. Build the information that permits responsible delegation. Translate values into behaviour. Establish a rhythm for operating and learning. Then review the system as the work changes. Scale will still bring complexity, but it will no longer be asked to solve problems it can only magnify. It will have something sound to multiply.",
    references: [
      {
        title: "Building Sustainable High-Growth Startup Companies: Management Systems as an Accelerator",
        authors: "Antonio Davila, George Foster, and Ning Jia",
        publication: "California Management Review / Stanford Graduate School of Business",
        year: "2010",
        url: "https://www.gsb.stanford.edu/faculty-research/publications/building-sustainable-high-growth-startup-companies-management-systems",
      },
      {
        title: "Does Management Matter? Evidence from India",
        authors: "Nicholas Bloom, Benn Eifert, Aprajit Mahajan, David McKenzie, and John Roberts",
        publication: "NBER Working Paper 16658",
        year: "2011",
        url: "https://www.nber.org/papers/w16658",
      },
      {
        title: "Management as a Technology?",
        authors: "Nicholas Bloom, Raffaella Sadun, and John Van Reenen",
        publication: "NBER Working Paper 22327",
        year: "2016, revised 2017",
        url: "https://www.nber.org/papers/w22327",
      },
      {
        title: "What Drives Differences in Management?",
        authors: "Nicholas Bloom, Erik Brynjolfsson, Lucia Foster, Ron S. Jarmin, Megha Patnaik, Itay Saporta-Eksten, and John Van Reenen",
        publication: "NBER Working Paper 23300",
        year: "2017",
        url: "https://www.nber.org/papers/w23300",
      },
      {
        title: "Managing the Risk of Learning: Psychological Safety in Work Teams",
        authors: "Amy C. Edmondson",
        publication: "Harvard Business School Working Paper 02-062",
        year: "2002",
        url: "https://www.hbs.edu/ris/download.aspx?name=02-062.pdf",
      },
    ],
    related: [],
  },
];

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
      ...(section.image ? [section.image.caption, section.image.alt] : []),
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
