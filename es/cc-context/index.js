import _extends from "@babel/runtime/helpers/esm/extends";

var _state2, _reducer;

import { MODULE_GLOBAL, MODULE_CC } from '../support/constant';
var refs = {};

var setStateByModule = function setStateByModule(module, partialState) {
  // const fullState = getState(module);
  // const mergedState = { ...fullState, ...partialState };
  // _state[module] = mergedState;
  Object.keys(partialState).forEach(function (key) {
    setStateByModuleAndKey(module, key, partialState[key]);
  });
};

var _getState = function getState(module) {
  var _state = ccContext.store._state;
  return _state[module];
};

var setStateByModuleAndKey = function setStateByModuleAndKey(module, key, value) {
  var moduleState = _getState(module);

  moduleState[key] = value;
  var moduleComputedFn = computed._computedFn[module];

  if (moduleComputedFn) {
    var fn = moduleComputedFn[key];

    if (fn) {
      var computedValue = fn(value);
      computed._computedValue[module][key] = computedValue;
    }
  }
};

var computed = {
  _computedValue: {},
  _computedFn: {}
};
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
  propModuleName_ccClassKeys_: {//module is watched by these ccClass's propState
  },
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
      isPropModuleMode:false,// when false, data were collected into propState directly, else collected into propState[module]
      propState:{},
      propKey_stateKeyDescriptor_: {},
      stateKey_propKeyDescriptor_: {},
      stateToPropMapping:null,
      ccKeys: [],
    }
  */
  ccClassKey_ccClassContext_: {},
  // [globalKey]:${modules}, let cc know what modules are watching a same globalKey
  globalKey_toModules_: {},
  sharedToGlobalMapping: {},
  //  translate sharedToGlobalMapping object to another shape: {sharedKey: {globalMappingKey, fromModule}, ... }
  sharedKey_globalMappingKeyDescriptor_: {},
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
      if (module) return _getState(module);else return ccContext.store._state;
    },
    setState: function setState(module, partialSharedState) {
      setStateByModule(module, partialSharedState);
    },
    setStateByModuleAndKey: setStateByModuleAndKey,
    setGlobalState: function setGlobalState(partialGlobalState) {
      setStateByModule(MODULE_GLOBAL, partialGlobalState);
    },
    setGlobalStateByKey: function setGlobalStateByKey(key, value) {
      setStateByModuleAndKey(MODULE_GLOBAL, key, value);
    },
    getGlobalState: function getGlobalState() {
      return ccContext.store._state[MODULE_GLOBAL];
    }
  },
  reducer: {
    _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer)
  },
  computed: computed,
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
  //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
  event_handlers_: {},
  ccUniqueKey_handlerKeys_: {},
  // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
  // it is a ref that towards ccUniqueKeyEvent_handler_'s key
  // when component unmounted, it's handler will been removed
  handlerKey_handler_: {},
  ccKey_option_: {},
  refs: refs,
  info: {
    startupTime: Date.now(),
    version: '1.1.68',
    author: ['624313307@qq.com', 'zhongzhengkai@hotmail.com'],
    tag: 'promise land'
  },
  // fragment association
  fragmentNameCount: 0,
  fragmentFeature_classKey_: {},
  fragmentCcKeys: [],
  errorHandler: null,
  middlewares: []
};

if (window && !window.sss) {
  window.sss = ccContext.store._state;
}

export function getCcContext() {
  return ccContext;
}
var lsLen = localStorage.length;
var _refStoreState = ccContext.refStore._state;

for (var i = 0; i < lsLen; i++) {
  var lsKey = localStorage.key(i);

  if (lsKey.startsWith('CCSS_')) {
    try {
      _refStoreState[lsKey.substr(5)] = JSON.parse(localStorage.getItem(lsKey));
    } catch (err) {
      console.error(err);
    }
  }
}

export default ccContext;