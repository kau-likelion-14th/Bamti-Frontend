import React from "react";
import "../../styles/FriendTodo.css";

// 친구의 투두 목록을 읽기 전용으로 표시하는 컴포넌트
// props: todos(투두 배열 [{ id, text, done }])
function FriendTodo({ todos = [] }) {
    // 해당 날짜에 투두가 없을 때
    if (todos.length === 0) {
        return (
            <div className="friend-todo">
                <div className="friend-todo__empty">이 날은 할 일이 없어요.</div>
            </div>
        );
    }

    return (
        <div className="friend-todo">
            <ul className="friend-todo__list">
                {todos.map((todo) => (
                    <li key={todo.id} className={`friend-todo__item ${todo.done ? "done" : ""}`}>
                        {/* 완료 여부 체크박스 (읽기 전용) */}
                        <div className={`checkbox ${todo.done ? "checked" : ""}`} />
                        <span className="friend-todo__text">{todo.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FriendTodo;
