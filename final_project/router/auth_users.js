const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        if (authenticatedUser(username, password)) {
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });

            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).json({ message: "Successfully logged in as " + username });
        } else {
            return res.status(400).json({ message: "Invalid Login. Check Username and Password" });
        }
    } else {
        return res.status(400).json({ message: "Username or Password Can Not Be Blank" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (req.params.isbn && req.body.review) {
        if (books[req.params.isbn]) {
            if (books[req.params.isbn].reviews[req.session.authorization.username]) {
                books[req.params.isbn].reviews[req.session.authorization.username] = req.body.review;
                return res.status(200).json({ message: "Successfully Edited Existing Review For " + books[req.params.isbn].title })
            } else {
                books[req.params.isbn].reviews[req.session.authorization.username] = req.body.review;
                return res.status(200).json({ message: "Successfully Created A New Review For " + books[req.params.isbn].title })
            }
        } else {
            return res.status(400).json({ message: "Invalid ISBN Provided" })
        }
    } else {
        return res.status(400).json({ message: "No ISBN or Review Provided" })
    }
});

// Deletes a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (req.params.isbn) {
        if (books[req.params.isbn]) {
            if (books[req.params.isbn].reviews[req.session.authorization.username]) {
                delete books[req.params.isbn].reviews[req.session.authorization.username]
                return res.status(200).json({ message: "Successfully deleted your review for " + books[req.params.isbn].title })
            } else {
                return res.status(400).json({ message: "No Review Found" })
            }
        } else {
            return res.status(400).json({ message: "Invalid ISBN Provided" })
        }
    } else {
        return res.status(400).json({ message: "No ISBN Provided" })
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
