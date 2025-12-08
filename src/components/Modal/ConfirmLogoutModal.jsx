const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="auth-error-modal-overlay">
            <div className="confirm-logout-modal">
                <h3 className="confirm-title">¿Quieres cerrar sesión?</h3>
                <p className="confirm-sub">Lamentamos que te vayas.</p>

                <button className="confirm-btn stay" onClick={onClose}>
                    Quédate aquí
                </button>

                <button className="confirm-btn exit" onClick={onConfirm}>
                    Salida
                </button>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;
