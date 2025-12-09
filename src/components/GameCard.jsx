import { useContext } from 'react';
import { AppContext } from '../AppContext';

const GameCard = (props) => {
    const { contextData } = useContext(AppContext);

    const handleGameClick = (e) => {
        e.stopPropagation();

        const gameData = props.game || {
            id: props.id || props.gameId,
            name: props.title,
            image_local: props.imageSrc?.includes(contextData?.cdnUrl)
                ? props.imageSrc.replace(contextData.cdnUrl, '')
                : null,
            image_url: props.imageSrc?.includes(contextData?.cdnUrl)
                ? null
                : props.imageSrc
        };

        if (props.onGameClick) {
            props.onGameClick(gameData);
        }
    };

    return (
        <div
            className={`${props.type === "slideshow" ? 'top-game-item' : 'game'}`}
            onClick={handleGameClick}
            data-game-id={props.id || props.gameId}
        >
            {
                props.type === "slideshow" ?
                    <img src={props.imageSrc} alt={props.title} className="zoom-img" /> :
                    <div className="picture">
                        <img src={props.imageSrc} alt={props.title} />
                    </div>
            }
        </div>
    );
};

export default GameCard;