import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './component/header';
import RegisterPage from './pages/register';
import { AuthProvider, useAuth } from './context/AuthContext';
import DiaryBook from './pages/diary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/register" replace />;
};

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hideHeader = location.pathname === '/register';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <DiaryBook />
          </ProtectedRoute>
        } />
        <Route path='/register' element={
          loading ? null : user ? <Navigate to="/" replace /> : <RegisterPage />
        } />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>       {/* ← BrowserRouter 바깥으로 */}
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;