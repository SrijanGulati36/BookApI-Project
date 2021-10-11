const Router = require("express").Router();

const BookModel=require("../../database/book");

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

Router.get("/", async (req, res) => {
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

Router.get("/is/:isbn", async (req, res) => {

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

Router.get("/c/:category", async (req, res) => {

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

Router.get("/lan/:language", (req, res) => {
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
Route           /book/new
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

Router.post("/new", async (req, res) => {
    try {
      const { newBook } = req.body;
  
      await BookModel.create(newBook);
      return res.json({ message: "Book added to the database" });
  } catch (error) {
      return res.json({ error: error.message });
  }
  });

  /*
Route           /book/update
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

Router.put("/update/:isbn", async (req, res) => {
    const updatedBook= await BookModel.findOneAndUpdate({
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true,
    }
    );
    
    
    return res.json({ books: updatedBook });
  });

  /*
Route           /book/update/author
Description     Update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

Router.put("/updateAuthor/:isbn", async (req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;
  
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );
  
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: newAuthor,
        },
        {
            $addToSet: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );
  
    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added into the database",
    });
  });

  /*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELEte
*/
Router.delete("/delete/:isbn", async(req, res) => {
    const updateBookDatabase = await BookModel.findOneAndDelete({
      ISBN: req.params.isbn,
    });
      
    return res.json({ books: updateBookDatabase });
  });
  
  /*Route         /book/delete/author
  Description     delete a author from a book
  Access          PUBLIC
  Parameter       isbn, author Id
  Methods         DELETE
  */
  Router.delete("/delete/author/:isbn/:authorId",async(req,res)=>{
    const updatedBook = await BookModel.findOneAndUpdate(
      {
          ISBN: req.params.isbn,
      },
      {
          $pull: {
              authors: parseInt(req.params.authorId),
          },
      },
      {
          new: true,
      }
  );
  
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
          id: parseInt(req.params.authorId),
      },
      {
          $pull: {
              books: req.params.isbn,
          },
      },
      {
          new: true,
      }
  );
  
  return res.json({
      message: "Author was deleted",
      book: updatedBook,
      author: updatedAuthor,
  });
  });
  

  module.exports = Router;