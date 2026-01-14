import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard';
import UnitSwitcher from '../components/UnitSwitcher';
import { fetchWeather } from '../api/weatherApi';
import { useEffect, useState } from 'react';
function FavoritesPage() {
    const [miasta, setMiasta] = useState([]);
    const navigate = useNavigate();
    const favoriteIds = useSelector((state) =>
        state.favorites.favoriteIds);

    const favoriteCities = miasta.filter(m => favoriteIds.includes(m.id));

    useEffect(() => {
        async function getData() {
            const cities = ["Warszawa", "Krakow", "Gdansk", "Wroclaw", "Katowice", "Lodz"];
            const results = await Promise.all(cities.map(city => fetchWeather(city)));
            setMiasta(results);
        }
        getData();
    }, []);

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