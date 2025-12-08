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
        <div className="auth-error-modal-overlay" onClick={onClose}>
            <div className="provider-modal" onClick={e => e.stopPropagation()}>

                {view === 'filter' && (
                    <>
                        <div className="provider-header">
                            <button className="back-btn" onClick={onClose}>
                                <span className="material-icons">close</span>
                            </button>
                            <div className="provider-title">Filtrar</div>
                        </div>

                        <div className="filter-content">
                            <div className="filter-section">
                                <div className="filter-section-title">Por categoría</div>
                                <div className="filter-tags">
                                    {tags.map((tag, idx) => (
                                        <button
                                            key={tag.code || idx}
                                            className={`filter-tag ${selectedCategoryIndex === idx ? 'active' : ''}`}
                                            onClick={() => handleCategoryClick(tag, idx)}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {
                                isCasino && <div className="filter-section">
                                    <div className="filter-section-title">Por proveedor</div>
                                    <button
                                        className="select-providers-btn"
                                        onClick={() => setView('providers')}
                                    >
                                        <span>Seleccionar proveedores</span>
                                        <div className="provider-arrow">
                                            <span className="material-icons">chevron_right</span>
                                        </div>
                                    </button>
                                </div>
                            }
                            
                        </div>
                    </>
                )}

                {view === 'providers' && (
                    <>
                        <div className="provider-header">
                            <button className="back-btn" onClick={handleBack}>
                                <span className="material-icons">arrow_back</span>
                            </button>
                            <div className="provider-title">Seleccionar proveedores</div>
                            <div className="provider-actions">
                                <button
                                    className="search-btn"
                                    onClick={() => setView('provider-search')}
                                >
                                    <span className="material-icons">search</span>
                                </button>
                            </div>
                        </div>

                        <div className="provider-grid">
                            {categories.map((p, idx) => (
                                <div
                                    key={p.id || idx}
                                    className="provider-item"
                                    onClick={() => {
                                        onSelectProvider && onSelectProvider(p);
                                    }}
                                >
                                    {p.imageDataSrc ? (
                                        <img src={p.imageDataSrc} alt={p.name} />
                                    ) : (
                                        <div className="provider-name">{p.name}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'provider-search' && (
                    <>
                        <div className="provider-search">
                            <button
                                className="back-btn"
                                onClick={handleBack}
                            >
                                <span className="material-icons">arrow_back</span>
                            </button>
                            <div className="search-container">
                                <i className="material-icons search-icon">search</i>
                                <input
                                    className="search-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="provider-grid">
                            {filteredProviders.map((p, idx) => (
                                <div
                                    key={p.id || idx}
                                    className="provider-item"
                                    onClick={() => {
                                        onSelectProvider && onSelectProvider(p);
                                    }}
                                >
                                    {p.imageDataSrc ? (
                                        <img src={p.imageDataSrc} alt={p.name} />
                                    ) : (
                                        <div className="provider-name">{p.name}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProviderModal;