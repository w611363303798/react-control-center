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
    CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION: 1011,
    CC_MODULE_NOT_FOUND: 1012,
    CC_DISPATCH_STRING_INVALID: 1013,
    CC_DISPATCH_PARAM_INVALID: 1014,
    CC_CLASS_KEY_DUPLICATE: 1100,
    CC_CLASS_NOT_FOUND: 1101,
    CC_CLASS_STORE_MODULE_INVALID: 1102,
    CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED: 1103,
    CC_CLASS_REDUCER_MODULE_INVALID: 1104,
    CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE: 1105,
    CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE: 1106,
    CC_CLASS_STATE_TO_PROP_MAPPING_INVALID: 1107,
    CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID: 1108,
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
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module. ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the computed keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID] = 'stateToPropMapping is invalid, must be a plain json object, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID] = 'key of stateToPropMapping is invalid, correct one may like $g/m, must and only include one slash, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='*' and globalStateKeys='*'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE] = 'some keys of configured global state have been included in store.globalState', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY] = 'found key is sharedToGlobalMapping key in globalStateKeys, you should delete it ', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE] = 'found key in globalStateKeys is not included in global state, check your globalStateKeys', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);

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
  function isPrefixedKeyValid(key) {
    var slashCount = key.split('').filter(function (v) {
      return v === '/';
    }).length;

    if (slashCount === 1) {
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
      ccKeys: [],
      propState: {},
      propKey_stateKeyDescriptor_: {},
      stateKey_propKeyDescriptor_: {},
      stateToPropMapping: null
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
  function makeHandlerKey(ccUniqueKey, eventName) {
    return ccUniqueKey + "$" + eventName;
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
    console.log(' ------------ CC TIP ------------');
    console.log("%c" + msg, 'color:green;border:1px solid green;');
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
  function isStateValid(state) {
    if (!state || !isPlainJsonObject(state)) {
      return false;
    } else {
      return true;
    }
  }
  var util = {
    makeError: makeError,
    isHotReloadMode: isHotReloadMode,
    makeCcClassContext: makeCcClassContext,
    makeStateMail: makeStateMail,
    makeUniqueCcKey: makeUniqueCcKey,
    makeHandlerKey: makeHandlerKey,
    isActionTypeValid: isActionTypeValid,
    isModuleNameValid: isModuleNameValid,
    isModuleNameCcLike: isModuleNameCcLike,
    isModuleStateValid: isModuleStateValid,
    isCcOptionValid: isCcOptionValid,
    isCcActionValid: isCcActionValid,
    isPrefixedKeyValid: isPrefixedKeyValid,
    isPlainJsonObject: isPlainJsonObject,
    isObjectNotNull: isObjectNotNull,
    isValueNotNull: isValueNotNull,
    isStateValid: isStateValid,
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

  var setStateByModule = function setStateByModule(module, partialState) {
    // const fullState = getState(module);
    // const mergedState = { ...fullState, ...partialState };
    // _state[module] = mergedState;
    Object.keys(partialState).forEach(function (key) {
      setStateByModuleAndKey(module, key, partialState[key]);
    });
  };

  var _getState = function getState(module) {
    var _state = ccContext.store._state;
    return _state[module];
  };

  var setStateByModuleAndKey = function setStateByModuleAndKey(module, key, value) {
    var moduleState = _getState(module);

    moduleState[key] = value;
    var moduleComputedFn = computed._computedFn[module];

    if (moduleComputedFn) {
      var fn = moduleComputedFn[key];

      if (fn) {
        var computedValue = fn(value);
        computed._computedValue[module][key] = computedValue;
      }
    }
  };

  var computed = {
    _computedValue: {},
    _computedFn: {}
  };
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
    propModuleName_ccClassKeys_: {//module is watched by these ccClass's propState
    },
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
        isPropModuleMode:false,// when false, data were collected into propState directly, else collected into propState[module]
        propState:{},
        propKey_stateKeyDescriptor_: {},
        stateKey_propKeyDescriptor_: {},
        stateToPropMapping:null,
        ccKeys: [],
      }
    */
    ccClassKey_ccClassContext_: {},
    // [globalKey]:${modules}, let cc know what modules are watching a same globalKey
    globalKey_toModules_: {},
    sharedToGlobalMapping: {},
    //  translate sharedToGlobalMapping object to another shape: {sharedKey: {globalMappingKey, fromModule}, ... }
    sharedKey_globalMappingKeyDescriptor_: {},
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
    store: {
      _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
      getState: function getState(module) {
        if (module) return _getState(module);else return ccContext.store._state;
      },
      setState: function setState(module, partialSharedState) {
        setStateByModule(module, partialSharedState);
      },
      setStateByModuleAndKey: setStateByModuleAndKey,
      setGlobalState: function setGlobalState(partialGlobalState) {
        setStateByModule(MODULE_GLOBAL, partialGlobalState);
      },
      setGlobalStateByKey: function setGlobalStateByKey(key, value) {
        setStateByModuleAndKey(MODULE_GLOBAL, key, value);
      },
      getGlobalState: function getGlobalState() {
        return ccContext.store._state[MODULE_GLOBAL];
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer)
    },
    computed: computed,
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
    //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
    event_handlers_: {},
    ccUniqueKey_handlerKeys_: {},
    // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
    // it is a ref that towards ccUniqueKeyEvent_handler_'s key
    // when component unmounted, it's handler will been removed
    handlerKey_handler_: {},
    ccKey_option_: {},
    refs: refs,
    info: {
      startupTime: Date.now()
    },
    errorHandler: null
  };

  if (window && !window.sss) {
    window.sss = ccContext.store._state;
  }

  /****
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module) {
    var ccKey_ref_ = ccContext.ccKey_ref_,
        moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
        ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
    var ccKeys = [];

    if (module) {
      if (ccContext.store._state[module]) {
        var ccClassKeys = moduleName_ccClassKeys_[module];

        if (ccClassKeys && ccClassKeys.length !== 0) {
          var oneCcClassKey = ccClassKeys[0];
          var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

          if (!ccClassContext) {
            throw new Error("no ccClassContext found for ccClassKey " + oneCcClassKey + "!");
          }

          ccKeys = ccClassContext.ccKeys;
        }
      } else {
        throw new Error("sorry, module: " + module + " is invalid, cc don't know this module!");
      }
    }

    if (ccKeys.length === 0) {
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

      if (typeof globalMappingKey !== 'string') {
        throw new Error("globalMappingKey type error, is must be string, check your sharedToGlobalMapping! " + util.verboseInfo("module:" + moduleName + ", sharedKey:" + sharedKey));
      }

      mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
    }
  }

  function setState (module, state, throwError) {
    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef(module);
      ref.$$changeState(state, {
        module: module,
        stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
        broadcastTriggeredBy: BROADCAST_TRIGGERED_BY_CC_API_SET_STATE
      });
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
      ref.$$changeState(state, {
        module: MODULE_GLOBAL,
        stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
        broadcastTriggeredBy: BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE
      });
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function extractStateByKeys (state, targetKeys) {
    if (!isStateValid(state) || !isObjectNotNull(state)) {
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

  var ccStoreSetState = ccContext.store.setState;
  var ccGlobalStateKeys = ccContext.globalStateKeys;
  var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";
  function getAndStoreValidGlobalState (globalState) {
    var _extractStateByKeys = extractStateByKeys(globalState, ccGlobalStateKeys),
        validGlobalState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    if (Object.keys(validGlobalState) < Object.keys(globalState)) {
      justWarning(tip);
    }

    ccStoreSetState(MODULE_GLOBAL, validGlobalState);
    return {
      partialState: validGlobalState,
      isStateEmpty: isStateEmpty
    };
  }

  function getStateHandlerForInit (module) {
    return function (state) {
      try {
        setState(module, state, true);
      } catch (err) {
        if (module == MODULE_GLOBAL) {
          getAndStoreValidGlobalState(state);
        } else {
          var moduleState = ccContext.store.getState(module);

          if (!moduleState) {
            return util.justWarning("invalid module " + module);
          }

          var keys = Object.keys(moduleState);

          var _extractStateByKeys = extractStateByKeys(state, keys),
              validModuleState = _extractStateByKeys.partialState,
              isStateEmpty = _extractStateByKeys.isStateEmpty;

          if (!isStateEmpty) ccContext.store.setState(module, validModuleState); //store this state;
        }

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
    var globalState = store[MODULE_GLOBAL];
    _state[MODULE_CC] = {};

    if (isModuleMode) {
      var moduleNames = Object.keys(store);

      if (globalState) {
        if (!util.isModuleStateValid(globalState)) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi("moduleName:" + MODULE_GLOBAL + "'s value is invalid!"));
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
            globalState = store[MODULE_GLOBAL];
            Object.keys(globalState).forEach(function (key) {
              globalStateKeys.push(key);
            });
            invalidKeyCount += 1;
            console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
          }
        } else {
          globalState = {};
        }

        _state[MODULE_GLOBAL] = globalState;

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

    var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
    globalStateKeys.reduce(function (pKeys, gKey) {
      if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
      return pKeys;
    }, pureGlobalStateKeys);
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

    throw new Error("now isReducerKeyMeanNamespacedActionType is not supported by current version react-control-center, \n    it may comme in the future, but i think modular reducer is the best practice!\n  ");
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
      mapComputed(MODULE_DEFAULT, computed);
    }
  }

  function executeInitializer(isModuleMode, store, init) {
    var stateHandler = getStateHandlerForInit;
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
        _ref$isReducerKeyMean = _ref.isReducerKeyMeanNamespacedActionType,
        isReducerKeyMeanNamespacedActionType = _ref$isReducerKeyMean === void 0 ? false : _ref$isReducerKeyMean,
        _ref$isStrict = _ref.isStrict,
        isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
        _ref$isDebug = _ref.isDebug,
        isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
        _ref$errorHandler = _ref.errorHandler,
        errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler;

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.ccc = ccContext;
    }

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
    bindComputedToCcContext(computed, isModuleMode);

    if (init) {
      var computedStore = ccContext.store._state;
      executeInitializer(isModuleMode, computedStore, init);
    }

    ccContext.isCcAlreadyStartup = true;
    ccContext.errorHandler = errorHandler;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  var printWarning = function() {};

  {
    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};

    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );

          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  var checkPropTypes_1 = checkPropTypes;

  var react_development = createCommonjsModule(function (module) {



  {
    (function() {

  var _assign = objectAssign;
  var checkPropTypes = checkPropTypes_1;

  // TODO: this is special because it gets imported during build.

  var ReactVersion = '16.6.3';

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;

  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }
    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }
    return null;
  }

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var validateFormat = function () {};

  {
    validateFormat = function (format) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    };
  }

  function invariant(condition, format, a, b, c, d, e, f) {
    validateFormat(format);

    if (!condition) {
      var error = void 0;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }

  // Relying on the `invariant()` implementation lets us
  // preserve the format and params in the www builds.

  /**
   * Forked from fbjs/warning:
   * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
   *
   * Only change is we use console.warn instead of console.error,
   * and do nothing when 'console' is not supported.
   * This really simplifies the code.
   * ---
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var lowPriorityWarning = function () {};

  {
    var printWarning = function (format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.warn(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    lowPriorityWarning = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  }

  var lowPriorityWarning$1 = lowPriorityWarning;

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warningWithoutStack = function () {};

  {
    warningWithoutStack = function (condition, format) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (args.length > 8) {
        // Check before the condition to catch violations early.
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }
      if (condition) {
        return;
      }
      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format);

        // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {}
    };
  }

  var warningWithoutStack$1 = warningWithoutStack;

  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + '.' + callerName;
      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }

  /**
   * This is the abstract API for an update queue.
   */
  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }

  /**
   * Base class helpers for the updating state of a component.
   */
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};

  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  Component.prototype.setState = function (partialState, callback) {
    !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };

  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */
  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };
    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}
  ComponentDummy.prototype = Component.prototype;

  /**
   * Convenience component with default shallow equality check for sCU.
   */
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  // Avoid an extra prototype jump for these methods.
  _assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value
  function createRef() {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null,
    currentDispatcher: null
  };

  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

  var describeComponentFrame = function (name, source, ownerName) {
    var sourceInfo = '';
    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, '');
      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          if (match) {
            var pathBeforeSlash = match[1];
            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
              fileName = folderName + '/' + fileName;
            }
          }
        }
      }
      sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
    } else if (ownerName) {
      sourceInfo = ' (created by ' + ownerName + ')';
    }
    return '\n    in ' + (name || 'Unknown') + sourceInfo;
  };

  var Resolved = 1;


  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }
    {
      if (typeof type.tag === 'number') {
        warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }
    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }
    if (typeof type === 'string') {
      return type;
    }
    switch (type) {
      case REACT_CONCURRENT_MODE_TYPE:
        return 'ConcurrentMode';
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';
      case REACT_PORTAL_TYPE:
        return 'Portal';
      case REACT_PROFILER_TYPE:
        return 'Profiler';
      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';
      case REACT_SUSPENSE_TYPE:
        return 'Suspense';
    }
    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';
        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);
            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }
          }
      }
    }
    return null;
  }

  var ReactDebugCurrentFrame = {};

  var currentlyValidatingElement = null;

  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer.
    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = '';

      // Add an extra top frame while an element is being validated
      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      }

      // Delegate to the injected renderer-specific implementation
      var impl = ReactDebugCurrentFrame.getCurrentStack;
      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  var ReactSharedInternals = {
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  };

  {
    _assign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = warningWithoutStack$1;

  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();
      // eslint-disable-next-line react-internal/warning-and-invariant-args

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
    };
  }

  var warning$1 = warning;

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown = void 0;
  var specialPropRefWarningShown = void 0;

  function hasValidRef(config) {
    {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, no instanceof check
   * will work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} key
   * @param {string|object} ref
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @param {*} owner
   * @param {*} props
   * @internal
   */
  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {};

      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };

  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */
  function createElement(type, config, children) {
    var propName = void 0;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;
      // Remaining properties are added to a new props object
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * See https://reactjs.org/docs/react-api.html#createfactory
   */


  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  }

  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */
  function cloneElement(element, config, children) {
    !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

    var propName = void 0;

    // Original props are copied
    var props = _assign({}, element.props);

    // Reserved names are extracted
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      // Remaining properties override existing props
      var defaultProps = void 0;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }

  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */
  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';

  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */
  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });

    return '$' + escapedString;
  }

  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;

  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];
  function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }

  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;
    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }

  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;
        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }

    if (invokeCallback) {
      callback(traverseContext, children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child = void 0;
    var nextName = void 0;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (typeof iteratorFn === 'function') {
        {
          // Warn about using Maps as children
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(children);
        var step = void 0;
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === 'object') {
        var addendum = '';
        {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = '' + children;
        invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
      }
    }

    return subtreeCount;
  }

  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }

  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */
  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof component === 'object' && component !== null && component.key != null) {
      // Explicit key
      return escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func,
        context = bookKeeping.context;

    func.call(context, child, bookKeeping.count++);
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;


    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }
      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = '';
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }
    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }

  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */
  function countChildren(children) {
    return traverseAllChildren(children, function () {
      return null;
    }, null);
  }

  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */
  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }

  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */
  function onlyChild(children) {
    !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
    return children;
  }

  function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };

    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };

    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      };
      // $FlowFixMe: Flow complains about not setting a value, which is intentional here
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }
            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }
            return context.Consumer;
          }
        }
      });
      // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  function lazy(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        !(
        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
      }
    }

    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };
  }

  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' ||
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  var propTypesMisspellWarningShown = void 0;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);
      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }
    return '';
  }

  function getSourceInfoErrorAddendum(elementProps) {
    if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
      var source = elementProps.__source;
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }
    return '';
  }

  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = '\n\nCheck the top-level render call using <' + parentName + '>.';
      }
    }
    return info;
  }

  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;

    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

    // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner = '';
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
    }

    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }

  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */
  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step = void 0;
          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }

  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */
  function validatePropTypes(element) {
    var type = element.type;
    var name = void 0,
        propTypes = void 0;
    if (typeof type === 'function') {
      // Class or function component
      name = type.displayName || type.name;
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && type !== null && type.$$typeof === REACT_FORWARD_REF_TYPE) {
      // ForwardRef
      var functionName = type.render.displayName || type.render.name || '';
      name = type.displayName || (functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef');
      propTypes = type.propTypes;
    } else {
      return;
    }
    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }
    if (typeof type.getDefaultProps === 'function') {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }

  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */
  function validateFragmentProps(fragment) {
    setCurrentlyValidatingElement(fragment);

    var keys = Object.keys(fragment.props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key !== 'children' && key !== 'key') {
        warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
        break;
      }
    }

    if (fragment.ref !== null) {
      warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }

  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type);

    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString = void 0;
      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }

  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;
    // Legacy hook: remove it
    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }

  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

  var React = {
    Children: {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray: toArray,
      only: onlyChild
    },

    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent,

    createContext: createContext,
    forwardRef: forwardRef,
    lazy: lazy,
    memo: memo,

    Fragment: REACT_FRAGMENT_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,

    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement,

    version: ReactVersion,

    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
  };

  {
    React.unstable_ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    React.unstable_Profiler = REACT_PROFILER_TYPE;
  }



  var React$2 = Object.freeze({
  	default: React
  });

  var React$3 = ( React$2 && React ) || React$2;

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var react = React$3.default || React$3;

  module.exports = react;
    })();
  }
  });

  var react = createCommonjsModule(function (module) {

  {
    module.exports = react_development;
  }
  });

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

  var extractStateByKeys$1 = extractStateByKeys,
      getAndStoreValidGlobalState$1 = getAndStoreValidGlobalState;
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
      ccStoreSetState$1 = _ccContext$store.setState,
      setStateByModuleAndKey$1 = _ccContext$store.setStateByModuleAndKey,
      _reducer$1 = ccContext.reducer._reducer,
      refStore = ccContext.refStore,
      globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_,
      _computedValue = ccContext.computed._computedValue,
      event_handlers_ = ccContext.event_handlers_,
      handlerKey_handler_ = ccContext.handlerKey_handler_,
      ccUniqueKey_handlerKeys_ = ccContext.ccUniqueKey_handlerKeys_,
      propModuleName_ccClassKeys_ = ccContext.propModuleName_ccClassKeys_,
      moduleName_sharedStateKeys_ = ccContext.moduleName_sharedStateKeys_,
      moduleName_globalStateKeys_ = ccContext.moduleName_globalStateKeys_,
      ccKey_ref_ = ccContext.ccKey_ref_,
      ccKey_option_ = ccContext.ccKey_option_,
      globalCcClassKeys = ccContext.globalCcClassKeys,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
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

  function handleError(err, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (throwError) throw err;else {
      handleCcFnError(err);
    }
  }

  function checkStoreModule(module, checkGlobalModule, throwError) {
    if (checkGlobalModule === void 0) {
      checkGlobalModule = true;
    }

    if (throwError === void 0) {
      throwError = true;
    }

    if (!ccContext.isModuleMode) {
      if (module !== MODULE_DEFAULT) {
        handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi$1("module:" + module)), throwError);
        return false;
      } else return true;
    } else {
      if (checkGlobalModule && module === MODULE_GLOBAL) {
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
    var handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];

    if (handlerKeys) {
      handlerKeys.forEach(function (hKey) {
        delete handlerKey_handler_[hKey]; // ccUniqueKey maybe generated randomly, so delete the key instead of set null
        // handlerKey_handler_[hKey] = null;
      });
    }
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

    if (checkStoreModule(inputModule, false, false)) {
      if (inputModule != currentModule) {
        if (reactCallback) {
          justWarning$1(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$1(paramCallBackShouldNotSupply(inputModule, currentModule))));
          targetCb = null; //let user's reactCallback has no change to be triggered
        }
      }

      cb(null, targetCb);
    } else {
      cb(new Error("inputModule:" + inputModule + " invalid"), null);
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

  function getSharedKeysAndGlobalKeys(module, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
    var sharedStateKeys = inputSharedStateKeys,
        globalStateKeys = inputGlobalStateKeys;

    if (inputSharedStateKeys === '*') {
      sharedStateKeys = Object.keys(getState(module));
    }

    if (inputGlobalStateKeys === '*') {
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
    if (!window.cc || ccContext.isCcAlreadyStartup !== true) {
      throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
    }
  }

  function extractStateToBeBroadcasted(refModule, sourceState, sharedStateKeys, globalStateKeys) {
    var _extractStateByKeys = extractStateByKeys$1(sourceState, sharedStateKeys),
        partialSharedState = _extractStateByKeys.partialState,
        isPartialSharedStateEmpty = _extractStateByKeys.isStateEmpty;

    var _extractStateByKeys2 = extractStateByKeys$1(sourceState, globalStateKeys),
        partialGlobalState = _extractStateByKeys2.partialState,
        isPartialGlobalStateEmpty = _extractStateByKeys2.isStateEmpty; //  any stateValue's key if it is a global key (a normal global key , or a global key mapped from a state key)
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

        if (toModules) {
          toModules.forEach(function (m) {
            if (m != refModule) {
              // current ref's module global state has been extracted into partialGlobalState above, so here exclude it
              var modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
              modulePartialGlobalState[stateKey] = stateValue;
            }
          });
        }
      }
    }); //  see if sourceState includes sharedStateKey which are mapped to globalStateKey

    sharedStateKeys.forEach(function (sKey) {
      var stateValue = sourceState[sKey];

      if (stateValue !== undefined) {
        var descriptor = sharedKey_globalMappingKeyDescriptor_[sKey];

        if (descriptor) {
          var globalMappingKey = descriptor.globalMappingKey;
          var toModules = globalMappingKey_toModules_[globalMappingKey]; //  !!!set this state to globalState, let other module that watching this globalMappingKey
          //  can recover it correctly while they are mounted again!

          setStateByModuleAndKey$1(MODULE_GLOBAL, globalMappingKey, stateValue);

          if (toModules) {
            toModules.forEach(function (m) {
              if (m != refModule) {
                // current ref's module global state has been extracted into partialGlobalState above, so here exclude it
                var modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
                modulePartialGlobalState[globalMappingKey] = stateValue;
              }
            });
          }
        }
      }
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
  }

  function _throwPropDuplicateError(prefixedKey, module) {
    throw me("cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error", vbi$1("the prefixedKey is " + prefixedKey + ", module is:" + module));
  }

  function _getPropKeyPair(isPropStateModuleMode, module, propKey) {
    if (isPropStateModuleMode === true) {
      return {
        moduledPropKey: module + "/" + propKey,
        originalPropKey: propKey
      };
    } else {
      return {
        moduledPropKey: propKey,
        originalPropKey: propKey
      };
    }
  }

  function _getStateKeyPair(isPropStateModuleMode, module, stateKey) {
    if (isPropStateModuleMode === true) {
      return {
        moduledStateKey: module + "/" + stateKey,
        originalStateKey: stateKey
      };
    } else {
      return {
        moduledStateKey: stateKey,
        originalStateKey: stateKey
      };
    }
  }

  function _setPropState(propState, propKey, propValue, isPropStateModuleMode, module) {
    if (isPropStateModuleMode) {
      var modulePropState = util.safeGetObjectFromObject(propState, module);
      modulePropState[propKey] = propValue;
    } else {
      propState[propKey] = propValue;
    }
  } //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


  function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
    var contextMap = ccContext.ccClassKey_ccClassContext_;

    if (contextMap[ccClassKey] !== undefined) {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    } else {
      var ccClassContext = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys);

      if (stateToPropMapping != undefined) {
        var propKey_stateKeyDescriptor_ = ccClassContext.propKey_stateKeyDescriptor_;
        var stateKey_propKeyDescriptor_ = ccClassContext.stateKey_propKeyDescriptor_;
        var propState = ccClassContext.propState;

        if (typeof stateToPropMapping !== 'object') {
          throw me(ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey);
        }

        var module_mapAllStateToProp_ = {};
        var module_staredKey_ = {};
        var module_prefixedKeys_ = {};
        var prefixedKeys = Object.keys(stateToPropMapping);
        var len = prefixedKeys.length;

        for (var i = 0; i < len; i++) {
          var prefixedKey = prefixedKeys[i];

          if (!util.isPrefixedKeyValid(prefixedKey)) {
            throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey + ", key:" + prefixedKey);
          }

          var _prefixedKey$split = prefixedKey.split('/'),
              targetModule = _prefixedKey$split[0],
              targetKey = _prefixedKey$split[1];

          if (module_mapAllStateToProp_[targetModule] === true) ; else {
            if (targetKey === '*') {
              module_mapAllStateToProp_[targetModule] = true;
              module_staredKey_[targetModule] = prefixedKey;
            } else {
              var modulePrefixedKeys = util.safeGetArrayFromObject(module_prefixedKeys_, targetModule);
              modulePrefixedKeys.push(prefixedKey);
              module_mapAllStateToProp_[targetModule] = false;
            }
          }
        }

        var targetModules = Object.keys(module_mapAllStateToProp_);
        var propKey_appeared_ = {}; //help cc to judge propKey is duplicated or not

        targetModules.forEach(function (module) {
          var moduleState = _state[module];

          if (moduleState === undefined) {
            throw me(ERR.CC_MODULE_NOT_FOUND, vbi$1("module:" + module + ", check your stateToPropMapping config!"));
          }

          var isPropStateSet = false;

          if (module_mapAllStateToProp_[module] === true) {
            var moduleStateKeys = Object.keys(moduleState);
            moduleStateKeys.forEach(function (msKey) {
              // now prop key equal state key if user declare key like m1/* in stateToPropMapping;
              var _getPropKeyPair2 = _getPropKeyPair(isPropStateModuleMode, module, msKey),
                  moduledPropKey = _getPropKeyPair2.moduledPropKey,
                  originalPropKey = _getPropKeyPair2.originalPropKey;

              var appeared = propKey_appeared_[moduledPropKey];

              if (appeared === true) {
                _throwPropDuplicateError(module_staredKey_[module], module);
              } else {
                propKey_appeared_[moduledPropKey] = true; // moduledPropKey and moduledStateKey is equal

                propKey_stateKeyDescriptor_[moduledPropKey] = {
                  module: module,
                  originalStateKey: msKey,
                  moduledStateKey: moduledPropKey
                };
                stateKey_propKeyDescriptor_[moduledPropKey] = {
                  module: module,
                  moduledPropKey: moduledPropKey,
                  originalPropKey: originalPropKey
                };

                _setPropState(propState, msKey, moduleState[msKey], isPropStateModuleMode, module);

                isPropStateSet = true;
              }
            });
          } else {
            var _prefixedKeys = module_prefixedKeys_[module];

            _prefixedKeys.forEach(function (prefixedKey) {
              var _prefixedKey$split2 = prefixedKey.split('/'),
                  stateModule = _prefixedKey$split2[0],
                  stateKey = _prefixedKey$split2[1];

              var propKey = stateToPropMapping[prefixedKey];

              var _getPropKeyPair3 = _getPropKeyPair(isPropStateModuleMode, module, propKey),
                  moduledPropKey = _getPropKeyPair3.moduledPropKey,
                  originalPropKey = _getPropKeyPair3.originalPropKey;

              var appeared = propKey_appeared_[moduledPropKey];

              if (appeared === true) {
                _throwPropDuplicateError(prefixedKey, module);
              } else {
                propKey_appeared_[moduledPropKey] = true;

                var _getStateKeyPair2 = _getStateKeyPair(isPropStateModuleMode, module, stateKey),
                    moduledStateKey = _getStateKeyPair2.moduledStateKey;

                propKey_stateKeyDescriptor_[moduledPropKey] = {
                  module: stateModule,
                  originalStateKey: stateKey,
                  moduledStateKey: moduledStateKey
                };
                stateKey_propKeyDescriptor_[moduledStateKey] = {
                  module: stateModule,
                  moduledPropKey: moduledPropKey,
                  originalPropKey: originalPropKey
                };

                _setPropState(propState, propKey, moduleState[stateKey], isPropStateModuleMode, module);

                isPropStateSet = true;
              }
            });
          }

          if (isPropStateSet === true) {
            var pCcClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
            if (!pCcClassKeys.includes(ccClassKey)) pCcClassKeys.push(ccClassKey);
          }
        });
        ccClassContext.stateToPropMapping = stateToPropMapping;
        ccClassContext.isPropStateModuleMode = isPropStateModuleMode;
      }

      contextMap[ccClassKey] = ccClassContext;
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
      // user may declare module but no any class register to the module,
      // and a cc class define stateToPropMapping to watch this module's state change,
      // then moduleName_globalStateKeys_[moduleName] will be undefined
      globalStateKeys = moduleName_globalStateKeys_[moduleName] || [];
      sharedStateKeys = moduleName_sharedStateKeys_[moduleName] || [];
    } else {
      throw new Error("stateFor is not set correctly! "); // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
    }

    return {
      globalStateKeys: globalStateKeys,
      sharedStateKeys: sharedStateKeys
    };
  }

  function _throwForExtendInputClassAsFalseCheck(ccClassKey) {
    throw me("cc found that you set sharedStateKeys\u3001globalStateKeys or storedStateKeys, but you set extendInputClass as false at the same time\n    while you register a ccClass:" + ccClassKey + ", this is not allowed, extendInputClass=false means cc will give you\n    a props proxy component, in this situation, cc is unable to take over your component state, so set sharedStateKeys or globalStateKeys\n    is strictly prohibited, but you can still set stateToPropMapping to let cc control your component render timing!\n  ");
  }

  function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
    if (extendInputClass === false) {
      if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
        _throwForExtendInputClassAsFalseCheck(ccClassKey);
      }
    }

    var _getSharedKeysAndGlob = getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys),
        targetSharedStateKeys = _getSharedKeysAndGlob.sharedStateKeys,
        targetGlobalStateKeys = _getSharedKeysAndGlob.globalStateKeys;

    mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, targetSharedStateKeys, targetGlobalStateKeys, stateToPropMapping, isPropStateModuleMode);
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

  function computeValueForRef(computed, refComputed, state) {
    if (computed) {
      var toBeComputed = computed();
      var toBeComputedKeys = Object.keys(toBeComputed);
      toBeComputedKeys.forEach(function (key) {
        var fn = toBeComputed[key];
        var originalValue = state[key];

        if (originalValue !== undefined) {
          var computedValue = fn(originalValue, state);
          refComputed[key] = computedValue;
        }
      });
    }
  }

  function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
    var handlers = util.safeGetArrayFromObject(event_handlers_, event);

    if (typeof handler !== 'function') {
      return justWarning$1("event " + event + "'s handler is not a function!");
    }

    var targetHandler = handlers.find(function (v) {
      return v.ccKey === ccUniqueKey && v.identity === identity;
    });
    var handlerKeys = util.safeGetArrayFromObject(ccUniqueKey_handlerKeys_, ccUniqueKey);
    var handlerKey = makeHandlerKey(ccUniqueKey, event); //  that means the component of ccUniqueKey mounted again 
    //  or user call $$on for a same event in a same instance more than once

    if (targetHandler) {
      //  cc will alway use the latest handler
      targetHandler.handler = handlerKey;
    } else {
      handlers.push({
        module: module,
        ccClassKey: ccClassKey,
        ccKey: ccUniqueKey,
        identity: identity,
        handlerKey: handlerKey
      });
      handlerKeys.push(handlerKey);
    }

    handlerKey_handler_[handlerKey] = handler;
  }

  function _findEventHandlers(event, module, ccClassKey, identity) {
    var handlers = event_handlers_[event];

    if (handlers) {
      var filteredHandlers = [];
      if (module) filteredHandlers = handlers.filter(function (v) {
        return v.module === module;
      });
      if (ccClassKey) filteredHandlers = handlers.filter(function (v) {
        return v.ccClassKey === ccClassKey;
      }); // identity is null means user call emit or emitIdentity which set identity as null
      // identity is not null means user call emitIdentity

      filteredHandlers = handlers.filter(function (v) {
        return v.identity === identity;
      });
      return filteredHandlers;
    } else {
      return [];
    }
  }

  function findEventHandlersToPerform(event, _ref) {
    var module = _ref.module,
        ccClassKey = _ref.ccClassKey,
        identity = _ref.identity;

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var handlers = _findEventHandlers(event, module, ccClassKey, identity);

    handlers.forEach(function (_ref2) {
      var ccKey = _ref2.ccKey,
          handlerKey = _ref2.handlerKey;

      if (ccKey_ref_[ccKey] && handlerKey) {
        //  confirm the instance is mounted and handler is not been offed
        var handlerFn = handlerKey_handler_[handlerKey];
        if (handlerFn) handlerFn.apply(void 0, args);
      }
    });
  }

  function findEventHandlersToOff(event, _ref3) {
    var module = _ref3.module,
        ccClassKey = _ref3.ccClassKey,
        identity = _ref3.identity;

    var handlers = _findEventHandlers(event, module, ccClassKey, identity);

    handlers.forEach(function (item) {
      handlerKey_handler_[item.handler] = null;
      item.handler = null;
    });
  }

  function updateModulePropState(module_isPropStateChanged, changedPropStateList, targetClassContext, state, stateModuleName) {
    var stateToPropMapping = targetClassContext.stateToPropMapping,
        stateKey_propKeyDescriptor_ = targetClassContext.stateKey_propKeyDescriptor_,
        propState = targetClassContext.propState,
        isPropStateModuleMode = targetClassContext.isPropStateModuleMode;

    if (stateToPropMapping) {
      Object.keys(state).forEach(function (sKey) {
        // use input stateModuleName to compute moduledStateKey for current stateKey
        // to see if the propState should be updated
        var _getStateKeyPair3 = _getStateKeyPair(isPropStateModuleMode, stateModuleName, sKey),
            moduledStateKey = _getStateKeyPair3.moduledStateKey;

        var moduledPropKeyDescriptor = stateKey_propKeyDescriptor_[moduledStateKey];

        if (moduledPropKeyDescriptor) {
          var originalPropKey = moduledPropKeyDescriptor.originalPropKey;

          if (module_isPropStateChanged[stateModuleName] !== true) {
            //mark propState changed
            module_isPropStateChanged[stateModuleName] = true;
            changedPropStateList.push(propState); // push this ref to changedPropStateList
          }

          var stateValue = state[sKey];

          _setPropState(propState, originalPropKey, stateValue, isPropStateModuleMode, stateModuleName);

          setStateByModuleAndKey$1(stateModuleName, sKey, stateValue);
        }
      });
    }
  }

  function broadcastPropState(module, commitState) {
    var changedPropStateList = [];
    var module_isPropStateChanged = {}; // record which module's propState has been changed
    // if no any react class registered to module, here will get undefined, so use safeGetArrayFromObject

    Object.keys(moduleName_ccClassKeys_).forEach(function (moduleName) {
      var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
      ccClassKeys.forEach(function (ccClassKey) {
        var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
        updateModulePropState(module_isPropStateChanged, changedPropStateList, ccClassContext, commitState, module);
      });
    });
    Object.keys(module_isPropStateChanged).forEach(function (module) {
      //  this module has stateToPropMapping and propState has been changed!!!
      var ccClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
      ccClassKeys.forEach(function (ccClassKey) {
        var classContext = ccClassKey_ccClassContext_[ccClassKey];
        var ccKeys = classContext.ccKeys;
        ccKeys.forEach(function (ccKey) {
          var ref = ccKey_ref_[ccKey];

          if (ref) {
            ref.cc.reactForceUpdate();
          }
        });
      });
    });
  }

  function _promiseErrorHandler(resolve, reject) {
    return function (err) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return err ? reject(err) : resolve.apply(void 0, args);
    };
  }

  function _promisifyCcFn(ccFn, userLogicFn, executionContext) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }

    return new Promise(function (resolve, reject) {
      var _executionContext = _extends({}, executionContext, {
        __innerCb: _promiseErrorHandler(resolve, reject)
      });

      ccFn.apply(void 0, [userLogicFn, _executionContext].concat(args));
    });
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$1(err);
        if (ccContext.errorHandler) ccContext.errorHandler(err);
      }
    }
  }
  /*
  options.module = 'xxx'
  options.sharedStateKeys = ['aa', 'bbb']
  */


  function register(ccClassKey, _temp) {
    var _ref4 = _temp === void 0 ? {} : _temp,
        _ref4$extendInputClas = _ref4.extendInputClass,
        extendInputClass = _ref4$extendInputClas === void 0 ? true : _ref4$extendInputClas,
        _ref4$isSingle = _ref4.isSingle,
        isSingle = _ref4$isSingle === void 0 ? false : _ref4$isSingle,
        _ref4$asyncLifecycleH = _ref4.asyncLifecycleHook,
        asyncLifecycleHook = _ref4$asyncLifecycleH === void 0 ? true : _ref4$asyncLifecycleH,
        _ref4$module = _ref4.module,
        module = _ref4$module === void 0 ? MODULE_DEFAULT : _ref4$module,
        reducerModule = _ref4.reducerModule,
        _ref4$sharedStateKeys = _ref4.sharedStateKeys,
        inputSharedStateKeys = _ref4$sharedStateKeys === void 0 ? [] : _ref4$sharedStateKeys,
        _ref4$globalStateKeys = _ref4.globalStateKeys,
        inputGlobalStateKeys = _ref4$globalStateKeys === void 0 ? [] : _ref4$globalStateKeys,
        stateToPropMapping = _ref4.stateToPropMapping,
        _ref4$isPropStateModu = _ref4.isPropStateModuleMode,
        isPropStateModuleMode = _ref4$isPropStateModu === void 0 ? false : _ref4$isPropStateModu;

    checkCcStartupOrNot();
    var _curStateModule = module;
    var _asyncLifecycleHook = asyncLifecycleHook;

    var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


    checkStoreModule(_curStateModule);
    checkReducerModule(_reducerModule);

    var _mapModuleAssociateDa = mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, stateToPropMapping, isPropStateModuleMode),
        sKeys = _mapModuleAssociateDa.sharedStateKeys,
        gKeys = _mapModuleAssociateDa.globalStateKeys;

    var sharedStateKeys = sKeys,
        globalStateKeys = gKeys;
    return function (ReactClass) {
      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi$1("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
      }

      var TargetClass = extendInputClass ? ReactClass : react.Component;

      var CcClass =
      /*#__PURE__*/
      function (_TargetClass) {
        _inheritsLoose(CcClass, _TargetClass);

        function CcClass(props, context) {
          var _this;

          _this = _TargetClass.call(this, props, context) || this;
          if (!_this.state) _this.state = {};
          var ccKey = props.ccKey,
              _props$ccOption = props.ccOption,
              ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
          util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState', '__$$getDispatchHandler', '$$domDispatch']);
          if (!ccOption.storedStateKeys) ccOption.storedStateKeys = []; // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing

          if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

          if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
          if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
          var asyncLifecycleHook = ccOption.asyncLifecycleHook,
              storedStateKeys = ccOption.storedStateKeys;

          var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
              ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
              isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

          var ccClassContext = _this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

          _this.__$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys); // bind propState to $$propState


          _this.$$propState = ccClassKey_ccClassContext_[ccClassKey].propState || {};

          _this.__$$recoverState(ccClassKey);

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
            var _extractStateByKeys3 = extractStateByKeys$1(sharedState, sharedStateKeys),
                partialState = _extractStateByKeys3.partialState;

            partialSharedState = partialState;
          }

          if (syncGlobalState) {
            var _extractStateByKeys4 = extractStateByKeys$1(globalState, globalStateKeys),
                _partialState2 = _extractStateByKeys4.partialState;

            partialGlobalState = _partialState2;
          }

          var selfState = this.state;

          var entireState = _extends({}, selfState, refState, partialSharedState, partialGlobalState);

          this.state = entireState;
          computeValueForRef(this.$$computed, this.$$refComputed, entireState);
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
          var _this2 = this,
              _this$cc;

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

          this.cc = (_this$cc = {
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
            setState: function setState$$1(state, cb) {
              _this2.$$changeState(state, {
                module: currentModule,
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                cb: cb
              });
            },
            setGlobalState: function setGlobalState$$1(partialGlobalState, broadcastTriggeredBy) {
              if (broadcastTriggeredBy === void 0) {
                broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
              }

              _this2.$$changeState(partialGlobalState, {
                module: MODULE_GLOBAL,
                broadcastTriggeredBy: broadcastTriggeredBy
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

              for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                args[_key4 - 1] = arguments[_key4];
              }

              return (_this2$cc = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            // change other module's state, mostly you should use this method to generate new state instead of xeffect,
            // because xeffect will force your logicFn to put your first param as ExecutionContext
            effect: function effect(targetModule, userLogicFn) {
              var _this2$cc2;

              for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                args[_key5 - 2] = arguments[_key5];
              }

              return (_this2$cc2 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc2, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                context: false,
                module: targetModule
              }].concat(args));
            },
            // change other module's state, cc will give userLogicFn EffectContext object as first param
            xeffect: function xeffect(targetModule, userLogicFn) {
              var _this2$cc3;

              for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                args[_key6 - 2] = arguments[_key6];
              }

              return (_this2$cc3 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc3, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                xeffect: _this2.cc.xeffect,
                moduleState: getState(targetModule),
                state: _this2.state,
                context: true,
                module: targetModule
              }].concat(args));
            },
            __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext) {
              for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                args[_key7 - 2] = arguments[_key7];
              }

              return _promisifyCcFn.apply(void 0, [_this2.cc.__invokeWith, userLogicFn, executionContext].concat(args));
            },
            // advanced invoke, can change other module state, but user should put module to option
            // and user can decide userLogicFn's first param is ExecutionContext by set context = true
            invokeWith: function invokeWith(userLogicFn, option) {
              var _this2$cc4;

              var _option$module = option.module,
                  module = _option$module === void 0 ? currentModule : _option$module,
                  _option$context = option.context,
                  context = _option$context === void 0 ? false : _option$context,
                  _option$forceSync = option.forceSync,
                  forceSync = _option$forceSync === void 0 ? false : _option$forceSync,
                  cb = option.cb;

              for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                args[_key8 - 2] = arguments[_key8];
              }

              return (_this2$cc4 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc4, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                moduleState: getState(module),
                state: _this2.state,
                context: context,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __invokeWith: function __invokeWith(userLogicFn, executionContext) {
              for (var _len9 = arguments.length, args = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
                args[_key9 - 2] = arguments[_key9];
              }

              var stateFor = executionContext.stateFor,
                  _executionContext$mod = executionContext.module,
                  targetModule = _executionContext$mod === void 0 ? currentModule : _executionContext$mod,
                  _executionContext$con = executionContext.context,
                  context = _executionContext$con === void 0 ? false : _executionContext$con,
                  _executionContext$for = executionContext.forceSync,
                  forceSync = _executionContext$for === void 0 ? false : _executionContext$for,
                  cb = executionContext.cb,
                  __innerCb = executionContext.__innerCb;
              isStateModuleValid(targetModule, currentModule, cb, function (err, newCb) {
                if (err) return handleCcFnError(err, __innerCb);
                if (context) args.unshift(executionContext);
                var _partialState = null;
                co_1.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
                  _partialState = partialState;

                  _this2.$$changeState(partialState, {
                    stateFor: stateFor,
                    module: targetModule,
                    forceSync: forceSync,
                    cb: newCb
                  });
                }).then(function () {
                  if (__innerCb) __innerCb(null, _partialState);
                }).catch(function (err) {
                  handleCcFnError(err, __innerCb);
                });
              });
            },
            call: function call(userLogicFn) {
              var _this2$cc5;

              for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
                args[_key10 - 1] = arguments[_key10];
              }

              return (_this2$cc5 = _this2.cc).__promisifiedCallWith.apply(_this2$cc5, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            callWith: function callWith(userLogicFn, _temp2) {
              var _this2$cc6;

              var _ref5 = _temp2 === void 0 ? {} : _temp2,
                  _ref5$module = _ref5.module,
                  module = _ref5$module === void 0 ? currentModule : _ref5$module,
                  _ref5$forceSync = _ref5.forceSync,
                  forceSync = _ref5$forceSync === void 0 ? false : _ref5$forceSync,
                  cb = _ref5.cb;

              for (var _len11 = arguments.length, args = new Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) {
                args[_key11 - 2] = arguments[_key11];
              }

              return (_this2$cc6 = _this2.cc).__promisifiedCallWith.apply(_this2$cc6, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __promisifiedCallWith: function __promisifiedCallWith(userLogicFn, executionContext) {
              for (var _len12 = arguments.length, args = new Array(_len12 > 2 ? _len12 - 2 : 0), _key12 = 2; _key12 < _len12; _key12++) {
                args[_key12 - 2] = arguments[_key12];
              }

              return _promisifyCcFn.apply(void 0, [_this2.cc.__callWith, userLogicFn, executionContext].concat(args));
            },
            __callWith: function __callWith(userLogicFn, _temp3) {
              var _ref6 = _temp3 === void 0 ? {} : _temp3,
                  stateFor = _ref6.stateFor,
                  _ref6$module = _ref6.module,
                  module = _ref6$module === void 0 ? currentModule : _ref6$module,
                  _ref6$forceSync = _ref6.forceSync,
                  forceSync = _ref6$forceSync === void 0 ? false : _ref6$forceSync,
                  cb = _ref6.cb,
                  __innerCb = _ref6.__innerCb;

              for (var _len13 = arguments.length, args = new Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
                args[_key13 - 2] = arguments[_key13];
              }

              isStateModuleValid(module, currentModule, cb, function (err, newCb) {
                if (err) return handleCcFnError(err, __innerCb);

                try {
                  userLogicFn.call.apply(userLogicFn, [_this2, _this2.__$$getChangeStateHandler({
                    stateFor: stateFor,
                    module: module,
                    forceSync: forceSync,
                    cb: newCb
                  })].concat(args));
                } catch (err) {
                  handleCcFnError(err, __innerCb);
                }
              });
            },
            callThunk: function callThunk(userLogicFn) {
              var _this2$cc7;

              for (var _len14 = arguments.length, args = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
                args[_key14 - 1] = arguments[_key14];
              }

              (_this2$cc7 = _this2.cc).__promisifiedCallThunkWith.apply(_this2$cc7, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            callThunkWith: function callThunkWith(userLogicFn, _temp4) {
              var _this2$cc8;

              var _ref7 = _temp4 === void 0 ? {} : _temp4,
                  _ref7$module = _ref7.module,
                  module = _ref7$module === void 0 ? currentModule : _ref7$module,
                  _ref7$forceSync = _ref7.forceSync,
                  forceSync = _ref7$forceSync === void 0 ? false : _ref7$forceSync,
                  cb = _ref7.cb;

              for (var _len15 = arguments.length, args = new Array(_len15 > 2 ? _len15 - 2 : 0), _key15 = 2; _key15 < _len15; _key15++) {
                args[_key15 - 2] = arguments[_key15];
              }

              (_this2$cc8 = _this2.cc).__promisifiedCallThunkWith.apply(_this2$cc8, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            },
            __promisifiedCallThunkWith: function __promisifiedCallThunkWith(userLogicFn, executionContext) {
              for (var _len16 = arguments.length, args = new Array(_len16 > 2 ? _len16 - 2 : 0), _key16 = 2; _key16 < _len16; _key16++) {
                args[_key16 - 2] = arguments[_key16];
              }

              return _promisifyCcFn.apply(void 0, [_this2.cc.__callThunkWith, userLogicFn, executionContext].concat(args));
            },
            __callThunkWith: function __callThunkWith(userLogicFn, _temp5) {
              var _ref8 = _temp5 === void 0 ? {} : _temp5,
                  stateFor = _ref8.stateFor,
                  _ref8$module = _ref8.module,
                  module = _ref8$module === void 0 ? currentModule : _ref8$module,
                  _ref8$forceSync = _ref8.forceSync,
                  forceSync = _ref8$forceSync === void 0 ? false : _ref8$forceSync,
                  cb = _ref8.cb,
                  __innerCb = _ref8.__innerCb;

              for (var _len17 = arguments.length, args = new Array(_len17 > 2 ? _len17 - 2 : 0), _key17 = 2; _key17 < _len17; _key17++) {
                args[_key17 - 2] = arguments[_key17];
              }

              isStateModuleValid(module, currentModule, cb, function (err, newCb) {
                if (err) return handleCcFnError(err, __innerCb);

                try {
                  userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.__$$getChangeStateHandler({
                    stateFor: stateFor,
                    module: module,
                    forceSync: forceSync,
                    cb: newCb
                  }));
                } catch (err) {
                  handleCcFnError(err, __innerCb);
                }
              });
            },
            commit: function commit(userLogicFn) {
              var _this2$cc9;

              for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
                args[_key18 - 1] = arguments[_key18];
              }

              (_this2$cc9 = _this2.cc).__commitWith.apply(_this2$cc9, [userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule
              }].concat(args));
            },
            commitWith: function commitWith(userLogicFn, _temp6) {
              var _this2$cc10;

              var _ref9 = _temp6 === void 0 ? {} : _temp6,
                  _ref9$module = _ref9.module,
                  module = _ref9$module === void 0 ? currentModule : _ref9$module,
                  _ref9$forceSync = _ref9.forceSync,
                  forceSync = _ref9$forceSync === void 0 ? false : _ref9$forceSync,
                  cb = _ref9.cb;

              for (var _len19 = arguments.length, args = new Array(_len19 > 2 ? _len19 - 2 : 0), _key19 = 2; _key19 < _len19; _key19++) {
                args[_key19 - 2] = arguments[_key19];
              }

              (_this2$cc10 = _this2.cc).__commitWith.apply(_this2$cc10, [userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                module: module,
                forceSync: forceSync,
                cb: cb
              }].concat(args));
            }
          }, _this$cc["__promisifiedCallWith"] = function __promisifiedCallWith(userLogicFn, executionContext) {
            for (var _len20 = arguments.length, args = new Array(_len20 > 2 ? _len20 - 2 : 0), _key20 = 2; _key20 < _len20; _key20++) {
              args[_key20 - 2] = arguments[_key20];
            }

            return _promisifyCcFn.apply(void 0, [_this2.cc.__commitWith, userLogicFn, executionContext].concat(args));
          }, _this$cc.__commitWith = function __commitWith(userLogicFn, _temp7) {
            var _ref10 = _temp7 === void 0 ? {} : _temp7,
                stateFor = _ref10.stateFor,
                _ref10$module = _ref10.module,
                module = _ref10$module === void 0 ? currentModule : _ref10$module,
                _ref10$forceSync = _ref10.forceSync,
                forceSync = _ref10$forceSync === void 0 ? false : _ref10$forceSync,
                cb = _ref10.cb,
                __innerCb = _ref10.__innerCb;

            for (var _len21 = arguments.length, args = new Array(_len21 > 2 ? _len21 - 2 : 0), _key21 = 2; _key21 < _len21; _key21++) {
              args[_key21 - 2] = arguments[_key21];
            }

            isStateModuleValid(module, currentModule, cb, function (err, newCb) {
              if (err) return handleCcFnError(err, __innerCb);

              try {
                var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

                _this2.$$changeState(state, {
                  stateFor: stateFor,
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                });
              } catch (err) {
                handleCcFnError(err, __innerCb);
              }
            });
          }, _this$cc.dispatch = function dispatch(_temp8) {
            var _ref11 = _temp8 === void 0 ? {} : _temp8,
                stateFor = _ref11.stateFor,
                inputModule = _ref11.module,
                inputReducerModule = _ref11.reducerModule,
                _ref11$forceSync = _ref11.forceSync,
                forceSync = _ref11$forceSync === void 0 ? false : _ref11$forceSync,
                type = _ref11.type,
                payload = _ref11.payload,
                reactCallback = _ref11.cb,
                __innerCb = _ref11.__innerCb;

            //if module not defined, targetStateModule will be currentModule
            var targetStateModule = inputModule || currentModule; //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule

            var targetReducerModule = inputReducerModule || targetStateModule;
            var targetReducerMap = _reducer$1[targetReducerModule];

            if (!targetReducerMap) {
              return __innerCb(new Error("no reducerMap found for reducer module:" + targetReducerModule));
            }

            var reducerFn = targetReducerMap[type];

            if (!reducerFn) {
              var fns = Object.keys(targetReducerMap);
              return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + targetReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
            } // const errMsg = util.isCcActionValid({ type, payload });
            // if (errMsg) return justWarning(errMsg);


            var contextDispatch = _this2.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetStateModule, targetReducerModule);

            isStateModuleValid(targetStateModule, currentModule, reactCallback, function (err, newCb) {
              if (err) return __innerCb(err);
              var executionContext = {
                stateFor: stateFor,
                ccUniqueKey: ccUniqueKey,
                ccOption: ccOption,
                module: targetStateModule,
                reducerModule: targetReducerModule,
                type: type,
                dispatch: contextDispatch,
                payload: payload,
                state: _this2.state,
                moduleState: getState(targetStateModule),
                effect: _this2.$$effect,
                xeffect: _this2.$$xeffect,
                forceSync: forceSync,
                cb: newCb,
                context: true,
                __innerCb: __innerCb
              };

              _this2.cc.__invokeWith(reducerFn, executionContext);
            });
          }, _this$cc.prepareReactSetState = function prepareReactSetState(changeBy, state, next, reactCallback) {
            if (storedStateKeys.length > 0) {
              var _extractStateByKeys5 = extractStateByKeys$1(state, storedStateKeys),
                  partialState = _extractStateByKeys5.partialState,
                  isStateEmpty = _extractStateByKeys5.isStateEmpty;

              if (!isStateEmpty) {
                refStore.setState(ccUniqueKey, partialState);
              }
            }

            if (!state) {
              if (next) next();
              return;
            } else {
              computeValueForRef(_this2.$$computed, _this2.$$refComputed, state);
            }

            if (_this2.$$beforeSetState) {
              if (asyncLifecycleHook) {
                _this2.$$beforeSetState({
                  changeBy: changeBy
                });

                _this2.cc.reactSetState(state, reactCallback);

                if (next) next();
              } else {
                // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                // $$beforeSetState(context, next){}
                _this2.$$beforeSetState({
                  changeBy: changeBy
                }, function () {
                  _this2.cc.reactSetState(state, reactCallback);

                  if (next) next();
                });
              }
            } else {
              _this2.cc.reactSetState(state, reactCallback);

              if (next) next();
            }
          }, _this$cc.prepareBroadcastGlobalState = function prepareBroadcastGlobalState(broadcastTriggeredBy, globalState) {
            var _getAndStoreValidGlob = getAndStoreValidGlobalState$1(globalState),
                validGlobalState = _getAndStoreValidGlob.partialState,
                isStateEmpty = _getAndStoreValidGlob.isStateEmpty;

            if (!isStateEmpty) {
              if (_this2.$$beforeBroadcastState) {
                //check if user define a life cycle hook $$beforeBroadcastState
                if (asyncLifecycleHook) {
                  _this2.$$beforeBroadcastState({
                    broadcastTriggeredBy: broadcastTriggeredBy
                  });

                  _this2.cc.broadcastGlobalState(validGlobalState);
                } else {
                  _this2.$$beforeBroadcastState({
                    broadcastTriggeredBy: broadcastTriggeredBy
                  }, function () {
                    _this2.cc.broadcastGlobalState(validGlobalState);
                  });
                }
              } else {
                _this2.cc.broadcastGlobalState(validGlobalState);
              }
            }
          }, _this$cc.prepareBroadcastState = function prepareBroadcastState(stateFor, broadcastTriggeredBy, moduleName, originalState, needClone) {
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

            if (!isPartialSharedStateEmpty) ccStoreSetState$1(moduleName, partialSharedState);
            if (!isPartialGlobalStateEmpty) ccStoreSetState$1(MODULE_GLOBAL, partialGlobalState); // ??? here logic code is redundant, in extractStateToBeBroadcasted, 
            // value of sourceState's stateKey which been mapped to global has been stored to globalState
            // Object.keys(module_globalState_).forEach(moduleName => {
            //   ccStoreSetState(moduleName, module_globalState_[moduleName]);
            // });

            if (_this2.$$beforeBroadcastState) {
              //check if user define a life cycle hook $$beforeBroadcastState
              if (asyncLifecycleHook) {
                _this2.$$beforeBroadcastState({
                  broadcastTriggeredBy: broadcastTriggeredBy
                }, function () {
                  _this2.cc.broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                });
              } else {
                _this2.$$beforeBroadcastState({
                  broadcastTriggeredBy: broadcastTriggeredBy
                });

                _this2.cc.broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
              }
            } else {
              _this2.cc.broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
            }
          }, _this$cc.broadcastState = function broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone) {
            var _partialSharedState = partialSharedState;
            if (needClone) _partialSharedState = util.clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

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

                var _extractStateByKeys6 = extractStateByKeys$1(_partialSharedState, sharedStateKeys),
                    sharedStateForCurrentCcClass = _extractStateByKeys6.partialState,
                    isSharedStateEmpty = _extractStateByKeys6.isStateEmpty; //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                var _extractStateByKeys7 = extractStateByKeys$1(partialGlobalState, globalStateKeys),
                    globalStateForCurrentCcClass = _extractStateByKeys7.partialState,
                    isPartialGlobalStateEmpty = _extractStateByKeys7.isStateEmpty;

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

                  var _extractStateByKeys8 = extractStateByKeys$1(partialGlobalState, globalStateKeys),
                      globalStateForCurrentCcClass = _extractStateByKeys8.partialState,
                      isPartialGlobalStateEmpty = _extractStateByKeys8.isStateEmpty;

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

            broadcastPropState(moduleName, originalState);
          }, _this$cc.broadcastGlobalState = function broadcastGlobalState(globalSate) {
            globalCcClassKeys.forEach(function (ccClassKey) {
              var classContext = ccClassKey_ccClassContext_[ccClassKey];
              var globalStateKeys = classContext.globalStateKeys,
                  ccKeys = classContext.ccKeys;

              var _extractStateByKeys9 = extractStateByKeys$1(globalSate, globalStateKeys),
                  partialState = _extractStateByKeys9.partialState,
                  isStateEmpty = _extractStateByKeys9.isStateEmpty;

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
            broadcastPropState(MODULE_GLOBAL, globalSate);
          }, _this$cc.emit = function emit(event) {
            for (var _len22 = arguments.length, args = new Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
              args[_key22 - 1] = arguments[_key22];
            }

            findEventHandlersToPerform.apply(void 0, [event, {
              identity: null
            }].concat(args));
          }, _this$cc.emitIdentity = function emitIdentity(event, identity) {
            for (var _len23 = arguments.length, args = new Array(_len23 > 2 ? _len23 - 2 : 0), _key23 = 2; _key23 < _len23; _key23++) {
              args[_key23 - 2] = arguments[_key23];
            }

            findEventHandlersToPerform.apply(void 0, [event, {
              identity: identity
            }].concat(args));
          }, _this$cc.emitWith = function emitWith(event, option) {
            for (var _len24 = arguments.length, args = new Array(_len24 > 2 ? _len24 - 2 : 0), _key24 = 2; _key24 < _len24; _key24++) {
              args[_key24 - 2] = arguments[_key24];
            }

            findEventHandlersToPerform.apply(void 0, [event, option].concat(args));
          }, _this$cc.on = function on(event, handler) {
            bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler);
          }, _this$cc.onIdentity = function onIdentity(event, identity, handler) {
            bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler);
          }, _this$cc.off = function off(event, _temp9) {
            var _ref12 = _temp9 === void 0 ? {} : _temp9,
                module = _ref12.module,
                ccClassKey = _ref12.ccClassKey,
                identity = _ref12.identity;

            //  consider if module === currentModule, let off happened?
            findEventHandlersToOff(event, {
              module: module,
              ccClassKey: ccClassKey,
              identity: identity
            });
          }, _this$cc);
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
          this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE);
          this.$$invoke = this.cc.invoke.bind(this); // commit state to cc directly, but userFn can be promise or generator both!

          this.$$invokeWith = this.cc.invokeWith.bind(this);
          this.$$call = this.cc.call.bind(this); // commit state by setState handler

          this.$$callWith = this.cc.callWith.bind(this);
          this.$$callThunk = this.cc.callThunk.bind(this); // commit state by setState handler

          this.$$callThunkWith = this.cc.callThunkWith.bind(this);
          this.$$commit = this.cc.commit.bind(this); // commit state to cc directly, userFn can only be normal function

          this.$$commitWith = this.cc.commitWith.bind(this);
          this.$$effect = this.cc.effect.bind(this); // commit state to cc directly, userFn can be normal 、 generator or async function

          this.$$xeffect = this.cc.xeffect.bind(this);
          this.$$emit = this.cc.emit.bind(this);
          this.$$emitIdentity = this.cc.emitIdentity.bind(this);
          this.$$emitWith = this.cc.emitWith.bind(this);
          this.$$on = this.cc.on.bind(this);
          this.$$onIdentity = this.cc.onIdentity.bind(this);
          this.$$off = this.cc.off.bind(this);
          this.$$refComputed = {};
          this.$$moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = _computedValue[MODULE_GLOBAL] || {};
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


        _proto.$$changeState = function $$changeState(state, _temp10) {
          var _this3 = this;

          var _ref13 = _temp10 === void 0 ? {} : _temp10,
              _ref13$stateFor = _ref13.stateFor,
              stateFor = _ref13$stateFor === void 0 ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref13$stateFor,
              module = _ref13.module,
              broadcastTriggeredBy = _ref13.broadcastTriggeredBy,
              changeBy = _ref13.changeBy,
              forceSync = _ref13.forceSync,
              reactCallback = _ref13.cb;

          //executionContext
          if (state == undefined) return; //do nothing

          if (!isPlainJsonObject(state)) {
            justWarning$1("cc found your commit state is not a plain json object!");
          }

          if (module == MODULE_GLOBAL) {
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

        _proto.__$$getDispatchHandler = function __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload) {
          var _this5 = this;

          return function (paramObj) {
            if (paramObj === void 0) {
              paramObj = {};
            }

            var paramObjType = typeof paramObj;

            var _module = originalComputedStateModule,
                _reducerModule,
                _forceSync = false,
                _type,
                _payload = inputPayload,
                _cb;

            if (paramObjType === 'object') {
              var _paramObj = paramObj,
                  _paramObj$module = _paramObj.module,
                  _module2 = _paramObj$module === void 0 ? originalComputedStateModule : _paramObj$module,
                  _reducerModule2 = _paramObj.reducerModule,
                  _paramObj$forceSync = _paramObj.forceSync,
                  forceSync = _paramObj$forceSync === void 0 ? false : _paramObj$forceSync,
                  _paramObj$type = _paramObj.type,
                  type = _paramObj$type === void 0 ? inputType : _paramObj$type,
                  _paramObj$payload = _paramObj.payload,
                  payload = _paramObj$payload === void 0 ? inputPayload : _paramObj$payload,
                  cb = _paramObj.cb;

              _module = _module2;
              _reducerModule = _reducerModule2;
              _forceSync = forceSync;
              _type = type;
              _payload = payload;
              _cb = cb;
            } else if (paramObjType === 'string') {
              var slashCount = paramObj.split('').filter(function (v) {
                return v === '/';
              }).length;

              if (slashCount === 0) {
                _type = paramObj;
              } else if (slashCount === 1) {
                var _paramObj$split = paramObj.split('/'),
                    _module3 = _paramObj$split[0],
                    _type2 = _paramObj$split[1];

                _module = _module3;
                _type = _type2;
              } else if (slashCount === 2) {
                var _paramObj$split2 = paramObj.split('/'),
                    _module4 = _paramObj$split2[0],
                    _reducerModule3 = _paramObj$split2[1],
                    _type3 = _paramObj$split2[2];

                _module = _module4;
                _reducerModule = _reducerModule3;
                _type = _type3;
              } else {
                return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi$1(paramObj)));
              }
            } else {
              return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
            } // pick user input reducerModule firstly


            var targetReducerModule = _reducerModule || originalComputedReducerModule || module;
            return new Promise(function (resolve, reject) {
              _this5.cc.dispatch({
                stateFor: stateFor,
                module: _module,
                targetReducerModule: targetReducerModule,
                forceSync: _forceSync,
                type: _type,
                payload: _payload,
                cb: _cb,
                __innerCb: _promiseErrorHandler(resolve, reject)
              });
            });
          };
        };

        _proto.$$domDispatch = function $$domDispatch(event) {
          var currentTarget = event.currentTarget;
          var value = currentTarget.value,
              dataset = currentTarget.dataset;
          var type = dataset.cct,
              module = dataset.ccm,
              reducerModule = dataset.ccrm;
          var payload = {
            event: event,
            dataset: dataset,
            value: value
          };

          var handler = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload);

          handler();
        };

        _proto.componentDidUpdate = function componentDidUpdate() {
          if (_TargetClass.prototype.componentDidUpdate) _TargetClass.prototype.componentDidUpdate.call(this);
          if (this.$$afterSetState) this.$$afterSetState();
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          var _this$cc$ccState2 = this.cc.ccState,
              ccUniqueKey = _this$cc$ccState2.ccUniqueKey,
              ccKeys = _this$cc$ccState2.ccClassContext.ccKeys;
          unsetCcInstanceRef(ccKeys, ccUniqueKey); //if father component implement componentWillUnmount，call it again

          if (_TargetClass.prototype.componentWillUnmount) _TargetClass.prototype.componentWillUnmount.call(this);
        };

        _proto.render = function render() {
          if (ccContext.isDebug) {
            console.log(ss$1("@@@ render " + ccClassDisplayName$1(ccClassKey)), cl$1());
          }

          if (extendInputClass) {
            return _TargetClass.prototype.render.call(this);
          } else {
            //now cc class extends ReactClass, call super.render()
            // now cc class extends ReactComponent, render user inputted ReactClass
            return react.createElement(ReactClass, _extends({}, this, this.props));
          }
        };

        return CcClass;
      }(TargetClass);

      CcClass.displayName = ccClassDisplayName$1(ccClassKey);
      return CcClass;
    };
  }

  /****
   * short for register
   * the option's definition is also been changed
   * option.module is called m for short 
   * option.sharedStateKeys is called s for short 
   * option.globalStateKeys is called g for short 
   * option.isSingle is called is for short 
   * option.asyncLifecycleHook is called as for short 
   * option.reducerModule is called re for short 
   * option.extendInputClass is called ex for short 
   */

  function r (ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        module = _ref.m,
        sharedStateKeys = _ref.s,
        globalStateKeys = _ref.g,
        isSingle = _ref.is,
        asyncLifecycleHook = _ref.as,
        reducerModule = _ref.re,
        extendInputClass = _ref.ex;

    return register(ccClassKey, {
      extendInputClass: extendInputClass,
      module: module,
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys,
      isSingle: isSingle,
      asyncLifecycleHook: asyncLifecycleHook,
      reducerModule: reducerModule
    });
  }

  function registerToDefault (ccClassKey, option) {
    if (option === void 0) {
      option = {};
    }

    if (!option.sharedStateKeys) option.sharedStateKeys = '*';
    option.module = MODULE_DEFAULT;
    return register(ccClassKey, option);
  }

  function registerSingleClassToDefault (ccClassKey, option) {
    if (option === void 0) {
      option = {};
    }

    if (!option.sharedStateKeys) option.sharedStateKeys = '*';
    option.module = MODULE_DEFAULT;
    option.isSingle = true;
    return register(ccClassKey, option);
  }

  var ccGlobalStateKeys$1 = ccContext.globalStateKeys;
  /**
   * @description configure module、state、option to cc
   * @author zzk
   * @export
   * @param {String} module
   * @param {Object} state
   * @param {Object} [option] reducer、init、sharedToGlobalMapping
   * @param {Object} [option.reducer]  you can define multi reducer for a module by specify a reducer
   * @param {Object} [option.moduleReducer]  if you specify moduleReducer and reducer at the same time, the reducer will be ignored!
   * cc will give state module name as moduleReducer key
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
        ccGlobalStateKeys$1.push(gKey);
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

  function emit (event) {
    try {
      var ref = pickOneRef();

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      ref.$$emit.apply(ref, [event].concat(args));
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function emitWith (event, option) {
    try {
      var ref = pickOneRef();

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      ref.$$emitWith.apply(ref, [event, option].concat(args));
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function off (event, option) {
    try {
      var ref = pickOneRef();
      ref.$$off(event, option);
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  /**
   * 
   * @param {*} ccClassKey 
   * @param {object} stateToPropMapping { (moduleAndStateKey): (mappedStateKeyInPropState) }
   * @param {object} option 
   * @param {boolean} [option.extendInputClass] default is true
   * @param {boolean} [option.isSingle] default is false
   * @param {boolean} [option.isPropStateModuleMode] 
   * @param {boolean} [option.asyncLifecycleHook] 
   * @param {string} [option.module]
   * @param {Array<string>} [option.sharedStateKeys]
   * @param {Array<string>} [option.globalStateKeys]
   */

  function connect (ccClassKey, stateToPropMapping, option) {
    if (option === void 0) {
      option = {};
    }

    var mergedOption = _extends({}, option, {
      stateToPropMapping: stateToPropMapping
    });

    return register(ccClassKey, mergedOption);
  }

  function dispatch (action, ccClassKey, ccKey, throwError) {
    try {
      if (ccClassKey && ccKey) {
        var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
        } else {
          targetRef.$$dispatch(action);
        }
      } else {
        var ref = pickOneRef();
        ref.$$dispatchForModule(action);
      }
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  var defaultExport = {
    emit: emit,
    emitWith: emitWith,
    off: off,
    connect: connect,
    dispatch: dispatch,
    startup: startup,
    register: register,
    r: r,
    registerToDefault: registerToDefault,
    registerSingleClassToDefault: registerSingleClassToDefault,
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
