const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js"); // 書籍データを取得
let users = []; // 登録済みユーザー

const authenticated = express.Router();

// ユーザー検証関数
const isValid = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// **タスク 7: ログインエンドポイント**
authenticated.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 入力が不足している場合のエラー
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // ユーザー認証
    if (isValid(username, password)) {
        // JWT トークンを生成
        const accessToken = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        req.session.authorization = { accessToken, username }; // セッションに保存
        return res.status(200).json({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// **タスク 8: 書籍レビューの追加または修正**
authenticated.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // セッションからユーザー名を取得
    const username = req.session.authorization?.username;
    if (!username) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const book = books[isbn];
    if (book) {
        if (!book.reviews) book.reviews = {};

        // レビューを追加または修正
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// **タスク 9: 書籍レビューの削除**
authenticated.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // セッションからユーザー名を取得
    const username = req.session.authorization?.username;
    if (!username) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const book = books[isbn];
    if (book && book.reviews && book.reviews[username]) {
        // 自分のレビューを削除
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found or not authorized to delete" });
    }
});

module.exports = { authenticated, isValid, users };
