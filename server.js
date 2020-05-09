//jshint esversion: 6

const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require ("ejs");
const fs = require ("fs");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/*
* Game
*/

const dictionary = readDictionary();

var userLetters = [];
var word = [];
var playerWord = [];
var turn = 1;

var checked = false;

function cleanGame () {
  userLetters = [];
  word = [];
  playerWord = [];
  turn = 1;
  checked = false;
}

function readDictionary () {
  let dictionary = fs.readFileSync ("public/txt/dictionary.txt").toString('utf8');
  
  return dictionary.split(", ");
}

function randomWord (dictionary) {
  let pos = Math.floor(Math.random() * dictionary.length);
  for (let i = 0; i < dictionary[pos].length; i++){
    playerWord.push("-");
  }
  console.log(dictionary[pos]);

  return dictionary[pos].split("");
}

function updateWord (letter) {
  word.forEach (function (wordLetter, index) {
    if (wordLetter === letter) {
      if (!checked) {
        checked = true;
        turn--;
      }
      playerWord[index] = letter;
    }
  });
  checked = false;
  turn++;

  return playerWord;
}

/*
* Server
*/

app.get("/", function (req, res) {
  cleanGame();
  res.render("index");
});

app.get("/game", function (req, res) {
  res.render("game", { playerWord: playerWord, userLetters: userLetters, turn: turn } );
});

app.get("/end", function (req, res) {
  res.render("end", { turn: turn } );
});

app.post("/", function (req, res) {
  word = randomWord(dictionary);
  res.redirect("/game");
});

app.post("/game", function (req, res) {
  let letter = req.body.letter.toUpperCase();
  userLetters.push(letter);

  playerWord = updateWord (letter);
  if (turn === 11 || !playerWord.includes("-")) {
    res.redirect("/end");
  } else {
    res.redirect("/game");
  }
});

app.post("/end", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server is running on port " + port + "...");
});
