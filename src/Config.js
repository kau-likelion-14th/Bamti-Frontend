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
        CALENDAR: (id) => `/api/follow/${encodeURIComponent(id)}/calendar`,
        FOLLOWINGS: "/api/follow/followings", // GET    내가 팔로우한 목록
        DELETE: "/api/follow",                // DELETE 언팔로우
        SEARCH: "/api/follow/search",         // GET    닉네임으로 팔로우 가능 사용자 검색
        CREATE: "/api/follow",                // POST   팔로우
        AVAILABLE: "/api/follow",             // GET    팔로우 가능 사용자 목록
    },

    PROFILE: {
        GET: "/api/profile",
        PUT: "/api/profile",
        DELETE: "/api/profile",
        INTRO: "/api/profile"
,
    },

    CALENDAR: {
        GET: "/api/todos/calendar",           // GET    월별 캘린더 조회 (?year=&month=)
    },

    TODOS: {
        LIST: "/api/todos",                   // GET    날짜별 Todo 조회 (?date=YYYY-MM-DD)
        TOGGLE_COMPLETE: (todoId, date) =>    // PATCH  Todo 완료 상태 변경
            `/api/todos/${todoId}/dates/${date}/complete`,
    },

    CATEGORIES: {
        GET: "/api/categories",               // GET    카테고리 조회
    },
}

export default config;
