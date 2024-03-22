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

// Controller function to add material to a user
exports.addMaterialToUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { user_id, material_id, quantity } = req.body;
            pool.query('INSERT INTO user_materials (user_id, material_id, quantity) VALUES (?, ?, ?)', [user_id, material_id, quantity], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not add material to user' });
                }
                res.status(201).json({ user_material_id: results.insertId });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not add material to user' });
        }
    });
};

// Controller function to get materials by user
exports.getMaterialsByUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const userId = req.params.user_id;
            pool.query('SELECT * FROM user_materials WHERE user_id = ?', [userId], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not retrieve materials for user' });
                }
                res.json(results);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not retrieve materials for user' });
        }
    });
};

// Controller function to update material quantity for a user
exports.updateMaterialQuantityForUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { quantity, user_id, material_id } = req.body;
            pool.query('UPDATE user_materials SET quantity = ? WHERE user_id = ? AND material_id = ?', [quantity, user_id, material_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not update material quantity for user' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Material for user not found' });
                }
                res.json({ message: 'Material quantity updated successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not update material quantity for user' });
        }
    });
};

// Controller function to delete material from user's inventory
exports.deleteMaterialFromUser = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const { user_id, material_id } = req.params;
            pool.query('DELETE FROM user_materials WHERE user_id = ? AND material_id = ?', [user_id, material_id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Could not delete material from user' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Material for user not found' });
                }
                res.json({ message: 'Material deleted from user successfully' });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Could not delete material from user' });
        }
    });
};
