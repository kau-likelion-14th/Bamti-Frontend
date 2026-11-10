import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React from 'react';
import "../../styles/Calendar.css";

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

export default function CustomCalendar({
    selectedDate = new Date(),
    viewDate = new Date(),
    onDateChange,
    onMonthChange,
    remainingByDate = {},
}) {
    const handledDateChange = (value) => {
        const next = value instanceof Date ? value : value?.[0];
        if (next) onDateChange?.(next);
    };

    // 서버 데이터 기준 : 데이터가 없는 날짜와 remaining이 0인 날짜를 구분
    const getDayMeta = (date) => {
        const day = remainingByDate[toDateKey(date)];
        if (!day) return { hasTodos: false, remaining: 0, allDone: false };

        const remaining = Number(day.remaining) || 0;
        const hasTodos = day.hasTodo ?? true; // hasTodo 필드가 없으면 데이터가 있는 날짜로 판단
        return { hasTodos, remaining, allDone: hasTodos && remaining === 0 };
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange}
                value={selectedDate}
                activeStartDate={startOfMonth(viewDate)}
                onActiveStartDateChange={({ activeStartDate }) => {
                    if (activeStartDate) onMonthChange?.(activeStartDate);
                }}
                calendarType='gregory'
                view='month'
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={true}
                formatDay={(locale, date) => String(date.getDate())}
                tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const { hasTodos, remaining, allDone } = getDayMeta(date);
                    if (!hasTodos) return null;

                    return (
                        <div className="tile-meta">
                            {allDone ? "★" : remaining}
                        </div>
                    );
                }}
                tileClassName={({ date, view }) => {
                    if (view !== 'month') return "";
                    const { hasTodos, allDone } = getDayMeta(date);
                    if (!hasTodos) return "";
                    return allDone ? "tile-done" : "tile-has";
                }}
            />
        </div>
    );
}
