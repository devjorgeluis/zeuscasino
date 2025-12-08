import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo.webp";

const Header = ({
    isLogin,
    isMobile,
    link,
    userBalance
}) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    return (
        <>
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
                        />
                    </div>
                    <div
                        id="navbarText"
                        style={{ width: "80%", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <div>
                            <ul
                                id="menu-zeus"
                                className="nav nav-tabs"
                                style={{
                                    "--background": "rgba(255, 255, 255, 0.08)",
                                    "--color": "#da4167",
                                    "--border": "2px solid #da4167"
                                }}
                            >
                                <li role="presentation" className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link text-center active"
                                        style={{ textTransform: "uppercase" }}
                                        onClick={() => navigate("/home")}
                                    >
                                        <span>INICIO</span>
                                    </button>
                                </li>
                                <li role="presentation" className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link text-center"
                                        style={{ textTransform: "uppercase" }}
                                        onClick={() => navigate("/casino")}
                                    >
                                        <span>CASINO</span>
                                    </button>
                                </li>
                                <li role="presentation" className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link text-center"
                                        style={{ textTransform: "uppercase" }}
                                        onClick={() => navigate("/live-casino")}
                                    >
                                        <span>CASINO EN VIVO</span>
                                    </button>
                                </li>
                                <li role="presentation" className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link text-center"
                                        style={{ textTransform: "uppercase" }}
                                        onClick={() => navigate("/sports")}
                                    >
                                        <span>DEPORTES</span>
                                    </button>
                                </li>
                                <li role="presentation" className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link text-center"
                                        style={{ textTransform: "uppercase" }}
                                        onClick={() => navigate("/live-sports")}
                                    >
                                        <span>DEPORTES EN VIVO</span>
                                    </button>
                                </li>
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
                                <span style={{ fontWeight: 800 }}>{parseFloat(userBalance).toFixed(2)}</span>
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
                                    <span style={{ margin: "20px", fontWeight: 800 }}>prueba123</span>
                                </button>
                                <ul className={"dropdown-menu dropdown-menu-lg-end" + (dropdownOpen ? " show" : "")}>
                                    <li>
                                        <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#historial_ingresos"
                                            href="#"
                                            className="dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <i className="fa fa-database"></i> Mis datos
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            id="changePasswordBtn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#changePasswordJm"
                                            href="#"
                                            className="dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <i className="fa fa-key"></i> Cambiar contraseña
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#myAccountZeus"
                                            href="#"
                                            className="dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <i className="fa fa-history"></i> Historial de cuenta
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa fa-book"></i> Reglamento deportivo
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
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
                        >
                            <span style={{ display: "table-cell", verticalAlign: "middle" }}>
                                INGRESAR
                            </span>
                        </div>
                    }
                </div>
            </nav>
        </>
    );
};

export default Header;