import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";

// 요일
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜 가져오는 상수
const getFirstDay = (year, month) => new Date(year, month, 1).getDay();
const getLastDate = (year, month) => new Date(year, month + 1, 0).getDate();
const toDateString = (year, month, day) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

// 주말 평일 생 구분 컴포넌트
const WeekdayHeader = () => (
  <>
    {DAY_LABELS.map((day, i) => (
      <div
        key={day}
        className={`
          py-2 text-center text-xs font-semibold tracking-widest uppercase
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

const DayCell = ({ day, year, month, today, onClick }) => {
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
      className={`
        group relative flex items-center justify-center
        w-[100% / 7] h-24 cursor-pointer select-none
        text-md font-medium
        transition-all duration-150
        hover:bg-gray-100
        active:scale-98
        ${isToday ? 'bg-gray-700 text-white hover:bg-gray-900 font-bold' : ''}
        ${!isToday && isSunday ? 'text-rose-400' : ''}
        ${!isToday && isSaturday ? 'text-blue-400' : ''}
        ${!isToday && !isSunday && !isSaturday ? 'text-gray-700' : ''}
      `}
    >
      {day}
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

  const year = current.getFullYear();
  const month = current.getMonth();
  const today = new Date();

  const firstDay = getFirstDay(year, month);
  const lastDate = getLastDate(year, month);

  const handleDateClick = (day) => navigate(`/day/${toDateString(year, month, day)}`);
  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="w-full h-full flex items-start justify-center">
      <div className="w-[1200px] overflow-hidden">
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{year}년 {month + 1}월</h2>
          <div className='flex gap-5 items-center'>
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:cursor-pointer transition-colors"><IoIosArrowBack /></button>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:cursor-pointer transition-colors"><IoIosArrowForward /></button>
          </div>
        </div>
        {/* 달력 그리드 영역 */}
        <div className="py-4">
          <div className="grid grid-cols-7">
            {/* 요일 표시 */}
            <WeekdayHeader />

            {/* 비어있는 날 계산 */}
            <EmptyCells count={firstDay} />

            {Array.from({ length: lastDate }, (_, i) => i + 1).map((day) => (
              <DayCell
                key={day}
                day={day}
                year={year}
                month={month}
                today={today}
                onClick={handleDateClick}
              />
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default CalendarPage;