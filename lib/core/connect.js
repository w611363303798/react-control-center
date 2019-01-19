"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _register = _interopRequireDefault(require("./register"));

var _constant = require("../support/constant");

function _default(ccClassKey, stateToPropMapping, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$isPropStateModul = _ref.isPropStateModuleMode,
      isPropStateModuleMode = _ref$isPropStateModul === void 0 ? false : _ref$isPropStateModul,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
      _ref$extendInputClass = _ref.extendInputClass,
      extendInputClass = _ref$extendInputClass === void 0 ? true : _ref$extendInputClass;

  return (0, _register.default)(ccClassKey, {
    module: module,
    stateToPropMapping: stateToPropMapping,
    isPropStateModuleMode: isPropStateModuleMode,
    extendInputClass: extendInputClass
  });
}