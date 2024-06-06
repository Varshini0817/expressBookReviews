const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password)
  {
    if(!isValid(username)){
        users.push({"username":username, "password":password});
        return res.status(200).json({message:"User successfully regeistered!"})
    }
    else{
        return res.status(404).json({message: "User already exists!"});
    }
}
    return res.status(404).json({message: "Unable to get details"})
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
  res.send(books[isbn]);
  }
  else{
    res.send("Book not found")
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
    if (book.author === author) {
      booksByAuthor.push(book);
    }
  });

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
        
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];

  Object.keys(books).forEach(key => {
    const book = books[key];
    if (book.title === title) {
      booksByTitle.push(book);
    }
  });

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});   
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn  = req.params.isbn;
  if(books[isbn])
    {
        const book = books[isbn]
        res.send(book.reviews)
    }
    else{
        res.send(`Book with isbn ${isbn} not found`)
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

