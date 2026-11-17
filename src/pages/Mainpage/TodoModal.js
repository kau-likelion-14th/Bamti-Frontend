import React, {useEffect, useState} from "react";
import "../../styles/Todo.css";
import RoutineModal, { WEEK_LABELS } from "./RoutineModal";

// 루틴 요약 문구 (예: "매주 월 · 2026-11-17 ~ 2026-12-31")
const formatRoutine = (routine) =>
    `매주 ${WEEK_LABELS[routine.week] ?? ""} · ${routine.startDate} ~ ${routine.endDate}`;

const TodoModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    onDelete, 
    initialTodo,
    categories = {},
    defaultStartDate,
}) => {
    const isEditMode = Boolean(initialTodo); 

    const categoryKeys = Object.keys(categories); // 서버에서 받은 카테고리 이름 목록
    const defaultCategory = categoryKeys[0] || "";

    const [category, setCategory] = useState(defaultCategory); 
    const [text, setText] = useState("");
    const [routine, setRoutine] = useState(null);

    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // 저장·삭제 요청 중 중복 클릭 방지

    // 서버가 일반 ↔ 루틴 타입 변경을 지원하지 않아서, 수정 모드의 일반 Todo는 루틴 등록을 막음
    const isRoutineLocked = isEditMode && !initialTodo?.routine;

    useEffect(() => {
        if (!isOpen) return;

        setCategory(initialTodo?.category || defaultCategory);
        setText(initialTodo?.text || "");
        setRoutine(initialTodo?.routine || null);
        setIsSaving(false);
    }, [isOpen, initialTodo, defaultCategory]);

    if (!isOpen) return null;

    const canSave = Boolean(text.trim() && category) && !isSaving;

    const handleSave = async () => {
        if (!canSave) return;

        setIsSaving(true);
        try {
            await onSave({
                text: text.trim(),
                category,
                routine,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || isSaving) return;

        setIsSaving(true);
        try {
            await onDelete();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}> 
            <div 
                className="modal-container" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-title">
                    {isEditMode ? "할 일 수정하기" : "할 일 추가하기"}
                </div>
                <div className="modal-section">
                    <div className="modal-label">카테고리</div>
                    <div className="modal-categories">
                        {categoryKeys.length === 0 && (
                            <div className="modal-label">카테고리를 불러오는 중...</div>
                        )}
                        {categoryKeys.map((c) => (
                            <label
                                key={c}
                                className={`modal-categoryitem ${category === c ? 'selected' : ''}`}
                            >
                                <span style={categories[c]}>{c}</span> 
                                <input
                                    type="radio"
                                    name="category"
                                    value={c}
                                    checked={category === c}
                                    onChange={() => setCategory(c)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="modal-section">
                    <div className="modal-label">내용</div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="text-input"
                            placeholder="내용을 입력해주세요"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-section">
                    <button
                        type="button"
                        className={`routine-row ${isRoutineLocked ? 'disabled' : ''}`}
                        onClick={() => setIsRoutineModalOpen(true)}
                        disabled={isRoutineLocked}
                    >
                        <div className="routine-label">
                            {isRoutineLocked
                                ? "일반 할 일은 루틴으로 바꿀 수 없어요"
                                : routine
                                    ? formatRoutine(routine)
                                    : "루틴 등록하기"}
                        </div>
                        {!isRoutineLocked && <div className="routine-button">{"›"}</div>}
                    </button>
                    {!isEditMode && routine && (
                        <button
                            type="button"
                            className="routine-clear"
                            onClick={() => setRoutine(null)}
                        >
                            루틴 해제
                        </button>
                    )}
                </div>
                <div className="modal-actions">
                    <button
                        className={`leftbutton ${isEditMode && !isSaving ? '' : 'disabled'}`}
                        onClick={handleDelete}
                        disabled={!isEditMode || isSaving}
                    >
                        삭제
                    </button>
                    <button
                        className={`rightbutton ${canSave ? '' : 'disabled'}`}
                        onClick={handleSave}
                        disabled={!canSave}
                    >
                        저장
                    </button>
                </div>
                <RoutineModal
                    isOpen={isRoutineModalOpen}
                    initialRoutine={routine}
                    defaultStartDate={defaultStartDate}
                    onClose={() => setIsRoutineModalOpen(false)}
                    onSave={(newRoutine) => {
                        setRoutine(newRoutine);
                        setIsRoutineModalOpen(false);
                    }}
                />
            </div>
        </div>
    );
};

export default TodoModal;
