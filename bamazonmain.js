
//*****************************************
//              REQUIRES
var mysql = require("mysql");
var Inquirer = require("inquirer");
var FS = require("fs");
var inputSync = require('readline-sync');
//*****************************************

//*******************************************
//         GLOBAL VARIABLESS
var glbProductID = undefined; //Global var to hold product ID entered by the user
var glbQuantity = undefined;  //Global var to hold quantity the user whishes to buy.
var productIDList = [];   //Global array holds all valid product id numbers.

var CONX; //this variable will hold a reference to the mysql connection object.

//*******************************************

// var dbtools = require("./DBcontrol"); //this require links in the functions exported from the DBControl module.
// var customer = require("./bamazonCustomer");
// var buyitemID;    //global variable to store the current item id that user wants to purchase
// var buyQuantity;  //global variable to store the quantity of the current item the user wants to purchase


//print the virtual store logo
console.log("|*------------------------------*|");
console.log("|********************************|");
console.log("|****  !WELCOME TO BAMAZON! *****|");
console.log("|***  VIRTUAL ONLINE SHOPPING ***|");
console.log("|********************************|");
console.log("|*------------------------------*|");


function RowDivider() {
  console.log("+----+------------------------------------------------------------------------------------+-------+--------+----------+");
}

function Columnhead() {
  //this function console logs a string that is a column heading for row divider in the product list.
  //colum 1 is 7 chars
  var colheading = "+----";
  colheading += "+------------------------------------------------------------------------------------";
  colheading += "+-------";
  colheading += "+--------";
  colheading += "+----------+";

  var colheading2 = "| id ";
  colheading2 += "|                Product Description                                                 | Dept. | Price  | In Stock |";
  // console.log(colheading);
  console.log(colheading2);
}

function ShowProductbyDept(DeptId) {
  //this function displays the product grid for products in a specific department
  //there are four departmens: Electronic (id 1), Clothing (id 2), Applicnaces (id 3) and Offic (id 4).
  //the deptid parameter to this function should be the id number of one of the various departments
  console.log("inside Show Product by Dept function");

  let deptname = ""
  switch (DeptId) {
    case 1:
      deptname = "ELECTRONICS"
      break;

    case 2:
      deptname = "CLOTHING"
      break;

    case 3:
      deptname = "APPLIANCES"
      break;

    case 4:
      deptname = "OFFICE"
      break;
  }

  //format heading to center it over the product grid
  let padcount = (80 - deptname.length) / 2;
  // console.log("padcount: " + padcount);
  for (k1 = 0; k1 < padcount; k1++) {
    deptname = " " + deptname;
  }
  console.log(deptname);

  //make a connection to the db
  let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mhroot",
    database: "bamazon_db"
  });

  connection.connect(function (err, result) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  });

  //execute SQL to get products for the specified department (1,2,3 or 4)
  //now read all of the products from the selected department.
  let query = connection.query("SELECT * FROM Products WHERE DeptID = " + DeptId + " ORDER BY ProductName;", function (err, result) {
    if (err) throw err;
    console.log("-----------------------------------------");
    // console.log(result);
    console.log("number of items returned: " + result.length);
    // console.log("raw row: " + result[0]);

    //start the table of products with the column header and a row divider
    console.log("");
    console.log(deptname);
    RowDivider();  //prints the row divider
    Columnhead();   //prints the column heading
    RowDivider();  //prints the row divider

    //iterate the query results, formatting and console printing each product row
    for (k = 0; k < result.length; k++) {
      // console.log("loop count: " + k);
      //copy returned values into local variables.
      let itemid = result[k].itemId;
      let name = result[k].ProductName;
      let dept = result[k].DeptId;
      let price = result[k].SellPrice;
      let instock = result[k].Quantity;

      FormatProductRow(itemid, name, dept, price, instock);
    } //end of for loop iterating query results
    //close the sql connection
    connection.end();
    //call the Buy Stuff function here, or it ends up executing before the list is complete, due to asynch behavior
    BuyStuff();

  } //end of then callback function for query
  ) //end of query method parameter list


} //end of Show by Dept function

function FormatProductRow(itemid, name, dept, price, instock) {
  //this function formats 1 row for a product with the values passed in through the parameters

  let padding = 0;
  let temp = "";

  //FORMAT PRODUCT ID CELL
  temp += "| " + itemid;
  padding = 4 - temp.length;
  for (i = 0; i <= padding; i++) { //add padding to the item id to match "cell"width.
    temp += " ";
  }
  temp += "|";

  //FORMAT PRODUCT NAME CELL
  productRow = temp; //item id is up to 3 digits inside the cell
  var namepad = 84 - name.length;
  productRow += " " + name;

  for (i = 0; i < namepad - 1; i++) {
    productRow += " ";
  }
  productRow += "|";

  //FORMAT THE DEPARTMENT ID CELL
  temp = " " + dept;
  padding = 7 - temp.length;

  for (i = 0; i < padding; i++) {
    temp += " "
  }
  temp += "|";
  productRow += temp;

  //FORMAT PRICE CELL
  var sprice = price.toFixed(2);

  temp = " " + sprice;
  padding = 9 - temp.length;

  for (i = 0; i < padding - 1; i++) {
    temp += " ";
  }
  temp += "|"

  productRow += temp;

  //FORMAT INVENTORY CELL
  temp = instock.toString();
  temp = " " + temp;
  padding = 10 - temp.length;

  for (i = 0; i < padding; i++) {
    temp += " ";
  }
  temp += "|";

  productRow += temp;

  //NOW OUTPUT THE FORMATTED ROW
  console.log(productRow);
  RowDivider();
}

function ShowAllProducts() {
  //this function shows a list of all products in the database
  console.log("------------------------------------------------");
  console.log("inside the Show All Products function");

  //first create a new db connection
  var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "mhroot",
    database: "bamazon_db"
  });

  connection.connect(function (err, result) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });



  // NEXT EXECUTE A SELECT STATEMENT TO GET ALL PRODUCTS
  var query = connection.query("SELECT * FROM Products ORDER BY ProductName;", function (err, result) {
    if (err) throw err;
    console.log("-----------------------------------------");
    // console.log(result);
    console.log("number of items returned: " + result.length);
    // console.log("raw row: " + result[0]);

    //start the table of products with the column header and a row divider
    console.log("");
    console.log("List of All Products:");
    RowDivider();  //prints the row divider
    Columnhead();   //prints the column heading
    RowDivider();  //prints the row divider

    // now, iterate the returned results and display the product grid
    for (k = 0; k < result.length; k++) {

      //copy returned values into local variables.
      let itemid = result[k].itemId;
      let name = result[k].ProductName;
      let dept = result[k].DeptId;
      let price = result[k].SellPrice;
      let instock = result[k].Quantity;

      FormatProductRow(itemid, name, dept, price, instock);
    } //end of outer loop iterating results of query

    //END THE CONNECTION
    connection.end();
    // need to call buystuff function here, otherwise, due to asynch sql query, the buystuff function executes before this is done
    BuyStuff();
  })  //end of query function
} //end of Show All Products function

function SelectDepartment() {
  //this function shows a prompt for user to select a department whose products they want to view, and then calls the 
  //ShowProductbyDepartment function to retrieve and display the products for the selected department.
  console.log("inside Select Department function");

  Inquirer.prompt([
    {
      type: "list",
      name: "dept",
      choices: ["Electronics", "Clothing", "Appliances", "Office"],
      default: "Electronics"
    }]).then(function (answers) {
      console.log("------------------------------------------");
      switch (answers.dept) {
        case "Electronics":
          ShowProductbyDept(1); //show the list of products in dept 1 (electronics)
          // BuyStuff(); //let user buy stuff
          break;

        case "Clothing":
          ShowProductbyDept(2); //show the list of product in dept 2 (clothing)
          // BuyStuff(); //let user buy stuff
          break;

        case "Appliances":
          ShowProductbyDept(3); //show the list of products in dept 3 (appliances)
          // BuyStuff(); //let user buy stuff
          break;

        case "Office":
          ShowProductbyDept(4); //show the list of product in dept 4 (office)
          // BuyStuff(); //let user buy stuff
          break;
      } //end of switch
    }) //end of then callback for inquire prompt
} //end of Select Department function;

Inquirer.prompt([
  {
    type: "list",
    name: "action",
    message: "what action do you want to perform?",
    choices: ["Shop"],
    default: "Shop"

  }]).then(function (answers) {
    // console.log("answers: " + JSON.stringify(answers));
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
  });

function Shop() {
  console.log("inside the Shop function");
  Inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose whether to show All products, or place an order right away",
      choices: ["Show all products", "Show Products by Department", "place an order"],
      default: "Show all products"
    }
  ]).then(function (answers) {
    console.log("the action you chose was: " + answers.action);
    if (answers.action == "Show all products") {
      console.log("call the ShowAllProducts function")
      ShowAllProducts();
      console.log("now call the BuyStuff function");
      // BuyStuff();
    }
    else if (answers.action == "place an order") {
      console.log("call the BuyStuff function");
      // BuyStuff();
    }
    else if (answers.action == "Show Products by Department") {
      console.log("call the Select Department function");
      SelectDepartment();
    }
  });  //end of then function of the most recent Inquire prompt.
}


// function ChooseYesNo(archoice) {
//   console.log("inside choose yes/no function");

//   Inquire.prompt([
//     {
//       type: "list",
//       name: "answer",
//       message: "Enter Y for Yes, N for No",
//       choices : archoice
//     },
//     {
//       type: "input",
//       name: "foo",
//       message: "what the foo?"
//     }
    
//   ]).then( function(answers) {
//     console.log("you entered: " + answers.answer);
//     console.log("you entered: " + answers.foo);


//   })
//   console.log (" \n ++++++++++++++++++++++++++++++++++end of choose yes/no function");
// }

function SelectProduct() {
  //this function is intended to enable the user to enter a product id and purchase quantity
  //the code in this function has been broken into a separate function so that it can be called to get user to re-select a product and quantity in the event that 
  //the user has either a) entered and invalid product id, or a quantiy greater than that in stock.
  console.log("inside Select product function");
  console.log("user enters product id number and quantity desired");


  console.log("Inquire prompt starts in next statement");
  // Inquire.prompt([
  //   {
  //     type: "input",
  //     name: "itemid",
  //     message: "Enter a product ID number (product id is the number in the left-most column of the product list):",
  //     //****************************************************start of validate function
  //     validate: function validateItemIdNumber(name) {
  //       if (isNaN(name)) {
  //         return "You must enter a product id number, digits only! (HINT: the product id number is in the leftmost column of the product list)"
  //       }
  //       else { return true; }
  //     }  //end of item id valication function
  //   },  //end of product id input
  //   // start of quantity input
  //   {
  //     type: "input",
  //     name: "quantity",
  //     message: "Enter the quantity you wish to buy: ",
  //     validate: function validateQuantity(name) {
  //       console.log("validating quantity");
  //       let tmp = isNaN(name)
  //       if (isNaN(name) ) {
  //         return "You must enter a number for the quantity you wish to buy, digits 1-9 only!"
  //       }
  //       else { return true; }
  //     } //end of quantity validate function
  //   } //end of quantity prompt
  // ]).then(function (answers)  {
  //   console.log("INSIDE THEN FUNCTION OF INQUIRER PROMPT");
  //   buyitemID = answers.itemid;   //assign user's input valus to global variables for later use.
  //   buyQuantity = answers.quantity;
  //   connection.end(); //end the connection

  //   //at this point, call the BuyStuff function to complete the customr order
  //   // BuyStuff();
  // }, function foo() {
  //   console.log('INSIDE SECOND THEN FUNCTION');
  // }) //end of FIRST answers .then function
  } //end of SelectProduct function



  function GetProductQuantitySync() {
    //this function prompts the user to enter the quantity they want to buy
    //the user's input must be non-blank, and a numeric value.

    console.log("INSIDE GET QUANTITY");
  
    let isGood = false; // boolean to determine whether user input is valid, assume input is bad
  
    do {
    // get entry from user
    var ProductQ = inputSync.question('Enter the quantity you want to buy: ');
  
      //check that input is non-blank
      if (ProductQ.length == 0) {
        console.log("ERROR! You must enter a non-blank value! Please try again.");
        isGood = false;
      }
      else {
    
      //check that input is numeric
      if (!isNaN(ProductQ)) {
        isGood = true;  //input passes the is numeric test
      }
      else {  //invalid input -- product id must be a number.
        console.log("ERROR! You must enter a numeric value! Please try again.")    
        isGood = false} //need to explicitly set isGood to false, as it may have been set true by the non-blank test
      }
        // console.log("************* Value of isGood: " + isGood);
    } while (isGood == false);
  
  
    return ProductQ;
  }
  
  
  function GetProductIDSync() {
    //this function prompts the user to enter a product ID.
    //the user's input must be non-blank, and a numeric value.
    console.log("INSIDE GET ID");
  
    let isGood = false; // boolean to determine whether user input is valid, assume input is bad
    // var ProductID = "";
  
    do {
    // get entry from user
    var ProductID = inputSync.question('Enter the id number of the product you want to order (the product id is the number in the left-most column of the product list): ');
  
      //check that input is non-blank
      if (ProductID.length == 0) {
        console.log("ERROR! You must enter a non-blank value! Pleae try again. (HINT: the Product ID number is in the left-most column of the product list.")
        isGood = false;
      }
      else {
    
      //check that input is numeric
      if (!isNaN(ProductID)) {
        isGood = true;  //input passes the is numeric test
      }
      else {  //invalid input -- product id must be a number.
        console.log("ERROR! You must enter a numeric value! Please try again.")    
        isGood = false} //need to explicitly set isGood to false, as it may have been set true by the non-blank test
      }
    } while (isGood == false);

    return ProductID;
  }
  


function BuyStuff() {
      //this function carries out the tasks involved when the customer makes a purchase, and is intended to be shown after the user has listed products by all or by department.
      console.log("*************************************************");
      console.log("inside Buy Stuff function");
      console.log("*************************************************");
      //verify that user has entered a valid item id
      // var archoice = ["1", "2", "3", "11"];
      // ChooseYesNo(archoice);
      //  SelectProduct();


      //get user input fo iem id and quantity
      glbProductID = GetProductIDSync();
      glbQuantity = GetProductQuantitySync();

      console.log("****************************************");
      console.log("user selected product ID: " + glbProductID);
      console.log("user selected Quantity: " + glbQuantity);
      console.log("****************************************");

      console.log("id selected: " + glbProductID);

      // WORKING HERE


    
    
      console.log("after Inquire for item id and quantity!!!!!");

      // at this point, validate there is enough stock to cover this order
      //make another connection to the db
      console.log("establishing db connection next:")
      let connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "mhroot",
        database: "bamazon_db"
      })  //end of connection

      connection.connect(function (err, result) {
        if (err) throw err;
        console.log("connected in Buy Stuff function  as id " + connection.threadId);
      });


      let query = connection.query("SELECT quantity FROM bamazon_db.products WHERE itemid=" + glbProductID + ";", function (err, results) {
        if (err) throw err;
        // console.log("next line logs the result: ");
        console.log("result of query: " + results);

        //if results length is zero, the product id is invalid

        console.log("rows returned: " + results.length);
        if (results.length > 0) {
          var instock = results[0].quantity;

          console.log("TOTAL IN STOCK FOR ID: " + glbProductID + " is: " + instock);

          console.log("*********************** VALIDATION QUERY");
          // following values were set in the SelectProduct function.
          // console.log("customer entered id: " + buyitemID);
          // console.log("customer's entered quantity is: " + buyQuantity);


          // console.log("Quantity in stock is: " + results[0].quantity);
          // console.log("customer wantst to buy: " + buyQuantity);


        }
        connection.end();
      }); //end of query method and its callback function

         //**************************************
  } //end of Buy Stuff function