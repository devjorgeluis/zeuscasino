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
        <div className="search-container">
            <i className="material-icons search-icon">search</i>
            <input
                ref={searchRef}
                className="search-input"
                placeholder="Buscar"
                value={txtSearch}
                onChange={handleChange}
                onKeyUp={search}
                onFocus={handleFocus}
            />
        </div>
    );
};

export default SearchInput;