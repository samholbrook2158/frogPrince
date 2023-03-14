const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_app'
});

router.use(cookieParser());

// Middleware to check if the user is authenticated
function checkAuth(req, res, next) {
    if (!req.cookies.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
}

// Display all messages for the authenticated user
router.get('/messages', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;

    connection.query('SELECT * FROM messages WHERE user_id = ?', [user_id], function (err, rows, fields) {
        if (err) throw err;

        res.render('messages', { messages: rows, user_id: user_id });
    });
});

// Send a message from the authenticated user
router.post('/messages', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;
    const message = req.body.message;

    connection.query('INSERT INTO messages (user_id, message) VALUES (?, ?)', [user_id, message], function (err, result) {

        if (err) throw err;

        res.redirect('/messages');
    });
});

router.post('/signup', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const organization = req.body.organization || null;

    // Check if the username is already taken
    connection.query('SELECT id FROM users WHERE username = ?', [username], function (err, results) {
        if (err) {
            res.render('signup', { error: 'Error occurred while processing the request.' });
        } else if (results.length > 0) {
            res.render('signup', { error: 'Username is already taken.' });
        } else {
            // Insert the new user into the database
            connection.query('INSERT INTO users (username, email, password, organization) VALUES (?, ?, ?, ?)', [username, email, password, organization], function (err, result) {
                if (err) {
                    res.render('signup', { error: 'Error occurred while processing the request.' });
                } else {
                    res.render('signup', { message: 'Account created successfully.' });
                }
            });
        }
    });
});



// Search for friends
router.post('/friends/search', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;
    const query = req.body.query;

    connection.query(`SELECT username FROM users WHERE username LIKE '%${query}%' AND id <> ?`, [user_id], function (err, results, fields) {
        if (err) throw err;

        res.render('friendSearch', { results: results });
    });
});

// Display all friends for the authenticated user
router.get('/friends', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;

    connection.query('SELECT * FROM friends WHERE user_id = ?', [user_id], function (err, rows, fields) {
        if (err) throw err;

        results = rows; // Set the results to the variable defined outside the function

        res.render('friends', { friends: rows, user_id: user_id });
    });
});

// Send a friend request from the authenticated user
router.post('/friends', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;
    const friend_id = req.body.friend_id;

    connection.query('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)', [user_id, friend_id, 'pending'], function (err, result) {
        if (err) throw err;

        res.redirect('/friends');
    });
});

// Accept a friend request from the authenticated user
router.post('/friends/accept', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;
    const friend_id = req.body.friend_id;

    connection.query('UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?', ['accepted', friend_id, user_id], function (err, result) {
        if (err) throw err;

        res.redirect('/friends');
    });
});

// Display the user's account page
router.get('/account', checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;

    connection.query('SELECT * FROM users WHERE id = ?', [user_id], function (err, rows, fields) {
        if (err) throw err;

        const user = rows[0]; // Get the first (and only) row from the results

        res.render('account', { user: user });
    });
});


module.exports = router;
