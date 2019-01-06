import util, { verboseInfo, styleStr, color, justWarning, isPlainJsonObject } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_DEFAULT } from '../support/constant';
import * as helper from './helper';
import ccContext from '../cc-context';

const vbi = verboseInfo;
const ss = styleStr;
const cl = color;

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!isPlainJsonObject(store)) {
    throw new Error(`the store is not a plain json object!`);
  }
  if (!isPlainJsonObject(sharedToGlobalMapping)) {
    throw new Error(`the sharedToGlobalMapping is not a plain json object!`);
  }
  ccContext.sharedToGlobalMapping = sharedToGlobalMapping;
  const globalStateKeys = ccContext.globalStateKeys;
  const pureGlobalStateKeys = ccContext.pureGlobalStateKeys;

  const _state = ccContext.store._state;
  _state[MODULE_CC] = {};

  if (isModuleMode) {
    const moduleNames = Object.keys(store);

    let globalState = store[MODULE_GLOBAL];
    if (globalState) {
      if (!util.isModuleStateValid(globalState)) {
        throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(`moduleName:${MODULE_GLOBAL}'s value is invalid!`));
      } else {
        console.log(ss('$$global module state found while startup cc!'), cl());
        Object.keys(globalState).forEach(key => {
          globalStateKeys.push(key);
          pureGlobalStateKeys.push(key);
        });
      }
    } else {
      console.log(ss('$$global module state not found, cc will generate one for user automatically!'), cl());
      globalState = {};
    }
    _state[MODULE_GLOBAL] = globalState;

    const len = moduleNames.length;
    let isDefaultModuleExist = false;
    for (let i = 0; i < len; i++) {
      const moduleName = moduleNames[i];
      if (moduleName !== MODULE_GLOBAL) {
        helper.checkModuleName(moduleName);
        const moduleState = store[moduleName];
        helper.checkModuleState(moduleState);

        if (moduleName === MODULE_DEFAULT) {
          isDefaultModuleExist = true;
          console.log(ss('$$default module state found while startup cc!'), cl());
        }
        _state[moduleName] = moduleState;

        const sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];
        if (sharedKey_globalKey_) {
          helper.handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
        }
      }
    }

    if (!isDefaultModuleExist) {
      _state[MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {// non module mode
    if (sharedToGlobalMapping) {
      throw util.makeError(ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    const includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
    const includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
    let invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule && !includeGlobalModule) {
        if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
          throw util.makeError(ERR.CC_MODULE_NAME_INVALID, vbi(` moduleName:${moduleName}'s value is invalid!`));
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
          throw util.makeError(ERR.CC_MODULE_NAME_INVALID, vbi(` moduleName:${moduleName}'s value is invalid!`));
        } else {
          _state[MODULE_GLOBAL] = store[MODULE_GLOBAL];
          Object.keys(store[MODULE_GLOBAL]).forEach(key => {
            globalStateKeys.push(key);
            pureGlobalStateKeys.push(key);
          });
          invalidKeyCount += 1;
          console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        }
      } else {
        _state[MODULE_GLOBAL] = {};
      }

      if (Object.keys(store).length > invalidKeyCount) {
        justWarning(`now cc is startup with non module mode, cc only allow you define store like {"$$default":{}, "$$global":{}}, cc will ignore other module keys`);
      }
    } else {// treat store as $$default module store
      if (!util.isModuleStateValid(store)) {
        throw util.makeError(ERR.CC_MODULE_NAME_INVALID, vbi(` moduleName:${moduleName} is invalid!`));
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
  const namespacedActionTypes = Object.keys(namespacedKeyReducer);
  const _reducer = ccContext.reducer._reducer;
  const len = namespacedActionTypes.length;
  for (let i = 0; i < len; i++) {
    const actionType = namespacedActionTypes[i];
    if (!util.verifyActionType(actionType)) {
      throw util.makeError(ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID, ` actionType:${actionType} is invalid!`);
    }
    // const { moduleName } = util.disassembleActionType(actionType);
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
  const _reducer = ccContext.reducer._reducer;
  if (isModuleMode) {
    const moduleNames = Object.keys(reducer);

    const len = moduleNames.length;
    let isDefaultReducerExist = false, isGlobalReducerExist = false;
    for (let i = 0; i < len; i++) {
      const moduleName = moduleNames[i];
      helper.checkModuleName(moduleName, true);
      _reducer[moduleName] = reducer[moduleName];
      if (moduleName === MODULE_DEFAULT) isDefaultReducerExist = true;
      if (moduleName === MODULE_GLOBAL) isGlobalReducerExist = true;
    }
    if (!isDefaultReducerExist) _reducer[MODULE_DEFAULT] = {};
    if (!isGlobalReducerExist) _reducer[MODULE_GLOBAL] = {};
  } else {
    if (reducer.hasOwnProperty(MODULE_DEFAULT)) _reducer[MODULE_DEFAULT] = reducer[MODULE_DEFAULT];
    else _reducer[MODULE_DEFAULT] = reducer;

    if (reducer.hasOwnProperty(MODULE_GLOBAL)) _reducer[MODULE_GLOBAL] = reducer[MODULE_GLOBAL];
    else _reducer[MODULE_GLOBAL] = {};
  }
}

function executeInitializer(isModuleMode, store, init) {
  const stateHandler = helper.getStateHandlerForInit;

  if (!isModuleMode) {
    if (isPlainJsonObject(init)) {
      const includeDefaultModule = init.hasOwnProperty(MODULE_DEFAULT);
      const includeGlobalModule = init.hasOwnProperty(MODULE_GLOBAL);
      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          const defaultInit = init[MODULE_DEFAULT];
          if (typeof defaultInit !== 'function') {
            throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
          } else {
            defaultInit(stateHandler(MODULE_DEFAULT));
          }
        }

        if (includeGlobalModule) {
          const globalInit = init[MODULE_GLOBAL];
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

    const moduleNames = Object.keys(init);
    moduleNames.forEach(moduleName => {
      if (!store[moduleName]) {
        throw new Error(`module ${moduleName} not found, check your ccStartupOption.init object keys`);
      }
      const initFn = init[moduleName];
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
export default function ({
  store = {},
  reducer = {},
  isModuleMode = false,
  moduleSingleClass = {},
  isReducerKeyMeanNamespacedActionType = false,
  isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
  isDebug = false,
  sharedToGlobalMapping = {},
  init = null,
} = {}) {
  if (ccContext.isCcAlreadyStartup) {
    throw util.makeError(ERR.CC_ALREADY_STARTUP);
  }
  ccContext.isModuleMode = isModuleMode;
  ccContext.isStrict = isStrict;
  ccContext.isDebug = isDebug;
  util.safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
  util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);

  bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);

  if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducerToCcContext(reducer);
  else bindReducerToCcContext(reducer, isModuleMode);

  if (init) {
    const computedStore = ccContext.store._state;
    executeInitializer(isModuleMode, computedStore, init);
  }

  ccContext.isCcAlreadyStartup = true;
  if (window) {
    window.CC_CONTEXT = ccContext;
    window.ccc = ccContext;
  }
}