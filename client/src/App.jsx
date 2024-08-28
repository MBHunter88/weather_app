import { useState, useEffect } from 'react'
import './App.css'


 
function App() {
  const [city, setCity] = useState('Oakland'); //uses default city to render information
  const [weatherData, setWeatherData] = useState(null);

  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?city=${city}`); //fetch data from server.js
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather(); // Fetch weather data when city changes
  }, [city]); //this useEffect runs whenever `city` changes

 
  return (
    <>
   {weatherData ? (
        <div>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default App
