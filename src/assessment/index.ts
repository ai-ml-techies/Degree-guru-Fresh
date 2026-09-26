import { AssessmentResult, UserStage, UserGoal } from "./types";
import { scoreAssessment } from "./scoring";
import { matchEducationPath } from "./educationMatcher";
import { generateRoadmap } from "./roadmapEngine";
import { ASSESSMENT_QUESTIONS } from "./questions";

export * from "./types";
export * from "./questions";
export * from "./careerDatabase";
export * from "./scoring";
export * from "./educationMatcher";
export * from "./roadmapEngine";

export function evaluateAssessment(answers: Record<string, any>): AssessmentResult {
  const version = "v1.0";
  const completedAt = new Date().toISOString();

  // Extract stage & goal
  const stageOptIdx = answers["user_stage"];
  const stageQ = ASSESSMENT_QUESTIONS.find((q) => q.id === "user_stage");
  const userStageText = stageQ && typeof stageOptIdx === "number" ? stageQ.options[stageOptIdx]?.text : "";

  let userStage: UserStage = "working_professional";
  if (userStageText.includes("Class 10")) userStage = "class_10";
  else if (userStageText.includes("Class 11")) userStage = "class_11_12";
  else if (userStageText.includes("College")) userStage = "college";
  else if (userStageText.includes("Bachelor's")) userStage = "bachelors_completed";
  else if (userStageText.includes("Master's")) userStage = "masters_completed";
  else if (userStageText.includes("Job")) userStage = "job_seeker";
  else if (userStageText.includes("Changing")) userStage = "career_switcher";
  else if (userStageText.includes("Not Sure")) userStage = "not_sure";

  const goalOptIdx = answers["user_goal"];
  const goalQ = ASSESSMENT_QUESTIONS.find((q) => q.id === "user_goal");
  const userGoalText = goalQ && typeof goalOptIdx === "number" ? goalQ.options[goalOptIdx]?.text : "";

  let userGoal: UserGoal = "find_direction";
  if (userGoalText.includes("direction")) userGoal = "find_direction";
  else if (userGoalText.includes("study")) userGoal = "choose_study";
  else if (userGoalText.includes("degree")) userGoal = "choose_degree";
  else if (userGoalText.includes("opportunities")) userGoal = "better_opportunities";
  else if (userGoalText.includes("Change")) userGoal = "change_careers";
  else if (userGoalText.includes("strengths")) userGoal = "understand_strengths";
  else if (userGoalText.includes("skills")) userGoal = "build_skills";
  else if (userGoalText.includes("confused")) userGoal = "confused_next_step";

  // Deterministic scoring
  const scored = scoreAssessment(answers);

  // Education matching
  const primaryCareer = scored.careersToExplore.strongMatches[0];
  const eduMatched = matchEducationPath(
    primaryCareer,
    userStage,
    userGoal,
    scored.identifiedChallenges
  );

  // Roadmap generation
  const roadmapResult = generateRoadmap(
    primaryCareer,
    userStage,
    userGoal,
    eduMatched.recommendation
  );

  return {
    version,
    completedAt,
    userStage,
    userGoal,
    archetype: scored.archetype,
    riasecTop3: scored.riasecTop3,
    topStrengths: scored.topStrengths,
    growthOpportunities: scored.growthOpportunities,
    blindSpots: scored.blindSpots,
    workStyle: scored.workStyle,
    topValues: scored.topValues,
    motivationProfile: scored.motivationProfile,
    confidenceProfile: scored.confidenceProfile,
    identifiedChallenges: scored.identifiedChallenges,
    careersToExplore: scored.careersToExplore,
    skillsToBuild: scored.skillsToBuild,
    educationRecommendation: eduMatched.recommendation,
    roadmap: {
      careerType: roadmapResult.careerType,
      targetCareer: roadmapResult.targetCareer,
      stages: roadmapResult.stages
    },
    actionPlan: roadmapResult.actionPlan,
    nextBestMove: roadmapResult.nextBestMove
  };
}
