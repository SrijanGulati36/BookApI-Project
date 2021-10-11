const mongoose = require("mongoose");

// Creating a book schema
const PublicationSchema = mongoose.Schema({
id: {
    type : Number,
    required : true,
  },
  name: {
    required : true,
    type : String,
  },
  books: [String]
});

// Create a book model
const PublicationModel = mongoose.model("publications" ,PublicationSchema);

module.exports = PublicationModel;