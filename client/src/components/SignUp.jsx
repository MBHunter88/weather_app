import React, {useState} from 'react';


const SignUp = ({ fetchWeather, loggedInUser, setLoggedInUser }) => {
  if (loggedInUser) return null;
  const [signInInput, setSignInInput] = useState({ username: '', city: '' });
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [displayedUsername, setDisplayedUsername] = useState('');

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
        setDisplayedUsername(newUser.username);
        setSignInInput({ username: '', city: '' }); 
        setIsSignedUp(true);
        fetchWeather(newUser.city);
        setLoggedInUser(newUser);
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

   // Conditionally render the form or a success message
   if (isSignedUp) {
    return <p>Sign up successful! Welcome, {displayedUsername}!</p>;
    
  }
  
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