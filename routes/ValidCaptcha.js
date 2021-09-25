const server = require('express').Router();
const { Sequelize } = require('sequelize');
const models = require('../DB_Connection');


//Router Path
server.get('/', async (req, res) => {

    res.send('ValidCaptcha')

})




module.exports = server;