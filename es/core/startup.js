import util, { verboseInfo, styleStr, color, justWarning, isPlainJsonObject } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_DEFAULT } from '../support/constant';
import * as helper from './helper';
import ccContext from '../cc-context';
var vbi = verboseInfo;
var ss = styleStr;
var cl = color;

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!isPlainJsonObject(store)) {
    throw new Error("the store is not a plain json object!");
  }

  if (!isPlainJsonObject(sharedToGlobalMapping)) {
    throw new Error("the sharedToGlobalMapping is not a plain json object!");
  }

  ccContext.sharedToGlobalMapping = sharedToGlobalMapping;
  var globalStateKeys = ccContext.globalStateKeys;
  var pureGlobalStateKeys = ccContext.pureGlobalStateKeys;
  var _state = ccContext.store._state;
  var globalState = store[MODULE_GLOBAL];
  _state[MODULE_CC] = {};

  if (isModuleMode) {
    var moduleNames = Object.keys(store);

    if (globalState) {
      if (!util.isModuleStateValid(globalState)) {
        throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi("moduleName:" + MODULE_GLOBAL + "'s value is invalid!"));
      } else {
        console.log(ss('$$global module state found while startup cc!'), cl());
        Object.keys(globalState).forEach(function (key) {
          globalStateKeys.push(key);
        });
      }
    } else {
      console.log(ss('$$global module state not found, cc will generate one for user automatically!'), cl());
      globalState = {};
    }

    _state[MODULE_GLOBAL] = globalState;
    var len = moduleNames.length;
    var isDefaultModuleExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName = moduleNames[i];

      if (_moduleName !== MODULE_GLOBAL) {
        helper.checkModuleName(_moduleName);
        var moduleState = store[_moduleName];
        helper.checkModuleState(moduleState);

        if (_moduleName === MODULE_DEFAULT) {
          isDefaultModuleExist = true;
          console.log(ss('$$default module state found while startup cc!'), cl());
        }

        _state[_moduleName] = moduleState;
        var sharedKey_globalKey_ = sharedToGlobalMapping[_moduleName];

        if (sharedKey_globalKey_) {
          helper.handleModuleSharedToGlobalMapping(_moduleName, sharedKey_globalKey_);
        }
      }
    }

    if (!isDefaultModuleExist) {
      _state[MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    // non module mode
    if (sharedToGlobalMapping) {
      throw util.makeError(ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    var includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
    var includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
    var invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule && !includeGlobalModule) {
        if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
          throw util.makeError(ERR.CC_MODULE_NAME_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
        } else {
          _state[MODULE_DEFAULT] = store[MODULE_DEFAULT];
          invalidKeyCount += 1;
          console.log(ss('$$default module state found while startup cc with non module mode!'), cl());
        }
      } else {
        _state[MODULE_DEFAULT] = {};
      }

      if (includeGlobalModule && !includeDefaultModule) {
        if (!util.isModuleStateValid(store[MODULE_GLOBAL])) {
          throw util.makeError(ERR.CC_MODULE_NAME_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
        } else {
          globalState = store[MODULE_GLOBAL];
          Object.keys(globalState).forEach(function (key) {
            globalStateKeys.push(key);
          });
          invalidKeyCount += 1;
          console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        }
      } else {
        globalState = {};
      }

      _state[MODULE_GLOBAL] = globalState;

      if (Object.keys(store).length > invalidKeyCount) {
        justWarning("now cc is startup with non module mode, cc only allow you define store like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
      }
    } else {
      // treat store as $$default module store
      if (!util.isModuleStateValid(store)) {
        throw util.makeError(ERR.CC_MODULE_NAME_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      _state[MODULE_DEFAULT] = store;
    }
  }

  var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
  globalStateKeys.reduce(function (pKeys, gKey) {
    if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
    return pKeys;
  }, pureGlobalStateKeys);
}
/**
 * @description
 * @author zzk
 * @param {*} mergedStore
 * @param {*} namespacedKeyReducer may like: {'user/getUser':()=>{}, 'user/setUser':()=>{}}
 */


function bindNamespacedKeyReducerToCcContext(namespacedKeyReducer) {
  var namespacedActionTypes = Object.keys(namespacedKeyReducer);
  var _reducer = ccContext.reducer._reducer;
  var len = namespacedActionTypes.length;

  for (var i = 0; i < len; i++) {
    var actionType = namespacedActionTypes[i];

    if (!util.verifyActionType(actionType)) {
      throw util.makeError(ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
    } // const { moduleName } = util.disassembleActionType(actionType);


    _reducer[actionType] = namespacedKeyReducer[actionType];
  }

  throw new Error('now isReducerKeyMeanNamespacedActionType is not supported by current version react-control-center, it will coming soon!');
}
/**
 * @description
 * @author zzk
 * @param {*} reducer may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducerToCcContext(reducer, isModuleMode) {
  var _reducer = ccContext.reducer._reducer;

  if (isModuleMode) {
    var moduleNames = Object.keys(reducer);
    var len = moduleNames.length;
    var isDefaultReducerExist = false,
        isGlobalReducerExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName2 = moduleNames[i];
      helper.checkModuleName(_moduleName2, true);
      _reducer[_moduleName2] = reducer[_moduleName2];
      if (_moduleName2 === MODULE_DEFAULT) isDefaultReducerExist = true;
      if (_moduleName2 === MODULE_GLOBAL) isGlobalReducerExist = true;
    }

    if (!isDefaultReducerExist) _reducer[MODULE_DEFAULT] = {};
    if (!isGlobalReducerExist) _reducer[MODULE_GLOBAL] = {};
  } else {
    if (reducer.hasOwnProperty(MODULE_DEFAULT)) _reducer[MODULE_DEFAULT] = reducer[MODULE_DEFAULT];else _reducer[MODULE_DEFAULT] = reducer;
    if (reducer.hasOwnProperty(MODULE_GLOBAL)) _reducer[MODULE_GLOBAL] = reducer[MODULE_GLOBAL];else _reducer[MODULE_GLOBAL] = {};
  }
}

function executeInitializer(isModuleMode, store, init) {
  var stateHandler = helper.getStateHandlerForInit;

  if (!isModuleMode) {
    if (isPlainJsonObject(init)) {
      var includeDefaultModule = init.hasOwnProperty(MODULE_DEFAULT);
      var includeGlobalModule = init.hasOwnProperty(MODULE_GLOBAL);

      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          var defaultInit = init[MODULE_DEFAULT];

          if (typeof defaultInit !== 'function') {
            throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
          } else {
            defaultInit(stateHandler(MODULE_DEFAULT));
          }
        }

        if (includeGlobalModule) {
          var globalInit = init[MODULE_GLOBAL];

          if (typeof globalInit !== 'function') {
            throw new Error('init.$$global value must be a function when cc startup in nonModuleMode!');
          } else {
            globalInit(stateHandler(MODULE_GLOBAL));
          }
        }
      } else {
        throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
      }
    } else {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
      }

      init(stateHandler(MODULE_DEFAULT));
    }
  } else {
    if (!isPlainJsonObject(init)) {
      throw new Error('init value must be a object like { ${moduleName}:Function } when cc startup in moduleMode!');
    }

    var moduleNames = Object.keys(init);
    moduleNames.forEach(function (moduleName) {
      if (!store[moduleName]) {
        throw new Error("module " + moduleName + " not found, check your ccStartupOption.init object keys");
      }

      var initFn = init[moduleName];
      initFn(stateHandler(moduleName));
    });
  }
}
/* 
store in CC_CONTEXT may like:
 {
  $$global:{
 
  },
  module1:{
    books:[],
    user:{},
    color:'red',
    readCount:5,
  },
  module2:{
    books:[],
    colors:[],
    followCount:15,
  }
}
 
// with isReducerKeyMeanNamespacedActionType = false
reducer = {
  [moduleName1]:{
    [actionType1]:callback(setState, {type:'',payload:''})
    [actionType2]:callback(setState, {type:'',payload:''})
  },
  [moduleName2]:{
    [actionType1]:callback(setState, {type:'',payload:''})
  }
}
 
// with isReducerKeyMeanNamespacedActionType = true, to be implement
reducer = {
  '[moduleName1]/type1':callback(setState, {type:'',payload:''}),
  '[moduleName1]/type2':callback(setState, {type:'',payload:''}),
  '[moduleName2]/type1':callback(setState, {type:'',payload:''}),
}
 
init = {
  global:(setState)=>{}
}
*/

/*
  {
    vip:{
      books:'vipBooks'
    }
  }
*/


export default function (_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
      _ref$isModuleMode = _ref.isModuleMode,
      isModuleMode = _ref$isModuleMode === void 0 ? false : _ref$isModuleMode,
      _ref$moduleSingleClas = _ref.moduleSingleClass,
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
      _ref$isReducerKeyMean = _ref.isReducerKeyMeanNamespacedActionType,
      isReducerKeyMeanNamespacedActionType = _ref$isReducerKeyMean === void 0 ? false : _ref$isReducerKeyMean,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
      sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa,
      _ref$init = _ref.init,
      init = _ref$init === void 0 ? null : _ref$init;

  if (window) {
    window.CC_CONTEXT = ccContext;
    window.ccc = ccContext;
  }

  if (ccContext.isCcAlreadyStartup) {
    throw util.makeError(ERR.CC_ALREADY_STARTUP);
  }

  ccContext.isModuleMode = isModuleMode;
  ccContext.isStrict = isStrict;
  ccContext.isDebug = isDebug;
  util.safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
  util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
  bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducerToCcContext(reducer);else bindReducerToCcContext(reducer, isModuleMode);

  if (init) {
    var computedStore = ccContext.store._state;
    executeInitializer(isModuleMode, computedStore, init);
  }

  ccContext.isCcAlreadyStartup = true;
}