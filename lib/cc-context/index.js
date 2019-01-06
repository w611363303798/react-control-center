"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getCcContext = getCcContext;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _constant = require("../support/constant");

var _state2, _reducer;

var refs = {};
var ccContext = {
  isDebug: false,
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  returnRootState: false,
  isModuleMode: false,
  isCcAlreadyStartup: false,
  //  cc allow multi react class register to a module by default, but if want to control some module 
  //  to only allow register one react class, flag the module name as true in this option object
  //  example:  {fooModule: true, barModule:true}
  moduleSingleClass: {},
  moduleName_ccClassKeys_: {},
  // map from moduleName to sharedStateKeys
  moduleName_sharedStateKeys_: {},
  // map from moduleName to globalStateKeys
  moduleName_globalStateKeys_: {},
  //to let cc know which ccClass are watching globalStateKeys
  globalCcClassKeys: [],

  /**
    ccClassContext:{
      module,
      sharedStateKeys,
      globalStateKeys,
      ccKeys: [],
    }
  */
  ccClassKey_ccClassContext_: {},
  // [globalKey]:${modules}, let cc know what modules are watching a same globalKey
  globalKey_toModules_: {},
  // [globalKey]:${sharedKey}
  globalMappingKey_sharedKey_: {},
  // [globalKey]:${modules}, let cc know what modules are watching a same globalMappingKey
  globalMappingKey_toModules_: {},
  // let cc know a globalMappingKey is mapped from which module
  globalMappingKey_fromModule_: {},
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [],
  //  all global keys that exclude sharedToGlobalMapping keys
  pureGlobalStateKeys: [],
  sharedToGlobalMapping: {},
  //  translate sharedToGlobalMapping object to another shape: {sharedKey: {globalMappingKey, fromModule}, ... }
  sharedKey_globalMappingKeyDescriptor_: {},
  store: {
    _state: (_state2 = {}, _state2[_constant.MODULE_GLOBAL] = {}, _state2[_constant.MODULE_CC] = {}, _state2),
    getState: function getState(module) {
      if (module) return ccContext.store._state[module];else return ccContext.store._state;
    },
    setState: function setState(module, _partialSharedState) {
      var _state = ccContext.store._state;
      var fullSharedState = _state[module];
      var mergedState = (0, _extends2.default)({}, fullSharedState, _partialSharedState);
      _state[module] = mergedState;
    },
    setGlobalState: function setGlobalState(partialGlobalState) {
      var _state = ccContext.store._state;
      var fullGlobalState = _state[_constant.MODULE_GLOBAL];
      var mergedState = (0, _extends2.default)({}, fullGlobalState, partialGlobalState);
      _state[_constant.MODULE_GLOBAL] = mergedState;
    },
    getGlobalState: function getGlobalState() {
      return ccContext.store._state[_constant.MODULE_GLOBAL];
    }
  },
  reducer: {
    _reducer: (_reducer = {}, _reducer[_constant.MODULE_GLOBAL] = {}, _reducer[_constant.MODULE_CC] = {}, _reducer)
  },
  refStore: {
    _state: {},
    setState: function setState(ccUniqueKey, partialStoredState) {
      var _state = ccContext.refStore._state;
      var fullStoredState = _state[ccUniqueKey];
      var mergedState = (0, _extends2.default)({}, fullStoredState, partialStoredState);
      _state[ccUniqueKey] = mergedState;
    }
  },
  ccKey_ref_: refs,
  ccKey_option_: {},
  refs: refs,
  info: {
    startupTime: Date.now()
  }
};

function getCcContext() {
  return ccContext;
}

var _default = ccContext;
exports.default = _default;