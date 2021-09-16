require('dotenv').config();
var mysql = require('mysql');
var dateFormat = require('dateformat');

const http = require('http');
const express = require('express');
const { clearScreenDown } = require('readline');
const { send } = require('process');
const { json } = require('express');
const app = express();

//Mysql Environment
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
//check mysql is Connected ?
con.connect(function (err) {
  if (err) throw err;
  console.log('SQL Connected!');
});

//start Express server
app.listen(process.env.Express_Port, () => {
  console.log('Start server at port', process.env.Express_Port);
});

//Func & OP Part

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(String('Human Verification Service using Voice Recognition'));
});


//get new captcha method
app.get('/genNewCaptcha', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await genDBAction() //pull data from function
  ////variable setup
  var id = result[0].dataset_id
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
  ip = ip.split(`:`).pop();
  var key = req.query.key
  
  var domain = req.query.domain


   ////filter variable setup

   var filterCheck = await checkFilterKey(domain,key) //pull check value from promise method

  if(filterCheck){ //if key & domain valid 
   var genId = await saveAction(id, ip,key)
    result[0].dataset_id = genId.insertId //set database id to Action id
    result[0] = JSON.stringify(result[0]).replace("\"dataset_id\":", "\"action_id\":"); //Rename Key name 
    res.json(JSON.parse(result[0]))
  }
  else{res.sendStatus(400)}

  
});



function genDBAction() { //GenAction in promise for pull data via variable
  return new Promise((resolve, reject) => {
    con.query(
      'SELECT dataset_id,dataset_img,dataset_question FROM dataset ORDER BY RAND() LIMIT 1;',
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
}


function saveAction(id, ip,key) { //make Action in Table
  return new Promise((resolve, reject) => {
  var sql =
    'INSERT INTO authen_action (dataset_id,action_ip,key_value) VALUES ("'+id+'","'+ip+'","'+key+'")'
  con.query(sql,  (err, result) => {
    console.log('Action Saved id:'+id,' ip: ', ip,' Key: '+key);
      return resolve(result);
    }
  );
});
}



function checkFilterKey(domain,key){ //filter domain & key
  return new Promise((resolve, reject) => {
  con.query(
    'SELECT domain,key_value FROM captcha_key WHERE domain="'+ domain +'" AND key_value="'+ key +'";',
    (err, result) => {
      var check = false
      if(result.length){console.log('Found Key !');check = true}else{console.log('Not found key');}
      return err ? reject(err) : resolve(check);
      }
  )});
}

 