import { Link,useLocation } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import Logo from "../assets/img/emotion-logo.svg"

const Header = () => {
    const location = useLocation();
    const isWritePage = location.pathname === '/write';
    
    return(
        <header className="w-full h-20 flex justify-center items-center">
            <div className="w-[1200px] h-full flex justify-between items-center">
                <h1>
                    <Link to='/'>
                        <img src={Logo} alt="ㅣㅣ" width={200} height={100} />
                    </Link>
                </h1>
                <button className="h-10 text-gray-200 font-bold hover:cursor-pointer hover:text-gray-900">
                    <Link to={isWritePage ? '/' : '/write'}>
                        {isWritePage ? '홈으로' : '일기 쓰기'}
                    </Link>
                </button>
            </div>
        </header>
    )
}

export default Header;