import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import AuthHeader from "../../components/Auth/AuthHeader";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="container account-page-container">
            <AuthHeader title="Mi cuenta" link="/" />
            <div className="account-content-container">
                {!contextData?.session ? (
                    <>
                        <div className="account-unauth">
                            <div className="avatar-large"><i className="material-icons">account_circle</i></div>
                            <h2 className="unauth-title">No has iniciado sesión</h2>
                            <p className="unauth-sub">Inicia sesión para acceder a todas las funciones de la aplicación</p>
                            <button className="login-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
                        </div>

                        <h3 className="section-title">Extra</h3>
                        <div className="profile-actions">
                            <a href="/docs/FULL_DOC_RULES_EN_GB.pdf" target="_blank" rel="noopener noreferrer">
                                <i className="material-icons">flag</i>
                                Términos y condiciones
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="account-card">
                            <div className="account-card-left" onClick={() => navigate("/personal-profile")}>
                                <div className="account-title">Cuenta principal <span className="account-id">{contextData.session.user?.id}</span></div>
                                <div className="account-balance">{parseFloat(contextData.session.user.balance).toFixed(2) || '0'} $</div>
                                <div className="account-sub">Ir al perfil</div>
                            </div>
                            <div className="account-card-right">
                                <button className="mail-btn"><i className="material-icons">email</i></button>
                            </div>
                        </div>

                        <h3 className="section-title">Transacciones</h3>
                        <div className="profile-actions">
                            <a onClick={() => navigate('/profile/history')}>
                                <i className="material-icons">history</i>
                                Historial de transacciones
                            </a>
                        </div>

                        <h3 className="section-title">Extra</h3>
                        <div className="profile-actions">
                            <a href="/docs/FULL_DOC_RULES_EN_GB.pdf" target="_blank" rel="noopener noreferrer">
                                <i className="material-icons">flag</i>
                                Términos y condiciones
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;