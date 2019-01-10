"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _constant = require("../../support/constant");

var _pickOneRef = _interopRequireDefault(require("./pick-one-ref"));

/****
 * if you are sure this state is really belong to global state, call cc.setGlobalState,
 * cc will only pass this state to global module
 */
function _default(state, throwError) {
  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = (0, _pickOneRef.default)();
    ref.$$changeState(state, {
      module: _constant.MODULE_GLOBAL,
      stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      broadcastTriggeredBy: _constant.BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE
    });
  } catch (err) {
    if (throwError) throw err;else _util.default.justWarning(err.message);
  }
}