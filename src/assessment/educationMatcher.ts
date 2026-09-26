import {
  UserStage,
  UserGoal,
  CareerMatch,
  EducationRecommendation
} from "./types";
import { COURSES, Course } from "@/data/courses";
import { UNIVERSITIES, University } from "@/data/universities";

export interface UniversityMatchCard {
  name: string;
  shortName: string;
  slug: string;
  naacGrade?: string;
  approvals: string[];
  feeRange: string;
  emiStarting: string;
  examMode: string;
  highlights: string[];
}

export interface MatchedEducationResult {
  recommendation: EducationRecommendation;
  matchedCourse?: Course;
  partnerUniversities: UniversityMatchCard[];
  degreeAdviceNote: string;
}

export function matchEducationPath(
  primaryCareer: CareerMatch,
  userStage: UserStage,
  userGoal: UserGoal,
  challenges: string[]
): MatchedEducationResult {
  // Determine if formal education is timely or skill/project first
  const isLookingForDegree =
    userGoal === "choose_degree" ||
    userGoal === "choose_study" ||
    userStage === "class_11_12" ||
    userStage === "class_10" ||
    challenges.includes("flexible_education") ||
    challenges.includes("degree_selection");

  const alreadyHasAdvancedDegree = userStage === "masters_completed";

  // If user already has masters and just wants to understand strengths or build skills without career shift
  if (alreadyHasAdvancedDegree && !isLookingForDegree && userGoal !== "change_careers") {
    return {
      recommendation: {
        status: "skills_experience_first",
        summary:
          "You may not need another degree immediately. You already have a strong master's foundation. Building applied portfolio projects, executive visibility, and targeted skill credentials will deliver higher immediate ROI.",
        whyItMayFit: [
          "You already hold advanced formal postgraduate credentials",
          "Industry employers now value verified project execution and domain impact",
          "Targeted certifications and real-world results offer faster promotion leverage"
        ],
        specialisationsToExplore: []
      },
      partnerUniversities: [],
      degreeAdviceNote:
        "Formal education is secondary right now. Focus your immediate 90 days on practical portfolio evidence and professional positioning."
    };
  }

  // Undergraduate cases
  if (userStage === "class_10" || userStage === "class_11_12") {
    let targetSlug = "online-bba";
    if (
      primaryCareer.cluster.includes("Technology") ||
      primaryCareer.cluster.includes("Software") ||
      primaryCareer.cluster.includes("Data")
    ) {
      targetSlug = "online-bca";
    } else if (primaryCareer.cluster.includes("Finance") || primaryCareer.cluster.includes("Accounting")) {
      targetSlug = "online-bcom";
    }

    const matchedCourse = COURSES.find((c) => c.slug === targetSlug) || COURSES.find((c) => c.slug === "online-bba")!;
    const partnerUnis = getPartnerUniversities(matchedCourse);

    return {
      recommendation: {
        status: "useful_next_step",
        primaryDegreeSlug: matchedCourse.slug,
        primaryDegreeName: matchedCourse.title,
        summary: `An ${matchedCourse.title} provides the recognized, UGC-entitled foundational degree needed to unlock graduate opportunities in ${primaryCareer.cluster}.`,
        whyItMayFit: [
          "Builds accredited higher-education eligibility recognized for all government and corporate roles",
          "Allows you to learn modern industry curricula from home at affordable fees",
          "Enables you to build portfolios, internships, and freelance projects alongside university studies"
        ],
        specialisationsToExplore: matchedCourse.specializations.slice(0, 4)
      },
      matchedCourse,
      partnerUniversities: partnerUnis,
      degreeAdviceNote:
        "An accredited undergraduate degree is essential. Ensure your chosen university holds valid UGC-DEB entitling before enrolling."
    };
  }

  // Working professional or graduate cases
  let targetSlug = "online-mba";
  const cluster = primaryCareer.cluster.toLowerCase();

  if (cluster.includes("software") || cluster.includes("technology") || (cluster.includes("data") && userStage === "college")) {
    targetSlug = userStage === "college" || userStage === "class_11_12" ? "online-bca" : "online-mca";
  } else if (cluster.includes("marketing") || cluster.includes("product") || cluster.includes("management") || cluster.includes("consulting") || cluster.includes("business") || cluster.includes("human resources")) {
    targetSlug = "online-mba";
  } else if (cluster.includes("finance") || cluster.includes("accounting")) {
    targetSlug = userStage === "working_professional" ? "online-mba" : "online-mcom";
  }

  const matchedCourse = COURSES.find((c) => c.slug === targetSlug) || COURSES.find((c) => c.slug === "online-mba")!;
  const partnerUnis = getPartnerUniversities(matchedCourse);

  const whyItFits: string[] = [];
  if (userStage === "working_professional") {
    whyItFits.push("You are already working full-time and need a flexible UGC-entitled format with zero commute");
    whyItFits.push("Accelerates your trajectory toward managerial band promotions and executive roles");
  } else if (userStage === "career_switcher") {
    whyItFits.push("Provides formal domain qualification to bridge your transition into a new industry safely");
    whyItFits.push("Replaces years of trial-and-error with a structured curriculum and placement assistance");
  } else {
    whyItFits.push("High corporate recognition across leading MNCs, tech startups, and enterprise firms");
    whyItFits.push("Affordable fee structure with no-cost monthly EMI options");
  }

  whyItFits.push(`Aligns directly with your interest in ${primaryCareer.title}`);
  whyItFits.push("100% online remote-proctored weekend examinations so your daily schedule is never disrupted");

  return {
    recommendation: {
      status: "useful_next_step",
      primaryDegreeSlug: matchedCourse.slug,
      primaryDegreeName: matchedCourse.title,
      summary: `An ${matchedCourse.title} may be worth exploring if management growth and formal domain recognition in ${primaryCareer.title} are part of your ambition.`,
      whyItMayFit: whyItFits.slice(0, 4),
      specialisationsToExplore: matchedCourse.specializations.slice(0, 5)
    },
    matchedCourse,
    partnerUniversities: partnerUnis,
    degreeAdviceNote:
      "Education may be a useful next step. If management growth is your goal, an online degree allows you to earn your full salary while studying."
  };
}

function getPartnerUniversities(course: Course): UniversityMatchCard[] {
  const matchingUnis = UNIVERSITIES.filter((u) => {
    if (u.category !== "online") return false;
    return course.topUniversitySlugs.includes(u.slug) || u.popularCourses.some((c) => c.toLowerCase().includes(course.title.toLowerCase()));
  });

  return (matchingUnis.length > 0 ? matchingUnis : UNIVERSITIES.slice(0, 3)).slice(0, 4).map((u) => ({
    name: u.name,
    shortName: u.shortName,
    slug: u.slug,
    naacGrade: u.naacGrade,
    approvals: u.approvals,
    feeRange: u.feeRange,
    emiStarting: u.emiStarting,
    examMode: u.examMode,
    highlights: u.highlights
  }));
}
