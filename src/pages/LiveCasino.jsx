import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { callApi } from "../utils/Utils";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Slideshow from "../components/Home/Slideshow";
import GameSlideshow from "../components/Home/GameSlideshow";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import ProviderModal from "../components/Modal/ProviderModal";
import PlayConfirmModal from "../components/Modal/PlayConfirmModal";
import LoadApi from "../components/Loading/LoadApi";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const pageTitle = "Casino en Vivo";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const [showPlayConfirm, setShowPlayConfirm] = useState(false);
  const [selectedGameForPlay, setSelectedGameForPlay] = useState(null);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const originalCategoriesRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const { isSlotsOnly, isMobile } = useOutletContext();
  const hasFetchedContentRef = useRef(false);
  const prevHashRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedCategoryRef = useRef(null);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    hasFetchedContentRef.current = false;
    lastLoadedCategoryRef.current = null;
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      const homeCategory = {
        name: "Lobby",
        code: "home",
        id: 0,
        table_name: "apigames_categories"
      };
      const updatedCategories = [homeCategory, ...(result.data.categories || [])];
      setCategories(updatedCategories);
      if (!originalCategoriesRef.current || originalCategoriesRef.current.length === 0) {
        originalCategoriesRef.current = updatedCategories;
      }
      setSelectedProvider(null);
      setPageData(result.data);
      const firstFiveCategories = updatedCategories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      setActiveCategory(homeCategory);
      setSelectedCategoryIndex(0);
      setIsSingleCategoryView(true);
      setIsExplicitSingleCategoryView(false);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    if (!categoryId || !tableName) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
      return;
    }
    const pageSize = 8;
    const groupCode = pageGroupCode || pageData.page_group_code;
    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id ? "&provider=" + selectedProvider.id : "");

    callApi(contextData, "GET", apiUrl, (result) => callbackFetchContentForCategory(result, category, categoryIndex), null);
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });

      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;
    const hash = location.hash;
    if (hash && hash.startsWith('#')) {
      if (prevHashRef.current !== hash) {
        const categoryCode = hash.substring(1);
        if (categoryCode === "home") {
          setSelectedProvider(null);
          setActiveCategory(categories[0]);
          setSelectedCategoryIndex(0);
          setIsSingleCategoryView(false);
          setGames([]);
          setFirstFiveCategoriesGames([]);
          const firstFiveCategories = categories.slice(1, 6);
          if (firstFiveCategories.length > 0) {
            pendingCategoryFetchesRef.current = firstFiveCategories.length;
            setIsLoadingGames(true);
            firstFiveCategories.forEach((item, index) => {
              fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
            });
          } else {
            setIsLoadingGames(false);
          }
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = null; // Reset on hash navigation
          return;
        }
        const category = categories.find(cat => cat.code === categoryCode);
        if (category) {
          const categoryIndex = categories.indexOf(category);
          setSelectedProvider(null);
          setActiveCategory(category);
          setSelectedCategoryIndex(categoryIndex);
          setIsSingleCategoryView(true);
          fetchContent(category, category.id, category.table_name, categoryIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = category.code;
          return;
        }
      }
    }

    if (!hasFetchedContentRef.current) {
      const urlParams = new URLSearchParams(location.search);
      const providerName = urlParams.get('provider');
      const providerId = urlParams.get('providerId');

      if (providerName && providerId) {
        const provider = categories.find(cat => cat.id.toString() === providerId.toString());
        if (provider) {
          const providerIndex = categories.indexOf(provider);
          setSelectedProvider(provider);
          setActiveCategory(provider);
          setSelectedCategoryIndex(providerIndex);
          setIsSingleCategoryView(true);
          fetchContent(provider, provider.id, provider.table_name, providerIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = provider.code;
          return;
        }
      }

      setActiveCategory(categories[0] || {});
      setSelectedCategoryIndex(0);
      setIsSingleCategoryView(false);
      hasFetchedContentRef.current = true;
      lastLoadedCategoryRef.current = null;
    }
  }, [categories, location.search, location.hash]);

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    const isSameCategory = lastLoadedCategoryRef.current === category.code;
    const resetCurrentPage = !isSameCategory;
    if (category.code === "home") {
      setIsSingleCategoryView(true);
      setSelectedCategoryIndex(0);
      setActiveCategory(category);
      if (resetCurrentPage) {
        setGames([]);
      }
      fetchContent(category, category.id, category.table_name, categoryIndex, resetCurrentPage);
      if (isMobile) {
        setMobileShowMore(true);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = category.code;
      return;
    }
    if (isMobile) {
      setMobileShowMore(true);
    }
    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, resetCurrentPage);
    lastLoadedCategoryRef.current = category.code;
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    console.log(pageCurrent);
    if (!categoryId || !tableName) {
      if (category.code === "home") {
        const pageSize = 30;
        setIsLoadingGames(true);
        if (resetCurrentPage) {
          pageCurrent = 0;
          setGames([]);
        }
        const apiUrl =
          "/get-content?page_group_type=categories&page_group_code=" +
          pageData.page_group_code +
          "&page=" +
          pageCurrent +
          "&length=" +
          pageSize;
        callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
        return;
      }
      setIsLoadingGames(false);
      return;
    }
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
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

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setShowFilterModal(false);
  };

  const handleProviderSelect = (provider, index = 0) => {
    if (categories.length > 0 && provider) {
      if (provider.code === "home") {
        setSelectedProvider(null);
        setIsSingleCategoryView(false);
        setIsExplicitSingleCategoryView(false);
        setActiveCategory(provider);
        setSelectedCategoryIndex(0);
        setGames([]);
        setFirstFiveCategoriesGames([]);
        const firstFiveCategories = categories.slice(1, 6);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
          });
        } else {
          setIsLoadingGames(false);
        }
        navigate("/live-casino#home");
        lastLoadedCategoryRef.current = null;
      } else {
        setSelectedProvider(provider);
        setIsSingleCategoryView(true);
        setIsExplicitSingleCategoryView(true);
        const providerIndex = categories.findIndex(cat => cat.id === provider.id);
        setActiveCategory(provider);
        setSelectedCategoryIndex(providerIndex !== -1 ? providerIndex : index);
        fetchContent(provider, provider.id, provider.table_name, providerIndex !== -1 ? providerIndex : index, true);
        lastLoadedCategoryRef.current = provider.code;
        if (isMobile) {
          setMobileShowMore(true);
        }
      }
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setSelectedProvider(null);
      setIsSingleCategoryView(false);
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      setGames([]);
      setFirstFiveCategoriesGames([]);
      const firstFiveCategories = categories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = null;
    }
  };

  const handleBackButton = () => {
    if (selectedProvider) {
      handleProviderSelect(null);
    } else if (isExplicitSingleCategoryView || isSingleCategoryView) {
      setSelectedProvider(null);
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      setGames([]);
      setFirstFiveCategoriesGames([]);

      if (categories.length > 0) {
        const firstFiveCategories = categories.slice(0, 5);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, "default_pages_home");
          });
        }
      }
      navigate("/live-casino", { replace: true });
      window.location.hash = "";
    }
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
        <div className="casino">
          {!selectedProvider && !isExplicitSingleCategoryView && !isSingleCategoryView && !isLoadingGames && (
            <>
              <Header
                isLogin={isLogin}
                isMobile={isMobile}
                link="/live-casino"
                onOpenProviders={() => setShowFilterModal(true)}
              />
              <div className="page__row">
                <Slideshow />
              </div>
            </>
          )}

          {(selectedProvider || isExplicitSingleCategoryView || isSingleCategoryView) && (
            <div className="category-header">
              <button
                className="back-btn"
                onClick={handleBackButton}
              >
                <span className="material-icons">arrow_back</span>
              </button>
              <div className="category-title">
                {selectedProvider ? selectedProvider.name : activeCategory?.name || 'Casino en vivo'}
              </div>
            </div>
          )}

          <div className="main-content">
            {(selectedProvider || isExplicitSingleCategoryView) ? (
              <>
                <div className="games-grid">
                  {games.map((game) => (
                    <GameCard
                      key={game.id}
                      id={game.id}
                      provider={activeCategory?.name || 'Casino'}
                      title={game.name}
                      imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                      game={game}
                      mobileShowMore={mobileShowMore}
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
                {(isExplicitSingleCategoryView || selectedProvider) && hasMoreGames && games.length > 0 && (
                  <div className="text-center">
                    <a className="load-more" onClick={loadMoreGames}>
                      Mostrar todo
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                {isSingleCategoryView ? (
                  <>
                    <div className="games-grid">
                      {games.map((game) => (
                        <GameCard
                          key={game.id}
                          id={game.id}
                          provider={activeCategory?.name || 'Casino'}
                          title={game.name}
                          imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                          game={game}
                          mobileShowMore={mobileShowMore}
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
                    {
                      games.length > 0 && (
                        <div className="text-center">
                          <a className="load-more" onClick={loadMoreGames}>
                            Mostrar todo
                          </a>
                        </div>
                      )
                    }
                  </>
                ) : (
                  firstFiveCategoriesGames.map((entry, catIndex) => {
                    if (!entry || !entry.games) return null;
                    return (
                      <GameSlideshow
                        key={entry?.category?.id || catIndex}
                        games={entry.games.slice(0, 10)}
                        name={entry?.category?.name}
                        title={entry?.category?.name}
                        icon=""
                        slideshowKey={entry?.category?.id}
                        loadMoreContent={() => loadMoreContent(entry.category, catIndex)}
                        onGameClick={(game) => {
                          if (isLogin) {
                            setSelectedGameForPlay(game);
                            setShowPlayConfirm(true);
                          } else {
                            navigate("/login");
                          }
                        }}
                      />
                    )
                  }))}
              </>
            )}
          </div>
          <Footer isLogin={isLogin} isSlotsOnly={isSlotsOnly} />
          {isLoadingGames && <LoadApi />}
        </div>
      )}

      <ProviderModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onCategorySelect={(category) => {
          handleCategorySelect(category);
        }}
        onCategoryClick={(tag, _id, _table, index) => {
          setIsLoadingGames(true);
          if (window.location.hash !== `#${tag.code}`) {
            window.location.hash = `#${tag.code}`;
          } else {
            setSelectedCategoryIndex(index);
            setIsSingleCategoryView(false);
            setIsExplicitSingleCategoryView(false);
            getPage(tag.code);
          }
        }}
        onSelectProvider={(provider) => {
          handleProviderSelect(provider);
          setShowFilterModal(false);
        }}
        contextData={contextData}
        categories={categories}
        tags={categories}
        selectedCategoryIndex={selectedCategoryIndex}
      />

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
              <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o ponte en contacto con el equipo de soporte.</div>
              <a className="btn-primary" onClick={() => window.location.reload()}>Regresar a la página de inicio</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCasino;