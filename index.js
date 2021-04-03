require('dotenv').config()
const express = require("express");
const axios = require("axios")
const app = express();
const generateUniqueId = require('generate-unique-id');
const checkBook = require('./checkBook.js')
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(bodyParser.json())
app.use(cors());
const PORT = process.env.PORT || 3000;

// Получение списка книг в books
const books = [];
(async () => {
    const {data} = await axios.get('http://api.itbook.store/1.0/search/new')
    data.books.map(book => {
        newBook = {
            id: generateUniqueId(),
            title: book.title,
            description: book.subtitle,
            authors: "Какие-то авторы",
            favorite: "фавориты",
            fileCover: book.url,
            fileName: "имяфайла"
          }
        books.push(newBook)
    })
})()

app.get('/api/books', function(req, res) {
    res.status(200).json(books)
})

app.get('/api/books/:id', function(req, res) {
    const book = books.find(item => item.id == req.params.id)
    if(!book) {
        res.status(404).json({
            success: false,
            errors: ['Книга не найдена']
        })
        return
    }
    res.status(200).json(book)
})

app.post('/api/books', function(req, res) {
    const check = checkBook(req.body)
    if(check.length) {
        res.status(500).json({
            success: false,
            errors: check
        })
        return
    }

    const newBook = {
        id: generateUniqueId(),
        title: req.body.title,
        description: req.body.description,
        authors: req.body.authors,
        favorite: req.body.favorite || 'Нет',
        fileCover: req.body.fileCover || 'Загрузим позже',
        fileName: req.body.fileCover || 'fileName'
    }
    books.push(newBook)
    res.status(200).json({
        success: true,
        newBook
    })
})

app.put('/api/books/:id', function(req, res) {
    const book = books.find(item => item.id == req.params.id)
    if(!book) {
        res.status(404).json({
            success: false,
            errors: ['Книга не найдена']
        })
        return
    }
    book.title = req.body.title || book.title
    book.description = req.body.description || book.description
    book.authors = req.body.authors || book.authors
    book.favorite = req.body.favorite || book.favorite
    book.fileCover = req.body.fileCover || book.fileCover
    book.fileName = req.body.fileName || book.fileName
    res.status(200).json({
        success: true,
        book
    })
})

app.delete('/api/books/:id', function(req, res) {
    const bookIndex = books.findIndex(item => item.id == req.params.id)
    if(bookIndex === -1) {
        res.status(404).json({
            success: false,
            errors: ['Книга не найдена']
        })
        return
    }
    books.splice(bookIndex, 1)
    res.status(200).json('ok')
})

app.post('/api/user/login', function(req, res) {
    res.status(201).json({ id: 1, mail: "test@mail.ru" })
})

app.listen(PORT, ()=> {
    console.log(`Listening port ${PORT}`)
});