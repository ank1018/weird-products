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
        if (habit.type === 'follow' && habit.streak >= 3) {
            return 'streak-success';
        } else if (habit.type === 'leave' && habit.streak === 0) {
            return 'streak-success';
        } else if (habit.type === 'leave' && habit.streak >= 3) {
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
                    {filteredHabits.map(habit => (
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

                                    {/* <div className="edit-reminder">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={editingHabit.reminder || false}
                                                onChange={() => setEditingHabit({ ...editingHabit, reminder: !editingHabit.reminder })}
                                            />
                                            <Bell size={16} />
                                            <span>Enable daily reminder</span>
                                        </label>
                                    </div> */}

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
                                        <div className={`habit-streak ${getStreakStatus(habit)} ${getStreakColorClass(habit.streak)}`}>
                                            <Award size={16} /><span>Streak: {habit.streak} {habit.frequency === 'daily' ? 'days' : habit.frequency === 'weekly' ? 'weeks' : 'months'}</span>
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
                                                <div className="stat-item"><Target size={16} /><div><div className="stat-label">Best Streak</div><div className="stat-value">{habit.streak}</div></div></div>
                                                <div className="stat-item"><Calendar size={16} /><div><div className="stat-label">Date Started</div><div className="stat-value">{formatDate(habit.createdAt || new Date().toISOString().split('T')[0])}</div></div></div>
                                                {/* <div className="stat-item"><Bell size={16} /><div><div className="stat-label">Reminder</div><div className="stat-value">{habit.reminder ? 'Enabled' : 'Disabled'}</div></div></div> */}
                                            </div>
                                            <div className={`progress-recommendation ${habit.type}-recommendation`}>{habit.type === 'follow' && getCompletionPercentage(habit) < 50 ? <p>Try to increase your completion rate to build this habit more effectively.</p> : habit.type === 'follow' && getCompletionPercentage(habit) >= 50 ? <p>You&apos;re doing great maintaining this habit. Keep it up!</p> : habit.type === 'leave' && getCompletionPercentage(habit) > 30 ? <p>Work on reducing this habit further to achieve your goal.</p> : habit.type === 'leave' && getCompletionPercentage(habit) <= 30 ? <p>You&apos;re making excellent progress avoiding this habit!</p> : null}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HabitCardView;
