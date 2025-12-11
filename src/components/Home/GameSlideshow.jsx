import { useContext, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { Navigation } from 'swiper/modules';
import GameCard from '../GameCard';

const GameSlideshow = ({ games, name, title, icon, link, onGameClick, slideshowKey, loadMoreContent }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    return (
        <div className="games-section">
            <div className="games-vertodos">
                <h3>{title}</h3>
                <div className="ver-todos" onClick={loadMoreContent}>
                    <span>Ver todos</span>
                    <i className="fa-solid fa-angle-right"></i>
                </div>
            </div>
            <div className="games-grid">
                {games?.map((game, index) => {
                    const keyBase = slideshowKey ? `s${slideshowKey}` : `global`;
                    const itemKey = `${keyBase}-${game.id}-${index}`;
                    return (
                        <GameCard
                            key={itemKey}
                            id={game.id}
                            provider={'Casino'}
                            title={game.name}
                            imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                            onGameClick={() => handleGameClick(game)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default GameSlideshow;