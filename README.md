# frogPrince

## Steps to set up

Download vs code: https://code.visualstudio.com/download 

Download node.js: https://nodejs.org/en/download/

Download xampp: https://www.apachefriends.org/download.html
start apache server and mysql.

Click admin button next on mysql and go to sql tab and enter the following sql commands. For the users table: "CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  Email VARCHAR(255),
  organization VARCHAR(255)
);"

For the messages table: "CREATE TABLE messages (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INT(11)
);"

Inside terminal with project open enter "npm install". This should install all packages based off what is inside the packages folder that you installed.

Click new terminal in vscode and enter "nodemon app.js"

Go to browser and enter "localhost:3000/login"

## Information

Views folder holds html files that are ejs file format (embedded javascript), public/css folder is all the css files. Main javascript files are in main folder.
