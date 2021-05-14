var cookieParser = require('cookie-parser'); // Keep track of transient data
app.use(cookieParser()); // Middleware which parses cookies attached to the client request object

var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.cookie('name', 'express').send('cookie set'); //Sets name = express
   //Expires after 360000 ms from the time it is set.
   res.cookie(name, 'value', { expire: 360000 + Date.now() }); // Absolute time
   //This cookie also expires after 360000 ms from the time it is set.
   res.cookie(name, 'value', { maxAge: 360000 }); // Relative time
});

// Check if cookie is set  via browser console.log(document.cookie);

// Delete a cookie
// app.get('/clear_cookie_foo', function(req, res){
// res.clearCookie('foo');
// res.send('cookie foo cleared');
// });

console.log('Cookies: ', req.cookies);

app.listen(3000);