# frogPrince

## Steps to set up

Download vs code: https://code.visualstudio.com/download 

Download node.js: https://nodejs.org/en/download/

Download xampp: https://www.apachefriends.org/download.html
start apache server and mysql.

Click admin button next on mysql(Windows) or enter "localhost/phpmyadmin/"(Mac). First click new on the list of databases on the left of the page and do not change any of the settings for set up but just name the database "chat_app". 
Create a new database by clicking on the "New" button on the left-hand side and giving it a name.
Select the new database from the left-hand sidebar and click on the "Import" tab at the top.
Click on the "Choose File" button and select the SQL dump file you provided.
Click on the "Go" button at the bottom to import the database.Then inside the DB go to sql tab and enter the following sql commands. 

For the users table: "CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  Email VARCHAR(255),
  organization VARCHAR(255),
  role VARCHAR(255)
);"

For the friend list table: "CREATE TABLE `friendships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` ENUM('pending', 'accepted', 'declined') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);"

For the chatting with friends table: "CREATE TABLE messages (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sender_id INT(11) NOT NULL,
  receiver_id INT(11) NOT NULL,
  message VARCHAR(255),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  original_filename VARCHAR(255),
  file_path VARCHAR(255)
);"

Inside terminal with project open enter "npm install". This should install all packages based off what is inside the packages folder that you installed.

Click new terminal in vscode and enter "nodemon app.js". The nodemon command might not work on Mac so please use "npm app.js" instead. Using nodemon instead of node allows for server to automatically restart when any change are saved

Go to browser and enter "localhost:3000/login"

## Information

Views folder holds html files that are ejs file format (embedded javascript), public/css folder is all the css files. Main javascript files are in main folder.
