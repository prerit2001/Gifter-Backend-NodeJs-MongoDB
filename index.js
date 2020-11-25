const http = require('http');
const express = require('express');
const app = express();
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const hostname = 'localhost';
const port = 3001;
const userRoutes = require('./auth.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
env.config();

//mongodb+srv://root:<password>@cluster0.03waj.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(
    'mongodb+srv://root:admin@cluster0.03waj.mongodb.net/registration?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }
).then(() => {
    console.log('Database MongoDB Connected');
});


// app.post('/signup',function(req,res){
//     console.log('--------',req.body);
// });

// app.get('/',function(req,res){
//     res.send('hhkjkj');
// });

app.use('/api',userRoutes);

app.listen(port,hostname,()=>{
    console.log(`Server Running at http://${hostname}:${port}/`);
});