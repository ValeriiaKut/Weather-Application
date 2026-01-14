import WeatherDetails from '../components/WeatherDetails'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeather } from '../api/weatherApi'; 
import { useState, useEffect } from 'react';

function CityDetailPage(){
    const [miasta, setMiasta] = useState([]);
    const {cityId} = useParams();
    const navigate = useNavigate();

    const miasto = miasta.find(x => x.id == parseInt(cityId));
    useEffect(() => {
    async function getData() {
      const cities = ["Warsaw", "Krakow", "Gdansk","Wroclaw","Katowice","Lodz"]; // можна додати свої
      const results = await Promise.all(cities.map(city => fetchWeather(city)));
      setMiasta(results);
    }
    getData();
  }, []);
    if(!miasto){
        return(
            <div>
                <h2>Nie znaleziono miasta</h2>
                <button onClick={() => navigate('/')}>Powrot do strony glownej</button>
            </div>
        );
    }
    
    return(
        <div>
            <WeatherDetails miasto={miasto}/>
            <button onClick={() => navigate('/')}>Powrot do strony glownej</button>
        </div>
    )
}
export default CityDetailPage