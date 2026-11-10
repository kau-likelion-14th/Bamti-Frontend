import React, { useEffect, useMemo, useState } from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { get } from "../../Api";
import config from "../../Config";

// 서버에서 색상을 주지 않거나 응답 전일 때 사용할 기본 색상
const DEFAULT_COLORS = {
    공부: '#E5F8F1',
    운동: '#FFC8BE',
    일상: '#FFC8BE',
    동아리: '#B6DAFF',
};
const FALLBACK_PALETTE = ['#E5F8F1', '#FFC8BE', '#B6DAFF', '#FFF1B8', '#E3D7FF'];

const isHexColor = (value) => typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

// 서버 카테고리 목록 → { 카테고리이름: 스타일 } 형태로 변환
const toCategoryStyles = (list) =>
    list.reduce((acc, category, index) => {
        const name = category?.categoryName ?? category?.name;
        if (!name) return acc;

        const serverColor = category.color ?? category.colorCode;
        const backgroundColor = isHexColor(serverColor)
            ? serverColor
            : DEFAULT_COLORS[name] ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];

        acc[name] = { backgroundColor, color: '#333' };
        return acc;
    }, {});

const Todo = ({ todos = [], onToggleComplete, togglingId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serverCategories, setServerCategories] = useState([]);

    // 카테고리 조회 (처음 한 번)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await get(config.CATEGORIES.GET);
                const list = Array.isArray(response?.result) ? response.result : [];
                setServerCategories(list);
            } catch (error) {
                console.error("카테고리 조회 실패:", error);
            }
        };

        fetchCategories();
    }, []);

    const categories = useMemo(() => toCategoryStyles(serverCategories), [serverCategories]);

    // Todo의 카테고리가 목록에 없을 때도 색이 나오도록 기본값 사용
    const getCategoryStyle = (name) =>
        categories[name] ?? { backgroundColor: DEFAULT_COLORS[name] ?? '#EEEEEE', color: '#333' };

    // Todo 추가 API는 이번 과제 범위가 아니라서 저장 시 모달만 닫음
    const handledSaveTodo = () => {
        setIsModalOpen(false);
    };

    const handledDeleteTodo = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={() => setIsModalOpen(true)}>+</button>
            </div>
            <div className="todo-list">
                {todos.map((t) => (
                    <div
                        key={t.id}
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                    >
                        <div className="todo-text">{t.text}</div>
                        <div className="todo-category" style={getCategoryStyle(t.category)}>
                            {t.category}
                        </div>
                        <button
                            className={`checkbox ${t.completed ? 'checked' : ''}`}
                            disabled={togglingId === t.id}
                            onClick={(e) => {
                                e.stopPropagation(); // 체크박스 클릭 시 수정 모달이 열리지 않도록
                                onToggleComplete?.(t);
                            }}
                        >
                        </button>
                    </div>
                ))}
            </div>
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handledSaveTodo}
                onDelete={handledDeleteTodo}
                initialTodo={null}
                categories={categories}
            />
        </div>
    );
};

export default Todo;
