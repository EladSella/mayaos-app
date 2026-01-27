export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export enum DocType {
  DOC = 'DOC',
  SHEET = 'SHEET',
  SLIDE = 'SLIDE',
  PDF = 'PDF',
  FOLDER = 'FOLDER'
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  type: DocType;
  updatedAt: string;
  owner: string;
  url: string;
  location: string; // e.g., "Client A / Strategy"
}

export enum EventType {
  BIRTHDAY = 'BIRTHDAY',
  CELEBRATION = 'CELEBRATION',
  HR = 'HR',
  OPS = 'OPS'
}

export interface FeedEvent {
  id: string;
  type: EventType;
  title: string;
  body: string;
  timestamp: string; // ISO date string
  icon?: string;
}