import React, { useState, useMemo } from "react";
import "../../styles/FriendSearch.css";

// 더미 전체 유저 목록 (실제 서비스에서는 검색 API로 받아옴)
const allUsers = [
    { id: "10", userId: 10, name: "하루", tag: "0001", bio: "매일 성장하는 중", profileImageUrl: null },
    { id: "11", userId: 11, name: "민준", tag: "0002", bio: "개발자 지망생", profileImageUrl: null },
    { id: "12", userId: 12, name: "서연", tag: "0003", bio: "오늘도 화이팅!", profileImageUrl: null },
    { id: "13", userId: 13, name: "지호", tag: "0004", bio: "기록하는 삶", profileImageUrl: null },
];

// 친구 검색 컴포넌트
// props: onFollow(팔로우 콜백), followingList(현재 팔로우 목록)
function FriendSearch({ onFollow, followingList = [] }) {
    // 검색어 상태
    const [query, setQuery] = useState("");

    // 팔로우 중인 userId Set (팔로잉 여부 빠르게 확인)
    const followingIds = useMemo(
        () => new Set(followingList.map((f) => String(f.userId))),
        [followingList]
    );

    // 검색어에 맞는 유저 필터링 (이름 또는 태그로 검색)
    const results = useMemo(() => {
        const q = query.trim();
        if (!q) return [];
        return allUsers.filter(
            (u) => u.name.includes(q) || u.tag.includes(q)
        );
    }, [query]);

    return (
        <section className="friend-search">
            <h2 className="friend-search__title">친구 검색</h2>

            {/* 검색 입력창 */}
            <div className="friend-search__input-wrap">
                <input
                    className="friend-search__input"
                    type="text"
                    placeholder="이름 또는 태그로 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* 검색 결과 목록 */}
            {results.length > 0 && (
                <ul className="friend-search__results">
                    {results.map((user) => {
                        const isFollowing = followingIds.has(String(user.userId));
                        return (
                            <li key={user.id} className="friend-search__result-item">
                                <div className="friend-search__info">
                                    <span className="friend-search__name">{user.name}</span>
                                    <span className="friend-search__tag">#{user.tag}</span>
                                </div>
                                {/* 이미 팔로우 중이면 비활성화 */}
                                <button
                                    className={`friend-search__follow-btn ${isFollowing ? "following" : ""}`}
                                    onClick={() => !isFollowing && onFollow(user)}
                                    disabled={isFollowing}
                                >
                                    {isFollowing ? "팔로잉" : "팔로우"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* 검색어는 있는데 결과가 없을 때 */}
            {query.trim() && results.length === 0 && (
                <div className="friend-search__empty">검색 결과가 없습니다.</div>
            )}
        </section>
    );
}

export default FriendSearch;
