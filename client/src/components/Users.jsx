import React, { useState, useEffect } from 'react';
import Form from './Form';

const Users = ({ fetchWeather, setCity, setWeatherData, loggedInUser, setLoggedInUser, setFavoriteCity }) => {
  //state management
  const [searchInput, setSearchInput] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  
  // Function to search for users (login by username)
  const searchUsers = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/users/login?input=${searchInput}`);
      const data = await response.json();
      setSearchResults(data);
      if(data.length === 1){
        await handleLogin(data[0]);
      }
    } catch (e) {
      console.error('Error fetching user search results:', e);
    }
  };

  // Function to log in the user by selecting a username
  const handleLogin = async (user) => {
    setLoggedInUser(user); 
    setSearchInput(''); // clear input field for city search
    setSearchResults([]);
    console.log(`Logged in as: ${user.username}`);

    // Fetch the user's favorite city from the backend
    try {
      const response = await fetch(`http://localhost:8080/favorite-city/${user.id}`);
      const data = await response.json();
      if (data.city) {
        setFavoriteCity(data.city); 
        setCity(data.city); // Set in parent to fetch weather
        fetchWeather(data.city); // Fetch weather for the favorite city
      } else {
        setFavoriteCity('No favorite city saved yet');
      }
    } catch (error) {
      console.error('Error fetching favorite city:', error);
    }
  };

  const handleLogOut = () => {
    setLoggedInUser(null);
   setCity('');
   setFavoriteCity('');
   setWeatherData(null);
   console.log('User logged out successfully');
  }

  
  return (
    <div>
      {!loggedInUser ? (
           <Form
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSubmit={searchUsers}
        placeholder="Enter username to login"
        buttonText="Login"
      />
      ) : (
        <>
          <p>Logged in as: {loggedInUser.username}</p>
          <button className="logout-btn" onClick={handleLogOut}>Log Out</button>
        </>
      )}

      {searchResults}

    </div>
  );
};

export default Users;
