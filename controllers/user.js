/*exports.getPosts = (req,res)=>{
    res.json({
        posts: [{title: "First post"}, {title: "Second post"}]
    });
};*/

const mysql = require('mysql2');

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '100200300nj',
    database: 'communicraftdb'
});

// Controller functions
exports.getAllUsers = (req, res) => {
    pool.query('SELECT * FROM Users', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    pool.query('SELECT * FROM Users WHERE user_id = ?', userId, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
};

exports.createUser = (req, res) => {
    const { username, email, password } = req.body;
    const userData = { username, email, password };
    pool.query('INSERT INTO Users SET ?', userData, (error, results) => {
        if (error) throw error;
        res.status(201).json({ message: 'User created successfully', user_id: results.insertId });
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    const userData = { username, email, password };
    pool.query('UPDATE Users SET ? WHERE user_id = ?', [userData, userId], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    pool.query('DELETE FROM Users WHERE user_id = ?', userId, (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
};