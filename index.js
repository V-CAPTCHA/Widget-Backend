//Structure
require('dotenv').config();
const express = require('express');
var cors = require('cors')
const server = express();
server.use(cors()) //fix cors policy
server.disable("x-powered-by"); //Security Hotspots Fix
//db Setup
const db = require('./DB_Connection');

//routes
const GetCaptcha = require('./routes/GetCaptcha');
const ValidCaptcha = require('./routes/ValidCaptcha');

//start Express server
server.listen(process.env.Express_Port, () => {
  console.log('Start server at port', process.env.Express_Port);
});

server.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(String('Widget API'));
});

//Express Router Use
server.use('/GetCaptcha',GetCaptcha)
server.use('/ValidCaptcha',ValidCaptcha)





 