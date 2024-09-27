import React from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import './App.css';


function App() {

  return (
    <div className="App">
   <h1 className='title'>It's Bananas Outside</h1>
      <WeatherDisplay />

    </div>
  )
}

export default App