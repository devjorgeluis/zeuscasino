import { useContext } from "react";
import { LayoutContext } from "./Layout/LayoutContext";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    isMobile,
    onSearchClick  // Add this new prop
}) => {
    const { setShowMobileSearch } = useContext(LayoutContext);

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
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
            <button onClick={handleSearchClick}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
};

export default SearchInput;