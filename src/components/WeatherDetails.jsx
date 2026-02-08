
import { convertTemperature, getUnitSymbol } from "../utils/temperature";
import { useSelector } from 'react-redux';
import { weatherIcons } from './WeatherIcon';
import { Player } from '@lottiefiles/react-lottie-player';

function WeatherDetails({ miasto }) {
  if (!miasto) return null;
  const unit = useSelector((state) => state.settings.temperatureUnit);
  const unitSymbol = getUnitSymbol(unit);
  const iconFile = weatherIcons[miasto.aktualnaPogoda];
  return (
    <div className="details-card">
      <div className="details-panel">
        <h2>Szczegóły pogody dla {miasto.miasto}</h2>
        <div className="details-row">

          <div className="details-item">
            <strong>Temperatura:</strong>
            <div>{convertTemperature(miasto.aktualnaTemperatura, unit)}{unitSymbol}</div>
          </div>

          {iconFile && (
            <div className="details-item">
              <Player
                autoplay
                loop
                src={iconFile}
                style={{ height: '100px', width: '100px' }}
              />
            </div>
          )}
          <div className="details-item">
            <strong>Warunki:</strong>
            <span>{miasto.aktualnaPogoda}</span>
          </div>
          <div className="details-item">
            <img src="/images/iconF.jpg"  width="200" height="200"/>
          </div>
          <div className="details-item">
            <strong>Wiatr:</strong>
            <span>{miasto.aktualnyWiatr}</span>
          </div>
          <div className="details-item">
            <strong>Kierunek Wiatru:</strong>
            <span>{miasto.aktualnyKierunekWiatru}</span>
          </div>
          <div className="details-item">
            <strong>Zachmurzenie:</strong>
            <span>{miasto.aktualneZachmurzenie}</span>
          </div>
          <div className="details-item">
            <strong>Wilgontość:</strong>
            <span>{miasto.aktualnaWilgotnosc}</span>
          </div>
          <div className="details-item">
                         <strong>Opady Śniegu:</strong>
                         <span>{miasto.aktualneOpadySniegu}</span>
                      </div>
                     <div className="details-item">
                         <strong>Opady Deszczu:</strong>
                         <span>{miasto.aktualneOpadyDeszczu}</span>
                      </div>
                      <div className="details-item">
                         <strong>Szansa Opadów:</strong>
                         <span>{miasto.aktualnaSzansaOpadow}</span>
                      </div>
          
          {Array.isArray(miasto.prognoza5dni) && (
            <div className="forecast">
              <h3>5-dniowa prognoza</h3>
              <div className="forecast-row">
                {miasto.prognoza5dni.map((dzień, idx) => {
                  const dayIconFile = weatherIcons[dzień.pogoda];
                  return (
                    <div className="forecast-day" key={idx}>
                      <div className="details-item"><strong>{dzień.date}</strong></div>
                      <div className="details-item">
                        Temperatura: {convertTemperature(dzień.sredniaTemperatura, unit)}{unitSymbol}
                      </div>
                      <div className="details-item">Pogoda: {dzień.pogoda}</div>
                      {dzień.kierunekWiatru && (
                        <div className="details-item">Kierunek wiatru: {dzień.kierunekWiatru}</div>
                      )}
                      <div className="details-item">Wilgotność: {dzień.wilgotnosc}</div>
                      <div className="details-item">
                        <strong>Opady Deszczu:</strong>
                          <span>{dzień.opadyDeszczu}</span>
                      </div>
                      <div className="details-item">
                         <strong>Opady Śniegu:</strong>
                         <span>{dzień.opadySniegu}</span>
                      </div>
                      <div className="details-item">
                        <strong>Szansa Opadów:</strong>
                          <span>{dzień.szansaOpadow}</span>
                      </div>
                      {dayIconFile && (
                        <div className="details-item">
                          <Player
                            autoplay
                            loop
                            src={dayIconFile}
                            style={{ height: 60, width: 60 }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default WeatherDetails;
