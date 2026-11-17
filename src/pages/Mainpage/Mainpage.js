import React, { useEffect, useState } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import { get, post, put, del, patch } from "../../Api";
import config from "../../Config";
import "../../styles/MainPage.css";

const toDateKey = (date) => { // 날짜 객체를 "YYYY-MM-DD" 문자열로 바꾸는 함수 (달력과 Todo가 같은 키를 쓰기 위함)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 서버 응답(todoId, description, categoryName, completed)을 프론트에서 쓰는 형태로 변환
const toTodoModel = (todo) => ({
  id: todo.todoId,
  text: todo.description,
  category: todo.categoryName,
  completed: todo.completed,
});

// 상세 조회 응답 → 수정 모달에서 쓰는 형태로 변환
const toTodoForm = (detail) => ({
  id: detail.todoId,
  text: detail.description,
  category: detail.categoryName,
  routine: detail.routineEnabled
    ? { startDate: detail.startDate, endDate: detail.endDate, week: detail.week }
    : null,
});

// 모달 입력값 → 추가·수정 API 요청 body로 변환
const toTodoRequest = ({ text, category, routine }) => ({
  categoryName: category,
  description: text,
  routineEnabled: Boolean(routine),
  startDate: routine?.startDate ?? null,
  endDate: routine?.endDate ?? null,
  week: routine?.week ?? null,
});

// 서버 에러 메시지가 있으면 그걸 보여주고, 없으면 기본 문구 사용
const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

// 캘린더 응답에서 날짜 목록 꺼내기 (result가 배열이거나 { days: [...] } 형태 모두 처리)
const extractDays = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.days)) return result.days;
  return [];
};

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date()); // 선택된 날짜 (Todo 조회 기준)
  const [viewDate, setViewDate] = useState(() => new Date()); // 캘린더에 보이는 달 (캘린더 조회 기준)

  const [todos, setTodos] = useState([]); // 선택한 날짜의 Todo 목록 (서버 데이터)
  const [remainingByDate, setRemainingByDate] = useState({}); // { "2026-11-07": { hasTodo, remaining } }
  const [refreshKey, setRefreshKey] = useState(0); // 추가·수정·삭제·완료 후 캘린더와 Todo를 다시 조회하기 위한 키
  const [togglingId, setTogglingId] = useState(null); // 요청 중인 Todo (중복 클릭 방지)

  const dateKey = toDateKey(selectedDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1; // getMonth()는 0부터 시작

  // 1. 캘린더 조회 : 연도/월이 바뀌거나 완료 상태가 바뀌면 다시 조회
  useEffect(() => {
    let active = true;

    const fetchCalendar = async () => {
      try {
        const response = await get(config.CALENDAR.GET, { year, month });
        const days = extractDays(response?.result);
        if (!active) return;
        setRemainingByDate(Object.fromEntries(days.map((day) => [day.date, day])));
      } catch (error) {
        console.error("캘린더 조회 실패:", error);
        if (active) setRemainingByDate({});
      }
    };

    fetchCalendar();
    return () => {
      active = false;
    };
  }, [year, month, refreshKey]);

  // 2. 날짜별 Todo 조회 : 선택한 날짜가 바뀌거나 완료 상태가 바뀌면 다시 조회
  useEffect(() => {
    let active = true;

    const fetchTodos = async () => {
      try {
        const response = await get(config.TODOS.LIST, { date: dateKey });
        const list = Array.isArray(response?.result) ? response.result : [];
        if (active) setTodos(list.map(toTodoModel));
      } catch (error) {
        console.error("Todo 조회 실패:", error);
        if (active) setTodos([]);
      }
    };

    fetchTodos();
    return () => {
      active = false;
    };
  }, [dateKey, refreshKey]);

  // 날짜 클릭 : 다른 달 날짜를 누르면 캘린더도 그 달로 이동
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setViewDate(date);
  };

  // 3. 완료 상태 변경 : 성공했을 때만 다시 조회 (실패하면 화면 그대로 유지)
  const handleToggleComplete = async (todo) => {
    if (togglingId !== null) return;
    setTogglingId(todo.id);

    try {
      await patch(config.TODOS.TOGGLE_COMPLETE(todo.id, dateKey), {
        completed: !todo.completed,
      });
      refresh();
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
      alert("완료 상태를 변경하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setTogglingId(null);
    }
  };

  const refresh = () => setRefreshKey((prev) => prev + 1);

  // 4. 상세 조회 : Todo를 눌렀을 때 수정 모달에 채울 데이터 가져오기
  const handleFetchDetail = async (todoId) => {
    try {
      const response = await get(config.TODOS.DETAIL(todoId));
      return toTodoForm(response.result);
    } catch (error) {
      console.error("Todo 상세 조회 실패:", error);
      alert(getErrorMessage(error, "Todo 정보를 불러오지 못했습니다."));
      return null;
    }
  };

  // 5. 추가 : 일반 Todo는 선택한 날짜에, 루틴 Todo는 시작~종료 날짜의 반복 요일에 생성
  const handleCreateTodo = async (form) => {
    try {
      await post(config.TODOS.CREATE, toTodoRequest(form), {
        params: form.routine ? {} : { date: dateKey },
      });
      refresh();
      return true;
    } catch (error) {
      console.error("Todo 추가 실패:", error);
      alert(getErrorMessage(error, "Todo를 추가하지 못했습니다."));
      return false;
    }
  };

  // 6. 수정
  const handleUpdateTodo = async (todoId, form) => {
    try {
      await put(config.TODOS.DETAIL(todoId), toTodoRequest(form));
      refresh();
      return true;
    } catch (error) {
      console.error("Todo 수정 실패:", error);
      alert(getErrorMessage(error, "Todo를 수정하지 못했습니다."));
      return false;
    }
  };

  // 7. 삭제 : 선택한 날짜 기준 (루틴 Todo는 그 날짜만 삭제됨)
  const handleDeleteTodo = async (todoId) => {
    try {
      await del(config.TODOS.DELETE(todoId, dateKey));
      refresh();
      return true;
    } catch (error) {
      console.error("Todo 삭제 실패:", error);
      alert(getErrorMessage(error, "Todo를 삭제하지 못했습니다."));
      return false;
    }
  };

  return (
    <div className="mainpage-container">
      <CustomCalendar
        selectedDate={selectedDate} // 현재 선택된 날짜
        viewDate={viewDate} // 현재 보고 있는 달
        onDateChange={handleDateChange} // 날짜 클릭
        onMonthChange={setViewDate} // 이전 달·다음 달 이동
        remainingByDate={remainingByDate} // 서버에서 받은 날짜별 남은 Todo 개수
      />
      <Todo
        todos={todos} // 서버에서 받은 선택 날짜의 Todo 목록
        onToggleComplete={handleToggleComplete} // 체크박스 클릭 시 서버에 완료 상태 변경
        togglingId={togglingId}
        selectedDateKey={dateKey} // 루틴 시작 날짜 기본값
        onFetchDetail={handleFetchDetail}
        onCreate={handleCreateTodo}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};

export default MainPage; //MainPage라는 컴포넌트를 다른 파일에서도 가져다 쓸 수 있도록 "밖으로 내보내는" 명령어
