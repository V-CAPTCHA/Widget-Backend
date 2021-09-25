const server = require('express').Router();
const { query } = require('express');
const { Sequelize } = require('sequelize');
const models = require('../DB_Connection');

//Router Path
server.get('/', async (req, res) => {
  // filter Null Parameter
  if (
    req.query.actionReply == null ||
    req.query.actionID == null ||
    req.query.key == null
  ) {
    res.send('Problem !! Wrong Or Null Parameter');
    return 0;
  }

  //setup variable
  reqAction = {
    actionReply: req.query.actionReply,
    actionID: req.query.actionID,
    key: req.query.key,
  };

  
  try { //try main process
    //quiery from Request
    var queryAction = await ActionAuthen_Query(reqAction.actionID);

    //compare Phase with Message
    var compareACtion = compareObject(reqAction, queryAction); //temp variable
    var valid = compareACtion[0];
    var validMessage = compareACtion[1];

    //return Statement
    if (valid) {
      ActionAuthen_Write(reqAction.actionID, reqAction.actionReply, 'PASSES');
      res.json({ valid: 'Valid', Message: validMessage });
    } else {
      res.json({ valid: 'Not valid', Message: validMessage });
      ActionAuthen_Write(reqAction.actionID, reqAction.actionReply, 'WRONG');
    }
  } catch (error) {
    res.json({ valid: 'Not valid', Message: error });
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
  if (db.action_checked == true) {
    //check if it's compared
    return [false, 'This action is checked'];
  }

  var timeCompare = new Date(); // create time compare value for check outded authen
  var timeDB = new Date(db.action_create);
  if (timeCompare.setSeconds(-60) > timeDB) {
    return [false, 'This action is out of 60 Second'];
  } //if out of 60 sec it's not valid
  return [
    req.actionID == db.action_id &&
      db.dataset.dataset_reply.split(',').indexOf(req.actionReply) > -1 &&
      req.key == db.key_value,
    'Checked',
  ];
}

module.exports = server;
