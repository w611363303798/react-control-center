"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var helper = _interopRequireWildcard(require("./helper"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var vbi = _util.verboseInfo;
var ss = _util.styleStr;
var cl = _util.color;

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!(0, _util.isPlainJsonObject)(store)) {
    throw new Error("the store is not a plain json object!");
  }

  if (!(0, _util.isPlainJsonObject)(sharedToGlobalMapping)) {
    throw new Error("the sharedToGlobalMapping is not a plain json object!");
  }

  _ccContext.default.sharedToGlobalMapping = sharedToGlobalMapping;
  var globalStateKeys = _ccContext.default.globalStateKeys;
  var pureGlobalStateKeys = _ccContext.default.pureGlobalStateKeys;
  var _state = _ccContext.default.store._state;
  var globalState = store[_constant.MODULE_GLOBAL];
  _state[_constant.MODULE_CC] = {};

  if (isModuleMode) {
    var moduleNames = Object.keys(store);

    if (globalState) {
      if (!_util.default.isModuleStateValid(globalState)) {
        throw _util.default.makeError(_constant.ERR.CC_STORE_STATE_INVALID, vbi("moduleName:" + _constant.MODULE_GLOBAL + "'s value is invalid!"));
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

    _state[_constant.MODULE_GLOBAL] = globalState;
    var len = moduleNames.length;
    var isDefaultModuleExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName = moduleNames[i];

      if (_moduleName !== _constant.MODULE_GLOBAL) {
        helper.checkModuleName(_moduleName);
        var moduleState = store[_moduleName];
        helper.checkModuleState(moduleState);

        if (_moduleName === _constant.MODULE_DEFAULT) {
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
      _state[_constant.MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    // non module mode
    if (sharedToGlobalMapping) {
      throw _util.default.makeError(_constant.ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    var includeDefaultModule = store.hasOwnProperty(_constant.MODULE_DEFAULT);
    var includeGlobalModule = store.hasOwnProperty(_constant.MODULE_GLOBAL);
    var invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule && !includeGlobalModule) {
        if (!_util.default.isModuleStateValid(store[_constant.MODULE_DEFAULT])) {
          throw _util.default.makeError(_constant.ERR.CC_MODULE_NAME_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
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
          throw _util.default.makeError(_constant.ERR.CC_MODULE_NAME_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
        } else {
          globalState = store[_constant.MODULE_GLOBAL];
          Object.keys(globalState).forEach(function (key) {
            globalStateKeys.push(key);
          });
          invalidKeyCount += 1;
          console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        }
      } else {
        globalState = {};
      }

      _state[_constant.MODULE_GLOBAL] = globalState;

      if (Object.keys(store).length > invalidKeyCount) {
        (0, _util.justWarning)("now cc is startup with non module mode, cc only allow you define store like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
      }
    } else {
      // treat store as $$default module store
      if (!_util.default.isModuleStateValid(store)) {
        throw _util.default.makeError(_constant.ERR.CC_MODULE_NAME_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
      }

      _state[_constant.MODULE_DEFAULT] = store;
    }
  }

  var globalMappingKey_sharedKey_ = _ccContext.default.globalMappingKey_sharedKey_;
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


function bindReducerToCcContext(reducer, isModuleMode) {
  var _reducer = _ccContext.default.reducer._reducer;

  if (isModuleMode) {
    var moduleNames = Object.keys(reducer);
    var len = moduleNames.length;
    var isDefaultReducerExist = false,
        isGlobalReducerExist = false;

    for (var i = 0; i < len; i++) {
      var _moduleName2 = moduleNames[i];
      helper.checkModuleName(_moduleName2, true);
      _reducer[_moduleName2] = reducer[_moduleName2];
      if (_moduleName2 === _constant.MODULE_DEFAULT) isDefaultReducerExist = true;
      if (_moduleName2 === _constant.MODULE_GLOBAL) isGlobalReducerExist = true;
    }

    if (!isDefaultReducerExist) _reducer[_constant.MODULE_DEFAULT] = {};
    if (!isGlobalReducerExist) _reducer[_constant.MODULE_GLOBAL] = {};
  } else {
    if (reducer.hasOwnProperty(_constant.MODULE_DEFAULT)) _reducer[_constant.MODULE_DEFAULT] = reducer[_constant.MODULE_DEFAULT];else _reducer[_constant.MODULE_DEFAULT] = reducer;
    if (reducer.hasOwnProperty(_constant.MODULE_GLOBAL)) _reducer[_constant.MODULE_GLOBAL] = reducer[_constant.MODULE_GLOBAL];else _reducer[_constant.MODULE_GLOBAL] = {};
  }
}

function bindComputedToCcContext(computed, isModuleMode) {
  if (!(0, _util.isPlainJsonObject)(computed)) {
    throw new Error("the computed value of ccStartUpOption is not a plain json object!");
  }

  function mapComputed(m, moduleComputed) {
    var moduleState = _state[m];

    if (!moduleState) {
      throw _util.default.makeError(_constant.ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION, vbi(" moduleName in computed: " + m));
    }

    if (!(0, _util.isPlainJsonObject)(moduleComputed)) {
      throw new Error("the value of one key of the computed object is not a plain json object!");
    }

    var keys = Object.keys(moduleComputed);
    keys.forEach(function (key) {
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var moduleComputedFn = _util.default.safeGetObjectFromObject(_computedFn, m);

        var fn = moduleComputed[key];
        moduleComputedFn[key] = fn;
        var computedValue = fn(originalValue, moduleState);

        var moduleComputedValue = _util.default.safeGetObjectFromObject(_computedValue, m);

        moduleComputedValue[key] = computedValue;
      } else {
        (0, _util.justWarning)("key:" + key + " of module:" + m + " of computed object is not declared in module:" + m + " of store!");
      }
    });
  }

  var _ccContext$computed = _ccContext.default.computed,
      _computedFn = _ccContext$computed._computedFn,
      _computedValue = _ccContext$computed._computedValue;
  var _state = _ccContext.default.store._state;

  if (isModuleMode) {
    var moduleNames = Object.keys(computed);
    moduleNames.forEach(function (m) {
      mapComputed(m, computed[m]);
    });
  } else {
    mapComputed(_constant.MODULE_DEFAULT, computed);
  }
}

function executeInitializer(isModuleMode, store, init) {
  var stateHandler = helper.getStateHandlerForInit;
  if (init === undefined) return;

  if (!isModuleMode) {
    if ((0, _util.isPlainJsonObject)(init)) {
      var includeDefaultModule = init.hasOwnProperty(_constant.MODULE_DEFAULT);
      var includeGlobalModule = init.hasOwnProperty(_constant.MODULE_GLOBAL);

      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          var defaultInit = init[_constant.MODULE_DEFAULT];

          if (defaultInit) {
            if (typeof defaultInit !== 'function') {
              throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
            } else {
              defaultInit(stateHandler(_constant.MODULE_DEFAULT));
            }
          }
        }

        if (includeGlobalModule) {
          var globalInit = init[_constant.MODULE_GLOBAL];

          if (globalInit) {
            if (typeof globalInit !== 'function') {
              throw new Error('init.$$global value must be a function when cc startup in nonModuleMode!');
            } else {
              globalInit(stateHandler(_constant.MODULE_GLOBAL));
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

      init(stateHandler(_constant.MODULE_DEFAULT));
    }
  } else {
    if (!(0, _util.isPlainJsonObject)(init)) {
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

/*
  {
    vip:{
      books:'vipBooks'
    }
  }
*/


function _default(_temp) {
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
      errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler;

  if (window) {
    window.CC_CONTEXT = _ccContext.default;
    window.ccc = _ccContext.default;
  }

  if (_ccContext.default.isCcAlreadyStartup) {
    throw _util.default.makeError(_constant.ERR.CC_ALREADY_STARTUP);
  }

  _ccContext.default.isModuleMode = isModuleMode;
  _ccContext.default.isStrict = isStrict;
  _ccContext.default.isDebug = isDebug;

  _util.default.safeAssignObjectValue(_ccContext.default.sharedToGlobalMapping, sharedToGlobalMapping);

  _util.default.safeAssignObjectValue(_ccContext.default.moduleSingleClass, moduleSingleClass);

  bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
  bindReducerToCcContext(reducer, isModuleMode);
  bindComputedToCcContext(computed, isModuleMode);

  if (init) {
    var computedStore = _ccContext.default.store._state;
    executeInitializer(isModuleMode, computedStore, init);
  }

  if (middlewares.length > 0) {
    var ccMiddlewares = _ccContext.default.middlewares;
    middlewares.forEach(function (m) {
      return ccMiddlewares.push(m);
    });
  }

  _ccContext.default.isCcAlreadyStartup = true;
  _ccContext.default.errorHandler = errorHandler;
}