// Borrowed and modified code from Noah Kim's Assignment2
function navbar() {
    document.write(`
    <ul>
        <li><a href="./products_display.html?product_key=Krave%20Beauty"><img src="images/logo.png" width="10%" height="auto" style="padding:10px"></a></li><br>
        <li><a href="./invoice.html${location.search}">Shopping Cart</a></li>
        <li><a href="./login.html${location.search}">Login</a></li>
        <li><a href="./register.html${location.search}">Registration</a></li>
        <li><a href="./logout">Logout</a></li><br>
       
    `);
    for (let product_key in allproducts) { 
        if (product_key == this_product_key) continue; // if product key that currently at is there, continue
        document.write(`<li><a href='./products_display.html?product_key=${product_key}'>${product_key}</a></li>`);
    }
    document.write(`
    </ul>
    `);
    }