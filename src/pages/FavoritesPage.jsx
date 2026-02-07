// FavoritesPage.jsx (спрощений)
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard';
import UnitSwitcher from '../components/UnitSwitcher';
import { fetchWeatherById } from '../api/weatherApi';
import { useEffect, useState } from 'react';
// Імпортуємо тільки toggleFavorite, якщо не хочете додавати нові actions
import { toggleFavorite } from '../store/slices/favoritesSlice';

function FavoritesPage() {
    const [miasta, setMiasta] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const favoriteIds = useSelector((state) => state.favorites.favoriteIds);
    
    // Фільтруємо лише валідні ID
    const validFavoriteIds = favoriteIds.filter(id => 
        id && typeof id === 'number' && id > 1000
    );

    useEffect(() => {
        async function getData() {
            if (validFavoriteIds.length === 0) {
                setMiasta([]);
                return;
            }

            setIsLoading(true);
            try {
                // Використовуємо Promise.all з try-catch для кожного запиту
                const promises = validFavoriteIds.map(async (id) => {
                    try {
                        return await fetchWeatherById(id);
                    } catch (error) {
                        console.warn(`Nie udało się pobrać danych dla ID ${id}:`, error.message);
                        return null;
                    }
                });
                
                const results = await Promise.all(promises);
                const validResults = results.filter(result => result !== null);
                setMiasta(validResults);
                
            } catch (err) {
                console.error('Błąd pobierania ulubionych miast:', err);
            } finally {
                setIsLoading(false);
            }
        }

        getData();
    }, [validFavoriteIds]);

    return (
        <div>
            <div className='fav-header'>
                <UnitSwitcher />
                <h1>Ulubione Miasta</h1>
                <button className='back-button' onClick={() => navigate('/')}> 
                    Powrót do listy 
                </button>
            </div>
            
                <div className='fav-card'>
                    {miasta.map((dane) => (
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
            
        </div>
    );
}

export default FavoritesPage;