// The following was taken from Lab 13
// Followed Professor Port's Screencast
var express = require('express'); 
var app = express();
var myParser = require("body-parser"); // Component that will take data from body request and get the data 
app.use(myParser.urlencoded({ extended: true}));
var qs = require('qs');
var fs = require('fs'); // Built in module, load in fs package to use 
const { runInNewContext } = require('vm');

// var users_reg_data = require('./user_data.json');
// Read user data file
var user_data_file = './user_data.json';
if (fs.existsSync(user_data_file)) { // Check to see if file exists
    var file_stats = fs.statSync(user_data_file);
    // console.log(`${user_data_file} has ${file_stats["size"]} characters`);
    var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8')); // return string, parse into object, set object value to user_data
}
else {
    console.log(`${user_data_file} does not exist!`);
}

app.all('*', function (request, response, next) {
    console.log(request.method, request.path);
    next();
});

app.post('/process_register', function (request, response) {
// Add a new user to the database
username = request.body["username"];
if (typeof user_data[username] == 'undefined') {
    user_data[username] = {}; // Assign username an empty object 
    if (username['psw'] == username['psw-repeat']) {
        user_data[username]["password"] = request.body["psw"]; // Assign password_entered to password of username
    }
    else {
        response.send('Passwords do not match');
    }
    user_data[username].email = request.body["email"]; // Assign email_entered to email of username
    user_data[username].name = request.body["fullname"]; // Assign name_entered to name of username
// Save updated user_data to file
    fs.writeFileSync(user_data_file, JSON.stringify(user_data));
    response.send(`${username} is registered!`);
    response.redirect('./login.html');
} else {
    response.send(`${username} is taken`);
}
});


// Followed Professor Port's Screencast //

// This processes the login form 
app.post('/process_login', function (request, response, next) { // Post to process login then execute function
    console.log(request.body); // Output request body in console, data from form put into post request
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];
    if(typeof user_data[username_entered] != 'undefined') { // Check is the username entered is in the user data
        if (user_data[username_entered]['password'] == password_entered) { // Check if the username_entered and password_entered matches the password in their user data
            response.send(`${username_entered} is logged in`); // if password_entered matches password in the user_data, send response saying "user is logged in"
        } else {
            response.send(`${username_entered} password is incorrect`); // if password_entered does not match password in the user_data, send response saying "password is incorrect"
        }
    } else {
        response.send(`${username_entered} not found`); // If username entered is not in the user data, send error that username entered is not found
    }
});

// This processes the register form 
app.post('/process_register', function (request, response, next) {
    response.send(request.body);
    response.redirect('./login.html');
})

app.use(express.static('./public'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port)});