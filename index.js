//Structure
require('dotenv').config();
const express = require('express');
var cors = require('cors')
const server = express();
const rateLimit = require('express-rate-limit') //use this to limit the number of requests per second
const helmet = require("helmet"); //use this to secure from common attacks
server.use(cors("*")) //fix cors policy
server.disable("x-powered-by"); //Security Hotspots Fix
server.set('trust proxy')
//db Setup
const db = require('./DB_Connection');

//routes
const GetCaptcha = require('./routes/GetCaptcha');
const ValidCaptcha = require('./routes/ValidCaptcha');

//start Express server
server.listen(process.env.Express_Port, () => {
  console.log('Start server at port', process.env.Express_Port);
});

//rate limit for captcha
const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 20, // Limit each IP to 10 requests (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

server.use(limiter) //use limiter
server.use(helmet()); //use helmet

server.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(String('Widget API'));
});

//Express Router Use
server.use('/GetCaptcha',GetCaptcha)
server.use('/ValidCaptcha',ValidCaptcha)

 





 