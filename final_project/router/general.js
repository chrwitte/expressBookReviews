const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Function to fetch books
function fetchBooks() {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Error fetching books");
    }
  });
}

// Get the book list available in the shop using Promise callbacks
public_users.get("/", function (req, res) {
  fetchBooks()
    .then((fetchedBooks) => {
      res.status(200).json(fetchedBooks);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Function to fetch book by ISBN
function fetchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
}

// Get book details based on ISBN using Promise callbacks
public_users.get("/isbn/:isbn", function (req, res) {
  fetchBookByISBN(req.params.isbn)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Function to fetch book by author
function fetchBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    const book = Object.values(books).find((book) => book.author === author);
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
}

// Get book details based on author using Promise callbacks
public_users.get("/author/:author", function (req, res) {
  fetchBookByAuthor(req.params.author)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Function to fetch book by title
function fetchBookByTitle(title) {
  return new Promise((resolve, reject) => {
    const book = Object.values(books).find((book) => book.title === title);
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
}

// Get all books based on title using Promise callbacks
public_users.get("/title/:title", function (req, res) {
  fetchBookByTitle(req.params.title)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Function to fetch book reviews
function fetchBookReviews(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book.reviews);
    } else {
      reject("Book not found");
    }
  });
}

// Get book reviews using Promise callbacks
public_users.get("/review/:isbn", function (req, res) {
  fetchBookReviews(req.params.isbn)
    .then((reviews) => {
      res.status(200).json(reviews);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;
