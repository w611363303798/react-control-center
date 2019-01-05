import { MODULE_GLOBAL, MODULE_CC } from '../support/constant';

const refs = {};

const ccContext = {
  isDebug: false,
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  returnRootState: false,
  isModuleMode: false,
  isCcAlreadyStartup: false,
  moduleName_ccClassKeys_: {

  },
  // map from moduleName to sharedStateKeys
  moduleName_sharedStateKeys_: {

  },
  // map from moduleName to globalStateKeys
  moduleName_globalStateKeys_: {

  },
  moduleName_sharedKeysWhichMapToGlobal_: {

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
  // [globalKey]:{module:'xxx',key:'yyy'}
  globalMappingKey_sharedKey_: {

  },
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [

  ],
  //  all global keys that exclude sharedToGlobalMapping keys
  pureGlobalStateKeys:[

  ],
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
    setState: function (module, _partialSharedState) {
      const _state = ccContext.store._state;
      const fullSharedState = _state[module];
      const mergedState = { ...fullSharedState, ..._partialSharedState };
      _state[module] = mergedState;
    },
    setGlobalState: function (partialGlobalState) {
      const _state = ccContext.store._state;
      const fullGlobalState = _state[MODULE_GLOBAL];
      const mergedState = { ...fullGlobalState, ...partialGlobalState };
      _state[MODULE_GLOBAL] = mergedState;
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