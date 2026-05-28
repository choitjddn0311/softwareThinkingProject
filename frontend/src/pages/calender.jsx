// /*
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// const getFirstDay = (year, month) => new Date(year, month, 1).getDay();
// const getLastDate = (year, month) => new Date(year, month + 1, 0).getDate();
// const toDateString = (year, month, day) => {
//   const mm = String(month + 1).padStart(2, '0');
//   const dd = String(day).padStart(2, '0');
//   return `${year}-${mm}-${dd}`;
// };

// const WeekdayHeader = () => (
//   <>
//     {DAY_LABELS.map((day, i) => (
//       <div
//         key={day}
//         className={`
//           py-3 text-start pl-4 text-[11px] font-medium tracking-widest uppercase
//           ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-gray-300'}
//         `}
//       >
//         {day}
//       </div>
//     ))}
//   </>
// );

// const EmptyCells = ({ count }) => (
//   <>
//     {Array.from({ length: count }).map((_, i) => (
//       <div key={`empty-${i}`} className="border-b border-r border-gray-100" />
//     ))}
//   </>
// );

// const DayCell = ({ day, year, month, today, colorMap, titleMap, onClick }) => {
//   const dateStr = toDateString(year, month, day);
//   const diaryColor = colorMap[dateStr];
//   const diaryTitle = titleMap[dateStr];

//   const isToday =
//     today.getFullYear() === year &&
//     today.getMonth() === month &&
//     today.getDate() === day;

//   const dayOfWeek = (getFirstDay(year, month) + day - 1) % 7;
//   const isSunday = dayOfWeek === 0;
//   const isSaturday = dayOfWeek === 6;

//   return (
//     <div
//       onClick={() => onClick(dateStr)}
//       style={{
//         backgroundColor: diaryColor && !isToday ? diaryColor + '22' : undefined,
//       }}
//       className={`
//         group relative flex flex-col items-start justify-start pt-3 pl-4
//         w-full h-24 cursor-pointer select-none
//         border-b border-r border-gray-100
//         transition-all duration-150
//         hover:bg-gray-50
//         active:scale-[0.98]
//         ${isToday ? 'bg-gray-800' : ''}
//       `}
//     >
//       <span className={`
//         text-[13px] font-medium
//         ${isToday ? 'text-white' : ''}
//         ${!isToday && isSunday ? 'text-rose-400' : ''}
//         ${!isToday && isSaturday ? 'text-blue-400' : ''}
//         ${!isToday && !isSunday && !isSaturday ? 'text-gray-600' : ''}
//       `}>
//         {day}
//       </span>

//       {diaryTitle && (
//         <div className="mt-1.5 flex items-center gap-1.5 max-w-full pr-2">
//           <div
//             className="w-1.5 h-1.5 rounded-full flex-shrink-0"
//             style={{ backgroundColor: diaryColor || '#d1d5db' }}
//           />
//           <span className={`
//             text-[11px] truncate leading-none
//             ${isToday ? 'text-gray-300' : 'text-gray-400'}
//           `}>
//             {diaryTitle}
//           </span>
//         </div>
//       )}

//       {isToday && (
//         <span className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-gray-500" />
//       )}
//     </div>
//   );
// };

// // ── 메인 컴포넌트 ─────────────────────────────────────
// const CalendarPage = () => {
//   const navigate = useNavigate();
//   const [current, setCurrent] = useState(new Date());
//   const [colorMap, setColorMap] = useState({});
//   const [titleMap, setTitleMap] = useState({});
//   const [diaryList, setDiaryList] = useState([]);

//   const year = current.getFullYear();
//   const month = current.getMonth();
//   const today = new Date();

//   const firstDay = getFirstDay(year, month);
//   const lastDate = getLastDate(year, month);

//   useEffect(() => {
//     const fetchCalendarColors = async () => {
//       try {
//         const res = await fetch('/api/calendar');
//         const data = await res.json();

//         const colorM = {};
//         const titleM = {};
//         data.forEach(({ date, color, title }) => {
//           colorM[date] = color;
//           titleM[date] = title;
//         });
//         setColorMap(colorM);
//         setTitleMap(titleM);

//         const ym = `${year}-${String(month + 1).padStart(2, '0')}`;
//         const filtered = data
//           .filter(({ date }) => date.startsWith(ym))
//           .sort((a, b) => a.date.localeCompare(b.date));
//         setDiaryList(filtered);
//       } catch (err) {
//         console.error('달력 색상 데이터를 불러오지 못했습니다.', err);
//       }
//     };

//     fetchCalendarColors();
//   }, [year, month]);

//   // ✅ day 숫자 대신 dateStr을 직접 받도록 수정
//   const handleDateClick = async (dateStr) => {
//     try {
//       const res = await fetch(`/api/diaries/date/${dateStr}`);
//       const data = await res.json();
//       navigate(`/day/${dateStr}`, { state: { diary: data } });
//     } catch (err) {
//       console.error('일기 조회 실패:', err);
//       navigate(`/day/${dateStr}`, { state: { diary: false } });
//     }
//   };

//   const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
//   const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

//   return (
//     <div className="w-full h-full flex items-start justify-center">

//       {/* 달력 영역 */}
//       <div className="w-[900px] overflow-hidden">

//         {/* 헤더 */}
//         <div className="flex items-center justify-between py-5 border-b border-gray-100">
//           <h2 className="text-sm font-medium text-gray-800 tracking-tight">
//             {year}년 {month + 1}월
//           </h2>
//           <div className="flex gap-2 items-center">
//             <button
//               onClick={prevMonth}
//               className="w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-all"
//             >
//               <IoIosArrowBack size={14} />
//             </button>
//             <button
//               onClick={nextMonth}
//               className="w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-all"
//             >
//               <IoIosArrowForward size={14} />
//             </button>
//           </div>
//         </div>

//         {/* 그리드 */}
//         <div className="py-4">
//           <div className="grid grid-cols-7 border-t border-l border-gray-100">
//             <WeekdayHeader />
//             <EmptyCells count={firstDay} />
//             {Array.from({ length: lastDate }, (_, i) => i + 1).map((day) => (
//               <DayCell
//                 key={day}
//                 day={day}
//                 year={year}
//                 month={month}
//                 today={today}
//                 colorMap={colorMap}
//                 titleMap={titleMap}
//                 onClick={handleDateClick}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 사이드바 */}
//       <div className="w-[280px] h-full overflow-y-scroll border-l border-gray-100 flex-shrink-0">
//         <div className="py-5 px-6 border-b border-gray-100">
//           <h1 className="text-xs font-medium text-gray-400 tracking-widest uppercase">
//             이번달 일기
//           </h1>
//         </div>

//         <div className="flex flex-col gap-1 p-3">
//           {diaryList.length === 0 ? (
//             <p className="text-center text-gray-300 text-xs mt-8">일기가 없습니다</p>
//           ) : (
//             diaryList.map(({ date, title, color }) => (
//               <div
//                 key={date}
//                 onClick={() => handleDateClick(date)} // ✅ API 호출로 통일
//                 className="flex items-center gap-3 rounded-lg px-3 py-3 cursor-pointer hover:bg-gray-50 transition-all"
//               >
//                 <div
//                   className="w-1.5 h-8 rounded-full flex-shrink-0"
//                   style={{ backgroundColor: color }}
//                 />
//                 <div className="flex flex-col overflow-hidden gap-0.5">
//                   <span className="text-[11px] text-gray-300">{date}</span>
//                   <span className="text-xs font-medium text-gray-600 truncate">{title}</span>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default CalendarPage;
// */