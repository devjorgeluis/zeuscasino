import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import GameModal from "../components/Modal/GameModal";
import LoginModal from "../components/Modal/LoginModal";
import ProviderModal from "../components/Modal/ProviderModal";
import CategoryContainer from "../components/CategoryContainer";
import ProviderContainer from "../components/ProviderContainer";
import SearchInput from "../components/SearchInput";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

import ImgCategoryHome from "/src/assets/svg/lobby.svg";
import ImgCategoryPopular from "/src/assets/svg/new.svg";
import ImgCategoryBlackjack from "/src/assets/svg/jackpots.svg";
import ImgCategoryRoulette from "/src/assets/svg/roulette.svg";
import ImgCategoryCrash from "/src/assets/svg/crash.svg";
import ImgCategoryMegaways from "/src/assets/svg/megaways.svg";

const LiveCasino = () => {
  const pageTitle = "Live Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(true);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const { isSlotsOnly, isMobile } = useOutletContext();
  const lastLoadedTagRef = useRef("");
  const searchRef = useRef(null);

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsExplicitSingleCategoryView(false);
      getPage(hashCode);
    }
  }, [location.hash, tags]);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsExplicitSingleCategoryView(false);
    setIsSingleCategoryView(true);
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        { name: "Lobby", code: "home", image: ImgCategoryHome },
        { name: "Hot", code: "hot", image: ImgCategoryPopular },
        { name: "Jokers", code: "joker", image: ImgCategoryBlackjack },
        { name: "Ruletas", code: "roulette", image: ImgCategoryRoulette },
        { name: "Crash", code: "arcade", image: ImgCategoryCrash },
        { name: "Megaways", code: "megaways", image: ImgCategoryMegaways },
      ]
      : [
        { name: "Lobby", code: "home", image: ImgCategoryHome },
        { name: "Hot", code: "hot", image: ImgCategoryPopular },
        { name: "Jokers", code: "joker", image: ImgCategoryBlackjack },
        { name: "Megaways", code: "megaways", image: ImgCategoryMegaways },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

  const getPage = (page) => {
    setShowFullDivLoading(true);
    setGames([]);
    setSelectedProvider(null);
    setIsExplicitSingleCategoryView(false);
    setIsSingleCategoryView(true);
    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {
      setShowFullDivLoading(false);
    } else {
      setPageData(result.data);

      const hashCode = location.hash.replace('#', '');
      const tagIndex = tags.findIndex(t => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }

        // Get first category
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);

        // Fetch games for the first category
        if (firstCategory) {
          fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true, result.data.page_group_code);
        }
      } else if (result.data && result.data.page_group_type === "games") {
        setIsExplicitSingleCategoryView(false);
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        setHasMoreGames(result.data.categories && result.data.categories.length === 30);
        pageCurrent = 1;
        setShowFullDivLoading(false);
      }
    }
  };

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    if (isMobile) {
      setMobileShowMore(true);
    }
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, true);
    lastLoadedTagRef.current = category.code || "";
    window.scrollTo(0, 0);
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setShowFullDivLoading(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code;

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
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
      setHasMoreGames(false);
      setShowFullDivLoading(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      setHasMoreGames(result.content.length === 30);
      pageCurrent += 1;
      setShowFullDivLoading(false);
    }
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
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
    setTxtSearch("");
  };

  const handleProviderSelect = (provider, index = 0) => {
    if (provider) {
      setSelectedProvider(provider);
      setIsExplicitSingleCategoryView(true);
      setTxtSearch("");
      if (categories.length > 0 && provider) {
        setActiveCategory(provider);
        setSelectedCategoryIndex(index);
        fetchContent(provider, provider.id, provider.table_name, index, true, "default_pages_home");
        lastLoadedTagRef.current = provider.code;
        if (isMobile) {
          setMobileShowMore(true);
        }
      }
    } else {
      setSelectedProvider(null);
      setIsExplicitSingleCategoryView(false);
      setGames([]);

      if (categories.length > 0) {
        const firstCategory = categories[0];
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true, "default_pages_home");
      }
      navigate("/live-casino", { replace: true });
      lastLoadedTagRef.current = "";
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);

    if (e.key === "Enter" || e.keyCode === 13) {
      performSearch(keyword);
      searchRef.current?.blur();
    }

    if (e.key === "Escape" || e.keyCode === 27) {
      searchRef.current?.blur();
    }
  };

  const performSearch = (keyword) => {
    if (keyword.trim() === "") {
      return;
    }

    setGames([]);
    setIsSingleCategoryView(true);
    setShowFullDivLoading(true);

    let pageSize = 30;

    callApi(
      contextData,
      "GET",
      "/search-content?keyword=" + encodeURIComponent(keyword) +
      "&page_group_code=" + pageData.page_group_code +
      "&length=" + pageSize,
      callbackSearch,
      null
    );
  };

  const callbackSearch = (result) => {
    setShowFullDivLoading(false);
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
    }
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}
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
          <div className="casino-page-container">
            <CategoryContainer
              categories={tags}
              selectedCategoryIndex={selectedCategoryIndex}
              selectedProvider={selectedProvider}
              onCategoryClick={(tag, _id, _table, index) => {
                setTxtSearch("");

                if (window.location.hash !== `#${tag.code}`) {
                  window.location.hash = `#${tag.code}`;
                } else {
                  setSelectedCategoryIndex(index);
                  getPage(tag.code);
                }
              }}
              onCategorySelect={handleCategorySelect}
              isMobile={isMobile}
              pageType="casino"
            />
            <ProviderContainer
              categories={categories}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              onProviderSelect={handleProviderSelect}
              onOpenProviders={() => setShowFilterModal(true)}
            />
            <div className="casino-page">
              <div className="content">
                <div className="main">
                  {(selectedProvider || isExplicitSingleCategoryView || isSingleCategoryView) && (
                    <div className="games-category">
                      <h3>{txtSearch.trim() !== '' ? `BUSQUEDA: ${txtSearch.trim()}` : (selectedProvider ? selectedProvider.name : activeCategory?.name || 'Casino')}</h3>

                      <SearchInput
                        txtSearch={txtSearch}
                        setTxtSearch={setTxtSearch}
                        searchRef={searchRef}
                        search={search}
                        isMobile={isMobile}
                        onSearchClick={performSearch}
                      />
                    </div>
                  )}

                  <div className="single-games-grid">
                    <div className="games-grid">
                      {games.map((game) => (
                        <GameCard
                          key={game.id}
                          id={game.id}
                          provider={activeCategory?.name || "Casino"}
                          title={game.name}
                          imageSrc={
                            game.image_local !== null
                              ? contextData.cdnUrl + game.image_local
                              : game.image_url
                          }
                          game={game}
                          mobileShowMore={mobileShowMore}
                          onGameClick={(g) => {
                            if (isLogin) {
                              launchGame(g, "slot", "tab");
                            } else {
                              handleLoginClick();
                            }
                          }}
                        />
                      ))}
                    </div>

                    {(isExplicitSingleCategoryView || selectedProvider || isSingleCategoryView) &&
                      hasMoreGames &&
                      games.length > 0 && (
                        <div className="text-center">
                          <a className="load-more" onClick={loadMoreGames}>
                            Mostrar todo
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProviderModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onCategorySelect={(category) => {
          handleCategorySelect(category);
        }}
        onCategoryClick={(tag, _id, _table, index) => {
          setShowFullDivLoading(true);
          if (window.location.hash !== `#${tag.code}`) {
            window.location.hash = `#${tag.code}`;
          } else {
            setSelectedCategoryIndex(index);
            setIsExplicitSingleCategoryView(false);
            getPage(tag.code);
          }
        }}
        onSelectProvider={(provider) => {
          handleProviderSelect(provider);
          setShowFilterModal(false);
        }}
        contextData={contextData}
        tags={tags}
        categories={categories}
        selectedCategoryIndex={selectedCategoryIndex}
      />
    </>
  );
};

export default LiveCasino;