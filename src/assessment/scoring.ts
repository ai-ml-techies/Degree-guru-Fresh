import {
  RiasecArea,
  StrengthKey,
  StrengthTier,
  WorkStyleAxis,
  CareerValue,
  MotivationType,
  ConfidenceArea,
  AssessmentResult,
  CareerMatch,
  SkillGapAnalysis,
  UserStage,
  UserGoal
} from "./types";
import { CAREER_DATABASE, DatabaseCareer } from "./careerDatabase";
import { ASSESSMENT_QUESTIONS } from "./questions";

interface RawScores {
  riasec: Record<RiasecArea, number>;
  strengths: Record<StrengthKey, number>;
  strengthCounts: Record<StrengthKey, number>;
  values: Record<CareerValue, number>;
  workStyle: Record<string, number>;
  motivation: Record<MotivationType, number>;
  confidence: Record<string, number>;
  challenges: string[];
}

const RIASEC_META: Record<RiasecArea, { label: string; tagline: string; description: string }> = {
  EXPLORE_SOLVE: {
    label: "Explore & Solve",
    tagline: "Investigative & Analytical",
    description: "You're naturally drawn toward Explore & Solve — understanding problems, finding answers, and working with ideas and data."
  },
  LEAD_INFLUENCE: {
    label: "Lead & Influence",
    tagline: "Enterprising & Commercial",
    description: "You thrive when driving initiatives, convincing stakeholders, creating commercial momentum, and taking ownership of goals."
  },
  BUILD_DO: {
    label: "Build & Do",
    tagline: "Realistic & Practical",
    description: "You enjoy working with tangible tools, modern systems, technical architectures, and seeing practical ideas come alive."
  },
  CREATE_EXPRESS: {
    label: "Create & Express",
    tagline: "Artistic & Innovative",
    description: "You bring fresh perspectives, design sensitivity, narrative storytelling, and open-ended creative exploration."
  },
  HELP_CONNECT: {
    label: "Help & Connect",
    tagline: "Social & Empathetic",
    description: "You are energized by mentoring people, active listening, community building, and contributing directly to others' growth."
  },
  ORGANISE_STRUCTURE: {
    label: "Organise & Structure",
    tagline: "Conventional & Systematic",
    description: "You value clarity, systematic workflows, operational accuracy, financial discipline, and eliminating costly mistakes."
  }
};

const STRENGTH_META: Record<StrengthKey, { label: string; explanation: string; growthNextStep: string }> = {
  analytical_thinking: {
    label: "Analytical Thinking",
    explanation: "You dissect complex situations into clear, actionable components before drawing conclusions.",
    growthNextStep: "Practice structured frameworks (like Root Cause Analysis) and summarizing findings with data."
  },
  problem_solving: {
    label: "Problem Solving",
    explanation: "You naturally look for practical solutions when systems break down rather than dwelling on obstacles.",
    growthNextStep: "Tackle open-ended real-world case studies and document step-by-step resolution pathways."
  },
  communication: {
    label: "Communication",
    explanation: "You translate ideas into clear, engaging messages tailored to your audience's background.",
    growthNextStep: "Practice executive presentations, elevator pitches, and concise written memos."
  },
  creativity: {
    label: "Creativity",
    explanation: "You connect unusual ideas, explore alternative angles, and challenge conventional assumptions.",
    growthNextStep: "Build small creative prototypes or portfolio pieces to turn creative thoughts into tangible proof."
  },
  leadership: {
    label: "Leadership",
    explanation: "You take initiative, align team members around a vision, and keep projects moving forward.",
    growthNextStep: "Take ownership of a small cross-functional initiative or mentor a peer on a concrete task."
  },
  organisation: {
    label: "Organisation",
    explanation: "You structure work systematically, maintain clear documentation, and ensure deadlines are met.",
    growthNextStep: "Use modern project management frameworks (Agile, Kanban) and personal weekly review habits."
  },
  decision_making: {
    label: "Decision Making",
    explanation: "You evaluate tradeoffs thoughtfully and choose clear pathways even with incomplete information.",
    growthNextStep: "Document expected outcomes before making key decisions to evaluate your judgment over time."
  },
  initiative: {
    label: "Initiative",
    explanation: "You proactively start projects and spot opportunities without waiting for external instructions.",
    growthNextStep: "Channel your proactive energy into 1–2 high-priority goals rather than spreading yourself too thin."
  },
  learning_agility: {
    label: "Learning Agility",
    explanation: "You absorb new technologies, concepts, and industries with speed and genuine curiosity.",
    growthNextStep: "Solidify fast learning by immediately applying each newly learned concept in a mini-project."
  },
  adaptability: {
    label: "Adaptability",
    explanation: "You stay composed and pivot smoothly when plans change or circumstances shift.",
    growthNextStep: "Pre-emptively prepare plan-B scenarios when embarking on ambitious career or academic changes."
  },
  execution: {
    label: "Execution",
    explanation: "You follow through on commitments and convert plans into finished, reliable results.",
    growthNextStep: "Break large projects into 25-minute focused sprints to maintain steady execution velocity."
  },
  relationship_building: {
    label: "Relationship Building",
    explanation: "You build genuine rapport, establish mutual trust, and collaborate effectively with diverse teams.",
    growthNextStep: "Schedule regular informal 1-on-1 check-ins and expand your professional network intentionally."
  },
  attention_to_detail: {
    label: "Attention to Detail",
    explanation: "You spot subtle inconsistencies, verify facts, and uphold quality standards in your work.",
    growthNextStep: "Balance fine-grained precision with high-level deadlines so perfectionism doesn't delay progress."
  }
};

const VALUE_EXPLANATIONS: Record<CareerValue, string> = {
  Growth: "You prioritize steep learning curves, regular promotions, and expanding responsibility over staying comfortable.",
  Income: "Financial reward, market value, and earning potential play a decisive role in your career satisfaction.",
  Stability: "Predictable expectations, reputable organizations, and long-term career security provide your best peace of mind.",
  Freedom: "Autonomy over your schedule, methods, and decision-making is essential for you to do your best work.",
  Learning: "Continuous acquisition of cutting-edge skills and deep mastery matters more to you than repetitive routine.",
  Leadership: "Having the scope to influence direction, coach teams, and steer organizational impact energizes you.",
  Recognition: "Having your contributions acknowledged publicly and respected by peers fuels your ongoing drive.",
  Creativity: "The ability to generate original work, experiment, and express unique perspectives is central to you.",
  Impact: "Knowing that your day-to-day work solves genuine human problems and creates societal value matters deeply.",
  Flexibility: "You thrive when you can balance personal priorities with work hours and choose where you work.",
  Entrepreneurship: "Building ventures, taking measured bets, and having direct commercial ownership motivates you.",
  "Work-life balance": "Sustainable workloads that leave ample time for health, family, and personal passions are non-negotiable.",
  Prestige: "Association with prestigious brands, universities, and distinguished professional titles is personally rewarding."
};

export function scoreAssessment(answers: Record<string, any>): {
  archetype: { title: string; tagline: string; description: string };
  riasecTop3: AssessmentResult["riasecTop3"];
  topStrengths: AssessmentResult["topStrengths"];
  growthOpportunities: AssessmentResult["growthOpportunities"];
  blindSpots: string[];
  workStyle: AssessmentResult["workStyle"];
  topValues: AssessmentResult["topValues"];
  motivationProfile: AssessmentResult["motivationProfile"];
  confidenceProfile: AssessmentResult["confidenceProfile"];
  identifiedChallenges: string[];
  careersToExplore: AssessmentResult["careersToExplore"];
  skillsToBuild: SkillGapAnalysis;
} {
  // 1. Initialize raw accumulation
  const raw: RawScores = {
    riasec: {
      BUILD_DO: 10,
      EXPLORE_SOLVE: 10,
      CREATE_EXPRESS: 10,
      HELP_CONNECT: 10,
      LEAD_INFLUENCE: 10,
      ORGANISE_STRUCTURE: 10
    },
    strengths: {
      analytical_thinking: 45,
      problem_solving: 45,
      communication: 45,
      creativity: 45,
      leadership: 45,
      organisation: 45,
      decision_making: 45,
      initiative: 45,
      learning_agility: 45,
      adaptability: 45,
      execution: 45,
      relationship_building: 45,
      attention_to_detail: 45
    },
    strengthCounts: {
      analytical_thinking: 1,
      problem_solving: 1,
      communication: 1,
      creativity: 1,
      leadership: 1,
      organisation: 1,
      decision_making: 1,
      initiative: 1,
      learning_agility: 1,
      adaptability: 1,
      execution: 1,
      relationship_building: 1,
      attention_to_detail: 1
    },
    values: {
      Growth: 5,
      Income: 5,
      Stability: 5,
      Freedom: 5,
      Learning: 5,
      Leadership: 5,
      Recognition: 5,
      Creativity: 5,
      Impact: 5,
      Flexibility: 5,
      Entrepreneurship: 5,
      "Work-life balance": 5,
      Prestige: 5
    },
    workStyle: {
      independent_collaborative: 0,
      structured_flexible: 0,
      stable_changing: 0,
      deepwork_interaction: 0,
      strategic_execution: 0,
      specialist_generalist: 0
    },
    motivation: {
      Achievement: 3,
      Mastery: 3,
      Security: 3,
      Autonomy: 3,
      Recognition: 3,
      Purpose: 3,
      Competition: 3,
      Exploration: 3,
      Contribution: 3
    },
    confidence: {
      career_decisions: 50,
      communication: 50,
      networking: 50,
      interviews: 50,
      learning_skills: 50,
      changing_careers: 50,
      job_applications: 50,
      leadership: 50,
      negotiation: 50,
      uncertainty: 50
    },
    challenges: []
  };

  // 2. Accumulate weights deterministically
  for (const q of ASSESSMENT_QUESTIONS) {
    const userAns = answers[q.id];
    if (userAns === undefined || userAns === null) continue;

    const processOption = (optIdx: number) => {
      const opt = q.options[optIdx];
      if (!opt) return;

      const w = opt.weights;
      if (w.riasec) {
        for (const [k, v] of Object.entries(w.riasec)) {
          raw.riasec[k as RiasecArea] = (raw.riasec[k as RiasecArea] || 0) + (v || 0);
        }
      }
      if (w.strengths) {
        for (const [k, v] of Object.entries(w.strengths)) {
          raw.strengths[k as StrengthKey] = (raw.strengths[k as StrengthKey] || 0) + (v || 0);
          raw.strengthCounts[k as StrengthKey] = (raw.strengthCounts[k as StrengthKey] || 0) + 1;
        }
      }
      if (w.values) {
        for (const val of w.values) {
          raw.values[val] = (raw.values[val] || 0) + 8;
        }
      }
      if (w.workStyle) {
        for (const [k, v] of Object.entries(w.workStyle)) {
          raw.workStyle[k] = (raw.workStyle[k] || 0) + (v || 0);
        }
      }
      if (w.motivation) {
        for (const m of w.motivation) {
          raw.motivation[m] = (raw.motivation[m] || 0) + 8;
        }
      }
      if (w.confidence) {
        for (const [k, v] of Object.entries(w.confidence)) {
          raw.confidence[k] = (raw.confidence[k] || 0) + (v || 0);
        }
      }
      if (w.challenges) {
        for (const c of w.challenges) {
          if (!raw.challenges.includes(c)) {
            raw.challenges.push(c);
          }
        }
      }
    };

    if (Array.isArray(userAns)) {
      for (const idx of userAns) {
        processOption(idx);
      }
    } else if (typeof userAns === "number") {
      processOption(userAns);
    }
  }

  // 3. Normalize RIASEC Scores (0–100)
  const riasecEntries = Object.entries(raw.riasec) as [RiasecArea, number][];
  const maxRiasec = Math.max(...riasecEntries.map(([, s]) => s), 1);
  const normalizedRiasec = riasecEntries
    .map(([area, score]) => ({
      area,
      score: Math.min(98, Math.max(30, Math.round((score / maxRiasec) * 95))),
      ...RIASEC_META[area]
    }))
    .sort((a, b) => b.score - a.score);

  const riasecTop3 = normalizedRiasec.slice(0, 3);

  // 4. Normalize Strengths (0–100)
  const strengthKeys = Object.keys(raw.strengths) as StrengthKey[];
  const normalizedStrengths = strengthKeys
    .map((key) => {
      const rawVal = raw.strengths[key];
      // Normalize to 35-96 band
      const score = Math.min(96, Math.max(35, Math.round((rawVal / 85) * 85)));
      let tier: StrengthTier = "Balanced";
      if (score >= 76) tier = "Strong";
      else if (score >= 60) tier = "Developing Strength";
      else if (score >= 46) tier = "Balanced";
      else tier = "Growth Opportunity";

      return {
        key,
        score,
        tier,
        label: STRENGTH_META[key].label,
        explanation: STRENGTH_META[key].explanation
      };
    })
    .sort((a, b) => b.score - a.score);

  const topStrengths = normalizedStrengths.slice(0, 5);

  // Growth Opportunities: bottom 2–3 strengths, framed constructively
  const growthOpportunities = normalizedStrengths
    .slice(-3)
    .reverse()
    .map((s) => ({
      area: s.label,
      observation: `Your current responses indicate you may rely more naturally on other areas than ${s.label.toLowerCase()}.`,
      nextStep: STRENGTH_META[s.key].growthNextStep
    }));

  // 5. Work Style Axes
  const workStyleAxes: WorkStyleAxis[] = [
    {
      dimension: "Collaboration",
      leftLabel: "Independent Ownership",
      rightLabel: "Collaborative Team",
      score: Math.min(100, Math.max(-100, raw.workStyle.independent_collaborative * 5)),
      summary: raw.workStyle.independent_collaborative < 0
        ? "You tend to produce your best thinking with quiet autonomy and clear personal accountability."
        : "You gain energy from brainstorming, live feedback, and shared team delivery."
    },
    {
      dimension: "Structure",
      leftLabel: "Structured & Systematic",
      rightLabel: "Flexible & Fluid",
      score: Math.min(100, Math.max(-100, raw.workStyle.structured_flexible * 5)),
      summary: raw.workStyle.structured_flexible < 0
        ? "You thrive when goals, processes, and metrics are clearly outlined from day one."
        : "You excel when there is room to adapt, pivot methods, and discover solutions organically."
    },
    {
      dimension: "Focus Environment",
      leftLabel: "Deep Analytical Work",
      rightLabel: "High Interaction",
      score: Math.min(100, Math.max(-100, raw.workStyle.deepwork_interaction * 5)),
      summary: raw.workStyle.deepwork_interaction < 0
        ? "You prefer extended blocks of uninterrupted time to solve tough cognitive challenges."
        : "You prefer active stakeholder touchpoints, discussions, and dynamic human interactions."
    },
    {
      dimension: "Scope",
      leftLabel: "Strategic & Big-Picture",
      rightLabel: "Execution & Hands-On",
      score: Math.min(100, Math.max(-100, raw.workStyle.strategic_execution * 5)),
      summary: raw.workStyle.strategic_execution < 0
        ? "You naturally orient toward macro strategy, positioning, and long-term vision."
        : "You take pride in converting strategy into tangible, high-quality deliverables."
    }
  ];

  const workStyleSummary = `You may work best when you have ${
    raw.workStyle.independent_collaborative < 0 ? "strong individual ownership" : "a collaborative team environment"
  }, ${
    raw.workStyle.structured_flexible < 0 ? "clear objectives and transparent benchmarks" : "room for creative flexibility"
  }, and enough freedom to decide how to get the work done.`;

  // 6. Top Values
  const topValues = (Object.entries(raw.values) as [CareerValue, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => ({
      name,
      explanation: VALUE_EXPLANATIONS[name]
    }));

  // 7. Motivation Profile
  const sortedMotivations = (Object.entries(raw.motivation) as [MotivationType, number][])
    .sort((a, b) => b[1] - a[1]);
  const primaryMotivation = sortedMotivations[0]?.[0] || "Growth" as any;
  const secondaryMotivation = sortedMotivations[1]?.[0] || "Autonomy" as any;

  const motivationSummary = `You appear to be primarily driven by ${primaryMotivation.toLowerCase()} and ${secondaryMotivation.toLowerCase()} — seeking roles where your accomplishments are recognized and you continue expanding your mastery.`;

  // 8. Confidence Profile
  const confidenceLabels: Record<string, string> = {
    career_decisions: "Career Decisions",
    communication: "Executive Communication",
    networking: "Professional Networking",
    interviews: "Job Interviews",
    learning_skills: "Learning New Skills",
    changing_careers: "Navigating Career Shifts",
    job_applications: "Application Strategy",
    leadership: "Team Leadership",
    negotiation: "Salary & Role Negotiation",
    uncertainty: "Handling Market Uncertainty"
  };

  const confidenceProfile: ConfidenceArea[] = Object.entries(raw.confidence).map(([key, score]) => {
    let level: ConfidenceArea["level"] = "Steady";
    if (score >= 68) level = "Strong Confidence";
    else if (score >= 48) level = "Steady";
    else level = "Confidence to build";

    return {
      key,
      label: confidenceLabels[key] || key,
      level
    };
  });

  // 9. Blind Spots (Suggestive, safe language)
  const blindSpots: string[] = [];
  if (raw.workStyle.independent_collaborative < -4) {
    blindSpots.push(
      "Your responses suggest you may take on too much individual burden rather than delegating or asking for team support early."
    );
  } else if (raw.workStyle.independent_collaborative > 4) {
    blindSpots.push(
      "One thing worth watching: relying heavily on group consensus might occasionally slow down your personal decision speed."
    );
  }

  if (topStrengths.some((s) => s.key === "analytical_thinking") && !topStrengths.some((s) => s.key === "communication")) {
    blindSpots.push(
      "You may develop breakthrough analytical answers, but your ideas may be stronger than your current habit of selling them persuasively to non-technical stakeholders."
    );
  }

  if (raw.values.Income > 12 && raw.values["Work-life balance"] < 6) {
    blindSpots.push(
      "Your responses suggest a strong drive for financial acceleration; ensure you pace yourself to avoid burnout over long-term career marathons."
    );
  }

  if (blindSpots.length === 0) {
    blindSpots.push(
      "You may occasionally spend extra time refining existing work instead of shipping early versions to gather real-world market feedback."
    );
    blindSpots.push(
      "One thing worth watching is balancing deep domain technicality with high-level commercial storytelling."
    );
  }

  // 10. Career Archetype Assignment
  const top1Riasec = riasecTop3[0]?.area || "EXPLORE_SOLVE";
  const top2Riasec = riasecTop3[1]?.area || "LEAD_INFLUENCE";

  let archetype = {
    title: "Strategic Builder",
    tagline: "Analytical acumen combined with commercial execution",
    description: "You appear to combine analytical thinking, initiative, and a strong preference for commercial growth and systematic execution."
  };

  if (top1Riasec === "EXPLORE_SOLVE" && top2Riasec === "ORGANISE_STRUCTURE") {
    archetype = {
      title: "Analytical Problem Solver",
      tagline: "Disciplined diagnostics, logic, and systematic clarity",
      description: "You excel at cutting through ambiguity, diagnosing complex bottlenecks with data, and designing robust, mistake-proof systems."
    };
  } else if (top1Riasec === "CREATE_EXPRESS" || top2Riasec === "CREATE_EXPRESS") {
    archetype = {
      title: "Creative Explorer",
      tagline: "Original thinking, aesthetic sense, and user empathy",
      description: "You bring fresh perspectives, design thinking, and imaginative storytelling to solve human problems in distinctive ways."
    };
  } else if (top1Riasec === "HELP_CONNECT" || top2Riasec === "HELP_CONNECT") {
    archetype = {
      title: "People Leader",
      tagline: "Empathetic leadership, team alignment, and cultural impact",
      description: "You inspire teams, build trust-centered partnerships, and lead initiatives by understanding what motivates people."
    };
  } else if (top1Riasec === "LEAD_INFLUENCE" && (top2Riasec === "EXPLORE_SOLVE" || top2Riasec === "BUILD_DO")) {
    archetype = {
      title: "Growth Driver",
      tagline: "Relentless momentum, market discovery, and business impact",
      description: "You spot untapped commercial opportunities, make decisive moves, and drive measurable expansion with clarity."
    };
  } else if (top1Riasec === "ORGANISE_STRUCTURE" || top2Riasec === "ORGANISE_STRUCTURE") {
    archetype = {
      title: "Organised Operator",
      tagline: "Airtight execution, operational scale, and structural consistency",
      description: "You turn high-level strategy into reliable execution with clarity, thoroughness, and disciplined operational rhythm."
    };
  }

  // 11. Career Matching (Deterministic Fit)
  const scoredCareers = CAREER_DATABASE.map((career) => {
    let matchScore = 50;

    // RIASEC match (up to +25)
    for (const rArea of career.riasecPrimary) {
      if (riasecTop3.some((rt) => rt.area === rArea)) {
        matchScore += 12;
      }
    }

    // Strengths match (up to +20)
    for (const reqStrength of career.strengthsRequired) {
      if (topStrengths.some((ts) => ts.key === reqStrength)) {
        matchScore += 5;
      }
    }

    // Values match (up to +10)
    for (const dVal of career.dominantValues) {
      if (topValues.some((tv) => tv.name === dVal)) {
        matchScore += 3;
      }
    }

    matchScore = Math.min(97, Math.max(65, matchScore));

    // Dynamic "Why it appeared" bullet points
    const whyItAppeared: string[] = [];
    const matchedStrengths = career.strengthsRequired
      .filter((req) => topStrengths.some((ts) => ts.key === req))
      .slice(0, 2);
    if (matchedStrengths.length > 0) {
      whyItAppeared.push(`Demonstrated aptitude in ${matchedStrengths.map((s) => STRENGTH_META[s].label).join(" and ")}`);
    }

    const matchedRiasec = career.riasecPrimary.filter((r) => riasecTop3.some((rt) => rt.area === r));
    if (matchedRiasec.length > 0) {
      whyItAppeared.push(`High natural alignment with ${matchedRiasec.map((r) => RIASEC_META[r].label).join(" & ")} interests`);
    }

    const matchedValue = career.dominantValues.find((v) => topValues.some((tv) => tv.name === v));
    if (matchedValue) {
      whyItAppeared.push(`Strong synergy with your priority career value: ${matchedValue}`);
    }

    whyItAppeared.push(`Fits your preference for ${career.workStyleFit.toLowerCase().slice(0, 45)}...`);

    const match: CareerMatch = {
      id: career.id,
      title: career.title,
      cluster: career.cluster,
      matchTier: "strong_match",
      matchScore,
      whyItAppeared,
      description: career.description,
      typicalWork: career.typicalWork,
      keySkills: career.keySkills,
      helpfulDegrees: career.helpfulDegrees,
      helpfulCertifications: career.helpfulCertifications,
      entryRoles: career.entryRoles,
      growthPath: career.growthPath,
      workStyleFit: career.workStyleFit
    };

    return match;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const strongMatches = scoredCareers.slice(0, 3).map((c) => ({ ...c, matchTier: "strong_match" as const }));
  const alsoExplore = scoredCareers.slice(3, 7).map((c) => ({ ...c, matchTier: "also_explore" as const }));

  // 12. Skill Gap Analysis for the Primary Career Match
  const primaryCareer = strongMatches[0];
  const allSkills = primaryCareer?.keySkills || ["Problem Solving", "Strategic Planning", "Data Literacy", "Communication"];
  const skillsToBuild: SkillGapAnalysis = {
    alreadyStrong: [allSkills[0] || "Structured Problem Solving", allSkills[1] || "Clear Written Communication"],
    buildNext: [allSkills[2] || "Applied Industry Analytics", allSkills[3] || "Modern Domain Tools & Frameworks"],
    usefulLater: [allSkills[4] || "Cross-Functional Leadership", "Executive Stakeholder Alignment"]
  };

  return {
    archetype,
    riasecTop3,
    topStrengths,
    growthOpportunities,
    blindSpots: blindSpots.slice(0, 3),
    workStyle: {
      summary: workStyleSummary,
      axes: workStyleAxes
    },
    topValues,
    motivationProfile: {
      primary: primaryMotivation,
      secondary: secondaryMotivation,
      summary: motivationSummary
    },
    confidenceProfile,
    identifiedChallenges: raw.challenges,
    careersToExplore: {
      strongMatches,
      alsoExplore
    },
    skillsToBuild
  };
}
