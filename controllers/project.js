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

// Controller function to create a new project
exports.createProject = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { title, description, difficulty_level, group_size } = req.body;
            pool.query('INSERT INTO projects (title, description, difficulty_level, group_size) VALUES (?, ?, ?, ?)', [title, description, difficulty_level, group_size], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not create project' });
                }
                res.status(201).json({ project_id: results.insertId });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not create project' });
        }
    });
};

// Controller function to get all projects
exports.getAllProjects = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            pool.query('SELECT * FROM projects', (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve projects' });
                }
                res.json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve projects' });
        }
    });
};

// Controller function to get project by ID
exports.getProjectByID = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const projectId = req.params.id;
            pool.query('SELECT * FROM projects WHERE project_id = ?', [projectId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve project' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                res.json(results[0]);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve project' });
        }
    });
};

// Controller function to update project by ID
exports.updateProject = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { title, description, difficulty_level, group_size } = req.body;
            const projectId = req.params.id;
            pool.query('UPDATE projects SET title = ?, description = ?, difficulty_level = ?, group_size = ? WHERE project_id = ?', [title, description, difficulty_level, group_size, projectId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not update project' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                res.json({ message: 'Project updated successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not update project' });
        }
    });
};

// Controller function to delete project by ID
exports.deleteProject = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const projectId = req.params.id;
            pool.query('DELETE FROM projects WHERE project_id = ?', [projectId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not delete project' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                res.json({ message: 'Project deleted successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not delete project' });
        }
    });
};
