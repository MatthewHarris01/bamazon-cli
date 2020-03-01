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

function RowDivider() {
  console.log("+----+------------------------------------------------------------------------------------+-------+--------+----------+");}

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
      
      let deptname=""
      switch(DeptId) {
        case 1:
          deptname = "ELECTRONICS"
          break;

        case 2:
          deptname ="CLOTHING"
          break;

        case 3:
          deptname="APPLIANCES"
          break;

        case 4:
          deptname="OFFICE"
          break;
      }

      //format heading to center it over the product grid
      let padcount = (80-deptname.length)/2;
      console.log("padcount: " + padcount);
      for (k1=0;k1 < padcount;k1++) {
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
      
      connection.connect(function(err,result) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
      });
    
      //execute SQL to get products for the specified department (1,2,3 or 4)
//now read all of the products from the selected department.
let query = connection.query("SELECT * FROM Products WHERE DeptID = " + DeptId + ";", function(err,result) {
  if (err) throw err;
  console.log("-----------------------------------------");
  // console.log(result);
  console.log("number of items returned: " +result.length);
  // console.log("raw row: " + result[0]);

  //start the table of products with the column header and a row divider
  console.log("");
  console.log(deptname);
  RowDivider();  //prints the row divider
  Columnhead();   //prints the column heading
  RowDivider();  //prints the row divider

  //iterate the query results, formatting and console printing each product row
  for (k=0;k<result.length;k++) {
    // console.log("loop count: " + k);
    //copy returned values into local variables.
    let itemid = result[k].itemId;
    let name = result[k].ProductName;
    let dept = result[k].DeptId;
    let price = result[k].SellPrice;
    let instock = result[k].Quantity;
    
    FormatProductRow(itemid, name, dept, price, instock);
  } //end of for loop iterating query results

    } //end of then callback function for query
) //end of query method parameter list
    connection.end();
  } //end of Show by Dept function

function FormatProductRow(itemid, name, dept, price, instock) {
  //this function formats 1 row for a product with the values passed in through the parameters

        let padding = 0;
        let temp = "";
    
      //FORMAT PRODUCT ID CELL
      temp += "| " + itemid;
      padding = 4- temp.length;
      for (i=0;i<=padding;i++) { //add padding to the item id to match "cell"width.
      temp += " ";
      }
      temp += "|";

      //FORMAT PRODUCT NAME CELL
      productRow = temp; //item id is up to 3 digits inside the cell
      var namepad = 84 -name.length;
      productRow += " " + name;
    
      for (i= 0; i< namepad-1;i++) {
        productRow += " ";
      }
      productRow += "|";
    
      //FORMAT THE DEPARTMENT ID CELL
      temp  = " " + dept;
      padding = 7-temp.length;
    
      for (i=0; i<padding;i++) {
        temp += " "
      }
      temp +="|";
      productRow += temp;
      
      //FORMAT PRICE CELL
      var sprice = price.toFixed(2);

      temp = " " + sprice;
      padding = 9-temp.length;
    
      for (i=0;i < padding-1;i++) {
        temp += " ";
      }
      temp += "|"
    
      productRow += temp;
    
      //FORMAT INVENTORY CELL
      temp = instock.toString();
      temp = " " + temp;
      padding = 10- temp.length;
    
      for (i=0;i< padding;i++) {
        temp += " ";
      }
      temp += "|";
    
      productRow += temp;
    
      //NOW OUTPUT THE FORMATTED ROW
      console.log(productRow );
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

  connection.connect(function(err,result) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });
  

  
// NEXT EXECUTE A SELECT STATEMENT TO GET ALL PRODUCTS
  var query = connection.query("SELECT * FROM Products;", function(err,result) {
    if (err) throw err;
    console.log("-----------------------------------------");
    // console.log(result);
    console.log("number of items returned: " +result.length);
    // console.log("raw row: " + result[0]);

    //start the table of products with the column header and a row divider
    console.log("");
    console.log("List of All Products:");
    RowDivider();  //prints the row divider
    Columnhead();   //prints the column heading
    RowDivider();  //prints the row divider




    // now, iterate the returned results and display the product grid
    for (k=0;k<result.length; k++) {   

        //copy returned values into local variables.
        let itemid = result[k].itemId;
        let name = result[k].ProductName;
        let dept = result[k].DeptId;
        let price = result[k].SellPrice;
        let instock = result[k].Quantity;

        let padding = 0;
        let temp = "";
    
      //FORMAT PRODUCT ID CELL
      temp += "| " + itemid;
      padding = 4- temp.length;
      for (i=0;i<=padding;i++) { //add padding to the item id to match "cell"width.
      temp += " ";
      }
      temp += "|";

      //FORMAT PRODUCT NAME CELL
      productRow = temp; //item id is up to 3 digits inside the cell
      var namepad = 84 -name.length;
      productRow += " " + name;
    
      for (i= 0; i< namepad-1;i++) {
        productRow += " ";
      }
      productRow += "|";
    
      //FORMAT THE DEPARTMENT ID CELL
      temp  = " " + dept;
      padding = 7-temp.length;
    
      for (i=0; i<padding;i++) {
        temp += " "
      }
      temp +="|";
      productRow += temp;
      
      //FORMAT PRICE CELL
      var sprice = price.toFixed(2);

      temp = " " + sprice;
      padding = 9-temp.length;
    
      for (i=0;i < padding-1;i++) {
        temp += " ";
      }
      temp += "|"
    
      productRow += temp;
    
      //FORMAT INVENTORY CELL
      temp = instock.toString();
      temp = " " + temp;
      padding = 10- temp.length;
    
      for (i=0;i< padding;i++) {
        temp += " ";
      }
      temp += "|";
    
      productRow += temp;
    
      //NOW OUTPUT THE FORMATTED ROW
      console.log(productRow );
      RowDivider();
    } //end of outer loop ierating results from query

   //END THE CONNECTION
   connection.end();
  })  //end of query function
  } //end of Show All Products function

function SelectDepartment() {
  //this function shows a promp for user to select a depart whose products they want to view, and then calls the 
  //ShowProductbyDepartment function to retrieve and display the products for the selected department.
  console.log("inside Select Department function");

  Inquire.prompt([
    {
      type: "list",
      name: "dept",
      choices: ["Electronics", "Clothing", "Appliances", "Office"],
      default: "Electronics"
    }]).then(function(answers) {
console.log("------------------------------------------");
        switch (answers.dept) {
          case "Electronics": 
          ShowProductbyDept(1);
          break;

          case "Clothing": 
            ShowProductbyDept(2);
            break;
          
          case "Appliances":
            ShowProductbyDept(3);
            break;

          case "Office": 
            ShowProductbyDept(4);
            break;
          } //end of switch
    }) //end of then callback for inquire prompt
  } //end of Select Department function;

Inquire.prompt([
  {
    type: "list",
    name: "action",
    message: "what action do you want to perform?",
    choices: ["Shop", "Manage", "Supervise"],
    default: "Shop"

  }]).then(function (answers) {
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
  });

function Shop() {
  console.log("inside the Shop function");
  Inquire.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose whether to show All products, or place an order right away",
      choices: ["Show all products","Show Products by Department", "place an order"],
      default: "Show all products"
    }
  ]).then(function (answers) {
    console.log("the action you chose was: " + answers.action);
    if (answers.action == "Show all products") {
      console.log("call the ShowAllProducts function")
      ShowAllProducts();
    }
    else if (answers.action == "place an order") {
      console.log("call the PlacedOrder function");
    }
    else if (answers.action == "Show Products by Department") {
      console.log("call the Select Department function");
      SelectDepartment();
    }
  });  //end of then function of the most recent Inquire prompt.
}