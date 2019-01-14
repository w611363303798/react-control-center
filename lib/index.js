"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _startup = _interopRequireDefault(require("./core/startup"));

var _register = _interopRequireDefault(require("./core/register"));

var _r = _interopRequireDefault(require("./core/r"));

var _registerToDefault = _interopRequireDefault(require("./core/register-to-default"));

var _registerSingleClassToDefault = _interopRequireDefault(require("./core/register-single-class-to-default"));

var _configure = _interopRequireDefault(require("./core/configure"));

var _invoke = _interopRequireDefault(require("./core/invoke"));

var _invokeSingle = _interopRequireDefault(require("./core/invoke-single"));

var _setGlobalState = _interopRequireDefault(require("./core/set-global-state"));

var _setState = _interopRequireDefault(require("./core/set-state"));

var _emit = _interopRequireDefault(require("./core/emit"));

var _emitWith = _interopRequireDefault(require("./core/emit-with"));

var _off = _interopRequireDefault(require("./core/off"));

var _connect = _interopRequireDefault(require("./core/connect"));

var _ccContext = _interopRequireDefault(require("./cc-context"));

var defaultExport = {
  emit: _emit.default,
  emitWith: _emitWith.default,
  off: _off.default,
  connect: _connect.default,
  startup: _startup.default,
  register: _register.default,
  r: _r.default,
  registerToDefault: _registerToDefault.default,
  registerSingleClassToDefault: _registerSingleClassToDefault.default,
  configure: _configure.default,
  invoke: _invoke.default,
  invokeSingle: _invokeSingle.default,
  setGlobalState: _setGlobalState.default,
  setState: _setState.default,
  ccContext: _ccContext.default
};

if (window) {
  window.cc = defaultExport;
}

var _default = defaultExport;
exports.default = _default;