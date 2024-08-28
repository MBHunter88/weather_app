//imports
import { useState, useEffect } from 'react'
import './App.css'


//define component 
function App() {
  //initiate state
  const [city, setCity] = useState('Oakley'); //renders data from the default state
  const [weatherData, setWeatherData] = useState(null);

//fetch weather api 
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?city=${city}`); //fetch data from server.js
        const data = await response.json();
        setWeatherData(data); //updates weatherData from parsed data api request
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

 // useEffect to fetch data for default city when component initially loads
 useEffect(() => {
  fetchWeather(); // Fetch weather data for default city
}, []); 

 //handle user input 
const handleSubmit = (event) => {
event.preventDefault() //prevents page from reloading
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
           <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          />
          <p>Temperature: {weatherData.main.temp}°F</p>
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
