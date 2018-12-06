"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _startup = _interopRequireDefault(require("./core/startup"));

var _register = _interopRequireDefault(require("./core/register"));

var _invoke = _interopRequireDefault(require("./core/invoke"));

var _setGlobalState = _interopRequireDefault(require("./core/setGlobalState"));

var _ccContext = _interopRequireDefault(require("./cc-context"));

_ccContext.default.startup = _startup.default;
_ccContext.default.register = _register.default;
_ccContext.default.invoke = _invoke.default;
_ccContext.default.setGlobalState = _setGlobalState.default;
var _default = _ccContext.default;
exports.default = _default;