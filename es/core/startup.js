import util, { verifyModuleValue, verboseInfo } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_CC_LIKE } from '../support/constant';
import ccContext from '../cc-context';
var vbi = verboseInfo;

function checkModuleNames(moduleNames) {
  var includeCC = moduleNames.filter(function (name) {
    return MODULE_CC_LIKE.includes(name);
  }).length > 0;

  if (includeCC) {
    throw util.makeError(ERR.MODULE_KEY_CC_FOUND);
  }
}

function bindStoreToCcContext(store, isModuleMode) {
  var _state = ccContext.store._state;

  if (isModuleMode) {
    var moduleNames = Object.keys(store);
    checkModuleNames(moduleNames);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];

      if (!util.verifyModuleName(moduleName)) {
        throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      var moduleValue = store[moduleName];

      if (!verifyModuleValue(moduleValue)) {
        throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + moduleName + "'s value is invalid!"));
      }

      _state[moduleName] = moduleValue;

      if (moduleName === MODULE_GLOBAL) {
        console.log('%c$$global module state found while startup cc!', 'color:green;border:1px solid green;');
      }
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
  var _reducers = ccContext.reducer._reducers;
  var len = namespacedActionTypes.length;

  for (var i = 0; i < len; i++) {
    var actionType = namespacedActionTypes[i];

    if (!util.verifyActionType(actionType)) {
      throw util.makeError(ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
    } // const { moduleName } = util.disassembleActionType(actionType);


    _reducers[actionType] = namespacedKeyReducers[actionType];
  }
}
/**
 * @description
 * @author zzk
 * @param {*} mergedStore
 * @param {*} reducers may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducersToCcContext(reducers, isModuleMode) {
  var _reducers = ccContext.reducer._reducers;

  if (isModuleMode) {
    var moduleNames = Object.keys(reducers);
    checkModuleNames(moduleNames);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i]; // if (!mergedStore[moduleName]) {
      //   throw util.makeError(ERR.REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE, vbi(`moduleName:${moduleName} is invalid!`));
      // }

      _reducers[moduleName] = reducers[moduleName];
    }
  } else {
    if (reducers.hasOwnProperty(MODULE_GLOBAL)) _reducers[MODULE_GLOBAL] = reducers[MODULE_GLOBAL];else _reducers[MODULE_GLOBAL] = reducers;
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
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug;

  if (ccContext.isCcAlreadyStartup) {
    throw util.makeError(ERR.CC_ALREADY_STARTUP);
  }

  ccContext.isModuleMode = isModuleMode;
  ccContext.returnRootState = returnRootState;
  ccContext.isStrict = isStrict;
  ccContext.isDebug = isDebug;
  bindStoreToCcContext(store, isModuleMode);
  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducersToCcContext(reducers);else bindReducersToCcContext(reducers, isModuleMode);

  if (window) {
    window.CC_CONTEXT = ccContext;
    window.cc = ccContext;
  }
}