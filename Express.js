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

function setUnreadCountToZero(user_id, friend_id, callback) {
  connection.query(
    "UPDATE friend_chats SET is_read = 1 WHERE receiver_id = ? AND sender_id = ? AND is_read = 0",
    [user_id, friend_id],
    function (err, result) {
      if (err) {
        console.error("Error setting unread count to zero:", err);
        return callback(err);
      }

      callback(null);
    }
  );
}

router.get("/about", function (req, res) {
  const user_id = req.cookies.user_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

    res.render("about", {
      totalUnreadMessages: totalUnreadMessages
    });
  });
});

router.get("/FAQ", function (req, res) {
  const user_id = req.cookies.user_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

    res.render("FAQ", {
      totalUnreadMessages: totalUnreadMessages
    });
  });
});

router.get("/messages", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

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

        connection.query("SELECT renewals.* FROM renewals JOIN friendships ON renewals.user_id = friendships.user_id AND renewals.friend_id = friendships.friend_id WHERE friendships.user_id = ?", [user_id], function (err, renewals) {



          const colleagueFriends = friends.filter(friend => friend.is_colleague === 1);
          const clientFriends = friends.filter(friend => friend.is_colleague !== 1);
          const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

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
              colleagueUnreadCount: unreadCounts.colleagueUnreadCount,
              clientUnreadCount: unreadCounts.clientUnreadCount,
              totalUnreadMessages: totalUnreadMessages,
              renewals: renewals,
            });
          }
        }
        );
      });
  });
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

function updateIsReadStatus(user_id, friend_id, callback) {
  connection.query(
    "UPDATE friend_chats SET is_read = 1 WHERE receiver_id = ? AND sender_id = ? AND is_read = 0",
    [user_id, friend_id],
    function (err, result) {
      if (err) {
        console.error("Error updating is_read status:", err);
        return callback(err);
      }

      callback(null);
    }
  );
}

router.get("/messages/:friend_id", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.params.friend_id;

  updateIsReadStatus(user_id, friend_id, function (err) {
    if (err) {
      console.error("Error updating is_read status:", err);
      return res.status(500).send("Failed to update is_read status");
    }

    setUnreadCountToZero(user_id, friend_id, function (err) {
      if (err) {
        console.error("Error updating unread count:", err);
        return res.status(500).send("Failed to update unread count");
      }

      getUnreadCounts(user_id, function (err, unreadCounts) {
        if (err) {
          console.error("Error fetching unread counts:", err);
          return res.status(500).send("Failed to fetch unread counts");
        }

        connection.query(
          "SELECT users.id as friend_id, users.username as friend_name, friendships.is_colleague, COUNT(friend_chats.is_read=0 OR NULL) as unread_count FROM friendships JOIN users ON friendships.friend_id = users.id LEFT JOIN friend_chats ON friendships.friend_id = friend_chats.sender_id AND friend_chats.receiver_id = ? AND friend_chats.is_read = 0 WHERE friendships.user_id = ? AND friendships.status = ? GROUP BY users.id, friendships.is_colleague",
          [user_id, user_id, "accepted"],
          function (err, friends, fields) {
            if (err) throw err;

            connection.query("SELECT renewals.* FROM renewals JOIN friendships ON renewals.user_id = friendships.user_id AND renewals.friend_id = friendships.friend_id WHERE friendships.user_id = ?",
              [user_id], function (err, renewals) {

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
                      renewals: renewals,
                    });
                  }
                );
              }
            );
          });
      });
    });
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

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

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
              totalUnreadMessages: totalUnreadMessages, // Pass the totalUnreadMessages variable
            });
          }
        );
      }
    );
  });
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

              getUnreadCounts(user_id, function (err, unreadCounts) {
                if (err) {
                  console.error("Error fetching unread counts:", err);
                  return res.status(500).send("Failed to fetch unread counts");
                }

                const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

                res.render("friends", {
                  friends: friends,
                  requests: requests,
                  searchResults: searchResults,
                  error: "",
                  totalUnreadMessages: totalUnreadMessages
                });
              }
              );
            }
          );
        }
      );
    });
});

router.post("/friends/send-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const friend_id = req.body.friend_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

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
            totalUnreadMessages: totalUnreadMessages
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
});

router.post("/friends/accept-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const request_id = req.body.request_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

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
});

router.post("/friends/decline-request", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const request_id = req.body.request_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

    connection.query(
      "UPDATE friendships SET status = ? WHERE user_id = ? AND friend_id = ?",
      ["declined", request_id, user_id],
      function (err, result) {
        if (err) throw err;

        res.redirect("/friends");
      }
    );
  });
});

router.get("/account", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;
  const editing = req.query.editing === 'true';

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [user_id],
      function (err, rows, fields) {
        if (err) throw err;

        const user = rows[0];

        res.render("account", { user: user, editing: editing, totalUnreadMessages: totalUnreadMessages });
      }
    );
  });
});

// Delete account and remove friendships
router.post("/delete-account", checkAuth, function (req, res) {
  const user_id = req.cookies.user_id;

  getUnreadCounts(user_id, function (err, unreadCounts) {
    if (err) {
      console.error("Error fetching unread counts:", err);
      return res.status(500).send("Failed to fetch unread counts");
    }

    const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

    // Delete renewals
    connection.query(
      "DELETE FROM renewals WHERE user_id = ?",
      [user_id],
      function (err, result) {
        if (err) throw err;

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
      }
    );
  });
});

    router.post("/edit-account", checkAuth, function (req, res) {
      const user_id = req.cookies.user_id;
      const { username, email, organization, role } = req.body;

      getUnreadCounts(user_id, function (err, unreadCounts) {
        if (err) {
          console.error("Error fetching unread counts:", err);
          return res.status(500).send("Failed to fetch unread counts");
        }

        const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

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
    });

    router.get("/renewal", checkAuth, function (req, res) {
      const user_id = req.cookies.user_id;

      // Fetch external contacts
      connection.query(
        "SELECT users.id as friend_id, users.username as friend_name, friendships.is_colleague FROM friendships JOIN users ON friendships.friend_id = users.id WHERE friendships.user_id = ? AND friendships.status = ? AND friendships.is_colleague = 0 GROUP BY users.id, friendships.is_colleague",
        [user_id, "accepted"],
        function (err, externals) {
          if (err) {
            console.error("Error fetching external contacts:", err);
            return res.status(500).send("Failed to fetch external contacts");
          }

          console.log(externals); // Add this line

          getUnreadCounts(user_id, function (err, unreadCounts) {
            if (err) {
              console.error("Error fetching unread counts:", err);
              return res.status(500).send("Failed to fetch unread counts");
            }

            const totalUnreadMessages = unreadCounts.colleagueUnreadCount + unreadCounts.clientUnreadCount;

            res.render("renewal", {
              externals: externals,
              totalUnreadMessages: totalUnreadMessages,
            });
          });
        }
      );
    });

    router.post("/renewal", checkAuth, function (req, res) {
      const user_id = req.cookies.user_id;
      const friend_id = req.body.friend_id;
      const product_name = req.body.product_name;
      const start_date = req.body.start_date;
      const end_date = req.body.end_date;
      const details = req.body.details;
      const status = req.body.status;
      const price = Number(req.body.price);
      const renewal_date = req.body.renewal_date;
      const contract_duration = req.body.contract_duration;  // new field
      const consulting_hours = Number(req.body.consulting_hours);  // new field

      // Insert renewal into the database
      connection.query(
        "INSERT INTO renewals (user_id, friend_id, product_name, start_date, end_date, details, status, price, renewal_date, contract_duration, consulting_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [user_id, friend_id, product_name, start_date, end_date, details, status, price, renewal_date, contract_duration, consulting_hours],
        function (err, result) {
          if (err) {
            console.error("Error creating renewal:", err);
            return res.status(500).send("Failed to create renewal");
          }
          res.redirect("/renewal");
        }
      );
    });


    router.get("/chart", function (req, res) {
      // Query to get renewals data
      connection.query("SELECT renewal_date, price FROM renewals WHERE user_id = ? ORDER BY renewal_date ASC", [req.cookies.user_id], function (err, renewals) {
        if (err) {
          console.error("Error fetching renewals:", err);
          return res.status(500).send("Failed to fetch renewals");
        }
        // Pass the renewals data to the chart view
        res.render("messages", { renewals: renewals });
      });
    });



    module.exports = router;
