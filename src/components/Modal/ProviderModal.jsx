import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const ProviderModal = ({
    isOpen,
    onClose,
    onCategorySelect,
    onCategoryClick,
    onSelectProvider,
    contextData,
    tags = [],
    categories = [],
    selectedCategoryIndex
}) => {
    const [query, setQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [view, setView] = useState('filter');
    const navigate = useNavigate();

    const location = useLocation();
    const isCasino = location.pathname === "/casino";

    useEffect(() => {
        if (!isOpen) {
            setView('filter');
            setQuery('');
            setShowSearch(false);
        }
    }, [isOpen]);

    const handleCategoryClick = (category, index) => {
        if (onCategoryClick) {
            onCategoryClick(category, category.id, category.table_name, index, true);
            navigate("#" + category.code)
        }
        if (onCategorySelect) {
            onCategorySelect(category, index);
        }
    };

    const handleBack = () => {
        if (view === 'provider-search') {
            setView('providers');
            setQuery('');
            setShowSearch(false);
        } else if (view === 'providers') {
            setView('filter');
            setShowSearch(false);
        } else {
            onClose();
        }
    };

    const filteredProviders = categories.filter(p =>
        p.name && p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-wrapper" onClick={onClose}>
            <div>
                <div className="modal-providers-container" onClick={e => e.stopPropagation()}>
                    {view === 'filter' && (
                        <>
                            <div className="modal-providers">
                                <div className="providers-list-container">
                                    <div className="casino-filters">
                                        <div className="close-button">
                                            <span onClick={onClose}>Cerrar</span>
                                        </div>
                                    </div>
                                    <ul className="list-exclusive">
                                        {categories.map((p, idx) => {
                                            const imageDataSrc = p.image_local != null
                                                ? contextData.cdnUrl + p.image_local
                                                : p.image_url;

                                            return (
                                                <li
                                                    key={p.id || idx}
                                                    onClick={() => {
                                                        // forward selection
                                                        onSelectProvider && onSelectProvider(p);
                                                    }}
                                                >
                                                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectProvider && onSelectProvider(p); }}>
                                                        <div className="provider">
                                                            <div className="provider-logo">
                                                                <img src={imageDataSrc} alt={p.name} />
                                                            </div>
                                                            <span className="provider-name">{p.name}</span>
                                                        </div>
                                                        <i className="fa-solid fa-fire-flame-curved"></i>
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderModal;