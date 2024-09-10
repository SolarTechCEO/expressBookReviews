const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    if (req.body.username && req.body.password) {
        if (!isValid(req.body.username)) {
            users.push({ "username": req.body.username, "password": req.body.password })
            return res.json({ message: "Successfully Created " + req.body.username })
        } else {
            return res.status(400).json({ message: "User Already Exists" })
        }
    } else {
        return res.status(400).json({ message: "Username or Password Can Not Be Blank" })
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    if (req.params.isbn) {
        if (books[req.params.isbn]) {
            return res.send(JSON.stringify(books[req.params.isbn]))
        } else {
            return res.status(400).json({ message: "Invalid ISBN Provided" })
        }
    } else {
        return res.status(400).json({ message: "No ISBN Provided" })
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let booksData = [];

    if (req.params.author) {
        Object.entries(books).filter(book => book.forEach(b => { if (b.author === req.params.author) booksData.push(b) }));
        if (booksData.length == 0) {
            return res.status(400).json({ message: "No Books Found with Provided Author" })
        } else {
            return res.send(JSON.stringify(booksData))
        }
    } else {
        return res.status(400).json({ message: "No Author Provided" })
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let booksData = [];

    if (req.params.title) {
        Object.entries(books).filter(book => book.forEach(b => { if (b.title === req.params.title) booksData.push(b) }));
        if (booksData.length == 0) {
            return res.status(400).json({ message: "No Books Found with Provided Title" })
        } else {
            return res.send(JSON.stringify(booksData))
        }
    } else {
        return res.status(400).json({ message: "No Title Provided" })
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    if (req.params.isbn) {
        if (books[req.params.isbn]) {
            return res.send(JSON.stringify(books[req.params.isbn].reviews))
        } else {
            return res.status(400).json({ message: "Invalid ISBN Provided" })
        }
    } else {
        return res.status(400).json({ message: "No ISBN Provided" })
    }
});

module.exports.general = public_users;
