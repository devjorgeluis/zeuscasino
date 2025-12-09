import { useContext } from "react";
import { AppContext } from "../AppContext";
import { useLocation } from "react-router-dom";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect
}) => {
    const { contextData } = useContext(AppContext);
    const location = useLocation();
    const providers = categories.filter(cat => cat.code !== "home" && cat.code);

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };

    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (selectedProvider && selectedProvider.id === provider.id) ||
            (hashCode === provider.code);
    };

    return (
        <div className="brands-container">
            <div className="content">
                <div className="ver-todos">
                    <span>Ver todos</span>
                </div>                
                {providers.slice(0, 9).map((provider) => {
                    const selected = isSelected(provider);
                    const imageSrc = provider.image_local
                        ? contextData.cdnUrl + provider.image_local
                        : provider.image_url;

                    return (
                        <a
                            key={provider.id}
                            href="#"
                            className={`item${selected ? " active" : ""}`}
                            onClick={(e) => handleClick(e, provider)}
                        >
                            {imageSrc && (
                                <>
                                    <div className="image">
                                        <img
                                            src={imageSrc}
                                            alt={provider.name}
                                        />
                                    </div>
                                    <div className="provider-name">{provider.name}</div>
                                </>
                            )}
                            {!imageSrc && (
                                <span className="provider-name">{provider.name}</span>
                            )}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default ProviderContainer;