const axios = require('axios');
const express = require('express');
const router = express.Router();const checkBook = require('../checkBook')
const multer  = require('multer')
const path = require('path');
const allowTypes = [
    '.PDF',
    '.DOC',
    '.DOCX',
    '.DJVU',
    '.DJVU',
    '.FB2',
    '.EPUB',
    '.MOBI',
    '.TXT',
    '.RTF',
]

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.parse(file.originalname).ext)
    }
})

const fileFilter = function(req, file, cb) {
    if (allowTypes.indexOf(path.parse(file.originalname).ext.toUpperCase()) !== -1) {
        return cb(null, true);
    }
    return cb(new Error('Данный формат файла не поддерживается!'));
}
const upload = multer({ storage : storage, fileFilter : fileFilter }).single('fileBook')

router.get('/', (req, res) => {
    res.render("index", {
        title: "Главная",
    });
});

router.get('/books', async (req, res) => {
    const {data : books} = await axios('http://localhost:3500/api/books')
    
    res.render("books/index", {
        title: "Список книг",
        books
    });
    
});

router.get('/books/update/:id', async (req, res) => {
    const {data : book} = await axios(`http://localhost:3500/api/books/${req.params.id}`)
    res.render("books/update", {
        title: "Изменить книгу",
        book
    });
});

router.post('/books/update/:id', async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    res.redirect('/api/books/' + req.params.id)
});

router.get('/books/:id', async (req, res) => {
    
    const {data : book} = await axios(`http://localhost:3500/api/books/${req.params.id}`)
    res.render("books/view", {
        title: "Книга",
        book
    });
});

module.exports = router;