import { MODULE_GLOBAL } from '../support/constant';

/**
 ccClassContext:{
  ccKeys: [],
  ccKey_componentRef_: {},
  ccKey_option_: {},
 }
 */
const ccContext = {
   // if isStrict is true, every error will be throw out instead of console.error, 
   // but this may crash your app, make sure you have a nice error handling way,
   // like componentDidCatch in react 16.*
  isStrict: false,
  returnRootState: false,
  isModuleMode: false,
  isCcAlreadyStartup: false,
  moduleName_ccClassKeys_: {

  },
  ccClassKey_ccClassContext_: {

  },
  store: {
    _state: {},
    getState: function () {
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
    setState: function (module, partialModuleState) {
      const _state = ccContext.store._state;
      const fullModuleState = _state[module];
      const mergedState = { ...fullModuleState, ...partialModuleState };
      _state[module] = mergedState;
    }
  },
  reducer: {
    _reducers: {}
  }
}

export default ccContext;