const PlayConfirmModal = ({ isOpen, onClose, onPlay, gameName, costText }) => {
    if (!isOpen) return null;

    return (
        <div className="auth-error-modal-overlay">
            <div className="play-confirm-modal">
                <div className="play-header">{gameName}</div>

                <button className="play-action" onClick={onPlay}>
                    <span className="play-icon">
                        <i className="material-icons">arrow_right</i>
                    </span>
                    <div className="play-text">Jugar</div>
                </button>

                <button className="play-action" onClick={onClose}>
                    <span className="play-cancel">
                        <i className="material-icons">close</i>
                    </span>
                    <div className="play-text">Cancelar</div>
                </button>
            </div>
        </div>
    );
};

export default PlayConfirmModal;
