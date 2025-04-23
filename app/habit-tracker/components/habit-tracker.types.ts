export type HabitCategory = 'health' | 'personal' | 'finance' | 'career' | 'social' | 'other';

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  streak: number;
  category: HabitCategory;
  completedDates: string[];
  createdAt: string;
  updatedAt: string;
} 