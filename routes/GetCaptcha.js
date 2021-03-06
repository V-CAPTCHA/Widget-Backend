const server = require('express').Router();
const { Sequelize } = require('sequelize');
const models = require('../DB_Connection');
const authen_action = require('../models/authen_action');

//Router Path
server.get('/', async (req, res) => {
  //setup variable
  var domain = req.query.domain;
  var key = req.query.key;
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
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
    //pull time stamp from action
  tStamp = await models.authen_action.findOne({
    where: { action_id: ActionModel.action_id },
  })
  //create object for returnt

  var obAction = {
    action_id: ActionModel.action_id,
    dataset_img: captchabody.dataset_img,
    dataset_question: captchabody.dataset_question,
    action_timeStamp: tStamp.action_create
    
  };
  
  
  return obAction;
}


async function checkFiltered(domain, key) {

  var check_deactive = await models.captcha_key.findOne({
   
      include: [{
        model: models.user,
        as: 'user',
        required: true,
       }],
       where: { domain: domain, key_value: key }
  });

if (check_deactive.user.email.split('::')[1] == 'deactivate'){
return false
}

   

  var filtered = await models.captcha_key.findOne({
    where: { domain: domain, key_value: key },
  });
  return !!filtered;
}

module.exports = server;
