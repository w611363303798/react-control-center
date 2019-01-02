"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var helper = _interopRequireWildcard(require("./helper"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

/****
 * if you are sure this state is really belong to global state, call cc.setGlobalState,
 * cc will only pass this state to global module
 */
function _default(state) {
  try {
    var ref = helper.pickOneRef();
    ref.setGlobalState(state, _constant.BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
  } catch (err) {
    _ccContext.default.store.setState(_constant.MODULE_GLOBAL, state); //store this state to global;


    _util.default.justWarning(err.message);
  }
}