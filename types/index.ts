export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'counselor' | 'admin';
  createdAt: string;
}

export interface Counselor {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  title: string;
  specialty: string[];
  experience: number;
  bio: string;
  rating: number;
  consultCount: number;
  price: number;
  status: 'active' | 'busy' | 'offline';
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover?: string;
  category: string;
  author: string;
  authorId: string;
  views: number;
  likes: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  image: string;
  link?: string;
  title: string;
  sort: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
  score: number;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  score: number;
  result: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  counselorId: string;
  counselorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  note?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  createdAt: string;
}
