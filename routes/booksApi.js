const express = require('express');
const axios = require("axios")
const generateUniqueId = require('generate-unique-id');
const router = express.Router();
const checkBook = require('../checkBook')
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

// Получение списка книг в books
const books = [];
(async () => {
    let data
    try {
        data = await axios.get('http://api.itbook.store/1.0/search/new')
        data.data.books.map(book => {
            newBook = {
                id: generateUniqueId(),
                title: book.title,
                description: book.subtitle,
                authors: "Какие-то авторы",
                favorite: "фавориты",
                fileCover: book.url,
                fileName: "имяфайла",
                fileBook: "asd"
              }
            books.push(newBook)
        })
    } catch (error) {
        newBook = {
            id: generateUniqueId(),
            title: 'book.title',
            description: 'book.subtitle',
            authors: "Какие-то авторы",
            favorite: "фавориты",
            fileCover: 'book.url',
            fileName: "имяфайла",
            fileBook: "asd"
          }
        books.push(newBook)
    }
})()

router.get('/', (req, res) => {
    res.status(200).json(books)
});

router.get('/:id', (req, res) => {
    const book = books.find(item => item.id == req.params.id)
    if(!book) {
        res.status(404).json({
            success: false,
            errors: ['Книга не найдена']
        })
        return
    }
    res.status(200).json(book)
});

router.get('/:id/download', (req, res) => {
    const book = books.find(item => item.id == req.params.id)
    if(!book) {
        res.status(404).json({
            success: false,
            errors: ['Книга не найдена']
        })
        return
    }
    res.download(book.fileCover, book.fileName)
});

router.post('/', (req, res) => {
    upload(req, res, function(err) {
        if(err) {
            return res.end(err.message);
        }
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
            fileCover: req.file ?  req.file.path : '',
            fileName: req.file.originalname
        }
        books.push(newBook)
        res.status(200).json({
            success: true,
            newBook
        })

    })
    
});

router.put('/:id', (req, res) => {
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
});

router.delete('/:id', (req, res) => {
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
});

module.exports = router;