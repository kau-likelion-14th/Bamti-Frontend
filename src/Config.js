const config = {
    API_URL: "",

    AUTH: {
        KAKAO: "/api/auth/kakao",
        REISSUE: "/api/auth/reissue",
        LOGOUT: "/api/auth/logout",
        WITHDRAW: "/api/auth/withdraw"
    },

    FOLLOW: {
        PROFILE: (id) => `/api/follow/${encodeURIComponent(id)}`,
        TODOS: (id) => `/api/follow/${encodeURIComponent(id)}/todos`,
        CALENDAR: (id) => `/api/follow/${encodeURIComponent(id)}/calendat`,
        FOLLOWINGS: "/api/follow/followings", // GET    내가 팔로우한 목록
        DELETE: "/api/follow",                // DELETE 언팔로우
        SEARCH: "/api/follow/search",         // GET    닉네임으로 팔로우 가능 사용자 검색
        CREATE: "/api/follow",                // POST   팔로우
        AVAILABLE: "/api/follow",             // GET    팔로우 가능 사용자 목록
    },
}

export default config;
