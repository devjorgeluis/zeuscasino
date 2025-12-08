import { useContext, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Icons from '/src/assets/svg/icons.svg';
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
        <div className="content-tile">
            <div className="content-tile__header">
                <div className="content-tile-with-icon">
                    {icon && (
                    <svg className="content-tile__ico">
                        <use xlinkHref={`${Icons}#${icon}`}></use>
                    </svg>
                )}
                    <span className="content-tile__title">{title}</span>
                </div>
                
                <span className="content-title__all" onClick={() => navigate(link)}>Todo</span>
            </div>
            <div className="content-tile__body">
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation]}
                    spaceBetween={3}
                    slidesPerView={4}
                    navigation={{
                        prevEl: `.${uniqueId}-back`,
                        nextEl: `.${uniqueId}-next`,
                    }}
                    className="swiper-container"
                    style={{ width: '100%' }}
                >
                    {games?.map((game, index) => (
                        <SwiperSlide key={game.id || index} className="swiper-slide">
                            <GameCard
                                key={game.id}
                                id={game.id}
                                provider={'Casino'}
                                title={game.name}
                                imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                onGameClick={() => {
                                    handleGameClick(game);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                    <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                </Swiper>
                <div className="content-tile__arrows">
                    <div
                        className={`content-tile__arrow ${uniqueId}-back content-tile__back`}
                        tabIndex={0}
                        role="button"
                        aria-label="Previous slide"
                    >
                        <svg className="content-tile__ico">
                            <use xlinkHref={`${Icons}#arrow-left`}></use>
                        </svg>
                    </div>
                    <div
                        className={`content-tile__arrow ${uniqueId}-next content-tile__next`}
                        tabIndex={0}
                        role="button"
                        aria-label="Next slide"
                    >
                        <svg className="content-tile__ico">
                            <use xlinkHref={`${Icons}#arrow-right`}></use>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotGameSlideshow;