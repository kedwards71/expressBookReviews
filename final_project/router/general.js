const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


const getAllBooks = async() =>{
    return await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('All books found!');
        },200)   
    }).then((successMessage)=>{
        console.log(successMessage);
        return books;
    }).catch(err=>console.error(err))
}

const getBooksByISBN = async(isbn) => {
    let exists = false;
    return await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(books[isbn])
            {
                exists = true;
                resolve('Target Isbn found!\n')
            }
            else
            {
                resolve('Target Isbn not found!\n')
            }
        },200)
    }).then((successMessage)=>{
        console.log(successMessage);
        if(exists)
            return books[isbn];
    })
}

const getBooksByAuthor = async(targetAuthor) => {
    let filteredBooks = [];
    return await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            for(i in books)
            {
                if(books[i].author === targetAuthor)
                    filteredBooks.push(books[i]);
            }
            if(filteredBooks.length>0)
            {
                resolve('Books by target found!')
            }
            else{
                resolve('No books found!')
            }
        },200)
    }).then((successMessage)=>{
        console.log(successMessage);
        return filteredBooks;
    }).catch(err=>console.error(err))
}

const getBooksByTitle = async(targetTitle) =>{
    let filteredBooks = [];
    return await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            for(i in books)
            {
                if(books[i].title === targetTitle)
                    filteredBooks.push(books[i]);
            }
            if(filteredBooks.length>0)
            {
                resolve('Books by target found!')
            }
            else{
                resolve('No books found!')
            }
        },200)
    }).then((successMessage)=>{
        console.log(successMessage);
        return filteredBooks;
    }).catch(err=>console.error(err))
}

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
  const bookList = await getAllBooks();
  return res.status(200).send(`This is the list of all books:\n${JSON.stringify(bookList,null,4)}`);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const bookList = await getBooksByISBN(req.params.isbn);
  if(bookList)
    res.status(200).send(`Here is the book with the isbn of ${JSON.stringify(bookList,null,4)}:\n`);
   else
    res.status(404).json({message:'Book with that isbn not found'});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const bookList = await getBooksByAuthor(req.params.author);
  if(bookList.length>0)
    return res.status(200).send(`These are the books made by the author ${req.params.author}:\n${JSON.stringify(bookList,null,4)}\n`);
  else
    return res.status(404).json({message:'Books by that author not found'});

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const bookList = await getBooksByTitle(req.params.title);
  if(bookList.length>0)
    return res.status(200).send(`These are the books made by the title ${req.params.title}:\n${JSON.stringify(bookList,null,4)}\n`);
  else
    return res.status(404).json({message:'Books by that title not found'});
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here

  const bookList = await getBooksByISBN(req.params.isbn);
  if(bookList){
    if(bookList.review)
      res.status(200).send(`Here is the review for the book with the isbn of ${JSON.stringify(bookList.review,null,4)}:\n`);
    else
       res.status(200).send('No reviews for this book yet\n');
  }
   else
    res.status(404).json({message:'Book with that isbn not found'});
});

module.exports.general = public_users;
