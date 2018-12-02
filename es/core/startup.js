import _extends from "@babel/runtime/helpers/esm/extends";
import _readOnlyError from "@babel/runtime/helpers/esm/readOnlyError";
import util, { verifyModuleValue, verboseInfo } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_CC_LIKE } from '../support/constant';
import ccContext from '../cc-context';
var vbi = verboseInfo;

function bindStoreToCcContext(store, isModuleMode) {
  var mergedStore;

  if (isModuleMode) {
    var _extends2;

    var moduleNames = Object.keys(store);
    var includeCC = moduleNames.filter(function (name) {
      return MODULE_CC_LIKE.includes(name);
    }).length > 0;

    if (includeCC) {
      throw util.makeError(ERR.STORE_KEY_CC_FOUND);
    }

    var len = moduleNames.length;
    var hasGlobalModule = false;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];

      if (!util.verifyModuleName(moduleName)) {
        throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      var moduleValue = store[moduleName];

      if (!verifyModuleValue(moduleValue)) {
        throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + moduleName + "'s value is invalid!"));
      }

      if (moduleName === MODULE_GLOBAL) hasGlobalModule = (_readOnlyError("hasGlobalModule"), true);
    }

    mergedStore = _extends({}, store, (_extends2 = {}, _extends2[MODULE_CC] = {}, _extends2));
    if (!hasGlobalModule) mergedStore[MODULE_GLOBAL] = {};
  } else {
    var _mergedStore;

    mergedStore = (_mergedStore = {}, _mergedStore[MODULE_GLOBAL] = store, _mergedStore[MODULE_CC] = {}, _mergedStore);
  }

  ccContext.store._state = mergedStore;
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

    if (!util.verifyActionType(actionType)) {
      throw util.makeError(ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
    }

    var _util$disassembleActi = util.disassembleActionType(actionType),
        moduleName = _util$disassembleActi.moduleName;

    if (!mergedStore[moduleName]) {
      throw util.makeError(ERR.REDUCER_ACTION_TYPE_NO_MODULE, " actionType:" + actionType + "'s moduleName:" + moduleName + " is invalid!");
    }
  }

  ccContext.reducer._reducers = reducers;
}
/**
 * @description
 * @author zzk
 * @param {*} mergedStore
 * @param {*} reducers may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducersToCcContext(mergedStore, reducers, isModuleMode) {
  var _reducers = ccContext.reducer._reducers;

  if (isModuleMode) {
    var moduleNames = Object.keys(reducers);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];

      if (!mergedStore[moduleName]) {
        throw util.makeError(ERR.REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE, vbi("moduleName:" + moduleName + " is invalid!"));
      }

      _reducers[moduleName] = reducers[moduleName];
    }
  } else {
    _reducers[MODULE_GLOBAL] = reducers;
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


export default function (_temp) {
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

  if (ccContext.isCcAlreadyStartup) {
    throw util.makeError(ERR.CC_ALREADY_STARTUP);
  }

  ccContext.isModuleMode = isModuleMode;
  ccContext.returnRootState = returnRootState;
  ccContext.isStrict = isStrict;
  var mergedStore = bindStoreToCcContext(store, isModuleMode);
  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducersToCcContext(mergedStore, reducers);else bindReducersToCcContext(mergedStore, reducers, isModuleMode);
  if (window) window.CC_CONTEXT = ccContext;
}