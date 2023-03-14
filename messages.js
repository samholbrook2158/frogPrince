const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// create mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_app'
});

// connect to mysql
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database!');
});

// handle message submission
router.post('/', (req, res) => {
  const message = {
    name: req.body.name,
    content: req.body.content,
    created_at: new Date()
  };

  // insert message into database
  db.query('INSERT INTO messages SET ?', message, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Message inserted into database:', message);

    // redirect to messages page
    res.redirect('/messages');
  });
});

// display messages
router.get('/', (req, res) => {
  // select messages from database
  db.query('SELECT * FROM messages ORDER BY created_at', (err, results) => {
    if (err) {
      throw err;
    }
    res.render('messages', { messages: results });
  });
});

module.exports = router;
