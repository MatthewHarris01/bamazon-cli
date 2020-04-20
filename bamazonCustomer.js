
//*****************************************
//              REQUIRES
var mysql = require("mysql");
var Inquirer = require("inquirer");
var FS = require("fs");
var inputSync = require('readline-sync');
var chalk = require("chalk");
//*****************************************

//*******************************************
//         GLOBAL VARIABLESS
var glbProductID = undefined; //Global var to hold product ID entered by the user
var glbQuantity = undefined;  //Global var to hold quantity the user whishes to buy.
var glbUsername = "";  //Globa var to hold user's name, as input by user -- this is part of the work-around to make user input echo correctly on the display.
var productIDList = [];   //Global array holds all valid product id numbers.

var CONX; //this variable will hold a reference to the mysql connection object.

//*******************************************

// var dbtools = require("./DBcontrol"); //this require links in the functions exported from the DBControl module.
// var customer = require("./bamazonCustomer");
// var buyitemID;    //global variable to store the current item id that user wants to purchase
// var buyQuantity;  //global variable to store the quantity of the current item the user wants to purchase


//print the virtual store logo
console.log(chalk.bold.yellow("|*------------------------------*|"));
console.log(chalk.bold.yellow("|********************************|"));
console.log(chalk.bold.blue("|****  !WELCOME TO BAMAZON! *****|"));
console.log(chalk.bold.blue("|***  VIRTUAL ONLINE SHOPPING ***|"));
console.log(chalk.bold.yellow("|********************************|"));
console.log(chalk.bold.yellow("|*------------------------------*|"));

function ShowExitMsg() {
  console.log(chalk.green("************************************************************"));
  console.log(chalk.green("** THANK YOU FOR SHOPPING AT BAMAZON!! Visit again soon!! **"));
  console.log(chalk.green("************************************************************"));
}

//establish global connection for sync-msql

function makeGlobalConnection() {
      CONX = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "mhroot",
        database: "bamazon_db"
      })  //end of connection
  return CONX;
}
CONX =  mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mhroot",
  database: "bamazon_db"
})  //end of connection



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
  console.log(colheading2);
}

function ShowProductbyDept(DeptId) {
  //this function displays the product grid for products in a specific department
  //there are four departmens: Electronic (id 1), Clothing (id 2), Applicnaces (id 3) and Offic (id 4).
  //the deptid parameter to this function should be the id number of one of the various departments
  // console.log("inside Show Product by Dept function");

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
  for (k1 = 0; k1 < padcount; k1++) {
    deptname = " " + deptname;
  }
  // console.log(deptname);

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
    // console.log("connected as id " + connection.threadId);
  });

  //execute SQL to get products for the specified department (1,2,3 or 4)
  //now read all of the products from the selected department.
  // console.log(chalk.yellow("query for product from department: " + DeptId));
  let query = connection.query("SELECT * FROM Products WHERE DeptID = " + DeptId + " ORDER BY ProductName;", function (err, result) {
    if (err) throw err;
    // console.log("-----------------------------------------");
    // console.log(result);
    // console.log("number of items returned: " + result.length);
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
    BuyStuff(true);

  } //end of then callback function for query
  ) //end of query method parameter list

// console.log(chalk.yellow("end of show by Dept function"));
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
  // console.log("------------------------------------------------");
  // console.log("inside the Show All Products function");

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
    // console.log("connected as id " + connection.threadId + "\n");
  });

  // NEXT EXECUTE A SELECT STATEMENT TO GET ALL PRODUCTS
  var query = connection.query("SELECT * FROM Products ORDER BY ProductName;", function (err, result) {
    if (err) throw err;
    // console.log("-----------------------------------------");
    // console.log(result);
    // console.log("number of items returned: " + result.length);
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
    BuyStuff(true);
  })  //end of query function
} //end of Show All Products function

function SelectDepartment() {
  //this function shows a prompt for user to select a department whose products they want to view, and then calls the 
  //ShowProductbyDepartment function to retrieve and display the products for the selected department.
  // console.log("inside Select Department function");
  
  choices = ["Electronics", "Clothing", "Appliances"],
  index=inputSync.keyInSelect(choices, "Choose a department by number from the list above", {cancel: "Office"});
  if (index == -1) {choice="Office"}
  else {choice = choices[index]}
  

      // console.log("------------------------------------------");
      switch (choice) {
        case "Electronics":
          ShowProductbyDept(1); //show the list of products in dept 1 (electronics)
          // BuyStuff(true); //let user buy stuff
          break;

        case "Clothing":
          ShowProductbyDept(2); //show the list of product in dept 2 (clothing)
          // BuyStuff(true); //let user buy stuff
          break;

        case "Appliances":
          ShowProductbyDept(3); //show the list of products in dept 3 (appliances)
          // BuyStuff(true); //let user buy stuff
          break;

        case "Office":
          ShowProductbyDept(4); //show the list of product in dept 4 (office)
          // BuyStuff(true); //let user buy stuff
          break;
      } //end of switch
    // }) //end of then callback for inquire prompt
} //end of Select Department function;

Inquirer.prompt([
  {
    type: "list",
    name: "action",
    message: "what action do you want to perform?",
    choices: ["Shop","Quit"],
    default: "Shop"

  }]).then(function (answers) {
    // console.log("answers: " + JSON.stringify(answers));
    // console.log("you chose 'Shop'");
    // console.log("count of answers: " + answers.length);
    let actionselected = answers.action;

    if (actionselected == "Shop") {
      // console.log("go to 'shopping' function");
      Shop();
    }
    else { 
      ShowExitMsg();
      return; //end this app if user wants to do anything other than shop
    }
  });

function Shop() {
  // console.log("inside the Shop function");

  let action="";
  shopActions = ['Show All Products', 'Show Products by Department']
  
  
    index = inputSync.keyInSelect(shopActions, 'Choose an action by number from the list above)',{cancel: 'Place an order'});
    if (index ==-1) {action ="place an order";
    }
    else {
      action = shopActions[index]
    }
    // console.log(chalk.red("Selected Action is: " + action));
      // console.log(chalk.red("index is: " + index));
  
  // console.log('Ok, ' + action + ' will be performed.');  
    // console.log("the action you chose was: " + action);
    if (action == "Show all products"  || index == 0) {
      // console.log("call the ShowAllProducts function")
      ShowAllProducts();
      // console.log("now call the BuyStuff function");
      // BuyStuff(true);
    }
    else if (action == "place an order") {
      // console.log("call the BuyStuff function");
      BuyStuff(true);
    }
    else if (action == "Show Products by Department") {
      // console.log("call the Select Department function");
      SelectDepartment();
    }
  // });  //end of then function of the most recent Inquire prompt.

  // console.log(chalk.yellow("end of Shop function"));
}


function GetYesOrNo(promptmsg) {
  // returns true if user chooses yes, false otherwise

if (inputSync.keyInYN(chalk.yellow.bold(promptmsg))) {
  // 'Y' key was pressed.
  return true;
} else {
  // Another key was pressed.
  return false;
}
}


  function GetProductQuantitySync() {
    //this function prompts the user to enter the quantity they want to buy
    //the user's input must be non-blank, and a numeric value.

    // console.log("INSIDE GET QUANTITY");
  
    let isGood = false; // boolean to determine whether user input is valid, assume input is bad
  
    do {
    // get entry from user
    var ProductQ = inputSync.question(chalk.yellow('Enter the quantity you want to buy: '));
  
      //check that input is non-blank
      if (ProductQ.length == 0) {
        console.log(chalk.red("ERROR! You must enter a non-blank value! Please try again."));
        isGood = false;
      }
      else {
    
      //check that input is numeric
      if (!isNaN(ProductQ)) {
        isGood = true;  //input passes the is numeric test
      }
      else {  //invalid input -- product id must be a number.
        console.log(chalk.red("ERROR! You must enter a numeric value! Please try again."));
        isGood = false} //need to explicitly set isGood to false, as it may have been set true by the non-blank test
      }
        // console.log("************* Value of isGood: " + isGood);
    } while (isGood == false);
  
  
    return ProductQ;
  }
  
  
  function GetProductIDSync(getname) {
    //this function prompts the user to enter a product ID.
    //the user's input must be non-blank, and a numeric value.
    // console.log("INSIDE GET ID");
  
    let isGood = false; // boolean to determine whether user input is valid, assume input is bad
    // var ProductID = "";
  
    do {
    // get entry from user -- only get the name if the getname parameter is true.
    //getting the name is part of the work-around to deal with the fact that inputSync does not echo user's typing unless a call to inpuSync has previously been made with
    // hideEchoBack: true.
      if (getname == true) {
        glbUsername = inputSync.question(chalk.yellow("Enter your account Name (enter your first name if you do not know your account name): "), {hideEchoBack: true});
      }

    // var ProductID = inputSync.question('ID:  ');
    var ProductID = inputSync.question(chalk.yellow('Enter the id number of the product you want to order (the product id is the number in the left-most column of the product list): '));
  
      //check that input is non-blank
      if (ProductID.length == 0) {
        console.log(chalk.red("ERROR! You must enter a non-blank value! Pleae try again. (HINT: the Product ID number is in the left-most column of the product list."));
        isGood = false;
      }
      else {
    
      //check that input is numeric
      if (!isNaN(ProductID)) {
        isGood = true;  //input passes the is numeric test
      }
      else {  //invalid input -- product id must be a number.
        console.log(chalk.red("ERROR! You must enter a numeric value! Please try again."))    
        isGood = false} //need to explicitly set isGood to false, as it may have been set true by the non-blank test
      }
    } while (isGood == false);

    return ProductID;
  }
  
  function updateInventory(ItemID, newcount) {
    // this function updates the Products table with a new inventory value for the product specified by ItemID.
    // console.log(chalk.yellow("in updateproduct function, ItemID is: " + ItemID));
    // console.log(chalk.yellow("in updateproduct function, newcount is: " + newcount));

    connection = makeGlobalConnection();
    connection.connect(function (err, result) {
      if (err) throw err;
      // console.log("connected in update inventory as id " + connection.threadId);
    });
  connection.query("UPDATE products SET Quantity = " + newcount + " WHERE itemID = " + ItemID +";");

    connection.end();

    // console.log(chalk.yellow("inventory update completed."));
  }

function BuyStuff(getname) {
      //this function carries out the tasks involved when the customer makes a purchase, and is intended to be shown after the user has listed products by all or by department.
      // console.log("*************************************************");
      // console.log("inside Buy Stuff function");
      // console.log("*************************************************");
      //verify that user has entered a valid item id
      // var archoice = ["1", "2", "3", "11"];
      // ChooseYesNo(archoice);
      //  SelectProduct();


      //get user input for item id and quantity
      glbProductID = GetProductIDSync(getname);
      glbQuantity = GetProductQuantitySync();

      // console.log("****************************************");
      // console.log("user name: " + glbUsername); //incidentally entered while gettign product ID.
      // console.log("user selected product ID: " + glbProductID);
      // console.log("user selected Quantity: " + glbQuantity);
      // console.log("****************************************");

      // console.log("id selected: " + glbProductID);
      // console.log("after getting item id and quantity!!!!!");

      // at this point, validate there is enough stock to cover this order
      //make another connection to the db
      // console.log("makeing db connection next:")
      let connection = makeGlobalConnection()
      // let connection = mysql.createConnection({
      //   host: "localhost",
      //   port: 3306,
      //   user: "root",
      //   password: "mhroot",
      //   database: "bamazon_db"
      // })  //end of connection

      connection.connect(function (err, result) {
        if (err) throw err;
        // console.log("connected in Buy Stuff function  as id " + connection.threadId);
      });


      let query = connection.query("SELECT * FROM bamazon_db.products WHERE itemid=" + glbProductID + ";", function (err, results) {
        if (err) throw err;
        // console.log("*********************** VALIDATION QUERY");

        //if results length is zero, the product id is invalid
        if (results.length ==0) {
          console.log(chalk.red("IT SEEMS THE PRODUCT ID YOU SELECTED IS INVALID!"));
          console.log(chalk.yellow("You will now be prompted to to re-enter the product ID and Quantity that you wish to buy"));
          inputSync.question(chalk.yellow("Press the Enter key to continue."),{hideEchoBack: true, mask: ''});

          // console.log(chalk.yellow("making a recursive call to BuyStuff!"));
          BuyStuff(false);  //RECURSION!!!!!!
        }

        // get user to confirm product selection, quantity,and total cost.


        // console.log("rows returned: " + results.length);
        if (results.length > 0) {
          var instock = results[0].Quantity;
          var priceEach = results[0].SellPrice;
          var product = results[0].ProductName;
          let Dept = results[0].DeptId
          // console.log("TOTAL IN STOCK FOR ID: " + glbProductID + " is: " + instock);
          // console.log("price each for item:  "+ priceEach);
          // console.log("item name: " + product);
          // console.log("Department ID: " + Dept);

          // check whether there is enough in stock to fulfill this purchase request
          if (glbQuantity > instock) {
            // have user re-enter quantity until it is a value for which there is enough inventory
            do {
            console.log(chalk.yellow("There is not enough inventory to fulfill your order!!"));
            console.log(chalk.yellow("You requested to buy " + glbQuantity + " but there are only " + instock + " available!!"));
            console.log(chalk.yellow("Please re-enter the quantity you wish to buy."));

            
            glbQuantity =  GetProductQuantitySync();
            
            } while (glbQuantity > instock)

          }
          CONX.end();

          // CONFIRM THE USER'S PURCHASE.
          // console.log(chalk.blue('next step is to confirm user\'s purchase.'));
          let totalCost = glbQuantity * priceEach;
          let msg = glbUsername + ", your purchase selection is shown below:"
          console.log(chalk.yellow(msg));
          msg = glbUsername + ", you chose product: '" + product + "', and selected a quantity of: '" + glbQuantity + "'. The total cost will be: $" + totalCost.toFixed(2) + "."
          console.log(chalk.yellow.bold(msg));
          let confirm = GetYesOrNo("Do you confirm your order as shown in the line above? (press 'Y' for Yes, any other key for No");

          if(confirm) {
            // USER HAS CONFIRMED PURCHASE, UPDATE PRODUCT INVENTORY. It doesn't matter if user had not chosed to start over
            updateInventory(glbProductID, instock - glbQuantity); //update product inventory
          }

          if (!confirm) {
            let startOver = GetYesOrNo("Do you Want to start over?")
            if (startOver) { 
              // to start over, call the Shop function
              Shop();
            }
            else {
              ShowExitMsg();
              // CONX.end(); //ensure global connection is ended, nah can't do this or get a runtime error -- the connection has previously been ended, can't end it again
              return;}
          }

          if (GetYesOrNo("Do you want to continue shopping?")) {
            //user wants to continue shopping
            Shop();
          }
          else { ShowExitMsg();
            // CONX.end(); //nah, connection has previously been ended, can't end it again without a runtim error.
          }
        }
      }); //end of query method and its callback function

         //**************************************
  } //end of Buy Stuff function