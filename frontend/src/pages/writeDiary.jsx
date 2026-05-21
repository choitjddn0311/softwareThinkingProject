import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

// 오늘 날짜를 YYYY-MM-DD 형식으로
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const EMOTIONS = [
  { value: 'happy',   label: '행복함' },
  { value: 'sad',     label: '슬픔' },
  { value: 'blue',    label: '우울' },
  { value: 'angry',   label: '화남' },
  { value: 'annoyed', label: '짜증남' },
  { value: 'meh',     label: '그저그럼' },
];

const WritePage = () => {
  const navigate = useNavigate();

  const [date, setDate]       = useState(getTodayString());
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');

  const handleSubmit = async () => {
    if (!title.trim())   { alert('제목을 입력해주세요.'); return; }
    if (!content.trim()) { alert('내용을 입력해주세요.'); return; }
    if (!emotion)        { alert('감정을 선택해주세요.'); return; }

    try {
      const response = await fetch('/api/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, title, content, emotion }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || '저장에 실패했습니다.');
        return;
      }

      navigate('/');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <div className="w-full h-full flex items-start justify-center">
      <div className="w-[1200px]">

        {/* 헤더 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:cursor-pointer transition-colors"
            >
              <IoIosArrowBack />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
              일기 작성
            </h2>
          </div>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-gray-800 text-white text-sm font-medium tracking-wide hover:bg-gray-900 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            저장
          </button>
        </div>

        {/* 폼 영역 */}
        <div className="py-5 flex flex-col gap-5">

          {/* 날짜 */}
          <div className="flex flex-col gap-3">
            <label className="text-md font-medium tracking-widest uppercase text-gray-400">
              날짜
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-48 px-4 py-2 rounded-lg border border-gray-200 bg-white text-black text-md font-light focus:outline-none focus:border-gray-400 transition-colors cursor-pointer"
            />
          </div>

          {/* 감정 */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium tracking-widest uppercase text-gray-400">
              오늘의 감정
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setEmotion(value)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-light border cursor-pointer select-none
                    ${emotion === value
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-3">
            <label className="text-md font-medium tracking-widest uppercase text-gray-400">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="오늘의 제목을 입력하세요"
              maxLength={60}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-md font-light placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />
            <span className="text-xs text-gray-300 text-right">{title.length} / 60</span>
          </div>

          {/* 내용 */}
          <div className="flex flex-col gap-3">
            <label className="text-md font-medium tracking-widest uppercase text-gray-400">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 하루를 기록해보세요..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-md font-light leading-relaxed placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
            <span className="text-xs text-gray-300 text-right">{content.length}자</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;