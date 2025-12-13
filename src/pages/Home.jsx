import { useContext, useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Slideshow from "../components/Home/Slideshow";
import GameSlideshow from "../components/Home/GameSlideshow";
import CategoryContainer from "../components/CategoryContainer";
import ProviderContainer from "../components/ProviderContainer";
import BannerContainer from "../components/Home/BannerContainer";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameModal from "../components/Modal/GameModal";
import LoginModal from "../components/Modal/LoginModal";
import ProviderModal from "../components/Modal/ProviderModal";
import SearchInput from "../components/SearchInput";
import GameCard from "../components/GameCard";
import LoadApi from "../components/Loading/LoadApi";

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
import Img777 from "/src/assets/svg/777.svg";

const Home = () => {
  const { contextData } = useContext(AppContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topArcade, setTopArcade] = useState([]);
  const [topCasino, setTopCasino] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [tags, setTags] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const refGameModal = useRef();
  const pendingPageRef = useRef(new Set());
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedTagRef = useRef("");
  const lastProcessedPageRef = useRef({ page: null, ts: 0 });
  const { isSlotsOnly, isLogin, isMobile } = useOutletContext();
  const searchRef = useRef(null);

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      getPage(hashCode);
    }
  }, [location.hash]);

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

    getPage("home");
    getStatus();

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

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      setTopGames(result.top_hot);
      setTopArcade(result.top_arcade);
      setTopCasino(result.top_slot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const getPage = (page) => {
    if (pendingPageRef.current.has(page)) return;
    pendingPageRef.current.add(page);

    setIsLoadingGames(true);
    setShowFullDivLoading(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);

    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    pendingPageRef.current.delete(page);

    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
      return;
    }

    const now = Date.now();
    if (lastProcessedPageRef.current.page === page && now - lastProcessedPageRef.current.ts < 3000) {
      return;
    }
    lastProcessedPageRef.current = { page, ts: now };

    setCategoryType(result.data?.page_group_type);
    setSelectedProvider(null);
    setPageData(result.data);

    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);
    setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

    if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
      setCategories(result.data.categories);
      if (page === "home") {
        setMainCategories(result.data.categories);
      }
      const firstCategory = result.data.categories[0];
      setActiveCategory(firstCategory);

      const firstFiveCategories = result.data.categories.slice(0, 5);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        setShowFullDivLoading(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      }
      // If the requested page is a tag (e.g. 'arcade') and the server returned categories,
      // find the matching category and open it directly in single-category view.
      if (page && (page === "arcade" || (tags[tagIndex] && tags[tagIndex].code === "arcade"))) {
        const matchIndex = result.data.categories.findIndex((c) => c.table_name === "arcade" || (c.name && c.name.toLowerCase().includes("arcade")) || (c.name && c.name.toLowerCase().includes("crash")));
        const categoryToShow = matchIndex !== -1 ? result.data.categories[matchIndex] : result.data.categories[0];
        if (categoryToShow) {
          setIsSingleCategoryView(true);
          setIsExplicitSingleCategoryView(false);
          setActiveCategory(categoryToShow);
          setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);
          fetchContent(categoryToShow, categoryToShow.id, categoryToShow.table_name, 0, true, result.data.page_group_code);
        }
      }
      
    } else if (result.data && result.data.page_group_type === "games") {
      setIsSingleCategoryView(true);
      setIsExplicitSingleCategoryView(false);
      setCategories(mainCategories.length > 0 ? mainCategories : []);
      configureImageSrc(result);
      setGames(result.data.categories || []);
      setActiveCategory(tags[tagIndex] || { name: page });
      setHasMoreGames(result.data.categories && result.data.categories.length === 30);
      pageCurrent = 1;
      setShowFullDivLoading(false);
    }

    setIsLoadingGames(false);
    setShowFullDivLoading(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setShowFilterModal(false);
    setIsLoadingGames(false);
    setTxtSearch("");
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    const pageSize = 12;
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

    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url,
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
    }

    pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
    if (pendingCategoryFetchesRef.current === 0) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
    }
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    setIsLoadingGames(true);
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    if (isMobile) {
      setMobileShowMore(true);
    }
    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, true);
    lastLoadedTagRef.current = category.code || "";
    window.scrollTo(0, 0);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = categoryType === "categories" ? pageGroupCode || pageData.page_group_code : "default_pages_home"

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
    }
    setShowFullDivLoading(false);
    setIsLoadingGames(false);
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
    // Only show modal when explicitly using modal launcher
    if (launcher === "modal") {
      setShouldShowGameModal(true);
    } else {
      setShouldShowGameModal(false);
    }
    setShowFullDivLoading(true);
    selectedGameId = game?.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name || selectedGameName;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : selectedGameImg;
    callApi(contextData, "GET", `/get-game-url?game_id=${selectedGameId}`, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status === "0") {
      // On mobile, always navigate to the game URL (replace current SPA)
      if (isMobile) {
        try {
          window.location.href = result.url;
        } catch (err) {
          // fallback to opening in new tab
          try { window.open(result.url, "_blank", "noopener,noreferrer"); } catch (err) {}
        }
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);
        return;
      }

      if (selectedGameLauncher === "tab") {
        // Open in a new tab for 'tab' launches (keeps the SPA intact)
        try {
          window.open(result.url, "_blank", "noopener,noreferrer");
        } catch (err) {
          // fallback to navigation if window.open fails
          window.location.href = result.url;
        }
        // Cleanup game selection since we are not showing modal
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);
      } else {
        // show modal
        setGameUrl(result.url);
        setShouldShowGameModal(true);
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

    // Defensive cleanup: ensure game view container is hidden and iframe reset
    try {
      const el = document.getElementsByClassName("game-view-container")[0];
      if (el) {
        el.classList.add("d-none");
        el.classList.remove("fullscreen");
        el.classList.remove("with-background");
      }
      const iframeWrapper = document.getElementById("game-window-iframe");
      if (iframeWrapper) iframeWrapper.classList.add("d-none");
    } catch (err) {
      // ignore DOM errors
    }
    // Refresh home page data as defensive measure in production environments
    try { getPage('home'); } catch (e) {}
  }; 

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");
    setIsExplicitSingleCategoryView(true);

    if (provider) {
      setActiveCategory(null);
      setSelectedCategoryIndex(-1);

      fetchContent(
        provider,
        provider.id,
        provider.table_name,
        index,
        true
      );

      if (isMobile) {
        setMobileShowMore(true);
      }
    } else {
      const firstCategory = categories[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
      }
    }
  };

  const search = (e) => {
    const keyword = typeof e === 'string' ? e : (e?.target?.value ?? '');
    setTxtSearch(keyword);

    if (typeof e === 'string') {
      performSearch(keyword);
      return;
    }

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
    setIsSingleCategoryView(false);
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
        <>
          <div className="home-page-container">
            <div className="home-page">
              <div className="content">
                <div className="main">
                  <Slideshow />

                  <div className="brands-container-responsive">
                    <div className="content-responsive">
                      <SearchInput
                        txtSearch={txtSearch}
                        setTxtSearch={setTxtSearch}
                        searchRef={searchRef}
                        search={search}
                        isMobile={isMobile}
                      />

                      <div className="boton-brands">
                        <div className="boton-brands">
                          <button onClick={() => setShowFilterModal(true)}>
                            <img src={Img777} alt="Proveedores" />
                            {" "}Proveedores
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CategoryContainer
                    categories={tags}
                    selectedCategoryIndex={selectedCategoryIndex}
                    selectedProvider={selectedProvider}
                    onCategoryClick={(tag, _id, _table, index) => {
                        setTxtSearch("");
                        setShowFullDivLoading(true);
                        setIsExplicitSingleCategoryView(false);
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

                  <div className="games-container">
                    <div className="home-section-container">
                      {
                        (txtSearch !== "" || selectedProvider || isSingleCategoryView) ? (
                          <div className="games-no-live-page">
                            <div className="content">
                              <div className="search-text-desktop">
                                <div className="games-category">
                                  <h3 className="title">
                                    <span className="name-name">{txtSearch.trim() !== "" ? "BUSQUEDA: " + txtSearch.trim() : selectedProvider?.name ? selectedProvider.name : activeCategory?.name}</span>
                                  </h3>

                                  {
                                    !isMobile && <SearchInput
                                      txtSearch={txtSearch}
                                      setTxtSearch={setTxtSearch}
                                      searchRef={searchRef}
                                      search={search}
                                      isMobile={isMobile}
                                    />
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="single-games-grid">
                              <div className="games-grid">
                                {games.map((game, idx) => (
                                  <GameCard
                                    key={`list-${activeCategory?.id || 'search'}-${game.id}-${idx}`}
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
                              {isLoadingGames && <LoadApi />}

                              {
                                games.length > 0 && (
                                  <div className="text-center">
                                    <a className="load-more" onClick={loadMoreGames}>
                                      Mostrar todo
                                    </a>
                                  </div>
                                )}
                            </div>
                          </div>
                        ) :
                          <div className="games-no-live-page">
                            {isSingleCategoryView ? (
                              <div className="single-games-grid">
                                <div className="games-grid">
                                  {games.map((game, idx) => (
                                    <GameCard
                                      key={`cat-${selectedCategoryIndex}-${game.id}-${idx}`}
                                      id={game.id}
                                      title={game.name}
                                      text={isLogin ? "Jugar" : "Ingresar"}
                                      imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                      mobileShowMore={mobileShowMore}
                                      onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                                    />
                                  ))}
                                </div>
                                {isLoadingGames && <LoadApi />}

                                {games.length > 0 && (
                                  <div className="text-center">
                                    <a className="load-more" onClick={() => loadMoreGames()}>
                                      Mostrar todo
                                    </a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="home-section">
                                <div className="home-title">
                                  <h3>
                                    <div>Los Mejores Juegos</div>
                                  </h3>
                                </div>
                                <div className="home-item">
                                  {firstFiveCategoriesGames.length > 0 ? (
                                    firstFiveCategoriesGames.map((entry, catIndex) => {
                                      if (!entry || !entry.games) return null;

                                      return (
                                        <GameSlideshow
                                          key={entry?.category?.id || catIndex}
                                          games={entry.games.slice(0, 6)}
                                          name={entry?.category?.name}
                                          title={entry?.category?.name}
                                          icon=""
                                          slideshowKey={entry?.category?.id}
                                          loadMoreContent={() => loadMoreContent(entry.category, catIndex)}
                                          onGameClick={(g) => {
                                            if (isLogin) {
                                              launchGame(g, "slot", "tab");
                                            } else {
                                              handleLoginClick();
                                            }
                                          }}
                                        />
                                      );
                                    })
                                  ) : (
                                    <>
                                      {tags[selectedCategoryIndex]?.code === 'home' && topGames.length > 0 && <HotGameSlideshow games={topGames} name="games" title="Juegos" icon="" link="/casino" onGameClick={(game) => {
                                        if (isLogin) {
                                          launchGame(game, "slot", "modal");
                                        } else {
                                          handleLoginClick();
                                        }
                                      }} />}
                                      {tags[selectedCategoryIndex]?.code === 'home' && topArcade.length > 0 && <HotGameSlideshow games={topArcade} name="arcade" title="Tragamonedas" icon="cherry" link="/casino" onGameClick={(game) => {
                                        if (isLogin) {
                                          launchGame(game, "slot", "modal");
                                        } else {
                                          handleLoginClick();
                                        }
                                      }} />}
                                      {tags[selectedCategoryIndex]?.code === 'home' && topCasino.length > 0 && <HotGameSlideshow games={topCasino} name="casino" title="Tragamonedas" icon="cherry" link="/casino" onGameClick={(game) => {
                                        if (isLogin) {
                                          launchGame(game, "slot", "modal");
                                        } else {
                                          handleLoginClick();
                                        }
                                      }} />}
                                      {tags[selectedCategoryIndex]?.code === 'home' && topLiveCasino.length > 0 && <HotGameSlideshow games={topLiveCasino} name="liveCasino" title="Casino en Vivo" icon="spades" link="/live-casino" onGameClick={(game) => {
                                        if (isLogin) {
                                          launchGame(game, "slot", "modal");
                                        } else {
                                          handleLoginClick();
                                        }
                                      }} />}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                      }

                      {!isSingleCategoryView && !selectedProvider && <BannerContainer isSlotsOnly={isSlotsOnly} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ProviderModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onCategorySelect={(category) => {
          handleCategorySelect(category);
        }}
        onCategoryClick={(tag, _id, _table, index) => {
          setTxtSearch("");
          setShowFullDivLoading(true);
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
        tags={tags}
        categories={categories}
        selectedCategoryIndex={selectedCategoryIndex}
      />
    </>
  );
};

export default Home;