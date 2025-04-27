import { AlertCircle, Award, Calendar, Check, Edit2, Plus, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
import { Habit, HabitCategory, HabitFrequency } from "../habit-tracker.types";
import { isDateCompleted } from "../../helper/utils";
import React from "react";
import { Session } from "next-auth";
import "./habit-card.css";

interface HabitProps {
    filteredHabits: Habit[];
    session: Session | null;
    setShowSignInDialog: (show: boolean) => void;
    setShowAddForm: (show: boolean) => void;
    editingHabit: Habit | null;
    setEditingHabit: (habit: Habit | null) => void;
    categories: readonly string[];
    handleUpdateHabit: (habit: Habit) => void;
    handleDeleteHabit: (id: string) => void;
    getCompletionPercentage: (habit: Habit) => number;
    weekRange: string[];
    handleToggleCompletion: (id: string, date: string) => void;
}

const HabitCardView: React.FC<HabitProps> = ({
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
    return (
        <div>
            {filteredHabits.length === 0 ? (
                <div className="empty-state">
                    <AlertCircle size={48} />
                    <h3>No habits found</h3>
                    <p>Add a new habit to get started or change your filter settings.</p>
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
                        <div key={habit.id} className="habit-card">
                            {editingHabit?.id === habit.id ? (
                                <div className="habit-edit-form">
                                    <input
                                        type="text"
                                        value={editingHabit.name}
                                        onChange={e => setEditingHabit({ ...editingHabit, name: e.target.value })}
                                    />
                                    <textarea
                                        value={editingHabit.description}
                                        onChange={e => setEditingHabit({ ...editingHabit, description: e.target.value })}
                                    />
                                    <select
                                        value={editingHabit.category}
                                        onChange={e => setEditingHabit({
                                            ...editingHabit,
                                            category: e.target.value as HabitCategory
                                        })}
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={editingHabit.frequency}
                                        onChange={e => setEditingHabit({
                                            ...editingHabit,
                                            frequency: e.target.value as HabitFrequency
                                        })}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                    <div className="edit-habit-type">
                                        <label>Habit Type:</label>
                                        <div className="edit-type-options">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="editHabitType"
                                                    value="follow"
                                                    checked={editingHabit.type === 'follow'}
                                                    onChange={() => setEditingHabit({ ...editingHabit, type: 'follow' })}
                                                />
                                                <ThumbsUp size={16} style={{ minWidth: 16, minHeight: 16 }} />
                                                Follow
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="editHabitType"
                                                    value="leave"
                                                    checked={editingHabit.type === 'leave'}
                                                    onChange={() => setEditingHabit({ ...editingHabit, type: 'leave' })}
                                                />
                                                <ThumbsDown size={16} style={{ minWidth: 16, minHeight: 16 }} />
                                                Leave
                                            </label>
                                        </div>
                                    </div>

                                    <div className="edit-actions">
                                        <button onClick={() => handleUpdateHabit(editingHabit)} className="save-btn">
                                            <Check size={16} />
                                            Save
                                        </button>
                                        <button onClick={() => setEditingHabit(null)} className="cancel-btn">
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="habit-header">
                                        <div className="habit-title-area">
                                            <span
                                                className={`habit-category-badge ${habit.category || 'uncategorized'}`}>
                                                {habit.category || 'uncategorized'}
                                            </span>
                                            <h3>{habit.name}</h3>
                                        </div>
                                        <div className="habit-actions">
                                            <button onClick={() => setEditingHabit(habit)} className="edit-btn">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteHabit(habit.id)} className="delete-btn">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="habit-description">{habit.description}</p>

                                    <div className="habit-meta">
                                        <div className="habit-frequency">
                                            <Calendar size={16} />
                                            <span>{habit.frequency}</span>
                                        </div>
                                        <div className="habit-streak">
                                            <Award size={16} />
                                            <span>Streak: {habit.streak} {habit.frequency === 'daily' ? 'days' :
                                                habit.frequency === 'weekly' ? 'weeks' : 'months'}</span>
                                        </div>
                                        <div
                                            className={`habit-type-label ${habit.type}`}>{habit.type === 'follow' ? '👍 Follow' : '👎 Leave'}</div>
                                    </div>

                                    <div className="habit-progress">
                                        <div className="progress-text">
                                            <span>Progress</span>
                                            <span>{getCompletionPercentage(habit)}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${getCompletionPercentage(habit)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="habit-calendar">
                                        {weekRange.map(date => {
                                            const day = new Date(date).getDate();
                                            const isToday = date === new Date().toISOString().split('T')[0];
                                            return (
                                                <button
                                                    key={date}
                                                    className={`calendar-day 
                                  ${isDateCompleted(habit.completedDates, date) ? 'completed' : ''} 
                                  ${isToday ? 'today' : ''}`}
                                                    onClick={() => handleToggleCompletion(habit.id, date)}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HabitCardView;
