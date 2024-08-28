import { useState, useEffect } from 'react'
import './App.css'


 
function App() {
  const [city, setCity] = useState('Oakland'); //uses default city to render information
  const [weatherData, setWeatherData] = useState(null);

    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?city=${city}`); //fetch data from server.js
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

 // useEffect to fetch data for default city on component mount
 useEffect(() => {
  fetchWeather(); // Fetch weather data for default city
}, []); 

 //handle user input 
const handleSubmit = (event) => {
event.preventDefault()
fetchWeather();
}

  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder='Enter city here'
        />
     <button type="submit">Get Weather</button>
      </form>
    </div>
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
