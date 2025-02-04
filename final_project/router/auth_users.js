const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
	{
		username: "customer",
		password: "password",
	},
];

const isValid = (username) => {
	let filteredusernames = users.filter((user) => {
		return user.username === username;
	});

	if (filteredusernames.length < 0) {
		return false;
	} else {
		return true;
	}
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let user = users.find((user) => {
		return user.username === username && user.password === password;
	});
	if (user) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	if (authenticatedUser(username, password)) {
		const token = jwt.sign({ username }, "fingerprint_customer", {
			expiresIn: 60 * 60 * 6000 * 6000,
		});
		req.session.authorization = {
			token: token,
			username,
		};
		return res.status(200).json({ message: "Login successful", token: token });
	}

	return res.status(401).json({ message: "Invalid credentials" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
	const { isbn } = req.params;
	const { review } = req.body;
	const { username } = req.session.authorization;

	const book = Object.values(books).filter((book) => book.isbn === isbn);

	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}
	book[0].reviews[username] = review;

	return res.status(200).json({ message: "Review added/Updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const { isbn } = req.params;
	const { username } = req.session.authorization;

	const book = Object.values(books).filter((book) => book.isbn === isbn);

	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}
	if (!book[0].reviews || Object.keys(book[0].reviews).length === 0) {
		return res.status(404).json({ message: "Review not found" });
	}
	const hasSameUserReview = Object.keys(book[0].reviews).includes(username);
	console.log(Object.keys(book[0].reviews).includes(username));
	if (!hasSameUserReview) {
		return res.status(404).json({ message: "Review not found" });
	}

	delete book[0].reviews[username];

	return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
