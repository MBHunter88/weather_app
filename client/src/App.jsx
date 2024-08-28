import { useState, useEffect } from 'react'
import './App.css'


  function App() {
    const [data, setData] = useState('');
  
    const connectToBackend = () => {
      fetch('/')
        .then((res) => res.json())
        .then((data) => setData(data.message));
    };

  return (
    <>
     <div className="App">
      <h1>React Website with an Express backend</h1>

      <button onClick={connectToBackend}>Send Request to Backend</button>
      {/* Render the newly fetched data inside data */}
      <p>{data}</p>
    </div>
    </>
  )
}

export default App
