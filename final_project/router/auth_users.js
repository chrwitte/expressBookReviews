const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username exists in the users array
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)) {
    let token = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { token, username };
    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization["username"];
  let book = books.find((book) => book.isbn === isbn);

  if (book) {
    let existingReview = book.reviews.find((r) => r.user === username);
    if (existingReview) {
      existingReview.review = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      book.reviews.push({ user: username, review: review });
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
