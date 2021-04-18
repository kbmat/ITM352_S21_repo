// The following was taken from Lab 13
// Followed Professor Port's Screencast
var products = require('./product_data.json'); // set variable of products from product data to products
console.log(products);
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs'); // Built in module, load in fs package to use 
const { response } = require('express');
const queryString = require('querystring');

// Read user data file
var user_data_file = './user_data.json'; // Load in user data
if (fs.existsSync(user_data_file)) { // Check to see if file exists
    var file_stats = fs.statSync(user_data_file);
    // console.log(`${user_data_file} has ${file_stats["size"]} characters`);
    var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8')); // return string, parse into object, set object value to user_data
}
else {
    console.log(`${user_data_file} does not exist!`);
}

app.all('*', function (req, res, next) {
    console.log(req.method, req.path);
    next();
});


app.get("/product_data.js", function (request, response, next) { // Load in product data
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
 });
 

// ------ Process Login Form ----- //
// Followed Professor Port's Screencast + Borrowed code from Alyssa Mencel code
// Got help from Professor Port during office hours
app.post('/process_login', function (request, response, next) {
    console.log(request.query);
    delete request.query.username_error;
    delete request.query.password_error;
    username = request.body.username.toLowerCase(); // Username as all lower case
    if (typeof user_data[username] != 'undefined') { // check if username is in user data
        if (user_data[username].password == request.body.psw) { // check if password entered matches data
        console.log(user_data[username].name);
        request.query.name = user_data[username].name;
        request.query.email = user_data[username].email;
        response.redirect('/invoice.html?' + queryString.stringify(request.query));
        return; // Redirect to invoice if username and password is correct
    } else { // if passowrd is not entered correctly, stay on same page and notify user
        request.query.username = username;
        request.query.name = user_data[username].name;
        request.query.password_error = 'Invalid Password!';
    }
} else { // If username_entered is not found in user_data,  notif to user the error
        request.query.username = username;
        request.query.username_error = 'Invalid Username!';
    }

response.redirect('./login.html?' + queryString.stringify(request.query));
    


});
// ------ End Process Login Form ----- //


// ------ Process registration form ----- //
app.post('/process_register', function (request, response, next) {
    console.log(request.body);
    var errors = []; 
});
// ------ End Process registration form ----- //


// ------ Process order from products_display ----- //
// Borrowed code from Alyssa Mencel code
app.post('/process_order', function (request, response) {
    let POST = request.body; // create variable for the data entered into products_display

    // Check if quantities are NonNegInt
    if (typeof POST['submitPurchase'] != 'undefined') {
        var haserrors = true; // assume haserrors is true
        var hasquantities = false;
        for (i = 0; i < products.length; i++) {
            qty = POST[`quantity${i}`];
            hasquantities = hasquantities || qty > 0;
            haserrors = haserrors && isNonNegInt(qty);
        }
    }
    const stringified = queryString.stringify(POST);
    if (haserrors && hasquantities) {
        response.redirect('./login.html?' + stringified);
        return; // Stop function
    }
    else {
        response.redirect('./products_display.html?' + stringified)
    }
});
// ------ End Process order from products_display ----- //

// Function to check if value isNonNegInt
function isNonNegInt(q, return_errors = false) { // Checks if the values input are a positive integer
    errors = []; // Initially assumes there are no errors
    if (q == '') q = 0; // If the input is "blank", set the value to 0 
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value. If not, send error with reason.
    else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if string is non-negative. If not, send error with reason.
    else if (parseInt(q) != q) errors.push('<font color="red">Not an integer</font>'); // Check that it is an integer. If not, send error with reason.
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });