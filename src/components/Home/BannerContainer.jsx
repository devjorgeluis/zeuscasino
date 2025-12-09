import { useNavigate } from "react-router-dom";

import ImgCasino from "/src/assets/img/casino-item.jpg";
import ImgLiveCasino from "/src/assets/img/live-casino-item.jpg";
import ImgSport from "/src/assets/img/sports-item.jpg";

const BannerContainer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'casino',
            name: 'Casino',
            image: ImgCasino,
            href: '/casino'
        },
        {
            id: 'live-casino',
            name: 'Casino En Vivo',
            image: ImgLiveCasino,
            href: '/live-casino',
        },
        {
            id: 'sports',
            name: 'Deportes',
            image: ImgSport,
            href: '/sports'
        }
    ] : [
        {
            id: 'casino',
            name: 'Casino',
            image: ImgCasino,
            href: '/casino'
        }
    ];

    return (
        <>
            <div className="home-section">
                <div className="home-title">
                    <h3>
                        <div className="title">
                            Apuestas Deportivas
                        </div>
                    </h3>
                </div>
            </div>
            <div className="home-section">
                <div className="other-container">
                    <div className="other">
                        {menuItems.map((menu, index) => (
                            <div className="item" key={index}>
                                <img src={menu.image} alt={menu.name} />
                                <div className="button-item">
                                    <a onClick={() => navigate(menu.href)}>
                                        <span>{menu.name}</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerContainer