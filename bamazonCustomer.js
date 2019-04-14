var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

intValidate = function (value) {
    if (!isNaN(value)) {
        return true;
    }
    else {
        return console.log("That is not a valid price. Numbers only.")
    }
}

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log('Thank you for visiting Bamazon. Here is a list of our current products');
        console.log('-----------------------------------------------------------------------')

        var table = new Table({
            head: ['Product Id', 'Product Name', 'Product Price', 'Currently in stock'],
            colWidths: [15, 25, 15, 35]
        });

        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].id, results[i].product_name, `$${results[i].price}`, results[i].stock_quantity]
            );
        }
        console.log(table.toString());
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
                            inquirer
                                .prompt([
                                    {
                                        type: "confirm",
                                        message: "Would you like to purchase another item?",
                                        name: "confirm",
                                        default: true
                                    }
                                ])
                                .then(function (answer) {
                                    if (answer.confirm === true) {
                                        start();
                                    }
                                    else {
                                        connection.end();
                                        return console.log("Thank you for choosing Bamazon!");
                                    }
                                });
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

