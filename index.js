const serverless = require("serverless-http");
let express = require("express");
let bodyParser = require("body-parser");
let apiRoutes = require("./api-routes");
let mongoose = require("mongoose");
const cors = require('cors');

// Initialize the app
let app = express();

// Configure body-parser to handle POST requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(cors());

// Send message for default URL
app.get("/", (req, res) => res.send("Hello World with Express"));

// Import and use API routes
app.use("/api", apiRoutes);
// Launch app to listen to specified port
// app.listen(port, function () {
//   console.log("Running REST server on port " + port);
// });

if (process.env.DB_SOURCE == "atlas") {
  mongoose
    .connect(
      `mongodb+srv://admin:3bI4LuzPWh9v8ydY@cluster0.ajxhn.mongodb.net/taskb3?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        // user: 'root',
        // pass: 'pw123',
      }
    )
    .then(() => console.log("Db connected to Mongo Atlas successfully"))
    .catch((err) => console.log("Error connecting to the database:", err));
}

module.exports.local = app; // export for testing and local running
module.exports.handler = serverless(app);