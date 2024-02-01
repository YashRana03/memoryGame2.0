const express = require("express");
const mongoose = require("mongoose");
const dontenv = require("dotenv");
const Score = require("./PlayerModel");
const Player = require("./PlayerModel");

const app = express();

// Middleware that allows to serve static files to the browser, every file in public folder will be availabe to the browser
app.use(express.static("public"));

// Allows data to go from client to server, in this case as string
app.use(express.urlencoded({ extended: true }));
// use express.json() to allow json data transfer
app.use(express.json());

dontenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);

// Connection to database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connection successfull");
  });

// This route adds a player and a default score to the database
// Returns an error message if player already exists
app.post("/addPlayer", (req, res, next) => {
  Score.create({
    name: req.body.name,
    score: req.body.score,
    password: req.body.password,
  })
    .then(() => {
      res.status(200).send({ status: "success" });
    })
    .catch((error) => {
      if (error.code == 11000) {
        res.status(400).send({
          status: "Failure",
          message: "That player already exists. Please try a different name",
          code: 11000,
        });
      } else {
        res
          .status(500)
          .send({ status: "Failure", messsage: "Unexpted databse error" });
      }
    });
});

app.post("/matchPlayer", async (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  //1- get the data
  //2- check if that player exists and if passwords match
  const player = await Player.findOne({ name: name })
    .select("+password")
    .catch((err) => {
      console.log(err);
    });

  //3- if so return match, otherwise no match
  if (!player) {
    res
      .status(404)
      .send({ status: "failure", message: "No player with such name exists" });
  } else if (player.password == password) {
    res.status(200).send({ status: "success", message: "match" });
  } else {
    res.status(404).send({ status: "failure", message: "no match" });
  }
});

// Route updates the player score if the new score is lower than their previous score
app.patch("/updateScore", async (req, res, next) => {
  console.log(111111);
  const newScore = req.body.newScore;
  const player = await Player.findOneAndUpdate(
    {
      name: req.body.name,
      score: { $gt: newScore },
    },
    { score: newScore }
  ).catch((err) => {
    console.log(err);
  });

  res.status(200).send({ status: "success" });
});

// sends back all the plaeyers in the database
app.get("/allPlayers", async (req, res, next) => {
  const players = await Player.find({}).sort({ score: 1 });

  res.status(200).json({ data: players });
});

app.all("*", (req, res) => {
  res.end("<h1>404 ERROR: THIS ROUTE DOES NOT EXIST</h1>");
});

app.listen(8080, () => {
  console.log(`App running on port ${8080} `);
});
