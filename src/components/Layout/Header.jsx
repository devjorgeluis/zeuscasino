import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Sidebar from "./Sidebar";
import ImgLogo from "/src/assets/img/logo.webp";

const Header = ({
    isLogin,
    isMobile,
    isSlotsOnly,
    userBalance,
    handleLoginClick,
    handleLogoutClick,
    handleMyProfileClick,
    handleMyProfileHistoryClick
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location?.pathname ?? "";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { contextData } = useContext(AppContext);
    const [showSidebar, setShowSidebar] = useState(false);

    const navItems = isSlotsOnly === "false" ? [
        { path: ["/", "/home"], label: "INICIO" },
        { path: ["/casino"], label: "CASINO" },
        { path: ["/live-casino"], label: "CASINO EN VIVO" },
        { path: ["/sports"], label: "DEPORTES" },
        { path: ["/live-sports"], label: "DEPORTES EN VIVO" }
    ] : [
        { path: ["/", "/home"], label: "INICIO" },
        { path: ["/casino"], label: "CASINO" }
    ];

    const isActive = (paths) => {
        if (Array.isArray(paths)) {
            return paths.some(p => p === "/" ? pathname === "/" : pathname.startsWith(p));
        }
        return pathname.startsWith(paths);
    };

    useEffect(() => {
        function handleDocClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }

        function handleKey(e) {
            if (e.key === "Escape") setDropdownOpen(false);
        }

        document.addEventListener("click", handleDocClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("click", handleDocClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);


    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <>
            {
                isMobile ?
                    <nav id="mainHeader" className="navbarCustom navbar-dark py-0">
                        <div
                            className="d-flex align-items-center justify-content-between p-1 py-1"
                            style={{
                                width: "100%",
                                backgroundColor: "rgb(4, 7, 19)",
                                fontFamily: '"Exo 2", sans-serif',
                                minHeight: "50px"
                            }}
                        >
                            <div style={{ width: "60%" }} onClick={() => navigate("/")}>
                                <img src={ImgLogo} width="40%" alt="Logo" className="mx-2" />
                            </div>

                            {
                                isLogin ? <>
                                    <div className="user-info mx-1">
                                        <div className="avatar px-2 py-1 pb-0">
                                            <i className="fa fa-user"></i>
                                        </div>
                                    </div>

                                    <div className="text-start" style={{ fontSize: "small" }}>
                                        <span style={{ color: "white" }}>{contextData?.session?.user?.username}</span>
                                        <br />
                                        <span style={{ color: "white" }}>{formatBalance(userBalance)}</span>
                                    </div>

                                </> : <div
                                    className="btn mx-2 py-1 px-1 btn-outline"
                                    style={{
                                        fontSize: "11px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        fontFamily: '"Exo 2", sans-serif'
                                    }}
                                    onClick={() => handleLoginClick()}
                                >
                                    <span>INGRESAR</span>
                                </div>
                            }

                            <div />

                            <div>
                                <span
                                    className="position-relative me-1"
                                    onClick={() => setShowSidebar(true)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span style={{ fontSize: "larger", color: "rgb(218, 65, 103)" }}>
                                        <i className="fas fa-bars"></i>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </nav> :
                    <nav
                        className="navbar my-0 navbar-expand-lg bg-body-tertiary"
                        style={{ backgroundColor: "rgb(4, 7, 19)", fontFamily: "'Exo 2', sans-serif" }}
                    >
                        <div className="container-fluid my-0">
                            <div className="float-left" style={{ cursor: "pointer" }}>
                                <img
                                    src={ImgLogo}
                                    width="90%"
                                    alt="Zeus Casino Logo"
                                    style={{ maxWidth: "170px", maxHeight: "45px" }}
                                    onClick={() => navigate("/home")}
                                />
                            </div>
                            <div
                                id="navbarText"
                                style={{ width: "80%", display: "flex", justifyContent: "center", alignItems: "center" }}
                            >
                                <div id="menu-header">
                                    <ul
                                        className="nav nav-tabs"
                                        style={{
                                            "--background": "rgba(255, 255, 255, 0.08)",
                                            "--color": "#da4167",
                                            "--border": "2px solid #da4167"
                                        }}
                                    >
                                        {navItems.map((item, idx) => (
                                            <li key={idx} role="presentation" className="nav-item">
                                                <button
                                                    type="button"
                                                    className={"nav-link text-center" + (isActive(item.path) ? " active" : "")}
                                                    style={{ textTransform: "uppercase" }}
                                                    onClick={() => navigate(Array.isArray(item.path) ? item.path[item.path.length - 1] : item.path)}
                                                >
                                                    <span>{item.label}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {
                                isLogin ? <div className="d-flex align-items-center">
                                    <div className="dropdown nav-item">
                                        <div>
                                            <div
                                                className="btn-support"
                                                style={{ background: "rgb(218, 65, 103) !important", color: "rgb(2, 15, 29)" }}
                                            >
                                                <i className="fas fa-comment fa-fw"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nav-item mx-1" style={{ cursor: "pointer", color: "rgb(204, 204, 204)" }}>
                                        <span className="pr-0 mx-1" style={{ fontWeight: 300, cursor: "pointer" }}>CRÉDITOS</span>
                                        <span style={{ fontWeight: 800 }}>{formatBalance(userBalance)}</span>
                                    </div>
                                    <div className="user-info mx-1">
                                        <div className="avatar px-1 py-1 pb-0">
                                            <i className="fa fa-user fa-2x fa-inverse"></i>
                                        </div>
                                    </div>
                                    <div className="dropdown mx-1" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setDropdownOpen((s) => !s)}
                                            aria-expanded={dropdownOpen}
                                            className="btn btn-dark dropdown-toggle btn-sm"
                                            style={{ borderRadius: "10px" }}
                                        >
                                            <span style={{ margin: "20px", fontWeight: 800 }}>{contextData?.session?.user?.username}</span>
                                        </button>
                                        <ul className={"dropdown-menu dropdown-menu-lg-end" + (dropdownOpen ? " show" : "")}>
                                            <li>
                                                <a
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#historial_ingresos"
                                                    href="#"
                                                    className="dropdown-item"
                                                    onClick={() => { setDropdownOpen(false); handleMyProfileClick(); }}
                                                >
                                                    <i className="fa fa-database"></i> Mis datos
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#myAccountZeus"
                                                    href="#"
                                                    className="dropdown-item"
                                                    onClick={() => { setDropdownOpen(false); handleMyProfileHistoryClick(); }}
                                                >
                                                    <i className="fa fa-history"></i> Historial de cuenta
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="dropdown-item" onClick={handleLogoutClick}>
                                                    <i className="fa fa-power-off"></i> Salir
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div> : <div
                                    className="btn btn-sm text-end"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "small",
                                        fontFamily: '"Exo 2", sans-serif',
                                        backgroundColor: "rgb(218, 65, 103)",
                                        color: "rgb(2, 15, 29)",
                                        borderColor: "rgb(218, 65, 103)",
                                        transition: "0.3s",
                                        float: "right",
                                    }}
                                    onClick={handleLoginClick}
                                >
                                    <span style={{ display: "table-cell", verticalAlign: "middle" }}>
                                        INGRESAR
                                    </span>
                                </div>
                            }
                        </div>
                    </nav>
            }

            <Sidebar
                isSlotsOnly={isSlotsOnly}
                isLogin={isLogin}
                show={showSidebar}
                onClose={() => setShowSidebar(false)}
                userBalance={userBalance}
                handleMyProfileHistoryClick={handleMyProfileHistoryClick}
                handleLogoutClick={handleLogoutClick}
            />
        </>
    );
};

export default Header;