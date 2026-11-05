import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

// 팔로우 목록을 보여주는 컴포넌트 (API 요청은 부모 FriendPage가 담당)
// props: title, friends, onClickRemove, emptyText, loading(조회 중), error(조회 실패 문구), onRetry(다시 조회)
function FriendList(
  {
    title = "팔로우 목록",
    friends = [],
    onClickRemove,
    emptyText = "팔로우하는 친구가 없습니다.",
    loading = false,
    error = "",
    onRetry,
  }
) {
  const navigate = useNavigate();

  // 친구 상세 페이지로 이동 (경로: /friends/:id)
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, {
      state: { friend },
    });
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {/* 표시 우선순위: 로딩 → 오류 → 빈 목록 → 목록 */}
      {loading ? (
        <div className="friend-list__empty" role="status">
          팔로우 목록을 불러오는 중...
        </div>
      ) : error ? (
        <div className="friend-list__empty">
          <p role="alert">{error}</p>
          <button type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">
              {/* 클릭 시 친구 상세 페이지로 이동 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => goFriendDetail(friend)}
                >

                {/* 프로필 이미지 or 기본 아이콘 */}
                <div className="friend-avatar" aria-hidden="true">
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                      />
                  ) : (
                    <UserIcon/>
                  )}
                </div>

                {/* 친구 이름, 태그, 소개글 */}
                <div className="friend-info">
                  <div className="friend-info__top">
                    <span className="friend-info__name">{friend.name}</span>
                    {friend.tag && (
                      <span className="friend-info__tag">#{friend.tag}</span>
                    )}
                  </div>

                  {friend.bio ? (
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 언팔로우 버튼 - 클릭 이벤트 버블링 방지 */}
              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickRemove?.(friend);
                }}
                >
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
                </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// 프로필 이미지가 없을 때 보여주는 기본 유저 아이콘 SVG
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendList;
