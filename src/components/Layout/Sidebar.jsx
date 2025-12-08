import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/svg/logo.svg";
import Icons from '/src/assets/svg/icons.svg';

const Sidebar = ({ isSlotsOnly }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'home',
            name: 'Página principal',
            icon: 'home',
            href: '/'
        },
        {
            id: 'casino',
            name: 'Tragamonedas',
            icon: 'cherry',
            href: '/casino'
        },
        {
            id: 'live-casino',
            name: 'Casino en Directo',
            icon: 'live_casino',
            href: '/live-casino',
        },
        {
            id: 'sports',
            name: 'Deportes',
            icon: 'cup',
            href: '/sports'
        }
    ] : [
        {
            id: 'casino',
            name: 'Tragamonedas',
            icon: 'cherry',
            href: '/casino'
        }
    ];

    return (
        <>
            <div className="column">
                <div className="column__body">
                    <div className="column__header">
                        <a href="/" className="column__logo">
                            <img src={ImgLogo} alt="Logo de la compañía" title="Ir a la página de Inicio" className="column__img" />
                        </a>
                    </div>
                    <div className="column__action">
                        <button id="curLoginForm" className="btn btn--transparent curloginDropTop" onClick={() => navigate("/login")}>
                            Iniciar sesión
                        </button>
                    </div>
                    <div className="column-menu column__menu scrollbar">
                        {menuItems.map((menu, index) => (
                            <a
                                href={menu.href}
                                className={`column-menu__link ${menu.href === location.pathname && "active"}`}
                                key={index}
                            >
                                <div className="column-menu__item">
                                    <svg className="column-menu__ico">
                                        <use xlinkHref={`${Icons}#${menu.icon}`}></use>
                                    </svg>
                                </div>
                                {menu.name}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="column-support">
                    <div className="time-block-gmt">
                        <p className="time-block-gmt__title">
                            Hora del casino:
                        </p>
                        <div className="time-block-gmt__value">
                            <span className="time-block-gmt__date">
                                {new Date().toLocaleDateString('es-ES', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                            <span className="time-block-gmt__time">
                                {new Date().toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'America/Sao_Paulo'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="column-support__row">
                        <a href="https://1xslot.com/downloads/androidclient/releases_android/1xSlots/site/1xSlots.apk" className="column-support__link">
                            <svg className="column-support__ico">
                                <use xlinkHref={`${Icons}#android`}></use>
                            </svg>
                        </a>
                        <a href="#" className="column-support__link">
                            <svg className="column-support__ico">
                                <use xlinkHref={`${Icons}#apple`}></use>
                            </svg>
                        </a>
                    </div>
                    <div className="column-support__row column-support-social">
                        <div className="column-support-social__content column-social-content">
                            <ul className="column-social-content__list">
                                <li className="column-social-content__item">
                                    <a target="_blank" href="https://t.me/+aC3UrOGZmANjY2Iy" className="column-social-content__link g-analytics-social--telegram">
                                        <svg className="column-social-content__ico">
                                            <use xlinkHref={`${Icons}#tg`}></use>
                                        </svg>
                                    </a>
                                </li>
                                <li className="column-social-content__item">
                                    <a target="_blank" href="https://t.me/+Rp1KFRam2CxhZDky" className="column-social-content__link g-analytics-social--telegramchat">
                                        <svg className="column-social-content__ico">
                                            <use xlinkHref={`${Icons}#telegramchat`}></use>
                                        </svg>
                                    </a>
                                </li>
                                <li className="column-social-content__item">
                                    <a target="_blank" href="https://www.instagram.com/1xslotslatam/" className="column-social-content__link g-analytics-social--instagram">
                                        <svg className="column-social-content__ico">
                                            <use xlinkHref={`${Icons}#in`}></use>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;