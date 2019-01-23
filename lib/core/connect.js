"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _register = _interopRequireDefault(require("./register"));

function _default(ccClassKey, stateToPropMapping, option) {
  if (option === void 0) {
    option = {};
  }

  var mergedOption = (0, _extends2.default)({}, option, {
    stateToPropMapping: stateToPropMapping
  });
  return (0, _register.default)(ccClassKey, mergedOption);
}