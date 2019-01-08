(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@babel/runtime/helpers/esm/extends'), require('crypto'), require('@babel/runtime/helpers/esm/inheritsLoose'), require('@babel/runtime/helpers/esm/assertThisInitialized')) :
  typeof define === 'function' && define.amd ? define(['@babel/runtime/helpers/esm/extends', 'crypto', '@babel/runtime/helpers/esm/inheritsLoose', '@babel/runtime/helpers/esm/assertThisInitialized'], factory) :
  (global.ReactControlCenter = factory(global._extends,global.crypto,global._inheritsLoose,global._assertThisInitialized));
}(this, (function (_extends,crypto,_inheritsLoose,_assertThisInitialized) { 'use strict';

  _extends = _extends && _extends.hasOwnProperty('default') ? _extends['default'] : _extends;
  crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;
  _inheritsLoose = _inheritsLoose && _inheritsLoose.hasOwnProperty('default') ? _inheritsLoose['default'] : _inheritsLoose;
  _assertThisInitialized = _assertThisInitialized && _assertThisInitialized.hasOwnProperty('default') ? _assertThisInitialized['default'] : _assertThisInitialized;

  var _ERR_MESSAGE;

  var MODULE_GLOBAL = '$$global';
  var MODULE_DEFAULT = '$$default';
  var MODULE_CC = '$$cc';
  var CHANGE_BY_SELF = 100;
  var CHANGE_BY_BROADCASTED_GLOBAL_STATE = 101;
  var CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE = 102;
  var CHANGE_BY_BROADCASTED_SHARED_STATE = 103;
  var CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE = 104;
  var BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = 300;
  var BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = 301;
  var BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = 302;
  var BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = 303; //  two kind of state extraction
  //    cc will use ccInstance's sharedStateKeys and globalStateKeys to extract committed state  

  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1; //    cc will use one module's sharedStateKeys and globalStateKeys to extract committed state  

  var STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = 2;
  var ERR = {
    CC_ALREADY_STARTUP: 1000,
    CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
    CC_MODULE_NAME_DUPLICATE: 1002,
    CC_REGISTER_A_CC_CLASS: 1003,
    CC_MODULE_KEY_CC_FOUND: 1004,
    CC_MODULE_NAME_INVALID: 1005,
    CC_STORE_STATE_INVALID: 1006,
    CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE: 1007,
    CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1008,
    CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1009,
    CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1010,
    CC_CLASS_KEY_DUPLICATE: 1100,
    CC_CLASS_NOT_FOUND: 1101,
    CC_CLASS_STORE_MODULE_INVALID: 1102,
    CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED: 1103,
    CC_CLASS_REDUCER_MODULE_INVALID: 1104,
    CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE: 1105,
    CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE: 1106,
    CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
    CC_CLASS_INSTANCE_OPTION_INVALID: 1201,
    CC_CLASS_INSTANCE_NOT_FOUND: 1202,
    CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1203,
    CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1204,
    CC_CLASS_INSTANCE_MORE_THAN_ONE: 1205,
    CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS: 1206,
    CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS: 1207,
    CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY: 1300,
    CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT: 1301,
    CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS: 1400,
    CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE: 1401,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY: 1402,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT: 1403,
    CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY: 1404,
    CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE: 1405,
    CC_REDUCER_ACTION_TYPE_NAMING_INVALID: 1500,
    CC_REDUCER_ACTION_TYPE_DUPLICATE: 1501,
    CC_REDUCER_ACTION_TYPE_NO_MODULE: 1502,
    CC_REDUCER_NOT_A_FUNCTION: 1503,
    CC_REDUCER_MODULE_NAME_DUPLICATE: 1511 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module. ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='all' and globalStateKeys='all'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE] = 'some keys of configured global state have been included in store.globalState', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY] = 'found key is sharedToGlobalMapping key in globalStateKeys, you should delete it ', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE] = 'found key in globalStateKeys is not included in global state, check your globalStateKeys', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);

  function isHotReloadMode() {
    return window && window.webpackHotUpdate;
  }
  function bindThis(_this, methods) {
    methods.forEach(function (method) {
      return _this[method] = _this[method].bind(_this);
    });
  }
  function isValueNotNull(value) {
    return !(value === null || value === undefined);
  }
  function isObjectNotNull(object) {
    if (object === null || object === undefined) {
      return false;
    } else if (Object.keys(object).length > 0) {
      return true;
    } else {
      return false;
    }
  }
  function isPlainJsonObject(obj, canBeArray) {
    if (canBeArray === void 0) {
      canBeArray = false;
    }

    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        if (canBeArray) return true;else return false;
      }

      return true;
    } else {
      return false;
    }
  }
  function isActionTypeValid(type) {
    if (typeof type !== 'string') {
      return false;
    } else {
      if (type.length === 0) return false;else return true;
    }
  }
  function makeError(code, extraMessage) {
    var message = ERR_MESSAGE[code] || '';
    if (extraMessage) message += extraMessage;
    if (!message) message = "undefined message for code:" + code;
    var error = new Error(message);
    error.code = code;
    return error;
  }
  function makeCcClassContext(module, sharedStateKeys, globalStateKeys) {
    return {
      module: module,
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys,
      ccKeys: []
    };
  }
  function makeStateMail(ccUniqueKey, ccOption, module, type, cb) {
    var mail = {};
    Object.defineProperty(mail, 'ccUniqueKey', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: ccUniqueKey
    });
    Object.defineProperty(mail, 'ccOption', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: ccOption
    });
    Object.defineProperty(mail, 'module', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: module
    });
    Object.defineProperty(mail, 'type', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: type
    });
    Object.defineProperty(mail, 'state', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(mail, 'cb', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {}
    });
    return mail;
  } // !!! different ccClass enable own a same key

  function makeUniqueCcKey(ccClassKey, ccKey) {
    // return `${ccClassKey}/${ccKey}`;
    return ccClassKey + "$" + ccKey;
  }
  function isModuleNameValid(moduleName) {
    return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
  }
  function isModuleNameCcLike(moduleName) {
    var name = moduleName.toLowerCase();
    return name === MODULE_CC;
  }
  function isModuleStateValid(state) {
    return isPlainJsonObject(state);
  }

  function isCcOptionValid(ccOption) {
    return isPlainJsonObject(ccOption);
  }
  function isCcActionValid(action) {
    var errMessage = '';

    if (!action) {
      errMessage = 'trying to dispatch an null action is meaningless!';
    } else {
      // const { type, payload } = action;
      var type = action.type;

      if (!isActionTypeValid(type)) {
        errMessage += 'action type must be string and length must LTE 1! ';
      } // if (!isPlainJsonObject(payload, true)) {
      //   errMessage += 'payload must be a plain json object! ';
      // }

    }

    return errMessage;
  }
  function disassembleActionType(namespacedActionType) {
    if (namespacedActionType.includes('/')) {
      var _namespacedActionType = namespacedActionType.split('/'),
          moduleName = _namespacedActionType[0],
          _actionType = _namespacedActionType[1];

      return {
        moduleName: moduleName,
        actionType: _actionType
      };
    } else {
      return {
        moduleName: MODULE_GLOBAL,
        actionType: actionType
      };
    }
  }
  function verboseInfo(info) {
    return " --verbose-info: " + info;
  }
  function ccClassDisplayName(className) {
    return "CC(" + className + ")";
  }
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  function verifyKeys(keys1, keys2) {
    var duplicate = false,
        notArray = false,
        keyElementNotString = false;
    if (!Array.isArray(keys1)) return {
      duplicate: duplicate,
      notArray: true,
      keyElementNotString: keyElementNotString
    };
    if (!Array.isArray(keys2)) return {
      duplicate: duplicate,
      notArray: true,
      keyElementNotString: keyElementNotString
    };
    var len1 = keys1.length;
    var len2 = keys2.length;

    outLoop: for (var i = 0; i < len1; i++) {
      var tmpKey = keys1[i];

      if (typeof tmpKey !== 'string') {
        keyElementNotString = true;
        break outLoop;
      }

      for (var j = 0; j < len2; j++) {
        var tmpKey2 = keys2[j];

        if (typeof tmpKey2 !== 'string') {
          keyElementNotString = true;
          break outLoop;
        }

        if (tmpKey2 === tmpKey) {
          duplicate = true;
          break outLoop;
        }
      }
    }

    return {
      duplicate: duplicate,
      notArray: notArray,
      keyElementNotString: keyElementNotString
    };
  }
  function color(color) {
    if (color === void 0) {
      color = 'green';
    }

    return "color:" + color + ";border:1px solid " + color;
  }
  function styleStr(str) {
    return "%c" + str;
  }
  function justWarning(err) {
    console.error(' ------------ CC WARNING ------------');
    if (err instanceof Error) console.error(err.message);else console.error(err);
  }
  function justTip(msg) {
    console.error(' ------------ CC TIP ------------');
    console.error("%c" + msg, 'color:green;border:1px solid green;');
  }
  function safeGetObjectFromObject(object, key) {
    var childrenObject = object[key];

    if (!childrenObject) {
      childrenObject = object[key] = {};
    }

    return childrenObject;
  }
  function safeGetArrayFromObject(object, key) {
    var childrenArray = object[key];

    if (!childrenArray) {
      childrenArray = object[key] = [];
    }

    return childrenArray;
  }
  function safeAssignObjectValue(assignTo, assignFrom) {
    Object.keys(assignFrom).forEach(function (key) {
      assignTo[key] = assignFrom[key];
    });
  }
  var util = {
    makeError: makeError,
    isHotReloadMode: isHotReloadMode,
    makeCcClassContext: makeCcClassContext,
    makeStateMail: makeStateMail,
    makeUniqueCcKey: makeUniqueCcKey,
    isActionTypeValid: isActionTypeValid,
    isModuleNameValid: isModuleNameValid,
    isModuleNameCcLike: isModuleNameCcLike,
    isModuleStateValid: isModuleStateValid,
    isCcOptionValid: isCcOptionValid,
    isCcActionValid: isCcActionValid,
    isPlainJsonObject: isPlainJsonObject,
    isObjectNotNull: isObjectNotNull,
    isValueNotNull: isValueNotNull,
    disassembleActionType: disassembleActionType,
    verboseInfo: verboseInfo,
    bindThis: bindThis,
    ccClassDisplayName: ccClassDisplayName,
    clone: clone,
    verifyKeys: verifyKeys,
    color: color,
    styleStr: styleStr,
    justWarning: justWarning,
    justTip: justTip,
    safeGetObjectFromObject: safeGetObjectFromObject,
    safeGetArrayFromObject: safeGetArrayFromObject,
    safeAssignObjectValue: safeAssignObjectValue
  };

  var _state2, _reducer;
  var refs = {};
  var ccContext = {
    isDebug: false,
    // if isStrict is true, every error will be throw out instead of console.error, 
    // but this may crash your app, make sure you have a nice error handling way,
    // like componentDidCatch in react 16.*
    isStrict: false,
    returnRootState: false,
    isModuleMode: false,
    isCcAlreadyStartup: false,
    //  cc allow multi react class register to a module by default, but if want to control some module 
    //  to only allow register one react class, flag the module name as true in this option object
    //  example:  {fooModule: true, barModule:true}
    moduleSingleClass: {},
    moduleName_ccClassKeys_: {},
    // map from moduleName to sharedStateKeys
    moduleName_sharedStateKeys_: {},
    // map from moduleName to globalStateKeys
    moduleName_globalStateKeys_: {},
    //to let cc know which ccClass are watching globalStateKeys
    globalCcClassKeys: [],

    /**
      ccClassContext:{
        module,
        sharedStateKeys,
        globalStateKeys,
        ccKeys: [],
      }
    */
    ccClassKey_ccClassContext_: {},
    // [globalKey]:${modules}, let cc know what modules are watching a same globalKey
    globalKey_toModules_: {},
    // [globalKey]:${sharedKey}
    globalMappingKey_sharedKey_: {},
    // [globalKey]:${modules}, let cc know what modules are watching a same globalMappingKey
    globalMappingKey_toModules_: {},
    // let cc know a globalMappingKey is mapped from which module
    globalMappingKey_fromModule_: {},
    // globalStateKeys is maintained by cc automatically,
    // when user call cc.setGlobalState, or ccInstance.setGlobalState,
    // commit state will be checked strictly by cc with globalStateKeys,
    // all the keys of commit state must been included in globalStateKeys
    globalStateKeys: [],
    //  all global keys that exclude sharedToGlobalMapping keys
    pureGlobalStateKeys: [],
    sharedToGlobalMapping: {},
    //  translate sharedToGlobalMapping object to another shape: {sharedKey: {globalMappingKey, fromModule}, ... }
    sharedKey_globalMappingKeyDescriptor_: {},
    store: {
      _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
      getState: function getState(module) {
        if (module) return ccContext.store._state[module];else return ccContext.store._state;
      },
      setState: function setState(module, _partialSharedState) {
        var _state = ccContext.store._state;
        var fullSharedState = _state[module];

        var mergedState = _extends({}, fullSharedState, _partialSharedState);

        _state[module] = mergedState;
      },
      setGlobalState: function setGlobalState(partialGlobalState) {
        var _state = ccContext.store._state;
        var fullGlobalState = _state[MODULE_GLOBAL];

        var mergedState = _extends({}, fullGlobalState, partialGlobalState);

        _state[MODULE_GLOBAL] = mergedState;
      },
      getGlobalState: function getGlobalState() {
        return ccContext.store._state[MODULE_GLOBAL];
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer)
    },
    refStore: {
      _state: {},
      setState: function setState(ccUniqueKey, partialStoredState) {
        var _state = ccContext.refStore._state;
        var fullStoredState = _state[ccUniqueKey];

        var mergedState = _extends({}, fullStoredState, partialStoredState);

        _state[ccUniqueKey] = mergedState;
      }
    },
    ccKey_ref_: refs,
    ccKey_option_: {},
    refs: refs,
    info: {
      startupTime: Date.now()
    }
  };

  /****
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module) {
    var ccKey_ref_ = ccContext.ccKey_ref_,
        moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
        ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
    var ccKeys;

    if (module) {
      var ccClassKeys = moduleName_ccClassKeys_[module];

      if (!ccClassKeys || ccClassKeys.length === 0) {
        throw new Error("no ccClass found for module " + module + "!");
      }

      var oneCcClassKey = ccClassKeys[0];
      var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

      if (!ccClassContext) {
        throw new Error("no ccClassContext found for ccClassKey " + oneCcClassKey + "!");
      }

      ccKeys = ccClassContext.ccKeys;
    } else {
      ccKeys = Object.keys(ccKey_ref_);
    }

    if (ccKeys.length === 0) {
      throw new Error('no ccInstance found for any ccClass!');
    }

    var oneRef = ccKey_ref_[ccKeys[0]];

    if (!oneRef) {
      throw new Error('cc found no ref!');
    }

    return oneRef;
  }

  function checkModuleName (moduleName, checkForReducer) {
    if (checkForReducer === void 0) {
      checkForReducer = false;
    }

    var _state = ccContext.store._state;
    var _reducer = ccContext.reducer._reducer;

    if (!isModuleNameValid(moduleName)) {
      throw makeError(ERR.CC_MODULE_NAME_INVALID, verboseInfo(" moduleName:" + moduleName + " is invalid!"));
    }

    if (isModuleNameCcLike(moduleName)) {
      throw makeError(ERR.CC_MODULE_KEY_CC_FOUND);
    }

    if (checkForReducer) {
      if (moduleName != MODULE_GLOBAL) {
        if (_reducer[moduleName]) {
          throw makeError(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, verboseInfo("moduleName:" + moduleName));
        }
      }
    } else {
      if (_state[moduleName]) {
        throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo("moduleName:" + moduleName));
      }
    }
  }

  function checkModuleState (moduleState) {
    if (!util.isModuleStateValid(moduleState)) {
      throw util.makeError(ERR.CC_STORE_STATE_INVALID, util.verboseInfo("moduleName:" + moduleName + "'s state is invalid!"));
    }
  }

  function mapSharedKeyToGlobal (moduleName, sharedKey, globalMappingKey) {
    var _state = ccContext.store._state;
    var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
    var globalMappingKey_fromModule_ = ccContext.globalMappingKey_fromModule_;
    var sharedKey_globalMappingKeyDescriptor_ = ccContext.sharedKey_globalMappingKeyDescriptor_;
    var globalStateKeys = ccContext.globalStateKeys;
    var globalState = _state[MODULE_GLOBAL];
    var moduleState = _state[moduleName];

    if (!moduleState.hasOwnProperty(sharedKey)) {
      throw new Error("the module:" + moduleName + " doesn't have a key named " + sharedKey + ", check your sharedToGlobalMapping or your module state");
    }

    if (globalState.hasOwnProperty(globalMappingKey)) {
      throw new Error("the key:" + globalMappingKey + " has been declared already in globalState, you can't use it to map the sharedStateKey:" + sharedKey + " to global state, try rename your mappingKey in sharedToGlobalMapping!");
    }

    globalStateKeys.push(globalMappingKey);
    globalState[globalMappingKey] = moduleState[sharedKey];
    globalMappingKey_sharedKey_[globalMappingKey] = sharedKey;
    globalMappingKey_fromModule_[globalMappingKey] = moduleName;
    sharedKey_globalMappingKeyDescriptor_[sharedKey] = {
      globalMappingKey: globalMappingKey,
      fromModule: moduleName
    };
  }

  function handleModuleSharedToGlobalMapping (moduleName, moduleSharedKeyToGlobalKeyConfig) {
    var sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
    var sLen = sharedKeys.length;

    for (var k = 0; k < sLen; k++) {
      var sharedKey = sharedKeys[k];
      var globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];
      mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
    }
  }

  function setState (module, state, throwError) {
    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef(module);
      ref.setState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  /****
   * if you are sure this state is really belong to global state, call cc.setGlobalState,
   * cc will only pass this state to global module
   */

  function setGlobalState (state, throwError) {
    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.setGlobalState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function getStateHandlerForInit (module) {
    return function (state) {
      try {
        setState(module, state, true);
      } catch (err) {
        ccContext.store.setState(module, state); //store this state;

        util.justTip("no ccInstance found for module " + module + " currently, cc will just store it, lately ccInstance will pick this state to render");
      }
    };
  }

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
    _state[MODULE_CC] = {};

    if (isModuleMode) {
      var moduleNames = Object.keys(store);
      var globalState = store[MODULE_GLOBAL];

      if (globalState) {
        if (!util.isModuleStateValid(globalState)) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi("moduleName:" + MODULE_GLOBAL + "'s value is invalid!"));
        } else {
          console.log(ss('$$global module state found while startup cc!'), cl());
          Object.keys(globalState).forEach(function (key) {
            globalStateKeys.push(key);
            pureGlobalStateKeys.push(key);
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
          checkModuleName(_moduleName);
          var moduleState = store[_moduleName];
          checkModuleState(moduleState);

          if (_moduleName === MODULE_DEFAULT) {
            isDefaultModuleExist = true;
            console.log(ss('$$default module state found while startup cc!'), cl());
          }

          _state[_moduleName] = moduleState;
          var sharedKey_globalKey_ = sharedToGlobalMapping[_moduleName];

          if (sharedKey_globalKey_) {
            handleModuleSharedToGlobalMapping(_moduleName, sharedKey_globalKey_);
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
            _state[MODULE_GLOBAL] = store[MODULE_GLOBAL];
            Object.keys(store[MODULE_GLOBAL]).forEach(function (key) {
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
        checkModuleName(_moduleName2, true);
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
    var stateHandler = getStateHandlerForInit;

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


  function startup (_temp) {
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

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.ccc = ccContext;
    }
  }

  // Unique ID creation requires a high quality random # generator.  In node.js
  // this is pretty straight-forward - we use the crypto API.



  var rng = function nodeRNG() {
    return crypto.randomBytes(16);
  };

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
    return ([bth[buf[i++]], bth[buf[i++]], 
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]],
  	bth[buf[i++]], bth[buf[i++]],
  	bth[buf[i++]], bth[buf[i++]]]).join('');
  }

  var bytesToUuid_1 = bytesToUuid;

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  var _nodeId;
  var _clockseq;

  // Previous uuid creation time
  var _lastMSecs = 0;
  var _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};
    var node = options.node || _nodeId;
    var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

    // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
      var seedBytes = rng();
      if (node == null) {
        // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
        node = _nodeId = [
          seedBytes[0] | 0x01,
          seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
        ];
      }
      if (clockseq == null) {
        // Per 4.2.2, randomize (14 bit) clockseq
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
      }
    }

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    for (var n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }

    return buf ? buf : bytesToUuid_1(b);
  }

  var v1_1 = v1;

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid_1(rnds);
  }

  var v4_1 = v4;

  var uuid = v4_1;
  uuid.v1 = v1_1;
  uuid.v4 = v4_1;

  var uuid_1 = uuid;

  /**
   * slice() reference.
   */

  var slice = Array.prototype.slice;

  /**
   * Expose `co`.
   */

  var co_1 = co['default'] = co.co = co;

  /**
   * Wrap the given generator `fn` into a
   * function that returns a promise.
   * This is a separate function so that
   * every `co()` call doesn't create a new,
   * unnecessary closure.
   *
   * @param {GeneratorFunction} fn
   * @return {Function}
   * @api public
   */

  co.wrap = function (fn) {
    createPromise.__generatorFunction__ = fn;
    return createPromise;
    function createPromise() {
      return co.call(this, fn.apply(this, arguments));
    }
  };

  /**
   * Execute the generator function or a generator
   * and return a promise.
   *
   * @param {Function} fn
   * @return {Promise}
   * @api public
   */

  function co(gen) {
    var ctx = this;
    var args = slice.call(arguments, 1);

    // we wrap everything in a promise to avoid promise chaining,
    // which leads to memory leak errors.
    // see https://github.com/tj/co/issues/180
    return new Promise(function(resolve, reject) {
      if (typeof gen === 'function') gen = gen.apply(ctx, args);
      if (!gen || typeof gen.next !== 'function') return resolve(gen);

      onFulfilled();

      /**
       * @param {Mixed} res
       * @return {Promise}
       * @api private
       */

      function onFulfilled(res) {
        var ret;
        try {
          ret = gen.next(res);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }

      /**
       * @param {Error} err
       * @return {Promise}
       * @api private
       */

      function onRejected(err) {
        var ret;
        try {
          ret = gen.throw(err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }

      /**
       * Get the next value in the generator,
       * return a promise.
       *
       * @param {Object} ret
       * @return {Promise}
       * @api private
       */

      function next(ret) {
        if (ret.done) return resolve(ret.value);
        var value = toPromise.call(ctx, ret.value);
        if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
        return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "' + String(ret.value) + '"'));
      }
    });
  }

  /**
   * Convert a `yield`ed value into a promise.
   *
   * @param {Mixed} obj
   * @return {Promise}
   * @api private
   */

  function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ('function' == typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
  }

  /**
   * Convert a thunk to a promise.
   *
   * @param {Function}
   * @return {Promise}
   * @api private
   */

  function thunkToPromise(fn) {
    var ctx = this;
    return new Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      });
    });
  }

  /**
   * Convert an array of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Array} obj
   * @return {Promise}
   * @api private
   */

  function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this));
  }

  /**
   * Convert an object of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Object} obj
   * @return {Promise}
   * @api private
   */

  function objectToPromise(obj){
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) defer(promise, key);
      else results[key] = obj[key];
    }
    return Promise.all(promises).then(function () {
      return results;
    });

    function defer(promise, key) {
      // predefine the key in the result
      results[key] = undefined;
      promises.push(promise.then(function (res) {
        results[key] = res;
      }));
    }
  }

  /**
   * Check if `obj` is a promise.
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */

  function isPromise(obj) {
    return 'function' == typeof obj.then;
  }

  /**
   * Check if `obj` is a generator.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */

  function isGenerator(obj) {
    return 'function' == typeof obj.next && 'function' == typeof obj.throw;
  }

  /**
   * Check if `obj` is a generator function.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */
  function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
  }

  /**
   * Check for plain object.
   *
   * @param {Mixed} val
   * @return {Boolean}
   * @api private
   */

  function isObject(val) {
    return Object == val.constructor;
  }

  var verifyKeys$1 = util.verifyKeys,
      ccClassDisplayName$1 = util.ccClassDisplayName,
      styleStr$1 = util.styleStr,
      color$1 = util.color,
      verboseInfo$1 = util.verboseInfo,
      makeError$1 = util.makeError,
      justWarning$1 = util.justWarning;
  var _ccContext$store = ccContext.store,
      _state = _ccContext$store._state,
      getState = _ccContext$store.getState,
      _reducer$1 = ccContext.reducer._reducer,
      refStore = ccContext.refStore,
      globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_,
      moduleName_sharedStateKeys_ = ccContext.moduleName_sharedStateKeys_,
      moduleName_globalStateKeys_ = ccContext.moduleName_globalStateKeys_,
      ccKey_ref_ = ccContext.ccKey_ref_,
      ccKey_option_ = ccContext.ccKey_option_,
      globalCcClassKeys = ccContext.globalCcClassKeys,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      ccGlobalStateKeys = ccContext.globalStateKeys,
      globalMappingKey_toModules_ = ccContext.globalMappingKey_toModules_,
      globalMappingKey_fromModule_ = ccContext.globalMappingKey_fromModule_,
      globalKey_toModules_ = ccContext.globalKey_toModules_,
      sharedKey_globalMappingKeyDescriptor_ = ccContext.sharedKey_globalMappingKeyDescriptor_;
  var cl$1 = color$1;
  var ss$1 = styleStr$1;
  var me = makeError$1;
  var vbi$1 = verboseInfo$1;
  var ccKey_insCount = {};

  function incCcKeyInsCount(ccUniqueKey) {
    if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 1;else ccKey_insCount[ccUniqueKey] += 1;
  }

  function decCcKeyInsCount(ccUniqueKey) {
    if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 0;else ccKey_insCount[ccUniqueKey] -= 1;
  }

  function getCcKeyInsCount(ccUniqueKey) {
    if (ccKey_insCount[ccUniqueKey] === undefined) return 0;else return ccKey_insCount[ccUniqueKey];
  }

  function paramCallBackShouldNotSupply(module, currentModule) {
    return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
  }

  function isStateValid(state) {
    if (!state || !util.isPlainJsonObject(state)) {
      return false;
    } else {
      return true;
    }
  }

  function extractStateByKeys(state, targetKeys) {
    if (!isStateValid(state) || !util.isObjectNotNull(state)) {
      return {
        partialState: {},
        isStateEmpty: true
      };
    }

    var partialState = {};
    var isStateEmpty = true;
    targetKeys.forEach(function (key) {
      var value = state[key];

      if (value !== undefined) {
        partialState[key] = value;
        isStateEmpty = false;
      }
    });
    return {
      partialState: partialState,
      isStateEmpty: isStateEmpty
    };
  }

  function handleError(err, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (throwError) throw err;else {
      justWarning$1(err);
    }
  }

  function checkStoreModule(module, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (!ccContext.isModuleMode) {
      if (module !== MODULE_DEFAULT) {
        handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi$1("module:" + module)), throwError);
        return false;
      } else return true;
    } else {
      if (module === MODULE_GLOBAL) {
        handleError(me(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
        return false;
      }

      if (!_state[module]) {
        handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, vbi$1("module:" + module + " is not configured in cc's store")), throwError);
        return false;
      } else return true;
    }
  }

  function checkReducerModule(reducerModule, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (!ccContext.isModuleMode) {
      if (reducerModule != MODULE_DEFAULT) {
        handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "reducerModule:" + reducerModule), throwError);
      }
    }
  }

  function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
    if (ccContext.isDebug) {
      console.log(ss$1(ccUniqueKey + " unset ref"), cl$1('red'));
    } // ccContext.ccKey_ref_[ccUniqueKey] = null;


    delete ccContext.ccKey_ref_[ccUniqueKey];
    delete ccContext.ccKey_option_[ccUniqueKey];
    var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
    if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
    decCcKeyInsCount(ccUniqueKey);
  }

  function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
    function setRef() {
      ccContext.ccKey_ref_[ccUniqueKey] = ref;
      ccKeys.push(ccUniqueKey);
      ccContext.ccKey_option_[ccUniqueKey] = option;
    }

    incCcKeyInsCount(ccUniqueKey);

    if (delayMs) {
      setTimeout(setRef, delayMs);
    } else {
      setRef();
    }
  } // any error in this function will not been throwed, cc just warning, 


  function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
    var targetCb = reactCallback;

    if (checkStoreModule(inputModule, false)) {
      if (inputModule != currentModule) {
        if (reactCallback) {
          justWarning$1(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$1(paramCallBackShouldNotSupply(inputModule, currentModule))));
          targetCb = null; //let user's reactCallback has no change to be triggered
        }
      }

      cb(targetCb);
    }
  }

  function computeCcUniqueKey(isClassSingle, ccClassKey, ccKey) {
    var ccUniqueKey;
    var isCcUniqueKeyAutoGenerated = false;

    if (isClassSingle) {
      if (ccKey) justWarning$1("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:" + ccKey);
      ccUniqueKey = ccClassKey;
    } else {
      if (ccKey) {
        ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      } else {
        var uuidStr = uuid_1().replace(/-/g, '_');
        ccUniqueKey = util.makeUniqueCcKey(ccClassKey, uuidStr);
        isCcUniqueKeyAutoGenerated = true;
      }
    }

    return {
      ccUniqueKey: ccUniqueKey,
      isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated
    };
  }

  var stateKeyDuplicateInNonModuleWarning = "\nnow cc is running in non module mode, and cc found you are initializing a ccClass with inputSharedStateKeys='all' in register option, \nin this situation, the ccInstance's state will automatically take all the default state merge into it's own state, but some keys of ccInstance state\nduplicate with default module state keys, so cc will ignore the ccInstance state value of these duplicate state keys, and take their state value from\ndefault module! if this is not as you expected, please check your ccInstance state declaration statement!";

  function getSharedKeysAndGlobalKeys(module, refState, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
    var sharedStateKeys = inputSharedStateKeys,
        globalStateKeys = inputGlobalStateKeys;

    if (ccContext.isModuleMode) {
      if (inputSharedStateKeys === 'all' || inputSharedStateKeys === undefined) {
        sharedStateKeys = Object.keys(getState(module));
      }
    } else {
      //  for non module mode, any ccClass must set inputSharedStateKeys as 'all' in register option if it want to watch default module's state changing
      //  because if cc automatically let a ccClass watching default module's whole state keys, it is very easy and implicit to dirty the ccClass's instance state
      if (inputSharedStateKeys === 'all') {
        var defaultModuleState = getState(module);
        var refStateKeys = Object.keys(refState);
        var duplicateKeys = [];
        refStateKeys.forEach(function (key) {
          //  set state value to default module state dynamically while a ccInstance created
          var stateValueOfDefault = defaultModuleState[key];

          if (stateValueOfDefault === undefined) {
            //  set ref state value to default module state implicitly
            //  if cc want to support playback or time travel feature with immutable.js in the future, call setStateValue method ^_^
            defaultModuleState[key] = refState[key];
          } else {
            refState[key] = stateValueOfDefault;
            duplicateKeys.push(key);
          }
        });

        if (duplicateKeys.lengthL > 0) {
          justWarning$1(stateKeyDuplicateInNonModuleWarning + ' ' + verboseInfo$1("module " + module + ", ccClassKey" + ccClassKey + ", ccInstance state of these keys will been ignored: " + duplicateKeys.toString()));
        }

        sharedStateKeys = Object.keys(defaultModuleState);
      } else if (inputSharedStateKeys === undefined) {
        sharedStateKeys = [];
      }
    }

    if (inputGlobalStateKeys === 'all') {
      globalStateKeys = Object.keys(getState(MODULE_GLOBAL));
    }

    var _verifyKeys = verifyKeys$1(sharedStateKeys, globalStateKeys),
        duplicate = _verifyKeys.duplicate,
        notArray = _verifyKeys.notArray,
        keyElementNotString = _verifyKeys.keyElementNotString;

    if (notArray) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi$1("ccClassKey:" + ccClassKey));
    }

    if (keyElementNotString) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi$1("ccClassKey:" + ccClassKey));
    }

    if (duplicate) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi$1("ccClassKey:" + ccClassKey + " globalStateKeys:" + globalStateKeys + " sharedStateKeys:" + sharedStateKeys));
    }

    var globalState = getState(MODULE_GLOBAL);
    var hasGlobalMappingKeyInSharedStateKeys = false;
    var matchedGlobalKey, matchedSharedKey;
    var len = globalStateKeys.length;

    for (var i = 0; i < len; i++) {
      var gKey = globalStateKeys[i];

      if (globalState[gKey] === undefined) {
        throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi$1("ccClassKey:" + ccClassKey + ", invalid key in globalStateKeys is [" + gKey + "]"));
      }

      var sharedKey = globalMappingKey_sharedKey_[gKey];
      var fromModule = globalMappingKey_fromModule_[gKey]; //  if cc found one of the globalStateKeys of this module is just mapped from shared to global
      //  it is strictly prohibited here

      if (fromModule == module && sharedStateKeys.includes(sharedKey)) {
        hasGlobalMappingKeyInSharedStateKeys = true;
        matchedGlobalKey = gKey;
        matchedSharedKey = sharedKey;
        break;
      }
    } // maybe in the future, this is ok？ if user change sharedToGlobalMapping frequently, user don't have to change ccClass's globalStateKeys at the same time
    // but currently, this situation is strictly prohibited...... prevent from syncGlobalState and syncSharedState signal working badly


    if (hasGlobalMappingKeyInSharedStateKeys) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi$1("ccClassKey [" + ccClassKey + "], invalid global key [" + matchedGlobalKey + "], matched state key [" + matchedSharedKey + "]"));
    }

    return {
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys
    };
  }

  function checkCcStartupOrNot() {
    if (!window.cc) throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }

  function extractStateToBeBroadcasted(module, sourceState, sharedStateKeys, globalStateKeys) {
    var ccSetState = ccContext.store.setState;
    var globalState = getState(MODULE_GLOBAL);

    var _extractStateByKeys = extractStateByKeys(sourceState, sharedStateKeys),
        partialSharedState = _extractStateByKeys.partialState,
        isPartialSharedStateEmpty = _extractStateByKeys.isStateEmpty;

    if (!isPartialSharedStateEmpty) {
      ccSetState(module, partialSharedState);
    }

    var _extractStateByKeys2 = extractStateByKeys(sourceState, globalStateKeys),
        partialGlobalState = _extractStateByKeys2.partialState,
        isPartialGlobalStateEmpty = _extractStateByKeys2.isStateEmpty;

    if (!isPartialGlobalStateEmpty) {
      ccSetState(MODULE_GLOBAL, partialGlobalState);
    } //  any stateValue's key if it is a global key (a normal global key , or a global key mapped from a state key)
    //  the stateValue will been collected to module_globalState_, 
    //  any stateValue's key if it is a shared key that mapped to global key,
    //  the stateValue will been collected to module_globalState_ also,
    //  key means module name, value means the state to been broadcasted to the module


    var module_globalState_ = {}; //  see if sourceState includes globalMappingKeys, extract the target state that will been broadcasted to other module by globalMappingKey_sharedKey_

    globalStateKeys.forEach(function (gKey) {
      var stateValue = sourceState[gKey];

      if (stateValue !== undefined) {
        var sharedKey = globalMappingKey_sharedKey_[gKey];
        var toModules, stateKey;

        if (sharedKey) {
          //  this global key is created from some other module's sharedToGlobalMapping setting
          toModules = globalMappingKey_toModules_[gKey];
          stateKey = sharedKey;
        } else {
          //  this is normal global key
          toModules = globalKey_toModules_[gKey];
          stateKey = gKey;
        }

        toModules.forEach(function (m) {
          var modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
          modulePartialGlobalState[stateKey] = stateValue;
        });
      }
    }); //  see if sourceState includes sharedStateKey which are mapped to globalStateKey

    sharedStateKeys.forEach(function (sKey) {
      var stateValue = sourceState[sKey];

      if (stateValue !== undefined) {
        var descriptor = sharedKey_globalMappingKeyDescriptor_[sKey];

        if (descriptor) {
          var globalMappingKey = descriptor.globalMappingKey;
          var toModules = globalMappingKey_toModules_[globalMappingKey];
          toModules.forEach(function (m) {
            var modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
            modulePartialGlobalState[globalMappingKey] = stateValue; //  !!!set this state to globalState, let other module that watching this globalMappingKey
            //  can recover it correctly while they are mounted again!

            globalState[globalMappingKey] = stateValue;
          });
        }
      }
    });
    Object.keys(module_globalState_).forEach(function (moduleName) {
      ccSetState(moduleName, module_globalState_[moduleName]);
    }); // partialSharedState is prepared for input module 
    // partialGlobalState is prepared for input module 
    // module_globalState_ is prepared for other module 

    return {
      isPartialSharedStateEmpty: isPartialSharedStateEmpty,
      partialSharedState: partialSharedState,
      isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
      partialGlobalState: partialGlobalState,
      module_globalState_: module_globalState_
    };
  } //to let cc know a specified module are watching what sharedStateKeys


  function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
    var sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
    if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
    partialSharedStateKeys.forEach(function (sKey) {
      if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
    });
  }

  function mapGlobalKeyAndToModules(_curStateModule, globalStateKeys) {
    globalStateKeys.forEach(function (gKey) {
      var toModules = util.safeGetArrayFromObject(globalKey_toModules_, gKey); // because cc allow multi class register to a same module, so here judge if toModules includes module or not

      if (!toModules.includes(_curStateModule)) {
        toModules.push(_curStateModule);
      }
    });
  }

  function mapGlobalMappingKeyAndToModules(_curStateModule, globalStateKeys) {
    globalStateKeys.forEach(function (gKey) {
      var toModules = util.safeGetArrayFromObject(globalMappingKey_toModules_, gKey);

      if (globalMappingKey_sharedKey_[gKey]) {
        //  if this gKey is globalMappingKey
        if (!toModules.includes(_curStateModule)) toModules.push(_curStateModule);
      }
    });
  } //to let cc know a specified module are watching what globalStateKeys


  function mapModuleAndGlobalStateKeys(moduleName, partialGlobalStateKeys) {
    var globalStateKeysOfModule = util.safeGetArrayFromObject(moduleName_globalStateKeys_, moduleName);
    partialGlobalStateKeys.forEach(function (gKey) {
      if (!globalStateKeysOfModule.includes(gKey)) globalStateKeysOfModule.push(gKey);
    });
  } //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


  function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, sharedStateKeys, globalStateKeys) {
    var contextMap = ccContext.ccClassKey_ccClassContext_;

    if (contextMap[ccClassKey] !== undefined) {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    } else {
      contextMap[ccClassKey] = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys);
    }
  }

  function mapModuleAndCcClassKeys(moduleName, ccClassKey) {
    var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

    if (ccClassKeys.includes(ccClassKey)) {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    }

    var moduleSingleClass = ccContext.moduleSingleClass;

    if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
      throw me(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi$1("module " + moduleName + ", ccClassKey " + ccClassKey));
    }

    ccClassKeys.push(ccClassKey);
  }
  /****
   * it is very important for cc to know how to extract committed state for the following broadcast operation with stateFor value
   * 
   * if stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cc will treat this state as a ccInstance's state, 
   * then cc will use the ccClass's globalStateKeys and sharedStateKeys to extract the state.
   * usually ccInstance's $$commit, $$call, $$callThunk, $$invoke, $$dispatch method will trigger this extraction strategy
   * ------------------------------------------------------------------------------------------------------------------------
   * if stateFor = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, cc will treat this state as a module state, 
   * then cc will use the this module's globalStateKeys and sharedStateKeys to extract the state.
   * usually ccInstance's $$commitWith, $$callWith, $$callThunkWith, $$effect, $$xeffect, $$invokeWith and dispatch handler in reducer function's block
   * will trigger this extraction strategy
   */


  function getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, ccClassGlobalStateKeys, ccClassSharedStateKeys) {
    var globalStateKeys, sharedStateKeys;

    if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
      globalStateKeys = ccClassGlobalStateKeys;
      sharedStateKeys = ccClassSharedStateKeys;
    } else if (stateFor === STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
      globalStateKeys = moduleName_globalStateKeys_[moduleName];
      sharedStateKeys = moduleName_sharedStateKeys_[moduleName];
    } else {
      throw new Error("stateFor is not set correctly! "); // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
    }

    return {
      globalStateKeys: globalStateKeys,
      sharedStateKeys: sharedStateKeys
    };
  }

  function mapModuleAssociateDataToCcContext(ccClassKey, stateModule, refState, sharedStateKeys, globalStateKeys) {
    var _getSharedKeysAndGlob = getSharedKeysAndGlobalKeys(stateModule, refState, ccClassKey, sharedStateKeys, globalStateKeys),
        targetSharedStateKeys = _getSharedKeysAndGlob.sharedStateKeys,
        targetGlobalStateKeys = _getSharedKeysAndGlob.globalStateKeys;

    mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, targetSharedStateKeys, targetGlobalStateKeys);
    mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);
    mapModuleAndGlobalStateKeys(stateModule, targetGlobalStateKeys);
    mapGlobalKeyAndToModules(stateModule, targetGlobalStateKeys);
    mapGlobalMappingKeyAndToModules(stateModule, targetGlobalStateKeys);
    mapModuleAndCcClassKeys(stateModule, ccClassKey); //tell cc this ccClass is watching some globalStateKeys of global module

    if (targetGlobalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);
    return {
      sharedStateKeys: targetSharedStateKeys,
      globalStateKeys: targetGlobalStateKeys
    };
  }
  /*
  options.module = 'xxx'
  options.sharedStateKeys = ['aa', 'bbb']
  */


  function register(ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$isSingle = _ref.isSingle,
        isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
        _ref$asyncLifecycleHo = _ref.asyncLifecycleHook,
        asyncLifecycleHook = _ref$asyncLifecycleHo === void 0 ? false : _ref$asyncLifecycleHo,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        reducerModule = _ref.reducerModule,
        inputSharedStateKeys = _ref.sharedStateKeys,
        _ref$globalStateKeys = _ref.globalStateKeys,
        inputGlobalStateKeys = _ref$globalStateKeys === void 0 ? [] : _ref$globalStateKeys;

    checkCcStartupOrNot();
    var _curStateModule = module;
    var _asyncLifecycleHook = asyncLifecycleHook;

    var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


    checkStoreModule(_curStateModule);
    checkReducerModule(_reducerModule);
    var sharedStateKeys, globalStateKeys;

    if (ccContext.isModuleMode) {
      var _mapModuleAssociateDa = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, null, inputSharedStateKeys, inputGlobalStateKeys),
          sKeys = _mapModuleAssociateDa.sharedStateKeys,
          gKeys = _mapModuleAssociateDa.globalStateKeys;

      sharedStateKeys = sKeys, globalStateKeys = gKeys;
    }

    return function (ReactClass) {
      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi$1("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
      }

      var CcClass =
      /*#__PURE__*/
      function (_ReactClass) {
        _inheritsLoose(CcClass, _ReactClass);

        function CcClass(props, context) {
          var _this;

          _this = _ReactClass.call(this, props, context) || this;
          if (!_this.state) _this.state = {};
          var ccKey = props.ccKey,
              _props$ccOption = props.ccOption,
              ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
          util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState', '__$$getDispatchHandler']);
          if (!ccOption.storedStateKeys) ccOption.storedStateKeys = []; // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing

          if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

          if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
          if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
          var asyncLifecycleHook = ccOption.asyncLifecycleHook,
              storedStateKeys = ccOption.storedStateKeys;

          if (!ccContext.isModuleMode) {
            var _mapModuleAssociateDa2 = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, _this.state, inputSharedStateKeys, inputGlobalStateKeys),
                _sKeys = _mapModuleAssociateDa2.sharedStateKeys,
                _gKeys = _mapModuleAssociateDa2.globalStateKeys;

            sharedStateKeys = _sKeys, globalStateKeys = _gKeys;
          }

          var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
              ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
              isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

          var ccClassContext = _this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

          _this.__$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys);

          _this.__$$recoverState();

          return _this;
        } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


        var _proto = CcClass.prototype;

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
          return this.state !== nextState;
        };

        _proto.__$$recoverState = function __$$recoverState() {
          var _this$cc$ccState = this.cc.ccState,
              currentModule = _this$cc$ccState.module,
              globalStateKeys = _this$cc$ccState.globalStateKeys,
              sharedStateKeys = _this$cc$ccState.sharedStateKeys,
              ccOption = _this$cc$ccState.ccOption,
              ccUniqueKey = _this$cc$ccState.ccUniqueKey;
          var refState = refStore._state[ccUniqueKey] || {};
          var sharedState = _state[currentModule];
          var globalState = _state[MODULE_GLOBAL];
          var syncSharedState = ccOption.syncSharedState,
              syncGlobalState = ccOption.syncGlobalState;
          var partialSharedState = {},
              partialGlobalState = {};

          if (syncSharedState) {
            var _extractStateByKeys3 = extractStateByKeys(sharedState, sharedStateKeys),
                partialState = _extractStateByKeys3.partialState;

            partialSharedState = partialState;
          }

          if (syncGlobalState) {
            var _extractStateByKeys4 = extractStateByKeys(globalState, globalStateKeys),
                _partialState = _extractStateByKeys4.partialState;

            partialGlobalState = _partialState;
          }

          var selfState = this.state;
          this.state = _extends({}, selfState, refState, partialSharedState, partialGlobalState);
        };

        _proto.__$$bindDataToCcClassContext = function __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
          var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
          var ccKeys = classContext.ccKeys;

          if (ccContext.isDebug) {
            console.log(ss$1("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl$1());
          }

          if (!util.isCcOptionValid(ccOption)) {
            throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi$1("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
          }

          if (ccKeys.includes(ccUniqueKey)) {
            if (util.isHotReloadMode()) {
              var insCount = getCcKeyInsCount(ccUniqueKey);
              if (isSingle && insCount > 1) throw me(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi$1("ccClass:" + ccClassKey));

              if (insCount > 2) {
                // now cc can make sure the ccKey duplicate
                throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
              } // just warning


              console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
              console.error(vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not very well,
              // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
              // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
              // so cc set ref later

              setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption, 600);
            } else {
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            }
          } else {
            setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption);
          }

          return classContext;
        };

        _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys) {
          var _this2 = this;

          var reactSetStateRef = this.setState.bind(this);
          var reactForceUpdateRef = this.forceUpdate.bind(this);
          var ccState = {
            renderCount: 1,
            isSingle: isSingle,
            asyncLifecycleHook: asyncLifecycleHook,
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
            storedStateKeys: storedStateKeys,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: currentModule,
            reducerModule: currentReducerModule,
            sharedStateKeys: sharedStateKeys,
            globalStateKeys: globalStateKeys
          };

          var _verifyKeys2 = verifyKeys$1(sharedStateKeys, storedStateKeys),
              duplicate = _verifyKeys2.duplicate,
              notArray = _verifyKeys2.notArray,
              keyElementNotString = _verifyKeys2.keyElementNotString;

          if (notArray) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (keyElementNotString) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (duplicate) {
            throw me(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
          }

          if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
            throw me(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi$1("ccClassKey:" + ccClassKey));
          }

          this.cc = {
            ccState: ccState,
            ccUniqueKey: ccUniqueKey,
            ccKey: ccKey,
            beforeSetState: this.$$beforeSetState,
            beforeBroadcastState: this.$$beforeBroadcastState,
            afterSetState: this.$$afterSetState,
            reactSetState: function reactSetState(state, cb) {
              ccState.renderCount += 1;
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: function reactForceUpdate(state, cb) {
              ccState.renderCount += 1;
              reactForceUpdateRef(state, cb);
            },
            setState: function setState(state, cb) {
              _this2.$$changeState(state, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule,
                cb: cb
              });
            },
            setGlobalState: function setGlobalState(partialGlobalState, broadcastTriggeredBy) {
              if (broadcastTriggeredBy === void 0) {
                broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
              }

              ccContext.store.setGlobalState(partialGlobalState);

              _this2.$$changeState(partialGlobalState, {
                module: currentModule,
                broadcastTriggeredBy: broadcastTriggeredBy,
                isStateGlobal: true
              });
            },
            forceUpdate: function forceUpdate(cb) {
              _this2.$$changeState(_this2.state, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule,
                cb: cb
              });
            },
            // always change self module's state
            invoke: function invoke(userLogicFn) {
              var _this2$cc;

              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }

              (_this2$cc = _this2.cc).__invokeWith.apply(_this2$cc, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            // change other module's state, mostly you should use this method to generate new state instead of xeffect,
            // because xeffect will force your logicFn to put your first param as ExecutionContext
            effect: function effect(targetModule, userLogicFn) {
              var _this2$cc2;

              for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              (_this2$cc2 = _this2.cc).__invokeWith.apply(_this2$cc2, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                context: false,
                module: targetModule
              }].concat(args));
            },
            // change other module's state, cc will give userLogicFn EffectContext object as first param
            xeffect: function xeffect(targetModule, userLogicFn) {
              var _this2$cc3;

              for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
              }

              (_this2$cc3 = _this2.cc).__invokeWith.apply(_this2$cc3, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                state: getState(targetModule),
                context: true,
                module: targetModule
              }].concat(args));
            },
            invokeWith: function invokeWith(userLogicFn, option) {
              var _this2$cc4;

              var _option$module = option.module,
                  module = _option$module === void 0 ? currentModule : _option$module,
                  _option$context = option.context,
                  context = _option$context === void 0 ? false : _option$context,
                  _option$forceSync = option.forceSync,
                  forceSync = _option$forceSync === void 0 ? false : _option$forceSync,
                  cb = option.cb;

              for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                args[_key4 - 2] = arguments[_key4];
              }

              (_this2$cc4 = _this2.cc).__invokeWith.apply(_this2$cc4, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                state: getState(module),
                context: context,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __invokeWith: function __invokeWith(userLogicFn, executionContext) {
              for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                args[_key5 - 2] = arguments[_key5];
              }

              var stateFor = executionContext.stateFor,
                  _executionContext$mod = executionContext.module,
                  targetModule = _executionContext$mod === void 0 ? currentModule : _executionContext$mod,
                  _executionContext$con = executionContext.context,
                  context = _executionContext$con === void 0 ? false : _executionContext$con,
                  _executionContext$for = executionContext.forceSync,
                  forceSync = _executionContext$for === void 0 ? false : _executionContext$for,
                  cb = executionContext.cb;
              isStateModuleValid(targetModule, currentModule, cb, function (newCb) {
                if (context) args.unshift(executionContext);
                co_1.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
                  _this2.$$changeState(partialState, {
                    stateFor: stateFor,
                    module: targetModule,
                    forceSync: forceSync,
                    cb: newCb
                  });
                }).catch(justWarning$1);
              });
            },
            call: function call(userLogicFn) {
              var _this2$cc5;

              for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                args[_key6 - 1] = arguments[_key6];
              }

              (_this2$cc5 = _this2.cc).__callWith.apply(_this2$cc5, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            callWith: function callWith(userLogicFn, _temp2) {
              var _this2$cc6;

              var _ref2 = _temp2 === void 0 ? {} : _temp2,
                  _ref2$module = _ref2.module,
                  module = _ref2$module === void 0 ? currentModule : _ref2$module,
                  _ref2$forceSync = _ref2.forceSync,
                  forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                  cb = _ref2.cb;

              for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                args[_key7 - 2] = arguments[_key7];
              }

              (_this2$cc6 = _this2.cc).__callWith.apply(_this2$cc6, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __callWith: function __callWith(userLogicFn, _temp3) {
              var _ref3 = _temp3 === void 0 ? {} : _temp3,
                  stateFor = _ref3.stateFor,
                  _ref3$module = _ref3.module,
                  module = _ref3$module === void 0 ? currentModule : _ref3$module,
                  _ref3$forceSync = _ref3.forceSync,
                  forceSync = _ref3$forceSync === void 0 ? false : _ref3$forceSync,
                  cb = _ref3.cb;

              for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                args[_key8 - 2] = arguments[_key8];
              }

              isStateModuleValid(module, currentModule, cb, function (newCb) {
                userLogicFn.call.apply(userLogicFn, [_this2, _this2.__$$getChangeStateHandler({
                  stateFor: stateFor,
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                })].concat(args));
              });
            },
            callThunk: function callThunk(userLogicFn) {
              var _this2$cc7;

              for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
                args[_key9 - 1] = arguments[_key9];
              }

              (_this2$cc7 = _this2.cc).__callThunkWith.apply(_this2$cc7, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            callThunkWith: function callThunkWith(userLogicFn, _temp4) {
              var _this2$cc8;

              var _ref4 = _temp4 === void 0 ? {} : _temp4,
                  _ref4$module = _ref4.module,
                  module = _ref4$module === void 0 ? currentModule : _ref4$module,
                  _ref4$forceSync = _ref4.forceSync,
                  forceSync = _ref4$forceSync === void 0 ? false : _ref4$forceSync,
                  cb = _ref4.cb;

              for (var _len10 = arguments.length, args = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
                args[_key10 - 2] = arguments[_key10];
              }

              (_this2$cc8 = _this2.cc).__callThunkWith.apply(_this2$cc8, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __callThunkWith: function __callThunkWith(userLogicFn, _temp5) {
              var _ref5 = _temp5 === void 0 ? {} : _temp5,
                  stateFor = _ref5.stateFor,
                  _ref5$module = _ref5.module,
                  module = _ref5$module === void 0 ? currentModule : _ref5$module,
                  _ref5$forceSync = _ref5.forceSync,
                  forceSync = _ref5$forceSync === void 0 ? false : _ref5$forceSync,
                  cb = _ref5.cb;

              for (var _len11 = arguments.length, args = new Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) {
                args[_key11 - 2] = arguments[_key11];
              }

              isStateModuleValid(module, currentModule, cb, function (newCb) {
                userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.__$$getChangeStateHandler({
                  stateFor: stateFor,
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                }));
              });
            },
            commit: function commit(userLogicFn) {
              var _this2$cc9;

              for (var _len12 = arguments.length, args = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
                args[_key12 - 1] = arguments[_key12];
              }

              (_this2$cc9 = _this2.cc).__commitWith.apply(_this2$cc9, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            commitWith: function commitWith(userLogicFn, _temp6) {
              var _this2$cc10;

              var _ref6 = _temp6 === void 0 ? {} : _temp6,
                  _ref6$module = _ref6.module,
                  module = _ref6$module === void 0 ? currentModule : _ref6$module,
                  _ref6$forceSync = _ref6.forceSync,
                  forceSync = _ref6$forceSync === void 0 ? false : _ref6$forceSync,
                  cb = _ref6.cb;

              for (var _len13 = arguments.length, args = new Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
                args[_key13 - 2] = arguments[_key13];
              }

              (_this2$cc10 = _this2.cc).__commitWith.apply(_this2$cc10, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __commitWith: function __commitWith(userLogicFn, _temp7) {
              var _ref7 = _temp7 === void 0 ? {} : _temp7,
                  stateFor = _ref7.stateFor,
                  _ref7$module = _ref7.module,
                  module = _ref7$module === void 0 ? currentModule : _ref7$module,
                  _ref7$forceSync = _ref7.forceSync,
                  forceSync = _ref7$forceSync === void 0 ? false : _ref7$forceSync,
                  cb = _ref7.cb;

              for (var _len14 = arguments.length, args = new Array(_len14 > 2 ? _len14 - 2 : 0), _key14 = 2; _key14 < _len14; _key14++) {
                args[_key14 - 2] = arguments[_key14];
              }

              isStateModuleValid(module, currentModule, cb, function (newCb) {
                var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

                _this2.$$changeState(state, {
                  stateFor: stateFor,
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                });
              });
            },
            dispatch: function dispatch(_temp8) {
              var _ref8 = _temp8 === void 0 ? {} : _temp8,
                  stateFor = _ref8.stateFor,
                  inputModule = _ref8.module,
                  inputReducerModule = _ref8.reducerModule,
                  _ref8$forceSync = _ref8.forceSync,
                  forceSync = _ref8$forceSync === void 0 ? false : _ref8$forceSync,
                  type = _ref8.type,
                  payload = _ref8.payload,
                  reactCallback = _ref8.cb;

              //if module not defined, targetStateModule will be currentModule
              var targetStateModule = inputModule || currentModule; //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule

              var targetReducerModule = inputReducerModule || targetStateModule;
              var targetReducerMap = _reducer$1[targetReducerModule];
              if (!targetReducerMap) return justWarning$1("no reducerMap found for module:" + targetReducerModule);
              var reducerFn = targetReducerMap[type];
              if (!reducerFn) return justWarning$1("no reducer defined in ccContext for module:" + targetReducerModule + " type:" + type); // const errMsg = util.isCcActionValid({ type, payload });
              // if (errMsg) return justWarning(errMsg);

              var contextDispatch = _this2.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE);

              isStateModuleValid(targetStateModule, currentModule, reactCallback, function (newCb) {
                var executionContext = {
                  stateFor: stateFor,
                  ccUniqueKey: ccUniqueKey,
                  ccOption: ccOption,
                  module: targetStateModule,
                  reducerModule: targetReducerModule,
                  type: type,
                  dispatch: contextDispatch,
                  payload: payload,
                  state: getState(targetStateModule),
                  effect: _this2.$$effect,
                  xeffect: _this2.$$xeffect,
                  forceSync: forceSync,
                  cb: newCb,
                  context: true
                };

                _this2.cc.__invokeWith(reducerFn, executionContext);
              });
            },
            prepareReactSetState: function prepareReactSetState(changeBy, state, next, reactCallback) {
              var _targetState = null;

              if (storedStateKeys.length > 0) {
                var _extractStateByKeys5 = extractStateByKeys(state, storedStateKeys),
                    partialState = _extractStateByKeys5.partialState,
                    isStateEmpty = _extractStateByKeys5.isStateEmpty;

                if (!isStateEmpty) {
                  refStore.setState(ccUniqueKey, partialState);
                }
              }

              _targetState = state;

              if (!_targetState) {
                if (next) next();
                return;
              }

              if (_this2.$$beforeSetState) {
                if (asyncLifecycleHook) {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  _this2.$$beforeSetState({
                    changeBy: changeBy
                  }, function () {
                    _this2.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  });
                } else {
                  _this2.$$beforeSetState({
                    changeBy: changeBy
                  });

                  _this2.cc.reactSetState(state, reactCallback);

                  if (next) next();
                }
              } else {
                _this2.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            },
            prepareBroadcastGlobalState: function prepareBroadcastGlobalState(broadcastTriggeredBy, globalState) {
              var _extractStateByKeys6 = extractStateByKeys(globalState, ccGlobalStateKeys),
                  partialGlobalState = _extractStateByKeys6.partialState,
                  isStateEmpty = _extractStateByKeys6.isStateEmpty;

              if (Object.keys(partialGlobalState) < Object.keys(globalState)) {
                justWarning$1("\n                note! you are calling method setGlobalState, but the state you commit include some invalid keys which is not declared in cc's global state, \n                cc will ignore them, but if this result is not as you expected, please check your committed global state!");
              }

              if (!isStateEmpty) {
                if (_this2.$$beforeBroadcastState) {
                  //check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    }, function () {
                      _this2.cc.broadcastGlobalState(partialGlobalState);
                    });
                  } else {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    });

                    _this2.cc.broadcastGlobalState(partialGlobalState);
                  }
                } else {
                  _this2.cc.broadcastGlobalState(partialGlobalState);
                }
              }
            },
            prepareBroadcastState: function prepareBroadcastState(stateFor, broadcastTriggeredBy, moduleName, originalState, needClone) {
              var targetSharedStateKeys, targetGlobalStateKeys;

              try {
                var result = getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, globalStateKeys, sharedStateKeys);
                targetSharedStateKeys = result.sharedStateKeys;
                targetGlobalStateKeys = result.globalStateKeys;
              } catch (err) {
                return justWarning$1(err.message + " prepareBroadcastState failed!");
              }

              var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, originalState, targetSharedStateKeys, targetGlobalStateKeys),
                  isPartialSharedStateEmpty = _extractStateToBeBroa.isPartialSharedStateEmpty,
                  isPartialGlobalStateEmpty = _extractStateToBeBroa.isPartialGlobalStateEmpty,
                  partialSharedState = _extractStateToBeBroa.partialSharedState,
                  partialGlobalState = _extractStateToBeBroa.partialGlobalState,
                  module_globalState_ = _extractStateToBeBroa.module_globalState_;

              if (!isPartialSharedStateEmpty || !isPartialGlobalStateEmpty) {
                if (_this2.$$beforeBroadcastState) {
                  //check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    }, function () {
                      _this2.cc.broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                    });
                  } else {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    });

                    _this2.cc.broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                  }
                } else {
                  _this2.cc.broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                }
              }
            },
            broadcastState: function broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone) {
              var _partialSharedState = partialSharedState;
              if (needClone) _partialSharedState = util.clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

              ccContext.store.setState(moduleName, _partialSharedState);
              var currentCcKey = _this2.cc.ccState.ccUniqueKey;
              // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
              // so flag ignoreCurrentCcKey as true;

              var ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
              var ccClassKeys = moduleName_ccClassKeys_[moduleName];

              if (ccClassKeys) {
                //  these ccClass are watching the same module's state
                ccClassKeys.forEach(function (ccClassKey) {
                  var classContext = ccClassKey_ccClassContext_[ccClassKey];
                  var ccKeys = classContext.ccKeys,
                      sharedStateKeys = classContext.sharedStateKeys,
                      globalStateKeys = classContext.globalStateKeys;
                  if (ccKeys.length === 0) return;
                  if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return; //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!

                  var _extractStateByKeys7 = extractStateByKeys(_partialSharedState, sharedStateKeys),
                      sharedStateForCurrentCcClass = _extractStateByKeys7.partialState,
                      isSharedStateEmpty = _extractStateByKeys7.isStateEmpty; //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                  //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                  //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                  //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                  var _extractStateByKeys8 = extractStateByKeys(partialGlobalState, globalStateKeys),
                      globalStateForCurrentCcClass = _extractStateByKeys8.partialState,
                      isPartialGlobalStateEmpty = _extractStateByKeys8.isStateEmpty;

                  if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;

                  var mergedStateForCurrentCcClass = _extends({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);

                  ccKeys.forEach(function (ccKey) {
                    if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
                    var ref = ccKey_ref_[ccKey];

                    if (ref) {
                      var option = ccKey_option_[ccKey];
                      var toSet = null,
                          changeBy = -1;

                      if (option.syncSharedState && option.syncGlobalState) {
                        changeBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE;
                        toSet = mergedStateForCurrentCcClass;
                      } else if (option.syncSharedState) {
                        changeBy = CHANGE_BY_BROADCASTED_SHARED_STATE;
                        toSet = sharedStateForCurrentCcClass;
                      } else if (option.syncGlobalState) {
                        changeBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE;
                        toSet = globalStateForCurrentCcClass;
                      }

                      if (toSet) {
                        if (ccContext.isDebug) {
                          console.log(ss$1("ref " + ccKey + " to be rendered state(changeBy " + changeBy + ") is broadcast from same module's other ref " + currentCcKey), cl$1());
                        }

                        ref.cc.prepareReactSetState(changeBy, toSet);
                      }
                    }
                  });
                });
              }

              if (util.isObjectNotNull(module_globalState_)) {
                var moduleNames = Object.keys(module_globalState_);
                moduleNames.forEach(function (mName) {
                  var partialGlobalState = module_globalState_[mName];
                  var ccClassKeys = moduleName_ccClassKeys_[mName];
                  ccClassKeys.forEach(function (ccClassKey) {
                    var classContext = ccClassKey_ccClassContext_[ccClassKey];
                    var ccKeys = classContext.ccKeys,
                        globalStateKeys = classContext.globalStateKeys;
                    if (ccKeys.length === 0) return;
                    if (globalStateKeys.length === 0) return;

                    var _extractStateByKeys9 = extractStateByKeys(partialGlobalState, globalStateKeys),
                        globalStateForCurrentCcClass = _extractStateByKeys9.partialState,
                        isPartialGlobalStateEmpty = _extractStateByKeys9.isStateEmpty;

                    if (isPartialGlobalStateEmpty) return;
                    ccKeys.forEach(function (ccKey) {
                      var ref = ccKey_ref_[ccKey];

                      if (ref) {
                        var option = ccKey_option_[ccKey];

                        if (option.syncGlobalState) {
                          if (ccContext.isDebug) {
                            console.log(ss$1("ref " + ccKey + " to be rendered state(only global state) is broadcast from other module " + moduleName), cl$1());
                          }

                          ref.cc.prepareReactSetState(CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, globalStateForCurrentCcClass);
                        }
                      }
                    });
                  });
                });
              }
            },
            broadcastGlobalState: function broadcastGlobalState(globalSate) {
              globalCcClassKeys.forEach(function (ccClassKey) {
                var _ccClassKey_ccClassCo = ccClassKey_ccClassContext_[ccClassKey],
                    globalStateKeys = _ccClassKey_ccClassCo.globalStateKeys,
                    ccKeys = _ccClassKey_ccClassCo.ccKeys;

                var _extractStateByKeys10 = extractStateByKeys(globalSate, globalStateKeys),
                    partialState = _extractStateByKeys10.partialState,
                    isStateEmpty = _extractStateByKeys10.isStateEmpty;

                if (!isStateEmpty) {
                  ccKeys.forEach(function (ccKey) {
                    var ref = ccKey_ref_[ccKey];

                    if (ref) {
                      var option = ccKey_option_[ccKey];

                      if (option.syncGlobalState === true) {
                        ref.cc.prepareReactSetState(CHANGE_BY_BROADCASTED_GLOBAL_STATE, partialState);
                      }
                    }
                  });
                }
              });
            }
          };
          this.cc.reactSetState = this.cc.reactSetState.bind(this);
          this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
          this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
          this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
          this.cc.dispatch = this.cc.dispatch.bind(this);
          this.cc.__callWith = this.cc.__callWith.bind(this);
          this.cc.__callThunkWith = this.cc.__callThunkWith.bind(this);
          this.cc.__commitWith = this.cc.__commitWith.bind(this);
          this.cc.__invokeWith = this.cc.__invokeWith.bind(this); // let CcComponent instance can call dispatch directly
          // if you call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY

          this.$$dispatch = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
          this.$$invoke = this.cc.invoke.bind(this); // commit state to cc directly, but userFn can be promise or generator both!

          this.$$invokeWith = this.cc.invokeWith.bind(this);
          this.$$call = this.cc.call.bind(this); // commit state by setState handler

          this.$$callWith = this.cc.callWith.bind(this);
          this.$$callThunk = this.cc.callThunk.bind(this); // commit state by setState handler

          this.$$callThunkWith = this.cc.callThunkWith.bind(this);
          this.$$commit = this.cc.commit.bind(this); // commit state to cc directly, userFn can only be normal function

          this.$$commitWith = this.cc.commitWith.bind(this);
          this.$$effect = this.cc.effect.bind(this); // commit state to cc directly, userFn can only be normal function

          this.$$xeffect = this.cc.xeffect.bind(this);
          this.setState = this.cc.setState; //let setState call cc.setState

          this.setGlobalState = this.cc.setGlobalState; //let setState call cc.setState

          this.forceUpdate = this.cc.forceUpdate; //let forceUpdate call cc.forceUpdate
        }; // this method is useful only if you want to change other ccInstance's sate one time in a ccInstance which its syncSharedState is false, 
        // so make sure you know what you want, and you don't need call this method most of the time,
        // -------------------------------------------------------------------------------------------------------------------------
        // note!!! changeState do two thing, decide if it will change self's state or not, if it will broadcast state or not;
        // when ccIns's module != target module,
        //        cc will only broadcast the state to target module, and be careful: it will overwrite the target module's state!!
        // when ccIns's module == target module,
        //        if ccIns option.syncSharedState is false, cc only change it's own state, no broadcast operation happen.
        //           but if you pass forceSync=true, cc will also broadcast the state to target module, 
        //           and be careful: cc will clone this piece of state before broadcasting, so it will overwrite the target module's state !!!
        //        if ccIns option.syncSharedState is true, change it's own state and broadcast the state to target module


        _proto.$$changeState = function $$changeState(state, _temp9) {
          var _this3 = this;

          var _ref9 = _temp9 === void 0 ? {} : _temp9,
              _ref9$stateFor = _ref9.stateFor,
              stateFor = _ref9$stateFor === void 0 ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref9$stateFor,
              _ref9$isStateGlobal = _ref9.isStateGlobal,
              isStateGlobal = _ref9$isStateGlobal === void 0 ? false : _ref9$isStateGlobal,
              module = _ref9.module,
              broadcastTriggeredBy = _ref9.broadcastTriggeredBy,
              changeBy = _ref9.changeBy,
              forceSync = _ref9.forceSync,
              reactCallback = _ref9.cb;

          //executionContext
          if (!isPlainJsonObject(state)) {
            justWarning$1("cc found your commit state is not a plain json object!");
          }

          if (isStateGlobal) {
            this.cc.prepareBroadcastGlobalState(broadcastTriggeredBy, state);
          } else {
            var ccState = this.cc.ccState;
            var currentModule = ccState.module;

            if (module === currentModule) {
              // who trigger $$changeState, who will go to change the whole received state 
              this.cc.prepareReactSetState(changeBy || CHANGE_BY_SELF, state, function () {
                //if forceSync=true, cc clone the input state
                if (forceSync === true) {
                  _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
                } else if (ccState.ccOption.syncSharedState) {
                  _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
                }
              }, reactCallback);
            } else {
              if (forceSync) justWarning$1("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi$1("module:" + module + " currentModule" + currentModule));
              if (reactCallback) justWarning$1("callback for react.setState will be ignore");
              this.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
            }
          }
        }; //{ module, forceSync, cb }


        _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
          var _this4 = this;

          return function (state) {
            _this4.$$changeState(state, executionContext);
          };
        };

        _proto.__$$getDispatchHandler = function __$$getDispatchHandler(stateFor) {
          var _this5 = this;

          return function (_temp10) {
            var _ref10 = _temp10 === void 0 ? {} : _temp10,
                module = _ref10.module,
                reducerModule = _ref10.reducerModule,
                _ref10$forceSync = _ref10.forceSync,
                forceSync = _ref10$forceSync === void 0 ? false : _ref10$forceSync,
                type = _ref10.type,
                payload = _ref10.payload,
                reactCallback = _ref10.cb;

            _this5.cc.dispatch({
              stateFor: stateFor,
              module: module,
              reducerModule: reducerModule,
              forceSync: forceSync,
              type: type,
              payload: payload,
              cb: reactCallback
            });
          };
        };

        _proto.componentDidUpdate = function componentDidUpdate() {
          if (_ReactClass.prototype.componentDidUpdate) _ReactClass.prototype.componentDidUpdate.call(this);
          if (this.$$afterSetState) this.$$afterSetState();
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          var _this$cc$ccState2 = this.cc.ccState,
              ccUniqueKey = _this$cc$ccState2.ccUniqueKey,
              ccKeys = _this$cc$ccState2.ccClassContext.ccKeys;
          unsetCcInstanceRef(ccKeys, ccUniqueKey); //if father component implement componentWillUnmount，call it again

          if (_ReactClass.prototype.componentWillUnmount) _ReactClass.prototype.componentWillUnmount.call(this);
        };

        _proto.render = function render() {
          if (ccContext.isDebug) {
            console.log(ss$1("@@@ render " + ccClassDisplayName$1(ccClassKey)), cl$1());
          }

          return _ReactClass.prototype.render.call(this);
        };

        return CcClass;
      }(ReactClass);

      CcClass.displayName = ccClassDisplayName$1(ccClassKey);
      return CcClass;
    };
  }

  /**
   * @description configure module、state、option to cc
   * @author zzk
   * @export
   * @param {String} module
   * @param {Object} state
   * @param {Option？} [option] reducer、init、sharedToGlobalMapping
   * @param {Option？} [option.reducer]  you can define multi reducer for a module by specify a reducer
   * @param {Option？} [option.moduleReducer]  if you specify moduleReducer for module, 
   * the reducer's module name is equal to statue module name, and the reducer will be ignored automatically
   */

  function configure (module, state, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        singleClass = _ref.singleClass,
        moduleReducer = _ref.moduleReducer,
        reducer = _ref.reducer,
        init = _ref.init,
        globalState = _ref.globalState,
        sharedToGlobalMapping = _ref.sharedToGlobalMapping;

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet, you can not call cc.configure!');
    }

    if (!ccContext.isModuleMode) {
      throw new Error('cc is running in non module node, can not call cc.configure');
    }

    checkModuleName(module);
    checkModuleState(state);
    var _state = ccContext.store._state;
    var _reducer = ccContext.reducer._reducer;

    if (_state[module]) {
      throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo("moduleName " + module));
    }

    _state[module] = state;

    if (singleClass === true) {
      ccContext.moduleSingleClass[module] = true;
    }

    if (moduleReducer) {
      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " 's moduleReducer is invalid"));
      }

      _reducer[module] = moduleReducer;
    } else if (reducer) {
      if (!isPlainJsonObject(reducer)) {
        throw makeError(ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " 's moduleReducer is invalid"));
      }

      var reducerModuleNames = Object.keys(reducer);
      reducerModuleNames.forEach(function (rmName) {
        checkModuleName(rmName);
        var moduleReducer = reducer[rmName];

        if (!isPlainJsonObject(moduleReducer)) {
          throw makeError(ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " reducer 's value  is invalid"));
        }

        if (rmName == MODULE_GLOBAL) {
          //merge input globalReducer to existed globalReducer
          var typesOfGlobal = Object.keys(moduleReducer);
          var globalReducer = _reducer[MODULE_GLOBAL];
          typesOfGlobal.forEach(function (type) {
            if (globalReducer[type]) {
              throw makeError(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo("type " + type));
            }

            var reducerFn = moduleReducer[type];

            if (typeof reducerFn !== 'function') {
              throw makeError(ERR.CC_REDUCER_NOT_A_FUNCTION);
            }

            globalReducer[type] = reducerFn;
          });
        } else {
          _reducer[rmName] = moduleReducer;
        }
      });
    }

    var storedGlobalState = _state[MODULE_GLOBAL];

    if (globalState) {
      checkModuleState(globalState);
      var globalStateKeys = Object.keys(globalState);
      globalStateKeys.forEach(function (gKey) {
        if (storedGlobalState[gKey]) {
          throw makeError(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE, verboseInfo("duplicate globalKey: " + gKey));
        }

        var stateValue = globalState[gKey];
        storedGlobalState[gKey] = stateValue;
      });
    }

    if (sharedToGlobalMapping) {
      handleModuleSharedToGlobalMapping(module, sharedToGlobalMapping);
    }

    if (init) {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function!');
      }

      init(getStateHandlerForInit(module));
    }
  }

  var vbi$2 = util.verboseInfo;
  var ccClassKey_ccClassContext_$1 = ccContext.ccClassKey_ccClassContext_,
      ccKey_ref_$1 = ccContext.ccKey_ref_;
  /**
   * @description
   * @author zzk
   * @export
   * @param {*} ccClassKey must pass to invoke!
   * @param {*} ccInstanceKey must pass to invoke but you can pass null or undefined or '', cc will pick one instance of this CcClass
   * @param {*} method
   * @param {*} args
   * @returns
   */

  function invoke (ccClassKey, ccInstanceKey, method) {
    var _ref$method;

    var classContext = ccClassKey_ccClassContext_$1[ccClassKey];

    if (!classContext) {
      var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi$2(" ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ref;

    if (ccInstanceKey) {
      var ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
      ref = ccKey_ref_$1[ccKey];
    } else {
      var ccKeys = classContext.ccKeys;
      ref = ccKey_ref_$1[ccKeys[0]]; // pick first one
    }

    if (!ref) {
      var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi$2(" ccClassKey:" + ccClassKey + " ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


      return console.error(_err.message);
    }

    var fn = ref[method];

    if (!fn) {
      var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi$2(" method:" + method)); // only error


      return console.error(_err2.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
  }

  var vbi$3 = util.verboseInfo;
  var ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_;
  function invokeSingle (ccClassKey, method) {
    var classContext = ccClassKey_ccClassContext_$2[ccClassKey];

    if (!classContext.isSingle) {
      var err = util.makeError(ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE, vbi$3("ccClassKey:" + ccClassKey)); // only error, the target instance may has been unmounted really!

      return console.error(err.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    invoke.apply(void 0, [ccClassKey, ccClassKey, method].concat(args));
  }

  console.log('what is setState', setState);

  var defaultExport = {
    startup: startup,
    register: register,
    configure: configure,
    invoke: invoke,
    invokeSingle: invokeSingle,
    setGlobalState: setGlobalState,
    setState: setState,
    ccContext: ccContext
  };

  if (window) {
    window.cc = defaultExport;
  }

  return defaultExport;

})));
