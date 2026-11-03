import React, { useEffect } from "react";
import "../../styles/Todo.css";

// 언팔로우 확인 모달 컴포넌트 (DELETE 요청은 부모 FriendPage가 담당)
// props: isOpen, friend, onConfirm, onClose, isSubmitting(요청 중), error(삭제 실패 문구)
function FriendUnfollowModal({
    isOpen,
    friend,
    onConfirm,
    onClose,
    isSubmitting = false,
    error = "",
}) {
    // 모달이 열려 있을 때 Escape 키로 닫기 (Hook은 조건부 return보다 위에서 호출)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // 모달이 닫혀 있거나 대상 친구가 없으면 렌더링하지 않음
    if (!isOpen || !friend) return null;

    // 배경 자체를 클릭했을 때만 닫기 (내부 클릭은 무시)
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                className="modal-container"
                role="dialog"
                aria-modal="true"
                aria-label="언팔로우 확인"
                aria-busy={isSubmitting}
            >
                {/* 모달 제목 */}
                <div className="modal-title">팔로우 취소</div>

                {/* 안내 메시지 */}
                <p style={{ textAlign: "center", color: "#555", fontSize: "15px", margin: 0 }}>
                    <strong>{friend.name}</strong>
                    {friend.tag && <span style={{ color: "#8f8f8f" }}> #{friend.tag}</span>}
                    {" "}님을 언팔로우 하시겠어요?
                </p>

                {/* 삭제 실패 시 오류 문구 */}
                {error && (
                    <p role="alert" style={{ textAlign: "center", color: "#e5484d", fontSize: "14px", margin: 0 }}>
                        {error}
                    </p>
                )}

                {/* 취소 / 확인 버튼 (요청 중에는 비활성화) */}
                <div className="modal-actions">
                    <button
                        type="button"
                        className="leftbutton2"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="rightbutton"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "처리 중..." : "확인"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FriendUnfollowModal;
