import { useNavigate } from "react-router-dom";

const AuthHeader = (props) => {
    const navigate = useNavigate();

    return <div className="auth-header">
        <div className="back-button" onClick={() => navigate(-1)}>
            <i className="material-icons">arrow_back</i>
        </div>
        <div className="auth-title">{props.title}</div>
    </div>
}

export default AuthHeader;