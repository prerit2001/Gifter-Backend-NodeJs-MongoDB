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

//mongodb+srv://root:<password>@cluster0.03waj.mongodb.net/<dbname>?retryWrites=true&w=majority
//mongodb://root:<password>@cluster0-shard-00-00.03waj.mongodb.net:27017,cluster0-shard-00-01.03waj.mongodb.net:27017,cluster0-shard-00-02.03waj.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-87xeis-shard-0&authSource=admin&retryWrites=true&w=majority
mongoose
  .connect(
    "mongodb://root:admin@cluster0-shard-00-00.03waj.mongodb.net:27017,cluster0-shard-00-01.03waj.mongodb.net:27017,cluster0-shard-00-02.03waj.mongodb.net:27017/registration?ssl=true&replicaSet=atlas-87xeis-shard-0&authSource=admin&retryWrites=true&w=majority",
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
