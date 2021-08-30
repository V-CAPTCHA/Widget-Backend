require('dotenv').config();
var mysql = require('mysql');
var dateFormat = require('dateformat');

const http = require('http');
const express = require('express');
const { clearScreenDown } = require('readline');
const app = express();


//start Express server
app.listen(process.env.Express_Port, () => {
    console.log('Start server at port', process.env.Express_Port);
  });



  //Func & OP Part

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(String('Human Verification Service using Voice Recognition '));
  });