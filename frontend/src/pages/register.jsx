import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const switchMode = (next) => {
    setMode(next);
    setForm({ username: '', email: '', password: '', confirm: '' });
    setError('');
    setSuccess('');
  };

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
    border border-gray-200 rounded-lg
    text-gray-800 placeholder-gray-400
    focus:outline-none focus:border-gray-500
    transition-colors duration-150
  `;

  return (
    <div className="w-full h-screen flex">

      {/* 좌측 — 브랜드 패널 */}
      <div className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 border-r border-gray-100 px-14 py-14 bg-gray-50">
        <div>
          <div className="w-7 h-7 rounded-full bg-gray-800 mb-10" />
          <h1 className="text-3xl font-semibold text-gray-800 leading-snug tracking-tight">
            나만의<br />일기장
          </h1>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            하루의 기억을 색으로<br />기록하는 공간
          </p>
        </div>

        {/* 미니 달력 미리보기 */}
        <div className="space-y-2">
          {[
            { date: '5월 26일', color: '#D1FAE5', title: '봄 산책' },
            { date: '5월 22일', color: '#FEF3C7', title: '카페 작업' },
            { date: '5월 18일', color: '#E0E7FF', title: '영화 관람' },
          ].map(({ date, color, title }) => (
            <div
              key={date}
              className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 border border-gray-100"
            >
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <div>
                <p className="text-xs text-gray-400">{date}</p>
                <p className="text-sm font-medium text-gray-700">{title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 — 폼 패널 */}
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
            {/* 사용자명 (회원가입만) */}
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

            {/* 이메일 */}
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

            {/* 비밀번호 */}
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

            {/* 비밀번호 확인 (회원가입만) */}
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

          {/* 에러 / 성공 메시지 */}
          {error && (
            <p className="mt-4 text-xs text-rose-500 text-center">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-xs text-emerald-500 text-center">{success}</p>
          )}

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              mt-6 w-full h-11 rounded-lg text-sm font-medium
              transition-all duration-150
              ${loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-[0.98]'
              }
            `}
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>

          {/* 하단 링크 */}
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