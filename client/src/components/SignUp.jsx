import React, {useState} from 'react';


const SignUp = ({ searchedCity, loggedInUser, handleFavorite }) => {
  if (loggedInUser) return null;
  const [signInInput, setSignInInput] = useState({ username: '', city: '' });

 // handler for adding a new user
 const addUser = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            username: signInInput.username,
            city: signInInput.city
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        setSignInInput({ username: '', city: '' }); 
         
      }
    } catch (error) {
      console.error('Error adding individual:', error);
    }
  };

  const handleChange = (e) => {
    setSignInInput({
      ...signInInput,
      [e.target.name]: e.target.value,
    });
  };

  
  return (
    <form onSubmit={addUser}>
    <input
      type="text"
      name="username"
      value={signInInput.username}
      onChange={handleChange}
      placeholder="Enter username"
      required
    />
    <input
      type="text"
      name="city"
      value={signInInput.city}
      onChange={handleChange}
      placeholder="Enter favorite city"
      required
    />
    <button type="submit">Sign Up</button>
  </form>
  );
};

export default SignUp;