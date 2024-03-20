const express = require("express");
const app = express();
const morgan = require("morgan");

// Middleware for logging requests
app.use(morgan("dev"));

// Middleware for parsing JSON bodies
app.use(express.json());

// Bring in routes
const postRoutes = require('./routes/post');

// Routes
app.use("/api/", postRoutes);

const port = 8080;
app.listen(port, () => {
    console.log('A Node Js API is listening on port: ' + port);
});
