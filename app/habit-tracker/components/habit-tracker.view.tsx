"use client";
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Check,
    X,
    Calendar,
    Edit2,
    Award,
    AlertCircle,
    ThumbsUp,
    ThumbsDown, Grid, List
} from 'lucide-react';
import NavBarView from '../../nav-bar/nav-bar.view';
import GoogleAd from '../../google-ads/google-ads.view';
import Footer from '../../footer/footer.view';
import '../styles/habit-tracker.css';
import { Habit, HabitFrequency, HabitCategory } from './habit-tracker.types';
import { useSession, signOut } from 'next-auth/react';
import Header from './header/header';
import SignInDialog from '../../sign-in/sign-in-dialog';
import {isDateCompleted} from "../helper/utils";

interface HabitData {
    habits: Habit[];
}

const categories = ['health', 'personal', 'finance', 'career', 'social', 'other'] as const as readonly HabitCategory[];

const HabitTracker: React.FC = () => {
    const { data: session, status } = useSession();
    const [isClient, setIsClient] = useState(false);
    const [habitData, setHabitData] = useState<HabitData>({ habits: [] });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const loadUserHabits = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch('/api/habits');
                    const data = await response.json();
                    if (data.habits) {
                        // Calculate streaks when habits are first loaded
                        const habitsWithStreaks = calculateStreaks(data.habits);
                        setHabitData({ habits: habitsWithStreaks });
                    }
                } catch (error) {
                    console.error('Error loading habits:', error);
                }
            }
        };

        loadUserHabits();
    }, [session]);

    // New helper function to calculate streaks
    const calculateStreaks = (habits: Habit[]): Habit[] => {
        const today = new Date().toISOString().split('T')[0];

        return habits.map(habit => {
            // Skip recalculation if no completed dates
            if (habit.completedDates.length === 0) {
                return { ...habit, streak: 0 };
            }

            // Sort dates to get the most recent completions
            const sortedDates = [...habit.completedDates].sort();
            let streak = 0;

            if (habit.frequency === 'daily') {
                // For daily habits: check if consecutive days are completed
                const currentDate = new Date(today);

                // Start from today and go backwards
                while (true) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    if (isDateCompleted(habit.completedDates, dateStr)) {
                        streak++;
                        // Move to previous day
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else {
                        break; // Break the streak
                    }
                }
            }
            else if (habit.frequency === 'weekly') {
                // Count completed weeks
                // Group dates by week
                const weekMap = new Map();

                sortedDates.forEach(dateStr => {
                    const date = new Date(dateStr);
                    // Get year and week number as key
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay()); // Get Sunday of the week
                    const weekKey = `${weekStart.getFullYear()}-${Math.floor((weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))}`;

                    if (!weekMap.has(weekKey)) {
                        weekMap.set(weekKey, true);
                    }
                });

                // Get current week
                const currentDate = new Date(today);
                const currentWeekStart = new Date(currentDate);
                currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());

                // Count consecutive weeks
                const checkDate = new Date(currentWeekStart);

                while (true) {
                    const weekKey = `${checkDate.getFullYear()}-${Math.floor((checkDate.getTime()) / (7 * 24 * 60 * 60 * 1000))}`;

                    if (weekMap.has(weekKey)) {
                        streak++;
                        // Go to previous week
                        checkDate.setDate(checkDate.getDate() - 7);
                    } else {
                        break;
                    }
                }
            }
            else if (habit.frequency === 'monthly') {
                // Count completed months
                const monthMap = new Map();

                sortedDates.forEach(dateStr => {
                    const date = new Date(dateStr);
                    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

                    if (!monthMap.has(monthKey)) {
                        monthMap.set(monthKey, true);
                    }
                });

                // Get current month
                const currentDate = new Date(today);
                let checkYear = currentDate.getFullYear();
                let checkMonth = currentDate.getMonth();

                // Count consecutive months
                while (true) {
                    const monthKey = `${checkYear}-${checkMonth}`;

                    if (monthMap.has(monthKey)) {
                        streak++;
                        // Go to previous month
                        checkMonth--;
                        if (checkMonth < 0) {
                            checkMonth = 11;
                            checkYear--;
                        }
                    } else {
                        break;
                    }
                }
            }

            return { ...habit, streak };
        });
    };

    const saveHabits = async (habits: Habit[]) => {
        if (session?.user?.email) {
            try {
                // Calculate streaks before saving
                const habitsWithStreaks = calculateStreaks(habits);

                const response = await fetch('/api/habits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ habits: habitsWithStreaks }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save habits');
                }

                const data = await response.json();
                if (data.habits) {
                    setHabitData({ habits: data.habits });
                }
            } catch (error) {
                console.error('Error saving habits:', error);
            }
        }
    };

    const [, setNewHabit] = useState<{
        name: string;
        description: string;
        frequency: HabitFrequency;
        category: string;
        type: 'follow' | 'leave';
    }>({
        name: '',
        description: '',
        frequency: 'daily',
        category: 'personal',
        type: 'follow'
    });

    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'cards' | 'calendar' | 'table'>('cards');
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [showSignInDialog, setShowSignInDialog] = useState(false);

    // Remove the problematic useEffect that was recalculating streaks on every render

    const handleAddHabit = async (newHabit: Habit) => {
        if (!session) {
            setShowSignInDialog(true);
            return;
        }
        if (!newHabit.name) return;

        const habit: Habit = {
            id: `habit-${Date.now()}`,
            name: newHabit.name,
            description: newHabit.description,
            frequency: newHabit.frequency,
            streak: 0,
            category: newHabit.category as HabitCategory,
            completedDates: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type: newHabit.type
        };

        const updatedHabits = [...habitData.habits, habit];
        const habitsWithStreaks = calculateStreaks(updatedHabits);
        setHabitData({ habits: habitsWithStreaks });
        await saveHabits(updatedHabits);

        setNewHabit({
            name: '',
            description: '',
            frequency: 'daily',
            category: 'personal',
            type: 'follow'
        });

        setShowAddForm(false);
    };

    const handleUpdateHabit = async (habit: Habit) => {
        const updatedHabits = habitData.habits.map(h =>
            h.id === habit.id ? { ...habit, updatedAt: new Date().toISOString() } : h
        );
        const habitsWithStreaks = calculateStreaks(updatedHabits);
        setHabitData({ habits: habitsWithStreaks });
        await saveHabits(updatedHabits);
        setEditingHabit(null);
    };

    const handleDeleteHabit = async (id: string) => {
        const updatedHabits = habitData.habits.filter(h => h.id !== id);
        const habitsWithStreaks = calculateStreaks(updatedHabits);
        setHabitData({ habits: habitsWithStreaks });
        await saveHabits(updatedHabits);
    };

    const handleToggleCompletion = async (habitId: string, date: string) => {
        const habit = habitData.habits.find(h => h.id === habitId);
        if (!habit) return;

        // Standardize the date format to YYYY-MM-DD for consistent comparison
        const standardizedDate = new Date(date).toISOString().split('T')[0];

        // Check if the date already exists in the array using the standardized format
        const dateExists = habit.completedDates.some(d =>
            new Date(d).toISOString().split('T')[0] === standardizedDate
        );

        // Toggle the date - remove if exists, add if not
        const updatedCompletedDates = dateExists
            ? habit.completedDates.filter(d => new Date(d).toISOString().split('T')[0] !== standardizedDate)
            : [...habit.completedDates, standardizedDate]; // Store in consistent format

        const updatedHabit = {
            ...habit,
            completedDates: updatedCompletedDates,
            updatedAt: new Date().toISOString()
        };

        const updatedHabits = habitData.habits.map(h =>
            h.id === habitId ? updatedHabit : h
        );

        // Recalculate streaks after toggling completion
        const habitsWithStreaks = calculateStreaks(updatedHabits);
        setHabitData({ habits: habitsWithStreaks });
        await saveHabits(updatedHabits);
    };

    const getDatesForMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get the starting day of the week (0 = Sunday, 6 = Saturday)
        const startDayOfWeek = firstDay.getDay();

        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            calendarDays.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            calendarDays.push(dayDate.toISOString().split('T')[0]);
        }

        return calendarDays;
    };

    const getFilteredHabits = () => {
        if (filter === 'all') return habitData.habits;
        return habitData.habits.filter(habit => habit.category === filter);
    };

    const getWeekRange = () => {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 for Sunday, 6 for Saturday

        // Calculate first day of the week (Sunday)
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() - currentDay);

        // Calculate last day of the week (Saturday)
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

        const weekRange = [];
        const tempDate = new Date(firstDayOfWeek);

        // Generate array of dates for the week
        while (tempDate <= lastDayOfWeek) {
            weekRange.push(tempDate.toISOString().split('T')[0]);
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return weekRange;
    };

    const weekRange = getWeekRange();
    const calendarDays = getDatesForMonth(selectedMonth);
    const filteredHabits = getFilteredHabits();

    const handlePrevMonth = () => {
        const newDate = new Date(selectedMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        setSelectedMonth(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(selectedMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        setSelectedMonth(newDate);
    };

    const handleResetMonth = () => {
        setSelectedMonth(new Date());
    };

    const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const getCompletionPercentage = (habit: Habit) => {
        const totalDays = habit.frequency === 'daily' ? 30 :
            habit.frequency === 'weekly' ? 4 : 1;
        const completedDays = habit.completedDates.length;
        return Math.round((completedDays / totalDays) * 100);
    };

    if (!isClient) {
        return <div className="loading">Loading...</div>;
    }

    if (status === 'loading') {
        return <div className="loading">Loading...</div>;
    }

    // if (!session) {
    //     return (
    //         <SignInDialog
    //             isOpen={showSignInDialog}
    //             onClose={() => setShowSignInDialog(false)}
    //         />
    //     );
    // }

    return (
        <div className="habit-tracker-container">
            <div className="user-info">
                <span>Welcome, {session?.user?.name}</span>
                <button onClick={() => signOut()} className="sign-out-button">
                    Sign out
                </button>
            </div>
            <NavBarView />
            <div className="habit-tracker-content">
                <Header
                    showAddForm={showAddForm}
                    setShowAddForm={setShowAddForm}
                    filter={filter}
                    setFilter={setFilter}
                    categories={categories}
                    onAddHabit={handleAddHabit}
                    session={session}
                    setShowSignInDialog={setShowSignInDialog}
                />


                <div className="habits-section">
                    <div className="category-filters">
                        <button
                            className={`category-pill ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                            aria-label="Show all habits"
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-pill ${filter === category ? 'active' : ''}`}
                                onClick={() => setFilter(category)}
                                aria-label={`Filter by ${category}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="view-selector">
                        <div className="view-tabs">
                            <button
                                className={`view-tab ${viewMode === 'cards' ? 'active' : ''}`}
                                onClick={() => setViewMode('cards')}
                                aria-label="Cards view"
                            >
                                <Grid size={18}/>
                                <span>Cards</span>
                            </button>
                            <button
                                className={`view-tab ${viewMode === 'calendar' ? 'active' : ''}`}
                                onClick={() => setViewMode('calendar')}
                                aria-label="Calendar view"
                            >
                                <Calendar size={18}/>
                                <span>Calendar</span>
                            </button>
                            <button
                                className={`view-tab ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                                aria-label="Table view"
                            >
                                <List size={18}/>
                                <span>Table</span>
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'cards' && (
                    <div>
                        {filteredHabits.length === 0 ? (
                            <div className="empty-state">
                                <AlertCircle size={48}/>
                                <h3>No habits found</h3>
                                <p>Add a new habit to get started or change your filter settings.</p>
                                <button
                                    onClick={() => !session ? setShowSignInDialog(true) : setShowAddForm(true)}
                                    className="add-habit-btn"
                                >
                                    <Plus size={16}/>
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
                                                        onChange={e => setEditingHabit({ ...editingHabit, category: e.target.value as HabitCategory })}
                                                    >
                                                        {categories.map(category => (
                                                            <option key={category} value={category}>
                                                                {category}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={editingHabit.frequency}
                                                        onChange={e => setEditingHabit({ ...editingHabit, frequency: e.target.value as HabitFrequency })}
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
                                                            <span className={`habit-category-badge ${habit.category || 'uncategorized'}`}>
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
                                                        <div className={`habit-type-label ${habit.type}`}>{habit.type === 'follow' ? '👍 Follow' : '👎 Leave'}</div>
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
                    )}

                {viewMode === 'calendar' && (
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
                            <button onClick={handleResetMonth} className="today-btn">
                                Today
                            </button>
                        </div>

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
                                {calendarDays.map((date, index) => (
                                    <div key={index} className={`calendar-cell ${!date ? 'empty' : ''}`}>
                                        {date && (
                                            <>
                                                <div className="calendar-date">
                                                    {date ? new Date(date).getDate() : ''}
                                                </div>
                                                <div className="calendar-habits">
                                                    {filteredHabits.map(habit => (
                                                        <div
                                                            key={habit.id}
                                                            className={`calendar-habit-indicator ${isDateCompleted(habit.completedDates, date) ? 'completed' : ''}`}
                                                            onClick={() => date && handleToggleCompletion(habit.id, date)}
                                                        >
                                                            <span className="habit-indicator-dot"></span>
                                                            <span className="habit-indicator-name">{habit.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'table' && (
                    <div className="table-view">
                        <h2>Weekly Progress</h2>

                        <div className="habits-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Habit</th>
                                        {weekRange.map(date => (
                                            <th className='date-cell' key={date}>
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}<br />
                                                {new Date(date).getDate()}
                                            </th>
                                        ))}
                                        <th>Streak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHabits.map(habit => (
                                        <tr key={habit.id}>
                                            <td className="habit-name-cell">
                                                <div className="habit-name-container">
                                                    <span className={`habit-table-category ${habit.category}`}></span>
                                                    {habit.name}
                                                </div>
                                            </td>
                                            {weekRange.map(date => (
                                                <td key={date} className="completion-cell">
                                                    <button
                                                        className={`completion-toggle ${isDateCompleted(habit.completedDates, date) ? 'completed' : ''}`}
                                                        onClick={() => handleToggleCompletion(habit.id, date)}
                                                    >
                                                        {isDateCompleted(habit.completedDates, date) ? <Check size={16} /> : ''}
                                                    </button>
                                                </td>
                                            ))}
                                            <td className="streak-cell">
                                                <div className="streak-display">
                                                    <Award size={16} />
                                                    <span>{habit.streak}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredHabits.length === 0 && (
                                <div className="empty-table-message">
                                    <p>No habits to display. Add a habit or change your filter settings.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <SignInDialog
                isOpen={showSignInDialog}
                onClose={() => setShowSignInDialog(false)}
            />
            <GoogleAd slot={"4077644091"} className="ad-bottom" />
            <Footer />
        </div>
    );
};

export default HabitTracker;
