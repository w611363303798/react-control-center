import _extends from "@babel/runtime/helpers/esm/extends";

var _state2, _reducer;

import { MODULE_GLOBAL, MODULE_CC } from '../support/constant';
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
  store: {
    _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
    getState: function getState(module) {
      if (module) return ccContext.store._state[module];else return ccContext.store._state;
    },
    setState: function setState(module, _partialSharedState) {
      var _state = ccContext.store._state;
      var fullSharedState = _state[module];

      var mergedState = _extends({}, fullSharedState, _partialSharedState);

      _state[module] = mergedState;
    },
    setGlobalState: function setGlobalState(partialGlobalState) {
      var _state = ccContext.store._state;
      var fullGlobalState = _state[MODULE_GLOBAL];

      var mergedState = _extends({}, fullGlobalState, partialGlobalState);

      _state[MODULE_GLOBAL] = mergedState;
    },
    getGlobalState: function getGlobalState() {
      return ccContext.store._state[MODULE_GLOBAL];
    }
  },
  reducer: {
    _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer)
  },
  refStore: {
    _state: {},
    setState: function setState(ccUniqueKey, partialStoredState) {
      var _state = ccContext.refStore._state;
      var fullStoredState = _state[ccUniqueKey];

      var mergedState = _extends({}, fullStoredState, partialStoredState);

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
export function getCcContext() {
  return ccContext;
}
export default ccContext;