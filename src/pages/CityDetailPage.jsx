import WeatherDetails from '../components/WeatherDetails'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeather } from '../api/weatherApi';
import { fetchForecast } from '../api/weatherApi';
import { useState, useEffect } from 'react';

function CityDetailPage() {
  const [miasta, setMiasta] = useState([]);
  const [forecastMap, setForecastMap] = useState({});

  const { cityId } = useParams();
  const navigate = useNavigate();

  const miasto = miasta.find(x => x.id === parseInt(cityId));

  useEffect(() => {
    async function getData() {
      const cities = ["Warsaw", "Krakow", "Gdansk", "Wroclaw", "Katowice", "Lodz"];

      const results = await Promise.all(cities.map(city => fetchWeather(city)));
      setMiasta(results);

      const forecasts = await Promise.all(cities.map(city => fetchForecast(city)));
      const map = {};
      results.forEach((cityObj, idx) => {
        map[cityObj.id] = forecasts[idx];
      });
      setForecastMap(map);
    }
    getData();
  }, []);

  if (!miasto) {
    return (
      <div>
        <h2>Nie znaleziono miasta</h2>
        <button onClick={() => navigate('/')}>Powrot do strony glownej</button>
      </div>
    );
  }

  const miastoWithForecast = {
    ...miasto,
    prognoza5dni: forecastMap[miasto.id] || []
  };

  return (
    <div>
      <WeatherDetails miasto={miastoWithForecast} />
      <button className='back-buttom' onClick={() => navigate('/')}>Powrót do strony glownej</button>
    </div>
  );
}

export default CityDetailPage;
