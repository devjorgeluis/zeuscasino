import { useContext } from "react";
import { LayoutContext } from "./Layout/LayoutContext";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    isMobile,
    onSearchClick
}) => {
    const { setShowMobileSearch } = useContext(LayoutContext);

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        // forward the typed string to the parent's search handler (supports IME/mobile)
        if (typeof search === 'function') search(value);
    };

    const handleFocus = () => {
        if (isMobile) {
            setShowMobileSearch(true);
        }
    };

    const handleSearchClick = () => {
        if (onSearchClick) {
            onSearchClick(txtSearch);
        }
    };

    return (
        <>
            {isMobile ? (
                <div className="buscador">
                    <i className="fas fa-search fa-fw"></i>
                    <input
                        type="text"
                        placeholder="Busca tu juego favorito..."
                        className="ng-untouched ng-pristine ng-valid"
                        value={txtSearch}
                        onChange={handleChange}
                        onKeyUp={search}
                        onFocus={handleFocus}
                    />
                </div>
            ) : (
                <div className="input-group">
                    <input
                        ref={searchRef}
                        className="ng-pristine ng-valid ng-touched"
                        placeholder="Busca tu juego favorito..."
                        value={txtSearch}
                        onChange={handleChange}
                        onKeyUp={search}
                        onFocus={handleFocus}
                    />
                    <button onClick={() => { if (typeof onSearchClick === 'function') onSearchClick(txtSearch); else if (typeof search === 'function') search(txtSearch); }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            )}
        </>
    );
};

export default SearchInput;
