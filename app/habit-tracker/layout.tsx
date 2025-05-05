import type { Metadata } from 'next'
import './styles/habit-tracker.css'

export const metadata: Metadata = {
    title: 'Habit Tracker | Finance 101',
    description: 'Track your daily habits and build a better lifestyle.',
    keywords: ['habit tracker', 'daily habits', 'lifestyle', 'productivity', 'self-improvement'],
    // authors: [{ name: 'Ankur Singh' }],
    openGraph: {
        title: 'Habit Tracker | Finance 101',
        description: 'Track your daily habits and build a better lifestyle.',
        type: 'website',
        url: 'https://finance101.com/habit-tracker',
        images: [
            {
                url: '/images/habit-tracker-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Habit Tracker',
            },
        ],
    },
}

export default function HabitTrackerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="habit-tracker-container">
            {children}
        </div>
    )
}
