import axios from 'axios';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export function degToDirection(deg) {
  const directions = ["Północ",
    "Północny-Wschód",
    "Wschód",
    "Południowy-Wschód",
    "Południe",
    "Południowy-Zachód",
    "Zachód",
    "Północny-Zachód"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export function transformCurrentWeather(json) {
  const pop = json.pop !== undefined ? json.pop : 0;
  return {
    id: json.id,
    miasto: json.name,
    aktualnaTemperatura: json.main.temp,
    aktualnaPogoda: json.weather[0].main,
    aktualnyWiatr: json.wind.speed,
    aktualnyKierunekWiatru: degToDirection(json.wind.deg),
    aktualneZachmurzenie: json.clouds.all,
    ikonaPogody: json.weather[0].icon,
    aktualnaWilgotnosc: json.main.humidity,
    aktualneOpadyDeszczu: json.rain?.["1h"] ?? json.rain?.["3h"] ?? 0, // мм за 1h або 3h
    aktualneOpadySniegu: json.snow?.["1h"] ?? json.snow?.["3h"] ?? 0, 
    aktualnaSzansaOpadow: Math.round(pop * 100),
  };
}


export async function fetchWeather(city) {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'pl'
      }
    });
    return transformCurrentWeather(res.data);
  } catch (error) {
    throw new Error(`Błąd pobierania danych pogody: ${error.response?.data?.message || error.message}`);
  }
}

export function transformForecast(json) {

  const forecastByDay = {};

  json.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!forecastByDay[date]) {
      forecastByDay[date] = [];
    }
    forecastByDay[date].push({
      czas: item.dt_txt,
      temperatura: item.main.temp,
      pogoda: item.weather[0].main,
      wiatr: item.wind.speed,
      kierunekWiatru: degToDirection(item.wind.deg),
      zachmurzenie: item.clouds.all,
      ikona: item.weather[0].icon,
      wilgotnosc: item.main.humidity,
      opadyDeszczu: item.rain?.["3h"] ?? 0,
      opadySniegu: item.snow?.["3h"] ?? 0,
      pop: item.pop ?? 0
    });
  });
  


  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const dailyForecast = Object.entries(forecastByDay)
    .filter(([date]) => date !== todayStr)
    .map(([date, entries]) => {
      const avgTemp =
        entries.reduce((sum, e) => sum + e.temperatura, 0) / entries.length;
      const avgWind =
        entries.reduce((sum, e) => sum + e.wiatr, 0) / entries.length;
      const avgClouds =
        entries.reduce((sum, e) => sum + e.zachmurzenie, 0) / entries.length;

      const noonEntry = entries.find(e => e.czas.includes("12:00")) || entries[0];
      const avgHum = entries.reduce((sum, e) => sum + e.wilgotnosc, 0) / entries.length;
      const totalRain = entries.reduce((sum, e) => sum + (e.opadyDeszczu ?? 0), 0);
      const totalSnow = entries.reduce((sum, e) => sum + (e.opadySniegu ?? 0), 0);
      const avgPop = entries.reduce((s, e) => s + e.pop, 0) / entries.length;



      return {
        date,
        sredniaTemperatura: parseFloat(avgTemp.toFixed(1)),
        sredniWiatr: parseFloat(avgWind.toFixed(1)),
        srednieZachmurzenie: parseFloat(avgClouds.toFixed(1)),
        pogoda: noonEntry.pogoda,
        ikona: noonEntry.ikona,
        kierunekWiatru: noonEntry.kierunekWiatru,
        wilgotnosc: parseFloat(avgHum.toFixed(1)),
        opadyDeszczu: parseFloat(totalRain.toFixed(1)),
        opadySniegu: parseFloat(totalSnow.toFixed(1)),
        szansaOpadow: Math.round(avgPop * 100)
      };
    });

  return dailyForecast;
}


export async function fetchWeatherById(id) {
  console.log(`Fetching weather for city ID: ${id}`);
  
  try {
    // ПРАВИЛЬНИЙ ЗАПИТ: використовуйте параметр id безпосередньо
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        id: id,  // <-- ось так правильно!
        appid: API_KEY,
        units: 'metric',
        lang: 'pl'
      }
    });
    
    console.log(`Successfully fetched weather for ID ${id}:`, res.data.name);
    return transformCurrentWeather(res.data);
    
  } catch (error) {
    console.error(`Error fetching weather for ID ${id}:`, {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    // Детальна інформація про помилку
    if (error.response?.status === 404) {
      throw new Error(`Miasto o ID ${id} nie zostało znalezione w bazie OpenWeatherMap`);
    }
    
    throw new Error(`Błąd pobierania danych pogody: ${error.response?.data?.message || error.message}`);
  }
}
export async function fetchForecastById(id) {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        id,
        appid: API_KEY,
        units: 'metric',
        lang: 'pl'
      }
    });
    return transformForecast(res.data);
  } catch (error) {
    throw new Error(`Błąd pobierania prognozy: ${error.response?.data?.message || error.message}`);
  }
}

