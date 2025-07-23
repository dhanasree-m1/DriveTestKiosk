import express from 'express'

// import mongoose for creating a session store to save sessions

import mongoose from 'mongoose'

// import MongoStore to store the sessions in mongodb

import MongoStore from 'connect-mongo'

// import session from express-session

import session from 'express-session'

// import router to use in middleware

import router from './routes/routes.js'
global.loggedIn = null
global.loggedInType=""
global.loggedInId=""
global.licenseno=''

const uri="mongodb+srv://dhanasree01:Mongo123@cluster0.umw1frd.mongodb.net/Drive_Test?retryWrites=true&w=majority"
const app = express()
const sessionStore = MongoStore.create({
  mongoUrl : uri,
  dbName : "Drive_Test",
  collectionName : "UserSessions"
})


app.use(session({

  secret : "A very Secret Key",
  resave : false ,
  saveUninitialized : false ,
  store : sessionStore


}))

// for using public folder for static resources

app.use(express.static('public'))

// set the view engine as ejs to use ejs files

app.set('view-engine','ejs')

// in order to get the form data from request body

app.use(express.urlencoded({extended:true}))
// const path = require("path");
app.listen(8000, () => {
  console.log("Sever is listening at port 8000");
});

app.use("*", (req, res, next) => {
loggedIn = req.session.isValid;
loggedInType=req.session.user_type;
loggedInId=req.session.user_id;

next()
});

app.use('/',router)






