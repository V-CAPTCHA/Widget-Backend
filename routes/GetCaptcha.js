const server  = require('express').Router();

//index path
server.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    
    
  });

  module.exports = server ;