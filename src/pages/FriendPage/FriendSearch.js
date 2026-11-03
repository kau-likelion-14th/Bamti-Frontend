import React, { useEffect, useState } from "react";
import api from "../../Api";
import config from "../../Config";
import { toFriendModel } from "./friendModel";
import "../../styles/FriendSearch.css";

const PAGE_SIZE = 10;

// 검색어가 있으면 닉네임 검색(GET /api/follow/search),
// 없으면 팔로우 가능한 사용자 목록(GET /api/follow)을 요청
function requestSearch(nickname, page, signal) {
    if (!nickname) {
        return api.get(config.FOLLOW.AVAILABLE, {
            params: { page, size: PAGE_SIZE },
            signal,
        });
    }

    return api.get(config.FOLLOW.SEARCH, {
        params: { nickname, page, size: PAGE_SIZE },
        signal,
    });
}

// 친구 검색 컴포넌트
// props: onFollow(팔로우 콜백), followingList(현재 팔로우 목록),
//        followingId(팔로우 요청 중인 사용자 id), followError(팔로우 실패 문구),
//        followDisabled(부모 상태 때문에 팔로우 불가), refreshKey(바뀌면 다시 조회)
function FriendSearch({
    onFollow,
    followingList = [],
    followingId = null,
    followError = "",
    followDisabled = false,
    refreshKey = 0,
}) {
    // 입력창 값과 페이지
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [retryCount, setRetryCount] = useState(0);

    // 서버 응답 상태
    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 앞뒤 공백을 뺀 실제 검색어
    const nickname = query.trim();

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        setLoading(true);
        setError("");
        setResults([]);

        // 입력할 때마다 요청이 나가지 않도록 300ms 기다렸다가 요청 (빈 검색어는 바로)
        const timer = setTimeout(async () => {
            try {
                const { data } = await requestSearch(
                    nickname,
                    page,
                    controller.signal
                );

                // 검색 결과 배열은 result.content
                if (
                    data?.isSuccess === false ||
                    !Array.isArray(data?.result?.content) ||
                    !Number.isInteger(data.result.totalPages) ||
                    data.result.totalPages < 0
                ) {
                    throw new Error("검색 응답을 확인해 주세요.");
                }

                if (!active) return;

                // 팔로우로 마지막 페이지가 사라졌다면 유효한 페이지로 이동
                if (page > 0 && page >= data.result.totalPages) {
                    setPage(Math.max(0, data.result.totalPages - 1));
                    return;
                }

                setResults(data.result.content.map(toFriendModel));
                setTotalPages(data.result.totalPages);
            } catch {
                if (active) {
                    setError("검색에 실패했습니다. 다시 시도해 주세요.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }, nickname ? 300 : 0);

        // 새 검색이 시작되거나 화면을 벗어나면 이전 요청 정리
        return () => {
            active = false;
            clearTimeout(timer);
            controller.abort();
        };
    }, [nickname, page, retryCount, refreshKey]);

    const handleChange = (event) => {
        const nextQuery = event.target.value;
        setQuery(nextQuery);
        // 검색어가 바뀌면 첫 페이지부터, 예전 결과 버튼은 누르지 못하게 비움
        if (nextQuery.trim() !== nickname) {
            setPage(0);
            setResults([]);
            setError("");
        }
    };

    return (
        <section className="friend-search">
            <h2 className="friend-search__title">친구 검색</h2>

            {/* 검색 입력창 */}
            <div className="friend-search__input-wrap">
                <input
                    className="friend-search__input"
                    type="text"
                    aria-label="닉네임 검색"
                    placeholder="닉네임으로 검색 (예: 나나 또는 나나#1234)"
                    value={query}
                    onChange={handleChange}
                />
            </div>

            {/* 팔로우 실패 문구 */}
            {followError && (
                <div className="friend-search__empty" role="alert">{followError}</div>
            )}

            {/* 검색어가 없을 때는 팔로우 가능한 사용자 목록 안내 */}
            {!nickname && (
                <div className="friend-search__empty" style={{ marginBottom: 12 }}>
                    팔로우할 수 있는 사용자
                </div>
            )}

            {loading ? (
                <div className="friend-search__empty" role="status">
                    {nickname ? "검색 중..." : "불러오는 중..."}
                </div>
            ) : error ? (
                <div className="friend-search__empty">
                    <p role="alert">{error}</p>
                    <button
                        type="button"
                        className="friend-search__follow-btn"
                        onClick={() => setRetryCount((count) => count + 1)}
                    >
                        다시 시도
                    </button>
                </div>
            ) : results.length === 0 ? (
                <div className="friend-search__empty">
                    {nickname ? "검색 결과가 없습니다." : "팔로우할 수 있는 사용자가 없습니다."}
                </div>
            ) : (
                <ul className="friend-search__results">
                    {results.map((user) => {
                        const isFollowing = followingList.some(
                            (friend) => friend.id === user.id
                        );
                        const isPending = followingId === user.id;

                        return (
                            <li key={user.id} className="friend-search__result-item">
                                <div className="friend-search__info">
                                    <span className="friend-search__name">{user.name}</span>
                                    {user.tag && (
                                        <span className="friend-search__tag">#{user.tag}</span>
                                    )}
                                </div>

                                {/* 이미 팔로우 중이거나 다른 요청 진행 중이면 비활성화 */}
                                <button
                                    type="button"
                                    className={`friend-search__follow-btn ${isFollowing ? "following" : ""}`}
                                    disabled={
                                        isFollowing ||
                                        followingId !== null ||
                                        followDisabled
                                    }
                                    onClick={() => onFollow?.(user)}
                                >
                                    {isPending ? "처리 중..." : isFollowing ? "팔로잉" : "팔로우"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* 페이지 이동 */}
            {!loading && !error && totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
                    <button
                        type="button"
                        className="friend-search__follow-btn"
                        disabled={page === 0 || followingId !== null}
                        onClick={() => setPage((value) => value - 1)}
                    >
                        이전
                    </button>
                    <span className="friend-search__tag">{page + 1} / {totalPages}</span>
                    <button
                        type="button"
                        className="friend-search__follow-btn"
                        disabled={page + 1 >= totalPages || followingId !== null}
                        onClick={() => setPage((value) => value + 1)}
                    >
                        다음
                    </button>
                </div>
            )}
        </section>
    );
}

export default FriendSearch;
