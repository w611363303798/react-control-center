import util, { isValueNotNull, isModuleStateValid, verboseInfo, styleStr, color, justWarning, isPlainJsonObject } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_DEFAULT, MODULE_CC_LIKE } from '../support/constant';
import ccContext from '../cc-context';
var vbi = verboseInfo;
var ss = styleStr;
var cl = color;

function checkModuleNames(moduleNames) {
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var name = moduleNames[i].toLowerCase();
    if (name === MODULE_CC) throw util.makeError(ERR.MODULE_KEY_CC_FOUND);
  }
}

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!isPlainJsonObject(store)) {
    throw new Error("the store is not a plain json object!");
  }

  if (!isPlainJsonObject(sharedToGlobalMapping)) {
    throw new Error("the sharedToGlobalMapping is not a plain json object!");
  }

  var _state = ccContext.store._state;
  _state[MODULE_CC] = {};

  if (isModuleMode) {
    var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
    var moduleNames = Object.keys(store);
    checkModuleNames(moduleNames, isModuleMode);
    var globalState = store[MODULE_GLOBAL];

    if (globalState) {
      if (!util.isModuleStateValid(globalState)) {
        throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + MODULE_GLOBAL + "'s value is invalid!"));
      } else {
        console.log(ss('$$global module state found while startup cc!'), cl());
      }
    } else {
      console.log(ss('$$global module state not found,cc will generate one for user automatically!'), cl());
      globalState = {};
    }

    _state[MODULE_GLOBAL] = globalState;
    var len = moduleNames.length;
    var isDefaultModuleExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName = moduleNames[i];

      if (_moduleName !== MODULE_GLOBAL) {
        if (!util.isModuleNameValid(_moduleName)) {
          throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + _moduleName + " is invalid!"));
        }

        var moduleState = store[_moduleName];

        if (!isModuleStateValid(moduleState)) {
          throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + _moduleName + "'s value is invalid!"));
        }

        if (_moduleName === MODULE_DEFAULT) {
          isDefaultModuleExist = true;
          console.log(ss('$$default module state found while startup cc!'), cl());
        }

        _state[_moduleName] = moduleState; //analyze sharedToGlobalMapping

        var sharedKey_globalKey_ = sharedToGlobalMapping[_moduleName];

        if (sharedKey_globalKey_) {
          //this module's some key will been mapped to global module
          var sharedKeys = Object.keys(sharedKey_globalKey_);
          var sLen = sharedKeys.length;

          for (var k = 0; k < sLen; k++) {
            var sharedKey = sharedKeys[k];

            if (!moduleState.hasOwnProperty(sharedKey)) {
              throw new Error("the module:" + _moduleName + " don't have a key named " + sharedKey + ", check your sharedToGlobalMapping");
            }

            var globalMappingKey = sharedKey_globalKey_[sharedKey];

            if (globalState.hasOwnProperty(globalMappingKey)) {
              throw new Error("the key:" + globalMappingKey + " is already declared in globalState, you can not use it to map the sharedStateKey:" + sharedKey + " to global state, try rename your mappingKey in sharedToGlobalMapping!");
            } else {
              globalState[globalMappingKey] = moduleState[sharedKey];
              globalMappingKey_sharedKey_[globalMappingKey] = {
                module: _moduleName,
                key: sharedKey
              };
            }
          }
        }
      }
    }

    if (!isDefaultModuleExist) {
      _state[MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    if (sharedToGlobalMapping) {
      throw util.makeError(ERR.STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    var includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
    var includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
    var invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule && !includeGlobalModule) {
        if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
          throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
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
          throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
        } else {
          _state[MODULE_GLOBAL] = store[MODULE_GLOBAL];
          invalidKeyCount += 1;
          console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        }
      } else {
        _state[MODULE_GLOBAL] = {};
      }

      if (Object.keys(store).length > invalidKeyCount) {
        // justWarning(`now cc is startup with non module mode, but the store you configured include a key named $$default but it has more than one key . cc will only pick $$default value as cc's $$default store, and the other key will be ignore`);
        justWarning("now cc is startup with non module mode, cc only allow you define store like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
      }
    } else {
      if (!util.isModuleStateValid(store)) {
        throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      _state[MODULE_DEFAULT] = store;
    }
  }
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
      throw util.makeError(ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
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
    checkModuleNames(moduleNames);
    var len = moduleNames.length;
    var isDefaultReducerExist = false,
        isGlobalReducerExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName2 = moduleNames[i];
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

// with isReducerKeyMeanNamespacedActionType = true
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
      _ref$isReducerKeyMean = _ref.isReducerKeyMeanNamespacedActionType,
      isReducerKeyMeanNamespacedActionType = _ref$isReducerKeyMean === void 0 ? false : _ref$isReducerKeyMean,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
      sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa;

  if (ccContext.isCcAlreadyStartup) {
    throw util.makeError(ERR.CC_ALREADY_STARTUP);
  }

  ccContext.isModuleMode = isModuleMode;
  ccContext.isStrict = isStrict;
  ccContext.isDebug = isDebug;
  ccContext.sharedToGlobalMapping = sharedToGlobalMapping;
  bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducerToCcContext(reducer);else bindReducerToCcContext(reducer, isModuleMode);

  if (window) {
    window.CC_CONTEXT = ccContext;
    window.cc = ccContext;
  }
}