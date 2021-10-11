const Router = require("express").Router();

const AuthorModel=require("../../database/publication");

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
Router.get("/publications", (req, res) => {
    return res.json({ publications: database.publication });
  });
  
  /*
  Route           /publications
  Description     get specific publications
  Access          PUBLIC
  Parameter       name
  Methods         GET
  */
  Router.get("/publications/:name", (req, res) => {
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
  Router.get("/publications/book/:isbn", (req, res) => {
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
Route           /publication/add
Description     add new pubication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

Router.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;
  
    database.publication.push(newPublication);
  
    return res.json({ publication: database.publication });
  });
  
   /*
  Route           /publication/update/
  Description     Update publication name
  Access          PUBLIC
  Parameter       name
  Methods         PUT
  */
  
  Router.put("/publication/update/:name", (req, res) => {
    database.publication.forEach((publication) => {
      if (publication.name === req.params.name) {
        publication.name = req.body.newPublicationName;
        return;
      }
    });
  
    return res.json({ books: database.books });
  });

  /*
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameter       publicationId,isbn
Methods         DELETE
*/
Router.delete(" /publication/delete/book/:isbn/:pubId", (req,res)=>{
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
 Router.delete("/publication/delete/:publicationId", (req,res)=>{
    const updatedPublicationDatabase = database.publication.filter((publication)=>publication.id!==parseInt(req.params.publicationId));
    database.publication= updatedPublicationDatabase;   
   
   return res.json({apublication:database.publication});
 });
  
 module.exports = Router;
  