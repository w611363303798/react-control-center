import React from 'react';
import ReactDOM from 'react-dom';
import util, { verboseInfo, styleStr, color, justWarning, isPlainJsonObject, clearObject } from '../support/util';
import { ERR, MODULE_CC, MODULE_GLOBAL, MODULE_DEFAULT, CC_DISPATCHER_BOX } from '../support/constant';
import * as helper from './helper';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';
var vbi = verboseInfo;
var ss = styleStr;
var cl = color;

function keysWarning(keyWord) {
  justWarning("now cc is startup with non module mode, cc only allow you define " + keyWord + " like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
}

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
        throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi("moduleName:" + MODULE_GLOBAL + "'s state is invalid!"));
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
      var moduleName = moduleNames[i];

      if (moduleName !== MODULE_GLOBAL) {
        helper.checkModuleName(moduleName);
        var moduleState = store[moduleName];
        helper.checkModuleState(moduleState, moduleName);

        if (moduleName === MODULE_DEFAULT) {
          isDefaultModuleExist = true;
          console.log(ss('$$default module state found while startup cc!'), cl());
        }

        _state[moduleName] = moduleState;
        var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

        if (sharedKey_globalKey_) {
          helper.handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
        }
      }
    }

    if (!isDefaultModuleExist) {
      _state[MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    // non module mode
    if (sharedToGlobalMapping && util.isObjectNotNull(sharedToGlobalMapping)) {
      throw util.makeError(ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    var includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
    var includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
    var invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule) {
        if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(" moduleName:" + MODULE_DEFAULT + "'s state is invalid!"));
        }

        _state[MODULE_DEFAULT] = store[MODULE_DEFAULT];
        invalidKeyCount += 1;
        console.log(ss('$$default module state found while startup cc with non module mode!'), cl());
      } else {
        _state[MODULE_DEFAULT] = {};
      }

      if (includeGlobalModule) {
        if (!util.isModuleStateValid(store[MODULE_GLOBAL])) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(" moduleName:" + MODULE_GLOBAL + "'s state is invalid!"));
        }

        globalState = store[MODULE_GLOBAL];
        Object.keys(globalState).forEach(function (key) {
          return globalStateKeys.push(key);
        });
        invalidKeyCount += 1;
        console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        _state[MODULE_GLOBAL] = globalState;
      } else {
        _state[MODULE_GLOBAL] = {};
      }

      if (Object.keys(store).length > invalidKeyCount) {
        keysWarning('store');
      }
    } else {
      // treat store as $$default module store
      if (!util.isModuleStateValid(store)) {
        throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi(" moduleName:" + MODULE_DEFAULT + "'s state  is invalid!"));
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
 * @param {*} reducer may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducerToCcContext(reducer) {
  var _reducer = ccContext.reducer._reducer;
  var moduleNames = Object.keys(reducer);
  var len = moduleNames.length;
  var isDefaultReducerExist = false,
      isGlobalReducerExist = false;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    helper.checkModuleName(moduleName, true);
    _reducer[moduleName] = reducer[moduleName];
    if (moduleName === MODULE_DEFAULT) isDefaultReducerExist = true;
    if (moduleName === MODULE_GLOBAL) isGlobalReducerExist = true;
  }

  if (!isDefaultReducerExist) _reducer[MODULE_DEFAULT] = {};
  if (!isGlobalReducerExist) _reducer[MODULE_GLOBAL] = {};
}

function bindComputedToCcContext(computed, isModuleMode) {
  if (!isPlainJsonObject(computed)) {
    throw new Error("the computed value of ccStartUpOption is not a plain json object!");
  }

  function mapComputed(m, moduleComputed) {
    var moduleState = _state[m];

    if (!moduleState) {
      throw util.makeError(ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION, vbi(" moduleName in computed: " + m));
    }

    if (!isPlainJsonObject(moduleComputed)) {
      throw new Error("the value of one key of the computed object is not a plain json object!");
    }

    var keys = Object.keys(moduleComputed);
    keys.forEach(function (key) {
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var moduleComputedFn = util.safeGetObjectFromObject(_computedFn, m);
        var fn = moduleComputed[key];
        moduleComputedFn[key] = fn;
        var computedValue = fn(originalValue, moduleState);
        var moduleComputedValue = util.safeGetObjectFromObject(_computedValue, m);
        moduleComputedValue[key] = computedValue;
      } else {
        justWarning("key:" + key + " of module:" + m + " of computed object is not declared in module:" + m + " of store!");
      }
    });
  }

  var _ccContext$computed = ccContext.computed,
      _computedFn = _ccContext$computed._computedFn,
      _computedValue = _ccContext$computed._computedValue;
  var _state = ccContext.store._state;

  if (isModuleMode) {
    var moduleNames = Object.keys(computed);
    moduleNames.forEach(function (m) {
      mapComputed(m, computed[m]);
    });
  } else {
    var includeDefaultKey = computed.hasOwnProperty(MODULE_DEFAULT);
    var includeGlobalKey = computed.hasOwnProperty(MODULE_GLOBAL);

    if (includeDefaultKey || includeGlobalKey) {
      var invalidKeyCount = 0;

      if (includeDefaultKey) {
        invalidKeyCount++;
        mapComputed(MODULE_DEFAULT, computed[MODULE_DEFAULT]);
      }

      if (includeGlobalKey) {
        invalidKeyCount++;
        mapComputed(MODULE_GLOBAL, computed[MODULE_GLOBAL]);
      }

      if (Object.keys(computed).length > invalidKeyCount) {
        keysWarning('computed');
      }
    } else {
      mapComputed(MODULE_DEFAULT, computed);
    }
  }
}

function executeInitializer(isModuleMode, store, init) {
  var stateHandler = helper.getStateHandlerForInit;
  if (init === undefined) return;

  if (!isModuleMode) {
    if (isPlainJsonObject(init)) {
      var includeDefaultModule = init.hasOwnProperty(MODULE_DEFAULT);
      var includeGlobalModule = init.hasOwnProperty(MODULE_GLOBAL);

      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          var defaultInit = init[MODULE_DEFAULT];

          if (defaultInit) {
            if (typeof defaultInit !== 'function') {
              throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
            } else {
              defaultInit(stateHandler(MODULE_DEFAULT));
            }
          }
        }

        if (includeGlobalModule) {
          var globalInit = init[MODULE_GLOBAL];

          if (globalInit) {
            if (typeof globalInit !== 'function') {
              throw new Error('init.$$global value must be a function when cc startup in nonModuleMode!');
            } else {
              globalInit(stateHandler(MODULE_GLOBAL));
            }
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

      if (initFn) {
        initFn(stateHandler(moduleName));
      }
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
reducer = {
  [moduleName1]:{
    [actionType1]:callback(setState, {type:'',payload:''})
    [actionType2]:callback(setState, {type:'',payload:''})
  },
  [moduleName2]:{
    [actionType1]:callback(setState, {type:'',payload:''})
  }
}
init = {
  global:(setState)=>{}
}
*/


export default function (_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$isModuleMode = _ref.isModuleMode,
      isModuleMode = _ref$isModuleMode === void 0 ? false : _ref$isModuleMode,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
      _ref$init = _ref.init,
      init = _ref$init === void 0 ? null : _ref$init,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
      sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa,
      _ref$moduleSingleClas = _ref.moduleSingleClass,
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$errorHandler = _ref.errorHandler,
      errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
      _ref$isHot = _ref.isHot,
      isHot = _ref$isHot === void 0 ? false : _ref$isHot,
      _ref$autoCreateDispat = _ref.autoCreateDispatcher,
      autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat;

  try {
    if (autoCreateDispatcher) {
      var Dispatcher = createDispatcher();
      var box = document.querySelector("#" + CC_DISPATCHER_BOX);

      if (!box) {
        box = document.createElement('div');
        box.id = CC_DISPATCHER_BOX;
        box.style.position = 'fixed';
        box.style.left = 0;
        box.style.top = 0;
        box.style.display = 'none';
        box.style.zIndex = -888666;
        document.body.append(box);
        ReactDOM.render(React.createElement(Dispatcher, null), box);
        util.justTip("[[startUp]]: cc create a CcDispatcher automatically");
      } else {
        util.justTip("[[startUp]]: CcDispatcher existed already");
      }
    }

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.ccc = ccContext;
    }

    if (ccContext.isCcAlreadyStartup) {
      var err = util.makeError(ERR.CC_ALREADY_STARTUP);

      if (util.isHotReloadMode()) {
        clearObject(ccContext.reducer._reducer);
        clearObject(ccContext.store._state);
        clearObject(ccContext.computed._computedFn);
        clearObject(ccContext.computed._computedValue);
        clearObject(ccContext.event_handlers_);
        clearObject(ccContext.ccUniqueKey_handlerKeys_);
        clearObject(ccContext.handlerKey_handler_);
        clearObject(ccContext.ccKey_ref_);
        clearObject(ccContext.fragmentCcKeys);
        util.hotReloadWarning(err);
      } else throw err;
    }

    ccContext.isModuleMode = isModuleMode;
    ccContext.isStrict = isStrict;
    ccContext.isDebug = isDebug;
    util.safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
    util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
    bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
    bindReducerToCcContext(reducer);
    bindComputedToCcContext(computed, isModuleMode);

    if (init) {
      var computedStore = ccContext.store._state;
      executeInitializer(isModuleMode, computedStore, init);
    }

    if (middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(function (m) {
        return ccMiddlewares.push(m);
      });
    }

    ccContext.isCcAlreadyStartup = true;
    ccContext.isHot = isHot;
    ccContext.errorHandler = errorHandler;
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}