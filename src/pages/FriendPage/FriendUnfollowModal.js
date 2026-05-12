import React from "react";
import "../../styles/Todo.css";

// 언팔로우 확인 모달 컴포넌트
// props: isOpen(열림 여부), friend(대상 친구), onConfirm(확인 콜백), onClose(닫기 콜백)
function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {
    // 모달이 닫혀 있거나 대상 친구가 없으면 렌더링하지 않음
    if (!isOpen || !friend) return null;

    return (
        // 오버레이 클릭 시 모달 닫기
        <div className="modal-overlay" onClick={onClose}>
            {/* 내부 클릭은 버블링 방지 */}
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* 모달 제목 */}
                <div className="modal-title">팔로우 취소</div>

                {/* 안내 메시지 */}
                <p style={{ textAlign: "center", color: "#555", fontSize: "15px", margin: 0 }}>
                    <strong>{friend.name}</strong> 님을 언팔로우 하시겠어요?
                </p>

                {/* 취소 / 확인 버튼 */}
                <div className="modal-actions">
                    <button className="leftbutton2" onClick={onClose}>취소</button>
                    <button className="rightbutton" onClick={onConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default FriendUnfollowModal;
