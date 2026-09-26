export type UserStage =
  | "class_10"
  | "class_11_12"
  | "college"
  | "bachelors_completed"
  | "masters_completed"
  | "working_professional"
  | "job_seeker"
  | "career_switcher"
  | "not_sure";

export type UserGoal =
  | "find_direction"
  | "choose_study"
  | "choose_degree"
  | "better_opportunities"
  | "change_careers"
  | "understand_strengths"
  | "build_skills"
  | "confused_next_step";

export type RiasecArea =
  | "BUILD_DO"           // Realistic
  | "EXPLORE_SOLVE"      // Investigative
  | "CREATE_EXPRESS"     // Artistic
  | "HELP_CONNECT"       // Social
  | "LEAD_INFLUENCE"     // Enterprising
  | "ORGANISE_STRUCTURE";// Conventional

export type StrengthKey =
  | "analytical_thinking"
  | "problem_solving"
  | "communication"
  | "creativity"
  | "leadership"
  | "organisation"
  | "decision_making"
  | "initiative"
  | "learning_agility"
  | "adaptability"
  | "execution"
  | "relationship_building"
  | "attention_to_detail";

export type StrengthTier = "Strong" | "Developing Strength" | "Balanced" | "Growth Opportunity";

export type WorkStyleAxis = {
  dimension: string;
  leftLabel: string;
  rightLabel: string;
  score: number; // -100 (left) to +100 (right)
  summary: string;
};

export type CareerValue =
  | "Growth"
  | "Income"
  | "Stability"
  | "Freedom"
  | "Learning"
  | "Leadership"
  | "Recognition"
  | "Creativity"
  | "Impact"
  | "Flexibility"
  | "Entrepreneurship"
  | "Work-life balance"
  | "Prestige";

export type MotivationType =
  | "Achievement"
  | "Mastery"
  | "Security"
  | "Autonomy"
  | "Recognition"
  | "Purpose"
  | "Competition"
  | "Exploration"
  | "Contribution";

export type ConfidenceArea = {
  key: string;
  label: string;
  level: "Strong Confidence" | "Steady" | "Confidence to build";
};

export type QuestionType = "single_choice" | "forced_choice" | "scenario" | "scale" | "multiselect";

export interface QuestionOption {
  text: string;
  description?: string;
  weights: {
    riasec?: Partial<Record<RiasecArea, number>>;
    strengths?: Partial<Record<StrengthKey, number>>;
    values?: CareerValue[];
    workStyle?: Partial<Record<string, number>>;
    motivation?: MotivationType[];
    confidence?: Partial<Record<string, number>>;
    challenges?: string[];
  };
}

export interface AssessmentQuestion {
  id: string;
  section: "stage_goal" | "interests" | "strengths" | "workstyle" | "values_motivation" | "confidence_challenges";
  title: string;
  subtitle?: string;
  type: QuestionType;
  options: QuestionOption[];
  adaptiveTag?: "analytical" | "creative" | "social" | "enterprising" | "general";
}

export interface CareerMatch {
  id: string;
  title: string;
  cluster: string;
  matchTier: "strong_match" | "also_explore";
  matchScore: number;
  whyItAppeared: string[];
  description: string;
  typicalWork: string;
  keySkills: string[];
  helpfulDegrees: string[];
  helpfulCertifications: string[];
  entryRoles: string[];
  growthPath: string[];
  workStyleFit: string;
}

export interface SkillGapAnalysis {
  alreadyStrong: string[];
  buildNext: string[];
  usefulLater: string[];
}

export interface EducationRecommendation {
  status: "useful_next_step" | "skills_experience_first";
  primaryDegreeSlug?: string;
  primaryDegreeName?: string;
  whyItMayFit: string[];
  specialisationsToExplore: string[];
  summary: string;
}

export interface RoadmapStage {
  stepNumber: string;
  title: string;
  whatToDo: string;
  whyItMatters: string;
  keyPoints: string[];
}

export interface ActionPlan90Days {
  next7Days: string[];
  next30Days: string[];
  next90Days: string[];
}

export interface AssessmentResult {
  version: string;
  completedAt: string;
  userStage: UserStage;
  userGoal: UserGoal;
  archetype: {
    title: string;
    tagline: string;
    description: string;
  };
  riasecTop3: {
    area: RiasecArea;
    label: string;
    tagline: string;
    description: string;
    score: number;
  }[];
  topStrengths: {
    key: StrengthKey;
    label: string;
    tier: StrengthTier;
    score: number;
    explanation: string;
  }[];
  growthOpportunities: {
    area: string;
    observation: string;
    nextStep: string;
  }[];
  blindSpots: string[];
  workStyle: {
    summary: string;
    axes: WorkStyleAxis[];
  };
  topValues: {
    name: CareerValue;
    explanation: string;
  }[];
  motivationProfile: {
    primary: MotivationType;
    secondary: MotivationType;
    summary: string;
  };
  confidenceProfile: ConfidenceArea[];
  identifiedChallenges: string[];
  careersToExplore: {
    strongMatches: CareerMatch[];
    alsoExplore: CareerMatch[];
  };
  skillsToBuild: SkillGapAnalysis;
  educationRecommendation: EducationRecommendation;
  roadmap: {
    careerType: string;
    targetCareer: string;
    stages: RoadmapStage[];
  };
  actionPlan: ActionPlan90Days;
  nextBestMove: {
    headline: string;
    actionText: string;
    primaryCtaLabel: string;
    primaryCtaLink: string;
  };
}
