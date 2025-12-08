import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef(null);

    useEffect(() => {
        if (isOpen && usernameRef.current) usernameRef.current.focus();
    }, [isOpen]);

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const body = {
            username: username,
            password: password,
        };

        callApi(
            contextData,
            "POST",
            "/login/",
            callbackSubmitLogin,
            JSON.stringify(body)
        );
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setErrorMsg("Combinación de nombre de usuario y contraseña no válida.");
        }
    };


    if (!isOpen) return null;

    return (
        <div
            id="login"
            tabIndex={-1}
            aria-labelledby="loginLabel"
            data-bs-backdrop="true"
            className="modal fade show"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'block' }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-lg modal-dialog-centered">
                <div
                    className="modal-content exo-2"
                    style={{ borderRadius: '20px', backgroundColor: 'rgb(4, 7, 19)', fontFamily: '"Exo 2", sans-serif' }}
                >
                    <button
                        id="closeLogin1"
                        type="button"
                        aria-label="Close"
                        className="btn-close"
                        style={{ color: 'rgb(204, 204, 204)' }}
                        onClick={() => onClose()}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <h6 id="exampleModalLabel" className="modal-title title text-center m-1 mb-5 p-0">
                        Ingrese su usuario y contraseña para<br />
                        empezar a jugar.
                    </h6>
                    <div className="modal-body p-1">
                        <div className="text-center">
                            <form className="p-2 my-3" onSubmit={handleSubmit}>
                                <div className="w-100">
                                    <div className="pb-2 font-size-custom mb-2 my-1 d-flex justify-content-center w-100">
                                        <input
                                            id="username"
                                            type="text"
                                            placeholder="Usuario"
                                            autoComplete="username"
                                            className="form-control input-login mr-sm-2 my-sm-0"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            ref={usernameRef}
                                            required
                                        />
                                    </div>
                                    <div className="pb-2 font-size-custom mb-3 my-1 d-flex justify-content-center">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Contraseña"
                                            maxLength={64}
                                            autoComplete="current-password"
                                            className="form-control input-login mr-sm-2 my-sm-0"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="d-flex mb-3 align-content-center justify-content-center">
                                    <button
                                        id="submit_btn"
                                        type="submit"
                                        className="btn p-2 login-btn"
                                        style={{ color: 'black', width: '100%', backgroundColor: 'rgb(218, 65, 103)' }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
                                    </button>
                                </div>
                            </form>

                            {errorMsg && (
                                <div role="alert" className="alert alert-danger">
                                    {errorMsg}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;