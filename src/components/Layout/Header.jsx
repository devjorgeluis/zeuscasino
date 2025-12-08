import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterModal from "../Modal/FilterModal";
import ImgLogo from "/src/assets/svg/logo.svg";

const Header = ({
    isLogin,
    isMobile,
    link,
    onOpenProviders
}) => {
    const navigate = useNavigate();
    const [showFilterModal, setShowFilterModal] = useState(false);

    return (
        <>
            {showFilterModal && (
                <FilterModal
                    isLogin = {isLogin}
                    isMobile = {isMobile}
                    onClose={() => setShowFilterModal(false)}
                />
            )}
            <div className="header">
                <div className="header-container">
                    <div className="headerLeft">
                        <a aria-current="page" className="linkCss active" onClick={() => navigate("/")}>
                            <img alt="logo" className="logo light-logo" src={ImgLogo} width={100} />
                        </a>
                    </div>
                    <div className="headerRight">
                        <i className="material-icons" onClick={() => setShowFilterModal(true)}>search</i>
                        {
                            (link === "/casino" || link === "/live-casino") && <i className="material-icons" onClick={() => onOpenProviders && onOpenProviders()}>filter_alt</i>
                        }
                        <i className="material-icons" onClick={() => navigate("/profile")}>account_circle</i>
                    </div>
                </div>
                {
                    !isLogin && <div className="login-header-container">
                        <button className="login-btn" onClick={() => navigate("/login")}>Acceso</button>
                    </div>
                }
            </div>
        </>
    );
};

export default Header;
