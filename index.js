require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const router = express.Router();
const indexRoute = require('./routes/index')
const booksApi = require('./routes/booksApi')
const userApi = require('./routes/userApi')

  
app.use(bodyParser.json())
app.use(cors());

app.use(router)

router.use('/', indexRoute)
router.use('/api/books', booksApi)
router.use('/api/user', userApi)

app.listen(PORT, ()=> {
    console.log(`Listening port ${PORT}`)
});