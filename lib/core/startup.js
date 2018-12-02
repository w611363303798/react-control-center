"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));

var _util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var vbi = _util.verboseInfo;

function bindStoreToCcContext(store, isModuleMode) {
  var mergedStore;

  if (isModuleMode) {
    var _extends2;

    var moduleNames = Object.keys(store);
    var includeCC = moduleNames.filter(function (name) {
      return _constant.MODULE_CC_LIKE.includes(name);
    }).length > 0;

    if (includeCC) {
      throw _util.default.makeError(_constant.ERR.STORE_KEY_CC_FOUND);
    }

    var len = moduleNames.length;
    var hasGlobalModule = false;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];

      if (!_util.default.verifyModuleName(moduleName)) {
        throw _util.default.makeError(_constant.ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      var moduleValue = store[moduleName];

      if (!(0, _util.verifyModuleValue)(moduleValue)) {
        throw _util.default.makeError(_constant.ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + moduleName + "'s value is invalid!"));
      }

      if (moduleName === _constant.MODULE_GLOBAL) hasGlobalModule = ((0, _readOnlyError2.default)("hasGlobalModule"), true);
    }

    mergedStore = (0, _extends3.default)({}, store, (_extends2 = {}, _extends2[_constant.MODULE_CC] = {}, _extends2));
    if (!hasGlobalModule) mergedStore[_constant.MODULE_GLOBAL] = {};
  } else {
    var _mergedStore;

    mergedStore = (_mergedStore = {}, _mergedStore[_constant.MODULE_GLOBAL] = store, _mergedStore[_constant.MODULE_CC] = {}, _mergedStore);
  }

  _ccContext.default.store._state = mergedStore;
  return mergedStore;
}
/**
 * @description
 * @author zzk
 * @param {*} mergedStore
 * @param {*} namespacedKeyReducers may like: {'user/getUser':()=>{}, 'user/setUser':()=>{}}
 */


function bindNamespacedKeyReducersToCcContext(mergedStore, namespacedKeyReducers) {
  var namespacedActionTypes = Object.keys(reducers);
  var len2 = namespacedActionTypes.length;

  for (var i = 0; i < len2; i++) {
    var actionType = namespacedActionTypes[i];

    if (!_util.default.verifyActionType(actionType)) {
      throw _util.default.makeError(_constant.ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
    }

    var _util$disassembleActi = _util.default.disassembleActionType(actionType),
        moduleName = _util$disassembleActi.moduleName;

    if (!mergedStore[moduleName]) {
      throw _util.default.makeError(_constant.ERR.REDUCER_ACTION_TYPE_NO_MODULE, " actionType:" + actionType + "'s moduleName:" + moduleName + " is invalid!");
    }
  }

  _ccContext.default.reducer._reducers = reducers;
}
/**
 * @description
 * @author zzk
 * @param {*} mergedStore
 * @param {*} reducers may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducersToCcContext(mergedStore, reducers, isModuleMode) {
  var _reducers = _ccContext.default.reducer._reducers;

  if (isModuleMode) {
    var moduleNames = Object.keys(reducers);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];

      if (!mergedStore[moduleName]) {
        throw _util.default.makeError(_constant.ERR.REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE, vbi("moduleName:" + moduleName + " is invalid!"));
      }

      _reducers[moduleName] = reducers[moduleName];
    }
  } else {
    _reducers[_constant.MODULE_GLOBAL] = reducers;
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


function _default(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducers = _ref.reducers,
      reducers = _ref$reducers === void 0 ? {} : _ref$reducers,
      _ref$enableInvoke = _ref.enableInvoke,
      enableInvoke = _ref$enableInvoke === void 0 ? true : _ref$enableInvoke,
      _ref$isModuleMode = _ref.isModuleMode,
      isModuleMode = _ref$isModuleMode === void 0 ? false : _ref$isModuleMode,
      _ref$returnRootState = _ref.returnRootState,
      returnRootState = _ref$returnRootState === void 0 ? true : _ref$returnRootState,
      _ref$isReducerKeyMean = _ref.isReducerKeyMeanNamespacedActionType,
      isReducerKeyMeanNamespacedActionType = _ref$isReducerKeyMean === void 0 ? false : _ref$isReducerKeyMean,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict;

  if (_ccContext.default.isCcAlreadyStartup) {
    throw _util.default.makeError(_constant.ERR.CC_ALREADY_STARTUP);
  }

  _ccContext.default.isModuleMode = isModuleMode;
  _ccContext.default.returnRootState = returnRootState;
  _ccContext.default.isStrict = isStrict;
  var mergedStore = bindStoreToCcContext(store, isModuleMode);
  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducersToCcContext(mergedStore, reducers);else bindReducersToCcContext(mergedStore, reducers, isModuleMode);
  if (window) window.CC_CONTEXT = _ccContext.default;
}