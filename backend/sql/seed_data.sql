-- =============================================================================
-- Degree Guru — Seed Data
-- =============================================================================

-- 1. Default Admin Users
INSERT INTO `users` (`id`, `username`, `auth_key`, `password_hash`, `email`, `status`, `created_at`, `updated_at`)
VALUES
  (1, 'admin', 'q9M3N8P1R4S7T2U5V8W0X3Y6Z9A2B5C8', '$2y$10$arinOo2xCdi6qh89U.WVCuFk.yGLH3tCLkx7t1qs3APctqmJ1FKkG', 'admin@degreeguru.in', 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (2, 'degreeguru', 'y8M2N5P9R3S6T1U4V7W9X2Y5Z8A1B4C7', '$2y$10$hYv/R29eTzfqVj2aQ76GVuO35L5m8OqE9zU6zZ2vD.g64c3r42bO.', 'kumaryashappy@gmail.com', 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP())
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `password_hash` = VALUES(`password_hash`);

-- RBAC Roles & Assignments
INSERT INTO `auth_item` (`name`, `type`, `description`, `created_at`, `updated_at`)
VALUES
  ('admin', 1, 'Administrator Role', UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  ('admin1', 1, 'Admin 1 Role', UNIX_TIMESTAMP(), UNIX_TIMESTAMP())
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

INSERT INTO `auth_assignment` (`item_name`, `user_id`, `created_at`)
VALUES
  ('admin', '2', UNIX_TIMESTAMP()),
  ('admin1', '2', UNIX_TIMESTAMP())
ON DUPLICATE KEY UPDATE `created_at` = VALUES(`created_at`);

-- 2. Initial Academic Programs
INSERT INTO `programs` (`id`, `slug`, `name`, `full_name`, `level`, `desc`, `tagline`, `about`, `enroll_for`, `emi_note`, `career_roles`, `career_salary`, `sort_order`, `is_active`)
VALUES
(1, 'online-ba', 'Online BA', 'Bachelor of Arts', 'Bachelors',
 'A flexible humanities degree for curious minds and creative careers.',
 'Study what you love. Build a career around it.',
 'An Online BA opens doors across writing, media, education, civil services and the creative industries. Choose specialisations like English, Psychology, Sociology, Political Science or History from India\'s leading universities, and study at your own pace, from anywhere.',
 '["Class 12 pass students wanting flexibility", "Working professionals returning to study", "Civil services aspirants building a strong base", "Creators and writers wanting a recognised degree"]',
 'Easy EMI options available, start your BA from as low as ₹3,500 per month.',
 '["Content Writer", "Civil Servant Aspirant", "Public Relations Officer", "Humanities Teacher"]', '₹3 - 6 LPA', 1, 1),

(2, 'online-bba', 'Online BBA', 'Bachelor of Business Administration', 'Bachelors',
 'Build your management foundations with a recognized online business degree.',
 'Become the manager every business is looking for.',
 'An Online BBA gives you a strong foundation in management, marketing, finance and operations. It is built for ambitious learners who want to step into business roles, run their own venture, or set the stage for an MBA.',
 '["Aspiring entrepreneurs and family business heirs", "Working professionals targeting team-lead roles", "Students planning to pursue an MBA next", "Sales and marketing executives upskilling"]',
 'Flexible EMI plans starting around ₹4,500 per month, no upfront pressure.',
 '["Business Analyst", "Marketing Executive", "Operations Manager", "HR Coordinator"]', '₹4 - 8 LPA', 2, 1),

(3, 'online-bca', 'Online BCA', 'Bachelor of Computer Applications', 'Bachelors',
 'Step into tech with a future-ready computer applications degree.',
 'Code your way into India\'s biggest tech opportunity.',
 'An Online BCA prepares you for software development, web technologies, data and IT roles. The curriculum mixes programming languages, databases and modern frameworks with project-based learning so you graduate with real, hireable skills.',
 '["Aspiring software developers and engineers", "Self-taught coders who want a formal degree", "Working IT support staff aiming for dev roles", "Students planning an MCA or tech masters later"]',
 'Pay in easy EMIs, many universities offer plans from ₹4,000 per month.',
 '["Full Stack Developer", "Software Engineer", "Database Administrator", "System Analyst"]', '₹4.5 - 9 LPA', 3, 1),

(4, 'online-bcom', 'Online BCom', 'Bachelor of Commerce', 'Bachelors',
 'Master accounting, finance and commerce, fully online.',
 'Numbers, business and money, your degree, your way.',
 'An Online BCom builds expertise in accounting, taxation, business law and finance. It is the ideal launchpad for careers in banking, audit, financial services and CA / CS preparation, while staying flexible enough for jobs and family.',
 '["CA / CS / CMA aspirants who want a parallel degree", "Banking and finance executives upskilling", "Family business owners formalising knowledge", "Class 12 commerce students wanting flexibility"]',
 'Affordable EMI plans, start your BCom for around ₹3,800 per month.',
 '["Financial Accountant", "Tax Consultant", "Audit Associate", "Investment Banker"]', '₹3.5 - 7 LPA', 4, 1),

(5, 'online-ma', 'Online MA', 'Master of Arts', 'Masters',
 'Deepen your expertise across literature, sociology, psychology and more.',
 'Specialise. Research. Lead conversations in your field.',
 'An Online MA lets you specialise in subjects like English, Psychology, Sociology, Public Policy or Education. Built for postgraduates who want academic depth without pausing their career, with research and dissertation tracks at top universities.',
 '["Educators and trainers seeking subject mastery", "UGC NET aspirants and research candidates", "Counsellors and therapists deepening expertise", "Civil services and policy aspirants"]',
 'Flexible EMIs available, many programs run from ₹4,500 per month.',
 '["Senior Content Strategist", "Clinical Psychologist", "University Lecturer", "Policy Analyst"]', '₹5 - 10 LPA', 5, 1),

(6, 'online-mba', 'Online MBA', 'Master of Business Administration', 'Masters',
 'Accelerate your career with a globally respected online MBA.',
 'The career accelerator working professionals trust.',
 'An Online MBA from a top Indian university is the fastest way to move into senior management, switch careers, or earn a serious salary jump. Specialise in Marketing, Finance, HR, Operations, Analytics or Product Management while continuing to work full-time.',
 '["Working professionals targeting promotions", "Career switchers moving into management", "Engineers and IT folks moving into product / strategy", "Founders and entrepreneurs scaling their venture"]',
 'No-cost EMI options at top universities, from ₹8,000 per month.',
 '["Product Manager", "Brand Manager", "Strategy Consultant", "Finance Director"]', '₹8 - 25 LPA', 6, 1),

(7, 'online-mca', 'Online MCA', 'Master of Computer Applications', 'Masters',
 'Advance into senior tech roles with a specialised MCA.',
 'Level up from developer to tech leader.',
 'An Online MCA is built for working tech professionals and BCA / BSc IT graduates who want to move into senior engineering, DevOps, cloud or AI roles. Combines deep computer science with current industry tools and projects.',
 '["Software developers targeting senior roles", "BCA / BSc IT graduates upskilling", "Working IT folks moving into AI / cloud", "Aspiring tech leads and architects"]',
 'Easy EMI plans starting around ₹6,500 per month, pay as you learn.',
 '["Lead Software Architect", "DevOps Engineer", "Data Scientist", "Engineering Manager"]', '₹7 - 18 LPA', 7, 1),

(8, 'online-mcom', 'Online MCom', 'Master of Commerce', 'Masters',
 'Specialise in finance, taxation and advanced commerce.',
 'Become the finance expert every company needs.',
 'An Online MCom is for graduates who want to specialise in advanced accounting, finance, taxation or international business. Designed to fit around full-time finance, banking and audit jobs.',
 '["BCom graduates targeting senior finance roles", "CA / CS / CMA students wanting an academic edge", "Bank officers and tax professionals upskilling", "Aspiring finance educators and researchers"]',
 'Flexible EMI plans, many universities offer from ₹5,000 per month.',
 '["Senior Finance Analyst", "Corporate Controller", "Forensic Auditor", "Portfolio Manager"]', '₹6 - 12 LPA', 8, 1),

(9, 'online-dba', 'Online DBA', 'Doctor of Business Administration', 'Doctoral',
 'An applied doctorate for senior leaders and consultants.',
 'The applied doctorate built for industry leaders.',
 'An Online DBA is the practitioner\'s doctorate, designed for senior managers, consultants and entrepreneurs who want to apply rigorous research to real business problems. Earn a respected doctoral title without leaving your role.',
 '["Senior leaders, VPs and CXOs", "Independent consultants and coaches", "Entrepreneurs scaling complex ventures", "Aspiring business school faculty"]',
 'Spread your investment over easy EMIs, flexible plans across partners.',
 '["Management Consultant", "Chief Executive Officer", "Executive Director", "Adjunct Professor"]', '₹15 - 40 LPA', 9, 1),

(10, 'phd', 'PhD', 'Doctor of Philosophy', 'Doctoral',
 'Pursue research at the highest level across disciplines.',
 'Become a recognised researcher in your field.',
 'A PhD is the highest academic qualification, built for serious researchers, future professors and subject experts. Pursue full-time or part-time tracks across management, sciences, humanities, engineering and social sciences from UGC-recognised universities.',
 '["Aspiring professors and university faculty", "Working professionals deep in their domain", "Researchers in policy, science and humanities", "Subject experts seeking the highest credential"]',
 'Flexible fee plans and EMI options available, talk to us for details.',
 '["Research Scientist", "University Professor", "Senior Policy Fellow", "R&D Director"]', '₹10 - 25 LPA', 10, 1),

(11, 'certifications', 'Certifications', 'Certification Courses', 'Skills',
 'Short, focused courses to upskill in months, not years.',
 'Learn one skill. Land one job. In months, not years.',
 'Short, intense online certifications in high-demand areas, Digital Marketing, Data Analytics, AI & ML, UX Design, Product Management, Finance and more. Built for fast outcomes and immediate career impact.',
 '["Working professionals making a fast pivot", "Students adding industry-ready skills", "Freelancers building proof of expertise", "Anyone wanting a quick, focused upgrade"]',
 'Most certifications support easy EMIs, start from a few thousand a month.',
 '["AI Specialist", "Digital Marketing Lead", "UX Designer", "Data Analyst"]', '₹5 - 12 LPA', 11, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Initial Site Settings
INSERT INTO `site_settings` (`key`, `value`)
VALUES
  ('hero_title', 'India''s #1 Online Degree & Career Counseling Platform'),
  ('hero_subtitle', 'Compare 100+ UGC-approved online degree programs from India''s top universities. Get 1-on-1 expert guidance, fee comparisons, and no-cost EMI.'),
  ('contact_phone', '+91 98765 43210'),
  ('contact_email', 'info@degreeguru.in'),
  ('stats_students_counseled', '50,000+'),
  ('stats_universities_partnered', '50+'),
  ('stats_programs_offered', '120+')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- 4. Sample Employer and Job Posting
INSERT INTO `job_employers` (`id`, `company_name`, `company_industry`, `employee_count`, `company_address`, `company_description`, `company_website`, `document_filename`, `document_original`, `contact_name`, `contact_phone`, `contact_email`, `status`)
VALUES
  (1, 'TechCorp Solutions', 'Information Technology', '250-500', 'Bengaluru, Karnataka', 'Leading cloud and AI consulting company helping enterprises modernize infrastructure.', 'https://techcorpsolutions.com', 'doc_101.pdf', 'incorporation_cert.pdf', 'Priya Sharma', '+91 9876543211', 'hr@techcorpsolutions.com', 1)
ON DUPLICATE KEY UPDATE `company_name` = VALUES(`company_name`);

INSERT INTO `job_postings` (`id`, `employer_id`, `job_title`, `job_category`, `job_location`, `work_type`, `experience_required`, `salary_range`, `industry`, `skills_required`, `job_description`, `openings`, `status`)
VALUES
  (1, 1, 'Frontend Software Engineer', 'Engineering', 'Bengaluru / Remote', 'Full-time', '1-3 years', '₹6,00,000 - ₹9,00,000', 'Information Technology', 'React, TypeScript, Tailwind CSS, REST APIs', 'We are looking for a passionate Frontend Software Engineer to build and scale responsive web applications.', 3, 1),
  (2, 1, 'Business Development Associate', 'Sales', 'Delhi NCR / Hybrid', 'Full-time', '0-2 years', '₹4,00,000 - ₹6,50,000', 'Education Technology', 'Communication, Negotiation, Lead Management, CRM', 'Join our sales team to advise learners on higher education and certification programs.', 5, 1)
ON DUPLICATE KEY UPDATE `job_title` = VALUES(`job_title`);
