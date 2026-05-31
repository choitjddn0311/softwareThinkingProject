import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/register');
    };

    return (
        <header className="w-full h-16 flex justify-center items-center bg-gray-100">
            <div className="w-[1200px] h-full flex justify-between items-center px-6">

                <Link to='/'>
                    <img src={Logo} alt="logo" width={40} height={40} />
                </Link>

                <div className="flex items-center gap-1">

                    {user ? (
                        <div className="flex items-center gap-1">
                            <span className="h-8 px-4 flex items-center text-xs font-medium text-gray-700">
                                {user.username}
                            </span>

                            <div className="w-px h-3.5 bg-gray-200 mx-1" />

                            <button
                                onClick={handleLogout}
                                className="h-8 px-4 flex items-center text-xs font-medium text-gray-400 rounded-md hover:text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <Link
                            to='/register'
                            className="h-8 px-4 flex items-center text-xs font-medium text-gray-400 rounded-md hover:text-gray-800 hover:bg-gray-100 transition-all"
                        >
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;