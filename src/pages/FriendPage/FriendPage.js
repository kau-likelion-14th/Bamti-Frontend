import React, { useEffect, useRef, useState } from 'react';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';
import FriendUnfollowModal from './FriendUnfollowModal';
import api from '../../Api';
import config from '../../Config';
import { toFriendModel } from './friendModel';
import '../../styles/FriendPage.css';

// 친구 페이지 메인 컴포넌트
// 팔로우 목록 조회, 친구 검색/팔로우, 언팔로우 기능을 담당
function FriendPage() {
    // 서버에서 받아온 팔로우 목록
    const [followList, setFollowList] = useState([]);

    // 목록 조회 상태
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    // 다시 시도 버튼을 누르면 값을 바꿔 목록 조회 Effect를 다시 실행
    const [reloadCount, setReloadCount] = useState(0);

    // 언팔로우 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    // 언팔로우 요청 상태
    const [isRemoving, setIsRemoving] = useState(false);
    const [removeError, setRemoveError] = useState("");

    // 렌더링 전 연속 클릭까지 막기 위한 요청 잠금
    const removingRef = useRef(false);

    // 팔로우 요청 상태
    const followingRef = useRef(false);
    const [followingId, setFollowingId] = useState(null);
    const [followError, setFollowError] = useState("");

    // 값이 바뀌면 오른쪽 검색 결과를 서버에서 다시 조회
    const [searchRefreshKey, setSearchRefreshKey] = useState(0);

    // 팔로우 목록 조회
    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        const fetchFollowings = async () => {
            setLoading(true);
            setLoadError("");

            try {
                // 공통 api가 인증 헤더와 만료 토큰 재발급을 처리
                const { data } = await api.get(config.FOLLOW.FOLLOWINGS, {
                    signal: controller.signal,
                });

                // 잘못된 응답을 빈 목록으로 처리하지 않고 오류로 구분
                if (
                    data?.isSuccess === false ||
                    !Array.isArray(data?.result) ||
                    data.result.some((user) => user?.userId == null)
                ) {
                    throw new Error("잘못된 팔로우 목록 응답");
                }

                if (active) {
                    setFollowList(data.result.map(toFriendModel));
                }
            } catch {
                if (active) {
                    setLoadError("팔로우 목록을 불러오지 못했습니다.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchFollowings();

        // 페이지를 벗어나거나 Effect가 다시 실행될 때 이전 요청 정리
        return () => {
            active = false;
            controller.abort();
        };
    }, [reloadCount]);

    // 검색 결과에서 팔로우 버튼 클릭 시 호출
    const handleFollow = async (user) => {
        if (
            !user ||
            loading ||
            loadError ||
            isModalOpen ||
            followingRef.current ||
            removingRef.current ||
            followList.some((friend) => friend.id === user.id)
        ) {
            return;
        }

        followingRef.current = true;
        setFollowingId(user.id);
        setFollowError("");

        try {
            // POST는 두 번째 인수에 본문을 바로 넣음
            const response = await api.post(config.FOLLOW.CREATE, {
                toUserId: user.userId,
            });

            const data = response.data;

            if (
                data?.isSuccess === false ||
                data?.result?.userId == null ||
                String(data.result.userId) !== user.id
            ) {
                throw new Error("팔로우 응답을 확인해 주세요.");
            }

            const newFriend = toFriendModel(data.result);

            // 서버 성공을 확인한 뒤 왼쪽 목록에 추가 (같은 id가 있으면 그대로)
            setFollowList((prev) =>
                prev.some((friend) => friend.id === newFriend.id)
                    ? prev
                    : [...prev, newFriend]
            );

            // 팔로우 가능한 검색 결과도 서버에서 다시 확인
            setSearchRefreshKey((value) => value + 1);
        } catch {
            setFollowError("팔로우에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            followingRef.current = false;
            setFollowingId(null);
        }
    };

    // 삭제 아이콘 클릭 시 → 언팔로우 모달 열기 (아직 요청은 보내지 않음)
    const handleClickRemove = (friend) => {
        if (removingRef.current || followingRef.current) return;

        setSelectedFriend(friend);
        setRemoveError("");
        setIsModalOpen(true);
    };

    // 언팔로우 모달에서 확인 클릭 시 → 서버 삭제 후 목록에서 제거
    const handleConfirmRemove = async () => {
        if (!selectedFriend || removingRef.current) return;

        removingRef.current = true;
        setIsRemoving(true);
        setRemoveError("");

        try {
            // DELETE 요청의 본문은 옵션 객체의 data에 넣음
            const { data } = await api.delete(config.FOLLOW.DELETE, {
                data: {
                    toUserId: selectedFriend.userId,
                },
            });

            if (data?.isSuccess === false) {
                throw new Error("언팔로우 실패");
            }

            // 서버 성공을 확인한 뒤 화면 목록에서도 제거
            setFollowList((prev) =>
                prev.filter((friend) => friend.id !== selectedFriend.id)
            );

            setIsModalOpen(false);
            setSelectedFriend(null);

            // 언팔로우한 사용자가 다시 팔로우 가능 목록에 나오도록 재조회
            setSearchRefreshKey((value) => value + 1);
        } catch {
            // 실패하면 목록과 모달 유지
            setRemoveError("언팔로우에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            removingRef.current = false;
            setIsRemoving(false);
        }
    };

    // 언팔로우 모달 닫기 (요청 중에는 닫지 않음)
    const handleCloseModal = () => {
        if (removingRef.current) return;

        setIsModalOpen(false);
        setSelectedFriend(null);
        setRemoveError("");
    };

    return (
        <div className="friend-page">
            <div className="friend-page__inner">
                {/* 팔로우 목록 + 친구 검색을 나란히 배치 */}
                <div className="friend-page__grid">
                    <FriendList
                        friends={followList}
                        onClickRemove={handleClickRemove}
                        loading={loading}
                        error={loadError}
                        onRetry={() => setReloadCount((count) => count + 1)}
                        emptyText="팔로우하는 친구가 없습니다."
                    />

                    <FriendSearch
                        onFollow={handleFollow}
                        followingList={followList}
                        followingId={followingId}
                        followError={followError}
                        followDisabled={
                            loading ||
                            Boolean(loadError) ||
                            isModalOpen ||
                            isRemoving
                        }
                        refreshKey={searchRefreshKey}
                    />
                </div>
            </div>

            {/* 언팔로우 확인 모달 */}
            <FriendUnfollowModal
                isOpen={isModalOpen}
                friend={selectedFriend}
                onConfirm={handleConfirmRemove}
                onClose={handleCloseModal}
                isSubmitting={isRemoving}
                error={removeError}
            />
        </div>
    );
}

export default FriendPage;
