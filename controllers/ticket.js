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

// Controller function to create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { message } = req.body;

        // Ensure message_content is provided
        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        // Insert the ticket into the database
        pool.query('INSERT INTO tickets (sender_jwt, message_content) VALUES (?, ?)', [req.user.name, message], (error, results) => {
            if (error) {
                console.error('Error creating ticket:', error);
                return res.status(500).json({ error: 'Could not create ticket' });
            }
            res.status(201).json({ ticket_id: results.insertId });
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Could not create ticket' });
    }
};


// Controller function to get all tickets
exports.getAllTickets = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            pool.query('SELECT * FROM tickets', (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not retrieve tickets' });
                }
                res.json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not retrieve tickets' });
        }
    });
};

// Controller function to delete ticket by ID
exports.deleteTicket = async (req, res) => {
    authenticateAndAuthorize(req.user, isAuthenticated => {
        if (!isAuthenticated) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        try {
            const ticketId = req.params.id;
            pool.query('DELETE FROM tickets WHERE message_id = ?', [ticketId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Could not delete ticket' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Ticket not found' });
                }
                res.json({ message: 'Ticket deleted successfully' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Could not delete ticket' });
        }
    });
};
