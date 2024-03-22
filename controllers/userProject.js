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

// Controller function to add project to a user
exports.addProjectToUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { user_id, project_id } = req.body;
            pool.query('INSERT INTO user_projects (user_id, project_id) VALUES (?, ?)', [user_id, project_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not add project to user' });
                }
                res.status(201).json({ user_project_id: results.insertId });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not add project to user' });
        }
    });
};

// Controller function to retrieve all projects associated with a user
exports.getProjectsByUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const userId = req.params.user_id;
            pool.query('SELECT * FROM user_projects WHERE user_id = ?', [userId], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not retrieve projects for user' });
                }
                res.json(results);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not retrieve projects for user' });
        }
    });
};

// Controller function to delete project from user's list
exports.deleteProjectFromUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { user_id, project_id } = req.params;
            pool.query('DELETE FROM user_projects WHERE user_id = ? AND project_id = ?', [user_id, project_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not delete project from user' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Project for user not found' });
                }
                res.json({ message: 'Project deleted from user successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not delete project from user' });
        }
    });
};
