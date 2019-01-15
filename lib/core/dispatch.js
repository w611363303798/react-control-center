"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pickOneRef = _interopRequireDefault(require("./helper/pick-one-ref"));

function _default(action, ccClassKey, ccKey, throwError) {
  try {
    if (ccClassKey && ccKey) {
      var uKey = _util.default.makeUniqueCcKey(ccClassKey, ccKey);

      var targetRef = _ccContext.default.refs[uKey];

      if (!targetRef) {
        throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
      } else {
        targetRef.$$dispatch(action);
      }
    } else {
      var ref = (0, _pickOneRef.default)();
      ref.$$dispatchForModule(action);
    }
  } catch (err) {
    if (throwError) throw err;else _util.default.justWarning(err.message);
  }
}