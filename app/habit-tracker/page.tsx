import { Metadata } from 'next';
import HabitTracker from './components/habit-tracker.view';
import './styles/habit-tracker.css';

export const metadata: Metadata = {
    title: 'Habit Tracker | Finance 101',
    description: 'Track and build better financial habits with our habit tracking tool.',
    keywords: ['habit tracker', 'financial habits', 'goal tracking', 'personal finance', 'budgeting habits'],
    authors: [{ name: 'Ankur Singh' }],
    openGraph: {
        title: 'Habit Tracker | Finance 101',
        description: 'Track and build better financial habits with our habit tracking tool.',
        type: 'website',
        url: 'https://finance101.com/habit-tracker',
        images: [
            {
                url: 'https://finance101.com/images/habit-tracker.jpg',
                width: 1200,
                height: 630,
                alt: 'Habit Tracker',
            },
        ],
    },
};

export default function HabitTrackerPage() {
    return (
        <main>
            <HabitTracker />
        </main>
    );
} 