import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const getFirstDay = (year, month) => new Date(year, month, 1).getDay();
const getLastDate = (year, month) => new Date(year, month + 1, 0).getDate();
const toDateString = (year, month, day) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const WeekdayHeader = () => (
  <>
    {DAY_LABELS.map((day, i) => (
      <div
        key={day}
        className={`
          py-2 text-start pl-5 text-xs font-semibold tracking-widest uppercase
          ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}
        `}
      >
        {day}
      </div>
    ))}
  </>
);

const EmptyCells = ({ count }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={`empty-${i}`} />
    ))}
  </>
);

// DayCell props에 titleMap 추가
const DayCell = ({ day, year, month, today, colorMap, titleMap, onClick }) => {
  const dateStr = toDateString(year, month, day);
  const diaryColor = colorMap[dateStr];
  const diaryTitle = titleMap[dateStr];

  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const dayOfWeek = (getFirstDay(year, month) + day - 1) % 7;
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  return (
    <div
      onClick={() => onClick(day)}
      style={{
        backgroundColor: diaryColor && !isToday ? diaryColor : undefined,
      }}
      className={`
        group relative flex flex-col items-center justify-start pt-2 text-start
        w-full h-24 cursor-pointer select-none
        text-md font-medium
        transition-all duration-150
        hover:brightness-95
        active:scale-98
        ${isToday ? 'bg-gray-700 text-white hover:bg-gray-900 font-bold' : ''}
        ${!isToday && diaryColor ? 'text-white' : ''}
        ${!isToday && isSunday ? 'text-rose-600' : ''}
        ${!isToday && isSaturday ? 'text-blue-600' : ''}
        ${!isToday && !isSunday && !isSaturday ? 'text-gray-700' : ''}
      `}
    >
      <span className='w-full pl-5'>{day}</span>

      {diaryTitle && (
        <span className={`
          truncate w-28 bg-white text-xs my-1 rounded-[10px] h-[15px] flex items-center gap-2 
          ${isToday || diaryColor ? 'text-black' : 'text-gray-600'}
        `}>
          <div className='h-full w-2 bg-amber-300' />
          {diaryTitle}
        </span>
      )}

      {isToday && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
      )}
    </div>
  );
};

// ── 메인 컴포넌트 ─────────────────────────────────────
const CalendarPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(new Date());
  const [colorMap, setColorMap] = useState({}); // { "2026-05-02": "#ffcc00", ... }
  const [titleMap, setTitleMap] = useState({});

  const year = current.getFullYear();
  const month = current.getMonth();
  const today = new Date();

  const firstDay = getFirstDay(year, month);
  const lastDate = getLastDate(year, month);

  // 달력 색상 데이터 fetch
  useEffect(() => {
  const fetchCalendarColors = async () => {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();

      const colorM = {};
      const titleM = {};
      data.forEach(({ date, color, title }) => {
        colorM[date] = color;
        titleM[date] = title; // title도 같이 저장
      });
      setColorMap(colorM);
      setTitleMap(titleM);
    } catch (err) {
      console.error('달력 색상 데이터를 불러오지 못했습니다.', err);
    }
  };

  fetchCalendarColors();
}, []);

  // 날짜 클릭 — 해당 날짜 일기 존재 여부 확인 후 이동
  const handleDateClick = async (day) => {
    const dateStr = toDateString(year, month, day);

    try {
      const res = await fetch(`/api/diaries/date/${dateStr}`);
      const data = await res.json();

      // data가 false이면 일기 없음 → state로 알림
      navigate(`/day/${dateStr}`, { state: { diary: data } });
    } catch (err) {
      console.error('일기 조회 실패:', err);
      navigate(`/day/${dateStr}`, { state: { diary: false } });
    }
  };

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="w-full h-full flex item-center justify-center">
      <div className="w-[900px] overflow-hidden">
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
            {year}년 {month + 1}월
          </h2>
          <div className='flex gap-5 items-center'>
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:cursor-pointer transition-colors">
              <IoIosArrowBack />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:cursor-pointer transition-colors">
              <IoIosArrowForward />
            </button>
          </div>
        </div>

        <div className="py-4">
          <div className="grid grid-cols-7">
            <WeekdayHeader />
            <EmptyCells count={firstDay} />
            {Array.from({ length: lastDate }, (_, i) => i + 1).map((day) => (
              // DayCell 호출 시 titleMap 전달
              <DayCell
                key={day}
                day={day}
                year={year}
                month={month}
                today={today}
                colorMap={colorMap}
                titleMap={titleMap}   // ← 추가
                onClick={handleDateClick}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='w-[300px] bg-gray-100 overflow-y-scroll'>
        <div className='py-5'>
          <h1 className='text-end pr-5 text-xl'>이번달 일기 목록</h1>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;