import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import ImgHome from "/src/assets/img/icon_home.png";
import ImgCasino from "/src/assets/img/icon_slots.png";
import ImgLiveCasino from "/src/assets/img/icon_roulette.png";
import ImgSports from "/src/assets/img/icon_deportes.png";

const Sidebar = ({
    isLogin,
    isSlotsOnly,
    show,
    onClose,
    userBalance,
    supportParent,
    handleLogoutClick,
    handleMyProfileHistoryClick,
    openSupportModal
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;
    const menuItems = !isSlotsOnlyMode
        ? [
            { id: "home", name: "Inicio", icon: ImgHome, href: "/" },
            { id: "casino", name: "Casino", icon: ImgCasino, href: "/casino" },
            { id: "live-casino", name: "Casino en vivo", icon: ImgLiveCasino, href: "/live-casino" },
            { id: "sports", name: "Deportes", icon: ImgSports, href: "/sports" },
        ]
        : [
            { id: "casino", name: "Casino", icon: ImgCasino, href: "/casino" }
        ];

    return (
        <>
            <div
                id="offcanvasExample2"
                className={"offcanvas offcanvas-end" + (show ? " show" : "")}
                style={{
                    width: "70%",
                    fontFamily: '"Exo 2", sans-serif',
                    color: "rgb(204, 204, 204)",
                    visibility: show ? "visible" : "hidden",
                    transform: show ? "translateX(0%)" : "translateX(100%)",
                    transition: "transform 0.3s ease"
                }}
            >
                <div
                    className="mx-0 text-end p-2"
                    style={{
                        background: "#242834",
                        color: "rgb(204, 204, 204)"
                    }}
                >
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </div>

                <div
                    className="offcanvas-body p-2"
                    style={{ position: "relative", background: "#242834" }}
                >
                    {
                        isLogin ? (
                            <>
                                <div className="d-flex" style={{ cursor: "pointer" }}>
                                    <div className="user-info mx-1">
                                        <div className="avatar px-2 py-1 pb-0">
                                            <i className="fa fa-user"></i>
                                        </div>
                                    </div>

                                    <div className="m-0 p-0 text-start" style={{ fontSize: "small" }}>
                                        <span style={{ color: "white" }}>
                                            {contextData?.session?.user?.username}
                                        </span>
                                        <br />
                                        <span style={{ color: "white" }}>
                                            {formatBalance(userBalance)}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center">
                                    <table className="table table-striped custom-table">
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: "center" }}>
                                                    <a
                                                        href="#"
                                                        className="dropdown-item"
                                                        style={{ color: "white" }}
                                                        onClick={handleMyProfileHistoryClick}
                                                    >
                                                        <i className="fa fa-history"></i> Historial
                                                    </a>
                                                </td>

                                                {supportParent && (
                                                    <td style={{ textAlign: "center" }}>
                                                        <a
                                                            href="#"
                                                            className="dropdown-item"
                                                            style={{ color: "white" }}
                                                            onClick={() => openSupportModal(true)}
                                                        >
                                                            <i className="fa fa-phone-flip"></i> Contactá a Tu Cajero
                                                        </a>
                                                    </td>
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            supportParent && (
                                <div className="d-flex align-items-center">
                                    <table className="table table-striped custom-table">
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: "center" }}>
                                                    <a
                                                        href="#"
                                                        className="dropdown-item"
                                                        style={{ color: "white" }}
                                                        onClick={() => openSupportModal(true)}
                                                    >
                                                        <i className="fa fa-phone-flip"></i> Contactá a Tu Cajero
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )
                    }


                    {menuItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${index % 2 === 0 ? "sidebarMenu strip" : "sidebarMenu"}`}
                            onClick={() => {
                                navigate(item.href);
                                if (typeof onClose === 'function') onClose();
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="d-flex">
                                <img
                                    src={item.icon}
                                    className="sidebarImg"
                                    alt={item.name}
                                />
                                <span
                                    style={{
                                        textTransform: "uppercase",
                                        color: "rgb(204, 204, 204)"
                                    }}
                                >
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    ))}

                    {
                        isLogin && <div style={{ position: "absolute", bottom: "10px" }}>
                            <a
                                href="#"
                                className="dropdown-item my-2"
                                style={{ color: "white" }}
                                onClick={handleLogoutClick}
                            >
                                <i className="fa fa-power-off fa-inverse"></i> Salir
                            </a>
                        </div>
                    }
                </div>
            </div>
            {show && <div className="backdrop modal-backdrop fade show" onClick={onClose} />}
        </>
    );
};

export default Sidebar;
