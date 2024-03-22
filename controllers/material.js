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

// create a new material
exports.createMaterial = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { name, description } = req.body;
            pool.query('INSERT INTO materials (name, description) VALUES (?, ?)', [name, description], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not create material' });
                }
                res.status(201).json({ material_id: results.insertId });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not create material' });
        }
    });
};

// get all materials
exports.getAllMaterials = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            pool.query('SELECT * FROM materials', (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve materials' });
                }
                res.json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve materials' });
        }
    });
};

// get material by ID
exports.getMaterialByID = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const materialId = req.params.id;
            pool.query('SELECT * FROM materials WHERE material_id = ?', [materialId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve material' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Material not found' });
                }
                res.json(results[0]);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve material' });
        }
    });
};

// update material by ID
exports.updateMaterial = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { name, description } = req.body;
            const materialId = req.params.id;
            pool.query('UPDATE materials SET name = ?, description = ? WHERE material_id = ?', [name, description, materialId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not update material' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Material not found' });
                }
                res.json({ message: 'Material updated successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not update material' });
        }
    });
};

// delete material by ID
exports.deleteMaterial = async (req, res) => {
  authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const materialId = req.params.id;
            pool.query('DELETE FROM materials WHERE material_id = ?', [materialId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not delete material' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Material not found' });
                }
                res.json({ message: 'Material deleted successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not delete material' });
        }
    });
};
