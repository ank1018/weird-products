'use client';

import React, { useState } from 'react';
import { Grid, Calendar, List, Plus, X, Check } from 'lucide-react';
import { HabitFrequency, HabitCategory, Habit } from '../habit-tracker.types';
import './header.css';
import { Session } from 'next-auth';

interface HeaderProps {
    viewMode: 'cards' | 'calendar' | 'table';
    setViewMode: (mode: 'cards' | 'calendar' | 'table') => void;
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
    viewMode,
    setViewMode,
    filter,
    setFilter,
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
        category: 'personal' as HabitCategory
    });

    const handleAddHabit = () => {
        if (!newHabit.name) return;
        onAddHabit(newHabit as Habit);
        setNewHabit({
            name: '',
            description: '',
            frequency: 'daily',
            category: 'personal'
        });
        setShowAddForm(false);
    };

    return (
        <header className="dashboard-header">
            <div className="header-container">
                <h1 className="app-title">Habit Tracker</h1>

                <div className="header-controls">
                    <div className="view-selector">
                        <div className="view-tabs">
                            <button
                                className={`view-tab ${viewMode === 'cards' ? 'active' : ''}`}
                                onClick={() => setViewMode('cards')}
                                aria-label="Cards view"
                            >
                                <Grid size={18} />
                                <span>Cards</span>
                            </button>
                            <button
                                className={`view-tab ${viewMode === 'calendar' ? 'active' : ''}`}
                                onClick={() => setViewMode('calendar')}
                                aria-label="Calendar view"
                            >
                                <Calendar size={18} />
                                <span>Calendar</span>
                            </button>
                            <button
                                className={`view-tab ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                                aria-label="Table view"
                            >
                                <List size={18} />
                                <span>Table</span>
                            </button>
                        </div>
                    </div>

                    <button
                        className={`add-habit-button ${showAddForm ? 'cancel' : ''}`}
                        onClick={() => !session ? setShowSignInDialog(true) : setShowAddForm(!showAddForm)}
                        aria-label={showAddForm ? "Cancel adding habit" : "Add new habit"}
                    >
                        {showAddForm ? <X size={16} /> : <Plus size={16} />}
                        <span>{showAddForm ? 'Cancel' : 'Add Habit'}</span>
                    </button>
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