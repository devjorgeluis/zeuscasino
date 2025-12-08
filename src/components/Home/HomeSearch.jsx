import { useContext, useState, useRef } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../Loading/LoadApi";
import GameModal from "../Modal/GameModal";
import Icons from '/src/assets/svg/icons.svg';

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const HomeSearch = ({
    isMobile
}) => {
    const { contextData } = useContext(AppContext);
    const [games, setGames] = useState([]);
    const [gameUrl, setGameUrl] = useState("");
    const refGameModal = useRef();
    const [txtSearch, setTxtSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const searchRef = useRef(null);
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
    const [isGameLoadingError, setIsGameLoadingError] = useState(false);

    const launchGame = (game, type, launcher, isDemo = false) => {
        setShouldShowGameModal(true);
        selectedGameId = game?.id != null ? game.id : selectedGameId;
        selectedGameType = type != null ? type : selectedGameType;
        selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
        selectedGameName = game?.name;
        selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
        callApi(contextData, "GET", `/get-game-url?game_id=${game.id}&demo=${isDemo}`, callbackLaunchGame, null);
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

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            let imageDataSrc = element.image_url;
            if (element.image_local != null) {
                imageDataSrc = contextData.cdnUrl + element.image_local;
            }
            element.imageDataSrc = imageDataSrc;
        });
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
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

        if (keyword === "") {
            setGames([]);
            setIsSearch(false);
            return;
        }

        setGames([]);

        let pageSize = 20;
        let searchDelayTimerTmp = setTimeout(function () {
            callApi(
                contextData,
                "GET",
                `/search-content?keyword=${keyword}&page_group_code=default_pages_home&length=${pageSize}`,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(searchDelayTimerTmp);
    };

    const callbackSearch = (result) => {
        setIsSearch(false);
        if (result.status === 500 || result.status === 422) {
            // Handle error if needed
        } else {
            configureImageSrc(result);
            setGames(result.content);
        }
    };

    return (
        <>
            <div id="game_field_search_block" className="game-search">
                <div className="field">
                    <input
                        ref={searchRef}
                        className="field__input"
                        placeholder="Buscar juegos"
                        value={txtSearch}
                        onChange={(event) => {
                            setTxtSearch(event.target.value);
                        }}
                        onKeyUp={(event) => {
                            search(event);
                        }}
                        autoFocus
                    />
                    <svg className="field__ico">
                        <use xlinkHref={`${Icons}#search`}></use>
                    </svg>
                </div>
                <div className={`game-search__dropdown ${txtSearch !== "" && "has-text"}`}>
                    {isSearch ? (
                        <div className="pt-1">
                            <LoadApi />
                        </div>
                    ) : (
                        txtSearch !== "" && (
                            <div className="game-search__content scrollbar">
                                {games.length > 0 ? (
                                    games.map((item, index) => {
                                        let imageDataSrc =
                                            item.image_local != null ? contextData.cdnUrl + item.image_local : item.image_url;

                                        return (
                                            <div
                                                className="game-line__row"
                                                key={index}
                                                onClick={() => launchGame(item, "slot", "tab")}
                                            >
                                                <div className="slots-games__item-wrap">
                                                    <div className="slots-games__bg">
                                                        <div
                                                            className="slots-games__item"
                                                            style={{ backgroundImage: `url(${imageDataSrc})` }}
                                                        >
                                                            <div className="slots-games__overlay">
                                                                <div className="slots-games__name">{item.name}</div>
                                                                <div className="slots-games__buttons">
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="slots-games__fav"
                                                                    ></a>
                                                                    <div className="slots-games__play-wrap show">
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            className="slots-games__play"
                                                                        ></a>
                                                                    </div>
                                                                </div>
                                                                <div className="slots-games__playfree-wrap">
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="slots-games__playfree"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            launchGame(item, "slot", "tab", true);
                                                                        }}
                                                                    >
                                                                        Jugar gratis
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="slots-games__ribbons">
                                                                {item.type && (
                                                                    <div className="slots-games__ribbon slots-games__ribbon--orange">
                                                                        {item.type}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="game-line__text">{item.name}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="game-search__msg">No se encontraron resultados</p>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>

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

            {isGameLoadingError && (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 error-loading-game">
                            <div className="alert alert-warning">
                                Error al cargar el juego. Por favor, intenta de nuevo o contacta al equipo de soporte.
                            </div>
                            <a className="btn btn-primary" onClick={() => window.location.reload()}>
                                Volver a la página principal
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeSearch;