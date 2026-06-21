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
                data : loginCredentials.password,
            }, 'access',{expiresIn:60*60});

            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send(`Welcome ${loginCredentials.username}\t${req.session.authorization.accessToken}\n`);
        }
        else
            return res.status(208).json({message:"Invalid login check username and password again"});
    }
    else{
        return res.send("No users exist by that name\n")
    }
  }
});

regd_users.get("/auth/viewall",(req,res)=>{
    res.send(req.session.username)
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
