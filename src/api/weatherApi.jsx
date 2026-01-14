
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export function degToDirection(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
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
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const json = await res.json();
  return transformCurrentWeather(json);
}
