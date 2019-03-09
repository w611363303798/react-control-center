"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = _interopRequireDefault(require("../../support/util"));

var ccKey_ref_ = _ccContext.default.ccKey_ref_;

function _default() {
  var ref = ccKey_ref_[_constant.CC_DISPATCHER];

  if (!ref) {
    if (_util.default.isHotReloadMode()) {
      _util.default.justTip('in hot reload mode, CC_DISPATCHER initialized more than one time');
    } else {
      throw _util.default.makeError(_constant.ERR.CC_NO_DISPATCHER_FOUND);
    }
  }

  return ref;
}