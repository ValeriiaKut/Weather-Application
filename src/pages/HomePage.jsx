import { useState, useMemo, useCallback, useEffect } from 'react'
import WeatherCard from '../components/WeatherCard'
import WeatherDetails from '../components/WeatherDetails'
import { useNavigate } from 'react-router-dom';
import UnitSwitcher from '../components/UnitSwitcher';
import { fetchWeather } from '../api/weatherApi';



function HomePage() {
  const [miasta, setMiasta] = useState([]);
  const [wybraneMiasto, setWybraneMiasto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const cities = ["Warsaw", "Kraków", "Gdansk", "Wroclaw", "Katowice", "Lodz"]; // можна додати свої
      const results = await Promise.all(cities.map(city => fetchWeather(city)));
      setMiasta(results);
    }
    getData();
  }, []);


  const handleClick = useCallback((miasto) => {
    console.log('Kliknieto miasto:', miasto.miasto);
    navigate(`/miasto/${miasto.id}`)
  }, []);

  const filteredMiasta = useMemo(() => {
    console.log({ searchTerm });
    return miasta.filter(miasto =>
      miasto.miasto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [miasta, searchTerm]);

  return (
    <>
      <div className="header-row">
        <input className="search-input"
          type="text"
          placeholder="Szukaj miasta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1 className="header-title">Pogoda w Polsce</h1>
        <button className="favorites-button" onClick={() => navigate('/ulubione')}>Ulubione miasta</button>
        <UnitSwitcher className="unit-switcher" />
        <div className='search'>
        </div>
      </div>
      <div className='images'>
        <img className='woman' src="/images/mykola.png" />
        <img className='cat' src="/images/aero2.jpg" />
      </div>
      <div className="cities-container">
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
      </div>

      {wybraneMiasto && (
        <WeatherDetails miasto={wybraneMiasto} />
      )}
    </>
  )
}

export default HomePage