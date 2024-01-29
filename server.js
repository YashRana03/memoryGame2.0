const express = require("express");

const app = express();

// Middleware that allows to serve static files to the browser, every file in public folder will be availabe to the browser
app.use(express.static("public"));

// Allows data to go from client to server, in this case as string
//app.use(express.urlencoded({ extended: true }));
// use express.json() to allow json data transfer
app.use(express.json());

app.all("*", (req, res) => {
  res.end("<h1>404 ERROR: THIS ROUTE DOES NOT EXIST</h1>");
});

app.listen(8080, () => {
  console.log(`App running on port ${8080} `);
});
