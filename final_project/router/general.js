const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const newUser = {
    "username" : req.body.username,
    "password" : req.body.password
  }
  if(!newUser.username||!newUser.password){
    return res.send('Please fill out both fields');
  }
  else{
    const filteredUsers = users.filter((user)=>user.username === newUser.username);
    if(filteredUsers.length > 0)
    {
        return res.send(`${newUser.username} is already taken please try again!\n`);
    }
    else
    {
        users.push(newUser);
        return res.send(`${newUser.username} has been successfully registered you can now log in!\n`)
    }
  }
});

//  View users
public_users.get('/users',function(req,res){
    res.send(JSON.stringify(users,null,4))
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const targetIsbn = req.params.isbn;
  if(books[targetIsbn]){
    res.send(`This is the information for ${targetIsbn}:\n${JSON.stringify(books[targetIsbn],null,4)}\n`);
  }
  else{
    res.send("This is not a valid isbn\n");
    return;
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const targetAuthor = req.params.author;
    const filteredBooks = [];
    for(i in books){
        if(books[i].author ===  targetAuthor){
            filteredBooks.push(books[i]);
        }
    }
    if(filteredBooks.length>0)
    {
        return res.send(`These are the books made by the author ${targetAuthor}:\n${JSON.stringify(filteredBooks,null,4)}\n`);
    }
    else{
       return res.send("We do not have any books by that author.\n");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const targetTitle = req.params.title;
  const filteredBooks = [];
  for(i in books){
    if(books[i].title === targetTitle){
        filteredBooks.push(books[i]);
    }
  }
  if(filteredBooks.length>0){
    return res.send(`These are the books with the following title ${targetTitle}:\n ${JSON.stringify(filteredBooks,null,4)}`);
  }
  else{
    return res.send("We do not have any books with that title.\n");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const targetIsbn = req.params.isbn;
  if(books[targetIsbn])
  {
    return res.send(`This is the review listed for book ${targetIsbn}:\n${JSON.stringify(books[targetIsbn].reviews,null,4)}\n`)
  }
  else{
    return res.send('There are no books with that ISBN.\n')
  }
});

module.exports.general = public_users;
