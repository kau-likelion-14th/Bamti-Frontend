import React, { useEffect, useState } from "react";
import "../../styles/Todo.css";

// 서버 WeekEnum 값과 화면에 보여줄 요일 이름 (서버는 요일을 하나만 받음)
const WEEKS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const WEEK_LABELS = {
    MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일",
};

// 입력값 검사 : 문제가 있으면 에러 문구, 없으면 null
const validateRoutine = ({ startDate, endDate, week }) => {
    if (!startDate) return "시작 날짜를 선택해주세요.";
    if (!endDate) return "종료 날짜를 선택해주세요.";
    if (startDate > endDate) return "시작 날짜는 종료 날짜보다 이전이어야 해요.";
    if (!week) return "반복할 요일을 선택해주세요.";
    return null;
};

const RoutineModal = ({
    isOpen,
    onClose,
    onSave,
    initialRoutine,
    defaultStartDate,
}) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [week, setWeek] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setStartDate(initialRoutine?.startDate || defaultStartDate || "");
        setEndDate(initialRoutine?.endDate || "");
        setWeek(initialRoutine?.week ?? null);
        setError("");
    }, [isOpen, initialRoutine, defaultStartDate]);

    if (!isOpen) return null;

    const handleSave = () => {
        const routine = { startDate, endDate, week };
        const message = validateRoutine(routine);
        if (message) {
            setError(message);
            return;
        }
        onSave(routine);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="routine-header">
                    <div className="routine-close" onClick={onClose}>{"‹"}</div>
                    <div className="routine-title">루틴 등록하기</div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">시작 날짜</div>
                    <div className="date-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="date-initial">{startDate || "없음"}</span>
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">종료 날짜</div>
                    <div className="date-wrapper">
                        <input
                            type="date"
                            className="date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <span className="date-initial">{endDate || "없음"}</span>
                    </div>
                </div>

                <div className="modal-section">
                    <div className="modal-label">반복</div>
                    <div className="modal-categories">
                        {WEEKS.map((w) => (
                            <label
                                key={w}
                                className={`modal-categoryitem ${week === w ? "on" : ""}`}
                            >
                                <span>{WEEK_LABELS[w]}</span>
                                <input
                                    type="radio"
                                    name="routine-week"
                                    checked={week === w}
                                    onChange={() => setWeek(w)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {error && <div className="routine-error">{error}</div>}

                <div className="modal-actions">
                    <button className="leftbutton2" onClick={onClose}>취소</button>
                    <button className="rightbutton" onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default RoutineModal;
