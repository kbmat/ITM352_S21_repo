var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');

var products = require('./product_data.json');

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + ' with query' + JSON.stringify(request.query));
    next(); // Go onto next route
});

app.get("/product_data.js", function (request, response, next) { 
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});


app.get('/test', function (request, response, next) { // set path location to test
    response.send('I got a request for /test');
});

// This processes the form from the order_page.html
app.post('/display_purchase', function (request, response, next) { // set path location to test
    process_quantity_form(request.body, request, response);
});

app.use(express.static('./public')); // sets up response to get requests to a particular path sets up a static web server

app.listen(8080, function () {
    console.log(`listening on port 8080`)
}
); // note the use of an anonymous function here

function isNonNegInt(q, returnErrors = false) {
    if (q == '') q = 0; // if the value of the text box is “blank” or ‘’, set to value to 0 //
    var errors = []; // Assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}

function process_quantity_form(post_data, request, response) {

    if (post_data['quantity_textbox']) {
        the_qty = post_data['quantity_textbox'];
        let prod_num = post_data['product_select'];
        let model = products[prod_num]['model'];
        let model_price = products[prod_num]['price'];
        if(isNonNegInt(the_qty)) {
            response.send(`<h2>Thank you for purchasing ${the_qty} ${model}. Your total is \$${the_qty * model_price}!</h2>`);
            return; // Finish responding
        }
        else {
            response.redirect('./order_page.html?quantity_textbox='+the_qty); // Redirect to same page
            return;
        }
    }
}
