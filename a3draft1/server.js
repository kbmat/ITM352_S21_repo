// Author: Kimberly Matutina //
// Date: 04/19/2021 //
// This file is my server // 
// Borrowed and modified code from Lab 13, 14 + Alyssa Mencel Assignment 2 https://github.com/amencel/ITM352_F20_repo/tree/master/mencel_alyssa_assignment2
// Followed Professor Port's Screencast
var products = require('./products.json'); // set variable of products from product data to products
console.log(products);
var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());
var qs = require('qs');
var fs = require('fs'); // Built in module, load in fs package to use
var session = require('express-session');
app.use(session({secret: "ITM352 rockz!"})); // Start sessions

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

app.post("/get_products_data", function (request, response, next) { // Load in product data
    response.json(products);
});

// ------ Process Login Form ----- //
// Followed Professor Port's Screencast + Borrowed and modified code from Alyssa Mencel assignment 2 code https://github.com/amencel/ITM352_F20_repo/tree/master/mencel_alyssa_assignment2
// Got help from Professor Port during office hours
app.post('/process_login', function (request, response, next) {
    console.log(request.query);
    delete request.query.username_error; // Deletes error from query after fixed
    delete request.query.password_error; // Deletes error from query after fixed
    username = request.body.username.toLowerCase(); // Username as all lower case
    if (typeof user_data[username] != 'undefined') { // Check if username entered exists in user data
        if (user_data[username].password == request.body.psw) { // Check if password entered matches password in user data
            console.log(user_data[username].name);
            request.query.name = user_data[username].name;
            request.query.email = user_data[username].email;
            response_string = `<script>
            alert('${user_data[username].name} Login Successful!');
            location.href = "${'./invoice.html?' + qs.stringify(request.query)}";
            </script>`;
            response.send(response_string); // If no errors found, redirect to invoice with query string of username information and products
            return; 
        } else { // If password is not entered correctly, send error alert
            request.query.username = username;
            request.query.name = user_data[username].name;
            request.query.password_error = 'Invalid Password!';
        }
    } else { // If username entered is not found in user data, send error alert
        request.query.username = username;
        request.query.username_error = 'Invalid Username!';
    }
    response.redirect('./login.html?' + qs.stringify(request.query)); // If there are errors, redirect to same page
});
// ------ End Process Login Form ----- //


// ------ Process Registration form ----- //
app.post('/process_register', function (request, response, next) {
    console.log(request.body);
    var errors = [];

    // -------------- Full name validation -------------- //
    // Full name only allow letters
    if (/^[A-Za-z]+ [A-Za-z]+$/.test(request.body.fullname) == false) {
        errors.push('Only letter characters allowed for Full Name')
    }

    // Full name maximum character length is 30
    if ((request.body.fullname.length > 30 || request.body.fullname.length < 1)) {
        errors.push('Full Name must contain Maximum 30 Characters')
    }

    // -------------- Username validation -------------- //
    // Username all lowercase (case insensitive)
    username = request.body.username.toLowerCase();

    // Check if username is in user data. If so, push username taken error
    if (typeof user_data[username] != 'undefined') {
        errors.push('Username taken');
    }
    // Username only allow letters and numbers
    if (/^[0-9a-zA-Z]+$/.test(request.body.username) == false) {
        errors.push('Only Letters And Numbers Allowed for Username');
    }
    // Username minimum character length is 4 maximum character length is 10
    if ((request.body.username.length > 10 || request.body.username.length < 4)) {
        errors.push('Username must contain at least 4 characters and a maximum of 10 characters')
    }

    // -------------- Email validation -------------- //
    // Email only allows certain character for x@y.z
    if (/[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(request.body.email) == false) {
        errors.push('Must enter a valid email (username@mailserver.domain).');
    }

    // -------------- Password validation -------------- //
    // Password minumum 6 characters // 
    if (request.body.password.length < 6) {
        errors.push('Password Minimum 6 Characters')
    }
    // -------------- Repeat Password validation -------------- //
    // Check if password matches repeat password
    if (request.body.password !== request.body.repeat_password) {
        errors.push('Passwords Do Not Match')
    }

    // Borrowed some code from Lab 14 // 
    // If there are no errors, save info to user data
    if (errors.length == 0) {
        POST = request.body
        console.log('No errors found')
        var username = POST['username']
        user_data[username] = {}; // Register it as user's information
        user_data[username].name = request.body.fullname; // POST user's name
        user_data[username].password = request.body.password; // POST user's password
        user_data[username].email = request.body.email; // POST user's email
        data = JSON.stringify(user_data);
        fs.writeFileSync(user_data_file, data, "utf-8"); // Add new user to user data json file
        request.query.name = user_data[username].name;
        request.query.email = user_data[username].email;
        response_string = `<script>alert('${user_data[username].name} Registration Successful!');
        location.href = "${'./invoice.html?' + qs.stringify(request.query)}";
        </script>`;
        response.send(response_string);
        // If no errors, send window alert success
    }
    // If there are errors redirect to registration page & keep info in query string
    if (errors.length > 0) {
        console.log(errors)
        request.query.fullname = request.body.fullname;
        request.query.username = request.body.username;
        request.query.email = request.body.email;
        // Add errors to query string
        request.query.errors = errors.join(';');
        response.redirect('register.html?' + qs.stringify(request.query));
    }
});
// ------ End Process registration form ----- //



// ------ Process order from products_display ----- //
// Got help from Professor Port during office hours
app.post('/add_to_cart', function (request, response) {
    let POST = request.body; // create variable for the data entered into products_display
    console.log(POST);
    var qty = POST["prod_qty"];
    var ptype = POST["prod_type"];
    var pindex = POST["prod_index"];
    if (isNonNegInt(qty)) {
        // Add qty data to cart session
        if (typeof request.session.cart == "undefined") {
            request.session.cart = {};
        }
        if (typeof request.session.cart[ptype] == "undefined") {
            request.session.cart[ptype] = [];
        }
        request.session.cart[ptype][pindex] = qty;
        console.log(request.session);
        response.json({"status":"Successfully Added to Cart"});
    } else {
        response.json({"status":"Invalid quantity, Not added to cart"});
    }
});
// ------ End Process order from products_display ----- //

// ------ Get info from session ----- //
app.post('/get_cart', function (request, response) {
    console.log(request.session.cart);
    response.json(request.session.cart);
});

// Function to check if value isNonNegInt
// Borrowed function from Assignment 1
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