import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BsStars, BsCalendarHeart, BsCloudSun, BsBook } from 'react-icons/bs';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // 입력값 변경 시 에러/성공 메시지 초기화
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  // 로그인/회원가입 모드 전환 시 폼 초기화
  const switchMode = (next) => {
    setMode(next);
    setForm({ username: '', email: '', password: '', confirm: '' });
    setError('');
    setSuccess('');
  };

  // 로그인 또는 회원가입 요청 처리
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (mode === 'register') {
      if (!form.username || !form.email || !form.password || !form.confirm) {
        setError('모든 항목을 입력해주세요.');
        return;
      }
      if (form.password !== form.confirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (form.password.length < 8) {
        setError('비밀번호는 8자 이상이어야 합니다.');
        return;
      }
    } else {
      if (!form.email || !form.password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '오류가 발생했습니다.');
        return;
      }

      if (mode === 'login') {
        login(data.user);
        navigate('/');
      } else {
        setSuccess('회원가입이 완료되었습니다. 로그인해주세요.');
        switchMode('login');
      }
    } catch {
      setError('서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const inputClass = `
    w-full h-11 px-4 text-sm bg-transparent
    border border-gray-200 rounded-md
    text-gray-800 placeholder-gray-400
    focus:outline-none focus:border-gray-500
    transition-colors duration-150
  `;

  return (
    <div className="w-full h-screen flex">

      {/* 좌측 — 브랜드 + 핵심 기능 소개 패널 */}
      <div className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 border-r border-gray-100 px-14 py-14 bg-gray-50">
        <div>
          <div className="w-7 h-7 rounded-full bg-gray-800 mb-10" />
          <h1 className="text-3xl font-semibold text-gray-800 leading-snug tracking-tight">
            감정 그림일기
          </h1>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            오늘의 감정을 기록하면<br />AI가 그림으로 완성해드려요
          </p>
        </div>

        <div className="space-y-3">
          {[
            { icon: BsStars,         title: 'AI 그림 자동 생성', desc: '일기를 저장하면 내용을 바탕으로 AI가 그림일기 삽화를 자동으로 그려줘요' },
            { icon: BsCalendarHeart, title: '감정 달력',         desc: '매일 선택한 감정이 색으로 달력에 표시돼 한눈에 감정 흐름을 확인할 수 있어요' },
            { icon: BsCloudSun,      title: '날씨 자동 연동',    desc: '일기 작성 시 현재 위치의 날씨를 자동으로 불러와 기록해줘요' },
            { icon: BsBook,          title: '책 넘기기 UI',      desc: '실제 일기장처럼 페이지를 넘기며 날짜별 일기를 살펴볼 수 있어요' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 bg-white rounded-md px-4 py-3 border border-gray-200"
            >
              <Icon size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 — 로그인 / 회원가입 폼 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm">

          {/* 탭 전환 */}
          <div className="flex gap-6 mb-10 border-b border-gray-100 pb-4">
            <button
              onClick={() => switchMode('login')}
              className={`text-sm font-medium pb-1 transition-colors ${
                mode === 'login'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`text-sm font-medium pb-1 transition-colors ${
                mode === 'register'
                  ? 'text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              회원가입
            </button>
          </div>

          <div className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">사용자명</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="홍길동"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">이메일</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="hello@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">비밀번호</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="8자 이상"
                className={inputClass}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">비밀번호 확인</label>
                <input
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="비밀번호 재입력"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 text-xs text-rose-500 text-center">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-xs text-emerald-500 text-center">{success}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              mt-6 w-full h-11 rounded-md text-sm font-medium
              transition-all duration-150
              ${loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-[0.98]'
              }
            `}
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>

          <p className="mt-6 text-center text-xs text-gray-400">
            {mode === 'login' ? (
              <>계정이 없으신가요?{' '}
                <button onClick={() => switchMode('register')} className="text-gray-700 underline underline-offset-2 hover:text-gray-900">
                  회원가입
                </button>
              </>
            ) : (
              <>이미 계정이 있으신가요?{' '}
                <button onClick={() => switchMode('login')} className="text-gray-700 underline underline-offset-2 hover:text-gray-900">
                  로그인
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
