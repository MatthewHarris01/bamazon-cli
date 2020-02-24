# bamazon-cli
This is a node CLI application utilizing mySQL to simulate an online store &mdash; customers may order products, managers may add new products and view or update inventory levels, supervisors may see reports showing the total earnings of various departments, and similar store management actions

# Version 0.1
started writing a dbcontrol.js module which will contain all of the code to create and manipulate the database, exportging specific functions used by other code modules. Started the bamazoncustomer.js module. Currently working on a means to detect whether the "bamazon" database currently exists, if it does not exits, user will be asked whether or not to create it.
