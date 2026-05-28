// /*
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { IoIosArrowBack } from 'react-icons/io';

// const getTodayString = () => {
//   const today = new Date();
//   const yyyy = today.getFullYear();
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const dd = String(today.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// };

// const EMOTIONS = [
//   { value: 'happy',   label: '행복함' },
//   { value: 'sad',     label: '슬픔' },
//   { value: 'blue',    label: '우울' },
//   { value: 'angry',   label: '화남' },
//   { value: 'annoyed', label: '짜증남' },
//   { value: 'meh',     label: '그저그럼' },
// ];

// const WritePage = () => {
//   const navigate = useNavigate();

//   const [date, setDate]       = useState(getTodayString());
//   const [title, setTitle]     = useState('');
//   const [content, setContent] = useState('');
//   const [emotion, setEmotion] = useState('');

//   const handleSubmit = async () => {
//     if (!title.trim())   { alert('제목을 입력해주세요.'); return; }
//     if (!content.trim()) { alert('내용을 입력해주세요.'); return; }
//     if (!emotion)        { alert('감정을 선택해주세요.'); return; }

//     try {
//       const response = await fetch('/api/diaries', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ date, title, content, emotion }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(errorData.error || '저장에 실패했습니다.');
//         return;
//       }

//       navigate('/');
//     } catch (error) {
//       console.error('저장 중 오류 발생:', error);
//       alert('서버와의 연결에 실패했습니다.');
//     }
//   };

//   return (
//     <div className="w-full h-full flex items-start justify-center">
//       <div className="w-[780px]">

//         {/* 헤더 */}
//         <div className="flex items-center justify-between py-5 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="w-7 h-7 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-all hover:cursor-pointer"
//             >
//               <IoIosArrowBack size={14} />
//             </button>
//             <h2 className="text-sm font-medium text-gray-800 tracking-tight">
//               일기 작성
//             </h2>
//           </div>
//           <button
//             onClick={handleSubmit}
//             className="h-8 px-4 rounded-md bg-gray-800 text-white text-xs font-medium hover:bg-gray-700 active:scale-[0.98] transition-all cursor-pointer"
//           >
//             저장
//           </button>
//         </div>

//         {/* 폼 영역 */}
//         <div className="py-8 flex flex-col gap-8">

//           {/* 날짜 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-medium tracking-widest uppercase text-gray-300">
//               날짜
//             </label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-40 h-8 px-3 rounded-md border border-gray-200 bg-transparent text-gray-600 text-xs font-light focus:outline-none focus:border-gray-400 transition-colors cursor-pointer"
//             />
//           </div>

//           {/* 감정 */}
//           <div className="flex flex-col gap-3">
//             <label className="text-[11px] font-medium tracking-widest uppercase text-gray-300">
//               오늘의 감정
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {EMOTIONS.map(({ value, label }) => (
//                 <button
//                   key={value}
//                   onClick={() => setEmotion(value)}
//                   className={`
//                     h-8 px-4 rounded-md text-xs font-medium border cursor-pointer select-none transition-all
//                     ${emotion === value
//                       ? 'bg-gray-800 text-white border-gray-800'
//                       : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-700'
//                     }
//                   `}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* 제목 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-medium tracking-widest uppercase text-gray-300">
//               제목
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="오늘의 제목을 입력하세요"
//               maxLength={60}
//               className="w-full h-11 px-4 rounded-md border border-gray-200 bg-transparent text-gray-700 text-sm font-light placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
//             />
//             <span className="text-[11px] text-gray-300 text-right">{title.length} / 60</span>
//           </div>

//           {/* 내용 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-medium tracking-widest uppercase text-gray-300">
//               내용
//             </label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="오늘 하루를 기록해보세요..."
//               rows={14}
//               className="w-full px-4 py-3 rounded-md border border-gray-200 bg-transparent text-gray-600 text-sm font-light leading-relaxed placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none"
//             />
//             <span className="text-[11px] text-gray-300 text-right">{content.length}자</span>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default WritePage;
// */