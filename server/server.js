import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv"

import pkg from 'pg';

//use .env for variables
dotenv.config();


const { Pool } = pkg;
const db = new Pool({ 
    connectionString: process.env.DATABASE_URI
  });

const app = express();
const PORT = process.env.PORT;

//config cors middleware
app.use(cors());

//config  body-parser middlerware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//const urlencodedParser = bodyParser.urlencoded({ extended: false })


//create route for test "homepage" or "root"
app.get('/', (req, res) => {
    res.json("My get route is working")
    console.log("Hello World!")
})

//create test route for openweather api
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;
    
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch { //include error catching
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

//enppoint for full contact list
app.get('/search', async (req, res) => {
    try{
        const { input } = req.query
        if (!input) {
            return res.status(400).json({ error: 'Search input is required' });
          }
        const searchQuery = `SELECT users.id, users.username, favorites.city FROM users LEFT JOIN favorites ON users.id = favorites.user_id WHERE username LIKE $1`
        const searchInput = `%${input}%`
        const result = await db.query(searchQuery, [searchInput]);

        if (result.rows.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows)

       
    } catch (e) {
        res.status(500).send({error: 'Error fetching user data',
            message: e.message,
            operation: 'GET /search'
          });
    }
})

app.put(`/api/favorite-city/:userId`, async (req, res) => {
    const { cityName } = req.body;  
    const { userId } = req.params;  
    try {
      await db.query('UPDATE favorites SET city = $1 WHERE user_id = $2', [cityName, userId]);
      res.status(200).send('Favorite city updated');
    } catch (err) {
        res.status(500).send({error: 'Error updating favorite city',
            message: e.message,
            operation: 'PUT /api/favorite-city/:userId'
          });
    }
  });

  app.get(`/api/favorite-city/:userId`, async (req, res) => {
    const { userId } = req.params;
    
    try {
      const result = await db.query('SELECT city FROM favorites WHERE user_id = $1', [userId]);
      if (result.rows.length > 0) {
        res.json({ city: result.rows[0].city });
      } else {
        res.json({ city: null });
      }
    } catch (error) {
      console.error('Error fetching favorite city:', error);
      res.status(500).send({error: 'Error fetching favorite city',
        message: e.message,
        operation: 'GET /api/favorite-city/:userId'
      });
    }
  });
  

  //post request to add new user
  app.post('/api/users', async (req, res) => {
    const { username, city } = req.body;
  
    //validation
    if (!username || !city) {
      return res.status(400).json({ error: 'Username and city are required' });
    }
  
    try {
        //insert in uesr table
      const result = await db.query(
        'INSERT INTO users (username) VALUES ($1 ) RETURNING id, username',
        [username]
      );
      const newUser = result.rows[0];
    
    //insert in favorite table using newUser id
      const favoriteResult = await db.query(
        'INSERT INTO favorites (user_id, city) VALUES ($1, $2) RETURNING id, city',
        [newUser.id, city]
      );
  
      const newFavorite = favoriteResult.rows[0];
      //get response for both
      res.status(201).json({
        user: newUser,
        favorite: newFavorite
      });

    } catch (error) {
      console.error('Error inserting new user:', error);
      res.status(500).json({ error: 'Failed to create user',
        message: e.message,
        operation: 'POST /api/users'
       });
    }
  });


app.listen(PORT, () => console.log(`Server is runnning on port http://localhost:${PORT}`))
