import { Habit } from "../habit-tracker.types";
import { isDateCompleted } from "../../helper/utils";
import './habit-calender.css';

interface HabitCalenderViewProps {
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handleResetMonth: () => void;
    monthName: string;
    calendarDays: (string | null)[];
    filteredHabits: Habit[];
    handleToggleCompletion: (habitId: string, date: string) => void;
}

const HabitCalenderView = ({ handlePrevMonth, handleNextMonth, handleResetMonth, monthName, calendarDays, filteredHabits, handleToggleCompletion }: HabitCalenderViewProps) => {
    return (
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
                    {calendarDays?.map((date, index) => (
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
    )
}

export default HabitCalenderView;