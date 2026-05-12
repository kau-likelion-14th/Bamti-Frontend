import React from 'react';
import { useMemo, useState } from 'react';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';
import FriendUnfollowModal from './FriendUnfollowModal';
import '../../styles/FriendPage.css';

// 초기 팔로우 목록 더미 데이터 (실제 서비스에서는 API로 받아옴)
const initialFollowList = [
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
]

// 친구 페이지 메인 컴포넌트
// 팔로우 목록 조회, 친구 검색/팔로우, 언팔로우 기능을 담당
function FriendPage() {
    // 팔로우 중인 친구 목록
    const [followList, setFollowList] = useState(initialFollowList);

    // 팔로우 중인 userId Set (중복 팔로우 방지용)
    const followIds = useMemo(
        () => new Set(followList.map((x) => String(x.userId))),
    [followList]);

    // 언팔로우 모달 열림/닫힘 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 언팔로우 대상 친구
    const [selectedFriend, setSelectedFriend] = useState(null);

    // 친구 검색 후 팔로우 버튼 클릭 시 호출
    const handleFollow = (user) => {
        if (!user?.userId) return;
        if (followIds.has(String(user.userId))) return; // 이미 팔로우 중이면 무시

        setFollowList((prev) => [...prev, user]);
    };

    // 삭제 아이콘 클릭 시 → 언팔로우 모달 열기
    const handleClickRemove = (friend) => {
        setSelectedFriend(friend);
        setIsModalOpen(true);
    }

    // 언팔로우 모달에서 확인 클릭 시 → 목록에서 제거
    const handleConfirmRemove = () => {
        if (!selectedFriend) return;
        setFollowList((prev) =>
            prev.filter((friend) => friend.id !== selectedFriend.id)
        );
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    // 언팔로우 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    return (
        <div className="friend-page">
            <div className="friend-page__inner">
                {/* 팔로우 목록 + 친구 검색을 나란히 배치 */}
                <div className="friend-page__grid">
                    <FriendList
                        friends={followList}
                        onClickRemove={handleClickRemove}
                        emptyText="팔로우하는 친구가 없습니다."
                    />

                    <FriendSearch
                        onFollow={handleFollow}
                        followingList={followList}
                    />
                </div>
            </div>

            {/* 언팔로우 확인 모달 */}
            <FriendUnfollowModal
                isOpen={isModalOpen}
                friend={selectedFriend}
                onConfirm={handleConfirmRemove}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default FriendPage;
