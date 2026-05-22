import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

const EMOTION_LABELS = {
  happy:   '행복함',
  sad:     '슬픔',
  blue:    '우울',
  angry:   '화남',
  annoyed: '짜증남',
  meh:     '그저그럼',
};

const ReadPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);

  const formattedDate = date ? date.replace(/-/g, '.') : '';

  useEffect(() => {
    if (!date) return;
    fetch(`/api/diaries/${date}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDiaries(data);
          setIsEmpty(false);
        } else {
          setDiaries([]);
          setIsEmpty(true);
        }
      })
      .catch(() => setIsEmpty(true))
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <div className="w-full h-full flex items-start justify-center">
      <div className="w-[1200px]">

        {/* 헤더 */}
        <div className="flex items-center py-3 border-b border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:cursor-pointer transition-colors"
          >
            <IoIosArrowBack />
          </button>
          <h2 className="ml-3 text-lg font-semibold text-gray-800 tracking-tight">
            {formattedDate}
          </h2>
        </div>

        {/* 본문 */}
        <div className="py-8">
          {loading ? (
            <p className="text-center text-gray-400 text-sm mt-20">불러오는 중...</p>
          ) : isEmpty ? (
            <p className="text-center text-gray-400 text-sm mt-20">
              이날({formattedDate})에는 작성한 일기가 없습니다
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {diaries.map(diary => (
                <div
                  key={diary.id}
                  className="rounded-xl border border-gray-100 overflow-hidden"
                >
                  <div className="h-1.5 w-full" style={{ backgroundColor: diary.color }} />
                  <div className="px-6 py-5 flex flex-col gap-3">
                    <span className="text-xs font-medium tracking-widest uppercase text-gray-400">
                      {EMOTION_LABELS[diary.emotion] ?? diary.emotion}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {diary.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {diary.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReadPage;
