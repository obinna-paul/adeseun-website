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

const AFFECT_LABELING_STUDY = "https://pubmed.ncbi.nlm.nih.gov/17576282/";
const APA_ANGER_COMMUNICATION = "https://www.apa.org/topics/anger/control";
const ACTIVE_LISTENING_REVIEW = "https://pubmed.ncbi.nlm.nih.gov/28723044/";
const LISTENING_RESPONSIVENESS_STUDY = "https://pubmed.ncbi.nlm.nih.gov/37549540/";
const CNVC_FEEDBACK = "https://www.cnvc.org/about/feedback-advice";
const APA_RESPONSE_DELAY = "https://www.apa.org/news/press/releases/2021/02/answer-quickly";

const SCIENCE_OF_MEANING = "https://doi.org/10.1146/annurev-psych-072420-122921";
const THREE_MEANINGS = "https://researchportal.helsinki.fi/en/publications/the-three-meanings-of-meaning-in-life-distinguishing-coherence-pu/";
const PEW_MEANING_REPORT = "https://www.pewresearch.org/global/2021/11/18/what-makes-life-meaningful-views-from-17-advanced-economies/";
const PEW_FINDING_MEANING_IN_OTHERS = "https://www.pewresearch.org/global/2021/11/18/finding-meaning-in-others/";
const APA_MEANING_PODCAST = "https://www.apa.org/news/podcasts/speaking-of-psychology/meaning-life";
const MEANING_INTERVENTIONS_REVIEW = "https://pubmed.ncbi.nlm.nih.gov/33626890/";
const HARVARD_FIND_PURPOSE = "https://www.health.harvard.edu/mind-and-mood/10-ways-to-find-purpose-in-life";

export const IDEA_ARTICLES: readonly IdeaArticle[] = [
  {
    slug: "how-to-think-before-you-speak",
    title: "How to Think Before You Speak: 7 Habits for Clarity",
    dek: "Thinking before you speak is not about becoming guarded or slow. It is the discipline of making enough room to hear accurately, choose your purpose, and say the truest useful thing with care.",
    seoDescription:
      "Learn how to think before you speak with seven practical habits for listening, pausing, choosing clear words, managing conflict, and repairing mistakes.",
    publishedAt: "2026-10-19T10:00:00+01:00",
    modifiedAt: "2026-10-19T10:00:00+01:00",
    pillar: "purpose-communication",
    topics: [
      "how to think before you speak",
      "think before speaking",
      "how to pause before responding",
      "mindful communication",
      "active listening",
      "better conversations",
      "Think Before You Speak",
    ],
    featured: true,
    hero: {
      src: "/images/ideas/how-to-think-before-you-speak-hero.webp",
      alt: "Flat editorial illustration of a Black woman listening thoughtfully before responding in conversation",
      caption: "A thoughtful response begins in the small space between hearing words and deciding what your own words should do.",
      width: 1920,
      height: 1080,
      objectPosition: "50% 48%",
    },
    keyIdea:
      "To think before you speak, listen until you understand, notice what emotion is asking you to do, decide what outcome matters, and then choose words that are accurate, necessary, and kind enough to be heard. The pause can take one breath; its purpose is not silence but intention.",
    introduction: [
      "Most regretted words do not begin with a lack of vocabulary. They begin with speed. We hear accusation before we hear concern, feel the body prepare for defence, and reach for the sentence that will protect pride fastest. By the time judgement catches up, the words are already living in someone else.",
      "Thinking before speaking is often reduced to counting to three. A pause can help, but duration alone is not wisdom. What matters is what happens inside the pause: listening for the whole message, separating fact from assumption, identifying the result you actually want, and shaping a response the other person has a chance of receiving.",
      "The seven habits below turn that brief interval into a repeatable communication practice. They are useful in meetings, friendships, family life, leadership, disagreement, and the ordinary moments when tone carries more meaning than the sentence itself.",
    ],
    inspiredBy: {
      title: "Think Before You Speak",
      description:
        "This essay develops the book’s central conviction that thoughtful communication is a discipline: words have consequences, and intention can be practised before they leave us.",
      href: "/books#think-before-you-speak",
    },
    sections: [
      {
        id: "what-thinking-before-speaking-means",
        title: "What does it mean to think before you speak?",
        paragraphs: [
          "Thinking before you speak means interrupting automatic reaction long enough to choose a response that fits the facts, the relationship, and the outcome you want. It is not editing yourself into harmlessness. It is making sure that honesty arrives in a form strong enough to do useful work.",
          "The practice has three movements: receive, discern, respond. Receive what was actually said, including what you may have missed. Discern what is fact, feeling, assumption, and need. Respond with language proportionate to the moment. In a routine exchange, this may happen almost instantly. In conflict, it may require a breath, a clarifying question, or an agreed return to the conversation later.",
          "The goal is not a perfect sentence. It is responsible participation: words that belong to your values rather than only to your first surge of emotion.",
        ],
        quote: "The pause is not an empty space. It is where intention catches up with language.",
        sourceUrls: [APA_ANGER_COMMUNICATION],
      },
      {
        id: "why-we-speak-too-quickly",
        title: "Why do we speak before judgement catches up?",
        paragraphs: [
          "Conversation is physical before it is philosophical. A dismissive tone, a public correction, or a sentence that touches an old wound can tighten the jaw, raise the heart rate, and narrow attention. Under threat, the mind becomes efficient at defending and less curious about nuance. We prepare our reply while the other person is still explaining.",
          "Speed also protects identity. If admitting uncertainty feels like weakness, we answer before thinking. If silence feels like losing, we fill it. If being understood matters more than understanding, every conversation becomes a contest for the final interpretation.",
          "The answer is not to distrust emotion. Emotion carries information about what matters. The task is to keep a feeling from becoming the sole author of the next sentence. Research on affect labelling suggests that putting feelings into words can change the way emotional stimuli are processed. The laboratory finding is not a universal cure, but it supports a practical truth: naming an emotion may give you more room to choose what follows it.",
        ],
        sourceUrls: [AFFECT_LABELING_STUDY],
      },
      {
        id: "listen-for-the-whole-message",
        title: "1. Listen for the whole message",
        paragraphs: [
          "Thoughtful speech begins before your turn. Listen for content, feeling, and request. What happened? What appears to matter to this person? Are they asking for a decision, information, acknowledgement, repair, or simply the dignity of being heard? Those are different conversations and they need different answers.",
          "Active listening is not silent agreement. It is an effort to understand accurately before evaluating. Reflect the central point in your own words: ‘What I hear is that the change itself is manageable, but being told at the last minute made you feel disregarded. Is that right?’ A good reflection is tentative enough to be corrected.",
          "Studies of listening and perceived responsiveness connect attentive listening with feeling understood and cared for. That does not mean every disagreement disappears. It means disagreement can begin from a more accurate account of what each person is actually saying.",
        ],
        image: {
          src: "/images/ideas/listen-before-you-respond.webp",
          alt: "Flat illustration of two Black adults building understanding through an attentive conversation",
          caption: "Listening is not waiting politely for your turn. It is checking whether the message you received is the message the other person meant to send.",
          width: 1200,
          height: 900,
        },
        list: [
          "Let the speaker complete the thought before preparing your answer.",
          "Reflect the central meaning in your own words rather than repeating it mechanically.",
          "Ask one clarifying question before offering a conclusion.",
          "Notice the difference between understanding a position and agreeing with it.",
        ],
        sourceUrls: [ACTIVE_LISTENING_REVIEW, LISTENING_RESPONSIVENESS_STUDY],
      },
      {
        id: "notice-the-body",
        title: "2. Notice the body’s early warning",
        paragraphs: [
          "The body often announces an unwise sentence before the mouth does. You may lean forward, hold your breath, speak faster, clench a hand, or feel heat in the face. Learn your signal. It is not proof that the other person is wrong; it is information that your capacity to choose is getting smaller.",
          "Use one unobtrusive reset. Exhale slowly. Uncross your hands. Lower your pace. Take a sip of water. If the exchange is becoming destructive, say what you need without abandoning it: ‘I want to answer this well. Can we take ten minutes and return at half past?’ A specific return time distinguishes a constructive pause from disappearance.",
          "In unsafe or abusive situations, the priority is not a perfectly managed conversation. Leave, seek support, and protect yourself. Communication skills do not create an obligation to remain available to harm.",
        ],
        sourceUrls: [APA_ANGER_COMMUNICATION],
      },
      {
        id: "name-feeling-before-fault",
        title: "3. Name the feeling before naming the fault",
        paragraphs: [
          "Blame feels precise because it points outward: ‘You never listen.’ Yet it often combines an event, an interpretation, and a verdict in four words. A more useful internal sentence begins closer to your own experience: ‘I am frustrated and worried that this decision was made without the information I sent.’",
          "Naming the feeling does not require announcing every emotion aloud. Sometimes it is a private act that keeps irritation from disguising itself as certainty. Ask: what am I feeling, what value or need does that feeling reveal, and which part of my interpretation still needs checking?",
          "Accurate feeling words also reduce exaggeration. ‘I felt embarrassed when the error was raised in front of the team’ gives the conversation somewhere to go. ‘You humiliated me because you have no respect’ claims knowledge of motive and invites a trial about character.",
        ],
        sourceUrls: [AFFECT_LABELING_STUDY, CNVC_FEEDBACK],
      },
      {
        id: "choose-the-outcome",
        title: "4. Choose the outcome, not the comeback",
        paragraphs: [
          "Before answering, finish one sentence silently: ‘When this conversation ends, I want…’ Perhaps you want a clear decision, a corrected misunderstanding, an honest boundary, a repaired relationship, or an accurate record. The answer should influence your words.",
          "A comeback is designed for the present second. An outcome belongs to the hours and days after it. The sharp sentence may win the room and lose the trust required to implement the decision. The polite sentence may preserve surface calm while avoiding the truth. Thoughtful speech holds both consequence and courage: what must be said, and what form gives it the best chance of doing what it needs to do?",
          "In leadership, this habit is especially important. Power changes the weight of language. A passing remark from the person who controls opportunity can sound like a settled instruction. Clarify whether you are exploring, requesting, or deciding so that others do not have to guess.",
        ],
      },
      {
        id: "separate-observation-from-interpretation",
        title: "5. Separate observation from interpretation",
        paragraphs: [
          "An observation can usually be recorded by a camera or calendar: ‘The last two reports arrived after the agreed deadline.’ An interpretation adds meaning: ‘You do not care about this work.’ Interpretations may be right, but presenting them as fact closes the door to information.",
          "Begin with what can be checked. Then name your concern and invite the missing context: ‘The last two reports arrived after Friday. I am concerned because the delay affects the client review. What is getting in the way?’ This is not weaker than accusation. It is more exact, and exact language makes accountability easier.",
          "The same discipline works inwardly. ‘Everyone thought my idea was foolish’ is an interpretation. ‘Two people challenged the cost and the room went quiet’ is an observation. One creates a verdict; the other creates questions you can answer.",
        ],
        image: {
          src: "/images/ideas/choose-words-with-intention.webp",
          alt: "Flat illustration of a Black woman moving from tangled reactions toward a clear speech form",
          caption: "Clear words often emerge in sequence: observe what happened, identify the feeling and need, then make the request visible.",
          width: 1200,
          height: 900,
        },
        sourceUrls: [CNVC_FEEDBACK],
      },
      {
        id: "make-a-clear-request",
        title: "6. Make a clear request, not a disguised accusation",
        paragraphs: [
          "Many conflicts repeat because the complaint is clear and the desired change is not. ‘You need to communicate better’ leaves the other person to invent the standard. ‘Please tell me by noon if the delivery date is at risk, even if you do not yet have a new date’ is observable and answerable.",
          "A request is not a demand wearing softer clothes. The other person can respond, ask for clarification, negotiate, or say no. If the matter is a boundary or responsibility rather than a request, name it honestly: ‘I will not continue this conversation while I am being shouted at. I can return when we can both speak without insults.’",
          "Use fewer words when the point is difficult. Extra explanation often becomes an attempt to control the other person’s reaction. State the observation, the impact, and the next step; then leave enough room for an answer.",
        ],
        sourceUrls: [CNVC_FEEDBACK],
      },
      {
        id: "repair-quickly",
        title: "7. Repair quickly when your words miss the mark",
        paragraphs: [
          "Thinking first reduces harm; it does not eliminate it. You will still be unclear, defensive, unfair, or wrong. Communication maturity is visible in the speed and quality of repair.",
          "A useful repair names the act without hiding behind intention: ‘I interrupted you and dismissed the concern before I understood it. That was unfair. I am sorry. Please finish; I will listen before responding.’ Avoid ‘I am sorry you felt that way,’ which relocates the problem into the other person’s feelings, and avoid the long defence that makes them comfort you.",
          "Then change the pattern that produced the harm. An apology without a new practice asks the injured person to finance your relief. The repair becomes credible when the next meeting contains more listening, the next disagreement contains fewer verdicts, and the promised follow-up actually arrives.",
        ],
      },
      {
        id: "thirty-second-check",
        title: "A 30-second check before a difficult response",
        paragraphs: [
          "When the stakes are high and time is short, use five questions. You do not need to answer them perfectly; their job is to widen the moment enough for choice to return.",
        ],
        list: [
          "What did I actually hear, and what am I assuming?",
          "What am I feeling in my body and what is it urging me to do?",
          "What outcome matters after this moment has passed?",
          "What is the clearest true sentence I can say without attacking character?",
          "Do I need to respond now, ask a question, or agree a time to return?",
        ],
      },
      {
        id: "when-not-to-pause",
        title: "Can pausing ever make communication worse?",
        paragraphs: [
          "Yes. A pause can become theatrical, punitive, or evasive. Research on response timing found that, for some straightforward questions, delayed answers may be judged as less sincere. The lesson is not to answer every question instantly; it is to match the pause to the task.",
          "Use a brief natural beat for ordinary exchanges. Take longer when emotion, complexity, confidentiality, or consequence requires it, and explain the delay: ‘I need to check the numbers before I answer’ or ‘This matters to me, and I would like an hour to think rather than guess.’ Transparency prevents silence from having to carry a meaning you did not intend.",
        ],
        sourceUrls: [APA_RESPONSE_DELAY],
      },
    ],
    conclusion:
      "Thinking before speaking is not a personality trait reserved for naturally calm people. It is a set of small decisions: listen beyond the first phrase, notice the body, name the feeling, choose the outcome, separate observation from judgement, make the request clear, and repair what you get wrong. Practised together, those habits do more than prevent regrettable words. They make language trustworthy enough to carry truth, disagreement, affection, leadership, and change.",
    references: [
      {
        title: "Putting Feelings Into Words: Affect Labeling Disrupts Amygdala Activity in Response to Affective Stimuli",
        authors: "Matthew D. Lieberman and colleagues",
        publication: "Psychological Science / PubMed",
        year: "2007",
        url: AFFECT_LABELING_STUDY,
      },
      {
        title: "Controlling Anger Before It Controls You",
        authors: "American Psychological Association",
        publication: "American Psychological Association",
        year: "updated 2023",
        url: APA_ANGER_COMMUNICATION,
      },
      {
        title: "Active Listening",
        authors: "StatPearls contributors",
        publication: "StatPearls / National Library of Medicine",
        year: "updated 2023",
        url: ACTIVE_LISTENING_REVIEW,
      },
      {
        title: "Listening and Perceived Responsiveness: Unveiling the Significance and Exploring Crucial Research Endeavors",
        authors: "Guy Itzchakov and Harry T. Reis",
        publication: "Current Opinion in Psychology / PubMed",
        year: "2023",
        url: LISTENING_RESPONSIVENESS_STUDY,
      },
      {
        title: "Feedback Versus Advice",
        authors: "Center for Nonviolent Communication",
        publication: "Center for Nonviolent Communication",
        year: "accessed 2026",
        url: CNVC_FEEDBACK,
      },
      {
        title: "To Appear More Sincere, Answer Questions Quickly",
        authors: "American Psychological Association",
        publication: "American Psychological Association",
        year: "2021",
        url: APA_RESPONSE_DELAY,
      },
    ],
    internalLinks: [
      {
        title: "Read Think Before You Speak",
        description: "Explore the book behind this essay’s case for intentional, consequential communication.",
        href: "/books#think-before-you-speak",
      },
      {
        title: "How to find peace in chaos",
        description: "Build the steadiness that makes a considered response possible when pressure is high.",
        href: "/ideas/how-to-find-peace-in-chaos",
      },
      {
        title: "What makes life meaningful?",
        description: "Consider the relationships, values, contribution, and attention that give ordinary life depth.",
        href: "/ideas/what-makes-life-meaningful",
      },
      {
        title: "Meet Adeseun Oyeneye",
        description: "Learn about the author’s work across enterprise, media, architecture, publishing, and social impact.",
        href: "/about",
      },
    ],
    related: ["what-makes-life-meaningful", "how-to-find-peace-in-chaos"],
  },
  {
    slug: "what-makes-life-meaningful",
    title: "What Makes Life Meaningful? 7 Foundations That Matter",
    dek: "A meaningful life is rarely discovered as one grand answer. It is built through the stories that make life coherent, the purposes that give it direction, and the people and contributions that make it matter.",
    seoDescription:
      "What makes life meaningful? Explore seven research-informed foundations for purpose, belonging, coherence, mattering, values, contribution, and attention.",
    publishedAt: "2026-10-19T09:00:00+01:00",
    modifiedAt: "2026-10-19T09:00:00+01:00",
    pillar: "purpose-communication",
    topics: [
      "what makes life meaningful",
      "how to find meaning in life",
      "meaning vs purpose",
      "how to live a meaningful life",
      "what gives life meaning",
      "purpose and belonging",
      "Beyond the Mundane",
    ],
    hero: {
      src: "/images/ideas/what-makes-life-meaningful-hero.webp",
      alt: "Flat editorial illustration of a Black woman reflecting on relationships, craft, learning, nature, and care",
      caption: "Meaning is often assembled from ordinary commitments: people loved, work tended, values lived, and attention given.",
      width: 1920,
      height: 1080,
      objectPosition: "50% 48%",
    },
    keyIdea:
      "A meaningful life tends to combine three experiences: coherence, or making sense of your life; purpose, or having worthwhile direction; and mattering, or knowing your existence has value. Relationships, contribution, lived values, and attention to ordinary life help turn those ideas into practice.",
    introduction: [
      "The question ‘What makes life meaningful?’ sounds as though it should have one impressive answer. A calling. A legacy. A spiritual certainty. Yet most people do not experience meaning as a single revelation. It accumulates through relationships kept, responsibilities accepted, work made useful, losses integrated, beauty noticed, and values translated into ordinary behaviour.",
      "Research cannot decide what your life ought to mean. It can, however, clarify the experiences people often describe when life feels meaningful. Contemporary psychology frequently distinguishes coherence, purpose, and significance or mattering. Cross-national evidence also shows that people locate meaning in many domains—especially family, but also work, material stability, health, friends, community, spirituality, nature, and freedom—with important differences between societies.",
      "The seven foundations below are not a universal formula. They are lenses for examining the life you already have and deciding what deserves deeper attention next.",
    ],
    inspiredBy: {
      title: "Beyond the Mundane",
      description:
        "This essay continues the book’s exploration of meaning across philosophical, psychological, spiritual, and practical ground—looking past routine without dismissing the ordinary life where meaning is made.",
      href: "/books#beyond-the-mundane",
    },
    sections: [
      {
        id: "what-makes-life-meaningful",
        title: "What makes life meaningful?",
        paragraphs: [
          "Life feels meaningful when it makes enough sense to inhabit, has directions worth moving towards, and includes the felt knowledge that your existence counts. Researchers often describe these dimensions as coherence, purpose, and significance or mattering. They overlap, but they are not identical.",
          "You can have purpose without coherence: a demanding goal may organise the future while the past still feels fragmented. You can understand your story yet doubt that you matter. You can feel deeply loved while lacking a direction for your abilities. A durable sense of meaning does not require every dimension to be strong every day, but imbalance helps explain why an outwardly successful life can still feel strangely thin.",
          "Meaning is also culturally shaped. In Pew Research Center’s survey of 18,850 adults across 17 advanced economies, family was the most commonly cited source in 14 of the 17 publics, while work, material wellbeing, health, friends, society, spirituality, nature, and freedom appeared with different emphasis. The pattern warns against presenting one culture’s ideal life as a human universal.",
        ],
        quote: "Meaning is less a hidden answer to uncover than a relationship between your story, your direction, and your sense that your life counts.",
        sourceUrls: [SCIENCE_OF_MEANING, THREE_MEANINGS, PEW_MEANING_REPORT],
      },
      {
        id: "meaning-purpose-happiness",
        title: "Are meaning, purpose, and happiness the same?",
        paragraphs: [
          "No. Purpose is one part of meaning: it gives direction to goals and action. Happiness usually describes positive feeling or life satisfaction. Meaning can include both, but it can also be present when life is difficult.",
          "Caring for a sick parent, rebuilding an institution, raising a child, learning a demanding craft, or standing by a conviction may involve fatigue, grief, frustration, and sacrifice. Those experiences are not always pleasant, yet they can be profoundly meaningful because they express love, identity, duty, contribution, or hope.",
          "This distinction matters because chasing continuous happiness can turn discomfort into evidence that life is wrong. A meaningful life makes room for enjoyment, but it does not require every worthwhile season to feel light. The better question is sometimes not ‘Does this make me happy now?’ but ‘Is this difficulty in service of something I can still endorse?’",
        ],
        sourceUrls: [SCIENCE_OF_MEANING, APA_MEANING_PODCAST],
      },
      {
        id: "coherence",
        title: "1. Coherence: make sense of your story",
        paragraphs: [
          "Coherence is the feeling that the events of your life form an intelligible pattern rather than a pile of unrelated accidents. It does not mean everything happened for a reason, or that pain must be made beautiful. It means you can tell the truth about what happened and see how it shaped what you fear, value, know, and choose now.",
          "Begin by writing a short account of a turning point in three parts: what changed, what it cost, and what it taught you. Then ask which part of that account is fact and which is an old verdict. ‘I was rejected’ may be fact; ‘therefore I will never belong’ is a conclusion that can be examined.",
          "A coherent story remains editable. New information, apology, grief, achievement, faith, or relationship may change its emphasis. The aim is not a polished autobiography. It is a story honest enough to orient you without imprisoning you.",
        ],
        sourceUrls: [THREE_MEANINGS, SCIENCE_OF_MEANING],
      },
      {
        id: "purpose",
        title: "2. Purpose: choose a direction worth serving",
        paragraphs: [
          "Purpose answers ‘towards what?’ It turns values into aims that organise time and effort. A purpose can be vocational, relational, creative, civic, spiritual, or several at once. It does not have to be a singular calling that explains every decade of your life.",
          "Grand purpose is often less useful than proximate purpose. ‘Improve education’ is admirable but distant. ‘Mentor two early-career teachers this term’ can enter a calendar. ‘Strengthen my family’ becomes more real as a weekly call, a repaired conflict, a shared meal, or reliable financial planning.",
          "Choose a direction by looking for the meeting point of concern, capacity, and commitment. What problem continues to trouble you? What can you learn or contribute? What practice are you willing to repeat after inspiration fades? Purpose becomes believable when it survives contact with an ordinary Tuesday.",
        ],
        sourceUrls: [HARVARD_FIND_PURPOSE, SCIENCE_OF_MEANING],
      },
      {
        id: "mattering",
        title: "3. Mattering: know that your life counts",
        paragraphs: [
          "Mattering is the sense that you are significant—that your presence is noticed, your wellbeing matters, and your actions can make a difference. It is not fame. A person can be widely visible and privately feel replaceable; another can be unknown beyond a neighbourhood and know exactly who depends on their care.",
          "Mattering has two directions. We need to receive signs that we count, and we need opportunities to be consequential to others. Ask where your absence would be felt—not as a morbid exercise, but as evidence of connection and responsibility. The colleague who relies on your judgement, the child who expects your attention, the friend who can tell you the truth, and the community that uses what you make are all forms of significance.",
          "If you feel invisible, do not treat the feeling as a final verdict. Make one bid for connection, contribution, or support. Persistent worthlessness or hopelessness deserves qualified care; it is not a philosophical failure and should not be carried alone.",
        ],
        image: {
          src: "/images/ideas/coherence-purpose-mattering.webp",
          alt: "Flat triptych of a Black woman forming a coherent thread, walking with purpose, and helping another person",
          caption: "Coherence joins the story, purpose gives it direction, and mattering connects a life to lives beyond itself.",
          width: 1200,
          height: 900,
        },
        sourceUrls: [THREE_MEANINGS, SCIENCE_OF_MEANING],
      },
      {
        id: "belonging",
        title: "4. Belonging: invest in relationships that know you",
        paragraphs: [
          "Across the Pew study, family was the most frequent source of meaning: a median of 38% mentioned it in open-ended answers. The precise number is less important than the pattern. Meaning is often relational before it is exceptional.",
          "Belonging is more than proximity. It is the experience of being known without having to perform every minute, and of knowing others well enough to carry some part of their reality. That requires time, attention, repair, mutuality, and sometimes boundaries. A crowded contact list can coexist with loneliness if no relationship permits honesty.",
          "Choose one relationship to deepen through a specific practice: a recurring meal, a phone call without multitasking, an apology, a question you have avoided, or help offered before it is requested. Do not measure the act by how impressive it appears. Repetition turns ordinary contact into shared history.",
        ],
        sourceUrls: [PEW_FINDING_MEANING_IN_OTHERS, PEW_MEANING_REPORT],
      },
      {
        id: "contribution",
        title: "5. Contribution: become useful beyond yourself",
        paragraphs: [
          "Contribution gives abilities somewhere to go. It may look like paid work, caregiving, art, entrepreneurship, public service, teaching, hospitality, repair, advocacy, or the quiet maintenance that lets other people flourish. Meaning does not require that the world applaud the contribution; it requires a credible connection between effort and value.",
          "Usefulness is not the same as earning your right to exist. Rest, play, and receiving care are parts of a human life, not rewards for productivity. Contribution becomes dangerous when self-worth depends entirely on output or when service becomes a way to avoid your own needs.",
          "Ask a modest question: who could be better supported by something I can do this month? Keep the scale small enough to begin. Meaning often grows through sustained responsibility, not occasional intensity.",
        ],
        sourceUrls: [APA_MEANING_PODCAST, HARVARD_FIND_PURPOSE],
      },
      {
        id: "values",
        title: "6. Values: turn belief into visible practice",
        paragraphs: [
          "Values are qualities of action—honesty, compassion, courage, excellence, justice, stewardship—not trophies to complete. Their meaning appears in behaviour. If generosity matters, where does it enter the budget? If family matters, where does it enter the calendar? If creativity matters, what are you making before anyone grants permission?",
          "A values audit can reveal painful mismatches without becoming an exercise in shame. Choose five things you say matter and examine the last two weeks. Where did time, attention, money, and emotional energy actually go? Circumstances constrain every life, so the goal is not perfect alignment. It is one honest adjustment.",
          "Meaning-focused interventions studied across clinical and non-clinical settings vary widely, and the evidence should not be treated as a guarantee. Still, the research supports taking meaning as something that can be explored and strengthened through intentional practices rather than merely awaited.",
        ],
        sourceUrls: [MEANING_INTERVENTIONS_REVIEW, SCIENCE_OF_MEANING],
      },
      {
        id: "attention",
        title: "7. Attention: notice the life that is already here",
        paragraphs: [
          "A life can contain meaning that its owner is too hurried to register. Attention does not manufacture value from nothing; it makes existing value available to experience. The meal becomes more than fuel, the craft more than output, the conversation more than a gap between notifications.",
          "This is not an argument for romanticising routine or accepting an unjust life. Some routines need to be changed. But if meaning is recognised only in dramatic milestones, most days will be treated as waiting rooms. The mundane is where commitments become embodied: care is cooked, skill is rehearsed, trust is kept, and beauty is noticed without an audience.",
          "Create one daily act of deliberate attention. Walk without headphones for ten minutes. Ask someone a question and keep the phone away. Record one thing you made, learned, repaired, or appreciated. The practice is small because ordinary life is small in scale and enormous in accumulation.",
        ],
        image: {
          src: "/images/ideas/meaning-in-ordinary-life.webp",
          alt: "Flat illustration of Black adults sharing food, gardening, repairing, and connecting across generations",
          caption: "Belonging, contribution, and attention make meaning visible in the ordinary work of caring for people and places.",
          width: 1200,
          height: 900,
        },
        sourceUrls: [PEW_MEANING_REPORT, APA_MEANING_PODCAST],
      },
      {
        id: "meaning-inventory",
        title: "A five-question meaning inventory",
        paragraphs: [
          "Use these prompts as a conversation or private writing practice. Answer with examples from the last month rather than ideals. The gap between the two can show where one small change may matter most.",
        ],
        list: [
          "Coherence: what part of my recent experience am I still struggling to understand?",
          "Purpose: which worthwhile direction deserves more of my time in the next season?",
          "Mattering: where do I feel valued, and whose life is affected by my presence?",
          "Belonging and contribution: which relationship or community needs a more reliable form of me?",
          "Values and attention: what do I claim matters that is nearly absent from my calendar?",
        ],
        sourceUrls: [THREE_MEANINGS, HARVARD_FIND_PURPOSE],
      },
      {
        id: "meaning-changes",
        title: "Can the meaning of a life change?",
        paragraphs: [
          "It should. Meaning is not a contract signed once. Parenthood, migration, grief, illness, faith, retirement, public responsibility, and creative work can rearrange what matters and what is possible. A purpose that organised one decade may become too small, complete, or no longer yours.",
          "Change does not make the earlier meaning false. It means a life is responsive. Keep what remains true, grieve what has ended, and allow new responsibilities and forms of belonging to revise the story. A seasonal purpose can be real without being permanent.",
          "If life feels persistently empty, hopeless, or not worth living, reflection alone may not be enough. Speak with a qualified mental-health professional or a trusted local support service. Meaning is a serious human question, but intense or enduring despair also deserves practical care.",
        ],
        sourceUrls: [SCIENCE_OF_MEANING, MEANING_INTERVENTIONS_REVIEW],
      },
    ],
    conclusion:
      "A meaningful life does not have to look spectacular from the outside. It needs a story honest enough to understand, purposes concrete enough to guide action, relationships in which presence counts, contributions that serve more than ego, values made visible, and attention capable of recognising what is already alive. Begin with the foundation that feels thinnest. One repaired relationship, one chosen responsibility, one hour given to worthwhile work, or one ordinary moment fully noticed can be a serious beginning.",
    references: [
      {
        title: "The Science of Meaning in Life",
        authors: "Frank Martela and Michael F. Steger",
        publication: "Annual Review of Psychology",
        year: "2023",
        url: SCIENCE_OF_MEANING,
      },
      {
        title: "The Three Meanings of Meaning in Life: Distinguishing Coherence, Purpose, and Significance",
        authors: "Frank Martela and Michael F. Steger",
        publication: "The Journal of Positive Psychology",
        year: "2016",
        url: THREE_MEANINGS,
      },
      {
        title: "What Makes Life Meaningful? Views From 17 Advanced Economies",
        authors: "Laura Silver and colleagues",
        publication: "Pew Research Center",
        year: "2021",
        url: PEW_MEANING_REPORT,
      },
      {
        title: "Finding Meaning in Others",
        authors: "Pew Research Center",
        publication: "Pew Research Center",
        year: "2021",
        url: PEW_FINDING_MEANING_IN_OTHERS,
      },
      {
        title: "How to Find Meaning in Life",
        authors: "Kim Mills and Clara Hill",
        publication: "Speaking of Psychology, American Psychological Association",
        year: "2019",
        url: APA_MEANING_PODCAST,
      },
      {
        title: "A Meta-Analytic Review of Interventions That Promote Meaning in Life",
        authors: "Nicholas Manco and Sherry Hamby",
        publication: "American Journal of Health Promotion / PubMed",
        year: "2021",
        url: MEANING_INTERVENTIONS_REVIEW,
      },
      {
        title: "10 Ways to Find Purpose in Life",
        authors: "Harvard Health Publishing",
        publication: "Harvard Medical School",
        year: "2020",
        url: HARVARD_FIND_PURPOSE,
      },
    ],
    internalLinks: [
      {
        title: "Read Beyond the Mundane",
        description: "Explore the book behind this essay’s philosophical, psychological, spiritual, and practical search for meaning.",
        href: "/books#beyond-the-mundane",
      },
      {
        title: "How to think before you speak",
        description: "Practise the attentive communication that gives relationships and values a visible form.",
        href: "/ideas/how-to-think-before-you-speak",
      },
      {
        title: "How to find peace in chaos",
        description: "Use seven grounded practices to stay close to what matters when circumstances become noisy.",
        href: "/ideas/how-to-find-peace-in-chaos",
      },
      {
        title: "Meet Adeseun Oyeneye",
        description: "Learn about the author’s work across enterprise, media, architecture, publishing, and social impact.",
        href: "/about",
      },
    ],
    related: ["how-to-think-before-you-speak", "how-to-find-peace-in-chaos"],
  },
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
    featured: false,
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
    related: ["how-to-think-before-you-speak", "what-makes-life-meaningful"],
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
