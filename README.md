# frogPrince

## Steps to set up

Download vs code: https://code.visualstudio.com/download 

Download node.js: https://nodejs.org/en/download/

Download xampp: https://www.apachefriends.org/download.html
start apache server and mysql.

Click admin button next on mysql(Windows) or enter "localhost/phpmyadmin/"(Mac). First click new on the list of databases on the left of the page and do not change any of the settings for set up but just name the database "chat_app". 
After creating find the import tab near the top of the page. From here you will need to select the file and find the "chat_app.sql" file which will be stored in the MySQL chat_app" folder in this repository. Leave all other settings alone and click import at the bottom.

Inside terminal with project open enter "npm install". This should install all packages based off what is inside the packages folder that you installed.

Click new terminal in vscode and enter "nodemon app.js". The nodemon command might not work on Mac so please use "npm app.js" instead. Using nodemon instead of node allows for server to automatically restart when any change are saved

Go to browser and enter "localhost:3000/login"

## Information

Views folder holds html files that are ejs file format (embedded javascript), public/css folder is all the css files. Main javascript files are in main folder.
