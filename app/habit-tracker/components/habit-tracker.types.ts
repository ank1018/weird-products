export type HabitCategory = 'health' | 'personal' | 'finance' | 'career' | 'social' | 'other';

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  category: HabitCategory;
  completedDates: string[];
  streak: number;
  createdAt: string;
  updatedAt: string;
  type: 'follow' | 'leave';
}