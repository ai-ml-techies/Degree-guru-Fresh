import { useState, useId, useMemo, useEffect } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  UNIVERSITIES, 
  ACTIVE_ONLINE_UNIVERSITIES, 
  EXECUTIVE_PARTNERS, 
  INCLUDED_PARTNERS 
} from "@/data/universities";
import { COURSES } from "@/data/courses";
import { getUniversityCampusImage } from "@/data/universityCampusImages";
import { UniversityLogo } from "@/components/UniversityLogo";
import { 
  AMITY_JULY_26_FEE_STRUCTURE, 
  AmityProgramFee 
} from "@/data/amityFeeStructure";
import { getCertificationsForUniversity } from "@/data/universityCertifications";
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  MapPin, 
  Award, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Star,
  Check,
  Calendar,
  Users,
  Briefcase,
  Layers,
  FileText,
  UserCheck,
  Search,
  ZoomIn,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Laptop,
  Smartphone,
  Bot,
  MousePointerClick,
  Compass,
  Headphones,
  FileCheck,
  Calculator
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UniqueProgramItem {
  id: string;
  name: string;
  fullName: string;
  levelKey: "ug" | "pg" | "integrated" | "collaborative";
  degreeLevel: string;
  slug: string;
  duration: string;
  eligibility: string;
  tuitionFee: number;
  semesterFee: number;
  specializations: string[];
  industryPartner?: string;
  thumbnail: string;
}

const UNIQUE_AMITY_PROGRAMS: UniqueProgramItem[] = [
  // ── PG COURSES (Unique Master Degrees) ──
  {
    id: "amity-pg-mba",
    name: "Online MBA",
    fullName: "Online Master of Business Administration",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mba",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree with min 50% marks (45% for reserved)",
    tuitionFee: 207000,
    semesterFee: 56300,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Dual Specialization (Marketing, Finance, HR, IT, Operations)",
      "Hospital & Healthcare Management (HHM)",
      "Digital Marketing & E-Commerce",
      "Business Analytics & Data Science",
      "International Finance & Global Accounting (ACCA)",
      "Human Resource Management",
      "Operations & Supply Chain Management",
      "Information Technology (IT) Management",
      "Banking, Financial Services & Insurance (BFSI)",
      "Retail Operations Management (with Lenskart)",
      "Entrepreneurship & Leadership",
      "International Business",
      "General Management",
    ],
  },
  {
    id: "amity-pg-mca",
    name: "Online MCA",
    fullName: "Online Master of Computer Applications",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mca",
    duration: "2 Years (4 Sems)",
    eligibility: "BCA / B.Sc (IT/CS) or Bachelor's with Mathematics",
    tuitionFee: 183080,
    semesterFee: 49800,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "General (Advanced Distributed Systems & Web Architecture)",
      "Cybersecurity & Cloud Architecture (with HCLTech)",
      "Software Engineering & DevOps (with HCLTech)",
      "AR/VR Development & Spatial Computing (with TCS iON)",
      "Machine Learning & Artificial Intelligence (with TCS iON)",
      "FinTech Systems & Blockchain",
    ],
  },
  {
    id: "amity-pg-mcom",
    name: "Online M.Com",
    fullName: "Online Master of Commerce (Financial Management)",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mcom",
    duration: "2 Years (4 Sems)",
    eligibility: "B.Com / BBA / Economics graduate",
    tuitionFee: 138000,
    semesterFee: 37500,
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Financial Management (FM)",
      "International Finance & Trade",
      "Corporate Accounting & Auditing",
      "Banking & Insurance Management",
    ],
  },
  {
    id: "amity-pg-ma",
    name: "Online MA",
    fullName: "Online Master of Arts (Journalism & Public Policy)",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-ma",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree in any discipline",
    tuitionFee: 138000,
    semesterFee: 37500,
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Journalism & Mass Communication (MA-JMC)",
      "Public Policy & Governance (MA-PPG)",
      "English Literature & Critical Studies",
      "Psychology & Behavioral Sciences",
    ],
  },
  {
    id: "amity-pg-msc",
    name: "Online M.Sc",
    fullName: "Online Master of Science (Data Science)",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-msc",
    duration: "2 Years (4 Sems)",
    eligibility: "B.Sc/BCA/B.Tech or Bachelor's with Math/Stats",
    tuitionFee: 253000,
    semesterFee: 68800,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Data Science & Big Data Analytics",
      "Applied Machine Learning & Artificial Intelligence",
      "Applied Mathematics & Computational Statistics",
    ],
  },

  // ── UG COURSES (Unique Bachelor Degrees) ──
  {
    id: "amity-ug-bba",
    name: "Online BBA",
    fullName: "Online Bachelor of Business Administration",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bba",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board with min 45% marks",
    tuitionFee: 175120,
    semesterFee: 33200,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "General Business Management",
      "Digital Marketing & Brand Strategy",
      "Banking & Financial Services",
      "Human Resource Management",
      "Retail & Operations Management (with Lenskart)",
      "Data Analytics for Business (with HCLTech)",
      "Business Analytics Program (with KPMG)",
    ],
  },
  {
    id: "amity-ug-bca",
    name: "Online BCA",
    fullName: "Online Bachelor of Computer Applications",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bca",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 with Mathematics / Computer or Bridge Course",
    tuitionFee: 154000,
    semesterFee: 29200,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "General Software Development",
      "Data Engineering (with HCLTech)",
      "Software Engineering & Agile (with HCLTech)",
      "Cloud Security Architecture (with TCS iON)",
      "Data Analytics & BI (with TCS iON)",
      "Advanced Data Engineering (with KPMG)",
      "FinTech & Financial Technologies",
      "Full Stack Web Development",
    ],
  },
  {
    id: "amity-ug-bcom",
    name: "Online B.Com",
    fullName: "Online Bachelor of Commerce",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bcom",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 101200,
    semesterFee: 19200,
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "General Commerce & Accounting",
      "B.Com (Honors)",
      "International Accounting (ACCA UK Accredited)",
      "Banking & Financial Services",
      "Vernacular Medium (Regional Languages)",
    ],
  },
  {
    id: "amity-ug-ba",
    name: "Online BA",
    fullName: "Online Bachelor of Arts",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-ba",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 101200,
    semesterFee: 19200,
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "General Humanities (History, Pol Sci, Sociology)",
      "Journalism & Mass Communication (BA-JMC)",
      "English Literature",
      "Vernacular Medium",
    ],
  },

  // ── INTEGRATED DUAL DEGREE ──
  {
    id: "amity-int-bba-mba",
    name: "Integrated BBA - MBA",
    fullName: "Integrated Bachelor of Business Administration - Master of Business Administration",
    levelKey: "integrated",
    degreeLevel: "Integrated Dual Degree",
    slug: "online-mba",
    duration: "4.5 to 5 Years (Dual Degree)",
    eligibility: "10+2 from recognized board with min 50% marks",
    tuitionFee: 370570,
    semesterFee: 67200,
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Marketing Management Dual Track",
      "Financial Management Dual Track",
      "Human Resource Management Track",
      "Business Analytics Dual Track",
    ],
  },
  {
    id: "amity-int-bcom-mba",
    name: "Integrated B.Com - MBA",
    fullName: "Integrated Bachelor of Commerce - Master of Business Administration",
    levelKey: "integrated",
    degreeLevel: "Integrated Dual Degree",
    slug: "online-mba",
    duration: "4.5 to 5 Years (Dual Degree)",
    eligibility: "10+2 Commerce/All Streams with min 50% marks",
    tuitionFee: 297160,
    semesterFee: 53900,
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Corporate Accounting & Finance Track",
      "Banking & Capital Markets Track",
      "Marketing & Retail Operations Track",
    ],
  },
  {
    id: "amity-int-bca-mca",
    name: "Integrated BCA - MCA",
    fullName: "Integrated Bachelor of Computer Applications - Master of Computer Applications",
    levelKey: "integrated",
    degreeLevel: "Integrated Dual Degree",
    slug: "online-mca",
    duration: "4.5 to 5 Years (Dual Degree)",
    eligibility: "10+2 with Math/Computer or Equivalent",
    tuitionFee: 326870,
    semesterFee: 59300,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Full Stack Software Engineering Track",
      "Cloud Computing & DevOps Track",
      "Artificial Intelligence & Machine Learning Track",
    ],
  },

  // ── INDUSTRY COLLABORATIVE ──
  {
    id: "amity-col-bba-lenskart",
    name: "BBA - Lenskart",
    fullName: "BBA in Retail & Operations Management (Co-Created with Lenskart)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-bba",
    industryPartner: "Lenskart",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board + Selection Interview",
    tuitionFee: 242000,
    semesterFee: 45900,
    thumbnail: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Retail Store Operations & Inventory",
      "Omnichannel Merchandising Strategy",
      "Customer Experience & CRM Management",
    ],
  },
  {
    id: "amity-col-bba-kpmg",
    name: "BBA - KPMG",
    fullName: "BBA in Business Analytics Program (Co-Created with KPMG)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-bba",
    industryPartner: "KPMG",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 with min 50% marks",
    tuitionFee: 202400,
    semesterFee: 38400,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Financial Analytics with KPMG Industry Data",
      "Marketing & Predictive Analytics",
      "Executive BI & Data Storytelling",
    ],
  },
  {
    id: "amity-col-bba-hcl",
    name: "BBA - HCLTech",
    fullName: "BBA in Data Analytics (Co-Created with HCLTech)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-bba",
    industryPartner: "HCLTech",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 with Math/Stats preferred",
    tuitionFee: 220000,
    semesterFee: 41700,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Data Visualization & Business Dashboards",
      "Business Intelligence Engineering",
      "Python Analytics for Enterprises",
    ],
  },
  {
    id: "amity-col-bca-hcl",
    name: "BCA - HCLTech",
    fullName: "BCA in Software & Data Engineering (Co-Created with HCLTech)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-bca",
    industryPartner: "HCLTech",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 220000,
    semesterFee: 41700,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Enterprise Data Engineering Track",
      "Software Engineering & Agile DevOps",
    ],
  },
  {
    id: "amity-col-bca-tcs",
    name: "BCA - TCS iON",
    fullName: "BCA in Cloud Security & Data Analytics (Co-Created with TCS iON)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-bca",
    industryPartner: "TCS iON",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 220000,
    semesterFee: 41700,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Cloud Security Architecture & Defense",
      "Enterprise Data Analytics & Storage",
    ],
  },
  {
    id: "amity-col-bcom-acca",
    name: "B.Com - ACCA",
    fullName: "B.Com with International ACCA UK Accreditation",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-bcom",
    industryPartner: "ACCA",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 with Commerce / Math",
    tuitionFee: 242000,
    semesterFee: 45900,
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Global Corporate Taxation & IFRS",
      "International Audit & Assurance",
      "Strategic Financial Management",
    ],
  },
  {
    id: "amity-col-mba-lenskart",
    name: "MBA - Lenskart",
    fullName: "MBA in Executive Retail Operations (Co-Created with Lenskart)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-mba",
    industryPartner: "Lenskart",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree + Interview selection",
    tuitionFee: 253000,
    semesterFee: 68800,
    thumbnail: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Executive Retail Store Leadership",
      "Supply Chain Optimization & Logistics",
      "Omnichannel Digital Retailing",
    ],
  },
  {
    id: "amity-col-mba-acca",
    name: "MBA - ACCA",
    fullName: "MBA in Global Accounting & Finance (Accredited by ACCA UK)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-mba",
    industryPartner: "ACCA",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree with Commerce/Finance background",
    tuitionFee: 302680,
    semesterFee: 82300,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "International Financial Management",
      "Strategic Business Leadership (SBL)",
      "Advanced Corporate Reporting (SBR)",
    ],
  },
  {
    id: "amity-col-mca-hcl",
    name: "MCA - HCLTech",
    fullName: "MCA in Cybersecurity & Cloud Software (Co-Created with HCLTech)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-mca",
    industryPartner: "HCLTech",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's with Computer/IT or Math",
    tuitionFee: 253000,
    semesterFee: 68800,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "Enterprise Cybersecurity & Threat Intelligence",
      "Cloud Systems Engineering & DevOps",
    ],
  },
  {
    id: "amity-col-mca-tcs",
    name: "MCA - TCS iON",
    fullName: "MCA in AR/VR & Applied Machine Learning (Co-Created with TCS iON)",
    levelKey: "collaborative",
    degreeLevel: "Industry Collaborative",
    slug: "online-mca",
    industryPartner: "TCS iON",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's with Computer/IT or Math",
    tuitionFee: 253000,
    semesterFee: 68800,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: [
      "AR/VR Spatial Computing & Unreal Engine",
      "Applied Machine Learning & Deep Neural Nets",
    ],
  },
];

// ── CHANDIGARH UNIVERSITY ONLINE UNIQUE PROGRAMS (Strict UG / PG Separation) ──
const UNIQUE_CU_PROGRAMS: UniqueProgramItem[] = [
  // ── UG COURSES (Bachelors Only) ──
  {
    id: "cu-ug-bba",
    name: "Online BBA",
    fullName: "Online Bachelor of Business Administration",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bba",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 131250,
    semesterFee: 21875,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    specializations: ["Marketing", "Human Resource", "Finance", "International Business"],
  },
  {
    id: "cu-ug-bba-ba",
    name: "Online BBA (Business Analytics)",
    fullName: "Online BBA in Business Analytics",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bba",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 165300,
    semesterFee: 27550,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    specializations: ["Predictive Analytics", "Data Mining", "Business Intelligence", "Decision Science"],
  },
  {
    id: "cu-ug-bca",
    name: "Online BCA",
    fullName: "Online Bachelor of Computer Applications",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bca",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 with Mathematics / Computer or equivalent",
    tuitionFee: 132750,
    semesterFee: 22125,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: ["Software Engineering", "Cloud Computing", "Web Technologies", "Database Systems"],
  },
  {
    id: "cu-ug-ba-jmc",
    name: "Online BA JMC",
    fullName: "Online Bachelor of Arts in Journalism & Mass Communication",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-ba",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 in any stream",
    tuitionFee: 131250,
    semesterFee: 21875,
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    specializations: ["Digital Media & PR", "Electronic Journalism", "Advertising & Branding", "Media Production"],
  },
  {
    id: "cu-ug-bba-ms",
    name: "Online BBA (Microsoft)",
    fullName: "Online BBA with Microsoft Cloud & Digital Productivity",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bba",
    industryPartner: "Microsoft",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 from recognized board",
    tuitionFee: 140000,
    semesterFee: 23333,
    thumbnail: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
    specializations: ["Microsoft 365 Enterprise", "Power BI Analytics", "Digital Business Transformation", "Cloud Office Management"],
  },
  {
    id: "cu-ug-bca-ms",
    name: "Online BCA (Microsoft)",
    fullName: "Online BCA with Microsoft Azure & Cloud Computing",
    levelKey: "ug",
    degreeLevel: "Undergraduate (UG)",
    slug: "online-bca",
    industryPartner: "Microsoft",
    duration: "3 Years (6 Sems)",
    eligibility: "10+2 with Mathematics / Computer or equivalent",
    tuitionFee: 141600,
    semesterFee: 23600,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    specializations: ["Microsoft Azure Architecture", "DevOps & Cloud Security", "Full Stack Development", "Applied AI Tools"],
  },

  // ── PG COURSES (Masters Only) ──
  {
    id: "cu-pg-mba",
    name: "Online MBA",
    fullName: "Online Master of Business Administration",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mba",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree with min 50% marks",
    tuitionFee: 165000,
    semesterFee: 41250,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    specializations: ["Finance", "Marketing", "Human Resource", "International Business", "Operations", "Information Technology", "Entrepreneurship"],
  },
  {
    id: "cu-pg-mba-ba",
    name: "Online MBA (Business Analytics)",
    fullName: "Online MBA in Business Analytics & Data Driven Management",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mba",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree with min 50% marks",
    tuitionFee: 180000,
    semesterFee: 45000,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    specializations: ["Advanced Predictive Modeling", "Big Data for Managers", "Executive Dashboarding", "Machine Learning in Business"],
  },
  {
    id: "cu-pg-mca",
    name: "Online MCA",
    fullName: "Online Master of Computer Applications",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mca",
    duration: "2 Years (4 Sems)",
    eligibility: "BCA/B.Sc (IT/CS) or Bachelor's with Mathematics",
    tuitionFee: 116250,
    semesterFee: 29063,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    specializations: ["Artificial Intelligence & ML", "Cloud Architecture", "Full Stack Development", "Cyber Security Systems"],
  },
  {
    id: "cu-pg-majmc",
    name: "Online MAJMC",
    fullName: "Online Master of Arts in Journalism & Mass Communication",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-ma",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree in any discipline",
    tuitionFee: 108750,
    semesterFee: 27188,
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    specializations: ["Broadcast Journalism", "Digital Media Strategy", "Corporate Communications", "Media Research & Ethics"],
  },
  {
    id: "cu-pg-msc-ds",
    name: "Online MSc Data Science",
    fullName: "Online Master of Science in Data Science",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-msc",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's in Science/BCA/B.Tech or Math background",
    tuitionFee: 110001,
    semesterFee: 27500,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    specializations: ["Deep Learning & NLP", "Statistical Modeling & R", "Data Engineering & Pipeline", "Computer Vision"],
  },
  {
    id: "cu-pg-ma-eng",
    name: "Online MA English",
    fullName: "Online Master of Arts in English Literature",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-ma",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree in any stream",
    tuitionFee: 75000,
    semesterFee: 18750,
    thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    specializations: ["British Literature", "Postcolonial Studies", "Literary Theory & Criticism", "American Literature"],
  },
  {
    id: "cu-pg-ma-eco",
    name: "Online MA Economics",
    fullName: "Online Master of Arts in Economics",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-ma",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree with Economics / Math / Stats or equivalent",
    tuitionFee: 75000,
    semesterFee: 18750,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    specializations: ["Macroeconomic Policy", "Econometrics & Quantitative Methods", "Development Economics", "International Trade & Finance"],
  },
  {
    id: "cu-pg-msc-math",
    name: "Online MSc Mathematics",
    fullName: "Online Master of Science in Mathematics",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-msc",
    duration: "2 Years (4 Sems)",
    eligibility: "B.Sc with Mathematics as a main subject",
    tuitionFee: 75000,
    semesterFee: 18750,
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    specializations: ["Pure Mathematics", "Applied Statistics & Optimization", "Topology & Complex Analysis", "Computational Mathematics"],
  },
  {
    id: "cu-pg-mba-capm",
    name: "Online MBA (Project Management & Pwe)",
    fullName: "Online MBA with Certificate Associates of Project Management & Pwe Certification",
    levelKey: "pg",
    degreeLevel: "Postgraduate (PG)",
    slug: "online-mba",
    industryPartner: "Project Management Institute (PMI)",
    duration: "2 Years (4 Sems)",
    eligibility: "Bachelor's degree with min 50% marks",
    tuitionFee: 180400,
    semesterFee: 45100,
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    specializations: ["Agile & Scrum Frameworks", "CAPM Global Certification", "Enterprise Risk Management", "Strategic Execution"],
  },
];

// ── WHY SAY YES TO AMITY ONLINE? (12 Official Pillars with Badges & Logos) ──
const WHY_YES_AMITY_DATA = [
  {
    id: "wasc",
    title: "WASC Accreditation (USA)",
    badge: "USA Regional Accreditation",
    description: "Amity Online is India's only university accredited by the Western Association of Schools and Colleges - a distinguished recognition of global academic excellence.",
    logo: "/assets/approvals/wasc.svg",
    category: "accreditation" as const,
    highlight: "India's Only University",
    themeBg: "bg-blue-900/10 text-blue-950 dark:text-blue-200 border-blue-900/20",
  },
  {
    id: "wes",
    title: "WES Recognition",
    badge: "Canada & USA Equivalency",
    description: "Degrees recognised by World Education Services (WES) Canada & USA, enabling smoother pathways for higher studies and global career mobility.",
    logo: "/assets/approvals/wes.png",
    category: "accreditation" as const,
    highlight: "Global Higher Studies Pathway",
    themeBg: "bg-sky-500/10 text-sky-900 dark:text-sky-200 border-sky-500/20",
  },
  {
    id: "qs-mba",
    title: "QS Ranked Online MBA",
    badge: "Asia Pacific Top 10",
    description: "Amity Online offers India's only Online MBA ranked by QS under Asia Pacific Top 10 - a global recognition for academic strength, learner outcomes, and digital innovation.",
    logo: "/assets/approvals/qs.png",
    category: "accreditation" as const,
    highlight: "Asia Pacific Top 10 by QS",
    themeBg: "bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/20",
  },
  {
    id: "qaa",
    title: "QAA (UK) Accreditation",
    badge: "UK Quality Benchmarked",
    description: "Accredited by the UK's Quality Assurance Agency (QAA), assuring students of globally benchmarked academic quality.",
    logo: "/assets/approvals/qaa.svg",
    category: "accreditation" as const,
    highlight: "UK Quality Assured",
    themeBg: "bg-indigo-900/10 text-indigo-950 dark:text-indigo-200 border-indigo-900/20",
  },
  {
    id: "the",
    title: "Times Higher Education Employability Rankings",
    badge: "Global Employability Ranking",
    description: "Amity University is ranked among the best globally for graduate employability and employer reputation by Times Higher Education.",
    logo: "/assets/approvals/the.svg",
    category: "accreditation" as const,
    highlight: "Global Employer Reputation",
    themeBg: "bg-red-500/10 text-red-950 dark:text-red-200 border-red-500/20",
  },
  {
    id: "pan-india",
    title: "Pan-India Campus Access & Offline Events",
    badge: "Hybrid Campus Life",
    description: "Enjoy access to all Amity campuses for events like orientation, mid-year meetups, on-campus connect and convocation - blending digital convenience with real-world connection.",
    category: "learning" as const,
    highlight: "Pan-India Campus Access",
    themeBg: "bg-purple-500/10 text-purple-950 dark:text-purple-200 border-purple-500/20",
    icon: Building2,
  },
  {
    id: "amigo",
    title: "Amigo: Learning On-the-Go",
    badge: "Official Mobile Learning App",
    description: "The Amigo app makes learning seamless and mobile - attend live classes, track progress, access materials, and more on your schedule.",
    category: "learning" as const,
    highlight: "Live Classes & Mobile Sync",
    themeBg: "bg-blue-600/10 text-blue-950 dark:text-blue-200 border-blue-600/20",
    icon: Smartphone,
  },
  {
    id: "prof-ami",
    title: "Prof. Ami: Your AI-Powered Personal Tutor",
    badge: "24/7 AI Mentor",
    description: "Meet Prof. Ami - your always-on, AI mentor for instant doubt-solving, personalised learning tips, and smart academic support.",
    category: "learning" as const,
    highlight: "24/7 AI-Powered Tutor",
    themeBg: "bg-fuchsia-600/10 text-fuchsia-950 dark:text-fuchsia-200 border-fuchsia-600/20",
    icon: Bot,
  },
  {
    id: "certifications",
    title: "Industry Certifications for Better Employability",
    badge: "Curriculum Integrated",
    description: "Gain an edge with in-demand certifications from top industry bodies and partners - integrated within your program to boost your skills and CV.",
    category: "career" as const,
    highlight: "Skills & CV Booster",
    themeBg: "bg-emerald-600/10 text-emerald-950 dark:text-emerald-200 border-emerald-600/20",
    icon: Award,
  },
  {
    id: "internships",
    title: "Internship Opportunities",
    badge: "Corporate Placements",
    description: "Access curated internships with leading companies through our corporate network, helping you gain real-world experience and stand out in the job market.",
    category: "career" as const,
    highlight: "Top Corporate Network",
    themeBg: "bg-orange-600/10 text-orange-950 dark:text-orange-200 border-orange-600/20",
    icon: Briefcase,
  },
  {
    id: "career-discovery",
    title: "AI-Powered Career Discovery Platform",
    badge: "Job & Interview Prep",
    description: "From mock interviews and resume building to job search and easy-apply tools - our AI-powered platform ensures you’re career-ready from day one.",
    category: "career" as const,
    highlight: "Mock Interviews & Job Tools",
    themeBg: "bg-teal-600/10 text-teal-950 dark:text-teal-200 border-teal-600/20",
    icon: Compass,
  },
  {
    id: "besocial",
    title: "beSocial App for Campus Life",
    badge: "Virtual Student Hub",
    description: "Your virtual student hub — the beSocial app lets you network, join clubs, attend events, and be part of a vibrant, online-first community.",
    category: "learning" as const,
    highlight: "Student Clubs & Networking",
    themeBg: "bg-pink-600/10 text-pink-950 dark:text-pink-200 border-pink-600/20",
    icon: Users,
  },
];

// ── 5-STEP AMITY ADMISSION PROCESS (Matching Reference Diagram) ──
const AMITY_ADMISSION_STEPS = [
  {
    step: "01",
    title: "01. Select Your Program",
    subtitle: "Choose the program that suits your goals.",
    bgLight: "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700",
    icon: Laptop,
  },
  {
    step: "02",
    title: "02. Complete Your Application",
    subtitle: "Fill out your application with all the necessary information",
    bgLight: "bg-blue-50 text-blue-600 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-700",
    icon: FileText,
  },
  {
    step: "03",
    title: "03. Pay Your Program Fees",
    subtitle: "Make your program payment securely & easily",
    bgLight: "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700",
    icon: IndianRupee,
  },
  {
    step: "04",
    title: "04. Submit & Register",
    subtitle: "Submit your application and complete your registration",
    bgLight: "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-700",
    icon: MousePointerClick,
  },
  {
    step: "05",
    title: "05. Await Enrollment Details",
    subtitle: "Wait for enrollment details & further guidance",
    bgLight: "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700",
    icon: Clock,
  },
];

export const UniversityDetail = () => {
  const { uniSlug } = useParams<{ uniSlug: string }>();

  // Find university from full list with fallback matching
  const allUnis = [...UNIVERSITIES, ...ACTIVE_ONLINE_UNIVERSITIES, ...EXECUTIVE_PARTNERS, ...INCLUDED_PARTNERS];
  const uni = allUnis.find((u) => u.slug === uniSlug || u.id === uniSlug) ||
    allUnis.find((u) => uniSlug && (u.slug.includes(uniSlug) || uniSlug.includes(u.slug) || (uniSlug === "amity" && u.slug.includes("amity"))));

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const searchParam = searchParams.get("search");

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "faculty" | "admission">(() => {
    if (tabParam === "courses" || searchParam) return "courses";
    return "overview";
  });
  const [courseCategoryTab, setCourseCategoryTab] = useState<"ug" | "pg" | "certifications" | "collaborative" | "integrated">(() => {
    if (searchParam) {
      const lower = searchParam.toLowerCase();
      if (lower.includes("cert") || lower.includes("diploma")) return "certifications";
      if (lower.includes("mba") || lower.includes("mca") || lower.includes("msc") || lower.includes("m.sc") || lower.includes("mcom") || lower.includes("ma") || lower.includes("master") || lower.includes("dba")) return "pg";
      if (lower.includes("bba") || lower.includes("bca") || lower.includes("bcom") || lower.includes("ba") || lower.includes("b.sc")) return "ug";
    }
    return "ug";
  });
  const [paymentMode, setPaymentMode] = useState<"direct" | "loan">("direct");
  const [searchQuery, setSearchQuery] = useState(() => searchParam || "");
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [whyAmityFilter, setWhyAmityFilter] = useState<"all" | "accreditation" | "learning" | "career">("all");
  const [selectedFaculty, setSelectedFaculty] = useState<{
    name: string;
    designation: string;
    qualification: string;
    experience: string;
    specialization: string;
    image?: string;
    bio?: string;
  } | null>(null);

  // Sync when searchParams change
  useEffect(() => {
    if (tabParam === "courses" || searchParam) {
      setActiveTab("courses");
      if (searchParam) {
        setSearchQuery(searchParam);
        const lower = searchParam.toLowerCase();
        if (lower.includes("cert") || lower.includes("diploma")) {
          setCourseCategoryTab("certifications");
        } else if (lower.includes("mba") || lower.includes("mca") || lower.includes("msc") || lower.includes("m.sc") || lower.includes("mcom") || lower.includes("ma") || lower.includes("master") || lower.includes("dba")) {
          setCourseCategoryTab("pg");
        } else if (lower.includes("bba") || lower.includes("bca") || lower.includes("bcom") || lower.includes("ba") || lower.includes("b.sc")) {
          setCourseCategoryTab("ug");
        }
      }
      setTimeout(() => {
        const el = document.getElementById("courses-tab-anchor");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [uniSlug, tabParam, searchParam]);

  // Quick Lead Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAccreditation, setSelectedAccreditation] = useState<{
    name: string;
    shortName?: string;
    fullName: string;
    badge: string;
    img: string;
    icon?: string;
    standsFor: string;
    singlePara?: string;
    shortDesc: string;
    whyItMatters: string;
  } | null>(null);

  const nameInputId = useId();
  const phoneInputId = useId();
  const courseSelectId = useId();

  // Filtered Programs for Amity (called unconditionally before early return)
  const filteredAmityPrograms = useMemo(() => {
    return AMITY_JULY_26_FEE_STRUCTURE.filter((prog) => {
      if (courseCategoryTab === "pg" && prog.type !== "PG") return false;
      if (courseCategoryTab === "ug" && prog.type !== "UG") return false;
      if (courseCategoryTab === "integrated" && prog.type !== "UG - PG") return false;
      if (courseCategoryTab === "collaborative" && !prog.industryPartner) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prog.name.toLowerCase().includes(q);
        const matchPartner = prog.industryPartner?.toLowerCase().includes(q);
        const matchCat = prog.category.toLowerCase().includes(q);
        return matchName || matchPartner || matchCat;
      }
      return true;
    });
  }, [courseCategoryTab, searchQuery]);

  // Filtered "Why Say Yes to Amity" Items
  const filteredWhyAmity = useMemo(() => {
    if (whyAmityFilter === "all") return WHY_YES_AMITY_DATA;
    return WHY_YES_AMITY_DATA.filter((item) => item.category === whyAmityFilter);
  }, [whyAmityFilter]);

  if (!uni) {
    return <Navigate to="/universities" replace />;
  }

  const isAmity = uni.slug.includes("amity") || uni.id.includes("amity");
  const isManipal = uni.slug.includes("manipal") || uni.id.includes("manipal") || uni.slug.includes("muj");
  const isCu = uni.slug.includes("chandigarh") || uni.slug.includes("cu") || uni.id.includes("chandigarh");
  const isSharda = uni.slug.includes("sharda") || uni.id.includes("sharda");
  const isSgt = uni.slug.includes("sgt") || uni.id.includes("sgt");
  const isLiverpool = uni.slug.includes("liverpool") || uni.slug.includes("ljmu");
  const isForeignDoctorate = uni.slug.includes("golden-gate") || uni.slug.includes("birchwood");
  const uniCertifications = useMemo(() => {
    return getCertificationsForUniversity(uni.slug);
  }, [uni.slug]);
  const campusImage = getUniversityCampusImage(uni.slug);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = validateMeaningfulName(name, false);
    if (!nameCheck.valid) {
      setNameError(nameCheck.error || "Please enter a valid, meaningful name.");
      return;
    }
    const phoneCheck = validateIndianMobile(phone);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setNameError("");
    setPhoneError("");
    setIsSubmitting(true);
    try {
      await submitLead({
        name: nameCheck.normalized || name.trim(),
        phone: `${countryCode} ${phoneCheck.normalized || phone.replace(/\D/g, "").slice(-10)}`,
        program: `${uni.name} - ${selectedCourse || "General Inquiry"}`,
        source: `university-${uni.slug}`,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thumbnail image helper for program cards
  const getCourseThumbnail = (prog: AmityProgramFee) => {
    if (prog.industryPartner === "Lenskart") {
      return "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.type === "UG - PG") {
      return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.category === "IT & Computer") {
      return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.category === "Commerce") {
      return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.category === "Humanities & Media") {
      return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80";
  };

  // Generic programs for other universities
  const genericPrograms = (uni.popularCourses || []).map((courseName) => {
    const matched = COURSES.find((c) => c.title.toLowerCase() === courseName.toLowerCase()) ||
      COURSES.find((c) => courseName.toLowerCase().includes(c.slug.replace("online-", "")));

    const nameUpper = courseName.toUpperCase();
    const isPg = (
      nameUpper.includes("MBA") ||
      nameUpper.includes("MCA") ||
      nameUpper.includes("MSC") ||
      nameUpper.includes("M.SC") ||
      nameUpper.includes("M.COM") ||
      nameUpper.includes("MCOM") ||
      nameUpper.includes("MASTER") ||
      nameUpper.includes("POSTGRADUATE") ||
      nameUpper.includes("MAJMC") ||
      /\bMA\b/.test(courseName) ||
      courseName.startsWith("Online MA") ||
      courseName.startsWith("MA ") ||
      courseName.includes(" MA ")
    );

    return {
      name: courseName,
      slug: matched?.slug || courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      level: isPg ? "Postgraduate (PG)" : "Undergraduate (UG)",
      levelKey: isPg ? "pg" : "ug",
      duration: matched?.duration || (isPg ? "2 Years (4 Semesters)" : "3 Years (6 Semesters)"),
      fee: matched?.feeRange || uni.feeRange || "₹60,000 – ₹1,80,000",
      emi: matched?.emiStarting || uni.emiStarting || "From ₹3,250/mo",
      specializations: matched?.specializations ? matched.specializations.slice(0, 4) : ["Finance", "Marketing", "Human Resources", "Analytics"],
      eligibility: matched?.eligibility ? matched.eligibility.split(".")[0] : (isPg ? "Bachelor's degree with min 50% marks" : "10+2 from recognized board with min 45% marks"),
    };
  });

  // Unique programs for current tab & search
  const displayPrograms = useMemo(() => {
    if (isAmity) {
      return UNIQUE_AMITY_PROGRAMS.filter((prog) => {
        if (courseCategoryTab !== prog.levelKey) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = prog.name.toLowerCase().includes(q);
          const matchFull = prog.fullName.toLowerCase().includes(q);
          const matchPartner = prog.industryPartner?.toLowerCase().includes(q);
          const matchSpec = prog.specializations.some((s) => s.toLowerCase().includes(q));
          return matchName || matchFull || matchPartner || matchSpec;
        }
        return true;
      });
    }

    if (isCu) {
      return UNIQUE_CU_PROGRAMS.filter((prog) => {
        if (courseCategoryTab !== prog.levelKey) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = prog.name.toLowerCase().includes(q);
          const matchFull = prog.fullName.toLowerCase().includes(q);
          const matchPartner = prog.industryPartner?.toLowerCase().includes(q);
          const matchSpec = prog.specializations.some((s) => s.toLowerCase().includes(q));
          return matchName || matchFull || matchPartner || matchSpec;
        }
        return true;
      });
    }

    // Generic universities
    return genericPrograms
      .filter((prog) => {
        if (courseCategoryTab === "ug" && prog.levelKey !== "ug") return false;
        if (courseCategoryTab === "pg" && prog.levelKey !== "pg") return false;
        if (courseCategoryTab === "integrated" || courseCategoryTab === "collaborative") return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return prog.name.toLowerCase().includes(q);
        }
        return true;
      })
      .map((p, i) => ({
        id: `gen-${i}`,
        name: p.name,
        fullName: p.name,
        levelKey: p.levelKey as "ug" | "pg" | "integrated" | "collaborative",
        degreeLevel: p.level,
        slug: p.slug,
        duration: p.duration,
        eligibility: p.eligibility,
        tuitionFee: 120000,
        semesterFee: 30000,
        specializations: p.specializations,
        industryPartner: undefined as string | undefined,
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      }));
  }, [isAmity, isCu, courseCategoryTab, searchQuery, genericPrograms]);

  interface AuthorityLogoItem {
    name: string;
    shortName: string;
    fullName: string;
    badge: string;
    img: string;
    icon?: string;
    standsFor: string;
    singlePara?: string;
    shortDesc: string;
    whyItMatters: string;
  }

  // Statutory & Premier Accreditations with Clear Simple Explanations
  const authorityLogos: AuthorityLogoItem[] = [
    {
      name: "UGC-DEB",
      shortName: "UGC-DEB",
      fullName: "University Grants Commission – Distance Education Bureau",
      badge: "Statutory Govt. Approval",
      img: "/assets/approvals/ugc-deb.png",
      icon: "/assets/approvals/ugc-deb-clean.png",
      standsFor: "University Grants Commission – Distance Education Bureau",
      singlePara: "The University Grants Commission (UGC-DEB) is the premier statutory authority regulating university higher education in India. Its approval guarantees that your online degree has 100% legal validity, equivalent to an on-campus degree, and is fully recognized for UPSC, SSC, banking, state/central government jobs, corporate hiring, and global university admissions.",
      shortDesc: "The premier statutory authority regulating university higher education and distance/online learning across India.",
      whyItMatters: "Mandatory legal validation ensuring your degree is 100% genuine and fully accepted for UPSC, SSC, banking, all state/central government jobs, and global university admissions."
    },
    {
      name: "AICTE",
      shortName: "AICTE",
      fullName: "All India Council for Technical Education",
      badge: "Technical Curriculum Standard",
      img: "/assets/approvals/aicte.png",
      icon: "/assets/approvals/aicte-clean.png",
      standsFor: "All India Council for Technical Education",
      singlePara: "The All India Council for Technical Education (AICTE) approves technical and management curricula (MBA, MCA, BCA) in India, confirming that the syllabus, faculty rigor, and course outcomes match current industry technical benchmarks and high employability standards.",
      shortDesc: "National statutory council governing professional technical and management curricula (MBA, MCA, BCA) in India.",
      whyItMatters: "Confirms that curriculum, faculty rigor, and course outcomes match current industry technical benchmarks and high employability standards."
    },
    {
      name: "NAAC A+",
      shortName: "NAAC A+",
      fullName: "National Assessment & Accreditation Council (Grade A+)",
      badge: "Premier Institutional Grade",
      img: "/assets/approvals/naac_a_plus.png",
      icon: "/assets/approvals/naac-clean.png",
      standsFor: "National Assessment and Accreditation Council",
      singlePara: "The National Assessment and Accreditation Council (NAAC) has awarded an elite 'A+' grade, reserved exclusively for top-tier institutions demonstrating superior academic quality, curriculum excellence, faculty credentials, and student learning results.",
      shortDesc: "Autonomous accreditation authority under UGC evaluating comprehensive academic quality, campus research, and student learning results.",
      whyItMatters: "An 'A+' grade is reserved for India's elite institutions, proving top-quartile educational quality and high employer trust worldwide."
    },
    {
      name: "WES",
      shortName: "WES",
      fullName: "World Education Services (USA & Canada)",
      badge: "North American Equivalency",
      img: "/assets/approvals/wes.png",
      icon: "/assets/approvals/wes-clean.png",
      standsFor: "World Education Services (USA & Canada Equivalency)",
      singlePara: "World Education Services (WES) credential evaluation confirms that your degree is officially recognized as equivalent to degrees granted in the United States and Canada for higher education, multinational corporate hiring, and Permanent Residency (PR).",
      shortDesc: "World's most trusted international credential evaluation service based in the United States and Canada.",
      whyItMatters: "Validates that your online degree is officially recognized as equivalent to degrees granted in the USA and Canada for higher education, corporate hiring, and Permanent Residency (PR)."
    },
    {
      name: "NIRF",
      shortName: "NIRF",
      fullName: "National Institutional Ranking Framework (Ministry of Education)",
      badge: "Govt. of India Ranking",
      img: "/assets/approvals/nirf.png",
      icon: "/assets/approvals/nirf-clean.png",
      standsFor: "National Institutional Ranking Framework (MoE)",
      singlePara: "Ranked under the Ministry of Education's National Institutional Ranking Framework (NIRF), highlighting top-quartile teaching quality, graduation outcomes, and educational excellence among India's leading institutions.",
      shortDesc: "The official national ranking methodology established by the Ministry of Education, Government of India.",
      whyItMatters: "Ranks top universities on factual parameters: Teaching, Learning & Resources, Research, Graduation Outcomes, and Outreach."
    },
    {
      name: "QS World Rankings",
      shortName: "QS",
      fullName: "Quacquarelli Symonds (QS) University Rankings",
      badge: "Global Institutional Benchmark",
      img: "/assets/approvals/qs.png",
      icon: "/assets/approvals/qs-clean.png",
      standsFor: "Quacquarelli Symonds Global University Rankings",
      singlePara: "Recognized by Quacquarelli Symonds (QS) global university rankings, confirming high international academic reputation, corporate employer recognition, and worldwide prestige.",
      shortDesc: "Leading global higher education analyst producing premier annual university rankings worldwide.",
      whyItMatters: "Provides international reputation and employer recognition, helping you stand out when applying for multinational careers or studying abroad."
    },
    {
      name: "DEC",
      shortName: "DEC",
      fullName: "Distance Education Council",
      badge: "Distance Learning Quality",
      img: "/assets/approvals/dec.png",
      icon: "/assets/approvals/dec-clean.png",
      standsFor: "Distance Education Council",
      singlePara: "Conferred under Distance Education Council standards, validating student-centric learning delivery, verified self-paced study coursework, and systematic evaluation methodology.",
      shortDesc: "Apex historic council establishing quality protocols and standards for open and distance learning systems in India.",
      whyItMatters: "Guarantees student-centric learning delivery, self-paced study material quality, and systematic evaluation methodology."
    },
  ];

  // Official Amity Recognitions including WASC (USA), QAA (UK) & THE
  const amityAuthorityLogos: AuthorityLogoItem[] = [
    {
      name: "UGC-DEB Approved",
      shortName: "UGC-DEB",
      fullName: "University Grants Commission – Distance Education Bureau",
      badge: "Statutory Govt. Approval",
      img: "/assets/approvals/ugc-deb.png",
      icon: "/assets/approvals/ugc-deb-clean.png",
      standsFor: "University Grants Commission – Distance Education Bureau",
      shortDesc: "Statutory council established under the Ministry of Education regulating digital and distance higher education.",
      whyItMatters: "Guarantees full statutory validity for all competitive examinations, central/state government employment, and global higher study."
    },
    {
      name: "AICTE Approved",
      shortName: "AICTE",
      fullName: "All India Council for Technical Education",
      badge: "Professional Technical Standard",
      img: "/assets/approvals/aicte.png",
      icon: "/assets/approvals/aicte-clean.png",
      standsFor: "All India Council for Technical Education",
      shortDesc: "Statutory body planning and coordinated development of technical and management education across India.",
      whyItMatters: "Endorses that MBA and MCA syllabi match current multinational corporate expectations and technical competence."
    },
    {
      name: "WASC Accredited (USA)",
      shortName: "WASC",
      fullName: "WASC Senior College and University Commission (USA)",
      badge: "Prestigious US Regional Accreditation",
      img: "/assets/approvals/wasc.svg",
      icon: "/assets/approvals/wasc.svg",
      standsFor: "Western Association of Schools & Colleges (USA)",
      shortDesc: "Top-tier regional accreditation body recognized by the US Department of Education.",
      whyItMatters: "Enables seamless credit transfer and academic recognition across universities and employers throughout the United States."
    },
    {
      name: "QAA UK Quality Assured",
      shortName: "QAA",
      fullName: "Quality Assurance Agency for Higher Education (UK)",
      badge: "British Quality Benchmark",
      img: "/assets/approvals/qaa.svg",
      icon: "/assets/approvals/qaa.svg",
      standsFor: "Quality Assurance Agency for Higher Education (UK)",
      shortDesc: "The independent body entrusted with safeguarding quality and standards in United Kingdom higher education.",
      whyItMatters: "Ensures course delivery and evaluation methodology matches European and British university excellence standards."
    },
    {
      name: "WES Recognized",
      shortName: "WES",
      fullName: "World Education Services (USA & Canada)",
      badge: "International Credential Equivalency",
      img: "/assets/approvals/wes.png",
      icon: "/assets/approvals/wes-clean.png",
      standsFor: "World Education Services (USA & Canada Equivalency)",
      shortDesc: "The trusted authority for degree evaluations required for North American employment, visas, and university admissions.",
      whyItMatters: "Ensures immediate acceptance in Canada and USA for Express Entry, PNP, higher degrees, and global MNC transfers."
    },
    {
      name: "QS Ranked Online MBA",
      shortName: "QS",
      fullName: "Quacquarelli Symonds (QS) Asia Pacific Top 10",
      badge: "Asia Pacific Rank #10",
      img: "/assets/approvals/qs.png",
      icon: "/assets/approvals/qs-clean.png",
      standsFor: "Quacquarelli Symonds Asia Pacific Rankings",
      shortDesc: "Ranked among the premier online MBA programs across the entire Asia Pacific region.",
      whyItMatters: "Recognized as a premier management program on your CV when applying to multinational corporations worldwide."
    },
    {
      name: "Times Higher Education",
      shortName: "THE",
      fullName: "Times Higher Education (THE) Employability",
      badge: "Global Employability Ranking",
      img: "/assets/approvals/the.svg",
      icon: "/assets/approvals/the.svg",
      standsFor: "Times Higher Education Employability Rankings",
      shortDesc: "World's most respected global university ranking publisher assessing graduate outcomes.",
      whyItMatters: "Demonstrates consistent corporate recruitment and high placement demand across Fortune 500 enterprises."
    },
    {
      name: "NIRF Top Ranked",
      shortName: "NIRF",
      fullName: "National Institutional Ranking Framework",
      badge: "MoE, Govt of India",
      img: "/assets/approvals/nirf.png",
      icon: "/assets/approvals/nirf-clean.png",
      standsFor: "National Institutional Ranking Framework",
      shortDesc: "Official Government of India ranking of leading institutions across academic and career parameters.",
      whyItMatters: "Confirms top-tier national standing and robust institutional accountability backed by verified government audits."
    },
  ];

  // Real Corporate Placement Logos
  const placementCompanies = [
    { name: "Google", logo: "/assets/companies/google.svg" },
    { name: "Microsoft", logo: "/assets/companies/microsoft.svg" },
    { name: "Amazon", logo: "/assets/companies/amazon.svg" },
    { name: "Deloitte", logo: "/assets/companies/deloitte.svg" },
    { name: "TCS", logo: "/assets/companies/tcs.svg" },
    { name: "Infosys", logo: "/assets/companies/infosys.svg" },
    { name: "Accenture", logo: "/assets/companies/accenture.svg" },
    { name: "HDFC Bank", logo: "/assets/companies/hdfc.svg" },
    { name: "KPMG", logo: "/assets/companies/kpmg.svg" },
    { name: "HCLTech", logo: "/assets/companies/hcltech.svg" },
    { name: "Lenskart", logo: "/assets/companies/lenskart.svg" },
    { name: "Wipro", logo: "/assets/companies/wipro.svg" },
  ];

  // Official Sharda Online Faculty (Verified from User Reference)
  const shardaFacultyMembers = [
    {
      id: "avinash-bhowate",
      name: "Dr. Avinash Bhowate",
      designation: "Assistant Professor, MBA",
      qualification: "MBA and PhD in Marketing",
      avatar: "/assets/faculty/sharda-avinash-bhowate.png",
      bio: "Dr. Avinash Bhowate brings rich academic and industry-aligned mentorship in Marketing Strategy, Consumer Behaviour, and Strategic Brand Building for postgraduate cohorts.",
    },
    {
      id: "sandeep-kumar",
      name: "Dr. Sandeep Kumar",
      designation: "Assistant Professor, MBA",
      qualification: "Ph.D. in Marketing",
      avatar: "/assets/faculty/sharda-sandeep-kumar.png",
      bio: "Dr. Sandeep Kumar is an esteemed educator and researcher specializing in Strategic Marketing, Retail Distribution Dynamics, and Customer Experience Engineering.",
    },
    {
      id: "tanya-rastogi",
      name: "Dr. Tanya Rastogi",
      designation: "Assistant Professor, M.Com",
      qualification: "Master of Commerce and Ph.D.",
      avatar: "/assets/faculty/sharda-tanya-rastogi.png",
      bio: "Dr. Tanya Rastogi specializes in Advanced Financial Accounting, Capital Markets, International Finance, and Quantitative Managerial Economics.",
    },
    {
      id: "kirti-prashar",
      name: "Dr. Kirti Prashar",
      designation: "Assistant Professor, BBA",
      qualification: "Master's in Commerce, UGC NET",
      avatar: "/assets/faculty/sharda-kirti-prashar.png",
      bio: "Dr. Kirti Prashar has qualified UGC NET and brings rich pedagogical expertise in Business Administration, Organizational Behavior, and HR Systems.",
    },
    {
      id: "shubh-arora",
      name: "Dr. Shubh Arora",
      designation: "Associate Professor, MBA",
      qualification: "Ph.D. in Marketing and an MBA",
      avatar: "/assets/faculty/sharda-shubh-arora.png",
      bio: "Dr. Shubh Arora is an Associate Professor with seasoned experience across Strategic Marketing, Consumer Psychology, and Brand Management.",
    },
  ];

  // Faculty Members from User Reference (Amity / Generic)
  const facultyMembers = [
    {
      id: "sunil-kumar",
      name: "Dr. Sunil Kumar",
      designation: "Assistant Professor",
      qualification: "Ph.D. in Management",
      avatar: "/assets/faculty/sunil-kumar.png",
      bio: "Hello, I'm Dr. Sunil Kumar. I hold a Ph.D. in Management with over 12 years of specialized research and teaching experience in Strategic Management, Organizational Behavior, and Leadership Development."
    },
    {
      id: "luke-pearce",
      name: "Luke Pearce",
      designation: "International Faculty (10+ years)",
      qualification: "Master's in Education and Leadership",
      avatar: "/assets/faculty/luke-pearce.png",
      bio: "I'm Luke Pearce. With over a decade of international pedagogical leadership, I instruct global cohorts in Cross-Cultural Management, Global Business Communication, and Corporate Strategy."
    },
    {
      id: "neha-tandon",
      name: "Neha Tandon",
      designation: "Assistant Professor",
      qualification: "Double PG in Management & Commerce",
      avatar: "/assets/faculty/neha-tandon.png",
      bio: "I'm Neha Tandon. I have mentored thousands of working executives across Financial Accounting, Corporate Taxation, Managerial Economics, and Quantitative Decision Sciences."
    },
    {
      id: "hailey-stanton",
      name: "Dr. Hailey Stanton",
      designation: "International Faculty (11+ years)",
      qualification: "Ph.D. from Coventry University",
      avatar: "/assets/faculty/hailey-stanton.png",
      bio: "Hello, I'm Dr. Hailey Stanton. My research spans International Marketing, Digital Brand Analytics, and Consumer Behaviour across multinational retail ecosystems."
    },
    {
      id: "ronald-darnell",
      name: "Dr. Ronald Darnell",
      designation: "International Faculty",
      qualification: "Ph.D. from Capella University, MBA",
      avatar: "/assets/faculty/ronald-darnell.png",
      bio: "I'm Dr. Ronald Darnell. I bring 25+ years of senior executive leadership, corporate governance advisory, and business analytics instruction for Fortune 500 organizations."
    },
    {
      id: "sachit-paliwal",
      name: "Sachit Paliwal",
      designation: "Assistant Professor",
      qualification: "MBA in Finance Management",
      avatar: "/assets/faculty/sachit-paliwal.png",
      bio: "Hello, my name is Sachit Paliwal. I specialize in Investment Portfolio Analysis, FinTech Ecosystems, Corporate Valuation, and Advanced Capital Markets."
    },
  ];

  // Official Chandigarh University Online Placement Partners (From User Image 4)
  const cuPlacementCompanies = [
    { name: "Capgemini", logo: "/assets/companies/cu/capgemini.png" },
    { name: "Cognizant", logo: "/assets/companies/cu/cognizant.png" },
    { name: "Flipkart", logo: "/assets/companies/cu/flipkart.png" },
    { name: "Hitachi", logo: "/assets/companies/cu/hitachi.png" },
    { name: "IndiGo", logo: "/assets/companies/cu/indigo.png" },
    { name: "ISRO", logo: "/assets/companies/cu/isro.png" },
    { name: "NTT DATA", logo: "/assets/companies/cu/nttdata.png" },
    { name: "Practo", logo: "/assets/companies/cu/practo.png" },
    { name: "Tata", logo: "/assets/companies/cu/tata.png" },
    { name: "Vistara", logo: "/assets/companies/cu/vistara.png" },
    { name: "Adidas", logo: "/assets/companies/cu/adidas.png" },
  ];

  // Official Chandigarh University Online Faculty (From User Image 2)
  const cuFacultyMembers = [
    {
      id: "cu-kriti-khurana",
      name: "Dr. Kriti Khurana",
      designation: "Faculty in Management",
      qualification: "BA (Hons.) English, Master's Degree, Ph.D.",
      avatar: "/assets/faculty/cu-kriti-khurana.png",
      bio: "Dr. Kriti Khurana specializes in managerial communications, organizational development, and executive business strategy."
    },
    {
      id: "cu-shamim-mondal",
      name: "Shamim Mondal",
      designation: "Visiting Faculty",
      qualification: "Ph.D., Economics",
      avatar: "/assets/faculty/cu-shamim-mondal.png",
      bio: "Prof. Shamim Mondal brings deep academic research expertise in Managerial Economics, Microeconomic Theory, and Applied Econometrics."
    },
    {
      id: "cu-alka-sharma",
      name: "Alka Sharma",
      designation: "Visiting Faculty (Consultant)",
      qualification: "Women Startup Program 2026 Mentor",
      avatar: "/assets/faculty/cu-alka-sharma.png",
      bio: "Alka Sharma is an experienced corporate consultant and mentor driving entrepreneurship, enterprise strategy, and startup acceleration."
    },
    {
      id: "cu-david-poritzky",
      name: "David F. Poritzky",
      designation: "Visiting Faculty",
      qualification: "MBA from The Wharton School, CEO Envista",
      avatar: "/assets/faculty/cu-david-poritzky.png",
      bio: "David F. Poritzky is a Wharton MBA alumnus and CEO advising leadership cohorts on global corporate scaling, finance, and investment banking."
    },
    {
      id: "cu-mirza-baig",
      name: "Mirza Rahim Baig",
      designation: "Lead Business Analyst",
      qualification: "Master's in Data Science & Analytics",
      avatar: "/assets/faculty/cu-mirza-baig.png",
      bio: "Mirza Rahim Baig is an industry-leading Data Science practitioner instructing students on Big Data architecture, Machine Learning, and Predictive Business Analytics."
    },
  ];

  const currentFacultyList = isCu ? cuFacultyMembers : isSharda ? shardaFacultyMembers : facultyMembers;

  return (
    <>
      <Helmet>
        <title>{uni.name} — Online Degrees, Fees, Approvals & Admission 2026 | Degree Guru</title>
        <meta name="description" content={`Official information on ${uni.name} UGC-DEB approved online degrees, fee structure, no-cost EMI, and admission process. Free guidance on Degree Guru.`} />
        <link rel="canonical" href={`https://degreeguru.in/universities/${uni.slug}/`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. BREADCRUMB ROW                                                 */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="container-dg max-w-6xl pt-4 pb-2">
          <AppBreadcrumb
            items={[
              { label: "Universities", href: "/universities" },
              { label: uni.shortName || uni.name }
            ]}
          />
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. CLEAN NOT FULL SIZE BANNER IMAGE                               */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="container-dg max-w-6xl pt-1 sm:pt-2">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 shadow-md bg-slate-900 aspect-[16/9] sm:aspect-[21/9] max-h-[340px] sm:max-h-[420px]">
            <img
              src={campusImage}
              alt={`${uni.name} Campus Facade`}
              className="w-full h-full object-cover object-[center_30%] transition-transform duration-500 hover:scale-101"
              loading="eager"
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. UNIVERSITY PROFILE CARD (Overlapping clean banner)              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative -mt-10 sm:-mt-16 z-20 pb-4 sm:pb-6">
          <div className="container-dg max-w-6xl">
            <div className="p-5 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* University Logo DP */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-white p-2.5 sm:p-3.5 border-2 border-border shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                  <UniversityLogo idOrSlug={uni.slug} size="lg" raw={true} variant="dp" className="max-h-full max-w-full object-contain" />
                </div>

                <div className="space-y-1.5">
                  {/* Clean H1 Title */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {uni.name}
                  </h1>

                  {/* Rating & Location */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground font-normal">
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {(uni.rating ? Math.min(uni.rating, 4.6) : 4.4).toFixed(1)} / 5 ({uni.reviewsCount || "4,120"}+ reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-primary" /> {uni.location}
                    </span>
                    {uni.established && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Calendar size={12} /> Est. {uni.established}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row sm:flex-col gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                <a
                  href="#counseling-box"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm text-center shadow-sm hover:bg-primary/90 transition-all"
                >
                  Apply for Admission
                </a>
                <Link
                  to="/universities/compare"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-medium text-xs text-center border border-border transition-colors"
                >
                  Compare University
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. CLEAN STICKY SUBNAV TABS (Flush directly under header)         */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="sticky top-[96px] md:top-[100px] z-30 bg-background/95 backdrop-blur-md">
          <div className="container-dg max-w-6xl">
            <div className="relative flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar py-0 text-xs sm:text-sm font-medium">
              {[
                { id: "overview", label: "About" },
                { id: "courses", label: isAmity ? "Courses & Fees (2026)" : "Courses & Fees" },
                { id: "placements", label: "Placements" },
                { id: "faculty", label: "Faculty" },
                { id: "admission", label: "Admission Process" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "overview" | "courses" | "placements" | "faculty" | "admission")}
                  className={`relative py-3 sm:py-3.5 px-3.5 sm:px-5 text-xs sm:text-sm transition-all whitespace-nowrap outline-none focus:outline-none focus-visible:outline-none ${
                    activeTab === tab.id
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] h-[2.5px] bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. MAIN CONTENT & COUNSELING SIDEBAR                              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="py-8">
          <div className="container-dg max-w-6xl space-y-12">
            {/* Full Width Tabbed Content */}
            <div className="w-full space-y-8">
                
                {/* ── TAB 1: OVERVIEW / ABOUT ── */}
                {activeTab === "overview" && (
                  <section className="space-y-6">
                    {/* About Section */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground">
                          About <span className="text-primary">{uni.shortName || uni.name}</span>
                        </h2>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {uni.description || `${uni.name} is India's first UGC-recognized online university, ranked among Asia's top digital higher education providers with global WES credential recognition.`}
                      </p>

                      {/* 6-Metric Clean Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Total Fee Range</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">{uni.feeRange}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">No-Cost EMI</span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            From {uni.emiStarting || "₹3,850/mo"}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Examination Mode</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">100% Online Web Proctored</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Learning Format</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">Live & Recorded Lectures</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Admission Session</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">July 2026 Batch Open</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Placement Support</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">
                            350+ Recruiting Partners
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── WHY SAY YES TO AMITY ONLINE? (12 Official Pillars with Logos & Badges) ── */}
                    {isAmity && (
                      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                              <Sparkles size={12} />
                              <span>Global Benchmarks & Innovation</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                              Why say Yes to <span className="text-primary">Amity Online?</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                              India's highest globally accredited digital university — combining USA & UK institutional quality benchmarks, cutting-edge AI mentors, and top-tier career mobility.
                            </p>
                          </div>

                          {/* Filter Tabs */}
                          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto no-scrollbar text-xs font-medium self-start md:self-auto">
                            {[
                              { id: "all", label: "All (12)" },
                              { id: "accreditation", label: "Accreditations (5)" },
                              { id: "learning", label: "Learning & AI (4)" },
                              { id: "career", label: "Career & Placements (3)" },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setWhyAmityFilter(tab.id as "all" | "accreditation" | "learning" | "career")}
                                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                                  whyAmityFilter === tab.id
                                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 12 Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
                          {filteredWhyAmity.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <div
                                key={item.id}
                                className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between space-y-4 group"
                              >
                                <div className="space-y-3">
                                  {/* Header: Logo / Icon & Badge */}
                                  <div className="flex items-center justify-between gap-3">
                                    {item.logo ? (
                                      <div className="h-12 w-28 sm:w-32 rounded-xl bg-white border border-border/60 shadow-2xs p-1.5 flex items-center justify-center shrink-0">
                                        <img
                                          src={item.logo}
                                          alt={item.title}
                                          className="max-h-full max-w-full object-contain"
                                          loading="lazy"
                                        />
                                      </div>
                                    ) : (
                                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${item.themeBg || "bg-primary/10 text-primary border-primary/20"}`}>
                                        {IconComponent && <IconComponent size={20} />}
                                      </div>
                                    )}

                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted/80 text-foreground/80 border border-border/60 text-right">
                                      {item.badge}
                                    </span>
                                  </div>

                                  {/* Title & Description */}
                                  <div className="space-y-1.5">
                                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                                      {item.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Bottom Highlight strip */}
                                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-primary inline-flex items-center gap-1">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    <span>{item.highlight}</span>
                                  </span>
                                  <a
                                    href="#counseling-box"
                                    className="text-muted-foreground hover:text-primary transition-colors font-medium inline-flex items-center gap-1"
                                  >
                                    <span>Learn more</span>
                                    <ChevronRight size={12} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── STATUTORY ACCREDITATIONS (Bigger Logos, Swipable on Mobile, Click-to-Explain Modal) ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                          {uni.name} <span className="text-primary">Accreditations</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Click on any accreditation badge to view what it means and how it benefits your career.
                        </p>
                      </div>

                      {/* Mobile Swipable Carousel & Desktop Grid */}
                      <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 overflow-x-auto snap-x scrollbar-none gap-3.5 sm:gap-5 py-2 px-1 -mx-1">
                        {(isAmity ? amityAuthorityLogos : authorityLogos).map((auth, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setSelectedAccreditation(auth)}
                            className="group shrink-0 snap-center w-[185px] sm:w-auto min-h-[160px] sm:min-h-[175px] rounded-2xl bg-white border border-border/80 shadow-xs hover:shadow-xl hover:border-primary/50 transition-all p-3 flex flex-col items-center justify-between text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-98 overflow-hidden"
                          >
                            <div className="w-full flex-1 flex items-center justify-center p-[15px] min-h-[96px] sm:min-h-[110px]">
                              <img
                                src={auth.icon || auth.img}
                                alt={auth.name}
                                className="max-h-20 sm:max-h-24 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <div className="w-full bg-[#EBF3FF] dark:bg-[#1E3A8A]/30 text-[#1E40AF] dark:text-[#93C5FD] font-bold text-xs py-1.5 px-2 rounded-xl text-center truncate">
                              {auth.shortName || auth.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── SAMPLE DEGREE CERTIFICATE SECTION (Clear Image with Clickable Zoom) ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Left Column: Value propositions */}
                        <div className="md:col-span-7 space-y-4">
                          <div className="space-y-1.5">
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                              Sample Certificate from {uni.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {isManipal
                                ? "Become an alumnus of Manipal University Jaipur (Directorate of Online Education) and earn a UGC-DEB approved, NAAC A+ accredited degree with global WES credential recognition."
                                : isCu
                                ? "Become an alumnus of Chandigarh University Online and earn a UGC-DEB entitled, NAAC A+ accredited online degree with global WES credential recognition."
                                : isSharda
                                ? "Become an alumnus of Sharda University Online and earn a UGC-DEB approved online degree. Conferred with NAAC A+ accreditation, AICTE approval, and WES global equivalency."
                                : `Become an alumnus of ${uni.name} and get a UGC-approved online degree. Conferred with NAAC A+ accreditation, AICTE approval, and global recognition.`
                              }
                            </p>
                          </div>

                          {/* 4 Checkmark bullets */}
                          <div className="space-y-3 pt-1">
                            {(isManipal
                              ? [
                                  "Conferred by Manipal University Jaipur Directorate of Online Education.",
                                  "Entitled by UGC-DEB under Section 2(f) of the UGC Act, 1956.",
                                  "NAAC A+ Accredited with global WES credential evaluation equivalency.",
                                  "100% equivalent to traditional on-campus degree for govt. & corporate jobs.",
                                ]
                              : isCu
                              ? [
                                  "Conferred by Chandigarh University (Centre for Distance and Online Learning).",
                                  "Entitled by UGC-DEB and approved by AICTE for professional programs.",
                                  "NAAC A+ Accredited institution ranked #1 among private universities in India.",
                                  "Global WES recognized for international employment, higher studies & PR.",
                                ]
                              : isSharda
                              ? [
                                  "NAAC A+ Accredited University with globally recognized credentials.",
                                  "Approved by UGC-DEB for online Bachelor's and Master's degree programs.",
                                  "AICTE approved for technical and professional management curriculum.",
                                  "Degree recognized by World Education Services (WES) for US & Canada equivalency.",
                                ]
                              : [
                                  `100% UGC-DEB entitled online degree conferred by ${uni.name}.`,
                                  "Approved by AICTE for relevant professional & technical programs.",
                                  "Recognized by World Education Services (WES) across Canada & USA.",
                                  "Valid for UPSC, state/central government jobs, and corporate recruitment.",
                                ]
                            ).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check size={13} strokeWidth={3} />
                                </div>
                                <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <a
                              href="#counseling-box"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              <span>Apply for UGC-accredited degree</span>
                              <ArrowRight size={13} />
                            </a>
                          </div>
                        </div>

                        {/* Right Column: Framed Sample Certificate with Instant Clickable Zoom */}
                        <div className="md:col-span-5 flex justify-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="cursor-pointer group relative rounded-2xl overflow-hidden border-2 border-border/80 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all max-w-[280px] sm:max-w-[320px] bg-white">
                                <img
                                  src={isManipal ? "/assets/universities/manipal-sample-degree.png" : isCu ? "/assets/universities/cu-sample-degree.jpg" : isSharda ? "/assets/universities/sharda-sample-degree.jpg" : "/assets/universities/amity-sample-degree.png"}
                                  alt={`${uni.name} Sample Degree Certificate`}
                                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-102"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                                  <ZoomIn size={18} />
                                  <span>Click to Zoom</span>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl p-6 bg-card border-border overflow-hidden">
                              <DialogHeader>
                                <DialogTitle className="text-base font-bold text-foreground">
                                  {uni.name} — Official Degree Specimen
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center justify-center p-2 max-h-[80vh] overflow-y-auto">
                                <img
                                  src={isManipal ? "/assets/universities/manipal-sample-degree.png" : isCu ? "/assets/universities/cu-sample-degree.jpg" : isSharda ? "/assets/universities/sharda-sample-degree.jpg" : "/assets/universities/amity-sample-degree.png"}
                                  alt={`${uni.name} Degree Full Specimen`}
                                  className="max-h-[75vh] w-auto object-contain rounded-xl border border-border shadow-2xl"
                                />
                                <div className="mt-3 text-center">
                                  <p className="text-xs text-muted-foreground font-medium">
                                    Official specimen conferred under UGC-DEB regulations. Legally equivalent to on-campus degrees.
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 2: COURSES & FEES (Program Cards + Table matching Image 3) ── */}
                {activeTab === "courses" && (
                  <section className="space-y-8">
                    {/* 1. Program Cards Showcase (Matching Image 3) */}
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            {uni.name} <span className="text-primary">Courses</span>
                          </h2>
                        </div>

                        {/* Search Filter Input */}
                        <div className="relative min-w-[200px]">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Clean Category Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {(isAmity
                          ? [
                              { id: "ug", label: "UG Courses" },
                              { id: "pg", label: "PG Courses" },
                              { id: "certifications", label: "Certifications & Diplomas" },
                              { id: "collaborative", label: "Industry Collaborative" },
                              { id: "integrated", label: "Dual Degree / Integrated" },
                            ]
                          : isSgt
                          ? [
                              { id: "ug", label: "UG Courses" },
                              { id: "pg", label: "PG Courses" },
                              { id: "certifications", label: "Certifications & Diplomas" },
                            ]
                          : isLiverpool || isForeignDoctorate
                          ? [
                              { id: "pg", label: "Master's & Doctorate Degrees" },
                            ]
                          : [
                              { id: "ug", label: "UG Courses" },
                              { id: "pg", label: "PG Courses" },
                            ]
                        ).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setCourseCategoryTab(cat.id as any)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                              courseCategoryTab === cat.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-card border border-border/80 text-foreground/80 hover:bg-muted"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {courseCategoryTab === "certifications" ? (
                        /* Certifications & Diplomas Showcase (from CSV Data) */
                        <div className="space-y-4 animate-in fade-in-50 duration-200">
                          <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-foreground">
                                {uni.name} — Specialized Certifications & Diplomas
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Industry-focused short-term credentials, executive skill tracks & university certifications with low starting fees.
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 self-start sm:self-auto">
                              Low Entry Fees from {uniCertifications[0]?.feeFormatted || uni.feeRange.split(/[–-]/)[0]?.trim()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {uniCertifications.length > 0 ? (
                              uniCertifications.map((cert) => (
                                <div
                                  key={cert.id}
                                  className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                                >
                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="font-semibold px-2 py-0.5 rounded bg-muted text-foreground/80">
                                        {cert.duration}
                                      </span>
                                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {cert.mode}
                                      </span>
                                    </div>

                                    <h4 className="text-sm font-bold text-foreground leading-snug">
                                      {cert.name}
                                    </h4>

                                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                                      Eligibility: {cert.eligibility}
                                    </p>

                                    <div className="flex flex-wrap gap-1 pt-1">
                                      {cert.skills.map((skill, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="px-2 py-0.5 rounded bg-secondary/80 text-[10px] font-medium text-foreground/80"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                                    <div>
                                      <span className="text-[9px] text-muted-foreground block">Total Program Fee</span>
                                      <span className="text-sm font-extrabold text-foreground">{cert.feeFormatted}</span>
                                      {cert.emiFormatted && (
                                        <span className="text-[10px] text-muted-foreground block">{cert.emiFormatted}</span>
                                      )}
                                    </div>

                                    <a
                                      href="#counseling-box"
                                      onClick={() => setSelectedCourse(cert.name)}
                                      className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
                                    >
                                      Inquire
                                    </a>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full py-10 text-center space-y-2">
                                <p className="text-xs sm:text-sm font-semibold text-foreground">
                                  Certifications for {uni.name}
                                </p>
                                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                  This institution primarily specializes in degree programs. Explore the full curriculum under the UG Courses and PG Courses tabs.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* PROGRAM CARDS GRID (Unique Degrees with Specializations Dropdown & Links) */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {displayPrograms.map((prog) => {
                          return (
                            <div
                              key={prog.id}
                              className="group rounded-3xl bg-card border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                            >
                              <div>
                                {/* Top Thumbnail with University Badge & Partner Badge */}
                                <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                  <img
                                    src={prog.thumbnail}
                                    alt={prog.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                                    loading="lazy"
                                  />
                                  {/* Small Compact University Crest Badge Overlay */}
                                  <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl bg-white/95 backdrop-blur-sm shadow-xs border border-slate-200/90 p-1 flex items-center justify-center overflow-hidden">
                                    <UniversityLogo idOrSlug={uni.slug} size="sm" raw={true} variant="dp" className="max-h-full max-w-full object-contain" />
                                  </div>

                                  {prog.industryPartner && (
                                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                                      {prog.industryPartner} Co-Created
                                    </div>
                                  )}
                                </div>

                                {/* Content Details */}
                                <div className="p-4 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                                      {uni.name}
                                    </span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                      {prog.degreeLevel}
                                    </span>
                                  </div>

                                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                    <Link to={`/programs/${prog.slug}`} className="hover:underline">
                                      {prog.name}
                                    </Link>
                                  </h3>

                                  {/* Tuition Fee & Duration */}
                                  <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] text-muted-foreground block">Tuition Fee</span>
                                      <span className="text-sm font-bold text-foreground">
                                        ₹{prog.tuitionFee.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                      <span className="text-[10px] text-muted-foreground block">Duration</span>
                                      <span className="text-xs font-semibold text-foreground">
                                        {prog.duration}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Specializations Dropdown Button */}
                                  {prog.specializations && prog.specializations.length > 0 && (
                                    <div className="pt-1">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedProgramId(expandedProgramId === prog.id ? null : prog.id)}
                                        className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-xs font-semibold text-foreground border border-border/60 transition-colors cursor-pointer"
                                      >
                                        <span className="flex items-center gap-1.5 text-primary font-bold">
                                          <Layers size={13} />
                                          <span>{prog.specializations.length} Specializations</span>
                                        </span>
                                        <ChevronDown
                                          size={14}
                                          className={`text-muted-foreground transition-transform duration-200 ${
                                            expandedProgramId === prog.id ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>

                                      {/* Clean Specialization Badges */}
                                      {expandedProgramId === prog.id && (
                                        <div className="mt-2.5 p-2.5 rounded-2xl bg-muted/30 border border-border/70 flex flex-wrap gap-1.5 animate-in fade-in-50 duration-200">
                                          {prog.specializations.map((spec, sIdx) => (
                                            <div
                                              key={sIdx}
                                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/70 hover:border-primary/50 text-xs font-semibold text-foreground transition-all duration-150 shadow-2xs hover:bg-primary/5 cursor-default select-none"
                                            >
                                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                              <span>{spec}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Card Footer Actions */}
                              <div className="p-4 pt-0 flex items-center justify-between">
                                <Link
                                  to={`/programs/${prog.slug}`}
                                  className="text-xs font-semibold text-primary group-hover:underline inline-flex items-center gap-1"
                                >
                                  <span>View Course</span>
                                  <ChevronRight size={14} />
                                </Link>

                                <a
                                  href="#counseling-box"
                                  onClick={() => setSelectedCourse(prog.name)}
                                  className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                                >
                                  Apply Now
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    </div>

                    {/* 2. AMITY ONLINE Course Wise Updated Fees 2026 Table (Only for Amity) */}
                    {isAmity && courseCategoryTab !== "guaranteed" && (
                    <div className="space-y-4 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            Course Wise <span className="text-primary">Updated Fees 2026</span>
                          </h3>
                        </div>

                        {/* Direct vs Loan Switcher */}
                        <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/60 text-xs font-medium self-start sm:self-auto">
                          <button
                            onClick={() => setPaymentMode("direct")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              paymentMode === "direct"
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Direct Payment (Up to 12% off)
                          </button>
                          <button
                            onClick={() => setPaymentMode("loan")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              paymentMode === "loan"
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Loan General / 0% EMI
                          </button>
                        </div>
                      </div>

                      {/* Clean Table */}
                      <div className="rounded-3xl border border-border overflow-hidden bg-card shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-[#002E5E] text-white text-xs font-semibold">
                              <tr>
                                <th className="py-3 px-4">Course</th>
                                <th className="py-3 px-4">Full Fees</th>
                                <th className="py-3 px-4">Semester Fee</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {filteredAmityPrograms.map((prog) => {
                                const plan = paymentMode === "direct" ? prog.direct : prog.loan;
                                const isGreen = prog.name.includes("LENSKART");

                                return (
                                  <tr
                                    key={prog.sNo}
                                    className={`hover:bg-muted/40 transition-colors ${
                                      isGreen ? "bg-emerald-500/[0.04]" : ""
                                    }`}
                                  >
                                    <td className="py-3 px-4 font-semibold text-foreground">
                                      <div className="flex items-center gap-2">
                                        <span>{prog.name}</span>
                                        {isGreen && (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                            Lenskart
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-foreground">
                                      ₹{plan.oneTimeFee.toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                      {plan.semesterFee > 0 ? `₹${plan.semesterFee.toLocaleString("en-IN")}` : "Annual basis"}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                      {prog.duration}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <a
                                        href="#counseling-box"
                                        onClick={() => setSelectedCourse(prog.name)}
                                        className="text-primary hover:underline font-semibold text-xs inline-flex items-center gap-1"
                                      >
                                        Apply <ArrowRight size={11} />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                    {/* 3. CHANDIGARH UNIVERSITY ONLINE Fee Structure (Clean & Simple) */}
                    {isCu && (
                      <div className="space-y-4 pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-1">
                              Session – Jul 2026
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-foreground">
                              Fee Structure & <span className="text-primary">Installments</span>
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Transparent semester-wise and annual fee breakdown with Early Bird Discount (EBD).
                            </p>
                          </div>
                          <Link
                            to="/tools/roi-calculator"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
                          >
                            <Calculator size={13} />
                            <span>ROI Calculator</span>
                          </Link>
                        </div>

                        <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                              <thead className="bg-slate-900 text-white dark:bg-slate-800 text-xs font-semibold">
                                <tr>
                                  <th className="py-3 px-3 text-center w-12">#</th>
                                  <th className="py-3 px-4">Program</th>
                                  <th className="py-3 px-3 text-center">Level</th>
                                  <th className="py-3 px-3 text-center">EBD Offer</th>
                                  <th className="py-3 px-3 text-center">Semester Fee</th>
                                  <th className="py-3 px-3 text-center">Annual Fee</th>
                                  <th className="py-3 px-3 text-center font-bold">Total Fees</th>
                                  <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                                {[
                                  { program: "Online BBA", level: "UG", ebd: "25% Off", semFee: "21,875", annualFee: "43,750", lumpSumFee: "1,31,250", slug: "online-bba" },
                                  { program: "Online BBA (Business Analytics)", level: "UG", ebd: "13% Off", semFee: "27,550", annualFee: "55,100", lumpSumFee: "1,65,300", slug: "online-bba" },
                                  { program: "Online BCA", level: "UG", ebd: "25% Off", semFee: "22,125", annualFee: "44,250", lumpSumFee: "1,32,750", slug: "online-bca" },
                                  { program: "Online BA JMC", level: "UG", ebd: "25% Off", semFee: "21,875", annualFee: "43,750", lumpSumFee: "1,31,250", slug: "online-ba" },
                                  { program: "Online BBA (Microsoft)", level: "UG", ebd: "20% Off", semFee: "23,333", annualFee: "46,667", lumpSumFee: "1,40,000", slug: "online-bba" },
                                  { program: "Online BCA (Microsoft)", level: "UG", ebd: "20% Off", semFee: "23,600", annualFee: "47,200", lumpSumFee: "1,41,600", slug: "online-bca" },
                                  { program: "Online MBA", level: "PG", ebd: "25% Off", semFee: "41,250", annualFee: "82,500", lumpSumFee: "1,65,000", slug: "online-mba" },
                                  { program: "Online MBA (Business Analytics)", level: "PG", ebd: "10% Off", semFee: "45,000", annualFee: "90,000", lumpSumFee: "1,80,000", slug: "online-mba" },
                                  { program: "Online MCA", level: "PG", ebd: "25% Off", semFee: "29,063", annualFee: "58,125", lumpSumFee: "1,16,250", slug: "online-mca" },
                                  { program: "Online MAJMC", level: "PG", ebd: "25% Off", semFee: "27,188", annualFee: "54,375", lumpSumFee: "1,08,750", slug: "online-ma" },
                                  { program: "Online MSc Data Science", level: "PG", ebd: "25% Off", semFee: "27,500", annualFee: "55,001", lumpSumFee: "1,10,001", slug: "online-msc" },
                                  { program: "Online MA English", level: "PG", ebd: "25% Off", semFee: "18,750", annualFee: "37,500", lumpSumFee: "75,000", slug: "online-ma" },
                                  { program: "Online MA Economics", level: "PG", ebd: "25% Off", semFee: "18,750", annualFee: "37,500", lumpSumFee: "75,000", slug: "online-ma" },
                                  { program: "Online MSc Mathematics", level: "PG", ebd: "25% Off", semFee: "18,750", annualFee: "37,500", lumpSumFee: "75,000", slug: "online-msc" },
                                  { program: "Online MBA (Project Management & Pwe)", level: "PG", ebd: "18% Off", semFee: "45,100", annualFee: "90,200", lumpSumFee: "1,80,400", slug: "online-mba" },
                                ]
                                  .filter((row) => {
                                    if (courseCategoryTab === "ug" && row.level !== "UG") return false;
                                    if (courseCategoryTab === "pg" && row.level !== "PG") return false;
                                    if (searchQuery.trim()) {
                                      return row.program.toLowerCase().includes(searchQuery.toLowerCase());
                                    }
                                    return true;
                                  })
                                  .map((row, idx) => (
                                    <tr key={row.program} className="hover:bg-primary/5 transition-colors even:bg-muted/20">
                                      <td className="py-2.5 px-3 text-center font-medium text-muted-foreground">{idx + 1}</td>
                                      <td className="py-2.5 px-4 font-bold text-foreground">
                                        <Link to={`/programs/${row.slug}`} className="hover:text-primary transition-colors">
                                          {row.program}
                                        </Link>
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${row.level === "UG" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-purple-500/10 text-purple-600 dark:text-purple-400"}`}>
                                          {row.level}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                          {row.ebd}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-center font-semibold text-foreground">₹{row.semFee}</td>
                                      <td className="py-2.5 px-3 text-center text-muted-foreground">₹{row.annualFee}</td>
                                      <td className="py-2.5 px-3 text-center font-bold text-primary">₹{row.lumpSumFee}</td>
                                      <td className="py-2.5 px-4 text-right">
                                        <a
                                          href="#counseling-box"
                                          onClick={() => setSelectedCourse(`CU - ${row.program}`)}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-2xs whitespace-nowrap"
                                        >
                                          <span>Apply Now</span>
                                          <ArrowRight size={11} />
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="py-2.5 px-4 bg-muted/40 border-t border-border/60 text-[11px] text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span>* One-time Registration & Prospectus fee of ₹1,000 applies at the time of admission.</span>
                            <span className="font-medium text-foreground/80">EMI options available starting from ₹3,500/month.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* ── TAB 3: PLACEMENTS (Real Logos, No Fillers) ── */}
                {activeTab === "placements" && (
                  <section className="space-y-6">
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Career Assistance & Hiring Drives
                        </span>
                        <h2 className="text-xl font-bold text-foreground">
                          Placement Support & Corporate Connect
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {isCu
                            ? "Chandigarh University Online provides comprehensive placement support with over 300+ hiring partners, high-value corporate drives, and career incubation."
                            : isSgt
                            ? "SGT University Online equips students with industry-relevant skills, comprehensive career guidance, and corporate recruitment drives across leading industry partners."
                            : isSharda
                            ? "Sharda University Online equips learners with hands-on, industry-relevant skills. Active placement cells conduct dedicated corporate recruitment drives and mock interview preparation."
                            : "Amity Online provides dedicated corporate drives, virtual career fairs, mock interviews, and career counseling to bridge the gap between academic learning and corporate leadership."
                          }
                        </p>
                      </div>

                      {/* 3 Placement Highlights */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1">
                          <span className="text-[11px] text-muted-foreground font-medium block">Highest Package</span>
                          <span className="text-xl font-bold text-foreground block">
                            {isCu ? "₹1.7 Cr" : isSgt ? "₹36 LPA" : isSharda ? "₹10 LPA" : "₹18 LPA"}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                            {isCu ? "International (₹54 LPA National)" : "Tier-1 MNCs"}
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1">
                          <span className="text-[11px] text-muted-foreground font-medium block">Average Package / Hike</span>
                          <span className="text-xl font-bold text-foreground block">
                            {isCu ? "+50% Hike" : isSgt ? "₹6.5 LPA" : isSharda ? "₹5.8 LPA" : "₹7.2 LPA"}
                          </span>
                          <span className="text-[10px] text-muted-foreground block font-medium">
                            {isCu ? "3X Interview Opportunities" : "+48% Average Hike"}
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-[11px] text-muted-foreground font-medium block">Hiring Partners</span>
                          <span className="text-xl font-bold text-foreground block">
                            {isCu ? "300+" : isSgt ? "275+" : "350+"}
                          </span>
                          <span className="text-[10px] text-primary block font-medium">
                            {isCu ? "Tier-1 Global & National Recruiters" : "Active Recruiting Networks"}
                          </span>
                        </div>
                      </div>

                      {/* Real Recruiting Company Logos */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Top Recruiting Companies
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {(isCu ? cuPlacementCompanies : placementCompanies).map((comp, idx) => (
                            <div
                              key={idx}
                              className="h-16 rounded-2xl bg-white border border-border/80 shadow-xs flex items-center justify-center p-3 hover:shadow-md transition-shadow"
                            >
                              <img
                                src={comp.logo}
                                alt={comp.name}
                                className="max-h-8 max-w-[85%] object-contain"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Career Acceleration Highlights */}
                      <div className="pt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-xs font-semibold text-foreground block">Resume Enhancement</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">ATS-friendly resumes curated by HR leaders.</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-xs font-semibold text-foreground block">1-on-1 Mentorship</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Mock technical & behavioural interviews.</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-xs font-semibold text-foreground block">Virtual Job Fairs</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Bi-annual job fairs across 350+ partners.</p>
                        </div>
                      </div>
                    </div>

                    {/* Sharda Online BCA Job Roles & Average Salary Breakdown (Verified Reference) */}
                    {isSharda && (
                      <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Program Career Insights
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-foreground">
                            Job Roles & Salary Prospects — <span className="text-primary">Sharda Online BCA</span>
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Online BCA at Sharda University Online equips students with required industry-relevant engineering skills to build successful careers in the IT and software domains.
                          </p>
                        </div>

                        {/* Major Active Hiring Partners for BCA */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Major Active Hiring Partners (Online BCA)
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {["Pepsi", "Sleepwell", "Tech Mahindra", "Vodafone", "Adani Wilmar", "Amazon", "HCL", "Genpact"].map((partner, idx) => (
                              <span key={idx} className="px-3 py-1.5 rounded-xl bg-muted/40 border border-border/60 text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Check size={13} className="text-primary" />
                                <span>{partner}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Salary Table */}
                        <div className="overflow-x-auto rounded-2xl border border-border/80">
                          <table className="w-full text-xs">
                            <thead className="bg-muted/60 border-b border-border/80 text-foreground font-bold">
                              <tr>
                                <th className="py-3 px-4 text-left">Job Prospects</th>
                                <th className="py-3 px-4 text-right">Average Salary (LPA)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {[
                                { role: "Associate", salary: "INR 7,50,000" },
                                { role: "Data Analyst", salary: "INR 7,08,000" },
                                { role: "Audit Assistant", salary: "INR 5,00,004" },
                                { role: "Business Development Associate", salary: "INR 3,60,000" },
                                { role: "Associate Consultant", salary: "INR 3,10,000" },
                                { role: "Customer Service Professional", salary: "INR 2,55,000" },
                              ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                  <td className="py-3 px-4 font-semibold text-foreground">{row.role}</td>
                                  <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{row.salary}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* ── TAB 4: FACULTY ── */}
                {activeTab === "faculty" && (
                  <section className="space-y-6">
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Distinguished Mentors
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          Faculty
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Learn directly from internationally acclaimed researchers, professors, and industry leaders with decades of academic rigor and corporate executive experience.
                        </p>
                      </div>

                      {/* 3-Column Spacious Grid for full width layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {currentFacultyList.map((fac) => (
                          <div
                            key={fac.id}
                            className="p-5 rounded-3xl bg-card border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              {/* Avatar & Core Designation */}
                              <div className="flex items-start gap-3.5 sm:gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden border border-border/60 shrink-0">
                                  <img
                                    src={fac.avatar}
                                    alt={fac.name}
                                    className="w-full h-full object-cover object-top"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <h3 className="text-base font-bold text-foreground leading-tight">
                                    {fac.name}
                                  </h3>
                                  <p className="text-xs font-semibold text-primary">
                                    {fac.designation}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {fac.qualification}
                                  </p>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                {fac.bio}
                              </p>
                            </div>

                            {/* View Profile Modal Trigger */}
                            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground font-medium">Weekend Masterclasses</span>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button
                                    onClick={() =>
                                      setSelectedFaculty({
                                        name: fac.name,
                                        designation: fac.designation,
                                        qualification: fac.qualification,
                                        experience: "10+ Years",
                                        specialization: fac.designation,
                                        image: fac.avatar,
                                        bio: fac.bio,
                                      })
                                    }
                                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>View Profile</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-6 bg-card border-border">
                                  <DialogHeader>
                                    <DialogTitle className="text-base font-bold text-foreground">
                                      Faculty Profile
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-4">
                                      <img
                                        src={fac.avatar}
                                        alt={fac.name}
                                        className="w-20 h-20 rounded-2xl object-cover border border-border shadow-sm"
                                      />
                                      <div>
                                        <h3 className="text-base font-bold text-foreground">{fac.name}</h3>
                                        <div className="text-xs font-semibold text-primary">{fac.designation}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{fac.qualification}</div>
                                      </div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs text-foreground/90 leading-relaxed">
                                      {fac.bio}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                      <CheckCircle2 size={13} className="text-emerald-500" />
                                      <span>Conducts live weekend masterclasses & doubt-solving clinics</span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 5: ADMISSION PROCESS ── */}
                {activeTab === "admission" && (
                  <section className="space-y-6">
                    {/* Visual 5-Step Process matching user reference screenshot */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-8">
                      {/* Top Header Row matching screenshot */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white tracking-tight">
                            Admission Process
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Seamless 100% digital enrollment workflow for {uni.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            document.getElementById("counseling-box")?.scrollIntoView({ behavior: "smooth" });
                            const nameInput = document.getElementById(nameInputId);
                            if (nameInput) nameInput.focus();
                          }}
                          className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
                        >
                          Get Admission Support
                        </button>
                      </div>

                      {/* Clean, Structured 5-Step Process (Mobile & Desktop Optimized) */}
                      <div className="py-2">
                        {/* Mobile View: Clean Vertical Timeline Cards */}
                        <div className="flex flex-col md:hidden space-y-3">
                          {[
                            {
                              step: "01",
                              title: "Select Your Program",
                              desc: "Choose the UGC-DEB approved degree matching your career goals.",
                              icon: Laptop,
                              color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                            },
                            {
                              step: "02",
                              title: "Complete Application",
                              desc: "Fill in your personal details and upload required academic certificates.",
                              icon: FileText,
                              color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
                            },
                            {
                              step: "03",
                              title: "Pay Program Fees",
                              desc: "Pay securely via Net Banking, UPI, or select 0% No-Cost EMI financing.",
                              icon: IndianRupee,
                              color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
                            },
                            {
                              step: "04",
                              title: "Document Verification",
                              desc: "University admissions committee verifies your eligibility and documents.",
                              icon: MousePointerClick,
                              color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
                            },
                            {
                              step: "05",
                              title: "Enrollment & LMS Access",
                              desc: "Receive your official Student ID (PRN) and get access to the digital portal.",
                              icon: CheckCircle2,
                              color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
                            },
                          ].map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                              <div
                                key={item.step}
                                className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border/80 shadow-xs"
                              >
                                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${item.color}`}>
                                  <IconComponent size={20} strokeWidth={2.2} />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground tracking-wider">
                                      Step {item.step}
                                    </span>
                                  </div>
                                  <h3 className="text-xs sm:text-sm font-bold text-foreground pt-0.5">
                                    {item.title}
                                  </h3>
                                  <p className="text-[11px] text-muted-foreground leading-snug">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Desktop & Tablet View: Structured 5-Step Grid */}
                        <div className="hidden md:grid md:grid-cols-5 gap-3">
                          {[
                            {
                              step: "01",
                              title: "Select Program",
                              desc: "Choose the approved degree for your goals.",
                              icon: Laptop,
                              color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                            },
                            {
                              step: "02",
                              title: "Complete Application",
                              desc: "Submit details & upload academic certificates.",
                              icon: FileText,
                              color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
                            },
                            {
                              step: "03",
                              title: "Pay Program Fees",
                              desc: "Secure online payment or No-Cost EMI.",
                              icon: IndianRupee,
                              color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
                            },
                            {
                              step: "04",
                              title: "Verification",
                              desc: "Instant document check by university cell.",
                              icon: MousePointerClick,
                              color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
                            },
                            {
                              step: "05",
                              title: "LMS Access",
                              desc: "Get PRN enrollment & start learning.",
                              icon: CheckCircle2,
                              color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
                            },
                          ].map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <div
                                key={item.step}
                                className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-all shadow-xs space-y-2.5"
                              >
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  Step {item.step}
                                </span>
                                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${item.color}`}>
                                  <IconComponent size={22} strokeWidth={2.2} />
                                </div>
                                <h3 className="text-xs font-bold text-foreground leading-snug">
                                  {item.title}
                                </h3>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                  {item.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Breakdown & Eligibility Criteria */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Official Eligibility & Requirements
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                          Amity Online Admission Criteria
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Admissions are conducted strictly under UGC-DEB regulations. Check prerequisites for Undergraduate and Postgraduate programs.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                            <GraduationCap size={15} />
                            <span>Postgraduate (PG) Eligibility</span>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                            <li>Recognized Bachelor's degree (10+2+3 or 10+2+4 pattern) from a recognized university.</li>
                            <li>Minimum 50% aggregate marks (45% for SC/ST/OBC category candidates).</li>
                            <li>For Online MCA: BCA/B.Sc (CS/IT) or Bachelor's with Mathematics at 10+2 or Graduation.</li>
                            <li>No entrance test required for online programs (direct merit-based admission).</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                            <GraduationCap size={15} />
                            <span>Undergraduate (UG) Eligibility</span>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                            <li>10+2 (Higher Secondary) certificate from CBSE, ICSE, or any recognized State Board.</li>
                            <li>Minimum 45% aggregate marks (40% for reserved categories).</li>
                            <li>For Online BCA: Mathematics or Computer Science background preferred, or bridge module provided.</li>
                            <li>Eligible for 3-Year degree program with flexible online examinations.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Documents Required Checklist */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Mandatory Documents Required (Self-Attested Digital Copies)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            "10th & 12th Standard Mark Sheets & Passing Certificates",
                            "Graduation Consolidated Marksheet & Degree / Provisional (for PG)",
                            "Government Photo ID Proof (Aadhaar Card / Passport / Voter ID)",
                            "Recent Passport Size Color Photograph (JPEG/PNG format)",
                            "Scanned Signature on Plain White Paper",
                            "Work Experience Certificate (for Executive or Collaborative cohorts)",
                          ].map((doc, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs">
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-foreground/90 font-medium">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Degree Guru Dedicated Admission Assistance Box */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/25 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            <span>100% Free Official Support</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-foreground">
                            Need Help with Amity Online Admission & Fee Waivers?
                          </h3>
                          <p className="text-xs text-muted-foreground max-w-xl">
                            Our academic counselors will guide you through instant document verification, semester fee payment, and 0% interest EMI options with zero processing charges.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            document.getElementById("counseling-box")?.scrollIntoView({ behavior: "smooth" });
                            const nameInput = document.getElementById(nameInputId);
                            if (nameInput) nameInput.focus();
                          }}
                          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Connect with Counselor</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </section>
                )}


              </div>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* 6. FINAL CONTAINER: DEDICATED COUNSELING SECTION                 */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <div id="counseling-box" className="scroll-mt-32 max-w-xl mx-auto p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-xl space-y-6">
                <div className="text-center space-y-1.5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    Talk to our Counselor for <span className="text-primary">{uni.name}</span>
                  </h2>
                </div>

                {submitted ? (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-start gap-3 border border-emerald-500/20">
                    <CheckCircle2 size={20} className="shrink-0 text-emerald-500 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block text-sm">Request Received Successfully!</span>
                      <p>Our dedicated academic counselor for {uni.name} will connect with you shortly on WhatsApp / Phone.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label htmlFor={nameInputId} className="block text-xs font-semibold text-foreground/80 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id={nameInputId}
                        type="text"
                        required
                        placeholder="Your Full Name (e.g. Rahul Sharma)"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) setNameError("");
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-background border ${nameError ? "border-red-500 ring-1 ring-red-500/20" : "border-border"} text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                      />
                      {nameError && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1">{nameError}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={phoneInputId} className="block text-xs font-semibold text-foreground/80 mb-1.5">
                        Phone *
                      </label>
                      <div className={`relative flex rounded-xl border ${phoneError ? "border-red-500 ring-1 ring-red-500/20" : "border-border"} bg-background focus-within:ring-2 focus-within:ring-primary/40 overflow-hidden`}>
                        {/* Country Code Dropdown (Default +91) */}
                        <div className="relative border-r border-border bg-muted/40 shrink-0 flex items-center px-2.5 hover:bg-muted/70 transition-colors">
                          <span className="text-xs sm:text-sm font-bold text-foreground pr-3 select-none flex items-center gap-1.5">
                            <span>🇮🇳</span>
                            <span>{countryCode}</span>
                          </span>
                          <select
                            aria-label="Select Country Code"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          >
                            <option value="+91">🇮🇳 +91 (India)</option>
                            <option value="+971">🇦🇪 +971 (UAE)</option>
                            <option value="+1">🇺🇸 +1 (USA)</option>
                            <option value="+44">🇬🇧 +44 (UK)</option>
                            <option value="+1">🇨🇦 +1 (Canada)</option>
                            <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                            <option value="+65">🇸🇬 +65 (Singapore)</option>
                            <option value="+61">🇦🇺 +61 (Australia)</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-1.5 text-foreground/50 pointer-events-none" />
                        </div>

                        <input
                          id={phoneInputId}
                          type="tel"
                          required
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setPhone(val);
                            if (val.length > 0 && ["0", "1", "2", "3", "4", "5"].includes(val[0])) {
                              setPhoneError(`Indian mobile numbers start with 6, 7, 8, or 9 (numbers starting with ${val[0]} are not permitted).`);
                            } else {
                              if (phoneError) setPhoneError("");
                            }
                          }}
                          className="w-full px-3.5 py-3 text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1">{phoneError}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center cursor-pointer"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                )}
              </div>
          </div>
        </div>

        {/* ── ACCREDITATION EXPLAIN MODAL ── */}
        <Dialog open={!!selectedAccreditation} onOpenChange={(open) => !open && setSelectedAccreditation(null)}>
          <DialogContent className="max-w-md p-6 bg-card border-border rounded-2xl">
            {selectedAccreditation && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-3 border-b border-border/60">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-border/80 p-2.5 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={selectedAccreditation.icon || selectedAccreditation.img}
                      alt={selectedAccreditation.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                      {selectedAccreditation.fullName || selectedAccreditation.name}
                    </h3>
                    {selectedAccreditation.badge && (
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        {selectedAccreditation.badge}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {selectedAccreditation.singlePara || `${selectedAccreditation.shortDesc} ${selectedAccreditation.whyItMatters}`}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UniversityDetail;
