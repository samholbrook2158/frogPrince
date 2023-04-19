const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const flash = require('connect-flash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(flash());

const ExpressApp = require("./Express.js");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat_app",
});

db.connect(function (err) {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database");
});

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/logout', function(req, res) {
    res.clearCookie('user_id');
    res.redirect('/login');
  });
  

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    db.query(
        "SELECT id FROM users WHERE username = ? AND password = ?",
        [username, password],
        function (err, results) {
            if (err) {
                res.render("login", {
                    error: "Error occurred while processing the request.",
                });
            } else if (results.length > 0) {
                var user_id = results[0].id;
                res.cookie("user_id", user_id);
                res.render("dashboard", { username: username });
            } else {
                db.query(
                    "SELECT id FROM users WHERE username = ?",
                    [username],
                    function (err, results) {
                        if (err) {
                            res.render("login", {
                                error: "Error occurred while processing the request.",
                            });
                        } else if (results.length > 0) {
                            res.render("login", { error: "Invalid password." });
                        } else {
                            res.render("login", { error: "Invalid username." });
                        }
                    }
                );
            }
        }
    );
});


// Display the signup page
app.get("/signup", function (req, res) {
    res.render("signup");
});

// Create a new user
app.post('/signup', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var organization = req.body.organization;
    var role = req.body.role || null; 

    console.log("Role entered:", role); // add this line to log the role

    // Check if username and email are already in use
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], function (err, results) {
        if (err) {
            res.render('signup', { error: 'Error occurred while processing the request.' });
        } else if (results.length > 0) {
            // If username or email already in use, render the signup page with an error message
            res.render('signup', { error: 'Username or email already in use.' });
        } else {
            // If username and email are available, insert new user into users table
            db.query(
                'INSERT INTO users (username, email, password, organization, role) VALUES (?, ?, ?, ?, ?)',
                [username, email, password, organization, role],
                function (err, result) {
                  if (err) {
                    console.error(err);
                    res.render('signup', { error: 'Error occurred while processing the request.' });
                  } else {
                    res.render('signup', { success: 'Account created successfully. Please log in.' });
                  }
                }
              );              
        }
    });
});

   
// Mounts the Express.js middleware
app.use("/", ExpressApp);
  
app.listen(3000, function () {
console.log("Server listening on port 3000");
});
  
module.exports = app;  
