"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _constant = require("../support/constant");

var _state2, _reducers;

/**
 ccClassContext:{
  ccKeys: [],
  ccKey_componentRef_: {},
  ccKey_option_: {},
 }
 */
var ccContext = {
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  returnRootState: false,
  isModuleMode: false,
  isCcAlreadyStartup: false,
  moduleName_ccClassKeys_: {},
  ccClassKey_ccClassContext_: {},
  store: {
    _state: (_state2 = {}, _state2[_constant.MODULE_GLOBAL] = {}, _state2[_constant.MODULE_CC] = {}, _state2),
    getState: function getState() {
      if (ccContext.returnRootState) {
        return ccContext.store._state;
      } else {
        if (ccContext.isModuleMode) {
          return ccContext.store._state;
        } else {
          return ccContext.store._state[_constant.MODULE_GLOBAL];
        }
      }
    },
    setState: function setState(module, partialModuleState) {
      var _state = ccContext.store._state;
      var fullModuleState = _state[module];
      var mergedState = (0, _extends2.default)({}, fullModuleState, partialModuleState);
      _state[module] = mergedState;
    }
  },
  reducer: {
    _reducers: (_reducers = {}, _reducers[_constant.MODULE_GLOBAL] = {}, _reducers[_constant.MODULE_CC] = {}, _reducers)
  }
};
var _default = ccContext;
exports.default = _default;