# bamazon

A node.js & MySql application using the Inquirer node module to simulate an online purchase environment.


bamazonCustomer.js - begins with displaying available products and their corresponding prices, unique-id's, and the total number of them currently in stock. The intent of this application is to prompt the user with the available products and then allow them to purchase the item and a specified quantity using the id as the selector. The application currently processes the purchase, but only if there is a quantity available to fulfill their order, and then issues a console statement of the receipt displaying the product they purchased and the total cost. The application then prompts the user and asks if they would like to continue shopping.

bamazonManager.js - The requirements of this exercise were to:

    Give the user a manager's perspective of the simulated online purchasing environment, allowing this user to - 
        1. View current products for sale. 
        2. View low inventory.
        3. Add to inventory. 
        4. Add a new product.

![Customer Start with Table](/screenshots/customerViewStart.png)
![Unsucessful purchase due to lack of inventory](/screenshots/purchaseUnsuccessful)
![Successful purchase displaying total cost](/screenshots/purchaseSuccessful)

    View Current Products
        1. Displays available products, then follows with asking the user if they would like to add a new product.
        2. View low inventory - iterates through the array of results in the mysql database and searches for 
            any item that has a stock_quantity of less than 3, then pushes them into a separate table. Then, a short conditional determines whether a table of the low inventory items needs to be displayed, and if not, will console log that there are no items currently with low inventory. Then, the application asks the user if they would like to add to inventory.
        3. Add to inventory - requests product id and quantity to add to inventory, then updates database with new quantity and displays in console.
        4. Add new product - inserts into the product table of the shopping database, allowing insertion of product_name, price, initial stock_quantity, and the name of the department it belongs to.





![View inventory](/screenshots/viewLow)
![Add new product](/screenshots/addNew)

