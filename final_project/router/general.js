const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req,res) => {
  //Write your code here
  return new Promise((resolve,reject)=>{

      const newUser = {
        "username" : req.body.username,
        "password" : req.body.password
      }
      if(!newUser.username||!newUser.password){
        resolve('Invalid register attempt');
        return res.send('Please fill out both fields');
      }
      else{
        const filteredUsers = users.filter((user)=>user.username === newUser.username);
        if(filteredUsers.length > 0)
        {
            resolve('Name taken');
            return res.send(`${newUser.username} is already taken please try again!\n`);
        }
        else
        {
            resolve(`User ${newUser.username} successfully added.`)
            users.push(newUser);
            return res.send(`${newUser.username} has been successfully registered you can now log in!\n`)
        }
      }
  }).then(successMessage=>{
    console.log("Message from callback "+successMessage);
  })
});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{
      resolve('List of books found!');
      return res.send(JSON.stringify(books,null,4));
  }).then(successMessage=>{
    console.log('Message from callback '+successMessage)
  }).catch((err)=>console.error(err))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{

      const targetIsbn = req.params.isbn;
      if(books[targetIsbn]){
        resolve(`Isbn found!`);
        res.send(`This is the information for ${targetIsbn}:\n${JSON.stringify(books[targetIsbn],null,4)}\n`);
      }
      else{
        resolve(`Isbn not found!`)
        res.send("This is not a valid isbn\n");
        return;
      }
  }).then((successMessage)=>{
    console.log("Message from callback "+successMessage)
  }).catch((err)=>console.error(err))
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{
      const targetAuthor = req.params.author;
        const filteredBooks = [];
        for(i in books){
            if(books[i].author ===  targetAuthor){
                filteredBooks.push(books[i]);
            }
        }
        if(filteredBooks.length>0)
        {
            resolve(`Books by author ${targetAuthor} found!`)
            return res.send(`These are the books made by the author ${targetAuthor}:\n${JSON.stringify(filteredBooks,null,4)}\n`);
        }
        else{
            resolve(`No books by author ${targetAuthor} found!`)
           return res.send("We do not have any books by that author.\n");
        }
  }).then((successMessage)=>{
    console.log('Message from callback' + successMessage);
  }).catch((err)=>console.error(err))
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{
      const targetTitle = req.params.title;
      const filteredBooks = [];
      for(i in books){
        if(books[i].title === targetTitle){
            filteredBooks.push(books[i]);
        }
      }
      if(filteredBooks.length>0){
        resolve(`Books with the title ${targetTitle} found!`);
        return res.send(`These are the books with the following title ${targetTitle}:\n ${JSON.stringify(filteredBooks,null,4)}`);
      }
      else{
        resolve(`No books with the title ${targetTitle} found!`);
        return res.send("We do not have any books with that title.\n");
      }
  }).then(successMessage=>{
    console.log('Message from callback '+successMessage);
  })
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here

  return new Promise((resolve,reject)=>{
      const targetIsbn = req.params.isbn;
      if(books[targetIsbn])
      {
        resolve(`Reviews for ${targetIsbn} found!`);
        return res.send(`This is the review listed for book ${targetIsbn}:\n${JSON.stringify(books[targetIsbn].reviews,null,4)}\n`)
      }
      else{
        resolve(`No reviews for ${targetIsbn} found!`)
        return res.send('There are no books with that ISBN.\n')
      }
  }).then(successMessage =>{
    console.log('Message from callback '+successMessage)
  }).catch((err)=>console.error(err))
});

module.exports.general = public_users;
