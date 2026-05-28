// /*
// import { useParams, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { IoIosArrowBack } from 'react-icons/io';

// const EMOTION_LABELS = {
//   happy:   '행복함',
//   sad:     '슬픔',
//   blue:    '우울',
//   angry:   '화남',
//   annoyed: '짜증남',
//   meh:     '그저그럼',
// };

// const ReadPage = () => {
//   const { date } = useParams();
//   const navigate = useNavigate();
//   const [diaries, setDiaries] = useState([]);
//   const [isEmpty, setIsEmpty] = useState(false);ㅌ3
//   const [loading, setLoading] = useState(true);

//   const formattedDate = date ? date.replace(/-/g, '.') : '';

//   useEffect(() => {
//     if (!date) return;
//     fetch(`/api/diaries/${date}`)
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           setDiaries(data);
//           setIsEmpty(false);
//         } else {
//           setDiaries([]);
//           setIsEmpty(true);
//         }
//       })
//       .catch(() => setIsEmpty(true))
//       .finally(() => setLoading(false));
//   }, [date]);

//   return (
//     <div className="w-full h-full flex items-start justify-center">
//       <div className="w-[780px]">

//         {/* 헤더 */}
//         <div className="flex items-center gap-3 py-5 border-b border-gray-100">
//           <button
//             onClick={() => navigate('/')}
//             className="w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-all hover:cursor-pointer"
//           >
//             <IoIosArrowBack size={14} />
//           </button>
//           <h2 className="text-sm font-medium text-gray-800 tracking-tight">
//             {formattedDate}
//           </h2>
//         </div>

//         {/* 본문 */}
//         <div className="py-10">
//           {loading ? (
//             <p className="text-center text-gray-300 text-xs mt-20">불러오는 중...</p>
//           ) : isEmpty ? (
//             <div className="flex flex-col items-center gap-3 mt-24">
//               <p className="text-gray-300 text-xs">{formattedDate}</p>
//               <p className="text-gray-400 text-sm">작성된 일기가 없습니다</p>
//               <button
//                 onClick={() => navigate('/write')}
//                 className="mt-4 h-8 px-4 text-xs font-medium text-gray-400 border border-gray-200 rounded-md hover:text-gray-800 hover:border-gray-400 transition-all"
//               >
//                 일기 쓰기
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
//               {diaries.map(diary => (
//                 <div
//                   key={diary.id}
//                   className="rounded-lg border border-gray-100 overflow-hidden"
//                 >
//                   {/* 컬러 바 */}
//                   <div className="h-px w-full" style={{ backgroundColor: diary.color }} />

//                   <div className="px-7 py-6 flex flex-col gap-4">
//                     {/* 감정 태그 */}
//                     <span className="text-[11px] font-medium tracking-widest uppercase text-gray-300">
//                       {EMOTION_LABELS[diary.emotion] ?? diary.emotion}
//                     </span>

//                     {/* 제목 */}
//                     <h3 className="text-lg font-medium text-gray-800 leading-snug">
//                       {diary.title}
//                     </h3>

//                     {/* 구분선 */}
//                     <div className="w-8 h-px bg-gray-100" />

//                     {/* 본문 */}
//                     <p className="text-gray-500 text-sm font-light leading-relaxed whitespace-pre-wrap">
//                       {diary.content}
//                     </p>
//                   </div>

//                   {/* 하단 컬러 도트 */}
//                   <div className="px-7 py-4 flex items-center gap-2 border-t border-gray-100">
//                     <div
//                       className="w-1.5 h-1.5 rounded-full"
//                       style={{ backgroundColor: diary.color }}
//                     />
//                     <span className="text-[11px] text-gray-300">{formattedDate}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ReadPage;
// */