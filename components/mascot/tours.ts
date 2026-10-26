/**
 * Guided tours Nafi can run without the AI: each step optionally changes page, then scrolls to an
 * element (by its data-agent anchor), spotlights it and says a line. The AI agent will later emit
 * the same steps, so the runner below is shared.
 */
export type Step = { go?: string; target: string; say: string; hold?: number };
export type Tour = { id: string; label: string; intro: string; steps: Step[] };

const a = (id: string) => `[data-agent="${id}"]`;

export const TOURS: Tour[] = [
  {
    id: "certificates",
    label: "Show me your certificates",
    intro: "Let's go see the certificate pile.",
    steps: [
      { go: "/certificates", target: a("cert-pile"), say: "Here's the pile. Scroll and it fans out like a hand of cards." },
      { go: "/certificates", target: a("cert-stats"), say: "60 certificates from 10 issuers, most of them verifiable online." },
      { go: "/certificates", target: a("issuer-google"), say: "Google comes first, including Generative AI Leader. Tap any one to see it big." },
    ],
  },
  {
    id: "work",
    label: "What have you built?",
    intro: "A quick walk through the projects.",
    steps: [
      { go: "/", target: a("work"), say: "These are the projects, each with a full case study." },
      { go: "/", target: a("work-catataja"), say: "CatatAja: a finance assistant on WhatsApp. The model reads the message, plain code does the math." },
      { go: "/", target: a("work-inbox-assistant"), say: "An inbox assistant that turns chats from many apps into one to-do list." },
    ],
  },
  {
    id: "journey",
    label: "Walk me through your journey",
    intro: "From the first year of uni to now.",
    steps: [
      { go: "/", target: a("journey"), say: "The timeline, 2023 to today. The year on the left follows you as you scroll." },
      { go: "/", target: a("journey-year-2024"), say: "2024 was a big one: a co-founded startup and four national competition results." },
    ],
  },
  {
    id: "contact",
    label: "How do I reach you?",
    intro: "Contact details are at the bottom of every page.",
    steps: [{ target: a("contact"), say: "Email, LinkedIn and GitHub are all down here." }],
  },
];
