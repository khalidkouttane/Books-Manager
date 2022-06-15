const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookname: { type: String, required: true, },
  author: { type: String, },
  publishDate: { type: String },
  genre: { type: String },
  price: { type: String,},
  editor: { type: String,  },
  purchaseLink: { type: String, }
}, {
  timestamps: true,
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book