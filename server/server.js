import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

//use .env for variables
//dotenv.config();

const app = express();
const PORT = 8080;

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



app.listen(PORT, () => console.log(`Server is runnning on port http://localhost:${PORT}`))
