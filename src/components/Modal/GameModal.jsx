import { useState, useEffect } from "react";
import LoadApi from "../Loading/LoadApi";
import IconEnlarge from "/src/assets/svg/enlarge.svg";

const GameModal = (props) => {
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (props.isMobile) {
        window.location.href = props.gameUrl;
      } else {
        document
          .getElementsByClassName("game-view-container")[0]
          .classList.remove("d-none");
        setUrl(props.gameUrl);
      }
    }
  }, [props.gameUrl, props.isMobile]);

  const toggleFullScreen = () => {
    const gameWindow = document.getElementsByClassName("game-window")[0];

    if (!isFullscreen) {
      // Enter fullscreen
      if (gameWindow.requestFullscreen) {
        gameWindow.requestFullscreen();
      } else if (gameWindow.mozRequestFullScreen) {
        gameWindow.mozRequestFullScreen();
      } else if (gameWindow.webkitRequestFullscreen) {
        gameWindow.webkitRequestFullscreen();
      } else if (gameWindow.msRequestFullscreen) {
        gameWindow.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setIsFullscreen(false);
      document
        .getElementsByClassName("game-view-container")[0]
        .classList.remove("fullscreen");
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  const handleIframeLoad = () => {
    if (url != null) {
      document.getElementById("game-window-iframe").classList.remove("d-none");
      setIframeLoaded(true);
    }
  };

  const handleIframeError = () => {
    console.error("Error loading game iframe");
    setIframeLoaded(false);
  }

  if (props.isMobile) {
    return null;
  }

  return (
    <>
      <div className="d-none game-view-container game-container">
        <div className="game-window">
          <div className="game-window-header">
            <div className="game-window-header-item align-center full-window">
              {isFullscreen ? (
                <span
                  className="icon-originscreen"
                  onClick={toggleFullScreen}
                  title="Exit Fullscreen"
                >
                  <img src={IconShrink} />
                </span>
              ) : (
                <span
                  className="icon-fullscreen"
                  onClick={toggleFullScreen}
                  title="Fullscreen"
                >
                  <img src={IconEnlarge} />
                </span>
              )}
            </div>
          </div>

          {iframeLoaded}

          {iframeLoaded == false && (
            <div
              id="game-window-loading"
              className="game-window-iframe-wrapper"
            >
              <LoadApi />
            </div>
          )}

          <div
            id="game-window-iframe"
            className="game-window-iframe-wrapper d-none"
          >
            <iframe
              allow="camera;microphone;fullscreen *"
              src={url}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameModal;