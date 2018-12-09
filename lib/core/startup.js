"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var vbi = _util.verboseInfo;
var ss = _util.styleStr;
var cl = _util.color;

function checkModuleNames(moduleNames) {
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var name = moduleNames[i].toLowerCase();
    if (name === _constant.MODULE_CC) throw _util.default.makeError(_constant.ERR.MODULE_KEY_CC_FOUND);
  }
}

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!(0, _util.isPlainJsonObject)(store)) {
    throw new Error("the store is not a plain json object!");
  }

  if (!(0, _util.isPlainJsonObject)(sharedToGlobalMapping)) {
    throw new Error("the sharedToGlobalMapping is not a plain json object!");
  }

  var _state = _ccContext.default.store._state;
  _state[_constant.MODULE_CC] = {};

  if (isModuleMode) {
    var globalMappingKey_sharedKey_ = _ccContext.default.globalMappingKey_sharedKey_;
    var moduleNames = Object.keys(store);
    checkModuleNames(moduleNames, isModuleMode);
    var globalState = store[_constant.MODULE_GLOBAL];

    if (globalState) {
      if (!_util.default.isModuleStateValid(globalState)) {
        throw _util.default.makeError(_constant.ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + _constant.MODULE_GLOBAL + "'s value is invalid!"));
      } else {
        console.log(ss('$$global module state found while startup cc!'), cl());
      }
    } else {
      console.log(ss('$$global module state not found,cc will generate one for user automatically!'), cl());
      globalState = {};
    }

    _state[_constant.MODULE_GLOBAL] = globalState;
    var len = moduleNames.length;
    var isDefaultModuleExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName = moduleNames[i];

      if (_moduleName !== _constant.MODULE_GLOBAL) {
        if (!_util.default.isModuleNameValid(_moduleName)) {
          throw _util.default.makeError(_constant.ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + _moduleName + " is invalid!"));
        }

        var moduleState = store[_moduleName];

        if (!(0, _util.isModuleStateValid)(moduleState)) {
          throw _util.default.makeError(_constant.ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + _moduleName + "'s value is invalid!"));
        }

        if (_moduleName === _constant.MODULE_DEFAULT) {
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
      _state[_constant.MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    if (sharedToGlobalMapping) {
      throw _util.default.makeError(_constant.ERR.STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    var includeDefaultModule = store.hasOwnProperty(_constant.MODULE_DEFAULT);
    var includeGlobalModule = store.hasOwnProperty(_constant.MODULE_GLOBAL);
    var invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule && !includeGlobalModule) {
        if (!_util.default.isModuleStateValid(store[_constant.MODULE_DEFAULT])) {
          throw _util.default.makeError(_constant.ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
        } else {
          _state[_constant.MODULE_DEFAULT] = store[_constant.MODULE_DEFAULT];
          invalidKeyCount += 1;
          console.log(ss('$$default module state found while startup cc with non module mode!'), cl());
        }
      } else {
        _state[_constant.MODULE_DEFAULT] = {};
      }

      if (includeGlobalModule && !includeDefaultModule) {
        if (!_util.default.isModuleStateValid(store[_constant.MODULE_GLOBAL])) {
          throw _util.default.makeError(_constant.ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
        } else {
          _state[_constant.MODULE_GLOBAL] = store[_constant.MODULE_GLOBAL];
          invalidKeyCount += 1;
          console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        }
      } else {
        _state[_constant.MODULE_GLOBAL] = {};
      }

      if (Object.keys(store).length > invalidKeyCount) {
        // justWarning(`now cc is startup with non module mode, but the store you configured include a key named $$default but it has more than one key . cc will only pick $$default value as cc's $$default store, and the other key will be ignore`);
        (0, _util.justWarning)("now cc is startup with non module mode, cc only allow you define store like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
      }
    } else {
      if (!_util.default.isModuleStateValid(store)) {
        throw _util.default.makeError(_constant.ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      _state[_constant.MODULE_DEFAULT] = store;
    }
  }
}
/**
 * @description
 * @author zzk
 * @param {*} mergedStore
 * @param {*} namespacedKeyReducers may like: {'user/getUser':()=>{}, 'user/setUser':()=>{}}
 */


function bindNamespacedKeyReducersToCcContext(namespacedKeyReducers) {
  var namespacedActionTypes = Object.keys(reducers);
  var _reducers = _ccContext.default.reducer._reducers;
  var len = namespacedActionTypes.length;

  for (var i = 0; i < len; i++) {
    var actionType = namespacedActionTypes[i];

    if (!_util.default.verifyActionType(actionType)) {
      throw _util.default.makeError(_constant.ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
    } // const { moduleName } = util.disassembleActionType(actionType);


    _reducers[actionType] = namespacedKeyReducers[actionType];
  }

  throw new Error('now isReducerKeyMeanNamespacedActionType is not supported by current version react-control-center, it will coming soon!');
}
/**
 * @description
 * @author zzk
 * @param {*} reducers may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducersToCcContext(reducers, isModuleMode) {
  var _reducers = _ccContext.default.reducer._reducers;

  if (isModuleMode) {
    var moduleNames = Object.keys(reducers);
    checkModuleNames(moduleNames);
    var len = moduleNames.length;
    var isDefaultReducerExist = false,
        isGlobalReducerExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName2 = moduleNames[i];
      _reducers[_moduleName2] = reducers[_moduleName2];
      if (_moduleName2 === _constant.MODULE_DEFAULT) isDefaultReducerExist = true;
      if (_moduleName2 === _constant.MODULE_GLOBAL) isGlobalReducerExist = true;
    }

    if (!isDefaultReducerExist) _reducers[_constant.MODULE_DEFAULT] = {};
    if (!isGlobalReducerExist) _reducers[_constant.MODULE_GLOBAL] = {};
  } else {
    if (reducers.hasOwnProperty(_constant.MODULE_DEFAULT)) _reducers[_constant.MODULE_DEFAULT] = reducers[_constant.MODULE_DEFAULT];else _reducers[_constant.MODULE_DEFAULT] = reducers;
    if (reducers.hasOwnProperty(_constant.MODULE_GLOBAL)) _reducers[_constant.MODULE_GLOBAL] = reducers[_constant.MODULE_GLOBAL];else _reducers[_constant.MODULE_GLOBAL] = {};
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
reducers = {
  [moduleName1]:{
    [actionType1]:callback(setState, {type:'',payload:''})
    [actionType2]:callback(setState, {type:'',payload:''})
  },
  [moduleName2]:{
    [actionType1]:callback(setState, {type:'',payload:''})
  }
}

// with isReducerKeyMeanNamespacedActionType = true
reducers = {
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


function _default(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducers = _ref.reducers,
      reducers = _ref$reducers === void 0 ? {} : _ref$reducers,
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

  if (_ccContext.default.isCcAlreadyStartup) {
    throw _util.default.makeError(_constant.ERR.CC_ALREADY_STARTUP);
  }

  _ccContext.default.isModuleMode = isModuleMode;
  _ccContext.default.isStrict = isStrict;
  _ccContext.default.isDebug = isDebug;
  _ccContext.default.sharedToGlobalMapping = sharedToGlobalMapping;
  bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducersToCcContext(reducers);else bindReducersToCcContext(reducers, isModuleMode);

  if (window) {
    window.CC_CONTEXT = _ccContext.default;
    window.cc = _ccContext.default;
  }
}