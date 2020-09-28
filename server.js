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

// ROUTING & RENDER***************************************************
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

//DELETE any item on the existing grocery lust (by id)***************************************************
app.delete("/api/items/:id", function(req, res) {
    connection.query("DELETE FROM items WHERE id = ?", [req.params.id], function(err, data) {
      if (err) {
        return res.status(500).end();
      }
      //if the id not existed
      else if (data.affectedRows === 0) {
        return res.status(404).end();
      }
      //success
      res.status(200).end();
    });
  });



//POST/ CREATE new items ***************************************************
app.post("/api/items", function (req, res) {
  connection.query(
    "INSERT INTO items(items) VALUES (?)",
    [req.body.items],
    function (err, data) {
      //handle errors
      if (err) {
        return res.status(500).end();
      }
      //otherwise send id of the new item
      res.json({ id: data.insertId });
      console.log({ id: data.insertId });
    }
  );
});

//RETREIVE the new grocery list ***************************************************
app.get("/api/items", function (req, res) {
    connection.query("SELECT * FROM items;", function (err, data) {
      //handle errors
      if (err) {
        return res.status(500).end();
      }
      //otherwise show the existing grocery list
      res.json(data);
    });
  });


//UPDATE request ***************************************************

app.put("/api/items/:id", function(req, res) {
    connection.query("UPDATE items SET items = ? WHERE id = ?", [req.body.items, req.params.id], function(err, data) {
      if (err) {
        return res.status(500).end();
      }
      else if (data.changedRows === 0) {
        return res.status(404).end();
      }
      res.status(200).end();
    });
  });
  

// Start server,listento client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
