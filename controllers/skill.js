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

// Controller function to create a new skill
exports.createSkill = (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { skill_name } = req.body;
            pool.query('INSERT INTO Skills (skill_name) VALUES (?)', [skill_name], (error, results) => {
                if (error) {
                    console.error("Error creating skill:", error);
                    return res.status(500).json({ error: 'Could not create skill' });
                }
                res.status(201).json({ skill_id: results.insertId });
            });
        } catch (error) {
            console.error("Error creating skill:", error);
            res.status(500).json({ error: 'Could not create skill' });
        }
    });
};

// Controller function to get all skills
exports.getAllSkills = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            pool.query('SELECT * FROM skills', (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve skills' });
                }
                res.json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve skills' });
        }
    });
};

// Controller function to get skill by ID
exports.getSkillByID = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const skillId = req.params.id;
            pool.query('SELECT * FROM skills WHERE skill_id = ?', [skillId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve skill' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Skill not found' });
                }
                res.json(results[0]);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve skill' });
        }
    });
};

// Controller function to update skill by ID
exports.updateSkill = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { name } = req.body;
            const skillId = req.params.id;
            pool.query('UPDATE skills SET name = ? WHERE skill_id = ?', [name, skillId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not update skill' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Skill not found' });
                }
                res.json({ message: 'Skill updated successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not update skill' });
        }
    });
};

// Controller function to delete skill by ID
exports.deleteSkill = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const skillId = req.params.id;
            pool.query('DELETE FROM skills WHERE skill_id = ?', [skillId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not delete skill' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Skill not found' });
                }
                res.json({ message: 'Skill deleted successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not delete skill' });
        }
    });
};
