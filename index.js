require("dotenv").config();


const express = require("express");

const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");


// Initialization
const booky = express();

//Configuration
booky.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true}
  )
  .then(() => console.log("connection established!!!!!!!"));



/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route           /is
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/is/:isbn", async (req, res) => {

  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     Get specific books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category", async (req, res) => {

  const getSpecificBook = await BookModel.findOne({category: req.params.category });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /lan
Description     Get specific books based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/

booky.get("/lan/:language", (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.language.includes(req.params.language)
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.language}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author", async(req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
Route           /a
Description     get all authors 
Access          PUBLIC
Parameter       name
Methods         GET
*/

booky.get("/author/:name", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (autname) => autname.name === req.params.name
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No book found for the author ${req.params.name}`
    });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthor });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publications", (req, res) => {
  return res.json({ publications: database.publication });
});

/*
Route           /publications
Description     get specific publications
Access          PUBLIC
Parameter       name
Methods         GET
*/
booky.get("/publications/:name", (req, res) => {
  const getSpecificPublication = database.publication.filter(
    (pubname) => pubname.name === req.params.name
  );

  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No book found for the publicationname ${req.params.name}`
    });
  }

  return res.json({ publication: getSpecificPublication });
});

/*
Route           /publication/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/publications/book/:isbn", (req, res) => {
  const getSpecificPublication = database.publication.filter((pubbook) =>
    pubbook.books.includes(req.params.isbn)
  );

  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No Publication found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificPublication });
});

/*
Route           /book/new
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", async (req, res) => {
  const { newBook } = req.body;

  BookModel.create(newBook);

  return res.json({ message:"book was added" });
});

/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;

  AuthorModeel.create(newAuthor);

  return res.json({message:"author was added" });
});

/*
Route           /publication/add
Description     add new pubication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/publication/add", (req, res) => {
  const { newPublication } = req.body;

  database.publication.push(newPublication);

  return res.json({ publication: database.publication });
});

/*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/book/update/title/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.newBookTitle;
      return;
    }
  });

  return res.json({ books: database.books });
});

/*
Route           /book/update/author
Description     Update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/book/update/author/:isbn/:authorID", (req, res) => {
  //update book databse
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.author.push(parseInt(req.params.authorID));
    }
  });
  //update author database
  database.author.forEach((author) => {
    if (author.id === parseInt(req.params.authorID)) {
      return author.books.push(req.params.isbn);
    }
  });
  return res.json({ books: database.books, author: database.author });
});

/*
Route           /publication/update/
Description     Update publication name
Access          PUBLIC
Parameter       name
Methods         PUT
*/

booky.put("/publication/update/:name", (req, res) => {
  database.publication.forEach((publication) => {
    if (publication.name === req.params.name) {
      publication.name = req.body.newPublicationName;
      return;
    }
  });

  return res.json({ books: database.books });
});

/*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELEte
*/
booky.delete("/book/delete/:isbn", (req, res) => {
  const updateBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updateBookDatabase;
  return res.json({ books: database.books });
});

/*Route         /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameter       isbn, author Id
Methods         DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId",async(req,res)=>{
    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newAuthorList=book.author.filter((author)=>author!==parseInt(req.params.authorId));
            book.author=newAuthorList;
            return;
        }
    });
      //updating the author database
        database.author.forEach((author)=>{
        if(author.id===parseInt(req.params.authorId)){
            const newBooksList=author.books.filter((book)=>book!==req.params.isbn);
            author.books=newBooksList;
            return;
        }
    });

     return res.json({message:"author was deleted!!",book:database.books,author:database.author,});

});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameter       authorid
Methods         DELETE
*/
booky.delete("/author/delete/:authorId", (req,res)=>{
    const updatedAuthorDatabase = database.author.filter((author)=>author.id!==parseInt(req.params.authorId));
    database.author=updatedAuthorDatabase;   
   
   return res.json({author:database.author});
});

/*
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameter       publicationId,isbn
Methods         DELETE
*/
booky.delete(" /publication/delete/book/:isbn/:pubId", (req,res)=>{
   //update the publication database
   database.publication.forEach((publication)=>{
       if(publication.id===parseInt(req.params.pubId)){
           const newBooksList=publication.books.filter((book)=>book!==req.params.isbn);
           publication.books=newBooksList;
           return;
       }
   });
     //updating the book database
       database.books.forEach((book)=>{
       if(book.ISBN===req.params.isbn){
           book.publication=0;
           return;
       }
   });
   return res.json({books:database.books,publications:database.publication});
   });

   
/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameter       publicationId
Methods         DELETE
*/
booky.delete("/publication/delete/:publicationId", (req,res)=>{
   const updatedPublicationDatabase = database.publication.filter((publication)=>publication.id!==parseInt(req.params.publicationId));
   database.publication= updatedPublicationDatabase;   
  
  return res.json({apublication:database.publication});
});

booky.listen(3000, () => console.log("Hey server is running!"));