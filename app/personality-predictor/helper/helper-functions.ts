interface TraitValues {
  extroversion: number;
  openness: number;
  conscientiousness: number;
  agreeableness: number;
}

interface Answer {
  selected: string;
  // Add other properties that might be in the answer object
}

interface AnalysisResult {
  sentiment: "positive" | "neutral" | "negative";
  traits: TraitValues;
  analysisText: string;
}

export const basicAnalysis = (
  answers: Answer[],
  textInput: string = "",
  secretsInput: string = ""
): AnalysisResult => {
  // Initialize with balanced baseline values (50%)
  const traits: TraitValues = {
    extroversion: 0.5,
    openness: 0.5,
    conscientiousness: 0.5,
    agreeableness: 0.5,
  };

  const lowerText = `${textInput} ${secretsInput}`.toLowerCase();

  // Adjust trait up or down based on keywords
  const adjustTrait = (trait: keyof TraitValues, value: number): void => {
    traits[trait] += value;
    // Keep values within 0-1 range
    traits[trait] = Math.max(0, Math.min(1, traits[trait]));
  };

  // Keywords that indicate high trait value
  const highTraitKeywords: Record<keyof TraitValues, string[]> = {
    extroversion: [
      "party",
      "socializing",
      "attention",
      "friends",
      "karaoke",
      "center",
      "brunch",
      "loud",
      "talk",
      "host",
      "drinks",
      "music",
      "dance",
      "jokes",
      "crowd",
      "club",
      "fun",
      "adventure",
      "exciting",
      "life of the party",
      "outgoing",
      "bold",
      "vibe",
      "sociable",
      "hype",
      "sing",
      "show",
      "laugh",
      "express",
      "confident",
      "energy",
    ],
    openness: [
      "daydream",
      "creative",
      "ideas",
      "freedom",
      "explore",
      "quirky",
      "documentary",
      "future",
      "spontaneous",
      "whimsical",
      "curious",
      "new",
      "random",
      "art",
      "sci-fi",
      "books",
      "introspective",
      "dream",
      "imagine",
      "story",
      "experimental",
      "emotional",
      "abstract",
      "novel",
      "concept",
      "vision",
      "deep",
      "unique",
      "odd",
      "inventive",
      "original",
      "mysterious",
      "chaotic",
      "philosophy",
      "weird",
    ],
    conscientiousness: [
      "plan",
      "precision",
      "routine",
      "checklists",
      "structure",
      "organize",
      "meticulous",
      "punctual",
      "discipline",
      "tidy",
      "minimalist",
      "responsible",
      "early",
      "to-do",
      "deadline",
      "steady",
      "prepared",
      "organized",
      "clean",
      "calendar",
      "notes",
      "productive",
      "strategy",
      "planner",
      "schedule",
      "timely",
      "efficiency",
      "task",
      "habit",
      "commitment",
      "diligent",
      "focus",
      "serious",
      "intentional",
      "measured",
    ],
    agreeableness: [
      "help",
      "kind",
      "empathetic",
      "donate",
      "warm",
      "pets",
      "gentle",
      "compassion",
      "advice",
      "peace",
      "soothe",
      "calm",
      "support",
      "reliable",
      "friend",
      "cooperate",
      "grateful",
      "friendly",
      "thoughtful",
      "sharing",
      "harmony",
      "team",
      "caring",
      "considerate",
      "generous",
      "soft-hearted",
      "emotion",
      "sensitive",
      "comfort",
      "mediation",
      "peaceful",
      "listener",
      "nurturing",
      "hug",
      "inclusive",
    ],
  };

  // Keywords that indicate low trait value
  const lowTraitKeywords: Record<keyof TraitValues, string[]> = {
    extroversion: [
      "quiet",
      "alone",
      "solitude",
      "introvert",
      "shy",
      "reserved",
      "private",
      "individual",
      "reflection",
      "peace",
      "book",
      "reading",
      "intimate",
      "small group",
      "one-on-one",
      "independent",
      "solo",
      "recharge",
      "tired",
      "exhausting",
      "homebody",
      "cozy",
      "personal space",
    ],
    openness: [
      "traditional",
      "routine",
      "predictable",
      "concrete",
      "practical",
      "conventional",
      "familiar",
      "proven",
      "reliable",
      "steady",
      "straightforward",
      "clear-cut",
      "literal",
      "stable",
      "established",
      "consistent",
      "methodical",
      "unchanged",
      "normal",
      "standard",
    ],
    conscientiousness: [
      "spontaneous",
      "flexible",
      "relax",
      "go with the flow",
      "casual",
      "laid-back",
      "procrastinate",
      "unplanned",
      "loose",
      "easy-going",
      "messy",
      "disorganized",
      "improvise",
      "adaptive",
      "chaotic",
      "free-spirited",
      "impulse",
      "whatever",
      "chill",
      "random",
    ],
    agreeableness: [
      "direct",
      "critical",
      "skeptical",
      "challenge",
      "debate",
      "argue",
      "competition",
      "objective",
      "tough",
      "honest",
      "frank",
      "blunt",
      "straightforward",
      "assertive",
      "demanding",
      "independent",
      "self-interest",
      "competitive",
      "confrontational",
      "questioning",
      "analytical",
      "logical",
    ],
  };

  // Calculate the number of keywords detected
  let keywordsDetected = 0;

  // Track which traits have been influenced
  const traitInfluenced = {
    extroversion: false,
    openness: false,
    conscientiousness: false,
    agreeableness: false,
  };

  // Score the multiple-choice answers
  answers.forEach((answer) => {
    const selected = answer.selected.toLowerCase();
    for (const trait in highTraitKeywords) {
      const traitKey = trait as keyof TraitValues;

      // Check for high trait keywords
      highTraitKeywords[traitKey].forEach((keyword) => {
        if (selected.includes(keyword)) {
          adjustTrait(traitKey, 0.05);
          keywordsDetected++;
          traitInfluenced[traitKey] = true;
        }
      });

      // Check for low trait keywords
      lowTraitKeywords[traitKey].forEach((keyword) => {
        if (selected.includes(keyword)) {
          adjustTrait(traitKey, -0.05);
          keywordsDetected++;
          traitInfluenced[traitKey] = true;
        }
      });
    }
  });

  // Score the free text input - with slightly less weight than multiple choice
  for (const trait in highTraitKeywords) {
    const traitKey = trait as keyof TraitValues;

    // Check for high trait keywords
    highTraitKeywords[traitKey].forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        adjustTrait(traitKey, 0.03);
        keywordsDetected++;
        traitInfluenced[traitKey] = true;
      }
    });

    // Check for low trait keywords
    lowTraitKeywords[traitKey].forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        adjustTrait(traitKey, -0.03);
        keywordsDetected++;
        traitInfluenced[traitKey] = true;
      }
    });
  }

  // Add small random variations to avoid equality (only if we have keywords detected)
  if (keywordsDetected > 0) {
    for (const trait in traits) {
      const traitKey = trait as keyof TraitValues;
      traits[traitKey] += Math.random() * 0.04 - 0.02; // Random between -0.02 and +0.02

      // Keep within 0-1 range
      traits[traitKey] = Math.max(0, Math.min(1, traits[traitKey]));
    }
  } else {
    // If no keywords were detected, add more randomness to the baseline values
    for (const trait in traits) {
      const traitKey = trait as keyof TraitValues;
      traits[traitKey] += Math.random() * 0.3 - 0.15; // Random between -0.15 and +0.15

      // Keep within 0-1 range
      traits[traitKey] = Math.max(0, Math.min(1, traits[traitKey]));
    }
  }

  // Calculate sentiment based on both extroversion and agreeableness
  let sentiment: "positive" | "neutral" | "negative";
  const moodScore = traits.extroversion * 0.6 + traits.agreeableness * 0.4;

  if (moodScore >= 0.65) {
    sentiment = "positive";
  } else if (moodScore <= 0.35) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }

  let analysisText = "Based on your responses, ";

  if (keywordsDetected >= 5) {
    analysisText += "here's a nuanced view of your personality traits:\n\n";

    const traitEntries = Object.entries(traits) as [
      keyof typeof traits,
      number
    ][];
    const sortedTraits = traitEntries.sort((a, b) => b[1] - a[1]);

    const highestTrait = sortedTraits[0];
    const lowestTrait = sortedTraits[sortedTraits.length - 1];
    const middleTraits = sortedTraits.filter((t) => t[1] >= 45 && t[1] <= 55);

    // Highest trait description
    if (highestTrait[1] >= 70) {
      analysisText += `You show a strong tendency toward **${highestTrait[0]}**, indicating a personality that thrives in environments that align with this trait.`;
    } else if (highestTrait[1] >= 60) {
      analysisText += `You lean somewhat toward **${highestTrait[0]}**, suggesting this trait shapes your decisions and social behavior.`;
    }

    // Balanced traits
    if (middleTraits.length > 0) {
      const mids = middleTraits.map((t) => t[0]).join(" and ");
      analysisText += `\n\nYou show a balanced approach to **${mids}**, reflecting an adaptable and versatile nature.`;
    }

    // Lowest trait
    if (lowestTrait[1] <= 40) {
      analysisText += `\n\nYou exhibit relatively lower levels of **${lowestTrait[0]}**, which may mean you rely less on this trait in daily life or decision-making.`;
    }
  } else {
    analysisText +=
      "we don't have enough information to provide a detailed analysis. Consider providing more thoughtful or specific answers for a clearer picture.";
  }

  return {
    sentiment,
    traits,
    analysisText,
  };
};
