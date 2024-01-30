const express = require("express");
const mongoose = require("mongoose");
const dontenv = require("dotenv");
const Score = require("./scoreModel");

const app = express();

// Middleware that allows to serve static files to the browser, every file in public folder will be availabe to the browser
app.use(express.static("public"));

// Allows data to go from client to server, in this case as string
app.use(express.urlencoded({ extended: true }));
// use express.json() to allow json data transfer
app.use(express.json());

dontenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);

//Connection to database
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
  })
    .then(() => {
      res.status(200).send({ status: "success" });
    })
    .catch((error) => {
      // console.log(error.code);
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

app.all("*", (req, res) => {
  res.end("<h1>404 ERROR: THIS ROUTE DOES NOT EXIST</h1>");
});

app.listen(8080, () => {
  console.log(`App running on port ${8080} `);
});
