import React from 'react';

const FavoriteButton = ({ searchedCity, loggedInUser, handleFavorite, isFavorite, favoriteCity }) => {
  if (!loggedInUser || !searchedCity) return null;
  if (favoriteCity === searchedCity) {
    return null; 
  }
  return (
    <button onClick={handleFavorite}>
      Update {searchedCity} as Favorite
    </button>
  );
};

export default FavoriteButton;
