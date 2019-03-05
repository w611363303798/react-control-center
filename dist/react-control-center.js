(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@babel/runtime/helpers/esm/extends'), require('@babel/runtime/helpers/esm/inheritsLoose'), require('@babel/runtime/helpers/esm/assertThisInitialized'), require('react')) :
  typeof define === 'function' && define.amd ? define(['@babel/runtime/helpers/esm/extends', '@babel/runtime/helpers/esm/inheritsLoose', '@babel/runtime/helpers/esm/assertThisInitialized', 'react'], factory) :
  (global.ReactControlCenter = factory(global._extends,global._inheritsLoose,global._assertThisInitialized,global.React));
}(this, (function (_extends,_inheritsLoose,_assertThisInitialized,React) { 'use strict';

  _extends = _extends && _extends.hasOwnProperty('default') ? _extends['default'] : _extends;
  _inheritsLoose = _inheritsLoose && _inheritsLoose.hasOwnProperty('default') ? _inheritsLoose['default'] : _inheritsLoose;
  _assertThisInitialized = _assertThisInitialized && _assertThisInitialized.hasOwnProperty('default') ? _assertThisInitialized['default'] : _assertThisInitialized;
  React = React && React.hasOwnProperty('default') ? React['default'] : React;

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
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module. ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the computed keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID] = 'stateToPropMapping is invalid, must be a plain json object, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID] = 'key of stateToPropMapping is invalid, correct one may like $g/m, must and only include one slash, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='*' and globalStateKeys='*'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE] = 'some keys of configured global state have been included in store.globalState', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY] = 'found key is sharedToGlobalMapping key in globalStateKeys, you should delete it ', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE] = 'found key in globalStateKeys is not included in global state, check your globalStateKeys', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);

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
    errorHandler: null,
    middlewares: []
  };

  if (window && !window.sss) {
    window.sss = ccContext.store._state;
  }
  var lsLen = localStorage.length;
  var _refStoreState = ccContext.refStore._state;

  for (var i = 0; i < lsLen; i++) {
    var lsKey = localStorage.key(i);

    if (lsKey.startsWith('CCSS_')) {
      try {
        _refStoreState[lsKey.substr(5)] = JSON.parse(localStorage.getItem(lsKey));
      } catch (err) {
        console.error(err);
      }
    }
  }

  function isHotReloadMode() {
    if (ccContext.isHot) return true;
    var result = false;

    if (window) {
      console.log("%c[[isHotReloadMode]] window.name:" + window.name, 'color:green;border:1px solid green');

      if (window.webpackHotUpdate || window.name === 'previewFrame') {
        result = true;
      }
    }

    return result;
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
    var message = '';
    if (typeof code === 'string') message = code;else {
      message = ERR_MESSAGE[code] || '';
    }
    if (extraMessage) message += extraMessage;
    if (!message) message = "undefined message for code:" + code;
    var error = new Error(message);
    error.code = code;
    return error;
  }
  function hotReloadWarning(err) {
    var message = err.message || err;
    var st = 'color:green;border:1px solid green';
    console.log("%c error detected " + message + ", cc found app is maybe running in hot reload mode, so cc will silent this error...", st);
    console.log("%c but if this is not as your expectation ,maybe you can reload your whole app to avoid this error message", st);
  }
  /**
   * these error may caused by hmr
   * @param {*} err 
   */

  function throwCcHmrError(err) {
    if (isHotReloadMode()) {
      hotReloadWarning(err);
    } else throw err;
  }
  function makeCcClassContext(module, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys) {
    return {
      module: module,
      originalSharedStateKeys: originalSharedStateKeys,
      originalGlobalStateKeys: originalGlobalStateKeys,
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
  function computeFeature(ccUniqueKey, state) {
    var stateKeys = Object.keys(state);
    var stateKeysStr = stateKeys.sort().join('|');
    return ccUniqueKey + "/" + stateKeysStr;
  }
  function randomNumber(lessThan) {
    if (lessThan === void 0) {
      lessThan = 52;
    }

    var seed = Math.random();
    return parseInt(seed * lessThan);
  }
  function clearObject(object) {
    Object.keys(object).forEach(function (key) {
      return delete object[key];
    });
  }
  var util = {
    clearObject: clearObject,
    makeError: makeError,
    throwCcHmrError: throwCcHmrError,
    hotReloadWarning: hotReloadWarning,
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
    safeAssignObjectValue: safeAssignObjectValue,
    computeFeature: computeFeature,
    randomNumber: randomNumber
  };

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
      var ignoreIt = "if this message doesn't matter, you can ignore it";
      if (module) throw new Error("[[pick-one-ref]]: no any ccInstance founded for module:" + module + "!," + ignoreIt);else throw new Error("[[pick-one-ref]]: no any ccInstance founded currently," + ignoreIt);
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

  function checkModuleState (moduleState, moduleName) {
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

  function setState (module, state, lazyMs, throwError) {
    if (lazyMs === void 0) {
      lazyMs = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef(module);
      ref.$$changeState(state, {
        module: module,
        stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
        broadcastTriggeredBy: BROADCAST_TRIGGERED_BY_CC_API_SET_STATE,
        lazyMs: lazyMs
      });
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  /****
   * if you are sure the input state is really belong to global state, call cc.setGlobalState,
   * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
   */

  function setGlobalState (state, lazyMs, throwError) {
    if (lazyMs === void 0) {
      lazyMs = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.setGlobalState(state, lazyMs, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function extractStateByKeys (state, stateKeys) {
    if (!isStateValid(state) || !isObjectNotNull(state)) {
      return {
        partialState: {},
        isStateEmpty: true
      };
    }

    var partialState = {};
    var isStateEmpty = true;
    stateKeys.forEach(function (key) {
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

  var feature_timerId = {};
  var runLater = (function (cb, feature, lazyMs) {
    if (lazyMs === void 0) {
      lazyMs = 1000;
    }

    var timerId = feature_timerId[feature];
    if (timerId) clearTimeout(timerId);
    feature_timerId[feature] = setTimeout(function () {
      delete feature_timerId[feature];
      cb();
    }, lazyMs);
  });

  var _currentIndex = 0;
  var letters = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'];

  function genNonceStr(length) {
    if (length === void 0) {
      length = 6;
    }

    var ret = '';

    for (var i = 0; i < length; i++) {
      ret += letters[randomNumber()];
    }

    return ret;
  }

  function uuid () {
    _currentIndex++;
    var nonceStr = genNonceStr();
    return "CC_" + Date.now() + "_" + nonceStr + "_" + _currentIndex + "_";
  }

  var catchCcError = (function (err) {
    if (ccContext.errorHandler) ccContext.errorHandler(err);else throw err;
  });

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
          checkModuleName(moduleName);
          var moduleState = store[moduleName];
          checkModuleState(moduleState, moduleName);

          if (moduleName === MODULE_DEFAULT) {
            isDefaultModuleExist = true;
            console.log(ss('$$default module state found while startup cc!'), cl());
          }

          _state[moduleName] = moduleState;
          var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

          if (sharedKey_globalKey_) {
            handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
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
      checkModuleName(moduleName, true);
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
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
        _ref$isStrict = _ref.isStrict,
        isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
        _ref$isDebug = _ref.isDebug,
        isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
        _ref$errorHandler = _ref.errorHandler,
        errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
        _ref$isHot = _ref.isHot,
        isHot = _ref$isHot === void 0 ? false : _ref$isHot;

    try {
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
      justWarning$1 = util.justWarning,
      throwCcHmrError$1 = util.throwCcHmrError;
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
      sharedKey_globalMappingKeyDescriptor_ = ccContext.sharedKey_globalMappingKeyDescriptor_,
      middlewares = ccContext.middlewares;
  var cl$1 = color$1;
  var ss$1 = styleStr$1;
  var me = makeError$1;
  var vbi$1 = verboseInfo$1;
  var DISPATCH = 'dispatch';
  var SET_STATE = 'setState';
  var SET_GLOBAL_STATE = 'setGlobalState';
  var FORCE_UPDATE = 'forceUpdate';
  var EFFECT = 'effect';
  var XEFFECT = 'xeffect';
  var INVOKE = 'invoke';
  var INVOKE_WITH = 'invokeWith';
  var CALL = 'call';
  var CALL_WITH = 'callWith';
  var CALL_THUNK = 'callThunk';
  var CALL_THUNK_WITH = 'callThunkWith';
  var COMMIT = 'commit';
  var COMMIT_WITH = 'commitWith';
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
        // const uuidStr = uuid().replace(/-/g, '_');
        var uuidStr = uuid();
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
  } // stateKey_propKeyDescriptor_ map's key must be moduledStateKey like 'foo/key'
  // cause different module may include the same state key


  function _getStateKeyPair(module, stateKey) {
    return {
      moduledStateKey: module + "/" + stateKey,
      originalStateKey: stateKey
    }; // if (isPropStateModuleMode === true) {
    //   return { moduledStateKey: `${module}/${stateKey}`, originalStateKey: stateKey };
    // } else {
    //   return { moduledStateKey: stateKey, originalStateKey: stateKey };
    // }
  }

  function _setPropState(propState, propKey, propValue, isPropStateModuleMode, module) {
    if (isPropStateModuleMode) {
      var modulePropState = util.safeGetObjectFromObject(propState, module);
      modulePropState[propKey] = propValue;
    } else {
      propState[propKey] = propValue;
    }
  } //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


  function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
    var contextMap = ccContext.ccClassKey_ccClassContext_;

    if (contextMap[ccClassKey] !== undefined) {
      throwCcHmrError$1(me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
    }

    var ccClassContext = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);

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

              var _getStateKeyPair2 = _getStateKeyPair(module, stateKey),
                  moduledStateKey = _getStateKeyPair2.moduledStateKey;

              propKey_stateKeyDescriptor_[moduledPropKey] = {
                module: stateModule,
                originalStateKey: stateKey,
                moduledStateKey: moduledStateKey
              };
              stateKey_propKeyDescriptor_[moduledStateKey] = {
                module: stateModule,
                moduledPropKey: moduledPropKey,
                originalPropKey: originalPropKey,
                originalStateKey: stateKey
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

  function mapModuleAndCcClassKeys(moduleName, ccClassKey) {
    var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

    if (ccClassKeys.includes(ccClassKey)) {
      throwCcHmrError$1(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    }

    var moduleSingleClass = ccContext.moduleSingleClass;

    if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
      throw me(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi$1("module " + moduleName + ", ccClassKey " + ccClassKey));
    } // to avoid ccClassKeys include duplicate key in hmr mode


    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
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
        //??? maybe can use this.props.state?
        _throwForExtendInputClassAsFalseCheck(ccClassKey);
      }
    }

    var _getSharedKeysAndGlob = getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys),
        targetSharedStateKeys = _getSharedKeysAndGlob.sharedStateKeys,
        targetGlobalStateKeys = _getSharedKeysAndGlob.globalStateKeys;

    mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, globalStateKeys, targetSharedStateKeys, targetGlobalStateKeys, stateToPropMapping, isPropStateModuleMode);
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
        var _getStateKeyPair3 = _getStateKeyPair(stateModuleName, sKey),
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
    }).catch(catchCcError);
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$1(err);
        if (ccContext.errorHandler) ccContext.errorHandler(err);
      }
    }
  }
  /****
   * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
   * but you can not register multi react class with a same ccClassKey!
   * @param {object} registerOption
   * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
   * @param {Array<string>|string} [registerOption.sharedStateKeys] 
   * declare which state keys's state changing will shared to current cc class's module,
   * default is empty array, that means any state key's value changing will not effect it's module state,
   * if you define it like ['foo', 'bar'], when current cc instance change foo and bar, 
   * it will effect other cc instance only if any of them whose sharedStateKeys include any key of foo and bar,
   * and other cc instance change foo and bar will effect current cc instance also,
   * your can also define it as '*', it means current cc class will watch its module whole state,
   * note! the keys must have been declared in module state.
   * @param {Array<string>|string} [registerOption.globalStateKeys] 
   * declare which global keys's state changing the current class care about,
   * default is empty array, that means any state key's value changing will not effect global state,
   * note! the keys must have been declared in global state,
   * assume your global state like {gColor:'red', gWidth:200},
   * and you define globalStateKeys like ['gColor']，
   * when you current cc instance send a state to cc like {gColor:'blue', otherKey:'whatever'},
   * global state's gColor will been changed and any other cc instance if their globalStateKeys include gColor
   * will read the latest gColor value and render new view.
   * your can also define it as '*', it means current cc class will watch global module whole state,
   * ============   !!!!!!  ============
   * and pay attention key naming duplicate, because a cc instance's state is merged from global state、module state and self state,
   * so cc don't allow sharedStateKeys and globalStateKeys has duplicate element
   * 
   * @param {object} [registerOption.stateToPropMapping] { (moduleName/keyName)/(alias), ...}
   * if you don't like module state merge to cc instance state property, 
   * you can define stateToPropMapping, that means you can get module from this.$$propState in cc instance method,
   * for example, if you define it like: {'moudleA/foo':'foo', 'moudleB/bar':'bar'}
   * now your can get value of foo and bar from these two module,
   * ```
   *    const {foo, bar} = this.$$propState;
   * ```
   * ============   !!!!!!  ============
   * note that, any state changing of key for foo and bar will effect current cc class instance to render new view,
   * that means you can use this feature to achieve purpose of watching multi module state changing ^_^
   * 
   * if moudleA and moudleB has a duplicate key naming, you can define stateToPropMapping like:
   * {'moudleA/foo':'foo', 'moudleA/bar':'moudleA_bar','moudleB/bar':'bar'}
   * now your can get value of foo and bar from these two module like below,
   * ```
   *    const {foo, moudleA_bar, bar} = this.$$propState;
   * ```
   * if you want to want to watch moudleA and moudleB whole state changing 
   * and you can make sure they don't have key naming duplicate problem!
   * you can define stateToPropMapping like: {'moudleA/*':'', 'moudleB/*':''}
   * now your can get any key state from this.$$propState,
   * 
   * ============   !!!!!!  ============
   * a better way to avoid key naming duplicate problem is set registerOption.isPropStateModuleMode as true,
   * now your can these two moudle state like below, you can get every state from specified module^_^
   * ```
   *    const {moudleA, moudleB} = this.$$propState;
   * ```
   * 
   * @param {object} [registerOption.isPropStateModuleMode] default is false, see above know how to use it
   * @param {string} [registerOption.reducerModule] default is equal as module if you don't declare it
   * if you call cc instance api $$dispatch without module and reducerMoudle like below
   * ```
   *    this.$$dispatch({type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.$$dispatch('doStaff', {foo:1, bar:2});
   * ```
   * cc will find current cc class's reducerModule function named doStaff to execute 
   * and will change current cc class's moudle state,
   * so you don't have to write code like below if current cc class module is M1 
   * and you always want to use R1 reducer function to generate new state
   * ```
   *    this.$$dispatch({module:'M1', reducerModule:'R1', type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.$$dispatch('M1/R1/doStaff', {foo:1, bar:2});
   * ```
   * 
   * ============   !!!!!!  ============
   * note if you really want to change other module's state and use other reducer function, you must input module and reducerModule
   * in your $$dispatch method, or they will been replaced by current cc class's default module and default reducerModule
   * ```
   *    this.$$dispatch({module:'M2', reducerModule:'R2', type:'doStaff', payload:{foo:1, bar:2}});
   * ```
   * @param {string} [registerOption.extendInputClass] default is true
   * cc alway use strategy of reverse inheritance to wrap your react class, that meas you can call cc instance method from `this` directly
   * but if you meet multi decorator in your legacy project and want to change it to cc, to make it still works well in cc mode,
   * you can set extendInputClass as false, then cc will use strategy of prop proxy to wrap your react class, in this situation, 
   * all the cc instance method and property you can only get them from `this.props`, for example
   * ```
   *    @cc.register('BasicForms',{
   *      stateToPropMapping: {'form/regularFormSubmitting': 'submitting'},
   *      extendInputClass: false 
   *    })
   *    @Form.create()
   *    export default class BasicForms extends PureComponent {
   *      componentDidMount()=>{
   *        this.props.$$dispatch('form/getInitData');
   *      }
   *      render(){
   *        const {submitting} = this.props.$$propState;
   *      }
   *    }
   * ```
   * more details you can see https://github.com/fantasticsoul/rcc-antd-pro/blob/master/src/routes/Forms/BasicForm.js
   * @param {string} [registerOption.isSingle] default is false
   * if you only allow current cc class only initialize one time, 
   * that means there is only one cc instance can be existed for current cc class at most,
   * you can define registerOption.isSingle as true, it just like singleton mode in java coding^_^
   * @param {string} [registerOption.asyncLifecycleHook] default is true
   * we can define cc class lifecycle method $$beforeSetState、$$afterSetState、$$beforeBroadcastState,
   * but they are synchronous by default,
   * if you define registerOption.isSingle as true, these three method's second param will be next handler
   *  * ============   !!!!!!  ============
   *  you must call next, if you don't want to block any of next operation in cc core
   * ```
   * $$beforeSetState(executeContext, next){
   *  // here if you don't call next(), it will block reactSetState, broadcastState and etc operations ~_~
   * }
   * ```
   */


  function register(ccClassKey, _temp) {
    var _ref4 = _temp === void 0 ? {} : _temp,
        _ref4$module = _ref4.module,
        module = _ref4$module === void 0 ? MODULE_DEFAULT : _ref4$module,
        _ref4$sharedStateKeys = _ref4.sharedStateKeys,
        inputSharedStateKeys = _ref4$sharedStateKeys === void 0 ? [] : _ref4$sharedStateKeys,
        _ref4$globalStateKeys = _ref4.globalStateKeys,
        inputGlobalStateKeys = _ref4$globalStateKeys === void 0 ? [] : _ref4$globalStateKeys,
        stateToPropMapping = _ref4.stateToPropMapping,
        _ref4$isPropStateModu = _ref4.isPropStateModuleMode,
        isPropStateModuleMode = _ref4$isPropStateModu === void 0 ? false : _ref4$isPropStateModu,
        reducerModule = _ref4.reducerModule,
        _ref4$extendInputClas = _ref4.extendInputClass,
        extendInputClass = _ref4$extendInputClas === void 0 ? true : _ref4$extendInputClas,
        _ref4$isSingle = _ref4.isSingle,
        isSingle = _ref4$isSingle === void 0 ? false : _ref4$isSingle,
        _ref4$asyncLifecycleH = _ref4.asyncLifecycleHook,
        asyncLifecycleHook = _ref4$asyncLifecycleH === void 0 ? true : _ref4$asyncLifecycleH;

    try {
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

        var TargetClass = extendInputClass ? ReactClass : React.Component;

        var CcClass =
        /*#__PURE__*/
        function (_TargetClass) {
          _inheritsLoose(CcClass, _TargetClass);

          function CcClass(props, context) {
            var _this;

            try {
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
              var _asyncLifecycleHook2 = ccOption.asyncLifecycleHook,
                  storedStateKeys = ccOption.storedStateKeys;

              var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
                  ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
                  isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

              var ccClassContext = _this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

              _this.__$$mapCcToInstance(isSingle, _asyncLifecycleHook2, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys); // bind propState to $$propState


              _this.$$propState = ccClassKey_ccClassContext_[ccClassKey].propState || {};

              _this.__$$recoverState(ccClassKey);
            } catch (err) {
              catchCcError(err);
            }

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
              setState: function setState$$1(state, cb, lazyMs) {
                if (lazyMs === void 0) {
                  lazyMs = -1;
                }

                _this2.$$changeState(state, {
                  module: currentModule,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  cb: cb,
                  calledBy: SET_STATE,
                  lazyMs: lazyMs
                });
              },
              setGlobalState: function setGlobalState$$1(partialGlobalState, lazyMs, broadcastTriggeredBy) {
                if (lazyMs === void 0) {
                  lazyMs = -1;
                }

                if (broadcastTriggeredBy === void 0) {
                  broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
                }

                _this2.$$changeState(partialGlobalState, {
                  module: MODULE_GLOBAL,
                  broadcastTriggeredBy: broadcastTriggeredBy,
                  calledBy: SET_GLOBAL_STATE,
                  lazyMs: lazyMs
                });
              },
              forceUpdate: function forceUpdate(cb, lazyMs) {
                _this2.$$changeState(_this2.state, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  cb: cb,
                  calledBy: FORCE_UPDATE,
                  lazyMs: lazyMs
                });
              },
              effect: function effect(targetModule, userLogicFn) {
                var _this2$cc;

                for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                  args[_key4 - 2] = arguments[_key4];
                }

                return (_this2$cc = _this2.cc).__effect.apply(_this2$cc, [targetModule, userLogicFn, -1].concat(args));
              },
              lazyEffect: function lazyEffect(targetModule, userLogicFn, lazyMs) {
                var _this2$cc2;

                for (var _len5 = arguments.length, args = new Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
                  args[_key5 - 3] = arguments[_key5];
                }

                return (_this2$cc2 = _this2.cc).__effect.apply(_this2$cc2, [targetModule, userLogicFn, lazyMs].concat(args));
              },
              // change other module's state, mostly you should use this method to generate new state instead of xeffect,
              // because xeffect will force your logicFn to put your first param as ExecutionContext
              __effect: function __effect(targetModule, userLogicFn, lazyMs) {
                var _this2$cc3;

                for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key6 = 3; _key6 < _len6; _key6++) {
                  args[_key6 - 3] = arguments[_key6];
                }

                return (_this2$cc3 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc3, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  context: false,
                  module: targetModule,
                  calledBy: EFFECT,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              // change other module's state, cc will give userLogicFn EffectContext object as first param
              xeffect: function xeffect(targetModule, userLogicFn) {
                var _this2$cc4;

                for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                  args[_key7 - 2] = arguments[_key7];
                }

                (_this2$cc4 = _this2.cc)._xeffect.apply(_this2$cc4, [targetModule, userLogicFn, -1].concat(args));
              },
              lazyXeffect: function lazyXeffect(targetModule, userLogicFn, lazyMs) {
                var _this2$cc5;

                for (var _len8 = arguments.length, args = new Array(_len8 > 3 ? _len8 - 3 : 0), _key8 = 3; _key8 < _len8; _key8++) {
                  args[_key8 - 3] = arguments[_key8];
                }

                (_this2$cc5 = _this2.cc)._xeffect.apply(_this2$cc5, [targetModule, userLogicFn, lazyMs].concat(args));
              },
              // change other module's state, cc will give userLogicFn EffectContext object as first param
              _xeffect: function _xeffect(targetModule, userLogicFn, lazyMs) {
                var dispatch = _this2.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, currentReducerModule);

                var thisCC = _this2.cc;

                for (var _len9 = arguments.length, args = new Array(_len9 > 3 ? _len9 - 3 : 0), _key9 = 3; _key9 < _len9; _key9++) {
                  args[_key9 - 3] = arguments[_key9];
                }

                return thisCC.__promisifiedInvokeWith.apply(thisCC, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  dispatch: dispatch,
                  lazyMs: lazyMs,
                  xeffect: thisCC.xeffect,
                  effect: thisCC.effect,
                  lazyXeffect: thisCC.lazyXeffect,
                  lazyEffect: thisCC.lazyEffect,
                  moduleState: getState(targetModule),
                  state: _this2.state,
                  context: true,
                  module: targetModule,
                  calledBy: XEFFECT,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext) {
                for (var _len10 = arguments.length, args = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
                  args[_key10 - 2] = arguments[_key10];
                }

                return _promisifyCcFn.apply(void 0, [_this2.cc.__invokeWith, userLogicFn, executionContext].concat(args));
              },
              // always change self module's state
              invoke: function invoke(userLogicFn) {
                var _this2$cc6;

                for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
                  args[_key11 - 1] = arguments[_key11];
                }

                return (_this2$cc6 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc6, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: INVOKE,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              // advanced invoke, can change other module state, but user should put module to option
              // and user can decide userLogicFn's first param is ExecutionContext if set context as true
              invokeWith: function invokeWith(userLogicFn, option) {
                var _this2$cc7;

                var _option$module = option.module,
                    module = _option$module === void 0 ? currentModule : _option$module,
                    _option$context = option.context,
                    context = _option$context === void 0 ? false : _option$context,
                    _option$forceSync = option.forceSync,
                    forceSync = _option$forceSync === void 0 ? false : _option$forceSync,
                    cb = option.cb,
                    lazyMs = option.lazyMs;

                for (var _len12 = arguments.length, args = new Array(_len12 > 2 ? _len12 - 2 : 0), _key12 = 2; _key12 < _len12; _key12++) {
                  args[_key12 - 2] = arguments[_key12];
                }

                return (_this2$cc7 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc7, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  moduleState: getState(module),
                  state: _this2.state,
                  context: context,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: INVOKE_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              __invokeWith: function __invokeWith(userLogicFn, executionContext) {
                for (var _len13 = arguments.length, args = new Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
                  args[_key13 - 2] = arguments[_key13];
                }

                var stateFor = executionContext.stateFor,
                    _executionContext$mod = executionContext.module,
                    targetModule = _executionContext$mod === void 0 ? currentModule : _executionContext$mod,
                    _executionContext$con = executionContext.context,
                    context = _executionContext$con === void 0 ? false : _executionContext$con,
                    _executionContext$for = executionContext.forceSync,
                    forceSync = _executionContext$for === void 0 ? false : _executionContext$for,
                    cb = executionContext.cb,
                    __innerCb = executionContext.__innerCb,
                    type = executionContext.type,
                    reducerModule = executionContext.reducerModule,
                    calledBy = executionContext.calledBy,
                    fnName = executionContext.fnName,
                    _executionContext$laz = executionContext.lazyMs,
                    lazyMs = _executionContext$laz === void 0 ? -1 : _executionContext$laz;
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
                      cb: newCb,
                      type: type,
                      reducerModule: reducerModule,
                      changedBy: CHANGE_BY_SELF,
                      calledBy: calledBy,
                      fnName: fnName,
                      lazyMs: lazyMs
                    });
                  }).then(function () {
                    if (__innerCb) __innerCb(null, _partialState);
                  }).catch(function (err) {
                    handleCcFnError(err, __innerCb);
                  });
                });
              },
              call: function call(userLogicFn) {
                var _this2$cc8;

                for (var _len14 = arguments.length, args = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
                  args[_key14 - 1] = arguments[_key14];
                }

                return (_this2$cc8 = _this2.cc).__promisifiedCallWith.apply(_this2$cc8, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: CALL,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              callWith: function callWith(userLogicFn, _temp2) {
                var _this2$cc9;

                var _ref5 = _temp2 === void 0 ? {} : _temp2,
                    _ref5$module = _ref5.module,
                    module = _ref5$module === void 0 ? currentModule : _ref5$module,
                    _ref5$forceSync = _ref5.forceSync,
                    forceSync = _ref5$forceSync === void 0 ? false : _ref5$forceSync,
                    cb = _ref5.cb,
                    _ref5$lazyMs = _ref5.lazyMs,
                    lazyMs = _ref5$lazyMs === void 0 ? -1 : _ref5$lazyMs;

                for (var _len15 = arguments.length, args = new Array(_len15 > 2 ? _len15 - 2 : 0), _key15 = 2; _key15 < _len15; _key15++) {
                  args[_key15 - 2] = arguments[_key15];
                }

                return (_this2$cc9 = _this2.cc).__promisifiedCallWith.apply(_this2$cc9, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: CALL_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              __promisifiedCallWith: function __promisifiedCallWith(userLogicFn, executionContext) {
                for (var _len16 = arguments.length, args = new Array(_len16 > 2 ? _len16 - 2 : 0), _key16 = 2; _key16 < _len16; _key16++) {
                  args[_key16 - 2] = arguments[_key16];
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

                for (var _len17 = arguments.length, args = new Array(_len17 > 2 ? _len17 - 2 : 0), _key17 = 2; _key17 < _len17; _key17++) {
                  args[_key17 - 2] = arguments[_key17];
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
                var _this2$cc10;

                for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
                  args[_key18 - 1] = arguments[_key18];
                }

                (_this2$cc10 = _this2.cc).__promisifiedCallThunkWith.apply(_this2$cc10, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: CALL_THUNK,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              callThunkWith: function callThunkWith(userLogicFn, _temp4) {
                var _this2$cc11;

                var _ref7 = _temp4 === void 0 ? {} : _temp4,
                    _ref7$module = _ref7.module,
                    module = _ref7$module === void 0 ? currentModule : _ref7$module,
                    _ref7$forceSync = _ref7.forceSync,
                    forceSync = _ref7$forceSync === void 0 ? false : _ref7$forceSync,
                    cb = _ref7.cb,
                    _ref7$lazyMs = _ref7.lazyMs,
                    lazyMs = _ref7$lazyMs === void 0 ? -1 : _ref7$lazyMs;

                for (var _len19 = arguments.length, args = new Array(_len19 > 2 ? _len19 - 2 : 0), _key19 = 2; _key19 < _len19; _key19++) {
                  args[_key19 - 2] = arguments[_key19];
                }

                (_this2$cc11 = _this2.cc).__promisifiedCallThunkWith.apply(_this2$cc11, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: CALL_THUNK_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              __promisifiedCallThunkWith: function __promisifiedCallThunkWith(userLogicFn, executionContext) {
                for (var _len20 = arguments.length, args = new Array(_len20 > 2 ? _len20 - 2 : 0), _key20 = 2; _key20 < _len20; _key20++) {
                  args[_key20 - 2] = arguments[_key20];
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

                for (var _len21 = arguments.length, args = new Array(_len21 > 2 ? _len21 - 2 : 0), _key21 = 2; _key21 < _len21; _key21++) {
                  args[_key21 - 2] = arguments[_key21];
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
                var _this2$cc12;

                for (var _len22 = arguments.length, args = new Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
                  args[_key22 - 1] = arguments[_key22];
                }

                (_this2$cc12 = _this2.cc).__commitWith.apply(_this2$cc12, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: COMMIT,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              commitWith: function commitWith(userLogicFn, _temp6) {
                var _this2$cc13;

                var _ref9 = _temp6 === void 0 ? {} : _temp6,
                    _ref9$module = _ref9.module,
                    module = _ref9$module === void 0 ? currentModule : _ref9$module,
                    _ref9$forceSync = _ref9.forceSync,
                    forceSync = _ref9$forceSync === void 0 ? false : _ref9$forceSync,
                    cb = _ref9.cb,
                    lazyMs = _ref9.lazyMs;

                for (var _len23 = arguments.length, args = new Array(_len23 > 2 ? _len23 - 2 : 0), _key23 = 2; _key23 < _len23; _key23++) {
                  args[_key23 - 2] = arguments[_key23];
                }

                (_this2$cc13 = _this2.cc).__commitWith.apply(_this2$cc13, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: COMMIT_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              }
            }, _this$cc["__promisifiedCallWith"] = function __promisifiedCallWith(userLogicFn, executionContext) {
              for (var _len24 = arguments.length, args = new Array(_len24 > 2 ? _len24 - 2 : 0), _key24 = 2; _key24 < _len24; _key24++) {
                args[_key24 - 2] = arguments[_key24];
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

              for (var _len25 = arguments.length, args = new Array(_len25 > 2 ? _len25 - 2 : 0), _key25 = 2; _key25 < _len25; _key25++) {
                args[_key25 - 2] = arguments[_key25];
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
                  __innerCb = _ref11.__innerCb,
                  _ref11$lazyMs = _ref11.lazyMs,
                  lazyMs = _ref11$lazyMs === void 0 ? -1 : _ref11$lazyMs;

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


              var contextDispatch = _this2.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetStateModule, targetReducerModule, null, null, lazyMs);

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
                  lazyEffect: _this2.$$lazyEffect,
                  lazyXeffect: _this2.$$lazyXeffect,
                  forceSync: forceSync,
                  cb: newCb,
                  context: true,
                  __innerCb: __innerCb,
                  calledBy: DISPATCH,
                  lazyMs: lazyMs
                };

                _this2.cc.__invokeWith(reducerFn, executionContext);
              });
            }, _this$cc.prepareReactSetState = function prepareReactSetState(changedBy, state, next, reactCallback) {
              if (storedStateKeys.length > 0) {
                var _extractStateByKeys5 = extractStateByKeys$1(state, storedStateKeys),
                    partialState = _extractStateByKeys5.partialState,
                    isStateEmpty = _extractStateByKeys5.isStateEmpty;

                if (!isStateEmpty) {
                  if (ccOption.storeInLocalStorage === true) {
                    var _extractStateByKeys6 = extractStateByKeys$1(_this2.state, storedStateKeys),
                        entireStoredState = _extractStateByKeys6.partialState;

                    var currentStoredState = _extends({}, entireStoredState, partialState);

                    localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                  }

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
                    changedBy: changedBy
                  });

                  _this2.cc.reactSetState(state, reactCallback);

                  if (next) next();
                } else {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  _this2.$$beforeSetState({
                    changedBy: changedBy
                  }, function () {
                    _this2.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  });
                }
              } else {
                _this2.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            }, _this$cc.prepareBroadcastGlobalState = function prepareBroadcastGlobalState(broadcastTriggeredBy, globalState, lazyMs) {
              var _getAndStoreValidGlob = getAndStoreValidGlobalState$1(globalState),
                  validGlobalState = _getAndStoreValidGlob.partialState,
                  isStateEmpty = _getAndStoreValidGlob.isStateEmpty;

              var startBroadcastGlobalState = function startBroadcastGlobalState() {
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
              };

              if (lazyMs > 0) {
                var feature = util.computeFeature(ccUniqueKey, globalState);
                runLater(startBroadcastGlobalState, feature, lazyMs);
              } else {
                startBroadcastGlobalState();
              }
            }, _this$cc.prepareBroadcastState = function prepareBroadcastState(stateFor, broadcastTriggeredBy, moduleName, committedState, needClone, lazyMs) {
              var targetSharedStateKeys, targetGlobalStateKeys;

              try {
                var result = getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, globalStateKeys, sharedStateKeys);
                targetSharedStateKeys = result.sharedStateKeys;
                targetGlobalStateKeys = result.globalStateKeys;
              } catch (err) {
                return justWarning$1(err.message + " prepareBroadcastState failed!");
              }

              var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, committedState, targetSharedStateKeys, targetGlobalStateKeys),
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

              var startBroadcastState = function startBroadcastState() {
                if (_this2.$$beforeBroadcastState) {
                  //check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    }, function () {
                      _this2.cc.broadcastState(committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                    });
                  } else {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    });

                    _this2.cc.broadcastState(committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                  }
                } else {
                  _this2.cc.broadcastState(committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                }
              };

              if (lazyMs > 0) {
                var feature = util.computeFeature(ccUniqueKey, committedState);
                runLater(startBroadcastState, feature, lazyMs);
              } else {
                startBroadcastState();
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

                  var _extractStateByKeys7 = extractStateByKeys$1(_partialSharedState, sharedStateKeys),
                      sharedStateForCurrentCcClass = _extractStateByKeys7.partialState,
                      isSharedStateEmpty = _extractStateByKeys7.isStateEmpty; //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                  //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                  //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                  //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                  var _extractStateByKeys8 = extractStateByKeys$1(partialGlobalState, globalStateKeys),
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
                          changedBy = -1;

                      if (option.syncSharedState && option.syncGlobalState) {
                        changedBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE;
                        toSet = mergedStateForCurrentCcClass;
                      } else if (option.syncSharedState) {
                        changedBy = CHANGE_BY_BROADCASTED_SHARED_STATE;
                        toSet = sharedStateForCurrentCcClass;
                      } else if (option.syncGlobalState) {
                        changedBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE;
                        toSet = globalStateForCurrentCcClass;
                      }

                      if (toSet) {
                        if (ccContext.isDebug) {
                          console.log(ss$1("ref " + ccKey + " to be rendered state(changedBy " + changedBy + ") is broadcast from same module's other ref " + currentCcKey), cl$1());
                        }

                        ref.cc.prepareReactSetState(changedBy, toSet);
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

                    var _extractStateByKeys9 = extractStateByKeys$1(partialGlobalState, globalStateKeys),
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

              broadcastPropState(moduleName, originalState);
            }, _this$cc.broadcastGlobalState = function broadcastGlobalState(globalSate) {
              globalCcClassKeys.forEach(function (ccClassKey) {
                var classContext = ccClassKey_ccClassContext_[ccClassKey];
                var globalStateKeys = classContext.globalStateKeys,
                    ccKeys = classContext.ccKeys;

                var _extractStateByKeys10 = extractStateByKeys$1(globalSate, globalStateKeys),
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
              broadcastPropState(MODULE_GLOBAL, globalSate);
            }, _this$cc.emit = function emit(event) {
              for (var _len26 = arguments.length, args = new Array(_len26 > 1 ? _len26 - 1 : 0), _key26 = 1; _key26 < _len26; _key26++) {
                args[_key26 - 1] = arguments[_key26];
              }

              findEventHandlersToPerform.apply(void 0, [event, {
                identity: null
              }].concat(args));
            }, _this$cc.emitIdentity = function emitIdentity(event, identity) {
              for (var _len27 = arguments.length, args = new Array(_len27 > 2 ? _len27 - 2 : 0), _key27 = 2; _key27 < _len27; _key27++) {
                args[_key27 - 2] = arguments[_key27];
              }

              findEventHandlersToPerform.apply(void 0, [event, {
                identity: identity
              }].concat(args));
            }, _this$cc.emitWith = function emitWith(event, option) {
              for (var _len28 = arguments.length, args = new Array(_len28 > 2 ? _len28 - 2 : 0), _key28 = 2; _key28 < _len28; _key28++) {
                args[_key28 - 2] = arguments[_key28];
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

            this.$$dispatch = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule);
            this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule);
            this.$$invoke = this.cc.invoke.bind(this); // commit state to cc directly, but userFn can be promise or generator both!

            this.$$invokeWith = this.cc.invokeWith.bind(this);
            this.$$call = this.cc.call.bind(this); // commit state by setState handler

            this.$$callWith = this.cc.callWith.bind(this);
            this.$$callThunk = this.cc.callThunk.bind(this); // commit state by setState handler

            this.$$callThunkWith = this.cc.callThunkWith.bind(this);
            this.$$commit = this.cc.commit.bind(this); // commit state to cc directly, userFn can only be normal function

            this.$$commitWith = this.cc.commitWith.bind(this);
            this.$$effect = this.cc.effect.bind(this); // commit state to cc directly, userFn can be normal 、 generator or async function

            this.$$lazyEffect = this.cc.lazyEffect.bind(this); // commit state to cc directly, userFn can be normal 、 generator or async function

            this.$$xeffect = this.cc.xeffect.bind(this);
            this.$$lazyXeffect = this.cc.lazyXeffect.bind(this);
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
                changedBy = _ref13.changedBy,
                forceSync = _ref13.forceSync,
                reactCallback = _ref13.cb,
                type = _ref13.type,
                reducerModule = _ref13.reducerModule,
                calledBy = _ref13.calledBy,
                fnName = _ref13.fnName,
                _ref13$lazyMs = _ref13.lazyMs,
                lazyMs = _ref13$lazyMs === void 0 ? -1 : _ref13$lazyMs;

            //executionContext
            if (state == undefined) return; //do nothing

            if (!isPlainJsonObject(state)) {
              justWarning$1("cc found your commit state is not a plain json object!");
            }

            var _doChangeState = function _doChangeState() {
              if (module == MODULE_GLOBAL) {
                _this3.cc.prepareBroadcastGlobalState(broadcastTriggeredBy, state, lazyMs);
              } else {
                var ccState = _this3.cc.ccState;
                var currentModule = ccState.module;

                if (module === currentModule) {
                  // who trigger $$changeState, who will go to change the whole received state 
                  _this3.cc.prepareReactSetState(changedBy || CHANGE_BY_SELF, state, function () {
                    //if forceSync=true, cc clone the input state
                    if (forceSync === true) {
                      _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true, lazyMs);
                    } else if (ccState.ccOption.syncSharedState) {
                      _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false, lazyMs);
                    }
                  }, reactCallback);
                } else {
                  if (forceSync) justWarning$1("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi$1("module:" + module + " currentModule" + currentModule));
                  if (reactCallback) justWarning$1("callback for react.setState will be ignore");

                  _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true, lazyMs);
                }
              }
            };

            var middlewaresLen = middlewares.length;

            if (middlewaresLen > 0) {
              var passToMiddleware = {
                state: state,
                stateFor: stateFor,
                module: module,
                type: type,
                reducerModule: reducerModule,
                broadcastTriggeredBy: broadcastTriggeredBy,
                changedBy: changedBy,
                forceSync: forceSync,
                calledBy: calledBy,
                fnName: fnName
              };
              var index = 0;

              var next = function next() {
                if (index === middlewaresLen) {
                  // all middlewares been executed
                  _doChangeState();
                } else {
                  var middlewareFn = middlewares[index];
                  index++;
                  middlewareFn(passToMiddleware, next);
                }
              };

              next();
            } else {
              _doChangeState();
            }
          }; //{ module, forceSync, cb }


          _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
            var _this4 = this;

            return function (state) {
              _this4.$$changeState(state, executionContext);
            };
          };

          _proto.__$$getDispatchHandler = function __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload, lazyMs) {
            var _this5 = this;

            if (lazyMs === void 0) {
              lazyMs = -1;
            }

            return function (paramObj, payloadWhenFirstParamIsString) {
              if (paramObj === void 0) {
                paramObj = {};
              }

              var paramObjType = typeof paramObj;

              var _module = originalComputedStateModule,
                  _reducerModule,
                  _forceSync = false,
                  _type,
                  _payload = inputPayload,
                  _cb,
                  _lazyMs = lazyMs;

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
                    cb = _paramObj.cb,
                    _paramObj$lazyMs = _paramObj.lazyMs,
                    _lazyMs2 = _paramObj$lazyMs === void 0 ? -1 : _paramObj$lazyMs;

                _module = _module2;
                _reducerModule = _reducerModule2 || _module2;
                _forceSync = forceSync;
                _type = type;
                _payload = payload;
                _cb = cb;
                _lazyMs = _lazyMs2;
              } else if (paramObjType === 'string') {
                var slashCount = paramObj.split('').filter(function (v) {
                  return v === '/';
                }).length;
                _payload = payloadWhenFirstParamIsString;

                if (slashCount === 0) {
                  _type = paramObj;
                } else if (slashCount === 1) {
                  var _paramObj$split = paramObj.split('/'),
                      _module3 = _paramObj$split[0],
                      _type2 = _paramObj$split[1];

                  _module = _module3;
                  _reducerModule = _module;
                  _type = _type2;
                } else if (slashCount === 2) {
                  var _paramObj$split2 = paramObj.split('/'),
                      _module4 = _paramObj$split2[0],
                      _reducerModule3 = _paramObj$split2[1],
                      _type3 = _paramObj$split2[2];

                  if (_module4 === '' || _module4 === ' ') _module = originalComputedStateModule; //paramObj may like: /foo/changeName
                  else _module = _module4;
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
                  reducerModule: targetReducerModule,
                  forceSync: _forceSync,
                  type: _type,
                  payload: _payload,
                  cb: _cb,
                  __innerCb: _promiseErrorHandler(resolve, reject),
                  lazyMs: _lazyMs
                });
              }).catch(catchCcError);
            };
          };

          _proto.$$domDispatch = function $$domDispatch(event) {
            var currentTarget = event.currentTarget;
            var value = currentTarget.value,
                dataset = currentTarget.dataset;
            var type = dataset.cct,
                module = dataset.ccm,
                reducerModule = dataset.ccrm,
                _dataset$cclazyms = dataset.cclazyms,
                cclazyms = _dataset$cclazyms === void 0 ? -1 : _dataset$cclazyms;
            var payload = {
              event: event,
              dataset: dataset,
              value: value
            };

            var handler = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, cclazyms);

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
              //now cc class extends ReactClass, call super.render()
              return _TargetClass.prototype.render.call(this);
            } else {
              // now cc class extends ReactComponent, render user inputted ReactClass
              return React.createElement(ReactClass, _extends({}, this, this.props));
            }
          };

          return CcClass;
        }(TargetClass);

        CcClass.displayName = ccClassDisplayName$1(ccClassKey);
        return CcClass;
      };
    } catch (err) {
      catchCcError(err);
    }
  }

  /****
   * short for register
   * the option's definition is also been changed
   * option.module is called m for short 
   * option.sharedStateKeys is called s for short 
   * option.globalStateKeys is called g for short 
   * option.stateToPropMapping is called pm for short 
   * option.isPropStateModuleMode is called mm for short 
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
        stateToPropMapping = _ref.pm,
        isPropStateModuleMode = _ref.mm,
        isSingle = _ref.is,
        asyncLifecycleHook = _ref.as,
        reducerModule = _ref.re,
        extendInputClass = _ref.ex;

    return register(ccClassKey, {
      extendInputClass: extendInputClass,
      module: module,
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys,
      stateToPropMapping: stateToPropMapping,
      isPropStateModuleMode: isPropStateModuleMode,
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
   * @param {Object} [option.init]
   * @param {Object} [option.globalState]  this globalState will been merged to $$global module state
   * @param {Object} [option.sharedToGlobalMapping]
   * @param {Object} [option.middlewares]
   */

  function configure (module, state, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        singleClass = _ref.singleClass,
        moduleReducer = _ref.moduleReducer,
        reducer = _ref.reducer,
        init = _ref.init,
        globalState = _ref.globalState,
        sharedToGlobalMapping = _ref.sharedToGlobalMapping,
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares;

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet, you can not call cc.configure!');
    }

    if (!ccContext.isModuleMode) {
      throw new Error('cc is running in non module node, can not call cc.configure');
    }

    checkModuleName(module);
    checkModuleState(state, module);
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
      checkModuleState(globalState, MODULE_GLOBAL);
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

    if (middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(function (m) {
        return ccMiddlewares.push(m);
      });
    }
  }

  var vbi$2 = util.verboseInfo;
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

    var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
        ccKey_ref_ = ccContext.ccKey_ref_;
    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext) {
      var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi$2(" ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ref;

    if (ccInstanceKey) {
      var ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
      ref = ccKey_ref_[ccKey];
    } else {
      var ccKeys = classContext.ccKeys;
      ref = ccKey_ref_[ccKeys[0]]; // pick first one
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
  function invokeSingle (ccClassKey, method) {
    var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext.isSingle) {
      var err = util.makeError(ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE, vbi$3("ccClassKey:" + ccClassKey)); // only error, the target instance may has been unmounted really!

      return console.error(err.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    invoke.apply(void 0, [ccClassKey, ccClassKey, method].concat(args));
  }

  var getState$1 = ccContext.store.getState;

  function emit (event) {
    try {
      var ref = pickOneRef();

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      ref.$$emit.apply(ref, [event].concat(args));
    } catch (err) {
      util.justWarning(err.message);
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

  function dispatch (action, payLoadWhenActionIsString, _temp) {
    var _ref = _temp === void 0 ? [] : _temp,
        ccClassKey = _ref[0],
        ccKey = _ref[1],
        throwError = _ref[2];

    try {
      if (ccClassKey && ccKey) {
        var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
        } else {
          targetRef.$$dispatch(action, payLoadWhenActionIsString);
        }
      } else {
        var ref = pickOneRef();
        ref.$$dispatchForModule(action, payLoadWhenActionIsString);
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
    getState: getState$1,
    ccContext: ccContext
  };

  if (window) {
    window.cc = defaultExport;
  }

  return defaultExport;

})));
