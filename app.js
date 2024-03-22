require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const jwt = require('jsonwebtoken');

const posts = [
    {
        username: 'Najjar',
        title: 'Post 1'
    }
];

app.get('/posts', authenticateToken, (req, res) =>{
    res.json(posts.filter(post => post.username === req.user.name));
});

// Middleware for logging requests
app.use(morgan("dev"));

// Middleware for parsing JSON bodies
app.use(express.json());

// Bring in routes
const postRoutes = require('./routes/post');  // Import post routes
const userRoutes = require('./routes/post');   // Import user routes

// User login route
app.post('/login', (req, res) => {
    const { username } = req.body;
    const user = { name: username }; // Ensure the user object has 'name' property

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken, user: user }); // Send the user object along with the token
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Pass the user information to the request object
        next();
    });
}

// Routes
app.use("/api", authenticateToken, userRoutes);  // Mount user routes with authentication

const port = 8080;
app.listen(port, () => {
    console.log('A Node Js API is listening on port: ' + port);
});
