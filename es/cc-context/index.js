import _extends from "@babel/runtime/helpers/esm/extends";

var _state2, _reducers;

import { MODULE_GLOBAL, MODULE_CC } from '../support/constant';
var refs = {};
/**
 ccClassContext:{
  ccKeys: [],
  ccKey_componentRef_: {},
  ccKey_option_: {},
 }
 */

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
  globalCcClassKeys: [],
  ccClassKey_ccClassContext_: {},
  store: {
    _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
    getState: function getState() {
      return ccContext.store._state;
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
    _reducers: (_reducers = {}, _reducers[MODULE_GLOBAL] = {}, _reducers[MODULE_CC] = {}, _reducers)
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