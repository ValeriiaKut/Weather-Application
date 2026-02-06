import WeatherDetails from '../components/WeatherDetails'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchWeatherById, fetchForecastById } from '../api/weatherApi'
import { useState, useEffect } from 'react'

function CityDetailPage() {
  const [miasto, setMiasto] = useState(null)
  const [forecast, setForecast] = useState([])
  const { cityId } = useParams() // беремо назву міста з URL
  const navigate = useNavigate()

  useEffect(() => {
    if (!cityId) return;

    async function getCityData() {
      try {
        // Використовуємо id для fetchWeather
        const cityData = await fetchWeatherById(cityId);
        setMiasto(cityData);

        const cityForecast = await fetchForecastById(cityId);
        setForecast(cityForecast);
      } catch (err) {
        console.error(err);
        navigate('/'); // повертаємось на головну, якщо помилка
      }
    }

    getCityData();
  }, [cityId, navigate]);

  if (!miasto) {
    return (
      <div>
        <h2>Nie znaleziono miasta</h2>
        <button onClick={() => navigate('/')}>Powrót do strony głównej</button>
      </div>
    )
  }

  const miastoWithForecast = {
    ...miasto,
    prognoza5dni: forecast
  }

  return (
    <div>
      <WeatherDetails miasto={miastoWithForecast} />
      <button className='back-button' onClick={() => navigate('/')}>
        Powrót do strony głównej
      </button>
    </div>
  )
}

export default CityDetailPage
