const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const cookieParser = require("cookie-parser");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

router.use(cookieParser());

// Middleware to check if the user is authenticated
function checkAuth(req, res, next) {
  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Display all messages for the authenticated user
router.get("/messages", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  connection.query(
    "SELECT * FROM messages WHERE user_id = ?",
    [user_id],
    function (err, rows, fields) {
      if (err) throw err;

      res.render("messages", { messages: rows, user_id: user_id });
    }
  );
});

// Send a message from the authenticated user
router.post("/messages", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const message = req.body.message;

  connection.query(
    "INSERT INTO messages (user_id, message) VALUES (?, ?)",
    [user_id, message],
    function (err, result) {
      if (err) throw err;

      res.redirect("/messages");
    }
  );
});

router.post("/signup", function (req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const organization = req.body.organization || null;

  // Check if the username is already taken
  connection.query(
    "SELECT id FROM users WHERE username = ?",
    [username],
    function (err, results) {
      if (err) {
        res.render("signup", {
          error: "Error occurred while processing the request.",
        });
      } else if (results.length > 0) {
        res.render("signup", { error: "Username is already taken." });
      } else {
        // Insert the new user into the database
        connection.query(
          "INSERT INTO users (username, email, password, organization) VALUES (?, ?, ?, ?)",
          [username, email, password, organization],
          function (err, result) {
            if (err) {
              res.render("signup", {
                error: "Error occurred while processing the request.",
              });
            } else {
              res.render("signup", {
                message: "Account created successfully.",
              });
            }
          }
        );
      }
    }
  );
});

// Display all friends and friend requests for the authenticated user
router.get("/friends", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  connection.query(
    "SELECT users.* FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ?",
    [user_id, "accepted"],
    function (err, friends, fields) {
      if (err) throw err;

      // Fetch friend requests
      connection.query(
        "SELECT users.* FROM friendships JOIN users ON friendships.user_id = users.id WHERE friendships.friend_id = ? AND friendships.status = ?",
        [user_id, "pending"],
        function (err, requests, fields) {
          if (err) throw err;

          res.render("friends", { friends: friends, requests: requests, user_id: user_id, error: "", searchResults: [] }); // Pass an empty array for searchResults here
        }
      );
    }
  );
});


router.post("/friends/search", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const query = req.body.query;

  connection.query(
    `SELECT username, id FROM users WHERE username LIKE '%${query}%' AND id <> ?`,
    [user_id],
    function (err, searchResults, fields) {
      if (err) throw err;

      // Fetch friends and friend requests
      connection.query(
        "SELECT users.* FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ?",
        [user_id, "accepted"],
        function (err, friends, fields) {
          if (err) throw err;

          connection.query(
            "SELECT users.* FROM friendships JOIN users ON friendships.user_id = users.id WHERE friendships.friend_id = ? AND friendships.status = ?",
            [user_id, "pending"],
            function (err, requests, fields) {
              if (err) throw err;

              res.render("friends", { friends: friends, requests: requests, searchResults: searchResults, error: "" });
            }
          );
        }
      );
    }
  );
});

// Send a friend request
router.post("/friends/send-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.body.friend_id;

  // Check if there is an existing friend request between the two users
  connection.query(
    "SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
    [user_id, friend_id, friend_id, user_id],
    function (err, results) {
      if (err) throw err;

      // If a request is found, display a message indicating the request is still pending
      if (results.length > 0) {
        res.render("friends", {
          error: "A friend request is already pending.",
          friends: [],
          requests: [], // Add this line to pass an empty array for requests
        });
      } else {
        // If no request is found, create a new friend request
        connection.query(
          "INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)",
          [user_id, friend_id, "pending"],
          function (err, result) {
            if (err) throw err;

            res.redirect("/friends");
          }
        );
      }
    }
  );
});

// Accept a friend request
router.post("/friends/accept-request", checkAuth, function (req, res) {
    const user_id = req.cookies.user_id;
    const request_id = req.body.request_id;
  
    connection.query(
      "UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?",
      ["accepted", request_id, user_id],
      function (err, result) {
        if (err) throw err;
  
        res.redirect("/friends");
      }
    );
  });
    
// Decline a friend request
router.post("/friends/decline-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const request_id = req.body.request_id;

  connection.query(
    "UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?",
    ["declined", request_id, user_id],
    function (err, result) {
      if (err) throw err;

      res.redirect("/friends");
    }
  );
});
  
// Display the user's account page
router.get("/account", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [user_id],
    function (err, rows, fields) {
      if (err) throw err;

      const user = rows[0]; // Get the first (and only) row from the results

      res.render("account", { user: user });
    }
  );
});

module.exports = router;
