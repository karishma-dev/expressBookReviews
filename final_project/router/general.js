const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const { username, password } = req.body;
	if (username && password) {
		if (isValid(username)) {
			users.push({ username, password });
			return res.status(200).json({ message: "User registered successfully" });
		}
		return res.status(400).json({ message: "User already exists" });
	}
	return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
	new Promise((resolve, reject) => {
		if (books) {
			resolve(books);
		} else {
			reject("Empty Data");
		}
	})
		.then((books) => {
			return res.status(200).json(books);
		})
		.catch((error) => {
			return res.status(300).json({ message: error });
		});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
	const isbn = req.params.isbn;

	new Promise((resolve, reject) => {
		if (books) {
			const book = Object.values(books).filter((book) => book.isbn === isbn);
			if (book.length > 0) {
				resolve(book);
			} else {
				reject("Book not found");
			}
		} else {
			reject("Empty Data");
		}
	})
		.then((book) => {
			return res.status(200).json(book);
		})
		.catch((error) => {
			return res.status(300).json({ message: error });
		});
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
	const author = req.params.author;
	new Promise((resolve, reject) => {
		if (books) {
			const book = Object.values(books).filter((book) =>
				book.author.includes(author)
			);
			if (book.length > 0) {
				resolve(book);
			} else {
				reject("Book not found");
			}
		} else {
			reject("Empty Data");
		}
	})
		.then((book) => {
			return res.status(200).json(book);
		})
		.catch((error) => {
			return res.status(300).json({ message: error });
		});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title;
	new Promise((resolve, reject) => {
		if (books) {
			const book = Object.values(books).filter((book) =>
				book.title.includes(title)
			);
			if (book.length > 0) {
				resolve(book);
			} else {
				reject("Book not found");
			}
		} else {
			reject("Empty Data");
		}
	})
		.then((book) => {
			return res.status(200).json(book);
		})
		.catch((error) => {
			return res.status(300).json({ message: error });
		});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	const book = Object.values(books).filter((book) => book.isbn === isbn);
	if (book.length > 0) {
		return res.status(200).json(book[0].reviews);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

module.exports.general = public_users;
