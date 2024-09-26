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
        res.json(result.rows)
    } catch (e) {
        return res.status(404).json({error: 'Contact not found'})
    }
})

app.put(`/api/favorite-city/:userId`, async (req, res) => {
    const { cityName } = req.body;  
    const { userId } = req.params;  
    try {
      await db.query('UPDATE favorites SET city = $1 WHERE user_id = $2', [cityName, userId]);
      res.status(200).send('Favorite city updated');
    } catch (err) {
      res.status(500).send('Error updating favorite city');
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
    } catch (err) {
      console.error('Error fetching favorite city:', err);
      res.status(500).send('Error fetching favorite city');
    }
  });
  
  


app.listen(PORT, () => console.log(`Server is runnning on port http://localhost:${PORT}`))
