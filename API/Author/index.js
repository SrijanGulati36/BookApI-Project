const Router = require("express").Router();

const AuthorModel=require("../../database/author");

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
Router.get("/author", async(req, res) => {
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
  
  Router.get("/author/:name", (req, res) => {
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
  Router.get("/author/book/:isbn", (req, res) => {
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
Route           /author/new
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

Router.post("/author/new", (req, res) => {
 
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);
    return res.json({ message: "Author added to the database" });


});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameter       authorid
Methods         DELETE
*/
Router.delete("/author/delete/:authorId", (req,res)=>{
    const updatedAuthorDatabase = database.author.filter((author)=>author.id!==parseInt(req.params.authorId));
    database.author=updatedAuthorDatabase;   
   
   return res.json({author:database.author});
});

module.exports = Router;