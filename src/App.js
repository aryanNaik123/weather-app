import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiWeatherCloudy } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const API_KEY = process.env.REACT_APP_KEY;
  const [currentWeather, setCurrentWeather] = useState(null);
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherData(latitude, longitude);
      },
      () => {
        toast.error(
          "Unable to retrieve current location. Please allow location access and refresh the page."
        );
      }
    );
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setCurrentWeather(response.data);
    } catch (error) {
      toast.error(
        "Unable to retrieve current weather data. Please try again later."
      );
    }
  };

  const handleCitySearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setCurrentWeather(response.data);
      setCityName("");
    } catch (error) {
      toast.error(
        "Unable to retrieve weather data for that city. Please try again with a different city name."
      );
    }
  };

  return (
    <div className="App">
      <h1>
        <TiWeatherCloudy /> React Weather App
      </h1>
      {currentWeather ? (
        <div className="current-weather">
          <h2>
            Current Weather in {currentWeather.name},{" "}
            {currentWeather.sys.country}
          </h2>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
              alt={currentWeather.weather[0].description}
            />
            <p>{currentWeather.weather[0].description}</p>
          </div>
          <p>Temperature: {currentWeather.main.temp} &deg;C</p>
          <p>Feels Like: {currentWeather.main.feels_like} &deg;C</p>
          <p>Humidity: {currentWeather.main.humidity}%</p>
          <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading current weather data...</p>
      )}
      <form onSubmit={handleCitySearch}>
        <label htmlFor="cityName">Search for a City:</label>
        <input
          type="text"
          id="cityName"
          value={cityName}
          onChange={(event) => setCityName(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ToastContainer />
    </div>
  );
}
