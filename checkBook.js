module.exports = function (book) {
    const errors = []
    if(!book.title) errors.push('Заголовок у книги обязателен')
    else if(typeof book.title !== 'string') errors.push('Заголовок должен быть строкой')
    if(!book.description) errors.push('Описание у книги обязательно')
    else if(typeof book.description !== 'string') errors.push('Заголовок должен быть строкой')
    if(!book.description) errors.push('Автор у книги обязательно есть')
    else if(typeof book.description !== 'string') errors.push('Автор должен быть строкой')
    return errors
}