import "./habit-card.css";
import React, { useState, ChangeEvent, MouseEvent } from 'react';
import {
    AlertCircle, Plus, Check, X, Edit2, Trash2, Calendar, Award,
    ThumbsUp, ThumbsDown, TrendingUp, BarChart2, Target
} from 'lucide-react';
import { isDateCompleted } from "../../helper/utils";
import { Habit, HabitCategory } from "../habit-tracker.types";

interface HabitCardViewProps {
    filteredHabits: Habit[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: any;
    setShowSignInDialog: (show: boolean) => void;
    setShowAddForm: (show: boolean) => void;
    editingHabit: Habit | null;
    setEditingHabit: (habit: Habit | null) => void;
    categories: readonly string[];
    handleUpdateHabit: (habit: Habit) => void;
    handleDeleteHabit: (id: string) => void;
    getCompletionPercentage: (habit: Habit) => number;
    weekRange: string[];
    handleToggleCompletion: (habitId: string, date: string) => void;
}

// Get streak color class based on streak value
const getStreakColorClass = (streak: number): string => {
    if (streak >= 30) return "streak-gold";
    if (streak >= 14) return "streak-silver";
    if (streak >= 7) return "streak-bronze";
    return "streak-normal";
};

// Calculate the best streak (longest consecutive streak)
const calculateBestStreak = (completedDates: string[], frequency: Habit['frequency']): number => {
    if (!completedDates || completedDates.length === 0) return 0;

    // Sort dates in ascending order
    const sortedDates = [...completedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const prevDate = new Date(sortedDates[i - 1]);

        let isConsecutive = false;

        if (frequency === 'daily') {
            // For daily habits, check if dates are consecutive days
            const diffTime = currentDate.getTime() - prevDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            isConsecutive = Math.round(diffDays) === 1;
        } else if (frequency === 'weekly') {
            // For weekly habits, check if dates are in consecutive weeks
            const diffTime = currentDate.getTime() - prevDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            isConsecutive = Math.round(diffDays) >= 6 && Math.round(diffDays) <= 8;
        } else if (frequency === 'monthly') {
            // For monthly habits, check if dates are in consecutive months
            const prevMonth = prevDate.getMonth();
            const prevYear = prevDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            isConsecutive = (currentMonth - prevMonth === 1 && currentYear === prevYear) ||
                (currentMonth === 0 && prevMonth === 11 && currentYear - prevYear === 1);
        }

        if (isConsecutive) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        bestStreak = Math.max(bestStreak, currentStreak);
    }

    return bestStreak;
};

// Calculate the current streak (consecutive dates until today or most recent completion)
const calculateCurrentStreak = (completedDates: string[], frequency: Habit['frequency'], type: Habit['type']): number => {
    if (!completedDates || completedDates.length === 0) return 0;

    // For "leave" type habits, the streak represents days without the habit
    if (type === 'leave') {
        const lastCompletedDate = new Date(Math.max(...completedDates.map(date => new Date(date).getTime())));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (frequency === 'daily') {
            const diffTime = today.getTime() - lastCompletedDate.getTime();
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        } else if (frequency === 'weekly') {
            const diffTime = today.getTime() - lastCompletedDate.getTime();
            return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        } else if (frequency === 'monthly') {
            return (today.getFullYear() - lastCompletedDate.getFullYear()) * 12 +
                (today.getMonth() - lastCompletedDate.getMonth());
        }
        return 0;
    }

    // For "follow" type habits
    // Sort dates in descending order to start with the most recent
    const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent completion is today or within the appropriate time frame
    const recentDate = new Date(sortedDates[0]);
    recentDate.setHours(0, 0, 0, 0);

    let withinTimeFrame = false;

    if (frequency === 'daily') {
        const diffTime = today.getTime() - recentDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        withinTimeFrame = diffDays <= 1;
    } else if (frequency === 'weekly') {
        const diffTime = today.getTime() - recentDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        withinTimeFrame = diffDays <= 7;
    } else if (frequency === 'monthly') {
        const monthDiff = (today.getFullYear() - recentDate.getFullYear()) * 12 +
            (today.getMonth() - recentDate.getMonth());
        withinTimeFrame = monthDiff <= 1;
    }

    if (!withinTimeFrame) return 0;

    // Calculate streak by checking consecutive completed dates
    for (let i = 0; i < sortedDates.length - 1; i++) {
        const currentDate = new Date(sortedDates[i]);
        const nextDate = new Date(sortedDates[i + 1]);

        let isConsecutive = false;

        if (frequency === 'daily') {
            const diffTime = currentDate.getTime() - nextDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            isConsecutive = Math.round(diffDays) === 1;
        } else if (frequency === 'weekly') {
            const diffTime = currentDate.getTime() - nextDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            isConsecutive = Math.round(diffDays) >= 6 && Math.round(diffDays) <= 8;
        } else if (frequency === 'monthly') {
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const nextMonth = nextDate.getMonth();
            const nextYear = nextDate.getFullYear();

            isConsecutive = (currentMonth - nextMonth === 1 && currentYear === nextYear) ||
                (currentMonth === 0 && nextMonth === 11 && currentYear - nextYear === 1);
        }

        if (isConsecutive) {
            currentStreak++;
        } else {
            break;
        }
    }

    return currentStreak;
};

const HabitCardView: React.FC<HabitCardViewProps> = ({
                                                         filteredHabits,
                                                         session,
                                                         setShowSignInDialog,
                                                         setShowAddForm,
                                                         editingHabit,
                                                         setEditingHabit,
                                                         categories,
                                                         handleUpdateHabit,
                                                         handleDeleteHabit,
                                                         getCompletionPercentage,
                                                         weekRange,
                                                         handleToggleCompletion
                                                     }) => {
    const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

    const toggleExpanded = (habitId: string) => {
        setExpandedHabitId(expandedHabitId === habitId ? null : habitId);
    };

    const getStreakStatus = (habit: Habit): string => {
        const currentStreak = calculateCurrentStreak(habit.completedDates ?? [], habit.frequency, habit.type);

        if (habit.type === 'follow' && currentStreak >= 3) {
            return 'streak-success';
        } else if (habit.type === 'leave' && currentStreak === 0) {
            return 'streak-success';
        } else if (habit.type === 'leave' && currentStreak >= 3) {
            return 'streak-danger';
        }
        return '';
    };

    const getProgressStatus = (percentage: number, type: Habit['type']): string => {
        if (type === 'follow') {
            if (percentage >= 80) return 'progress-excellent';
            if (percentage >= 60) return 'progress-good';
            if (percentage >= 40) return 'progress-average';
            return 'progress-needs-work';
        } else {
            if (percentage <= 20) return 'progress-excellent';
            if (percentage <= 40) return 'progress-good';
            if (percentage <= 60) return 'progress-average';
            return 'progress-needs-work';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div>
            {filteredHabits.length === 0 ? (
                <div className="empty-state">
                    <AlertCircle size={48} />
                    <h3>No habits found</h3>
                    <p>Add a new habit to get started or adjust your filter settings.</p>
                    <button
                        onClick={() => !session ? setShowSignInDialog(true) : setShowAddForm(true)}
                        className="add-habit-btn"
                    >
                        <Plus size={16} />
                        Add Your First Habit
                    </button>
                </div>
            ) : (
                <div className="habits-grid">
                    {filteredHabits.map(habit => {
                        const currentStreak = calculateCurrentStreak(habit.completedDates ?? [], habit.frequency, habit.type);
                        const bestStreak = calculateBestStreak(habit.completedDates ?? [], habit.frequency);

                        return (
                            <div
                                key={habit.id}
                                className={`habit-card ${habit.type}-type-card ${expandedHabitId === habit.id ? 'expanded' : ''}`}
                            >
                                {editingHabit?.id === habit.id ? (
                                    <div className="habit-edit-form">
                                        <input
                                            type="text"
                                            value={editingHabit.name}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                                            placeholder="Habit name"
                                            className="edit-input"
                                        />
                                        <textarea
                                            value={editingHabit.description}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingHabit({ ...editingHabit, description: e.target.value })}
                                            placeholder="Description"
                                            className="edit-textarea"
                                        />

                                        <div className="edit-row">
                                            <div className="edit-field">
                                                <label>Category:</label>
                                                <select
                                                    value={editingHabit.category}
                                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingHabit({ ...editingHabit, category: e.target.value as HabitCategory })}
                                                    className="edit-select"
                                                >
                                                    {categories.map(category => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="edit-field">
                                                <label>Frequency:</label>
                                                <select
                                                    value={editingHabit.frequency}
                                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingHabit({ ...editingHabit, frequency: e.target.value as Habit['frequency'] })}
                                                    className="edit-select"
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="edit-habit-type">
                                            <label>Habit Type:</label>
                                            <div className="edit-type-options">
                                                <label className="type-option">
                                                    <input
                                                        type="radio"
                                                        name="editHabitType"
                                                        value="follow"
                                                        checked={editingHabit.type === 'follow'}
                                                        onChange={() => setEditingHabit({ ...editingHabit, type: 'follow' })}
                                                    />
                                                    <ThumbsUp size={16} className="follow-icon" />
                                                    <span>Build</span>
                                                </label>
                                                <label className="type-option">
                                                    <input
                                                        type="radio"
                                                        name="editHabitType"
                                                        value="leave"
                                                        checked={editingHabit.type === 'leave'}
                                                        onChange={() => setEditingHabit({ ...editingHabit, type: 'leave' })}
                                                    />
                                                    <ThumbsDown size={16} className="leave-icon" />
                                                    <span>Break</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="edit-actions">
                                            <button onClick={() => handleUpdateHabit(editingHabit)} className="save-btn">
                                                <Check size={16} /> Save
                                            </button>
                                            <button onClick={() => setEditingHabit(null)} className="cancel-btn">
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className={`habit-header ${habit.type}-header`}
                                            onClick={() => toggleExpanded(habit.id)}
                                        >
                                            <div className="habit-title-area">
                                                <span className={`habit-category-badge ${habit.category || 'uncategorized'}`}>{habit.category || 'uncategorized'}</span>
                                                <h3>{habit.name}</h3>
                                            </div>
                                            <div className="habit-actions">
                                                <button onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setEditingHabit(habit); }} className="edit-btn">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); handleDeleteHabit(habit.id); }} className="delete-btn">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="habit-description">{habit.description}</p>

                                        <div className="habit-meta">
                                            <div className="habit-frequency"><Calendar size={16} /><span>{habit.frequency}</span></div>
                                            <div className={`habit-streak ${getStreakStatus(habit)} ${getStreakColorClass(currentStreak)}`}>
                                                <Award size={16} /><span>Current Streak: {currentStreak} {habit.frequency === 'daily' ? 'days' : habit.frequency === 'weekly' ? 'weeks' : 'months'}</span>
                                            </div>
                                            <div className={`habit-type-label ${habit.type}`}>{habit.type === 'follow' ? <><ThumbsUp size={16} className="habit-type-icon" /><span>Build</span></> : <><ThumbsDown size={16} className="habit-type-icon" /><span>Break</span></>}</div>
                                        </div>

                                        <div className="habit-progress">
                                            <div className="progress-text">
                                                <span>Progress</span>
                                                <span className={getProgressStatus(getCompletionPercentage(habit), habit.type)}>
                                                    {getCompletionPercentage(habit)}%
                                                </span>
                                            </div>
                                            <div className={`progress-bar ${habit.type}-progress`}>
                                                <div className={`progress-fill ${getProgressStatus(getCompletionPercentage(habit), habit.type)}`} style={{ width: `${getCompletionPercentage(habit)}%` }} />
                                            </div>
                                        </div>

                                        <div className="habit-calendar">
                                            {weekRange.map(date => {
                                                const day = new Date(date).getDate();
                                                const isToday = date === new Date().toISOString().split('T')[0];
                                                const isCompleted = isDateCompleted(habit.completedDates ?? [], date);
                                                return (
                                                    <button
                                                        key={date}
                                                        className={`calendar-day ${isCompleted ? `completed ${habit.type}-completed` : ''} ${isToday ? 'today' : ''}`}
                                                        onClick={() => handleToggleCompletion(habit.id, date)}
                                                        title={formatDate(date)}
                                                    >
                                                        {day}
                                                        {isCompleted && <Check size={10} className="completed-check" stroke="blue" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="expanded-content">
                                            <div className="stats-section">
                                                <h4><TrendingUp size={16} /><span>Stats & Insights</span></h4>
                                                <div className="stats-grid">
                                                    <div className="stat-item"><BarChart2 size={16} /><div><div className="stat-label">Completion Rate</div><div className="stat-value">{getCompletionPercentage(habit)}%</div></div></div>
                                                    <div className="stat-item"><Target size={16} /><div><div className="stat-label">Best Streak</div><div className="stat-value">{bestStreak} {habit.frequency === 'daily' ? 'days' : habit.frequency === 'weekly' ? 'weeks' : 'months'}</div></div></div>
                                                    <div className="stat-item"><Award size={16} /><div><div className="stat-label">Current Streak</div><div className="stat-value">{currentStreak} {habit.frequency === 'daily' ? 'days' : habit.frequency === 'weekly' ? 'weeks' : 'months'}</div></div></div>
                                                    <div className="stat-item"><Calendar size={16} /><div><div className="stat-label">Date Started</div><div className="stat-value">{formatDate(habit.createdAt || new Date().toISOString().split('T')[0])}</div></div></div>
                                                </div>
                                                <div className={`progress-recommendation ${habit.type}-recommendation`}>{habit.type === 'follow' && getCompletionPercentage(habit) < 50 ? <p>Try to increase your completion rate to build this habit more effectively.</p> : habit.type === 'follow' && getCompletionPercentage(habit) >= 50 ? <p>You&apos;re doing great maintaining this habit. Keep it up!</p> : habit.type === 'leave' && getCompletionPercentage(habit) > 30 ? <p>Work on reducing this habit further to achieve your goal.</p> : habit.type === 'leave' && getCompletionPercentage(habit) <= 30 ? <p>You&apos;re making excellent progress avoiding this habit!</p> : null}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HabitCardView;
