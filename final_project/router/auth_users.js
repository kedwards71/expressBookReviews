const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')

const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const filteredUsers = users.filter((user)=>user.username === username);
    if(filteredUsers.length > 0)
        return true;
    else
        return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const filteredUsers = users.filter((user) => user.username === username && user.password === password);
    if(filteredUsers.length > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

regd_users.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const loginCredentials = {
    "username":req.body.username,
    "password":req.body.password
  }
  if(!loginCredentials.username||!loginCredentials.password)
  {
    return res.send('Please fill out all the fields!\n');
  }
  else{
    if(isValid(loginCredentials.username)){
        if(authenticatedUser(loginCredentials.username,loginCredentials.password))
        {
            const username = loginCredentials.username;

            let accessToken = jwt.sign({
                data : loginCredentials.username,
            }, 'access',{expiresIn:60*60});

            req.session.authorization = {
                accessToken, username
            }
            console.log(accessToken);
            return res.status(200).send({message:"The login was successful"});
        }
        else
            return res.status(208).json({message:"Invalid login check username and password again"});
    }
    else{
        return res.status(404).json("No users exist by that name\n")
    }
  }
});


regd_users.get("/auth/viewall",(req,res)=>{
    res.send(req.user)
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const targetIsbn = req.params.isbn;
  if(books[targetIsbn])
  {
    if(isValid(req.user))
    {
        if(books[targetIsbn].reviews[req.user])
        {
            const prevReview = books[targetIsbn].reviews[req.user];
            books[targetIsbn].reviews[req.user] = req.query.review;
            return res.status(200).send(`Your review has been updated from '${prevReview}' to '${books[targetIsbn].reviews[req.user]}'\n`)
        }
        else{
            books[targetIsbn].reviews[req.user] = req.query.review;
            return res.status(200).send(`Your review of '${books[targetIsbn].reviews[req.user]}' has been successfully left.\n`);
        }
    } else {
        return res.status(403).json({message:'You need to be registered and logged in to leave a review!'});
    }
  }else{
    return res.status(404).json({message:'The book with that ISBN doesnt exist in our records'})
  }
});

// Delete a review
regd_users.delete('/auth/review/:isbn',(req,res) =>{
    const targetIsbn = req.params.isbn;
    if(books[targetIsbn])
    {
        if(isValid(req.user))
        {
            if(books[targetIsbn].reviews[req.user])
            {
                delete books[targetIsbn].reviews[req.user];
                return res.status(200).send('Your review was successfully deleted.')
            }
            else{
                return res.status(404).json({message:'There is no review for this user.'});
            }

        }
        else{
            return res.status(403).json({message:'You need to be registed and logged in to delete one of your reviews!'});
        }

    }else{
        return res.status(404).json({message:'The book with that ISBN doesnt exist in our records!'});
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
