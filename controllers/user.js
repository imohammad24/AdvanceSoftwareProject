const mysql = require('mysql2');

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '100200300nj',
    database: 'communicraftdb',
    waitForConnections: true,
    queueLimit: 0
});

// Function to authenticate and authorize database access
function authenticateAndAuthorize(user, callback) {
    if (user && user.name === 'Najjar') {
        callback(true); // Authorized
    } else {
        callback(false); // Not authorized
    }
}

// Controller functions with authentication and authorization
exports.getAllUsers = (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        pool.query('SELECT * FROM Users', (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    });
};

exports.getUserById = (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const userId = req.params.id;
        pool.query('SELECT * FROM Users WHERE user_id = ?', userId, (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.json(results[0]);
            }
        });
    });
};

exports.createUser = (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { username, email, password } = req.body;
        const userData = { username, email, password };
        pool.query('INSERT INTO Users SET ?', userData, (error, results) => {
            if (error) throw error;
            res.status(201).json({ message: 'User created successfully', user_id: results.insertId });
        });
    });
};

exports.updateUser = (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

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
    });
};

exports.deleteUser = (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const userId = req.params.id;
        pool.query('DELETE FROM Users WHERE user_id = ?', userId, (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.json({ message: 'User deleted successfully' });
            }
        });
    });
};

exports.getUserProfile = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch user profile information including username and email
        pool.query('SELECT username, email FROM Users WHERE user_id = ?', [userId], (error, userResults) => {
            if (error) {
                return res.status(500).json({ error: 'Could not retrieve user profile' });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Fetch user's skills
            pool.query('SELECT s.skill_name FROM Skills s INNER JOIN User_Skills us ON s.skill_id = us.skill_id WHERE us.user_id = ?', [userId], (error, skillResults) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve user skills' });
                }

                // Combine user profile information with skills
                const userProfile = {
                    username: userResults[0].username,
                    email: userResults[0].email,
                    skills: skillResults.map(skill => skill.skill_name)
                };

                res.json(userProfile);
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve user profile' });
    }
};