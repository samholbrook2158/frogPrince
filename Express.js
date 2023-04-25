const express = require("express");
const path = require('path');
const router = express.Router();
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const axios = require('axios');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

function checkAuth(req, res, next) {
  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    next();
  }
}

const util = require('util');

function getUnreadCounts(user_id, callback) {
  connection.query(
    "SELECT friendships.is_colleague, COUNT(*) as unread_count FROM friendships JOIN friend_chats ON friendships.friend_id = friend_chats.sender_id WHERE friendships.user_id = ? AND friend_chats.receiver_id = ? AND friend_chats.is_read = 0 GROUP BY friendships.is_colleague",
    [user_id, user_id],
    function (err, rows) {
      if (err) {
        console.error("Error fetching unread counts:", err);
        callback(err, null);
      } else {
        let colleagueUnreadCount = 0;
        let clientUnreadCount = 0;

        rows.forEach(row => {
          if (row.is_colleague === 1) {
            colleagueUnreadCount = row.unread_count;
          } else {
            clientUnreadCount = row.unread_count;
          }
        });

        callback(null, {
          colleagueUnreadCount: colleagueUnreadCount,
          clientUnreadCount: clientUnreadCount,
        });
      }
    }
  );
}

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/FAQ", function (req, res) {
  res.render("FAQ");
});

router.get("/messages", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  connection.query(
    "SELECT users.id as friend_id, users.username as friend_name, friendships.is_colleague FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ?",
    [user_id, "accepted"],
    function (err, friends, fields) {
      if (err) throw err;

      const colleagueFriends = friends.filter(friend => friend.is_colleague === 1);
      const clientFriends = friends.filter(friend => friend.is_colleague !== 1);

      if (colleagueFriends.length > 0) {
        const firstFriendId = colleagueFriends[0].friend_id;
        res.redirect(`/messages/${firstFriendId}`);
      } else if (clientFriends.length > 0) {
        const firstFriendId = clientFriends[0].friend_id;
        res.redirect(`/messages/${firstFriendId}`);
      } else {
        res.render("messages", {
          messages: [],
          user_id: user_id,
          friend_id: null,
          friends: friends,
        });
      }
    }
  );
});

router.post("/messages", checkAuth, upload.single('file'), function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.body.friend_id;
  const message = req.body.message;

  const file = req.file;
  let filePath = null;
  if (file) {
    filePath = path.join("uploads", file.filename);
  }

  if (!message && !file) {
    res.redirect("/messages/" + friend_id);
    return;
  }

  connection.query(
    "INSERT INTO friend_chats (sender_id, receiver_id, message, file_path, original_filename) VALUES (?, ?, ?, ?, ?)",
    [user_id, friend_id, message || null, filePath, file ? file.originalname : null],
    function (err, result) {
      if (err) throw err;

      res.redirect("/messages/" + friend_id);
    }
  );
});

router.get("/messages/:friend_id", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.params.friend_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    connection.query(
      "SELECT users.id as friend_id, users.username as friend_name, friendships.is_colleague FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ?",
      [user_id, "accepted"],
      function (err, friends, fields) {
        if (err) throw err;

        connection.query(
          "SELECT friend_chats.*, users.username as sender FROM friend_chats JOIN users ON friend_chats.sender_id = users.id WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC",
          [user_id, friend_id, friend_id, user_id],
          function (err, messages, fields) {
            if (err) throw err;

            const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

            res.render("messages", {
              messages: messages,
              user_id: user_id,
              friend_id: friend_id,
              friends: friends,
              colleagueUnreadCount: unreadCounts.colleagueUnreadCount,
              clientUnreadCount: unreadCounts.clientUnreadCount,
              totalUnreadMessages: totalUnreadMessages,
            });
          }
        );
      }
    );
  });
});

router.get("/download/:message_id", checkAuth, function (req, res) {
  const message_id = req.params.message_id;

  connection.query(
    "SELECT * FROM friend_chats WHERE id = ?",
    [message_id],
    function (err, results) {
      if (err) throw err;

      if (results.length > 0) {
        const file_path = results[0].file_path;
        const original_filename = results[0].original_filename;

        if (file_path) {
          res.download(path.join(__dirname, file_path), original_filename, function (err) {
            if (err) {
              console.error("Error downloading the file:", err);
              res.status(500).send("Failed to download the file");
            }
          });
        } else {
          res.status(404).send("No file found");
        }
      } else {
        res.status(404).send("Message not found");
      }
    }
  );
});

router.get("/api/messages/:friend_id", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.params.friend_id;

  connection.query(
    "SELECT friend_chats.*, users.username as sender FROM friend_chats JOIN users ON friend_chats.sender_id = users.id WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC",
    [user_id, friend_id, friend_id, user_id],
    function (err, messages, fields) {
      if (err) throw err;

      res.json(messages);
    }
  );
});

router.get("/api/messages/:friend_id/since/:last_message_id", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.params.friend_id;
  const last_message_id = req.params.last_message_id;

  connection.query(
    "SELECT friend_chats.*, users.username as sender FROM friend_chats JOIN users ON friend_chats.sender_id = users.id WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) AND friend_chats.id > ? ORDER BY timestamp ASC",
    [user_id, friend_id, friend_id, user_id, last_message_id],
    function (err, messages, fields) {
      if (err) throw err;

      res.json(messages);
    }
  );
});

router.get("/friends", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  connection.query(
    "SELECT users.*, friendships.is_colleague FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ?",
    [user_id, "accepted"],
    function (err, friends, fields) {
      if (err) throw err;

      connection.query(
        "SELECT users.* FROM friendships JOIN users ON friendships.user_id = users.id WHERE friendships.friend_id = ? AND friendships.status = ?",
        [user_id, "pending"],
        function (err, requests, fields) {
          if (err) throw err;

          res.render("friends", {
            friends: friends,
            requests: requests,
            user_id: user_id,
            error: "",
            searchResults: [],
          });
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

      connection.query(
        "SELECT users.*, friendships.is_colleague FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ?",
        [user_id, "accepted"],
        function (err, friends, fields) {
          if (err) throw err;

          connection.query(
            "SELECT users.* FROM friendships JOIN users ON friendships.user_id = users.id WHERE friendships.friend_id = ? AND friendships.status = ?",
            [user_id, "pending"],
            function (err, requests, fields) {
              if (err) throw err;

              res.render("friends", {
                friends: friends,
                requests: requests,
                searchResults: searchResults,
                error: "",
              });
            }
          );
        }
      );
    }
  );
});

router.post("/friends/send-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.body.friend_id;

  connection.query(
    "SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
    [user_id, friend_id, friend_id, user_id],
    function (err, results) {
      if (err) throw err;

      if (results.length > 0) {
        res.render("friends", {
          error: "A friend request is already pending.",
          friends: [],
          requests: [],
          searchResults: [],
        });
      } else {
        connection.query(
          "SELECT organization FROM users WHERE id IN (?, ?)",
          [user_id, friend_id],
          function (err, organizations, fields) {
            if (err) throw err;

            const is_colleague = organizations[0].organization === organizations[1].organization ? 1 : 0;

            connection.query(
              "INSERT INTO friendships (user_id, friend_id, status, is_colleague) VALUES (?, ?, ?, ?)",
              [user_id, friend_id, "pending", is_colleague],
              function (err, result) {
                if (err) throw err;

                res.redirect("/friends");
              }
            );
          }
        );
      }
    }
  );
});

router.post("/friends/accept-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const request_id = req.body.request_id;

  connection.query(
    "SELECT is_colleague FROM friendships WHERE user_id = ? AND friend_id = ?",
    [request_id, user_id],
    function (err, result) {
      if (err) throw err;
      const is_colleague = result[0].is_colleague;

      connection.query(
        "UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?",
        ["accepted", request_id, user_id],
        function (err, result) {
          if (err) throw err;

          connection.query(
            "INSERT INTO friendships (user_id, friend_id, status, is_colleague) VALUES (?, ?, ?, ?)",
            [user_id, request_id, "accepted", is_colleague],
            function (err, result) {
              if (err) throw err;

              res.redirect("/friends");
            }
          );
        }
      );
    }
  );
});

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

router.get("/account", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const editing = req.query.editing === 'true';

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [user_id],
    function (err, rows, fields) {
      if (err) throw err;

      const user = rows[0];

      res.render("account", { user: user, editing: editing });
    }
  );
});

// Delete account and remove friendships
router.post("/delete-account", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  // Delete friendships
  connection.query(
    "DELETE FROM friendships WHERE user_id = ? OR friend_id = ?",
    [user_id, user_id],
    function (err, result) {
      if (err) throw err;

      // Delete user
      connection.query(
        "DELETE FROM users WHERE id = ?",
        [user_id],
        function (err, result) {
          if (err) throw err;

          // Clear user_id cookie
          res.clearCookie("user_id");

          // Redirect to login page
          res.redirect("/login");
        }
      );
    }
  );
});

router.post("/edit-account", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const { username, email, organization, role } = req.body;

  connection.query(
    "UPDATE users SET username = ?, email = ?, organization = ?, role = ? WHERE id = ?",
    [username, email, organization, role, user_id],
    function (err, result) {
      if (err) throw err;

      // Redirect back to account page
      res.redirect("/account");
    }
  );
});

router.get("/renewal", function (req, res) {
  res.render("renewal");
});

module.exports = router;
