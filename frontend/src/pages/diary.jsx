import { useState, useEffect, useCallback, forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { IoIosArrowBack, IoIosArrowForward, IoIosCalendar } from 'react-icons/io';
import diaryCoverImg from '../assets/img/diaryCover.jpeg';
import diaryBackCoverImg from '../assets/img/diaryBackCover.jpeg';
import { useAuth } from '../context/AuthContext';

// ── 유틸 ──────────────────────────────────────────────
const DAY_LABELS    = ['일', '월', '화', '수', '목', '금', '토'];
const WAKE_OPTIONS  = ['5시', '6시', '7시', '8시', '9시', '10시', '11시', '12시~'];
const SLEEP_OPTIONS = ['21시', '22시', '23시', '24시', '1시', '2시', '3시~'];
const EMOTIONS      = [
  { value: 'happy',     label: '행복함'  },
  { value: 'sad',       label: '슬픔'    },
  { value: 'angry',     label: '화남'    },
  { value: 'annoyed',   label: '짜증남'  },
  { value: 'lethargic', label: '무기력함' },
];
const COLS  = 10;
const ROWS  = 4;
const TOTAL = COLS * ROWS;

const getLastDate  = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay  = (y, m) => new Date(y, m, 1).getDay();
const getDayLabel  = (y, m, d) => DAY_LABELS[new Date(y, m, d).getDay()];
const pad          = (n) => String(n).padStart(2, '0');
const toDateStr    = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// ── 원고지 ──────────────────────────────────────────────
const ManuscriptArea = ({ value = '', onChange, readOnly }) => {
  const chars = value.split('');
  return (
    <div className="relative">
      <div className="grid border-t border-l border-gray-200"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: TOTAL }, (_, i) => (
          <div key={i}
            className="border-b border-r border-gray-200 flex items-center justify-center select-none"
            style={{ height: '26px', fontSize: '12px', color: '#374151' }}>
            {chars[i] || ''}
          </div>
        ))}
      </div>
      {!readOnly && (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value.slice(0, TOTAL))}
          maxLength={TOTAL}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
        />
      )}
    </div>
  );
};
// ── 표지 ──────────────────────────────────────────────
const CoverPage = forwardRef(({ username }, ref) => (
  <div
    ref={ref}
    data-density="hard"
    className="w-full h-full relative overflow-hidden select-none"
  >
    <img src={diaryCoverImg} alt="diary cover" className="w-full h-full object-cover" />
    {username && (
      <span
        className="absolute"
        style={{
          top: '23%',
          left: '45%',
          transform: 'translateX(-50%)',
          fontSize: '30px',
          color: '#ffd60a',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}
      >
        {username}
      </span>
    )}
  </div>
));
CoverPage.displayName = 'CoverPage';

// ── 뒷표지 ────────────────────────────────────────────
const BackCoverPage = forwardRef((_, ref) => (
  <div ref={ref} data-density="hard" className="w-full h-full relative overflow-hidden select-none">
    <img
      src={diaryBackCoverImg}
      alt="diary back cover"
      className="w-full h-full object-cover"
    />
  </div>
));
BackCoverPage.displayName = 'BackCoverPage';

// ── 빈 페이지 ──────────────────────────────────────────
const BlankPage = forwardRef((_, ref) => (
  <div ref={ref} className="w-full h-full bg-[#f7f6f3]" />
));
BlankPage.displayName = 'BlankPage';

// ── 달력 페이지 ───────────────────────────────────────
const CalendarPageComp = forwardRef(({ year, month, colorMap, titleMap, onDayClick }, ref) => {
  const firstDay = getFirstDay(year, month);
  const lastDate = getLastDate(year, month);
  const today    = new Date();

  return (
    <div
      ref={ref}
      className="w-full h-full flex flex-col bg-white overflow-hidden"
      style={{ boxShadow: 'inset -5px 0 10px -5px rgba(0,0,0,0.07)' }}
    >
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
        <p className="text-[8px] tracking-[0.35em] text-gray-300 uppercase mb-1">Calendar</p>
        <h2 className="text-base font-light text-gray-700">{year}년 {month + 1}월</h2>
      </div>

      <div className="flex-1 px-3 pt-2 pb-2 flex flex-col min-h-0">
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-[9px] font-medium py-1
                ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-gray-300'}`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-l border-gray-100 flex-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} className="border-b border-r border-gray-100" />
          ))}
          {Array.from({ length: lastDate }, (_, i) => i + 1).map((day) => {
            const dateStr  = toDateStr(year, month, day);
            const color    = colorMap[dateStr];
            const title    = titleMap[dateStr];
            const dow      = (firstDay + day - 1) % 7;
            const isToday  = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            return (
              <div
                key={day}
                onClick={() => onDayClick(day)}
                style={{ backgroundColor: color && !isToday ? `${color}20` : undefined }}
                className={`border-b border-r border-gray-100 cursor-pointer flex flex-col p-1 transition-colors hover:bg-gray-50 ${isToday ? 'bg-gray-800' : ''}`}
              >
                <span className={`text-[10px] font-medium
                  ${isToday ? 'text-white' : dow === 0 ? 'text-rose-400' : dow === 6 ? 'text-blue-400' : 'text-gray-600'}`}>
                  {day}
                </span>
                {title && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: color || '#d1d5db' }} />
                    <span className="text-[7px] truncate text-gray-400 leading-none">{title}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
CalendarPageComp.displayName = 'CalendarPageComp';

// ── 일기 페이지 (그림일기 형식) ───────────────────────
const DiaryPage = forwardRef(({ year, month, day, isLeft, onGoToCalendar }, ref) => {
  const [mode,         setMode]         = useState('read');
  const [loadState,    setLoadState]    = useState('loading');
  const [form,         setForm]         = useState({ title: '', content: '', wakeTime: '', sleepTime: '', emotion: '' });
  const [saveStatus,   setSaveStatus]   = useState('');
  const [imageUrl,     setImageUrl]     = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  const dateStr  = toDateStr(year, month, day);
  const dayLabel = getDayLabel(year, month, day);
  const isEdit   = mode === 'edit';

  // page-flip 라이브러리는 native mousedown을 .stf__block에 직접 등록하기 때문에
  // React synthetic stopPropagation으로는 막을 수 없음.
  // 편집 모드일 때 페이지 루트 div에 native 리스너를 붙여 버블링을 차단.
  const localRef = useRef(null);
  const mergedRef = useCallback((node) => {
    localRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  useEffect(() => {
    const el = localRef.current;
    if (!el || !isEdit) return;
    const block = (e) => e.stopPropagation();
    el.addEventListener('mousedown', block);
    el.addEventListener('touchstart', block, { passive: true });
    return () => {
      el.removeEventListener('mousedown', block);
      el.removeEventListener('touchstart', block);
    };
  }, [isEdit]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadState('loading');
      setMode('read');
      try {
        const r = await fetch(`/api/diaries/date/${dateStr}`);
        const d = await r.json();
        if (cancelled) return;
        if (d?.id) {
          setForm({ title: d.title || '', content: d.content || '', wakeTime: d.wakeTime || '', sleepTime: d.sleepTime || '', emotion: d.emotion || '' });
          setImageUrl(d.imageUrl || '');
          setLoadState('loaded');
        } else {
          setForm({ title: '', content: '', wakeTime: '', sleepTime: '', emotion: '' });
          setLoadState('empty');
        }
      } catch {
        if (!cancelled) setLoadState('empty');
      }
    })();
    return () => { cancelled = true; };
  }, [dateStr]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setSaveStatus('제목과 내용을 입력해주세요');
      setTimeout(() => setSaveStatus(''), 2000);
      return;
    }
    try {
      const res = await fetch(`/api/diaries/date/${dateStr}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title: form.title, content: form.content, emotion: form.emotion, wakeTime: form.wakeTime, sleepTime: form.sleepTime }),
      });
      const result = await res.json();
      if (res.ok) {
        setLoadState('loaded');
        setSaveStatus('저장됨');
        setTimeout(() => { setSaveStatus(''); setMode('read'); }, 700);

        // 이미지 자동 생성 (백엔드가 실제 생성 완료까지 기다린 후 URL 반환)
        setImageLoading(true);
        setImageUrl('');
        fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: form.content, emotion: form.emotion, title: form.title }),
        })
          .then(r => r.json())
          .then(imgData => {
            if (!imgData.image_url) { setImageLoading(false); return; }
            const url = imgData.image_url;
            // 백엔드가 이미지 생성 완료를 확인했으므로 바로 표시
            setImageUrl(url);
            setImageLoading(false);
            // DB에 URL 저장
            fetch(`/api/diaries/date/${dateStr}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: form.title, content: form.content, emotion: form.emotion, wakeTime: form.wakeTime, sleepTime: form.sleepTime, imageUrl: url }),
            });
          })
          .catch(() => setImageLoading(false));
      } else {
        setSaveStatus(result.error || '저장 실패');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch {
      setSaveStatus('연결 오류');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const spineStyle = isLeft
    ? { boxShadow: 'inset -6px 0 12px -6px rgba(0,0,0,0.09)' }
    : { boxShadow: 'inset  6px 0 12px -6px rgba(0,0,0,0.09)' };

  return (
    <div ref={mergedRef} style={spineStyle} className="w-full h-full flex flex-col bg-white overflow-hidden">

      {/* ① 날짜 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onGoToCalendar}
            className="flex items-center gap-1 text-[10px] px-2 py-1 text-gray-500 border border-gray-300 rounded hover:bg-gray-100 transition-all"
          >
            <IoIosCalendar size={13} />
            달력
          </button>
        </div>
        <div className="flex items-baseline gap-0.5 text-[11px]">
          <span className="font-medium text-gray-700">{year}</span>
          <span className="text-gray-300 text-[9px] mx-0.5">년</span>
          <span className="font-medium text-gray-700">{pad(month + 1)}</span>
          <span className="text-gray-300 text-[9px] mx-0.5">월</span>
          <span className="font-medium text-gray-700">{pad(day)}</span>
          <span className="text-gray-300 text-[9px] mx-0.5">일</span>
          <span className="font-medium text-gray-600 ml-1">{dayLabel}요일</span>
        </div>
        <div className="flex items-center gap-1.5">
          {loadState !== 'loading' && (
            <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full">
              {loadState === 'loaded' ? '수정' : '새 일기'}
            </span>
          )}
          {!isEdit ? (
            <button onClick={() => setMode('edit')}
              className="text-[10px] px-2.5 py-1 text-gray-400 border border-gray-200 rounded hover:text-gray-700 hover:border-gray-400 transition-all">
              편집
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {saveStatus && (
                <span className={`text-[9px] ${saveStatus === '저장됨' ? 'text-emerald-500' : 'text-rose-400'}`}>
                  {saveStatus}
                </span>
              )}
              <button onClick={() => setMode('read')}
                className="text-[10px] px-2 py-1 text-gray-400 hover:text-gray-600 rounded transition-all">
                취소
              </button>
              <button onClick={handleSave}
                className="text-[10px] px-2.5 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-all">
                저장
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ② 기상 / 취침 시간 — 읽기모드엔 선택값만, 편집모드엔 전체 버튼 */}
      <div className="grid grid-cols-2 border-b border-gray-200 flex-shrink-0">
        {[
          { label: '기상', key: 'wakeTime',  opts: WAKE_OPTIONS  },
          { label: '취침', key: 'sleepTime', opts: SLEEP_OPTIONS },
        ].map(({ label, key, opts }, i) => (
          <div key={key} className={`flex items-center gap-1.5 px-3 py-2 ${i === 0 ? 'border-r border-gray-200' : ''}`}>
            <span className="text-[9px] text-gray-400 flex-shrink-0">{label}:</span>
            {isEdit ? (
              <div className="flex flex-wrap gap-0.5">
                {opts.map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, [key]: t }))}
                    className={`text-[9px] px-1 py-0.5 rounded transition-all
                      ${form[key] === t ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-medium text-gray-600">
                {form[key] || <span className="text-gray-300">미선택</span>}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ③ 감정 — 읽기모드엔 선택값만, 편집모드엔 전체 버튼 */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <span className="text-[9px] text-gray-400 flex-shrink-0">감정:</span>
        {isEdit ? (
          <div className="flex gap-1 flex-wrap">
            {EMOTIONS.map(({ value, label }) => (
              <button key={value} onClick={() => setForm(p => ({ ...p, emotion: value }))}
                className={`text-[9px] px-2 py-0.5 rounded-full border transition-all
                  ${form.emotion === value
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-[10px] font-medium text-gray-600">
            {EMOTIONS.find(e => e.value === form.emotion)?.label || <span className="text-gray-300">미선택</span>}
          </span>
        )}
      </div>

      {/* ④ 그림 공간 */}
      <div className="flex-1 border-b border-gray-200 flex-shrink-0 h-80">
        <div className="w-full h-full border border-dashed border-gray-200 m-0 flex items-center justify-center relative overflow-hidden">
          {loadState === 'loading' ? (
            <p className="text-[10px] text-gray-300">불러오는 중...</p>
          ) : (
            <>
              {/* imageLoading=true 동안 loading 텍스트 표시 */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
                  <p className="text-[10px] text-gray-400 animate-pulse">✏️ 그림 그리는 중...</p>
                </div>
              )}
              {/* imageUrl 있으면 항상 img 렌더 (loading 중엔 invisible로 DOM에 존재 → onLoad 신호 가능) */}
              {imageUrl ? (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  style={imageLoading ? { opacity: 0, position: 'absolute' } : {}}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageUrl('');
                    setImageLoading(false);
                  }}
                />
              ) : !imageLoading ? (
                loadState === 'empty' && !isEdit ? (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] text-gray-300">아직 작성된 일기가 없어요</p>
                    <button onClick={() => setMode('edit')}
                      className="text-[10px] px-3 py-1.5 border border-gray-200 text-gray-400 rounded hover:border-gray-400 hover:text-gray-700 transition-all">
                      + 작성하기
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-200 select-none pointer-events-none">저장하면 그림이 생성돼요</p>
                )
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* ⑤ 제목 */}
      <div className="border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-500 flex-shrink-0">제 목 :</span>
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="오늘의 제목"
            readOnly={!isEdit}
            className={`flex-1 text-[11px] text-gray-700 bg-transparent focus:outline-none placeholder-gray-300 ${!isEdit ? 'cursor-default' : ''}`}
          />
        </div>
      </div>

      {/* ⑥ 원고지 */}
      <div className="flex-shrink-0 px-3 pt-2 pb-3">
        <ManuscriptArea
          value={form.content}
          onChange={v => setForm(p => ({ ...p, content: v }))}
          readOnly={!isEdit}
        />
      </div>

    </div>
  );
});
DiaryPage.displayName = 'DiaryPage';

// ── 메인 ──────────────────────────────────────────────
const DiaryBook = () => {
  const { user } = useAuth();
  const today = new Date();
  const [current,  setCurrent]  = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [colorMap, setColorMap] = useState({});
  const [titleMap, setTitleMap] = useState({});
  const [isReady,  setIsReady]  = useState(false);
  const bookRef = useRef(null);
  const bookContainerRef = useRef(null);

  const year     = current.getFullYear();
  const month    = current.getMonth();
  const lastDate = getLastDate(year, month);

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => {
        const cm = {}, tm = {};
        data.forEach(({ date, color, title }) => { cm[date] = color; tm[date] = title; });
        setColorMap(cm);
        setTitleMap(tm);
      })
      .catch(() => {});
  }, [year, month]);

  // 달력에서 날짜 클릭 → 해당 일기 페이지로 이동
  // 페이지 인덱스: 0=표지, 1=공백, 2=달력, 3=1일, 4=2일, ...
  const handleDayClick = (day) => {
    bookRef.current?.pageFlip().flip(day + 2);
  };

  const handleGoToCalendar = () => {
    bookRef.current?.pageFlip().turnToPage(2);
  };

  const changeMonth = (delta) => {
    setIsReady(false);
    setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  // onInit이 발화하지 않는 경우를 대비한 폴백: 1초 후 강제로 표시
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1000);
    return () => clearTimeout(t);
  }, [year, month]);

  // 책 아래쪽(하단 30%)에서만 페이지 넘김 허용
  useEffect(() => {
    const el = bookContainerRef.current;
    if (!el) return;
    const INTERACTIVE = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'];
    const block = (e) => {
      if (INTERACTIVE.includes(e.target.tagName)) return;
      const rect = el.getBoundingClientRect();
      if ((e.clientY - rect.top) / rect.height < 0.7) {
        e.stopPropagation();
      }
    };
    const EVENTS = ['mousedown', 'mousemove', 'pointermove', 'pointerdown'];
    EVENTS.forEach(ev => el.addEventListener(ev, block, true));
    return () => EVENTS.forEach(ev => el.removeEventListener(ev, block, true));
  }, [isReady]);

  // showCover=true 사용 시 총 페이지 수는 짝수여야 함
  // 구성: 1(표지) + 1(공백) + 1(달력) + lastDate + 1(뒷표지) = lastDate + 4
  const needsPad = (lastDate + 4) % 2 !== 0;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 bg-gray-100">

      {/* 월 표시 */}
      <div className="flex items-center mb-6">
        <span className="text-sm font-medium text-gray-500 w-24 text-center">
          {year}년 {month + 1}월
        </span>
      </div>

      {/* 초기화 중에는 표지 이미지를 오버레이로 덮어 빈 화면 방지 */}
      <div className="relative" ref={bookContainerRef}>
        {!isReady && (
          <div
            className="absolute inset-0 z-10 overflow-hidden shadow-2xl"
            style={{ width: 960, height: 660 }}
          >
            <img src={diaryCoverImg} alt="loading" className="w-full h-full object-cover" />
          </div>
        )}
        <HTMLFlipBook
          key={`${year}-${month}`}
          ref={bookRef}
          width={480}
          height={660}
          size="fixed"
          minWidth={300}
          maxWidth={600}
          minHeight={400}
          maxHeight={800}
          showCover={true}
          mobileScrollSupport={false}
          drawShadow={true}
          flippingTime={650}
          usePortrait={false}
          showPageCorners={false}
          className="shadow-2xl"
          onInit={() => setIsReady(true)}
        >
          <CoverPage username={user?.username} />
          <BlankPage />
          <CalendarPageComp
            year={year}
            month={month}
            colorMap={colorMap}
            titleMap={titleMap}
            onDayClick={handleDayClick}
          />
          {Array.from({ length: lastDate }, (_, i) => i + 1).map(day => (
            <DiaryPage
              key={toDateStr(year, month, day)}
              year={year}
              month={month}
              day={day}
              isLeft={day % 2 === 1}
              onGoToCalendar={handleGoToCalendar}
            />
          ))}
          {needsPad ? <BlankPage /> : null}
          <BackCoverPage />
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default DiaryBook;
