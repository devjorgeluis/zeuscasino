import { useContext } from "react";
import { LayoutContext } from "./Layout/LayoutContext";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    isMobile
}) => {
    const { setShowMobileSearch } = useContext(LayoutContext);

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        search({ target: { value }, key: event.key, keyCode: event.keyCode });
    };

    const handleFocus = () => {
        if (isMobile) {
            setShowMobileSearch(true);
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
            <button>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    );
};

export default SearchInput;