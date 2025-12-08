import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import Footer from "../Layout/Footer";
import GameModal from "./GameModal";
import PlayConfirmModal from "./PlayConfirmModal";
import GameCard from "../GameCard"
import LoadApi from "../Loading/LoadApi";
import SearchInput from "../SearchInput";
import ImgNoResult from "/src/assets/img/no-image.png";


let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const FilterModal = ({ isLogin, isMobile, onClose }) => {
    const { contextData } = useContext(AppContext);
    const [showPlayConfirm, setShowPlayConfirm] = useState(false);
    const [selectedGameForPlay, setSelectedGameForPlay] = useState(null);
    const [games, setGames] = useState([]);
    const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
    const [gameUrl, setGameUrl] = useState("");
    const [txtSearch, setTxtSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const searchRef = useRef(null);
    const refGameModal = useRef();
    const navigate = useNavigate();

    const launchGame = (game, type, launcher) => {
        setShouldShowGameModal(true);
        selectedGameId = game.id != null ? game.id : selectedGameId;
        selectedGameType = type != null ? type : selectedGameType;
        selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
        selectedGameName = game?.name;
        selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
        callApi(contextData, "GET", "/get-game-url?game_id=" + game.id, callbackLaunchGame, null);
    };

    const callbackLaunchGame = (result) => {
        if (result.status == "0") {
            switch (selectedGameLauncher) {
                case "modal":
                case "tab":
                    setGameUrl(result.url);
                    break;
            }
        } else {
            setIsGameLoadingError(true);
        }
    };

    const closeGameModal = () => {
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            let keyword = e.target.value;
            do_search(keyword);
        } else {
            if (
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                e.keyCode == 8 ||
                e.keyCode == 46
            ) {
                do_search(keyword);
            }
        }

        if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        setIsSearch(true);
        clearTimeout(searchDelayTimer);

        if (keyword == "") {
            return;
        }

        setGames([]);

        let pageSize = 500;
        let searchDelayTimerTmp = setTimeout(function () {
            callApi(
                contextData,
                "GET",
                "/search-content?keyword=" + txtSearch + "&page_group_code=" + "default_pages_home" + "&length=" + pageSize,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(searchDelayTimerTmp);
    };

    const callbackSearch = (result) => {
        setIsSearch(false);
        if (result.status === 500 || result.status === 422) {

        } else {
            configureImageSrc(result, true);
            setGames(result.content);
            console.log(result.content);

        }
    };

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc = element.image_local
                ? contextData.cdnUrl + element.image_local
                : element.image_url;
        });
    };

    return (
        <div className="filter-modal">
            <div className="filter-header">
                <i className="material-icons back-filter-button" onClick={onClose}>
                    arrow_back
                </i>
                <SearchInput
                    txtSearch={txtSearch}
                    setTxtSearch={setTxtSearch}
                    searchRef={searchRef}
                    search={search}
                    onChange={(event) => {
                        setTxtSearch(event.target.value);
                    }}
                    onKeyUp={(event) => {
                        search(event);
                    }}
                    autoFocus
                />
            </div>

            {isSearch ? (
                <div className="load-container">
                    <LoadApi />
                </div>
            ) : (
                games.length > 0 ? (
                    <div className="games-grid">
                        {games.map((game) => (
                            <GameCard
                                key={game.id}
                                id={game.id}
                                provider={'Casino'}
                                title={game.name}
                                imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                onGameClick={(game) => {
                                    if (isLogin) {
                                        setSelectedGameForPlay(game);
                                        setShowPlayConfirm(true);
                                    } else {
                                        navigate("/login");
                                    }
                                }}
                            />
                        ))}
                    </div>
                ) : txtSearch !== "" && games.length === 0 && (
                    <div className="no-results">
                        <img src={ImgNoResult} alt="No results found" />
                        <div>No se encontraron resultados</div>
                    </div>
                )
            )}

            <Footer />

            {shouldShowGameModal && selectedGameId !== null && (
                <GameModal
                    gameUrl={gameUrl}
                    gameName={selectedGameName}
                    gameImg={selectedGameImg}
                    reload={launchGame}
                    launchInNewTab={() => launchGame(null, null, "tab")}
                    ref={refGameModal}
                    onClose={closeGameModal}
                    isMobile={isMobile}
                />
            )}

            <PlayConfirmModal
                isOpen={showPlayConfirm}
                onClose={() => setShowPlayConfirm(false)}
                onPlay={() => {
                    setShowPlayConfirm(false);
                    if (selectedGameForPlay) launchGame(selectedGameForPlay, "slot", "tab");
                }}
                gameName={selectedGameForPlay?.name}
                costText={selectedGameForPlay?.costText}
            />
        </div>
    );
};

export default FilterModal;
