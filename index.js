require("dotenv").config();


const express = require("express");

const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Microservices Routes
const Books= require("./API/Book");

// Initialization
const booky = express();

//Configuration
booky.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true}
  )
  .then(() => console.log("connection established!!!!!!!"));

  //Initializing Microservices
   booky.use("/book", Books);

booky.listen(3000, () => console.log("Hey server is running!"));