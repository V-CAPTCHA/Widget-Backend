var DataTypes = require("sequelize").DataTypes;
var _authen_action = require("./authen_action");
var _captcha_key = require("./captcha_key");
var _dataset = require("./dataset");
var _user = require("./user");

function initModels(sequelize) {
  var authen_action = _authen_action(sequelize, DataTypes);
  var captcha_key = _captcha_key(sequelize, DataTypes);
  var dataset = _dataset(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  authen_action.belongsTo(captcha_key, { as: "key_value_captcha_key", foreignKey: "key_value"});
  captcha_key.hasMany(authen_action, { as: "authen_actions", foreignKey: "key_value"});
  authen_action.belongsTo(dataset, { as: "dataset", foreignKey: "dataset_id"});
  dataset.hasMany(authen_action, { as: "authen_actions", foreignKey: "dataset_id"});
  captcha_key.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(captcha_key, { as: "captcha_keys", foreignKey: "user_id"});

  return {
    authen_action,
    captcha_key,
    dataset,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
