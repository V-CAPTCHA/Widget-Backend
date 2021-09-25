const server = require('express').Router();
const { query } = require('express');
const { Sequelize } = require('sequelize');
const models = require('../DB_Connection');

//Router Path
server.get('/', async (req, res) => {

  //setup variable
  reqAction = {
    actionReply: req.query.actionReply,
    actionID: req.query.actionID,
    key: req.query.key,
  };

  //quiery from Request
  var queryAction = await ActionAuthen_Query(reqAction.actionID);

  //compare Phase with Message
  var compareACtion = compareObject(reqAction, queryAction) //temp variable
  var valid = compareACtion[0]
  var validMessage = compareACtion[1]

  //return Statement
  if (valid) {
    ActionAuthen_Write(reqAction.actionID, reqAction.actionReply, 'PASSES');
    res.json({valid:'Valid',Message:validMessage});
  } else {
    res.json({valid:'Not valid',Message:validMessage});
  }
});

//***********************************CORE FUNCTION****************************************/ //

async function ActionAuthen_Query(actionID) {
  console.log('Query Action Authen ID:', actionID);
  return await models.authen_action.findOne({
    include: [{ model: models.dataset, as: 'dataset' }],
    where: { action_id: actionID },
  });
}
async function ActionAuthen_Write(actionID, actionReply, valid) {
  console.log('Action Write ID:', actionID);
  var req = await models.authen_action.update(
    {
      action_reply: actionReply,
      //action_end: Sequelize.literal('CURRENT_TIMESTAMP'),
      action_checked: true, //make TRUE Value static in Action authen Table
      action_valid: valid,
    },
    {
      where: { action_id: actionID },
    }
  );
  console.log(req);
  return req;
}

function compareObject(req, db) {
  console.log('Checking Valid ID:', req.actionID);
  if (db.action_checked == true) {
    //check if it's compared
    return [false, 'This action is checked'];
  }
  var timeCompare = new Date(); // create time compare value for check outded authen
  if (timeCompare.setSeconds(-60) >= db.action_end) {
    return [false, 'This action is out of 60 Second'];
  } //if out of 60 sec it's not valid
  return [(
    req.actionID == db.action_id &&
    db.dataset.dataset_reply.split(',').indexOf(req.actionReply) > -1 &&
    req.key == db.key_value
  ),'PASS'];
}

module.exports = server;
