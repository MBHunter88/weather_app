import React from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import SignUp from './components/SignUp';
import './App.css';


function App() {

  return (
    <div className="App">
    <SignUp/>
      <WeatherDisplay />

    </div>
  )
}

export default App