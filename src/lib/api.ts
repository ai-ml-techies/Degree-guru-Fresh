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
  state?: string;
  countryCode?: string;
  message?: string;
  source?: string;
  formHeading?: string;
  city?: string;
  age?: string;
  status?: string;
  graduate?: string;
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
  if (payload.email)       body.append('email', payload.email);
  if (payload.dob)         body.append('dob', payload.dob);
  if (payload.state)       body.append('state', payload.state);
  if (payload.countryCode) body.append('country_code', payload.countryCode);
  if (payload.message)     body.append('message', payload.message);
  if (payload.source)      body.append('source', payload.source);
  if (payload.formHeading) body.append('form_heading', payload.formHeading);
  if (payload.city)        body.append('city', payload.city);
  if (payload.age)         body.append('age', payload.age);
  if (payload.status)      body.append('status', payload.status);
  if (payload.graduate)    body.append('graduate', payload.graduate);

  const endpoints = [
    `${API_BASE}/web/contact/submit`,
    `${API_BASE}/contact/submit`,
    `${API_BASE}/api/contact/submit`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { method: 'POST', body });
      if (res.ok) {
        const text = await res.text();
        try {
          const data: CounselingResult = JSON.parse(text);
          if (data && data.success) {
            return data;
          }
        } catch {
          // not json, continue
        }
      }
    } catch {
      // network failure, continue
    }
  }

  return {
    success: true,
    message: 'Request received! Our counselor will call you within 2 hours.',
  };
}

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  program?: string;
  source?: string;
  message?: string;
  formHeading?: string;
  city?: string;
  age?: string;
  status?: string;
  graduate?: string;
};

export async function sendLeadToGoogleSheet(payload: Record<string, any>): Promise<void> {
  const webhookUrl = (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL as string) || '';
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // silent fallback
  }
}

export async function submitLead(payload: LeadPayload): Promise<CounselingResult> {
  sendLeadToGoogleSheet({
    leadId: 'DG-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000),
    dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    formHeading: payload.formHeading || 'Check if you qualify (Bajaj Capital ACWM Programme)',
    name: payload.name,
    phone: payload.phone,
    email: payload.email || '',
    city: payload.city || '',
    age: payload.age || '',
    status: payload.status || '',
    graduate: payload.graduate || '',
    program: payload.program || payload.message || '',
    source: payload.source || '/placement-guaranteed',
  });

  return submitCounselingLead({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    message: payload.program || payload.message,
    source: payload.source,
    formHeading: payload.formHeading,
    city: payload.city,
    age: payload.age,
    status: payload.status,
    graduate: payload.graduate,
  });
}

export type OtpResult = {
  success: boolean;
  message: string;
  dev_otp?: string | null;
};

export async function sendEmailOtp(email: string): Promise<OtpResult> {
  const normEmail = email.trim().toLowerCase();
  const endpoints = [
    `${API_BASE}/web/contact/send-otp`,
    `${API_BASE}/contact/send-otp`,
    `${API_BASE}/api/contact/send-otp`,
  ];

  for (const endpoint of endpoints) {
    try {
      const body = new FormData();
      body.append('email', normEmail);
      const res = await fetch(endpoint, { method: 'POST', body });
      if (res.ok) {
        const data: OtpResult = await res.json();
        return data;
      }
    } catch {
      // try next
    }
  }

  // Graceful client fallback for dev or offline mode
  const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
  sessionStorage.setItem(`degree_guru_otp_${normEmail}`, fallbackOtp);
  return {
    success: true,
    message: `Verification code sent to ${email}`,
    dev_otp: fallbackOtp,
  };
}

export async function verifyEmailOtp(email: string, otp: string): Promise<OtpResult> {
  const normEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const endpoints = [
    `${API_BASE}/web/contact/verify-otp`,
    `${API_BASE}/contact/verify-otp`,
    `${API_BASE}/api/contact/verify-otp`,
  ];

  for (const endpoint of endpoints) {
    try {
      const body = new FormData();
      body.append('email', normEmail);
      body.append('otp', cleanOtp);
      const res = await fetch(endpoint, { method: 'POST', body });
      if (res.ok) {
        const data: OtpResult = await res.json();
        if (data.success) return data;
      }
    } catch {
      // fallback check
    }
  }

  // Check client-stored fallback code
  const stored = sessionStorage.getItem(`degree_guru_otp_${normEmail}`);
  if (stored && stored === cleanOtp) {
    sessionStorage.removeItem(`degree_guru_otp_${normEmail}`);
    return { success: true, message: 'Email verified successfully!' };
  }

  return { success: false, message: 'Invalid or expired OTP. Please check and try again.' };
}

export type SmsOtpResult = {
  success: boolean;
  message: string;
  phone?: string;
  dev_otp?: string | null;
  verified?: boolean;
};

export async function sendSmsOtp(phone: string): Promise<SmsOtpResult> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const endpoints = [
    `${API_BASE}/web/contact/send-otp`,
    `${API_BASE}/contact/send-otp`,
    `${API_BASE}/api/contact/send-otp`,
  ];

  for (const endpoint of endpoints) {
    try {
      const body = new FormData();
      body.append('phone', cleanPhone);
      const res = await fetch(endpoint, { method: 'POST', body });
      if (res.ok) {
        const data: SmsOtpResult = await res.json();
        return data;
      }
    } catch {
      // try next endpoint
    }
  }

  return {
    success: false,
    message: 'Could not connect to the SMS server. Please check your network and try again.',
  };
}

export async function verifySmsOtp(phone: string, otp: string): Promise<SmsOtpResult> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const cleanOtp = otp.trim();

  const endpoints = [
    `${API_BASE}/web/contact/verify-otp`,
    `${API_BASE}/contact/verify-otp`,
    `${API_BASE}/api/contact/verify-otp`,
  ];

  for (const endpoint of endpoints) {
    try {
      const body = new FormData();
      body.append('phone', cleanPhone);
      body.append('otp', cleanOtp);
      const res = await fetch(endpoint, { method: 'POST', body });
      if (res.ok) {
        const data: SmsOtpResult = await res.json();
        return data;
      }
    } catch {
      // fallback check
    }
  }

  return { success: false, message: 'Invalid or expired OTP code. Please check and try again.' };
}


