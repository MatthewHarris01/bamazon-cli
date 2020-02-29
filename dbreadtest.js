var mysql = require("mysql");
var Inquire = require("inquirer");
var FS = require("fs");


console.log("this app tests reading from a database");

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

//now read all of the products from the Electronics department
var query = connection.query("SELECT * FROM Products WHERE deptid = 3;", function(err,result) {
  if (err) throw err;
  console.log("-----------------------------------------");
  // console.log(result);
  console.log("number of items returned: " +result.length);
  // console.log("raw row: " + result[0]);

  //start the table of products with the column header and a row divider
  console.log("");
  console.log("List of Products for dept 1");
  RowDivider();  //prints the row divider
  Columnhead();   //prints the column heading
  RowDivider();  //prints the row divider

  for (k=0;k<result.length; k++) {    //why is this not executing 3 times????
    // console.log("loop count: " + k);
    // console.log("product: " + result[i].ProductName);
    // console.log(FormatProductRow(result[i].itemId, result[i].ProductName, result[i].DeptId,result[i].SellPrice, result[i].Quantity));
    // console.log("***********************************");
    // console.log("item id: " +result[k].itemId);
    // console.log("product: " + result[k].ProductName);
    // console.log("dept: " +result[k].DeptId);
    // console.log("price: " +result[k].SellPrice);
    // console.log("in stock: " + result[k].Quantity);


    // console.log("FOERMATTING PRODUCT ROW");
    let itemid = result[k].itemId;
    let name = result[k].ProductName;
    let dept = result[k].DeptId;
    let price = result[k].SellPrice;
    let instock = result[k].Quantity;

    // let productRow = itemid + " " + name + " " + dept + " " + price + " " + instock;

    // let productRow = "";
    let padding = 0;
    let temp = "";
      
// //FORMAT PRODUCT ID CELL
temp += "| " + itemid;
padding = 4- temp.length;
for (i=0;i<=padding;i++) { //add padding to the item id to match "cell"width.
  temp += " ";
}
temp += "|";
//   //FORMAT PRODUCT NAME CELL
  productRow = temp; //item id is up to 3 digits inside the cell
  var namepad = 84 -name.length;
  productRow += " " + name;

  for (i= 0; i< namepad-1;i++) {
    productRow += " ";
  }
  productRow += "|";
  
   //FORMAT THE DEPTID CELL
  temp  = " " + dept;
  padding = 7-temp.length;

  for (i=0; i<padding;i++) {
    temp += " "
  }
  temp +="|";
  
  productRow += temp;
// ***************************************


  //FORMATT THE PRICE CELL
  var sprice = price.toString();

  temp = " " + sprice;
  padding = 9-temp.length;

  for (i=0;i < padding-1;i++) {
    temp += " ";
  }
  temp += "|"

  productRow += temp;

  //NOW FORMAT INVENTORY
  temp = instock.toString();
  temp = " " + temp;
  padding = 10- temp.length;

  for (i=0;i< padding;i++) {
    temp += " ";
  }
  temp += "|";

  productRow += temp;


  //AND, FINALLY, OUTPUT THE FORMATTED ROW
  console.log(productRow );
  RowDivider();

  } //end of loop through result
  // RowDivider();
  
  //end the connection
  connection.end();
})


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

function FormatProductRow(itemid, name, dept, price, instock ) {
  //this function formats one row for an output list of products
console.log("inside formatproductRow");
console.log(itemid);
console.log(name);
console.log(dept);
console.log(price);
console.log(instock);








  console.log("end of format product row");

}

