import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import LoadApi from "../components/Loading/LoadApi";
import BackButton from "../components/BackButton";
import AuthErrorModal from "../components/Modal/AuthErrorModal";
import ImgLogo from "/src/assets/svg/logo.svg";

const Login = () => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showAuthError, setShowAuthError] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {
            username: "",
            password: ""
        };
        let isValid = true;

        if (!username.trim()) {
            newErrors.username = "Campo vacío";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Campo vacío";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (validateForm()) {
            setIsLoading(true);
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
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } else {
            setShowAuthError(true);
        }
    };

    useEffect(() => {
        const passwordInput = document.getElementById("password");
        if (passwordInput) {
            passwordInput.setAttribute("type", showPassword ? "text" : "password");
        }
    }, [showPassword]);

    return (
        <div className="login-container">
            <BackButton className="login-back-button" link="/" />
            {isLoading && <LoadApi isLoading={isLoading} />}
            
            <div className="login-form-container">
                <img src={ImgLogo} alt="1xSlot Logo" className="login-logo" />
                
                <form onSubmit={handleSubmit} className="login-form">
                    <h1 className="login-title">Acceso</h1>
                    
                    <div className={`form-group ${errors.username ? 'error' : ''} ${focusedField === 'username' || username ? 'has-value' : ''}`}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Nombre de usuario"
                            value={username}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) {
                                    setErrors({...errors, username: ""});
                                }
                            }}
                        />
                        <label className="input-label">
                            Nombre de usuario
                        </label>
                        {errors.username && (
                            <div className="error-message">
                                {errors.username}
                            </div>
                        )}
                    </div>
                    
                    <div className={`form-group ${errors.password ? 'error' : ''} ${focusedField === 'password' || password ? 'has-value' : ''}`}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            placeholder="Contraseña"
                            value={password}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors({...errors, password: ""});
                                }
                            }}
                        />
                        <label className="input-label">
                            Contraseña
                        </label>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <span className="material-icons">visibility_off</span> : <span className="material-icons">visibility</span>}
                        </button>
                        {errors.password && (
                            <div className="error-message">
                                {errors.password}
                            </div>
                        )}
                    </div>
                    
                    <button type="submit" className="login-button">
                        Acceso
                    </button>
                </form>
            </div>

            <AuthErrorModal
                isOpen={showAuthError}
                onClose={() => setShowAuthError(false)}
            />
        </div>
    );
};

export default Login;