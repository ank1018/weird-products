import React, { useState, useMemo } from 'react';
import { Habit, HabitCategory } from "../habit-tracker.types";
import { isDateCompleted } from "../../helper/utils";
import './habit-calendar.css';

interface HabitCalendarViewProps {
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleResetMonth: () => void;
  monthName: string;
  calendarDays: (string | null)[];
  filteredHabits: Habit[];
  handleToggleCompletion: (habitId: string, date: string) => void;
  currentDate?: string; // Today's date string in ISO format
}

// Category color mapping
const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: '#10b981', // emerald-500
  personal: '#8b5cf6', // violet-500
  finance: '#f59e0b', // amber-500
  career: '#3b82f6', // blue-500
  social: '#ec4899', // pink-500
  other: '#6b7280', // gray-500
};

const HabitCalendarView = ({
  handlePrevMonth,
  handleNextMonth,
  handleResetMonth,
  monthName,
  calendarDays,
  filteredHabits,
  handleToggleCompletion,
  currentDate = new Date().toISOString().split('T')[0]
}: HabitCalendarViewProps) => {
  // State for view options
  // const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [sortOption, setSortOption] = useState<'streak' | 'priority' | 'alphabetical'>('streak');
  const [showStats, setShowStats] = useState<boolean>(true);

  // Calculate current month's stats
  const monthStats = useMemo(() => {
    const stats = {
      totalHabits: filteredHabits.length,
      completionRate: 0,
      followStreaks: 0,
      leaveStreaks: 0,
      bestStreak: 0,
      bestStreakHabit: '',
      currentStreaks: {} // Track current streaks by habit ID
    };

    if (filteredHabits.length > 0) {
      // Get first day of displayed month
      const firstDay = calendarDays.find(day => day !== null) || currentDate;
      const month = new Date(firstDay!).getMonth();

      // Count completions in current month
      let totalPossibleCompletions = 0;
      let totalCompletions = 0;

      filteredHabits.forEach(habit => {
        // Get completions for this month only
        const monthCompletions = habit.completedDates.filter(date =>
          new Date(date).getMonth() === month
        ).length;

        // For simplicity, assuming daily habits and counting days in month
        const daysInMonth = new Date(new Date(firstDay!).getFullYear(), month + 1, 0).getDate();
        totalPossibleCompletions += daysInMonth;
        totalCompletions += monthCompletions;

        // Calculate longest streak
        const sortedDates = [...habit.completedDates].sort((a, b) =>
          new Date(a).getTime() - new Date(b).getTime()
        );

        let currentStreak = 1;
        let longestStreak = 1;

        // Handle empty completedDates array
        if (sortedDates.length === 0) {
          currentStreak = 0;
          longestStreak = 0;
        } else if (sortedDates.length === 1) {
          // Single completion is a streak of 1
          currentStreak = 1;
          longestStreak = 1;
        } else {
          // Check for consecutive dates
          for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);

            // Check if dates are consecutive
            const diffTime = currDate.getTime() - prevDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (Math.round(diffDays) === 1) {
              // Consecutive day
              currentStreak++;
              longestStreak = Math.max(longestStreak, currentStreak);
            } else if (Math.round(diffDays) !== 0) {
              // Not consecutive (and not the same day), reset streak
              currentStreak = 1;
            }
            // If diffDays is 0 (same day duplicate), we ignore it
          }
        }

        // Store current streak for this habit
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (stats.currentStreaks as any)[habit.id] = currentStreak;

        // Check if this habit has the best overall streak
        if (longestStreak > stats.bestStreak) {
          stats.bestStreak = longestStreak;
          stats.bestStreakHabit = habit.name;
        }

        // Update habit's streak property to reflect current streak
        habit.streak = currentStreak;

        // Accumulate streaks by type
        if (habit.type === 'follow') {
          stats.followStreaks += currentStreak;
        } else {
          stats.leaveStreaks += currentStreak;
        }
      });

      // Calculate overall completion rate
      stats.completionRate = totalPossibleCompletions > 0
        ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
        : 0;
    }

    return stats;
  }, [filteredHabits, calendarDays, currentDate]);

  // Filter and sort habits based on user selection
  const processedHabits = useMemo(() => {
    let habits = [...filteredHabits];

    // Filter by category if needed
    if (selectedCategory !== 'all') {
      habits = habits.filter(habit => habit.category === selectedCategory);
    }

    // Sort based on selected option
    if (sortOption === 'streak') {
      habits.sort((a, b) => b.streak - a.streak);
    } else if (sortOption === 'alphabetical') {
      habits.sort((a, b) => a.name.localeCompare(b.name));
    }

    return habits;
  }, [filteredHabits, selectedCategory, sortOption]);

  // Check if a date is today
  const isToday = (dateString: string | null) => {
    if (!dateString) return false;
    return dateString === currentDate;
  };

  // Get the completion percentage for the month for a specific habit
  const getMonthCompletionPercent = (habit: Habit, daysInMonth: number) => {
    const firstDayOfMonth = calendarDays.find(day => day !== null) || currentDate;
    const month = new Date(firstDayOfMonth!).getMonth();
    const year = new Date(firstDayOfMonth!).getFullYear();

    const completionsThisMonth = habit.completedDates.filter(date => {
      const completionDate = new Date(date);
      return completionDate.getMonth() === month && completionDate.getFullYear() === year;
    }).length;

    return Math.min(100, Math.round((completionsThisMonth / daysInMonth) * 100));
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="month-navigation">
          <button onClick={handlePrevMonth} className="month-nav-btn">
            &lt; Prev
          </button>
          <h2>{monthName}</h2>
          <button onClick={handleNextMonth} className="month-nav-btn">
            Next &gt;
          </button>
        </div>

        <div className="calendar-controls">
          <button onClick={handleResetMonth} className="today-btn">
            Today
          </button>

          <select
            className="category-filter"
            value={selectedCategory}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setSelectedCategory(e.target.value as any)}
          >
            <option value="all">All Categories</option>
            <option value="health">Health</option>
            <option value="personal">Personal</option>
            <option value="finance">Finance</option>
            <option value="career">Career</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>

          <select
            className="sort-option"
            value={sortOption}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setSortOption(e.target.value as any)}
          >
            <option value="streak">Sort by Streak</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>

          <button
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>

      {showStats && (
        <div className="calendar-stats">
          <div className="stat-card">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{monthStats.completionRate}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Best Streak</span>
            <span className="stat-value">{monthStats.bestStreak} days</span>
            <span className="stat-subtext">{monthStats.bestStreakHabit}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Follow Habit Streaks</span>
            <span className="stat-value">{monthStats.followStreaks} days</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Leave Habit Streaks</span>
            <span className="stat-value">{monthStats.leaveStreaks} days</span>
          </div>
        </div>
      )}

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-days">
          {calendarDays?.map((date, index) => (
            <div
              key={index}
              className={`calendar-cell ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''}`}
            >
              {date && (
                <>
                  <div className="calendar-date">
                    {date ? new Date(date).getDate() : ''}
                  </div>
                  <div className="calendar-habits">
                    {processedHabits.map(habit => {
                      const completed = isDateCompleted(habit.completedDates, date);
                      const dateObj = new Date(date);
                      const daysInMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
                      const completionPercent = getMonthCompletionPercent(habit, daysInMonth);

                      return (
                        <div
                          key={habit.id}
                          className={`calendar-habit-indicator ${completed ? 'completed' : ''} ${habit.type}-type`}
                          onClick={() => date && handleToggleCompletion(habit.id, date)}
                        >
                          <div
                            className="habit-indicator-dot"
                            style={{ backgroundColor: CATEGORY_COLORS[habit.category] }}
                          />
                          <span className="habit-indicator-name">{habit.name}</span>
                          {completed && (
                            <span className="habit-streak-badge">
                              {habit.streak}
                            </span>
                          )}
                          <div className="calendar-habit-progress">
                            <div
                              className="calendar-habit-progress-bar"
                              style={{
                                width: `${completionPercent}%`,
                                backgroundColor: habit.type === 'follow' ? '#4ade80' : '#f87171'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitCalendarView;
