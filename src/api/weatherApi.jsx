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
    aktualneOpadyDeszczu: json.rain?.["24h"] ?? 0,
    aktualneOpadySniegu: json.snow?.["12h"] ?? 0
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
      opadyDeszczu: item.rain?.["1h"] ?? 0,
      opadySniegu: item.snow?.["1h"] ?? 0
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
      const totalRain = entries.reduce((sum, e) => sum + (e.rain ?? 0), 0);
      const totalSnow = entries.reduce((sum, e) => sum + (e.snow ?? 0), 0);


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
      };
    });

  return dailyForecast;
}
export async function fetchForecast(city) {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
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
// Погода по id
export async function fetchWeatherById(id) {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        id,
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

// Прогноз по id
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

