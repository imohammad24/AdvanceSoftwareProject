const mysql = require('mysql2');

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '100200300nj',
    database: 'communicraftdb'
});

// Function to authenticate and authorize database access
function authenticateAndAuthorize(user, callback) {
    if (user && user.name === 'Najjar') {
        callback(true); // Authorized
    } else {
        callback(false); // Not authorized
    }
}

// Controller function to add skill to a user
exports.addSkillToUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { user_id, skill_id } = req.body;
            pool.query('INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)', [user_id, skill_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not add skill to user' });
                }
                res.status(201).json({ user_skill_id: results.insertId });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not add skill to user' });
        }
    });
};

// Controller function to retrieve all skills associated with a user
exports.getSkillsByUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const userId = req.params.user_id;
            pool.query('SELECT * FROM user_skills WHERE user_id = ?', [userId], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not retrieve skills for user' });
                }
                res.json(results);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not retrieve skills for user' });
        }
    });
};

// Controller function to delete skill from user's list
exports.deleteSkillFromUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { user_id, skill_id } = req.params;
            pool.query('DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?', [user_id, skill_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not delete skill from user' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Skill for user not found' });
                }
                res.json({ message: 'Skill deleted from user successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not delete skill from user' });
        }
    });
};
