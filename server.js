//jshint esversion: 6

const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require ("ejs");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(port, function () {
  console.log("Server is running on port " + port + "...");
});
