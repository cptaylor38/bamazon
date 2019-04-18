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

function start() {
    inquirer
        .prompt([
            {
                name: "command",
                type: "rawlist",
                message: "Options:",
                choices: ["View products for sale.", "View low inventory.", "Add to inventory.", "Add new product."]
            }
        ])
        .then(function (answer) {
            console.log(answer.command)
            switch (answer.command) {
                case 'View products for sale.':
                    console.log('view products');
                    viewProducts();
                    break;
                case 'View low inventory.':
                    viewInventory();
                    break;
                case 'Add to inventory.':
                    addInventory();
                    break;
                case 'Add new product.':
                    addProduct();
                    break;
            }
        });
};

function returnToMenu() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to return to the main menu?",
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
                return console.log("You may close the application now.");
            }
        });
}

function viewProducts() {
    console.log("this is running");
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log('Current products listed:')
        var table = new Table({
            head: ['Product Id', 'Product Name', 'Product Price'],
            colWidths: [15, 35, 15]
        });

        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].id, results[i].product_name, `$${results[i].price}`]
            );
        }
        console.log(table.toString());

        inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "Would you like to add a new product?",
                    name: "confirm",
                    default: true
                }
            ])
            .then(function (answer) {
                if (answer.confirm === true) {
                    addProduct();
                }
                else {
                    connection.end();
                    return console.log("You may close the application now.");
                }
            });

    });
};

function viewInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log('Current inventory:');
        var table = new Table({
            head: ['Product Id', 'Product Name', 'Product On-hand'],
            colWidths: [15, 35, 15]
        });
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 3) {
                table.push(
                    [results[i].id, results[i].product_name, `${results[i].stock_quantity}`]
                );
            }
        }

        if (table.length === 0) {
            console.log('No low inventory alerts at this time.');
        }
        else {
            console.log(table.toString());
        }

        inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "Would you like to update inventory at this time?",
                    name: "confirm",
                    default: true
                }
            ])
            .then(function (answer) {
                if (answer.confirm === true) {
                    addInventory();
                }
                else {
                    connection.end();
                    return console.log("You may close the application now.");
                }
            });
    });
};

function addInventory() {
    inquirer
        .prompt([
            {
                name: "id",
                type: 'input',
                message: "Inventory product Id:"
            },
            {
                name: "quantity",
                type: "input",
                message: "Increase inventory by:"
            }
        ])
        .then(function (answer) {
            var chosenItem;
            var newQuantity;
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === parseInt(answer.id)) {
                        chosenItem = results[i];
                    }
                }
                newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);
                updateStock(chosenItem, newQuantity);
            });
        });
};

function updateStock(chosenItem, newQuantity) {
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
            console.log(`
                New inventory updated for: Product #${chosenItem.id} - ${chosenItem.product_name} to ${newQuantity}.
                ------------------------------------------------------------------------------------------------
            `);
            returnToMenu();
        }
    );
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Product name:"
            },
            {
                name: "department",
                type: "input",
                message: "Department of product:"
            },
            {
                name: "price",
                type: "input",
                message: "How much does this item cost:"
            },
            {
                name: "stock",
                type: "input",
                message: "How many of this product are you adding to inventory:"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err, res) {
                    console.log(`
                    Product ${answer.name} added to ${answer.department} at $${answer.price} with total inventory: ${answer.stock}.
                    -------------------------------------------------------------------------------------------------
                    `);
                    returnToMenu();
                }
            );
        });
};






