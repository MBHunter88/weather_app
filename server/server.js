import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv"


//use .env for variables
dotenv.config();

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


app.listen(PORT, () => console.log(`Server is runnning on port http://localhost:${PORT}`))
