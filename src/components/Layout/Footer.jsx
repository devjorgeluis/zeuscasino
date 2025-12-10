import { useNavigate } from "react-router-dom";

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
            <div className="container-fluid">
                <div className="row">
                    <div className="left">
                        <p className="copyright">2024 Todos los derechos reservados. Sitio Operado bajo Licencia de Curazao - Antillas Holandesas.</p>
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
        </div>
    );
};

export default Footer;