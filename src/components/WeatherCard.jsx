import { useSelector } from "react-redux";
import { convertTemperature, getUnitSymbol } from "../utils/temperature";
import FavoriteButton from "./FavoriteButton";
import { Player } from '@lottiefiles/react-lottie-player';
import { weatherIcons } from "./WeatherIcon";


function WeatherCard(props) {
    
     console.log('WeatherCard received cityId:', props.cityId, 'Type:', typeof props.cityId);
    const className = `city-card ${props.selected ? 'selected' : ''}`;
    const iconFile = props.pogoda ? weatherIcons[props.pogoda] : null;
    const unit = useSelector((state) => state.settings.temperatureUnit);
    const displayTemp = convertTemperature(props.temperatura, unit);
    const unitSymbol = getUnitSymbol(unit);
    return (

        <div className={className} onClick={props.onClick} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') props.onClick && props.onClick(); }}>
            <h2>{props.miasto}</h2>
            <FavoriteButton cityId={props.cityId} />
            {iconFile && (
                <Player
                    autoplay
                    loop
                    src={iconFile}
                    style={{ height: 80, width: 80 }}
                />
            )}

            <div className="meta">
                <div>
                    {props.temperatura ? displayTemp + unitSymbol : '-'};
                </div>
                <div className="cond">{props.pogoda || ''}</div>
            </div>
        </div>

    )
}

export default WeatherCard;