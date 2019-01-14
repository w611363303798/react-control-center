"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _register = _interopRequireDefault(require("./register"));

var _constant = require("../support/constant");

function _default(ccClassKey, stateToPropMapping, module) {
  if (module === void 0) {
    module = _constant.MODULE_DEFAULT;
  }

  return (0, _register.default)(ccClassKey, {
    module: module,
    stateToPropMapping: stateToPropMapping
  });
}