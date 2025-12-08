import { useNavigate } from "react-router-dom";
import Icons from '/src/assets/svg/icons.svg';

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();

    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'home',
            name: 'Home',
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
            name: 'Casino en Vivo',
            icon: 'spades',
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
        <div className="footer">
            {menuItems.map((menu, index) => (
                <a
                    href={menu.href}
                    className={`footer-menu__item ${menu.href === location.pathname && "active"}`}
                    key={index}
                >
                    <div className="column-menu__item">
                        <svg className="column-menu__ico">
                            <use xlinkHref={`${Icons}#${menu.icon}`}></use>
                        </svg>
                    </div>
                    <span>{menu.name}</span>
                </a>
            ))}
        </div>
    );
};

export default Footer;