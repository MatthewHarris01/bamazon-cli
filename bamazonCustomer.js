// this is the code for the customer interface

var sql = require("mysql");
var Inquire = require("inquirer");
var FS = require("fs");

var dbtools = require("./DBcontrol"); //this require links in the functions exported from the DBControl module.

console.log("this is the customer interface");

console.log("next line attempts to report type of for dbexists");
console.log("type of dbexists: " + typeof dbtools.dbexists);
console.log("result of call to dbexists: " + dbtools.dbexists("rama lama ding dong!"));


console.log("end of bamazon customer module");

