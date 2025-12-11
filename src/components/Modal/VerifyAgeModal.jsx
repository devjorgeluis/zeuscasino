const VerifyAgeModal = ({ isOpen, onConfirm }) => {

    if (!isOpen) return null;

    return (
        <>
            <div className="modal" style={{ display: isOpen ? "block" : "none" }}>
                <div className="modal_overlay">
                    <div className="modal_content-container">
                        <div className="age-verification-desktop">
                            <h2 className="age-verification-desktop_title">Verificación de Edad</h2>
                            <span className="age-verification-desktop_sub-title">¿Eres mayor de <span style={{ color: 'rgb(243, 221, 22)' }}>18+</span> años?</span>
                            <br />
                            <div className="age-verification-desktop_button-group">
                                <div className="age-verification-desktop_button-container">
                                    <button type="button" className="button-desktop button-desktop_color_default" onClick={() => onConfirm()}>Si</button>
                                </div>
                                <div className="age-verification-desktop_button-container">
                                    <a type="button" className="button-desktop button-desktop_color_purple-bordered" href="https://google.com">No</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyAgeModal;