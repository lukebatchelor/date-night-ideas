// src/lib/api.ts

export interface DateNight {
    weekNumber: number;
    letter?: string;
    status: 'pending' | 'planned' | 'completed' | 'skipped';
    dateIdea?: string;
    plannedDate?: string;
    dateCompleted?: string;
  }
  
  export interface DateIdeasByLetter {
    [key: string]: string[];
  }
  
  const API_BASE = '/api';
  
  export const api = {
    async getDateNights(): Promise<DateNight[]> {
      const response = await fetch(`${API_BASE}/date-nights`);
      if (!response.ok) {
        throw new Error('Failed to fetch date nights');
      }
      const data = await response.json();
      return data.dateNights;
    },
  
    async getDateIdeas(): Promise<DateIdeasByLetter> {
      const response = await fetch(`${API_BASE}/date-ideas`);
      if (!response.ok) {
        throw new Error('Failed to fetch date ideas');
      }
      const data = await response.json();
      return data.dateIdeas;
    }
  };