import { useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "../Modal/LoginModal";
import { NavigationContext } from "./NavigationContext";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                const parsed = parseFloat(contextData.session.user.balance);
                setUserBalance(Number.isFinite(parsed) ? parsed : 0);
            }

            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };
        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const refreshBalance = () => {
        setUserBalance(0);
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        const parsed = result && result.balance ? parseFloat(result.balance) : 0;
        setUserBalance(Number.isFinite(parsed) ? parsed : 0);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {

    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
        } else {
            setIsSlotsOnly("true");
        }

        if (result && result.user === null) {
            localStorage.removeItem("session");
        }
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLogoutClick = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    const handleLoginSuccess = (balance) => {
        const parsed = balance ? parseFloat(balance) : 0;
        setUserBalance(Number.isFinite(parsed) ? parsed : 0);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        handleLogoutClick,
        refreshBalance,
        isSidebarExpanded,
        toggleSidebar,
        showMobileSearch,
        setShowMobileSearch
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ selectedPage, setSelectedPage, getPage }}
            >
                <>
                    {showLoginModal && (
                        <LoginModal
                            isMobile={isMobile}
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                    <Header
                        isLogin={isLogin}
                        isMobile={isMobile}
                        isSlotsOnly={isSlotsOnly}
                        userBalance={userBalance}
                        handleLoginClick={handleLoginClick}
                        handleLogoutClick={handleLogoutClick}
                    />
                    {/* <Sidebar isSlotsOnly={isSlotsOnly} isMobile={isMobile} /> */}
                    <main className="main">
                        <Outlet context={{ isSlotsOnly, isLogin, isMobile }} />
                    </main>

                    <Footer isLogin={isLogin} isSlotsOnly={isSlotsOnly} />
                </>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;
