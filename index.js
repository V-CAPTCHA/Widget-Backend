//Structure
require('dotenv').config();
const express = require('express');
const server = express();

//db Setup
const db = require('./DB_Connection');

//routes
const GetCaptcha = require('./routes/GetCaptcha');


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






 