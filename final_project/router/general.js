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
    let bookPromise = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books));
    })

    bookPromise.then((msg) => {
        return res.send(msg)
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let findBook = new Promise((resolve, reject) => {
        if (req.params.isbn) {
            if (books[req.params.isbn]) {
                resolve(JSON.stringify(books[req.params.isbn]))
            } else {
                reject("Invalid ISBN Provided")
            }
        } else {
            reject("No ISBN Provided")
        }
    })

    findBook.then((msg) => {
        return res.send(msg)
    }).catch(reject => {
        return res.status(400).json({ message: reject })
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let findBookByAuthor = new Promise((resolve, reject) => {
        let booksData = [];

        if (req.params.author) {
            Object.entries(books).filter(book => book.forEach(b => { if (b.author === req.params.author) booksData.push(b) }));
            if (booksData.length == 0) {
                reject("No Books Found with Provided Author")
            } else {
                resolve(JSON.stringify(booksData))
            }
        } else {
            reject("No Author Provided")
        }
    })

    findBookByAuthor.then((msg) => {
        return res.send(msg)
    }).catch(reject => {
        return res.status(400).json({ message: reject })
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let findBookByTitle = new Promise((resolve, reject) => {
        let booksData = [];

        if (req.params.title) {
            Object.entries(books).filter(book => book.forEach(b => { if (b.title === req.params.title) booksData.push(b) }));
            if (booksData.length == 0) {
                reject("No Books Found with Provided Title")
            } else {
                resolve(JSON.stringify(booksData))
            }
        } else {
            reject("No Title Provided")
        }
    })

    findBookByTitle.then((msg) => {
        return res.send(msg)
    }).catch(reject => {
        return res.status(400).json({ message: reject })
    })
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
