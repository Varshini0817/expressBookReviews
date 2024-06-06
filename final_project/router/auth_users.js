const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

module.exports = {
    users
};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let username_valid = users.filter((user)=>{
    return user.username === username
});
    if (username_valid.length > 0)
    {
        return true
    }
    else{
        return false
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
});
    if(validusers.length>0)
    {
        return true;
    }
    else{
        return false;
    }
}
regd_users.get("/",(req,res)=>{
    res.send(books)
})
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username =req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Error"});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data:password
    }, 'access',{expiresIn : 60*60});
    req.session.authorization ={
        accessToken,username    }
        users.push({username})
    return res.status(200).send("User successfully logged in !");
}else{
    return res.status(208).json({message:"Invalid details!"})
}
  //return res.status(300).json({message: "Yet to be implemented"});
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewNew = req.query.reviews; 
    const username = req.session.authorization.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in to post a review." });
    }

    if (!isbn || !reviewNew) {
        return res.status(400).json({ message: "Provide complete details" });
    }

    let book = books[isbn]; 

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews) {
        book.reviews = {};
    }
    if (book.reviews[username]) {
        book.reviews[username] = reviewNew;
        //return res.status(200).json({ message: "Review successfully modified", books: books });
    } else {
        // Add a new review if the user has not posted a review for this book before
        book.reviews[username] = reviewNew;
        //return res.status(200).json({ message: "Review successfully added", books: books });
    }
return res.send(`The review for the book with ISBN ${isbn} by ${username} has been added/updated`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username =req.session.authorization.username;

    if(!isbn){
        return res.send("Provide complete details")
    }

    const book = books[isbn];

    if(book.reviews[username]){
        delete book.reviews[username];
        books[isbn]=book;
        return res.send(`The book review with ISBN ${isbn} by ${username} is deleted`)
    }
    else{
        return res.status(404).json({message:"Review not found"})
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
