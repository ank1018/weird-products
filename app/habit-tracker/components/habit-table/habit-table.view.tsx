import { Award, Check } from "lucide-react";
import { isDateCompleted } from "../../helper/utils";
import { Habit } from "../habit-tracker.types";
import './habit-table.css';

interface HabitTableViewProps {
    weekRange: string[];
    filteredHabits: Habit[];
    handleToggleCompletion: (habitId: string, date: string) => void;
}

const HabitTableView = ({ weekRange, filteredHabits, handleToggleCompletion }: HabitTableViewProps) => {
    return (
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
    )
}

export default HabitTableView;