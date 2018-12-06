import util, { verifyModuleValue, verboseInfo, styleStr, color, justWarning, isPlainJsonObject } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_DEFAULT, MODULE_CC_LIKE } from '../support/constant';
import ccContext from '../cc-context';

const vbi = verboseInfo;
const ss = styleStr;
const cl = color;

function checkModuleNames(moduleNames) {
  const len = moduleNames.length;
  for (let i = 0; i < len; i++) {
    const name = moduleNames[i].toLowerCase();
    if (name === MODULE_CC) throw util.makeError(ERR.MODULE_KEY_CC_FOUND);
  }
}

function bindStoreToCcContext(store, isModuleMode) {
  if (!isPlainJsonObject) {
    throw new Error(`the store is not a plain json object!`);
  }

  const _state = ccContext.store._state;
  _state[MODULE_CC] = {};

  if (isModuleMode) {
    const moduleNames = Object.keys(store);
    checkModuleNames(moduleNames, isModuleMode);

    const len = moduleNames.length;
    let isDefaultModuleExist = false, isGlobalModuleExist = false;
    for (let i = 0; i < len; i++) {
      const moduleName = moduleNames[i];
      if (!util.verifyModuleName(moduleName)) {
        throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(` moduleName:${moduleName} is invalid!`));
      }

      const moduleValue = store[moduleName];
      if (!verifyModuleValue(moduleValue)) {
        throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi(`moduleName:${moduleName}'s value is invalid!`));
      }
      if (moduleName === MODULE_DEFAULT) {
        isDefaultModuleExist = true;
        console.log(ss('$$default module state found while startup cc!'), cl());
      }
      if (moduleName === MODULE_GLOBAL) {
        isGlobalModuleExist = true;
        console.log(ss('$$global module state found while startup cc!'), cl());
      }

      _state[moduleName] = moduleValue;
    }

    if (!isDefaultModuleExist) {
      _state[MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
    if (!isGlobalModuleExist) {
      _state[MODULE_GLOBAL] = {};
      console.log(ss('$$global module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    const includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
    const includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
    let invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule) {
        if (!util.verifyModuleValue(store[MODULE_DEFAULT])) {
          throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(` moduleName:${moduleName}'s value is invalid!`));
        } else {
          _state[MODULE_DEFAULT] = store[MODULE_DEFAULT];
          invalidKeyCount += 1;
          console.log(ss('$$default module state found while startup cc with non module mode!'), cl());
        }
      } else {
        _state[MODULE_DEFAULT] = {};
      }

      if (includeGlobalModule) {
        if (!util.verifyModuleValue(store[MODULE_GLOBAL])) {
          throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(` moduleName:${moduleName}'s value is invalid!`));
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
        justWarning(`now cc is startup with non module mode, cc only allow you define store like {"$$default":{}, "$$global":{}}, cc will ignore other module keys`);
      }
    } else {
      if (!util.verifyModuleValue(store)) {
        throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(` moduleName:${moduleName} is invalid!`));
      }
      _state[MODULE_DEFAULT] = store;
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
  const namespacedActionTypes = Object.keys(reducers);
  const _reducers = ccContext.reducer._reducers;
  const len = namespacedActionTypes.length;
  for (let i = 0; i < len; i++) {
    const actionType = namespacedActionTypes[i];
    if (!util.verifyActionType(actionType)) {
      throw util.makeError(ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, ` actionType:${actionType} is invalid!`);
    }
    // const { moduleName } = util.disassembleActionType(actionType);
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
  const _reducers = ccContext.reducer._reducers;
  if (isModuleMode) {
    const moduleNames = Object.keys(reducers);
    checkModuleNames(moduleNames);

    const len = moduleNames.length;
    let isDefaultReducerExist = false, isGlobalReducerExist = false;
    for (let i = 0; i < len; i++) {
      const moduleName = moduleNames[i];
      _reducers[moduleName] = reducers[moduleName];
      if (moduleName === MODULE_DEFAULT) isDefaultReducerExist = true;
      if (moduleName === MODULE_GLOBAL) isGlobalReducerExist = true;
    }
    if(!isDefaultReducerExist)_reducers[MODULE_DEFAULT] = {};
    if(!isGlobalReducerExist)_reducers[MODULE_GLOBAL] = {};
  } else {
    if (reducers.hasOwnProperty(MODULE_DEFAULT)) _reducers[MODULE_DEFAULT] = reducers[MODULE_DEFAULT];
    else _reducers[MODULE_DEFAULT] = reducers;

    if (reducers.hasOwnProperty(MODULE_GLOBAL)) _reducers[MODULE_GLOBAL] = reducers[MODULE_GLOBAL];
    else _reducers[MODULE_GLOBAL] = {};
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
export default function ({
  store = {},
  reducers = {},
  isModuleMode = false,
  isReducerKeyMeanNamespacedActionType = false,
  isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
  isDebug = false,
} = {}) {
  if (ccContext.isCcAlreadyStartup) {
    throw util.makeError(ERR.CC_ALREADY_STARTUP);
  }
  ccContext.isModuleMode = isModuleMode;
  ccContext.isStrict = isStrict;
  ccContext.isDebug = isDebug;

  bindStoreToCcContext(store, isModuleMode);

  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducersToCcContext(reducers);
  else bindReducersToCcContext(reducers, isModuleMode);

  if (window) {
    window.CC_CONTEXT = ccContext;
    window.cc = ccContext;
  }
}