import { useContext, useState } from "react";
import { callApi } from "../../utils/Utils";
import { AppContext } from "../../AppContext";
import AuthHeader from "../../components/Auth/AuthHeader";
import LoadApi from "../../components/Loading/LoadApi";
import ConfirmLogoutModal from "../../components/Modal/ConfirmLogoutModal";

const PersonalProfile = () => {
    const { contextData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        setIsLoading(true);

        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="personal-profile-container">
            {isLoading && <LoadApi isLoading={isLoading} />}
            <AuthHeader title="Perfil personal" link="/profile" />

            <div className="profile-section">Cuenta principal</div>
            <h2 className="profile-balance">{parseFloat(contextData.session.user.balance).toFixed(2) || ''} $</h2>

            <div className="profile-section">Cuenta</div>
            <div className="profile-card">
                <div className="profile-row">
                    <span className="profile-label">Número de cuenta</span>
                    <span className="profile-value">identificación: {contextData?.session?.user?.id || '-'}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Usario</span>
                    <span className="profile-value">{contextData?.session?.user?.username || '-'}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Correo electronico</span>
                    <span className="profile-value">{contextData?.session?.user?.email || '-'}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Número de teléfono</span>
                    <span className="profile-value">{contextData?.session?.user?.phone || '-'}</span>
                </div>
            </div>
            <button className="logout-btn" onClick={() => setShowConfirm(true)}>
                <span className="material-icons">logout</span> Cerrar sesión
            </button>

            <ConfirmLogoutModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => { setShowConfirm(false); handleLogout(); }}
            />
        </div>
    );
};

export default PersonalProfile;
