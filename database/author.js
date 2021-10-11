const mongoose = require("mongoose");

// Creating a book schema
const AuthorSchema = mongoose.Schema({
    id: {
      type : Number,
      required : true,
    },
    name: {
      type : String,
      required : true,
    },
    books: [String]
  });

// Create a book model
const AuthorModel = mongoose.model("authors" ,AuthorSchema);

module.exports = AuthorModel;