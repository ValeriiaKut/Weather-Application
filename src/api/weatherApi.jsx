
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
    miasto: json.name.toLowerCase(),
    aktualnaTemperatura: json.main.temp,
    aktualnaPogoda: json.weather[0].main,
    aktualnyWiatr: json.wind.speed,
    aktualnyKierunekWiatru: degToDirection(json.wind.deg),
    aktualneZachmurzenie: json.clouds.all,
    ikonaPogody: json.weather[0].icon,
  };
}

export async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`
  );
  const json = await res.json();
  return transformCurrentWeather(json);
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

      return {
        date,
        sredniaTemperatura: parseFloat(avgTemp.toFixed(1)),
        sredniWiatr: parseFloat(avgWind.toFixed(1)),
        srednieZachmurzenie: parseFloat(avgClouds.toFixed(1)),
        pogoda: noonEntry.pogoda,
        ikona: noonEntry.ikona,
        kierunekWiatru: noonEntry.kierunekWiatru,
      };
    });

  return dailyForecast;
}
export async function fetchForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`
  );

  if (!res.ok) {
    const json = await res.json();
    throw new Error(`error: ${json.message}`);
  }

  const json = await res.json();
  return transformForecast(json);
}
