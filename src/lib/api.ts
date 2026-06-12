const API_BASE = import.meta.env.VITE_API_BASE as string;

export type HomeContent = Record<string, string>;

export async function fetchHomeContent(): Promise<HomeContent> {
  try {
    const res = await fetch(`${API_BASE}/api/home`);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Failed to fetch home content: ${res.status} ${res.statusText} ${body}`);
    }
    return res.json();
  } catch (err) {
    console.error('fetchHomeContent error', { API_BASE, error: err });
    throw err;
  }
}

export type ApiProgram = {
  id: number;
  slug: string;
  name: string;
  full: string;
  level: 'Bachelors' | 'Masters' | 'Doctoral' | 'Skills';
  desc: string;
  tagline: string;
  about: string;
  enrollFor: string[];
  emiNote: string;
  careerRoles: string[];
  careerSalary: string;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  focusKeyword: string | null;
};

export async function fetchPrograms(): Promise<ApiProgram[]> {
  const res = await fetch(`${API_BASE}/api/programs`);
  if (!res.ok) throw new Error('Failed to fetch programs');
  return res.json();
}

export type CounselingPayload = {
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  message?: string;
  source?: string;
};

export type CounselingResult = {
  success: boolean;
  message: string;
  errors?: string[];
};

// ─── Jobs API ────────────────────────────────────────────────────────────────

export type JobPosting = {
  id: number;
  jobTitle: string;
  jobCategory: string;
  jobLocation: string;
  workType: string;
  workTypeLabel: string;
  experienceRequired: string;
  salaryRange: string;
  industry: string;
  skillsRequired: string;
  jobDescription: string;
  openings: number;
  applyLink: string;
  companyName: string;
  companyIndustry: string;
  postedAt: string;
};

export type JobFilters = {
  q?: string;
  location?: string;
  work_type?: string;
  industry?: string;
  experience?: string;
};

export async function fetchJobListings(filters?: JobFilters): Promise<JobPosting[]> {
  const qs = filters ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))) : '';
  const res = await fetch(`${API_BASE}/jobs/listings${qs}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export type JobSubmitResult = {
  success: boolean;
  message: string;
  errors?: string[];
};

export async function submitEmployerJob(data: FormData): Promise<JobSubmitResult> {
  const res = await fetch(`${API_BASE}/jobs/employer/submit`, { method: 'POST', body: data });
  return res.json();
}

export type SeekerResult = {
  success: boolean;
  seekerId?: number;
  message: string;
  errors?: string[];
};

export async function registerJobSeeker(data: FormData): Promise<SeekerResult> {
  const res = await fetch(`${API_BASE}/jobs/seeker/register`, { method: 'POST', body: data });
  return res.json();
}

export async function applyToJob(postingId: number, seekerId: number): Promise<JobSubmitResult> {
  const res = await fetch(`${API_BASE}/jobs/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posting_id: postingId, seeker_id: seekerId }),
  });
  return res.json();
}

export async function submitCounselingLead(payload: CounselingPayload): Promise<CounselingResult> {
  const body = new FormData();
  body.append('name', payload.name);
  body.append('phone', payload.phone);
  if (payload.email)   body.append('email',   payload.email);
  if (payload.dob)     body.append('dob',     payload.dob);
  if (payload.message) body.append('message', payload.message);
  if (payload.source)  body.append('source',  payload.source);

  const res = await fetch(`${API_BASE}/contact/submit`, { method: 'POST', body });
  const data: CounselingResult = await res.json();
  return data;
}
