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
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isDebug: false,
  isStrict: false,
  returnRootState: false,
  isModuleMode: false,
  isCcAlreadyStartup: false,
  moduleName_ccClassKeys_: {},
  ccClassKey_ccClassContext_: {},
  store: {
    _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
    getState: function getState() {
      if (ccContext.returnRootState) {
        return ccContext.store._state;
      } else {
        if (ccContext.isModuleMode) {
          return ccContext.store._state;
        } else {
          return ccContext.store._state[MODULE_GLOBAL];
        }
      }
    },
    setState: function setState(module, partialModuleState) {
      var _state = ccContext.store._state;
      var fullModuleState = _state[module];

      var mergedState = _extends({}, fullModuleState, partialModuleState);

      _state[module] = mergedState;
    }
  },
  reducer: {
    _reducers: (_reducers = {}, _reducers[MODULE_GLOBAL] = {}, _reducers[MODULE_CC] = {}, _reducers)
  },
  refStore: {
    _state: {}
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