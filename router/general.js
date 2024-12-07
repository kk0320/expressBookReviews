const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Promiseを使用して本のデータを取得する関数
function getBooks() {
    return new Promise((resolve, reject) => {
        if (Object.keys(books).length > 0) {
            resolve(books);
        } else {
            reject({ message: "No books available" });
        }
    });
}

// タスク10: 全ての本のリストを取得
public_users.get('/', async (req, res) => {
    try {
        const bookList = await getBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json(error);
    }
});

// タスク11: ISBNに基づいて本の詳細を取得
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const bookList = await getBooks();
        if (bookList[isbn]) {
            res.status(200).json(bookList[isbn]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// タスク12: 著者に基づいて本の詳細を取得
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const bookList = await getBooks();
        const filteredBooks = Object.values(bookList).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// タスク13: タイトルに基づいて本の詳細を取得
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const bookList = await getBooks();
        const filteredBooks = Object.values(bookList).filter(book => book.title === title);
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports.general = public_users;
