import { useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo-footer.png";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'home',
            name: 'Home',
            href: '/'
        },
        {
            id: 'casino',
            name: 'Casino',
            href: '/casino'
        },
        {
            id: 'live-casino',
            name: 'Casino En Vivo',
            href: '/live-casino',
        },
        {
            id: 'sports',
            name: 'Deportes',
            href: '/sports'
        },
        {
            id: 'live-sports',
            name: 'Deportes En Vivo',
            href: '/live-sports'
        }
    ] : [
        {
            id: 'casino',
            name: 'Casino',
            href: '/casino'
        }
    ];

    return (
        <div className="footer-app">
            <div className="row">
                <div className="left">
                    <img src={ImgLogo} />
                    <p className="copyright">© Millonarios.bet - 2026. <br /> Todos los derechos reservados</p>
                </div>
                <div className="right">
                    <div className="row-right">
                        <div className="col">
                            <h4>Secciones</h4>
                            <ul>
                                {menuItems.map((menu, index) => (
                                    <li key={index}>
                                        <a
                                            onClick={() => navigate(menu.href)}
                                        >
                                            {menu.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;