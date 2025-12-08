import { useContext, useState, useEffect } from "react";
import { NavigationContext } from "../Layout/NavigationContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);
    const { setShowFullDivLoading } = useContext(NavigationContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [notificationsWidth, setNotificationsWidth] = useState("100%");

    useEffect(() => {
        if (!errorMsg) return;

        setNotificationsWidth("100%");
        const startTimer = setTimeout(() => setNotificationsWidth("0%"), 50);
        const hideTimer = setTimeout(() => setErrorMsg(""), 5000);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(hideTimer);
        };
    }, [errorMsg]);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setShowFullDivLoading(true);

            let body = {
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
        }
    };

    const callbackSubmitLogin = (result) => {
        setShowFullDivLoading(false);
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
            setErrorMsg("Correo electrónico o contraseña no válidos");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="jquery-modal blocker current" style={{ opacity: 1 }}>
            <div id="auth" className="modal" style={{ opacity: 1, display: "inline-block" }}>
                <div className="modal_head">
                    <div>Ingresar</div>
                    <a href="#" rel="modal:close" onClick={() => onClose()}></a>
                </div>
                <div className="modal_content">
                    <form method="post" id="auth_form" onSubmit={handleSubmit}>
                        <div className="input-block">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                placeholder=""
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <span className="placeholder">Nombre de usuario</span>
                        </div>
                        <div className="input-block">
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder=""
                                autoComplete="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="placeholder">Contraseña</span>
                        </div>
                        {
                            errorMsg !== "" && (
                                <div className="notificationsMessage notifications_error" onClick={() => setErrorMsg("")}>
                                    <div className="notificationsText">{errorMsg}</div>
                                    <div className="notificationsIndicator">
                                        <div style={{ overflow: 'hidden', width: notificationsWidth, transition: 'width 5s linear' }}></div>
                                    </div>
                                </div>
                            )
                        }
                        <button type="submit">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;