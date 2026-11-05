// 서버 응답(userId, userName, introduction)을 친구 UI가 쓰는 형태(id, name, tag, bio)로 변환
export function toFriendModel(user) {
    if (user?.userId == null) {
        throw new Error("사용자 ID가 없습니다.");
    }

    // "나나#1234" → name: "나나", tag: "1234"
    const [name, tag = ""] = (user.userName || "").split("#");

    return {
        id: String(user.userId), // 화면 비교용 문자열 ID
        userId: user.userId,     // 서버 요청용 원래 ID
        name: name || "이름 없음",
        tag,
        bio: user.introduction || "",
        profileImageUrl: user.profileImageUrl || null,
    };
}
