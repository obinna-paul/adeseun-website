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
  sourceUrls?: string[];
};

export type IdeaReference = {
  title: string;
  authors: string;
  publication: string;
  year: string;
  url: string;
};

export type IdeaInternalLink = {
  title: string;
  description: string;
  href: string;
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
  inspiredBy?: IdeaInternalLink;
  sections: IdeaSection[];
  conclusion: string;
  references: IdeaReference[];
  internalLinks?: IdeaInternalLink[];
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
  image: "/images/portraits/ideas-author.jpg",
  role: "Entrepreneur, media executive, architect, interior designer, author, and corporate adviser",
  bio: "Adeseun Oyeneye works across enterprise, media, architecture, publishing, and social impact. Her writing examines how ideas become institutions, how environments shape people, and how thoughtful communication can create more durable work and relationships.",
} as const;

const WHO_STRESS_GUIDE = "https://www.who.int/thailand/activities/doing-what-matters-in-times-of-stress";
const WHO_STRESS_PLATFORM = "https://www.emro.who.int/mhps/dealing_with_stress.html";
const SLOW_BREATHING_REVIEW = "https://pubmed.ncbi.nlm.nih.gov/30245619/";
const NCCIH_MINDFULNESS = "https://www.nccih.nih.gov/health/meditation-and-mindfulness-effectiveness-and-safety";
const HARVARD_CALM = "https://www.health.harvard.edu/mind-and-mood/staying-calm-in-turbulent-times";
const GOTTMAN_BOUNDARIES = "https://www.gottman.com/blog/are-you-protecting-your-peace-or-just-avoiding-hard-situations/";

export const IDEA_ARTICLES: readonly IdeaArticle[] = [
  {
    slug: "how-to-find-peace-in-chaos",
    title: "How to Find Peace in Chaos: 7 Practices for Staying Steady",
    dek: "Peace is not the reward waiting after life becomes quiet. It is the practiced ability to return to yourself, choose what matters, and take the next honest step while the noise is still present.",
    seoDescription:
      "Learn how to find peace in chaos with seven evidence-informed practices for grounding, calm, clear action, healthy boundaries, and everyday tranquility.",
    publishedAt: "2026-10-03T18:00:00+01:00",
    modifiedAt: "2026-10-03T18:00:00+01:00",
    pillar: "purpose-communication",
    topics: [
      "how to find peace in chaos",
      "how to stay calm in chaos",
      "inner peace",
      "grounding techniques",
      "healthy boundaries",
      "Tranquility",
    ],
    featured: true,
    hero: {
      src: "/images/ideas/how-to-find-peace-in-chaos-hero.webp",
      alt: "Illustration of a composed Black woman standing steady while papers and abstract storm shapes swirl around her",
      caption: "Tranquility is not a life without motion; it is the ability to keep your footing while life moves around you.",
      width: 1920,
      height: 1080,
      objectPosition: "50% 48%",
    },
    keyIdea:
      "Peace in chaos is not the absence of noise, conflict, or uncertainty. It is the practiced ability to steady your attention, make room for difficult feelings, and choose the next right action without letting the storm make every decision for you.",
    introduction: [
      "There are seasons when peace sounds like a luxury. The messages keep arriving. Work follows you home. Someone you love needs more than you know how to give. The news makes the future feel close and unstable. Even a quiet room can become crowded with rehearsed conversations, imagined outcomes, and decisions that have not yet found their shape.",
      "In those seasons, waiting for life to become calm before you become steady gives the world complete control of your inner weather. Something will always be unfinished, uncertain, or outside your power. The more durable alternative is to learn how to return: to the body, to the present, to what you can influence, to the people who help you remember yourself, and to the values that can still guide the next choice.",
      "That is the understanding of tranquility explored here. It does not ask you to deny pressure, perform serenity, or become untouched by difficulty. It asks whether you can meet reality without surrendering every part of your attention to it. The seven practices below are small enough to use in an ordinary day and sturdy enough to revisit when the day is not ordinary at all.",
    ],
    inspiredBy: {
      title: "Tranquility",
      description:
        "This essay continues the book’s central invitation: cultivate serenity as a repeatable practice inside the life you already have, rather than a destination reached after every storm has passed.",
      href: "/books#tranquility",
    },
    sections: [
      {
        id: "what-does-peace-in-chaos-mean",
        title: "What does it mean to find peace in chaos?",
        paragraphs: [
          "To find peace in chaos is to become less governable by the loudest thing in the room. The difficulty may remain real. Your body may still register strain. You may still need to make a hard call, hold a boundary, grieve a loss, or ask for help. Peace does not erase those facts. It gives you enough inner space to respond to them without becoming identical to them.",
          "This is why calm and control are not the same. Control tries to force uncertainty into a shape it cannot always take. Calm notices what is here, separates the workable from the uncontrollable, and preserves the judgement needed for the next useful action. One demands that the world settle down; the other strengthens your ability to meet the world as it is.",
          "The World Health Organization’s stress guidance uses a similar practical frame: ground yourself, unhook from difficult thoughts, make room for emotions, act on values, and engage with kindness. None of these practices requires you to pretend the storm has gone. They help you keep hold of choice while it passes through.",
        ],
        quote: "Peace is not a performance of stillness. It is the capacity to return without abandoning reality.",
        sourceUrls: [WHO_STRESS_GUIDE, WHO_STRESS_PLATFORM],
      },
      {
        id: "return-to-the-body",
        title: "1. Return to the body before solving the story",
        paragraphs: [
          "When life feels overwhelming, the mind often races ahead of the moment. It writes an ending before the facts have arrived, replays what cannot be changed, or tries to solve five problems at once. Before asking the mind for a better story, give the body a clearer signal about where you are now.",
          "Place both feet on the floor. Let your shoulders fall. Notice the support beneath you. Then breathe slowly and gently, without forcing an unusually deep breath. You might lengthen the exhale slightly, or simply count an even rhythm that feels comfortable. A systematic review of slow-breathing research found recurring associations with changes in autonomic and brain activity, alongside reports of increased comfort and relaxation, although the underlying studies varied in design and quality.",
          "Grounding is not a trick for making every feeling disappear. It is a way of reducing the distance between your attention and the present. If focusing on breath feels uncomfortable, orient through the senses instead: name what you can see, feel the chair or floor supporting you, and listen for the nearest and farthest sounds. The method matters less than the return.",
        ],
        image: {
          src: "/images/ideas/grounding-in-the-present.webp",
          alt: "Flat illustration of a Black woman’s feet rooted in earth with concentric rings and branching roots",
          caption: "Grounding begins with what is already supporting you: the floor, the breath, the body, and this particular moment.",
          width: 1200,
          height: 900,
        },
        list: [
          "Feel the weight of both feet or the support of the chair.",
          "Relax one place you are bracing: the jaw, hands, shoulders, or stomach.",
          "Take five slow, comfortable breaths; stop if you feel dizzy or strained.",
          "Name three things you can see, two you can hear, and one you can physically feel.",
        ],
        sourceUrls: [SLOW_BREATHING_REVIEW, WHO_STRESS_PLATFORM, HARVARD_CALM],
      },
      {
        id: "name-what-is-happening",
        title: "2. Name what is happening without becoming it",
        paragraphs: [
          "A feeling becomes harder to work with when it turns into an identity. There is a difference between ‘I am failing’ and ‘I am noticing the fear that I may fail.’ The second sentence does not deny the fear. It places a small, necessary space between the person and the thought.",
          "Use plain language. ‘I am disappointed.’ ‘My chest feels tight.’ ‘I keep imagining the worst outcome.’ ‘I am angry because this mattered to me.’ Naming an experience can interrupt the blur in which sensation, prediction, memory, and fact all arrive as one unquestionable message.",
          "The aim is not to argue yourself out of what you feel. It is to see the feeling clearly enough that it does not have to impersonate an instruction. You can be afraid and still make a careful phone call. You can be angry and wait before sending the message. You can be uncertain and choose one responsible step.",
        ],
        sourceUrls: [WHO_STRESS_PLATFORM, NCCIH_MINDFULNESS],
      },
      {
        id: "sort-control-from-concern",
        title: "3. Separate what you can influence from what you cannot",
        paragraphs: [
          "Chaos grows when every concern feels like an assignment. You may care deeply about an outcome that you cannot command: another person’s response, the pace of an institution, the past, the market, the weather, or the timing of an answer. Care is human. Carrying each uncertainty as though it were yours to control is exhausting.",
          "Draw two columns. In the first, write what is within your influence today: the question you can ask, the document you can prepare, the apology you can make, the amount you can spend, the rest you can protect, the professional advice you can seek. In the second, place what is not yours to direct. The second column is not a list of things that do not matter. It is a list of things that cannot receive today’s labour in the same way.",
          "Then choose one action from the first column. Peace often returns through specificity. ‘Fix my life’ has no edge and no beginning. ‘Send the honest email by noon’ does. A small action cannot guarantee an outcome, but it can restore your relationship with your own agency.",
        ],
        list: [
          "What is true right now, before prediction is added?",
          "What can I influence in the next hour or day?",
          "What needs another person, more information, or more time?",
          "What must I stop carrying as though worry were the same as work?",
        ],
        sourceUrls: [WHO_STRESS_PLATFORM],
      },
      {
        id: "protect-attention-without-avoiding-life",
        title: "4. Protect your attention without avoiding your life",
        paragraphs: [
          "‘Protect your peace’ is useful advice until it becomes a beautiful name for disappearing. A healthy boundary limits the way pressure enters your life so that you can remain present, honest, and responsible. Avoidance may offer immediate relief, but it often leaves the necessary conversation, decision, or repair waiting in the same place.",
          "A practical test is to ask whether your boundary has a purpose and, where it is safe, a path back. Turning off notifications during dinner protects attention. Pausing a heated conversation and agreeing to return tomorrow protects the possibility of a better conversation. Refusing an unsafe situation is not avoidance; safety takes priority. But repeatedly withdrawing from ordinary discomfort without explanation can quietly make life smaller.",
          "Protecting attention also means choosing the rhythm of information. You can care about the world without consuming a continuous stream of it. Decide when you will check the news, which sources deserve trust, and what you will do after learning something important. Information that cannot become understanding or action may need a boundary around its access to you.",
        ],
        image: {
          src: "/images/ideas/protect-peace-without-avoidance.webp",
          alt: "Flat illustration of a Black woman holding an open green gate between a noisy space and a calm path",
          caption: "A healthy boundary is not always a wall. Often, it is a gate with a purpose, a limit, and a considered way forward.",
          width: 1200,
          height: 900,
        },
        list: [
          "Name the limit: what will you do, stop doing, or postpone?",
          "Name the reason: what value, safety need, or responsibility does it protect?",
          "Name the return: if a return is safe and appropriate, when and how will you re-engage?",
        ],
        sourceUrls: [WHO_STRESS_PLATFORM, GOTTMAN_BOUNDARIES],
      },
      {
        id: "choose-a-value-before-an-action",
        title: "5. Choose a value before choosing an action",
        paragraphs: [
          "Pressure creates false urgency. It says the fastest reaction is the truest one. Values slow the moment just enough to ask a better question: who do I want to be in the way I handle this?",
          "Choose one value that the situation needs—courage, kindness, honesty, patience, dignity, stewardship, or justice. Then translate it into behaviour small enough to perform. Honesty may mean correcting an assumption. Kindness may mean changing the tone without changing the truth. Courage may mean asking for help before the problem grows. Dignity may mean leaving a conversation that has become abusive.",
          "This does not guarantee that the decision will feel peaceful. Some value-aligned choices are costly. The peace comes from coherence: your action belongs to the person you are trying to become, rather than only to the emotion that was loudest for a few minutes.",
        ],
        sourceUrls: [WHO_STRESS_GUIDE],
      },
      {
        id: "borrow-steadiness-from-others",
        title: "6. Borrow steadiness from other people",
        paragraphs: [
          "Self-possession does not require self-isolation. Sometimes peace returns in the presence of someone who can listen without escalating the moment, offer practical help, share a meal, pray with you if that is part of your life, or remind you of the facts when fear has made them difficult to hold.",
          "Ask specifically for the kind of support you need. ‘Can you listen for ten minutes without trying to solve this?’ is easier to answer than ‘I need help.’ So is ‘Can you review this decision with me tomorrow?’ or ‘Can you sit with me while I make the call?’ Specific requests give care a shape.",
          "The WHO notes that social support can mean emotional validation, practical assistance, connection with a community or service, or simply spending time together without discussing the problem. Steadiness is often relational: another person does not remove the storm, but their presence can help you remember that you are not the storm either.",
        ],
        sourceUrls: [WHO_STRESS_PLATFORM],
      },
      {
        id: "practice-before-you-need-it",
        title: "7. Practise tranquility before you urgently need it",
        paragraphs: [
          "No practice becomes dependable only because the emergency has arrived. The smallest daily ritual—a few quiet breaths before opening your phone, a short walk after work, a page of unedited writing, an evening check-in with someone you trust—creates a familiar route back to yourself.",
          "Consistency matters more than theatre. Ten minutes you can repeat is more useful than an elaborate routine that collapses on a demanding day. Attach the practice to something that already happens: after brushing your teeth, before the first meeting, at the end of lunch, when you close the laptop. Let the cue carry the habit when motivation is absent.",
          "Mindfulness practices can be useful for some people, but they are not a universal cure and the evidence varies by condition and study quality. The US National Center for Complementary and Integrative Health also notes that a minority of participants in a large review reported negative effects. Begin gently, choose practices that help rather than destabilise you, and seek qualified guidance when needed.",
        ],
        quote: "The purpose of a tranquility practice is not to become untroubled. It is to become more able to return.",
        sourceUrls: [NCCIH_MINDFULNESS, WHO_STRESS_GUIDE],
      },
      {
        id: "five-minute-reset",
        title: "A five-minute reset when everything feels like too much",
        paragraphs: [
          "When you cannot do all seven practices, use this shorter sequence. Treat it as an orientation, not a test. If one step is not suitable in the moment, move to the next.",
        ],
        list: [
          "Minute 1 — Arrive: feel the ground or chair and look slowly around the space you are in.",
          "Minute 2 — Breathe: use a slow, comfortable rhythm without forcing the inhale.",
          "Minute 3 — Name: say what you are feeling and what you are predicting, as two separate things.",
          "Minute 4 — Sort: identify what is within your influence before the day ends.",
          "Minute 5 — Choose: take one action that reflects the value you want to bring to the situation.",
        ],
        sourceUrls: [WHO_STRESS_GUIDE, SLOW_BREATHING_REVIEW],
      },
      {
        id: "when-self-help-is-not-enough",
        title: "When is self-help not enough?",
        paragraphs: [
          "An article can offer language and practices; it cannot assess your health or replace individual care. If distress is persistent, worsening, affecting your ability to work or manage daily life, or leading you to rely on substances or other harmful coping, speak with a qualified mental-health or medical professional. If you are in immediate danger or may harm yourself or someone else, contact local emergency services or a crisis service now.",
          "Seeking support is not evidence that you failed to be tranquil. It is an act of attention to reality. The most responsible next step is not always an inward practice; sometimes it is letting another person, clinician, community, or service help carry what has become too heavy to hold alone.",
        ],
        sourceUrls: [WHO_STRESS_PLATFORM, NCCIH_MINDFULNESS],
      },
    ],
    conclusion:
      "The storms of a life do not always announce when they will end. If peace depends on their permission, it will always feel temporary. Begin closer in: the feet on the floor, the feeling named accurately, the concern placed in its proper column, the boundary with a reason, the value made visible in one action, the person you can call, the practice you repeat tomorrow. This is tranquility as companionship rather than escape—a way of remaining available to your own life while it is still unfinished.",
    references: [
      {
        title: "Doing What Matters in Times of Stress",
        authors: "World Health Organization",
        publication: "World Health Organization",
        year: "2020; overview updated 2026",
        url: WHO_STRESS_GUIDE,
      },
      {
        title: "Mental Health and Psychosocial Support: Dealing With Stress",
        authors: "World Health Organization Regional Office for the Eastern Mediterranean",
        publication: "World Health Organization",
        year: "accessed 2026",
        url: WHO_STRESS_PLATFORM,
      },
      {
        title: "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
        authors: "Andrea Zaccaro and colleagues",
        publication: "Frontiers in Human Neuroscience / PubMed",
        year: "2018",
        url: SLOW_BREATHING_REVIEW,
      },
      {
        title: "Meditation and Mindfulness: Effectiveness and Safety",
        authors: "National Center for Complementary and Integrative Health",
        publication: "US National Institutes of Health",
        year: "updated 2022",
        url: NCCIH_MINDFULNESS,
      },
      {
        title: "Staying Calm in Turbulent Times",
        authors: "Harvard Health Publishing",
        publication: "Harvard Medical School",
        year: "2020",
        url: HARVARD_CALM,
      },
      {
        title: "Are You Protecting Your Peace or Just Avoiding Hard Situations?",
        authors: "Alex Spangler",
        publication: "The Gottman Institute",
        year: "2026",
        url: GOTTMAN_BOUNDARIES,
      },
    ],
    internalLinks: [
      {
        title: "Read about Tranquility",
        description: "Explore the book that inspired this essay’s view of serenity as a practice inside the storm.",
        href: "/books#tranquility",
      },
      {
        title: "Meet Adeseun Oyeneye",
        description: "Learn about the author’s work across enterprise, media, architecture, publishing, and social impact.",
        href: "/about",
      },
      {
        title: "Continue the conversation",
        description: "Send a considered note, publishing enquiry, speaking invitation, or advisory request.",
        href: "/contact",
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
