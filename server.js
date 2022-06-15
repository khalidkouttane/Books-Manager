const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

dotenv.config();
const app = express()
const PORT = 4000;

app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI //for more infos check MongoDB\'s documentation

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('mongoose is connected !!')
})

const booksRouter = require("./routes/books")
app.use('/books', booksRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple API documentation",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

