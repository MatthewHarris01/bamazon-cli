require("mysql");
require("fs");

//THE CODE IN THIS FILE IS INTENDED TO PROVIDE MANAGEMENT TOOLS FOR A MYSQL DATABASE -- IN PARTICULAR TO TEST WHETHER THE DB EXIST AND WHETHER OR NOT A SPECIFIC TABLE IN THE DB 
//EXISTS, AS WELL AS TOOLS TO CREATE AND SEED A DATABASE

//THE CODE IN THIS FILE BUILDS A NEW BAMAZON DATABASE, AND THEN CREATES AND POPULATES A PRODUCTS TABLE.


function dbexiststool(dbname) {
  //this function returns tur if the database exists in the connection, false otherwise.
  console.log("DETECT EXISTENCE OF DB NAMDED : " + dbname);
  return "DETECTION NOT YET IMPLEMENTED!"
}


module.exports = {
  
   dbexists: function dbexists(dbname) {
     console.log("inside exported dbexists");
     console.log("the dbname is: " + dbname);
     console.log("calling local dbexists");
    return dbexiststool(dbname);

   } 


  } //end of object list of exports