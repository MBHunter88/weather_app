import React from 'react';

const FavoriteButton = ({ searchedCity, loggedInUser, handleFavorite }) => {
  if (!loggedInUser || !searchedCity) return null;

  return (
    <button onClick={handleFavorite}>
      Save {searchedCity} as Favorite
    </button>
  );
};

export default FavoriteButton;
