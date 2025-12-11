import { useContext, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from '../GameCard';

const HotGameSlideshow = ({ games, name, title, icon, link, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const uniqueId = useMemo(() => `slideshow-${name}-${Math.random().toString(36).substr(2, 9)}`, [name]);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    return (
        <div className="swiper-container">
            <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={9}
                navigation={{
                    prevEl: `.${uniqueId}-back`,
                    nextEl: `.${uniqueId}-next`,
                }}
                className="row-top-games"
                style={{ width: '100%' }}
            >
                {games?.map((game, index) => (
                    <SwiperSlide key={game.id || index} className="top-game-item">
                        <GameCard
                            key={game.id}
                            id={game.id}
                            provider={'Casino'}
                            title={game.name}
                            type="slideshow"
                            imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                            onGameClick={() => {
                                handleGameClick(game);
                            }}
                        />
                    </SwiperSlide>
                ))}
                <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
            </Swiper>
            <div
                className={`scroll-button left ${uniqueId}-back content-tile__back`}
                tabIndex={0}
                role="button"
                aria-label="Previous slide"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </div>
            <div
                className={`scroll-button right ${uniqueId}-next content-tile__next`}
                tabIndex={0}
                role="button"
                aria-label="Next slide"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </div>
        </div>
    );
};

export default HotGameSlideshow;