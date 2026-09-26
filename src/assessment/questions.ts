import { AssessmentQuestion } from "./types";

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── ONBOARDING & CONTEXT ──
  {
    id: "user_stage",
    section: "stage_goal",
    title: "Let's start with where you are right now.",
    subtitle: "This helps us tailor recommendations, degrees, and your roadmap to your exact situation.",
    type: "single_choice",
    options: [
      { text: "Class 10 Student", description: "Exploring initial stream and career possibilities", weights: { challenges: ["stream_selection"] } },
      { text: "Class 11–12 Student", description: "Preparing for college entrance and degree decisions", weights: { challenges: ["college_selection"] } },
      { text: "College Student", description: "Currently pursuing a bachelor's or diploma degree", weights: { challenges: ["internships_skills"] } },
      { text: "Bachelor's Completed", description: "Recently graduated, planning your first career move or master's", weights: { challenges: ["first_job_entry"] } },
      { text: "Master's Completed", description: "Looking to accelerate your specialized career growth", weights: { challenges: ["career_acceleration"] } },
      { text: "Working Professional", description: "Employed and looking for promotions, increments or leadership", weights: { challenges: ["promotions_growth"] } },
      { text: "Looking for a Job", description: "Actively seeking a relevant job or career breakthrough", weights: { challenges: ["job_hunting"] } },
      { text: "Thinking About Changing Careers", description: "Want to switch domains or industries safely", weights: { challenges: ["career_switch"] } },
      { text: "Not Sure Yet", description: "Open to exploring all viable pathways", weights: { challenges: ["general_confusion"] } },
    ]
  },
  {
    id: "user_goal",
    section: "stage_goal",
    title: "What are you hoping to get from this?",
    subtitle: "Select the primary outcome that matters most to you today.",
    type: "single_choice",
    options: [
      { text: "Find a career direction", description: "Gain clarity on which industries and roles match who I am", weights: { challenges: ["lack_of_direction"] } },
      { text: "Choose what to study", description: "Decide on subjects, majors, or undergraduate specializations", weights: { challenges: ["study_choice"] } },
      { text: "Choose my next degree", description: "Evaluate whether an Online MBA, MCA, or Master's will boost my career", weights: { challenges: ["degree_selection"] } },
      { text: "Find better career opportunities", description: "Earn higher compensation, better perks, and faster promotions", weights: { values: ["Income", "Growth"] } },
      { text: "Change careers", description: "Transition from my current domain into high-growth technology or business", weights: { challenges: ["domain_shift"] } },
      { text: "Understand my strengths", description: "Discover what I naturally do well and where I can develop", weights: { values: ["Learning"] } },
      { text: "Build the right skills", description: "Find out the exact practical skills employers are looking for", weights: { values: ["Learning", "Growth"] } },
      { text: "I'm simply confused about what to do next", description: "Need an objective, step-by-step roadmap to move forward", weights: { challenges: ["overwhelmed"] } },
    ]
  },

  // ── SECTION 1: INTERESTS & NATURAL CURIOSITY (RIASEC) ──
  {
    id: "riasec_q1",
    section: "interests",
    title: "Which sounds more satisfying to spend an afternoon doing?",
    subtitle: "Choose the activity you would naturally gravitate toward.",
    type: "forced_choice",
    options: [
      {
        text: "Finding out why a complex system or dataset isn't working",
        weights: { riasec: { EXPLORE_SOLVE: 10 }, strengths: { analytical_thinking: 10, problem_solving: 10 } }
      },
      {
        text: "Convincing people to support a new business idea or initiative",
        weights: { riasec: { LEAD_INFLUENCE: 10 }, strengths: { leadership: 10, communication: 10 } }
      }
    ]
  },
  {
    id: "riasec_q2",
    section: "interests",
    title: "When you join a new project, what role feels most exciting?",
    subtitle: "Think about where your energy naturally goes.",
    type: "single_choice",
    options: [
      { text: "Building the physical or technical prototype and making it work", weights: { riasec: { BUILD_DO: 10 }, strengths: { execution: 10 } } },
      { text: "Analyzing the market data, research reports, and technical facts", weights: { riasec: { EXPLORE_SOLVE: 10 }, strengths: { analytical_thinking: 10 } } },
      { text: "Designing the visual identity, user interface, or creative concept", weights: { riasec: { CREATE_EXPRESS: 10 }, strengths: { creativity: 10 } } },
      { text: "Mentoring team members, listening to feedback, and helping teammates", weights: { riasec: { HELP_CONNECT: 10 }, strengths: { relationship_building: 10 } } },
      { text: "Pitching the vision to leadership, setting targets, and driving results", weights: { riasec: { LEAD_INFLUENCE: 10 }, strengths: { leadership: 10, initiative: 10 } } },
      { text: "Organizing timelines, tracking spreadsheets, and setting up workflows", weights: { riasec: { ORGANISE_STRUCTURE: 10 }, strengths: { organisation: 10, attention_to_detail: 10 } } }
    ]
  },
  {
    id: "riasec_q3",
    section: "interests",
    title: "You are given a free weekend to read or learn anything. What topic do you click on first?",
    subtitle: "Honest curiosity beats what you think you 'should' learn.",
    type: "single_choice",
    options: [
      { text: "How modern machines, hardware, robotics, or cloud servers work", weights: { riasec: { BUILD_DO: 8 }, strengths: { learning_agility: 8 } } },
      { text: "A deep investigative breakdown of economic trends or scientific puzzles", weights: { riasec: { EXPLORE_SOLVE: 8 }, strengths: { analytical_thinking: 8 } } },
      { text: "Storytelling, digital art, video production, or aesthetic design trends", weights: { riasec: { CREATE_EXPRESS: 8 }, strengths: { creativity: 8 } } },
      { text: "Psychology, community development, education, or coaching others", weights: { riasec: { HELP_CONNECT: 8 }, strengths: { communication: 8 } } },
      { text: "Startup case studies, revenue models, investment deals, and leadership biographies", weights: { riasec: { LEAD_INFLUENCE: 8 }, strengths: { initiative: 8 } } },
      { text: "Personal finance systems, Excel automation, productivity tools, and legal compliance", weights: { riasec: { ORGANISE_STRUCTURE: 8 }, strengths: { organisation: 8 } } }
    ]
  },
  {
    id: "riasec_q4",
    section: "interests",
    title: "Between these two tasks, which feels more energising?",
    type: "forced_choice",
    options: [
      { text: "Creating an original presentation or visual concept from scratch", weights: { riasec: { CREATE_EXPRESS: 9 }, strengths: { creativity: 9 } } },
      { text: "Setting up a clear, systematic tracking sheet to ensure zero mistakes", weights: { riasec: { ORGANISE_STRUCTURE: 9 }, strengths: { attention_to_detail: 9, organisation: 9 } } }
    ]
  },
  {
    id: "riasec_q5",
    section: "interests",
    title: "Which environment would you prefer to spend your workday in?",
    type: "forced_choice",
    options: [
      { text: "A workshop, lab, or code studio where tangible things get built", weights: { riasec: { BUILD_DO: 9 }, workStyle: { deepWork: 8 } } },
      { text: "A buzzing team room where you are brainstorming and helping people thrive", weights: { riasec: { HELP_CONNECT: 9 }, workStyle: { collaborative: 8 } } }
    ]
  },

  // ── SECTION 2: SCENARIOS & STRENGTH INDICATORS ──
  {
    id: "scenario_q1",
    section: "strengths",
    title: "You receive an ambiguous problem with no clear instructions or manual. What do you naturally do first?",
    subtitle: "Your first reaction reveals your primary problem-solving muscle.",
    type: "single_choice",
    options: [
      { text: "Break the problem down into structured, logical sub-components", weights: { strengths: { analytical_thinking: 12, problem_solving: 10 } } },
      { text: "Research existing case studies and documentation until I grasp the fundamentals", weights: { strengths: { learning_agility: 12, analytical_thinking: 8 } } },
      { text: "Ask diverse teammates and seniors for their perspectives and insights", weights: { strengths: { relationship_building: 10, communication: 10 } } },
      { text: "Start testing small, quick experiments to see what works practically", weights: { strengths: { initiative: 12, execution: 10 } } },
      { text: "Create an organized step-by-step checklist to avoid chaos", weights: { strengths: { organisation: 12, attention_to_detail: 8 } } },
      { text: "Step up to assign responsibilities so the team doesn't stall", weights: { strengths: { leadership: 12, decision_making: 10 } } }
    ]
  },
  {
    id: "scenario_q2",
    section: "strengths",
    title: "A key deadline is in 24 hours and an unexpected glitch puts the whole project at risk. How do you respond?",
    type: "single_choice",
    options: [
      { text: "Stay calm, rapidly diagnose the exact bottleneck, and isolate the cause", weights: { strengths: { problem_solving: 12, analytical_thinking: 10, adaptability: 10 } } },
      { text: "Rally the team, align everyone on urgent priorities, and keep morale high", weights: { strengths: { leadership: 12, communication: 10 } } },
      { text: "Come up with an ingenious workaround that bypasses the broken piece", weights: { strengths: { creativity: 12, problem_solving: 10 } } },
      { text: "Put my head down, roll up my sleeves, and grind through the execution", weights: { strengths: { execution: 12, initiative: 10 } } }
    ]
  },
  {
    id: "scenario_q3",
    section: "strengths",
    title: "When communicating an important update to seniors or clients, what is your biggest priority?",
    type: "single_choice",
    options: [
      { text: "Ensuring every single number, metric, and fact is 100% accurate and audited", weights: { strengths: { attention_to_detail: 12, analytical_thinking: 8 } } },
      { text: "Delivering a clear, concise executive summary that drives a fast decision", weights: { strengths: { communication: 12, decision_making: 10 } } },
      { text: "Building genuine rapport and understanding their unstated emotional needs", weights: { strengths: { relationship_building: 12, communication: 8 } } },
      { text: "Inspiring excitement about the future vision and potential impact", weights: { strengths: { leadership: 12, creativity: 8 } } }
    ]
  },
  {
    id: "scenario_q4",
    section: "strengths",
    title: "Your team is divided between two completely opposing strategies. What is your instinct?",
    type: "single_choice",
    options: [
      { text: "Gather objective data and run a pilot test to let facts decide", weights: { strengths: { analytical_thinking: 10, decision_making: 10 } } },
      { text: "Facilitate a constructive debate and build consensus among opposing members", weights: { strengths: { relationship_building: 10, communication: 10 } } },
      { text: "Make a firm, calculated call and commit the team to execute decisively", weights: { strengths: { leadership: 12, decision_making: 12 } } },
      { text: "Propose a hybrid creative solution that captures the best of both", weights: { strengths: { creativity: 10, adaptability: 10 } } }
    ]
  },
  {
    id: "scenario_q5",
    section: "strengths",
    title: "When you must master an entirely new software or industry topic in 7 days, how do you approach it?",
    type: "single_choice",
    options: [
      { text: "Immerse myself in core documentation, tutorials, and reverse-engineer it", weights: { strengths: { learning_agility: 12, analytical_thinking: 8 } } },
      { text: "Immediately start building a mini-project hands-on and learn through trial & error", weights: { strengths: { initiative: 12, learning_agility: 10 } } },
      { text: "Find an expert or mentor and ask targeted questions to skip the learning curve", weights: { strengths: { relationship_building: 10, communication: 10 } } },
      { text: "Create an organized syllabus with dedicated timeblocks and notes", weights: { strengths: { organisation: 12, execution: 8 } } }
    ]
  },

  // ── SECTION 3: WORK STYLE PREFERENCES ──
  {
    id: "workstyle_q1",
    section: "workstyle",
    title: "How do you prefer to do your best thinking?",
    type: "forced_choice",
    options: [
      { text: "Independently — having uninterrupted time to focus deeply before sharing", weights: { workStyle: { deepWork: 10, independent: 10 } } },
      { text: "Collaboratively — bouncing ideas out loud with energetic teammates", weights: { workStyle: { collaborative: 10, highInteraction: 10 } } }
    ]
  },
  {
    id: "workstyle_q2",
    section: "workstyle",
    title: "What type of workflow gives you the greatest peace of mind?",
    type: "forced_choice",
    options: [
      { text: "Structured: Clear processes, defined milestones, and predictable standards", weights: { workStyle: { structured: 10, predictable: 8 } } },
      { text: "Flexible: Fluid priorities, room for spontaneity, and freedom to change approach", weights: { workStyle: { flexible: 10, entrepreneurial: 8 } } }
    ]
  },
  {
    id: "workstyle_q3",
    section: "workstyle",
    title: "Which project would you naturally pick?",
    type: "forced_choice",
    options: [
      { text: "A specialized project where I become the go-to technical expert on one key topic", weights: { workStyle: { specialist: 10 } } },
      { text: "A multidisciplinary project where I wear many different hats across teams", weights: { workStyle: { generalist: 10 } } }
    ]
  },
  {
    id: "workstyle_q4",
    section: "workstyle",
    title: "When it comes to professional risk, which statement fits you best?",
    type: "forced_choice",
    options: [
      { text: "I prefer calculated, stable paths where downside risks are protected", weights: { workStyle: { riskCautious: 10 }, values: ["Stability", "Security"] } },
      { text: "I enjoy ambitious, high-upside opportunities even if failure is a real possibility", weights: { workStyle: { riskTolerant: 10 }, values: ["Growth", "Entrepreneurship"] } }
    ]
  },
  {
    id: "workstyle_q5",
    section: "workstyle",
    title: "Where do you feel you create the most value?",
    type: "forced_choice",
    options: [
      { text: "Strategic planning — deciding WHAT we should build, why, and where we are heading", weights: { workStyle: { strategic: 10 } } },
      { text: "Flawless execution — getting down into the details and getting it done on time", weights: { workStyle: { execution: 10 } } }
    ]
  },

  // ── SECTION 4: CAREER VALUES & CORE MOTIVATION ──
  {
    id: "values_q1",
    section: "values_motivation",
    title: "Rank your highest personal priority in your work life:",
    subtitle: "There are no wrong answers; choose what truly drives your personal satisfaction.",
    type: "single_choice",
    options: [
      { text: "Continuous Learning & Intellectual Growth", weights: { values: ["Learning"], motivation: ["Mastery", "Exploration"] } },
      { text: "High Financial Compensation & Wealth Creation", weights: { values: ["Income", "Growth"], motivation: ["Achievement", "Security"] } },
      { text: "Long-term Job Security & Predictability", weights: { values: ["Stability"], motivation: ["Security"] } },
      { text: "Autonomy, Flexibility & Creative Freedom", weights: { values: ["Freedom", "Flexibility"], motivation: ["Autonomy"] } },
      { text: "Creating Meaningful Social Impact & Helping People", weights: { values: ["Impact"], motivation: ["Purpose", "Contribution"] } },
      { text: "Leadership, Influence & Organizational Prestige", weights: { values: ["Leadership", "Prestige"], motivation: ["Recognition", "Competition"] } },
      { text: "Healthy Work-Life Harmony & Personal Time", weights: { values: ["Work-life balance"], motivation: ["Autonomy"] } }
    ]
  },
  {
    id: "values_q2",
    section: "values_motivation",
    title: "Imagine you are offered two distinct opportunities. Which would you accept?",
    type: "forced_choice",
    options: [
      { text: "A stable role in a respected established brand with predictable hours and clear benefits", weights: { values: ["Stability", "Prestige"], motivation: ["Security"] } },
      { text: "A high-growth role in an emerging domain with rapid learning and uncapped upside", weights: { values: ["Growth", "Entrepreneurship"], motivation: ["Achievement", "Exploration"] } }
    ]
  },
  {
    id: "values_q3",
    section: "values_motivation",
    title: "What makes you feel most proud at the end of a long work week?",
    type: "single_choice",
    options: [
      { text: "Seeing a client, student, or colleague say: 'Thank you, this changed everything for me'", weights: { values: ["Impact"], motivation: ["Contribution", "Purpose"] } },
      { text: "Mastering a difficult new skill that very few people know how to do", weights: { values: ["Learning"], motivation: ["Mastery"] } },
      { text: "Beating a competitive sales or revenue milestone ahead of schedule", weights: { values: ["Income", "Growth"], motivation: ["Achievement", "Competition"] } },
      { text: "Having built something reliable and stable with zero downtime or errors", weights: { values: ["Stability"], motivation: ["Mastery", "Security"] } }
    ]
  },

  // ── SECTION 5: CAREER CONFIDENCE & CHALLENGES ──
  {
    id: "confidence_q1",
    section: "confidence_challenges",
    title: "How confident do you feel in presenting complex ideas to senior leaders or large audiences?",
    subtitle: "Remember: Confidence is not fixed ability; it's simply what you feel right now.",
    type: "single_choice",
    options: [
      { text: "Very confident — I enjoy public speaking and presenting with poise", weights: { confidence: { presentation: 10 } } },
      { text: "Moderate — I can do it fine once I prepare thoroughly", weights: { confidence: { presentation: 6 } } },
      { text: "Confidence to build — My ideas are often stronger than my speaking confidence", weights: { confidence: { presentation: 2 }, challenges: ["executive_communication"] } }
    ]
  },
  {
    id: "confidence_q2",
    section: "confidence_challenges",
    title: "How clear is your personal understanding of what modern employers in your target field look for?",
    type: "single_choice",
    options: [
      { text: "Crystal clear — I know the exact tools, resumes, and interview standards required", weights: { confidence: { industry_standards: 10 } } },
      { text: "Partially clear — I understand the basics but feel unsure about real expectations", weights: { confidence: { industry_standards: 5 }, challenges: ["employer_expectations"] } },
      { text: "Confusing — I feel the job market changes too fast and job descriptions feel unrealistic", weights: { confidence: { industry_standards: 2 }, challenges: ["employer_expectations", "skills_gap"] } }
    ]
  },
  {
    id: "challenges_q1",
    section: "confidence_challenges",
    title: "Which of these practical challenges feels most relevant to your life right now?",
    subtitle: "Select the bottleneck that holds you back the most.",
    type: "single_choice",
    options: [
      { text: "I don't know which specific career path suits my personality and market reality", weights: { challenges: ["career_clarity"] } },
      { text: "I know what I want to achieve, but I don't know the step-by-step roadmap to get there", weights: { challenges: ["execution_roadmap"] } },
      { text: "I have good skills, but I struggle to prove them on my resume or in interviews", weights: { challenges: ["resume_portfolio"] } },
      { text: "I am worried about choosing the wrong degree or wasting money on formal education", weights: { challenges: ["degree_roi"] } },
      { text: "I am working full-time and need a flexible, accredited way to upskill without quitting my job", weights: { challenges: ["flexible_education", "time_management"] } },
      { text: "I want to transition from my current field into a high-paying business or tech role", weights: { challenges: ["career_switch"] } }
    ]
  },

  // ── SECTION 6: ADAPTIVE DEPTH QUESTIONS ──
  {
    id: "adaptive_analytical_1",
    section: "strengths",
    adaptiveTag: "analytical",
    title: "When looking at a company's performance, what catches your attention first?",
    type: "single_choice",
    options: [
      { text: "The underlying financial and operational margins", weights: { strengths: { analytical_thinking: 10 }, riasec: { ORGANISE_STRUCTURE: 8 } } },
      { text: "Customer retention metrics, churn rates, and cohort analysis", weights: { strengths: { analytical_thinking: 10, problem_solving: 10 } } },
      { text: "The company's brand positioning and storytelling", weights: { strengths: { creativity: 8 }, riasec: { CREATE_EXPRESS: 8 } } },
      { text: "The executive team's vision and hiring pace", weights: { strengths: { leadership: 8 }, riasec: { LEAD_INFLUENCE: 8 } } }
    ]
  },
  {
    id: "adaptive_creative_1",
    section: "strengths",
    adaptiveTag: "creative",
    title: "When an idea you proposed doesn't get approved, what is your reaction?",
    type: "single_choice",
    options: [
      { text: "Reframe the pitch with fresh creative visuals and different angles", weights: { strengths: { creativity: 10, communication: 8 } } },
      { text: "Analyze the objective data to address each specific objection rationally", weights: { strengths: { analytical_thinking: 10 } } },
      { text: "Gather more feedback from supporters to build stronger coalition support", weights: { strengths: { relationship_building: 10, leadership: 8 } } },
      { text: "Move on quickly to the next innovative experiment", weights: { strengths: { adaptability: 10, initiative: 8 } } }
    ]
  },
  {
    id: "adaptive_enterprising_1",
    section: "strengths",
    adaptiveTag: "enterprising",
    title: "If given a budget of ₹10 Lakhs to start a small initiative, what would you launch?",
    type: "single_choice",
    options: [
      { text: "A digital agency or tech service leveraging skilled remote talent", weights: { riasec: { LEAD_INFLUENCE: 10 }, values: ["Income", "Growth"] } },
      { text: "A product prototype solving an everyday consumer pain point", weights: { riasec: { BUILD_DO: 8, EXPLORE_SOLVE: 8 }, strengths: { problem_solving: 10 } } },
      { text: "A media, community, or educational platform with engaging content", weights: { riasec: { CREATE_EXPRESS: 8, HELP_CONNECT: 8 }, values: ["Impact"] } },
      { text: "A structured, secure distribution or supply chain franchise", weights: { riasec: { ORGANISE_STRUCTURE: 10 }, values: ["Stability"] } }
    ]
  },
  {
    id: "adaptive_social_1",
    section: "strengths",
    adaptiveTag: "social",
    title: "When a colleague is underperforming, how do you handle it?",
    type: "single_choice",
    options: [
      { text: "Sit down one-on-one, understand their personal blockers, and co-create an action plan", weights: { strengths: { relationship_building: 12, leadership: 10 } } },
      { text: "Review their daily KPIs and deliverables with structured benchmarks", weights: { strengths: { organisation: 10, attention_to_detail: 8 } } },
      { text: "Provide them with training resources and documentation to upskill", weights: { strengths: { learning_agility: 8, execution: 8 } } }
    ]
  }
];
