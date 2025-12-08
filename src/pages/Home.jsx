import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Slideshow from "../components/Home/Slideshow";
import MenuContainer from "../components/Home/MenuContainer";
import GameSlideshow from "../components/Home/GameSlideshow";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameModal from "../components/Modal/GameModal";
import PlayConfirmModal from "../components/Modal/PlayConfirmModal";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const [showPlayConfirm, setShowPlayConfirm] = useState(false);
  const [selectedGameForPlay, setSelectedGameForPlay] = useState(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topCasino, setTopCasino] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const refGameModal = useRef();
  const { isSlotsOnly, isLogin, isMobile } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    getPage("home");
    getStatus();

    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      setTopGames(result.top_hot);
      setTopCasino(result.top_slot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const getPage = (page) => {
    setCategories([]);
    setGames([]);
    callApi(contextData, "GET", `/get-page?page=${page}`, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      setCategories(result.data.categories);
      setPageData(result.data);

      if (result.data.menu === "home") {
        setMainCategories(result.data.categories);
      }

      if (pageData.url && pageData.url !== null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type === "categories") {
          setSelectedCategoryIndex(-1);
        }
        if (result.data.page_group_type === "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
  };

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    let pageSize = 30;

    if (resetCurrentPage === true) {
      pageCurrent = 0;
      setGames([]);
    }

    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code;

    callApi(
      contextData,
      "GET",
      `/get-content?page_group_type=categories&page_group_code=${groupCode}&table_name=${tableName}&apigames_category_id=${categoryId}&page=${pageCurrent}&length=${pageSize}`,
      callbackFetchContent,
      null
    );
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      if (pageCurrent === 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local !== null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    selectedGameId = game.id !== null ? game.id : selectedGameId;
    selectedGameType = type !== null ? type : selectedGameType;
    selectedGameLauncher = launcher !== null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", `/get-game-url?game_id=${selectedGameId}`, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    if (result.status === "0") {
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

  return (
    <>
      {shouldShowGameModal && selectedGameId !== null ? (
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
      ) : (
        <>
          <Header isLogin={isLogin} isMobile={isMobile} link="/" />
          <div className="main-content">
            <div className="page__row">
              <Slideshow />
            </div>
            <MenuContainer />
            <div className="hot-games">
              {topGames.length > 0 && <HotGameSlideshow games={topGames} name="games" title="Juegos" icon="" link="/casino" onGameClick={(game) => {
                if (isLogin) {
                  setSelectedGameForPlay(game);
                  setShowPlayConfirm(true);
                } else {
                  navigate("/login");
                }
              }} />}
            </div>
            {topCasino.length > 0 && <GameSlideshow games={topCasino} name="casino" title="Tragamonedas" icon="cherry" link="/casino" onGameClick={(game) => {
              if (isLogin) {
                setSelectedGameForPlay(game);
                setShowPlayConfirm(true);
              } else {
                navigate("/login");
              }
            }} />}
            {topLiveCasino.length > 0 && <GameSlideshow games={topLiveCasino} name="liveCasino" title="Casino en Vivo" icon="spades" link="/live-casino" onGameClick={(game) => {
              if (isLogin) {
                setSelectedGameForPlay(game);
                setShowPlayConfirm(true);
              } else {
                navigate("/login");
              }
            }} />}
          </div>
          <Footer isLogin={isLogin} isSlotsOnly={isSlotsOnly} />
        </>
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

      {isGameLoadingError && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 error-loading-game">
              <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o contacta con el equipo de soporte.</div>
              <a className="btn-primary" onClick={() => window.location.reload()}>Regresar a la página de inicio</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;