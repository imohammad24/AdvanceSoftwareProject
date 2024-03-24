const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '100200300nj',
    database: 'communicraftdb'
});

// Controller function to store a new chat message
exports.storeMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const sender = req.user.name; // Assuming the sender is obtained from the authenticated user's JWT token

        // Insert the message into the database
        pool.query('INSERT INTO ChatMessages (sender_jwt, message_content) VALUES (?, ?)', [sender, message], (error, results) => {
            if (error) {
                console.error('Error storing chat message:', error);
                return res.status(500).json({ error: 'Could not store chat message' });
            }
            res.status(201).json({ message: 'Chat message sent successfully' });
        });
    } catch (error) {
        console.error('Error storing chat message:', error);
        res.status(500).json({ error: 'Could not store chat message' });
    }
};

// Controller function to get all chat messages
exports.getAllMessages = (req, res) => {
    // Retrieve all chat messages from the database
    pool.query('SELECT * FROM ChatMessages', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Could not retrieve chat messages' });
        }
        res.json(results);
    });
};

// Controller function to get recent chat messages (last 3 days)
exports.getRecentMessages = (req, res) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Retrieve recent chat messages from the database
    pool.query('SELECT * FROM ChatMessages WHERE sent_time >= ?', [threeDaysAgo], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Could not retrieve recent chat messages' });
        }
        res.json(results);
    });
};

// Controller function to store chat message and material quantities for a user
exports.shareMaterials = async (req, res) => {
    try {
        const { username, message } = req.body;

        // First, get the user's material quantities
        const materialQuery = `
            SELECT Materials.name, User_Materials.quantity
            FROM Users
            JOIN User_Materials ON Users.user_id = User_Materials.user_id
            JOIN Materials ON User_Materials.material_id = Materials.material_id
            WHERE Users.username = ?;
        `;

        pool.query(materialQuery, [username], (materialError, materialResults) => {
            if (materialError) {
                return res.status(500).json({ error: 'Could not retrieve material quantities' });
            }

            // Serialize material quantities as JSON
            const materialQuantities = materialResults.map(material => `${material.quantity} ${material.name}`).join(', ');

            // Include material quantities in the message content
            const fullMessage = `${message}\nMaterials: ${materialQuantities}`;

            // Then, store the chat message along with the material quantities in the database
            const chatQuery = `
                INSERT INTO ChatMessages (sender_jwt, message_content)
                VALUES (?, ?);
            `;

            pool.query(chatQuery, [username, fullMessage], (chatError, chatResults) => {
                if (chatError) {
                    return res.status(500).json({ error: 'Could not store chat message' });
                }
                
                // Respond with success message if chat message stored successfully
                res.status(201).json({ message_id: chatResults.insertId, material_quantities: materialResults });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not store chat message and material quantities' });
    }
};

// Controller function to share completed projects in a chat message
exports.shareCompletedProjects = async (req, res) => {
    try {
        const { username, message } = req.body;

        // First, get the user's completed projects with details
        const projectQuery = `
            SELECT Projects.title, Projects.description, Projects.materials_required, Projects.group_size, Projects.difficulty_level
            FROM Projects
            JOIN User_Projects ON Projects.project_id = User_Projects.project_id
            JOIN Users ON User_Projects.user_id = Users.user_id
            WHERE Users.username = ? AND Projects.status = 'Completed';
        `;

        pool.query(projectQuery, [username], (projectError, projectResults) => {
            if (projectError) {
                return res.status(500).json({ error: 'Could not retrieve user completed projects' });
            }

            // Serialize project details
            const projectDetails = projectResults.map(project => {
                return `Title: ${project.title}\nDescription: ${project.description}\nDifficulty Level: ${project.difficulty_level}\nMaterials Required: ${project.materials_required}\nGroup Size: ${project.group_size}`;
            }).join('\n\n');

            // Include project details in the message content
            const fullMessage = `${message}\nCompleted Projects:\n${projectDetails}`;

            // Then, store the chat message along with the completed project details in the database
            const chatQuery = `
                INSERT INTO ChatMessages (sender_jwt, message_content)
                VALUES (?, ?);
            `;

            pool.query(chatQuery, [username, fullMessage], (chatError, chatResults) => {
                if (chatError) {
                    return res.status(500).json({ error: 'Could not store chat message' });
                }
                
                // Respond with success message if chat message stored successfully
                res.status(201).json({ message_id: chatResults.insertId, completedProjects: projectResults });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not store chat message and completed projects' });
    }
};