const MYSQL = require("mysql");
const FS = require("fs");
const DBNAME = "bamazonDB";
var CONX;  //global var for msySQL connection object
var dbexists;   //global to hold resut, since the qury code runs asnych, and the function id the detection code to do not return any value other than "undefined"

//THE CODE IN THIS FILE IS INTENDED TO PROVIDE MANAGEMENT TOOLS FOR A MYSQL DATABASE -- IN PARTICULAR TO TEST WHETHER THE DB EXIST AND WHETHER OR NOT A SPECIFIC TABLE IN THE DB 
//EXISTS, AS WELL AS TOOLS TO CREATE AND SEED A DATABASE

//THE CODE IN THIS FILE BUILDS A NEW BAMAZON DATABASE, AND THEN CREATES AND POPULATES A PRODUCTS TABLE.


function dbexists_tool(dbname) {
  //this function returns true if the database exists in the connection, false otherwise.
  console.log("DETECT EXISTENCE OF DB NAMED : " + dbname);
  //create a gneric connection
  console.log("opening a connection to mySQL");

  //create a connection
  CONX = MYSQL.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mhroot"
  });

 CONX.connect( function (err) {
  //  var resultx;
    if (err) throw err;
    console.log("connected as id: " + CONX.threadId);
    //now try to look at the schema
    console.log("checking schema now");
    query = CONX.query(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '" + dbname + "'",
      function (err, res) {
        // resultx = res;
        console.log("inside query function, showing result");
        console.log("type of result: " + res);
        // console.log(res.affectedRows + " rows affected")
        var resultcount = res.length;
        // console.log("length of result array: " + res.length);
        // console.log(res[0]);
        resultx = res;
// console.log(CONX.query.sql);

        if (resultcount == 0) {
          console.log("DATABASE " + dbname + " DOES NOT EXIST!");
          dbexists = false;  //set global flag to indicare result
          return false; //the database we're testing for does not exist
        }
        else
          // we got at least one row as a result of the schema query, so we can presume that the specified database does exist
          dbexists = true;  //set global flag to indate result of test
          console.log("database " + dbname + " DOES EXIST");
console.log("-----------------------------------------------------");
          console.log("next line creates a log file");
          try {
            const data = fs.writeFileSync('./dbexist.log', content)
            //file written successfully
          } catch (err) {
            console.error(err)
          }
          



          FS.write(2, "exists.log", + dbname , function() {

          } )
          return true;  //the database we are testing for does exist
        });

        //at this point, the query shouold be complete, because of the await.
        console.log("------------------------------------------------------------");
        console.log("next line logs the result object");
        console.log(resultx);
        console.log("------------------------------------------------------------");
        // console.log(query);


      console.log("hello from detroit");
      console.log("ending connection");
      CONX.end();
  });
  }

//list of exports from this module
module.exports = {

  dbexists: function dbexists(dbname) {
    console.log("inside exported dbexists");
    console.log("---------------------------------------------")
    console.log("the dbname is: " + dbname);
    console.log("calling local dbexists");
    console.log(dbexists_tool(dbname));
    // console.log("result as obtained from global result flag: " + dbexists)
  }
} //end of object list of exports


//TESTING CODE FOLLOWS
console.log("DBcontrols loaded");

// console.log('calling dbexists_tool function:');

// var testname = "animals_db"
// console.log("result of dbexists function: " + dbexists_tool(testname));
// console.log("result of test as obtained from global result flag: " + testname + " " + dbexists);



