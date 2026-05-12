import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";
import "../../styles/FriendDetailPage.css";

// 더미 친구 데이터 (실제 서비스에서는 id로 API 조회)
const dummyFriends = {
    "1": { id: "1", name: "나나", tag: "1234", bio: "안녕하세요! 저는 나나입니다.", song: "Supernova - aespa",       profileImageUrl: null },
    "2": { id: "2", name: "얀",   tag: "2342", bio: "^^",                          song: "Ditto - NewJeans",        profileImageUrl: null },
    "3": { id: "3", name: "지말", tag: "1214", bio: "ㅎㅎ",                        song: "APT. - ROSÉ & Bruno Mars", profileImageUrl: null },
    "4": { id: "4", name: "코다", tag: "1223", bio: ";ㅁ;",                        song: "",                        profileImageUrl: null },
    "5": { id: "5", name: "딜런", tag: "1777", bio: ".",                           song: "",                        profileImageUrl: null },
};

// 더미 투두 데이터
const dummyTodos = {
    "1": {
        "2026-05-12": [
            { id: 1, text: "운동하기", done: true },
            { id: 2, text: "독서 30분", done: false },
        ],
        "2026-05-10": [
            { id: 3, text: "일기 쓰기", done: true },
        ],
    },
};

// 친구 상세 페이지 컴포넌트
// URL 파라미터 (:id)로 친구를 특정하고, 해당 친구의 캘린더와 투두를 보여줌
function FriendDetailPage() {
    const navigate = useNavigate();
    // URL에서 친구 id 추출 (/friends/:id)
    const { id } = useParams();

    // id로 친구 정보 조회
    const friend = dummyFriends[id];

    // 캘린더에서 선택한 날짜 (기본값: 오늘)
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("sv-SE")
    );

    // 선택된 날짜의 투두 목록
    const todosForDate = dummyTodos[id]?.[selectedDate] || [];

    // song 필드를 "제목 - 아티스트" 형식으로 파싱
    const parseSong = (songStr) => {
        if (!songStr) return null;
        const parts = songStr.split(" - ");
        return { title: parts[0] || songStr, artist: parts[1] || "" };
    };
    const songInfo = parseSong(friend?.song);

    // 존재하지 않는 친구 id인 경우
    if (!friend) {
        return <div className="friend-detail__not-found">존재하지 않는 친구입니다.</div>;
    }

    return (
        <div className="friend-detail">
            <div className="friend-detail__inner">

                {/* 뒤로가기 버튼 + 친구 프로필 헤더 */}
                <div className="friend-detail__header">
                    <button className="friend-detail__back" onClick={() => navigate(-1)}>‹</button>
                    <div className="friend-detail__avatar">
                        {friend.profileImageUrl ? (
                            <img
                                src={friend.profileImageUrl}
                                alt="프로필"
                                className="friend-detail__avatar-img"
                            />
                        ) : (
                            <UserIcon />
                        )}
                    </div>
                    <div>
                        <div className="friend-detail__name">
                            {friend.name}
                            <span className="friend-detail__tag">#{friend.tag}</span>
                        </div>
                        {friend.bio && (
                            <div className="friend-detail__bio">{friend.bio}</div>
                        )}
                    </div>
                </div>

                {/* 캘린더 + 오른쪽 영역 */}
                <div className="friend-detail__content">
                    {/* 캘린더: 날짜 선택 시 selectedDate 업데이트 */}
                    <FriendCalendar
                        todos={dummyTodos[id] || {}}
                        onDateChange={setSelectedDate}
                    />

                    {/* 오른쪽: 음악 카드 + 투두 목록 */}
                    <div className="friend-detail__right">
                        {/* 좋아하는 노래 카드 - 등록한 경우에만 표시 */}
                        {songInfo && (
                            <div className="friend-detail__music-card">
                                <div className="friend-detail__music-thumb" />
                                <div className="friend-detail__music-info">
                                    <div className="friend-detail__music-title">{songInfo.title}</div>
                                    {songInfo.artist && (
                                        <div className="friend-detail__music-artist">{songInfo.artist}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 선택한 날짜의 투두 목록 */}
                        <div className="friend-detail__todo-section">
                            <div className="friend-detail__todo-title">To do List</div>
                            <FriendTodo todos={todosForDate} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 프로필 사진 없을 때 쓰는 기본 아이콘 SVG
function UserIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default FriendDetailPage;
