import { MODULE_GLOBAL, MODULE_CC } from '../support/constant';

const refs = {};
const setStateByModule = (module, partialState) => {
  const _state = ccContext.store._state;
  const fullState = _state[module];
  const mergedState = { ...fullState, ...partialState };
  _state[module] = mergedState;
}

const ccContext = {
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
  moduleSingleClass: {

  },
  moduleName_ccClassKeys_: {

  },
  // map from moduleName to sharedStateKeys
  moduleName_sharedStateKeys_: {

  },
  // map from moduleName to globalStateKeys
  moduleName_globalStateKeys_: {

  },
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
  ccClassKey_ccClassContext_: {

  },
  // [globalKey]:${modules}, let cc know what modules are watching a same globalKey
  globalKey_toModules_: {

  },
  // [globalKey]:${sharedKey}
  globalMappingKey_sharedKey_: {

  },
  // [globalKey]:${modules}, let cc know what modules are watching a same globalMappingKey
  globalMappingKey_toModules_: {

  },
  // let cc know a globalMappingKey is mapped from which module
  globalMappingKey_fromModule_: {

  },
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [

  ],
  //  all global keys that exclude sharedToGlobalMapping keys
  pureGlobalStateKeys: [

  ],
  sharedToGlobalMapping: {

  },
  //  translate sharedToGlobalMapping object to another shape: {sharedKey: {globalMappingKey, fromModule}, ... }
  sharedKey_globalMappingKeyDescriptor_: {

  },
  store: {
    _state: {
      [MODULE_GLOBAL]: {

      },
      [MODULE_CC]: {

      }
    },
    getState: function (module) {
      if (module) return ccContext.store._state[module];
      else return ccContext.store._state;
    },
    setState: function (module, partialSharedState) {
      setStateByModule(module, partialSharedState);
    },
    setGlobalState: function (partialGlobalState) {
      setStateByModule(MODULE_GLOBAL, partialGlobalState);
    },
    getGlobalState: function () {
      return ccContext.store._state[MODULE_GLOBAL];
    }
  },
  reducer: {
    _reducer: {
      [MODULE_GLOBAL]: {

      },
      [MODULE_CC]: {

      }
    }
  },
  refStore: {
    _state: {

    },
    setState: function (ccUniqueKey, partialStoredState) {
      const _state = ccContext.refStore._state;
      const fullStoredState = _state[ccUniqueKey];
      const mergedState = { ...fullStoredState, ...partialStoredState };
      _state[ccUniqueKey] = mergedState;
    },
  },
  ccKey_ref_: refs,
  ccKey_option_: {

  },
  refs,
  info: {
    startupTime: Date.now(),
  }
}

export function getCcContext() {
  return ccContext;
}

export default ccContext;