require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const router = express.Router();
const indexRoute = require('./routes/index')
const booksApi = require('./routes/booksApi')
const userApi = require('./routes/userApi');
var multer = require('multer');
var upload = multer();

app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));

app.use(router)
router.use('/', indexRoute)
router.use('/api/books', booksApi)
router.use('/api/user', userApi)

app.listen(PORT, ()=> {
    console.log(`Listening port ${PORT}`)
});