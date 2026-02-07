import { useState, useMemo, useCallback, useEffect } from 'react'
import WeatherCard from '../components/WeatherCard'
import WeatherDetails from '../components/WeatherDetails'
import { useNavigate } from 'react-router-dom';
import UnitSwitcher from '../components/UnitSwitcher';
import { fetchWeather } from '../api/weatherApi';

function HomePage() {
  const [miasta, setMiasta] = useState([]);
  const [wybraneMiasto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    async function getData() {
      const cities = ["Warszawa", "Krakow", "Gdansk", "Wroclaw", "Katowice", "Lodz", "Suwałki"];
      const results = await Promise.all(cities.map(city => fetchWeather(city)));
      setMiasta(results);
    }
    getData();
  }, []);

  const handleClick = useCallback((miasto) => {
    navigate(`/miasto/${miasto.id}`);
  }, []);


  useEffect(() => {
    if (!searchTerm) {
      setSearchResult(null);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const result = await fetchWeather(searchTerm);
        setSearchResult(result);
      } catch {
        setSearchResult(null); 
      }
    }, 500); 

    return () => clearTimeout(handler);
  }, [searchTerm]);

  
  const filteredMiasta = useMemo(() => {
    if (!Array.isArray(miasta)) return [];
    return miasta.filter(miasto =>
      miasto.miasto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [miasta, searchTerm]);

  return (
    <>
      <div className="header-row">
        <input
          className="search-input"
          type="text"
          placeholder="Szukaj miasta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1 className="header-title">Pogoda w Polsce</h1>
        <button className="favorites-button" onClick={() => navigate('/ulubione')}>Ulubione miasta</button>
        <UnitSwitcher className="unit-switcher" />
      </div>

      <div className='images'>
        <img className='woman' src="/images/mykola.png" alt="woman" />
        <img className='cat' src="/images/aero2.jpg" alt="cat" />
      </div>

      <div className="cities-container">
        {/* 🔹 Картки локальних міст */}
        {filteredMiasta.map((dane) => (
          <WeatherCard
            key={dane.id}
            cityId={dane.id}
            miasto={dane.miasto}
            temperatura={dane.aktualnaTemperatura}
            pogoda={dane.aktualnaPogoda}
            onClick={() => handleClick(dane)}
          />
        ))}

        {searchResult && !miasta.some(m => m.id === searchResult.id) && (
          <WeatherCard
            key={searchResult.id}
            cityId={searchResult.id}
            miasto={searchResult.miasto}
            temperatura={searchResult.aktualnaTemperatura}
            pogoda={searchResult.aktualnaPogoda}
            onClick={() => handleClick(searchResult)}
          />
        )}
      </div>

      {wybraneMiasto && (
        <WeatherDetails miasto={wybraneMiasto} />
      )}
    </>
  )
}

export default HomePage;
