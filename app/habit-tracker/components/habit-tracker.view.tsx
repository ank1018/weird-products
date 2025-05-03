"use client";
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Grid, List
} from 'lucide-react';
import NavBarView from '../../nav-bar/nav-bar.view';
import GoogleAd from '../../google-ads/google-ads.view';
import Footer from '../../footer/footer.view';
import '../styles/habit-tracker.css';
import { Habit, HabitFrequency, HabitCategory } from './habit-tracker.types';
import { useSession } from 'next-auth/react';
import Header from './header/header';
import SignInDialog from '../../sign-in/sign-in-dialog';
import HabitCardView from "./habit-card/habit-card.view";
import HabitCalenderView from './habit-calender/habit-calendar.view';
import HabitTableView from './habit-table/habit-table.view';
import { isDateCompleted } from '../helper/utils';

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

    return (
        <div className="habit-tracker-container">
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
                    <div className="category-filters desktop">
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
                </div>

                {viewMode === 'cards' && (
                    <HabitCardView filteredHabits={filteredHabits} session={session} setShowSignInDialog={setShowSignInDialog} setShowAddForm={setShowAddForm} editingHabit={editingHabit} setEditingHabit={setEditingHabit} categories={categories} handleUpdateHabit={handleUpdateHabit} handleDeleteHabit={handleDeleteHabit} getCompletionPercentage={getCompletionPercentage} weekRange={weekRange} handleToggleCompletion={handleToggleCompletion} />
                )}

                {viewMode === 'calendar' && (
                    <HabitCalenderView handlePrevMonth={handlePrevMonth} handleNextMonth={handleNextMonth} handleResetMonth={handleResetMonth} monthName={monthName} calendarDays={calendarDays} filteredHabits={filteredHabits} handleToggleCompletion={handleToggleCompletion} />
                )}

                {viewMode === 'table' && (
                    <HabitTableView weekRange={weekRange} filteredHabits={filteredHabits} handleToggleCompletion={handleToggleCompletion} />
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
