var mysql = require("mysql");
var Inquire = require("inquirer");
var FS = require("fs");

var dbtools = require("./DBcontrol"); //this require links in the functions exported from the DBControl module.
var customer = require("./bamazonCustomer");

//print the virtual store logo
console.log("|*------------------------------*|");
console.log("|********************************|");
console.log("|****  !WELCOME TO BAMAZON! *****|");
console.log("|***  VIRTUAL ONLINE SHOPPING ***|");
console.log("|********************************|");
console.log("|*------------------------------*|");

var CONX; //this variable will hold a reference to the mysql connection object.





//try to determne if file "dblog.txt" exists
//if the dblog.txt file exists, presume the database has already been created, and the Products table seeded.
//if the dblog.txt file DOES NOT exist, presume the database needs to be created, and the prducts table seeded.
// try {
//   DBexists = (FS.existsSync("dblog.txt"));
// } 
// catch (err) {
//   console.error(err);;
// }


// if (DBexists ==false) {
//   console.log("it is necessary to attempt to create and seed the bamazon database");
//   CreateandSeed();
// }
// else {
//   console.log("presume database has been seeded")
// }


console.log("value of DBexists: " + DBexists);

// return;

//THE FOLLOIGN CODE IS MY PREFERRED TECHNIQUE FOR DETERMINING WHETHER THE DATABASE EXISTS, OR NEEDS TO BE CREATED AND SEEDED.
//now create a mysql connection and attempt to create the database
// var connection = mysql.createConnection( 
//   {
//     host: "localhost",
//     port:3306,
//     user: "root",
//     password: "mhroot",
//     database: "bamazon_db"
//   });

//   try {
//   connection.connect(function(err) {
//     if (err) {
//       console.log("there has been an error connecting to 'bamazon_db', the db should probably be created and seeded.");
//       // console.log(err);
//       //if there has been an error connecting to 'bamazon_db' presume the database needs to be created and seeded.
//       connection.end();
//       CreateandSeed();    //call function to create and seed the bamazon_db database.
//     }

//     //end the current connection
//     connection.end();


// //if there is no error, presume the db exists and should not be messed with
//   });

// }
// catch {
//   console.log("an error occured when trying to connect to the bamazon database")
// }


// function CreateandSeed() {
//   //this function creates the bamazon_db datase, and seeds the Products table.
//   console.log("inside the CreatandSeed function");

//   console.log("--------------------------------------------------");

//   //now make a new connection generically to mysql and execute the SQL to create a table, and populate it.
//   let connection =mysql.createConnection( {
//     host: "localhost",
//     port:3306,
//     user: "root",
//     password : "mhroot",
//   })
//   connection.connect(function(err) {
//     if (err) throw err;
// console.log("CONNECTED AS ID: " + connection.threadId);


//     //this is the SQL to Create "bamazon_db", and to create and seed the Products table.
//     connection.query("CREATE DATABASE IF NOT EXISTS bamazon_db;" + 
//       "USE bamazon_db;" + 
//       "CREATE TABLE IF NOT EXISTS  Products ( " + 
//       	"itemId INT(10) NOT NULL AUTO_INCREMENT, " + 
//         "ProductName VARCHAR(80) NOT NULL, " + 
//         "DeptId INT(2) NOT NULL," + 
//         "SellPrice DECIMAL(10,2) NOT NULL, " + 
//         "Quantity INT(3) NOT NULL, " + 
//         "PRIMARY KEY (itemId) " +
//     "); " + 
// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " + 
// " VALUES (1, 'Wide-Screen Monitor', 1, 227.50, 75);" + 

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (2, 'Pen Tablet', 1, 114.99, 15 );" + 

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " + 
// "VALUES (3, 'Trackball', 1, 59.99, 25);" + 

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (4, 'Windbreaker jacket - one size fits all', 2, 19.99, 35 ); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " + 
// "VALUES ( 5, 'Knit hat -- one size fits all', 2, 19.99, 25 ); " + 

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (6, 'Knit socks -- medium size - 3 pairs', 2, 12.99, 30 ); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (7, 'Hand-held vacuum', 3, 89.99, 20 ); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (8, 'Dorm fridge - 3 cubic feet inside', 3, 299.99, 10 ); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (9, 'Electric space heater - 2000 BTU - 1250 Watts',3, 89.99, 10); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (10, 'Post-It notes, blue, 1 by 3 inches', 4, 1.99, 100); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (11, 'Pens (box of 100, ink-color black)', 4, 19.99, 75 ); " +

// "INSERT INTO Products (itemId, ProductName, DeptId, sellprice, Quantity) " +
// "VALUES (12, 'Printer paper (1 ream)', 4, 11.99, 200);"
    
//     );  // end of sql text

//   });
// }


console.log("this is the start of the  MAIN interface");
Inquire.prompt([
  {type: "list",
  name: "action",
  message: "what action do you want to perform?",
  choices: ["Shop", "Manage", "Supervise" ],
  default: "Shop"

}

]).then ( function(answers) {
  console.log("answers: " + JSON.stringify(answers));
  // console.log("you chose 'Shop'");
  console.log("count of answers: " + answers.length);
  let actionselected = answers.action;

  if (actionselected == "Shop") {
    console.log("go to 'shopping' function");
    Shop();
  }
  else {
    console.log("the 'bmazonMAIN' app only permits shopping");
    console.log("To perform manager actions, you must execute the 'bamazonmanager' app.");
    console.log("To perform supervisor actions, you must execute the 'bamazonsupervisor app.")
    return; //end this app if user wants to do anything other than shop
  }
})

function Shop() {
  console.log("inside the Shop function");
Inquire.prompt([
  {
    type: "list",
    name: "action",
    message: "Choose whether to show all products, or place an order right away",
    choices: ["Show all products", "place an order"],
    default: "Show all products"
  }
]).then( function (answers) {
 console.log("the action you chose was: " +  answers.action);
 if (answers.action == "Show all products") {
   console.log("call the ShowAllProducts function")
  //  ShowAllProducts();
 }
 else if (answers.action =="place an order") {
   console.log("call the PlacedOrder function");
 }
 });  //end of then function of the most recent Inquire prompt.

} //end of Shop function

