const server = require('express').Router();
const { Sequelize } = require('sequelize');
const models = require('../DB_Connection');

//Router Path
server.get('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  //setup variable
  var domain = req.query.domain;
  var key = req.query.key;
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  ip = ip.split(`:`).pop();

  if (await checkFiltered(domain, key)) {
    res.json(await GetCaptchaProcess(domain, ip, key));
  } else {
    res.send('Your Key or Domain invalid');
  }
});

//***********************************CORE FUNCTION****************************************/ //

async function GetCaptchaProcess(domain, ip, key) {
  //get dataset models for create Captcha
  var captchabody = await models.dataset.findOne({
    order: Sequelize.literal('rand()'),
    limit: 1,
    attributes: ['dataset_id', 'dataset_img', 'dataset_question'],
  });
  var dtID = captchabody.dataset_id;

  //create model for Authen Action record
  var ActionModel = await models.authen_action.create({
    key_value: key,
    action_ip: ip,
    dataset_id: dtID,
  });
  //show log
  console.log('Action was create by Domain:', domain, ' Ip:', ip, ' Key:', key);
  //create object for return
  var obAction = {
    action_id: ActionModel.action_id,
    dataset_img: dtID,
    dataset_question: captchabody.dataset_question,
  };
  return obAction;
}

async function checkFiltered(domain, key) {
  var filtered = await models.captcha_key.findOne({
    where: { domain: domain, key_value: key },
  });
  return !!filtered;
}

module.exports = server;
