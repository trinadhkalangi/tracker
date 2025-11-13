export enum View {
  Dashboard = 'DASHBOARD',
  Measurements = 'MEASUREMENTS',
  Appointments = 'APPOINTMENTS',
  Reports = 'REPORTS',
  Diary = 'DIARY',
  Community = 'COMMUNITY',
  Profile = 'PROFILE',
  ARMeasure = 'AR_MEASURE',
}

export interface UserProfile {
  name: string;
  dueDate: string; // ISO string format
  lastMenstrualPeriod: string; // ISO string format
}

export interface Measurement {
  id: string;
  date: string; // ISO string format
  circumference: number; // in cm
  weight: number; // in kg
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number; // in mg/dL
}

export interface Appointment {
  id: string;
  date: string; // ISO string format with time
  doctor: string;
  location: string;
  notes: string;
}

export interface MedicalReport {
  id: string;
  name: string;
  date: string; // ISO string format
  file: File;
  type: 'scan' | 'lab' | 'prescription' | 'bill';
}

export interface Photo {
  id: string;
  date: string; // ISO string format
  imageUrl: string; // base64 data URL
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string format
  content: string;
}

export interface ForumComment {
  id: string;
  author: string;
  date: string; // ISO string
  content: string;
}

export interface ForumPost {
  id:string;
  author: string;
  date: string; // ISO string
  title: string;
  content: string;
  comments: ForumComment[];
}

export interface ExpertQA {
    id: string;
    question: string;
    answer: string;
    expertName: string;
    expertTitle: string;
}