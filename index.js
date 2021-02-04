const http = require("http");
const express = require("express");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const hostname = "localhost";
const port = 3001 || process.env.PORT;
const userRoutes = require("./auth.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
env.config();

mongoose
  .connect(
   "INPUT YOUR URL OF MONGO",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Database MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

// app.post('/signup',function(req,res){
//     console.log('--------',req.body);
// });

app.get("/", function (req, res) {
  res.send("Only Post Method Allowed");
});

app.use("/api", userRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server Running at http://${hostname}:${port}/`);
});
