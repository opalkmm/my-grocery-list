var express = require("express");
var app = express();
// Set the port of our application
// process.env.PORT to set the port(Heroku)
var PORT = process.env.PORT || 8080;

// for parsing application/x-www-form-urlencoded
//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//import handlebars for templating
var exphbs = require("express-handlebars");
//set default layout
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//import mysql
var mysql = require("mysql");

//set mysql connection to grocery_listDB
//establish connection (show error or if successful, connection id)
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "535649",
  database: "grocery_listDB",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// ROUTING & RENDER**********************************************
app.get("/", function (req, res) {
  connection.query("SELECT * FROM items;", function (err, data) {
    //handle errors
    if (err) {
      return res.status(500).end();
    }
    //otherwise show the existing grocery list
    res.render("index", { items: data });
  });
});

// Start server,listento client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
