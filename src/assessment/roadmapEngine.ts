import {
  UserStage,
  UserGoal,
  CareerMatch,
  EducationRecommendation,
  RoadmapStage,
  ActionPlan90Days
} from "./types";

export interface RoadmapResult {
  careerType: string;
  targetCareer: string;
  stages: RoadmapStage[];
  actionPlan: ActionPlan90Days;
  nextBestMove: {
    headline: string;
    actionText: string;
    primaryCtaLabel: string;
    primaryCtaLink: string;
  };
}

export function generateRoadmap(
  primaryCareer: CareerMatch,
  userStage: UserStage,
  userGoal: UserGoal,
  educationRec: EducationRecommendation
): RoadmapResult {
  let careerType = "Working Professional";
  let stages: RoadmapStage[] = [];

  const degreeName = educationRec.primaryDegreeName || "an Online Degree";
  const primarySkill = primaryCareer.keySkills[0] || "Core Industry Skills";
  const secondarySkill = primaryCareer.keySkills[1] || "Practical Frameworks";

  if (userStage === "class_10" || userStage === "class_11_12") {
    careerType = "Class 12 Student";
    stages = [
      {
        stepNumber: "01",
        title: "Explore Core Interests & Roles",
        whatToDo: `Understand everyday responsibilities in ${primaryCareer.title} and related sectors.`,
        whyItMatters: "Clarity at this stage avoids picking the wrong undergraduate branch or college.",
        keyPoints: [
          `Review introductory resources on ${primarySkill}`,
          "Talk to seniors or professionals working in this field"
        ]
      },
      {
        stepNumber: "02",
        title: "Choose the Right Undergraduate Degree",
        whatToDo: `Select an accredited undergraduate degree (such as ${degreeName}) with the right specialization.`,
        whyItMatters: "Provides legal academic validity and opens gates for competitive jobs and postgraduate studies.",
        keyPoints: [
          "Compare UGC-DEB entitled universities",
          "Ensure affordable fees and flexible semester schedules"
        ]
      },
      {
        stepNumber: "03",
        title: "Build Hands-On Practical Skills",
        whatToDo: `Start building proficiency in ${primarySkill} and ${secondarySkill} through free online resources.`,
        whyItMatters: "Employers look for demonstrable capability, not just theory memorization.",
        keyPoints: [
          "Build small self-initiated projects",
          "Earn foundational introductory badges"
        ]
      },
      {
        stepNumber: "04",
        title: "Pursue Internships & Live Projects",
        whatToDo: "Apply for virtual internships or college club leadership roles during your 2nd and 3rd year.",
        whyItMatters: "Real-world exposure sets your resume apart from thousands of fresh graduates.",
        keyPoints: [
          "Complete 1–2 verified internships",
          "Document business impact in clear bullet points"
        ]
      },
      {
        stepNumber: "05",
        title: "Launch Your Career or Advance to Master's",
        whatToDo: `Target entry-level roles such as ${primaryCareer.entryRoles[0] || "Junior Associate"}.`,
        whyItMatters: "Establishes your professional footing and accelerates future growth.",
        keyPoints: [
          "Craft an ATS-optimized professional resume",
          "Prepare for technical and behavioral interviews"
        ]
      }
    ];
  } else if (userStage === "career_switcher") {
    careerType = "Career Switcher";
    stages = [
      {
        stepNumber: "01",
        title: "Clarify Your Target Career Direction",
        whatToDo: `Lock in ${primaryCareer.title} as your primary transition goal for the next 6–12 months.`,
        whyItMatters: "Focusing on one target domain prevents scattered effort and resume confusion.",
        keyPoints: [
          "Audit which of your current skills transfer directly",
          "Understand the compensation benchmarks and day-to-day work"
        ]
      },
      {
        stepNumber: "02",
        title: "Bridge the Critical Skill Gap",
        whatToDo: `Master high-leverage tools: focus on ${primarySkill} and ${secondarySkill}.`,
        whyItMatters: "Closing the primary technical or domain gap gives you hiring credibility.",
        keyPoints: [
          "Start with one prioritized skill rather than 10 courses at once",
          "Spend 70% of time practicing and 30% watching theory"
        ]
      },
      {
        stepNumber: "03",
        title: "Build Public Proof of Competence",
        whatToDo: `Create 2 tangible case studies or portfolio artifacts relevant to ${primaryCareer.title}.`,
        whyItMatters: "Switchers succeed by showing working proof that eliminates employer hiring risk.",
        keyPoints: [
          "Publish a detailed case study or project repository",
          "Show business problem, approach, and measurable outcome"
        ]
      },
      {
        stepNumber: "04",
        title: "Add Formal Domain Education If Useful",
        whatToDo: educationRec.status === "useful_next_step"
          ? `Explore ${degreeName} to secure recognized postgraduate domain credentials without leaving your job.`
          : "Focus on domain certifications and industry micro-credentials first.",
        whyItMatters: "Formal credentials bypass automated corporate filters that screen out non-traditional applicants.",
        keyPoints: [
          "Select specializations closely aligned with your target niche",
          "Use flexible weekend learning to protect current income"
        ]
      },
      {
        stepNumber: "05",
        title: "Reposition Your Resume & Transition",
        whatToDo: `Reposition your resume for roles like ${primaryCareer.entryRoles[0] || "Domain Specialist"}.`,
        whyItMatters: "Highlighting transferable achievements plus new proof triggers recruiter callbacks.",
        keyPoints: [
          "Rewrite your LinkedIn headline and ATS summary",
          "Leverage warm network outreach and informational conversations"
        ]
      }
    ];
  } else if (userStage === "job_seeker") {
    careerType = "Job Seeker";
    stages = [
      {
        stepNumber: "01",
        title: "Target Specific Roles & Requirements",
        whatToDo: `Focus your search on 2–3 clearly defined titles (e.g. ${primaryCareer.entryRoles.slice(0, 2).join(", ") || primaryCareer.title}).`,
        whyItMatters: "Applying to everything with a generic profile dramatically reduces response rates.",
        keyPoints: [
          "Analyze 10 job descriptions to identify recurring requirements",
          "Pinpoint the top 3 tools and keywords employers mandate"
        ]
      },
      {
        stepNumber: "02",
        title: "Optimize Your ATS Resume & LinkedIn",
        whatToDo: "Rebuild your resume using standard single-column ATS formatting and quantified bullet points.",
        whyItMatters: "Most online applications are parsed by automated ATS filters before a recruiter sees them.",
        keyPoints: [
          "Use Degree Guru's ATS Resume tool to match keyword density",
          "Turn job duties into measurable accomplishments (Numbers, %, ₹)"
        ]
      },
      {
        stepNumber: "03",
        title: "Build 2 Proof Projects",
        whatToDo: `Complete 2 practical projects demonstrating competence in ${primarySkill}.`,
        whyItMatters: "Live links, case studies, or GitHub repos immediately separate you from other applicants.",
        keyPoints: [
          "Embed project links directly in your resume header",
          "Write a 1-page summary explaining your methodology"
        ]
      },
      {
        stepNumber: "04",
        title: "Strengthen Your Profile With Education If Helpful",
        whatToDo: educationRec.status === "useful_next_step"
          ? `Evaluate whether an accredited ${degreeName} can give you an edge in competitive applicant pools.`
          : "Complete 1 recognized industry certification to add immediate credibility.",
        whyItMatters: "Ongoing structured learning shows motivation and prevents resume gaps.",
        keyPoints: [
          "Verify UGC-DEB accreditation and placement support",
          "Take advantage of low-cost monthly EMI financing"
        ]
      },
      {
        stepNumber: "05",
        title: "Consistent Multi-Channel Applications & Mock Prep",
        whatToDo: "Apply to 5 high-fit roles per week while actively messaging hiring managers and alumni.",
        whyItMatters: "Targeted, consistent outreach consistently outperforms mass one-click applying.",
        keyPoints: [
          "Prepare structured answers using the STAR framework",
          "Follow up politely 5 days after applying"
        ]
      }
    ];
  } else if (userStage === "college") {
    careerType = "College Student";
    stages = [
      {
        stepNumber: "01",
        title: "Establish Your Career Focus",
        whatToDo: `Explore careers in ${primaryCareer.cluster} and understand industry demand.`,
        whyItMatters: "Setting a direction early gives you 1–2 years to build competitive advantages before campus drives.",
        keyPoints: [
          `Familiarize yourself with ${primarySkill}`,
          "Join relevant student clubs, hackathons, or professional associations"
        ]
      },
      {
        stepNumber: "02",
        title: "Master High-Demand Applied Skills",
        whatToDo: `Develop core competence in ${primarySkill} and ${secondarySkill}.`,
        whyItMatters: "College syllabi are often theoretical; companies hire for modern practical tooling.",
        keyPoints: [
          "Dedicate 5 hours every weekend to practical building",
          "Document your weekly learning notes publicly on LinkedIn"
        ]
      },
      {
        stepNumber: "03",
        title: "Secure High-Quality Internships",
        whatToDo: "Complete at least one substantive 8–12 week internship before your final semester.",
        whyItMatters: "Prior internship experience is the #1 deciding factor in fresher shortlisting.",
        keyPoints: [
          "Target early-stage startups or mid-market firms for broad exposure",
          "Focus on delivering measurable output"
        ]
      },
      {
        stepNumber: "04",
        title: "Evaluate Master's / Higher Education",
        whatToDo: educationRec.status === "useful_next_step"
          ? `Consider whether enrolling in ${degreeName} alongside work or post-graduation fits your goals.`
          : "Gain 1–2 years of practical work experience before committing to a master's degree.",
        whyItMatters: "Helps you choose the right specialization with full clarity on market ROI.",
        keyPoints: [
          "Compare on-campus vs flexible UGC online options",
          "Align specializations with long-term compensation data"
        ]
      },
      {
        stepNumber: "05",
        title: "Prepare for Placements & Graduate Hiring",
        whatToDo: `Prepare an ATS resume highlighting projects and target roles like ${primaryCareer.entryRoles[0] || "Junior Analyst"}.`,
        whyItMatters: "Polished communication and behavioral confidence turn interviews into offers.",
        keyPoints: [
          "Practice mock interviews with peers and mentors",
          "Prepare 3 compelling project stories"
        ]
      }
    ];
  } else {
    // Working Professional default
    careerType = "Working Professional";
    stages = [
      {
        stepNumber: "01",
        title: "Assess Current Role & Growth Ceiling",
        whatToDo: `Benchmark your current scope against senior roles in ${primaryCareer.title}.`,
        whyItMatters: "Identifies whether your next step is an internal promotion or an external transition.",
        keyPoints: [
          "Identify the specific gaps keeping you from the next managerial band",
          "Map out compensation benchmarks across top hiring companies"
        ]
      },
      {
        stepNumber: "02",
        title: "Upskill in Priority Competencies",
        whatToDo: `Focus on mastering ${primarySkill} and data-driven decision frameworks.`,
        whyItMatters: "Modern leadership requires both strategic vision and analytical fluency.",
        keyPoints: [
          "Apply newly learned techniques to your current day-to-day deliverables",
          "Demonstrate visible initiative to team leadership"
        ]
      },
      {
        stepNumber: "03",
        title: "Add Formal Management / Technical Education",
        whatToDo: educationRec.status === "useful_next_step"
          ? `Explore an accredited ${degreeName} to qualify for higher management bands without quitting your job.`
          : "Pursue targeted executive micro-certifications to showcase specialized mastery.",
        whyItMatters: "UGC-entitled degrees fulfill corporate criteria for senior director and VP promotions.",
        keyPoints: [
          "Choose an industry-recognized university with high corporate alumni presence",
          "Benefit from weekend classes and flexible proctored exams"
        ]
      },
      {
        stepNumber: "04",
        title: "Build Executive Presence & Profile",
        whatToDo: "Enhance your LinkedIn presence, document case studies, and cultivate senior industry mentors.",
        whyItMatters: "Senior roles above ₹15 LPA are frequently filled via executive search and referrals.",
        keyPoints: [
          "Share monthly insights or project summaries in your field",
          "Participate in industry roundtables and webinars"
        ]
      },
      {
        stepNumber: "05",
        title: "Transition Into Target Leadership Roles",
        whatToDo: `Target roles such as ${primaryCareer.growthPath[0] || "Manager / Lead"}.`,
        whyItMatters: "Unlocks significant compensation growth and long-term strategic influence.",
        keyPoints: [
          "Position your achievements around revenue, efficiency, and team growth",
          "Negotiate total compensation including performance bonuses and equity"
        ]
      }
    ];
  }

  // 90-day Action Plan
  const actionPlan: ActionPlan90Days = {
    next7Days: [
      `Finalize your focus on ${primaryCareer.title} as your primary direction for the quarter`,
      "Review your current resume and note down missing keywords and proof points"
    ],
    next30Days: [
      `Start building competence in one priority skill: ${primarySkill}`,
      "Complete one small practical project or case study demonstrating your capability",
      "Update your LinkedIn headline to clearly reflect your target direction"
    ],
    next90Days: [
      "Finalize your portfolio proof with 2 polished case studies",
      educationRec.status === "useful_next_step"
        ? `Compare UGC-DEB entitled ${degreeName} universities and evaluate zero-cost EMI plans`
        : "Complete 1 recognized skill credential and begin targeted networking",
      `Start reaching out to alumni and hiring teams for ${primaryCareer.entryRoles[0] || "target"} openings`
    ]
  };

  // Next Best Move
  const nextBestMove = {
    headline: `Explore ${primaryCareer.title} & Build ${primarySkill}`,
    actionText: `Based on your profile, your next best move is to explore ${primaryCareer.title} and begin building practical ${primarySkill.toLowerCase()} skills while reviewing suitable ${educationRec.primaryDegreeName || "education"} pathways.`,
    primaryCtaLabel: educationRec.status === "useful_next_step" ? "Explore Recommended Programs" : "View Skill Roadmap",
    primaryCtaLink: educationRec.primaryDegreeSlug ? `/courses/${educationRec.primaryDegreeSlug}` : "/courses"
  };

  return {
    careerType,
    targetCareer: primaryCareer.title,
    stages,
    actionPlan,
    nextBestMove
  };
}
