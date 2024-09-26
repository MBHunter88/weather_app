//imports
import { useState, useEffect } from 'react'
import Users from './components/Users';
import './App.css'



//define component 
function App() {
  //initiate state
  const [city, setCity] = useState('Oakley'); //renders data from the default state
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null); //add state for error handling
  const [loading, setLoading] = useState(false) //state for loading indication
  const [searchedCity, setSearchedCity] = useState('');

  //fetch weather api 
  const fetchWeather = async (selectedCity = city) => {
 setSearchedCity(selectedCity);
    //error handling for user input 
    if (!selectedCity.trim()) {
      setError('Please enter city name') //error for empty input
      setWeatherData(null) //clear weather data
      return
    }
    setLoading(true); //start loading indication
    setError(null); // clear any previous errors

    try {
      const response = await fetch(`/api/weather?city=${selectedCity}`); //fetch data from server.js

      //error handling to check for response from server
      if (!response.ok) { //if not ok (codes 200-299) throw error
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json();

      //error handling from openWeather API to check for valid city 
      if (data.cod !== 200) {
        throw new Error(data.message || 'Error fetching weather data');
      }

      setWeatherData(data); //updates weatherData from parsed data api request
      setError(null) //clears any current error with successful fetch

    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error.message || 'Failed to fetch weather data. Try again') //update setError to display error message
      setWeatherData(null) //clears data on error
    } finally {
      setLoading(false) //stop loading indicator
    }
  };

  // useEffect to fetch data for default city when component initially loads
  useEffect(() => {
    fetchWeather(); // Fetch weather data for default city
  }, []);

  //handle user input 
  const handleSubmit = (event) => {
    event.preventDefault() //prevents page from reloading
    fetchWeather(); //fetch data from user input
  }

  return (
    <>
    <Users 
    weatherData={weatherData} 
    setWeatherData={setWeatherData} 
    setCity={setCity} 
    fetchWeather={fetchWeather} 
    searchedCity={searchedCity}/>
    
      <div className='container'>
        <div className='form'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => setCity(e.target.value)}
              placeholder='Enter city here'
              autoFocus
            />
            <button type="submit">Get Weather</button>
          </form>
        </div>
      

        {error && <p className='error-msg'>{error}</p>}
        {loading && <p>Loading...</p>}

        {weatherData && (
          <div className='weatherData'>
            <div className='weatherDisplay'>
              <h3>Weather in {weatherData.name}</h3>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                // if icon isn't found default to description
                alt={weatherData.weather[0].description}
              />
              <p>Temperature: {weatherData.main.temp}°F</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            </div>
          </div>

        )}
      </div>
    </>
  )
}

export default App
