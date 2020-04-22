# bamazon-cli
This is a node CLI application utilizing mySQL to simulate an online store &mdash; customers may order products, managers may add new products and view or update inventory levels, supervisors may see reports showing the total earnings of various departments, and similar store management actions

# Version 0.1
started writing a dbcontrol.js module which will contain all of the code to create and manipulate the database, exportging specific functions used by other code modules. Started the bamazoncustomer.js module. Currently working on a means to detect whether the "bamazon" database currently exists, if it does not exits, user will be asked whether or not to create it.
# Version 0.2
push to backup current code base.
# Version 0.3
Code to display all products and products by department completed and working. next step is to create the code to handle a users purchase.
# Version 0.4
push to backup current code base.
# Version 0.5
push to backup current code base. Now using "readline-sync" to get user input. Code successfully waits for user input
# Version 0.6
push to backup current code base. Customer module is almost 100% complete, code now verifies there is sufficient inventory for a product, and verifies the user's selection for item and quantity. Remaining to do is complete the update of inventory in the Products table, and add a new row for the transaction to the Sales table.
# Version 0.7
push to backup current code base. Customer module 100% complete, inentory is successfully updated after a confirmed purchase. For a variety of reasons upating the Sales table has been abandoned.
# Version 1.0 
removed some extraneous files. This is a 100% complete version of the customer shopping module.
# Version 1.1 -- fixes the issue where the program did not completely terminate and return control of the terminal window, th problem was caused bya missing "return" statement.

# Known Issues
Choosing "Start Over" or "continue shopping" at the end of the purchase process results in a mysql time-out error for the mysql query that selects products from the database
