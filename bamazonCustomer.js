var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log('Thank you for visiting Bamazon. Here is a list of our current products');
        console.log('-----------------------------------------------------------------------')

        for (var i = 0; i < results.length; i++) {
            console.log(`
            ${results[i].id} - ${results[i].product_name}: ${results[i].price}. Currently ${results[i].stock_quantity} in stock.
            -----------------------------------------------------------------------------
            `);
        }


        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What's the id of the item you would like to purchase?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to purchase?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === parseInt(answer.id)) {
                        chosenItem = results[i];
                    }
                }

                if (chosenItem.stock_quantity >= answer.quantity) {

                    console.log(`Your total for ${answer.quantity} of ${chosenItem.product_name} = $${chosenItem.price * answer.quantity}`);
                    var newQuantity = chosenItem.stock_quantity - answer.quantity;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Thank you for your purchase.");
                            start();
                        }
                    );
                }
                else {
                    console.log("Sorry, we don't have enough to fulfill your order.");
                    start();
                }
            });
    });
}

