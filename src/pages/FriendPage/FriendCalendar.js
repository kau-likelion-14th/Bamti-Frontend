import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/Calendar.css";

// 친구의 투두 현황을 캘린더에 표시하는 컴포넌트 (읽기 전용)
// props: todos(날짜별 투두 맵 { "YYYY-MM-DD": [...] }), onDateChange(날짜 선택 콜백)
function FriendCalendar({ todos = {}, onDateChange }) {
    // 선택된 날짜 상태
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Date 객체를 "YYYY-MM-DD" 문자열로 변환
    const formatDate = (date) => date.toLocaleDateString("sv-SE");

    // 날짜 선택 시 → 상태 업데이트 + 부모에게 선택 날짜 전달
    const handleChange = (date) => {
        setSelectedDate(date);
        if (onDateChange) {
            onDateChange(formatDate(date));
        }
    };

    // 타일에 투두 완료 현황 표시 (완료/전체 or ✓)
    const getTileContent = ({ date }) => {
        const key = formatDate(date);
        const items = todos[key] || [];
        const total = items.length;
        if (total === 0) return null;

        const done = items.filter((t) => t.done).length;
        return (
            <div className="tile-meta">
                {done === total ? "✓" : `${done}/${total}`}
            </div>
        );
    };

    // 모두 완료된 날짜는 tile-done 클래스 부여 (파란색 강조)
    const getTileClass = ({ date }) => {
        const key = formatDate(date);
        const items = todos[key] || [];
        if (items.length === 0) return null;
        return items.every((t) => t.done) ? "tile-done" : null;
    };

    return (
        <div className="calendar-container">
            <Calendar
                value={selectedDate}
                onChange={handleChange}
                calendarType="gregory"
                formatDay={(locale, date) => date.getDate()}
                tileContent={getTileContent}
                tileClassName={getTileClass}
            />
        </div>
    );
}

export default FriendCalendar;
