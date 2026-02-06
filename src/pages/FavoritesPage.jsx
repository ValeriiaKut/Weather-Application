import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard';
import UnitSwitcher from '../components/UnitSwitcher';
import { fetchWeatherById } from '../api/weatherApi';
import { useEffect, useState } from 'react';
function FavoritesPage() {
    const [miasta, setMiasta] = useState([]);
    const navigate = useNavigate();
    const favoriteIds = useSelector((state) =>
        state.favorites.favoriteIds);

    const favoriteCities = miasta.filter(m => favoriteIds.includes(m.id));

     useEffect(() => {
    async function getData() {
      if (favoriteIds.length === 0) return;

      try {
        // Завантажуємо усі улюблені міста по id
        const results = await Promise.all(favoriteIds.map(id => fetchWeatherById(id)));
        setMiasta(results);
      } catch (err) {
        console.error('Błąd pobierania ulubionych miast:', err);
      }
    }

    getData();
  }, [favoriteIds]);

    return (
        <div>
            <div className='fav-header'>
                <UnitSwitcher />
                <h1>Ulubione Miasta</h1>
                <button className='back-buttom' onClick={() => navigate('/')}> Powrot do listy </button>
            </div>
            {favoriteCities.length === 0 ? (
                <p>Nie masz jeszcze ulubiony miast.</p>
            ) : (
                <div className='fav-card'>
                    {favoriteCities.map((dane) => (
                        <WeatherCard
                            key={dane.id}
                            cityId={dane.id}
                            miasto={dane.miasto}
                            temperatura={dane.aktualnaTemperatura}
                            pogoda={dane.aktualnaPogoda}
                            onClick={() => navigate(`/miasto/${dane.id}`)}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

export default FavoritesPage;