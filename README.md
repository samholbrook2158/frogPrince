# frogPrince

## Steps to set up

Download vs code: https://code.visualstudio.com/download 

Download node.js: https://nodejs.org/en/download/

Download xampp: https://www.apachefriends.org/download.html
start apache server and mysql.

Find your xampp directory on Windows this will usually be "C:\xampp" if you left it as the default instaltion settings. On Mac/Linux you can find the xampp folder in your Applications folder. From here go to the "htdocs" folder and place this repository folder inside. This is important if you want to run the web platform locally on your device. 

Open the xampp application and start the spache server and mysql server, click 'admin' button next on mysql(Windows) or enter "localhost/phpmyadmin/"(Mac/Windows/linux). Now click on the import button. From here you will need to select the file and find the "chat_app.sql" file which will be stored in the MySQL chat_app" folder in this repository. Leave all other settings alone and click import at the bottom.

Inside terminal with project open enter "npm install". This should install all packages based off what is inside the packages folder that you installed.

Click new terminal in vscode and enter "nodemon app.js". The nodemon command might not work on Mac so please use "npm app.js" instead. Using nodemon instead of node allows for server to automatically restart when any change are saved

Go to browser and enter "localhost:3000/login"

## Information

Views folder holds html files that are ejs file format (embedded javascript), public/css folder is all the css files. Main javascript files are in main folder.
