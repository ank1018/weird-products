'use client';

import React, { useState } from 'react';
import { Plus, X, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { HabitFrequency, HabitCategory, Habit } from '../habit-tracker.types';
import './header.css';
import { Session } from 'next-auth';

interface HeaderProps {
    filter: string;
    setFilter: (filter: string) => void;
    categories: readonly string[];
    showAddForm: boolean;
    setShowAddForm: (show: boolean) => void;
    onAddHabit: (habit: Habit) => void;
    session: Session | null;
    setShowSignInDialog: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
    categories,
    showAddForm,
    setShowAddForm,
    onAddHabit,
    session,
    setShowSignInDialog
}) => {
    const [newHabit, setNewHabit] = useState({
        name: '',
        description: '',
        frequency: 'daily' as HabitFrequency,
        category: 'personal' as HabitCategory,
        type: 'follow' as 'follow' | 'leave' // New habit type field
    });

    const handleAddHabit = () => {
        if (!newHabit.name) return;
        onAddHabit({
            ...newHabit,
            // Add the type field to the habit
            type: newHabit.type
        } as Habit);

        setNewHabit({
            name: '',
            description: '',
            frequency: 'daily',
            category: 'personal',
            type: 'follow'
        });
        setShowAddForm(false);
    };

    return (
        <header className="dashboard-header">
            <div className="header-container">
                <h1 className="app-title">Habit Tracker</h1>

                <div className="header-controls">

                    {showAddForm ? null : <button
                        className={`add-habit-button ${showAddForm ? 'cancel' : ''}`}
                        onClick={() => !session ? setShowSignInDialog(true) : setShowAddForm(!showAddForm)}
                        aria-label={showAddForm ? "Cancel adding habit" : "Add new habit"}
                    >
                        <Plus size={16}/>
                        <span>Add Habit</span>
                    </button>}
                </div>

                {showAddForm && (
                    <div className="add-habit-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Habit Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Morning Meditation"
                                    value={newHabit.name}
                                    onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={newHabit.category}
                                    onChange={e => setNewHabit({ ...newHabit, category: e.target.value as HabitCategory })}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* New habit type selection */}
                        <div className="form-group habit-type-selector">
                            <label>Habit Type</label>
                            <div className="habit-type-options">
                                <label className={`habit-type-option ${newHabit.type === 'follow' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="habitType"
                                        value="follow"
                                        checked={newHabit.type === 'follow'}
                                        onChange={() => setNewHabit({ ...newHabit, type: 'follow' })}
                                    />
                                    <ThumbsUp size={16} />
                                    <span>Habit to Follow</span>
                                    <p className="habit-type-description">Track habits you want to build and maintain</p>
                                </label>

                                <label className={`habit-type-option ${newHabit.type === 'leave' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="habitType"
                                        value="leave"
                                        checked={newHabit.type === 'leave'}
                                        onChange={() => setNewHabit({ ...newHabit, type: 'leave' })}
                                    />
                                    <ThumbsDown size={16} />
                                    <span>Habit to Leave</span>
                                    <p className="habit-type-description">Track habits you want to quit or avoid</p>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Add additional details about your habit"
                                value={newHabit.description}
                                onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Frequency</label>
                            <select
                                value={newHabit.frequency}
                                onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value as HabitFrequency })}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button onClick={() => setShowAddForm(false)} className="cancel-btn">
                                <X size={16} />
                                Cancel
                            </button>
                            <button onClick={handleAddHabit} className="save-btn">
                                <Check size={16} />
                                Add Habit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
