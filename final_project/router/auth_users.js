const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
    { username: "user3", password: "password3" },
];


const isValid = (username) => { // returns boolean
// Write code to check is the username is valid
    let userAlreadyExists = users.filter((user)=>{
        return user.username === username
        });

        return userAlreadyExists.length > 0;
    }


const authenticatedUser = (username, password) => { // returns boolean
// Write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
    });

    return validusers.length > 0
}


// Only registered users can login
regd_users.post("/login", (req,res) => {
    // Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data:password}, "access", {expiresIn: 60*60});
        req.session.authorization = {accessToken,username};
        return res.status(200).send("User successfully logged in");
    }
    else {
        return res.status(208).json({message: "Invalid username or password"});
    }
});


// Post a review
regd_users.put("/auth/review/:isbn", (req, res) => {
// Write your code here
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review has been posted successfully");
    }
    else {
        return res.status(404).json({message: `ISBN: ${isbn} was not found`});
    }
});


// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send(`${username}'s review has been deleted`);
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
