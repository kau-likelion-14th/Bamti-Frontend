import React from "react";
import "../../styles/Todo.css";

// 친구의 투두 목록을 읽기 전용으로 표시하는 컴포넌트
// 메인페이지와 동일한 Todo.css 스타일 사용
// props: todos(투두 배열 [{ id, text, done }])
function FriendTodo({ todos = [] }) {
    // 해당 날짜에 투두가 없을 때
    if (todos.length === 0) {
        return (
            <div className="todo-list">
                <div style={{ fontSize: "14px", color: "#8f8f8f" }}>이 날은 할 일이 없어요.</div>
            </div>
        );
    }

    return (
        <div className="todo-list">
            {todos.map((todo) => (
                <div key={todo.id} className={`todo-item ${todo.done ? "done" : ""}`}>
                    {/* 완료 여부 체크박스 (읽기 전용) */}
                    <div className={`checkbox ${todo.done ? "checked" : ""}`} />
                    <span className="todo-text">{todo.text}</span>
                </div>
            ))}
        </div>
    );
}

export default FriendTodo;
