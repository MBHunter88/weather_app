import React, { useState, useEffect } from 'react';


const Users = ({ fetchWeather, setCity, searchedCity }) => {
  //state management
  const [searchInput, setSearchInput] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const [loggedInUser, setLoggedInUser] = useState(null); 
  const [favoriteCity, setFavoriteCity] = useState(''); 

  // Function to search for users (login by username)
  const searchUsers = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/search?input=${searchInput}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (e) {
      console.error('Error fetching user search results:', e);
    }
  };

  // Function to log in the user by selecting a username
  const handleLogin = async (user) => {
    setLoggedInUser(user); 
    setSearchInput(''); // clear input field for city search
    console.log(`Logged in as: ${user.username}`);

    // Fetch the user's favorite city from the backend
    try {
      const response = await fetch(`http://localhost:8080/api/favorite-city/${user.id}`);
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

  //save the searched city as a favorite for the logged-in user
  const handleFavorite = async () => {
    if (!loggedInUser) {
      console.error('No user logged in!');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/favorite-city/${loggedInUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityName: searchedCity, 
        }),
      });

      if (response.ok) {
        console.log('City saved as favorite');
        setFavoriteCity(searchedCity); 
      } else {
        console.log('Failed to save favorite city');
      }
    } catch (error) {
      console.error('Error saving favorite city:', error);
    }
  };

  return (
    <div>
      {!loggedInUser ? (
        <form className="login-form" onSubmit={searchUsers}>
          <input
            name="username"
            type="text"
            placeholder="Enter username to login"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <p>Logged in as: {loggedInUser.username}</p>
          <p>Favorite City: {favoriteCity}</p> 

          <form className="city-search-form" onSubmit={(e) => {
            e.preventDefault();
            setCity(searchInput); 
            fetchWeather(searchInput);
          }}>
            <input
              name="city"
              type="text"
              placeholder="Enter city"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">Get Weather</button>
          </form>
          <button onClick={handleFavorite}>
            Save {searchedCity} as Favorite
          </button>
        </>
      )}
      {searchResults.length > 0 && !loggedInUser && (
        <ul>
          {searchResults.map((user) => (
            <li key={user.id}>
              <p>Username: {user.username}</p>
              <button onClick={() => handleLogin(user)}>Login as {user.username}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Users;
