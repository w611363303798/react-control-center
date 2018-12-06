"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var ccKey_ref_ = _ccContext.default.ccKey_ref_;

function _default(state) {
  var refKeys = Object.keys(ccKey_ref_);

  if (refKeys.length === 0) {
    return _util.default.justWarning('no CCInstance found for any CCClass!');
  }

  var oneRef = ccKey_ref_[refKeys[0]];

  if (!oneRef) {
    return _util.default.justWarning('cc found no ref!');
  }

  oneRef.setGlobalState(state, _constant.BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
}