import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

// 팔로우 목록을 보여주는 컴포넌트
// props: title(제목), friends(친구 목록), onClickRemove(삭제 콜백), emptyText(빈 목록 메시지)
function FriendList(
  {
    title = "팔로우 목록",
    friends = [],
    onClickRemove,
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) {
  const navigate = useNavigate();

  // 친구 상세 페이지로 이동 (경로: /friends/:id)
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`);
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {/* 친구 목록이 없을 때 */}
      {friends.length === 0 ? (
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
                    <span className="friend-info__tag">#{friend.tag}</span>
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
