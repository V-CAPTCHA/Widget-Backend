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
  //compare
  if (compareObject(reqAction, queryAction)) {
    ActionAuthen_Write(reqAction.actionID, reqAction.actionReply, 'PASSES');
    res.send('Valid');
  } else {
    res.send('not Valid');
  }
  //res.json(queryAction)

  //res.json(await ActionAuthen_Query(actionID))
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
      action_end: Sequelize.literal('CURRENT_TIMESTAMP'),
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
  if (db.action_checked == true) { //check if it's compared
    return false;
  }
  return (
    req.actionID == db.action_id &&
    db.dataset.dataset_reply.split(',').indexOf(req.actionReply) > -1 &&
    req.key == db.key_value
  );
}

module.exports = server;
