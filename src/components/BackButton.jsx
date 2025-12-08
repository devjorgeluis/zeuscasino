import { useNavigate } from "react-router-dom";

const BackButton = (props) => {
    const navigate = useNavigate();

    return <div className="back-button" onClick={() => navigate(props.link)}>
        <i className="material-icons">arrow_back</i>
    </div>
}

export default BackButton;