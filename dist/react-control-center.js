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
  var CHANGE_BY_SELF = 1;
  var SYNC_FROM_CC_INSTANCE_SHARED_STATE = 2;
  var SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE = 3;
  var SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE = 4;
  var BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = 1;
  var BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = 2;
  var BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = 3;
  var BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = 4;
  var ERR = {
    CC_ALREADY_STARTUP: 1000,
    CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
    CC_CLASS_KEY_DUPLICATE: 1002,
    CC_CLASS_NOT_FOUND: 1003,
    CC_CLASS_STORE_MODULE_INVALID: 1004,
    CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED: 1005,
    CC_CLASS_REDUCER_MODULE_INVALID: 1006,
    CC_CLASS_INSTANCE_KEY_DUPLICATE: 1007,
    CC_CLASS_INSTANCE_OPTION_INVALID: 1008,
    CC_CLASS_INSTANCE_NOT_FOUND: 1009,
    CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1010,
    CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1011,
    CC_CLASS_INSTANCE_MORE_THAN_ONE: 1012,
    CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE: 1013,
    CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS: 1014,
    CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY: 1015,
    CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT: 1016,
    CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS: 1017,
    CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS: 1018,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY: 1019,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT: 1020,
    CC_REGISTER_A_CC_CLASS: 1021,
    MODULE_KEY_CC_FOUND: 1100,
    STORE_KEY_NAMING_INVALID: 1101,
    STORE_MODULE_VALUE_INVALID: 1102,
    STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE: 1103,
    REDUCER_ACTION_TYPE_NAMING_INVALID: 1201,
    REDUCER_ACTION_TYPE_NO_MODULE: 1202 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = 'globalStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.STORE_KEY_NAMING_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.STORE_MODULE_VALUE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module, ", _ERR_MESSAGE[ERR.REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE);

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
    return ccClassKey + "/" + ccKey;
  }
  function isModuleNameValid(moduleName) {
    return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
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
  var util = {
    makeError: makeError,
    isHotReloadMode: isHotReloadMode,
    makeCcClassContext: makeCcClassContext,
    makeStateMail: makeStateMail,
    makeUniqueCcKey: makeUniqueCcKey,
    isActionTypeValid: isActionTypeValid,
    isModuleNameValid: isModuleNameValid,
    isModuleStateValid: isModuleStateValid,
    isCcOptionValid: isCcOptionValid,
    isCcActionValid: isCcActionValid,
    isPlainJsonObject: isPlainJsonObject,
    isValueNotNull: isValueNotNull,
    disassembleActionType: disassembleActionType,
    verboseInfo: verboseInfo,
    bindThis: bindThis,
    ccClassDisplayName: ccClassDisplayName,
    clone: clone,
    verifyKeys: verifyKeys,
    color: color,
    styleStr: styleStr,
    justWarning: justWarning
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
    moduleName_ccClassKeys_: {},
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
    //[globalKey]:{module:'xxx',key:'yyy'}
    globalMappingKey_sharedKey_: {},
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
        throw new Error("no ccClass found for module" + module + "!");
      }

      var oneCcClassKey = ccClassKeys[0];
      var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

      if (!ccClassContext) {
        throw new Error("no ccClassContext found for ccClassKey" + oneCcClassKey + "!");
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

  function setState (module, state) {
    try {
      var ref = pickOneRef(module);
      ref.setState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
    } catch (err) {
      ccContext.store.setState(module, state); //store this state;

      util.justWarning(err.message);
    }
  }

  var vbi = verboseInfo;
  var ss = styleStr;
  var cl = color;

  function checkModuleNames(moduleNames) {
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var name = moduleNames[i].toLowerCase();
      if (name === MODULE_CC) throw util.makeError(ERR.MODULE_KEY_CC_FOUND);
    }
  }

  function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
    if (!isPlainJsonObject(store)) {
      throw new Error("the store is not a plain json object!");
    }

    if (!isPlainJsonObject(sharedToGlobalMapping)) {
      throw new Error("the sharedToGlobalMapping is not a plain json object!");
    }

    var _state = ccContext.store._state;
    _state[MODULE_CC] = {};

    if (isModuleMode) {
      var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
      var moduleNames = Object.keys(store);
      checkModuleNames(moduleNames, isModuleMode);
      var globalState = store[MODULE_GLOBAL];

      if (globalState) {
        if (!util.isModuleStateValid(globalState)) {
          throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + MODULE_GLOBAL + "'s value is invalid!"));
        } else {
          console.log(ss('$$global module state found while startup cc!'), cl());
        }
      } else {
        console.log(ss('$$global module state not found,cc will generate one for user automatically!'), cl());
        globalState = {};
      }

      _state[MODULE_GLOBAL] = globalState;
      var len = moduleNames.length;
      var isDefaultModuleExist = false;

      for (var i = 0; i < len; i++) {
        var _moduleName = moduleNames[i];

        if (_moduleName !== MODULE_GLOBAL) {
          if (!util.isModuleNameValid(_moduleName)) {
            throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + _moduleName + " is invalid!"));
          }

          var moduleState = store[_moduleName];

          if (!isModuleStateValid(moduleState)) {
            throw util.makeError(ERR.STORE_MODULE_VALUE_INVALID, vbi("moduleName:" + _moduleName + "'s value is invalid!"));
          }

          if (_moduleName === MODULE_DEFAULT) {
            isDefaultModuleExist = true;
            console.log(ss('$$default module state found while startup cc!'), cl());
          }

          _state[_moduleName] = moduleState; //analyze sharedToGlobalMapping

          var sharedKey_globalKey_ = sharedToGlobalMapping[_moduleName];

          if (sharedKey_globalKey_) {
            //this module's some key will been mapped to global module
            var sharedKeys = Object.keys(sharedKey_globalKey_);
            var sLen = sharedKeys.length;

            for (var k = 0; k < sLen; k++) {
              var sharedKey = sharedKeys[k];

              if (!moduleState.hasOwnProperty(sharedKey)) {
                throw new Error("the module:" + _moduleName + " don't have a key named " + sharedKey + ", check your sharedToGlobalMapping");
              }

              var globalMappingKey = sharedKey_globalKey_[sharedKey];

              if (globalState.hasOwnProperty(globalMappingKey)) {
                throw new Error("the key:" + globalMappingKey + " is already declared in globalState, you can not use it to map the sharedStateKey:" + sharedKey + " to global state, try rename your mappingKey in sharedToGlobalMapping!");
              } else {
                globalState[globalMappingKey] = moduleState[sharedKey];
                globalMappingKey_sharedKey_[globalMappingKey] = {
                  module: _moduleName,
                  key: sharedKey
                };
              }
            }
          }
        }
      }

      if (!isDefaultModuleExist) {
        _state[MODULE_DEFAULT] = {};
        console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
      }
    } else {
      if (sharedToGlobalMapping) {
        throw util.makeError(ERR.STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
      }

      var includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
      var includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
      var invalidKeyCount = 0;

      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule && !includeGlobalModule) {
          if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
            throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
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
            throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + "'s value is invalid!"));
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
          justWarning("now cc is startup with non module mode, cc only allow you define store like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
        }
      } else {
        if (!util.isModuleStateValid(store)) {
          throw util.makeError(ERR.STORE_KEY_NAMING_INVALID, vbi(" moduleName:" + moduleName + " is invalid!"));
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
        throw util.makeError(ERR.REDUCER_ACTION_TYPE_NAMING_INVALID, " actionType:" + actionType + " is invalid!");
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
      checkModuleNames(moduleNames);
      var len = moduleNames.length;
      var isDefaultReducerExist = false,
          isGlobalReducerExist = false;

      for (var i = 0; i < len; i++) {
        var _moduleName2 = moduleNames[i];
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
    var stateHandler = function stateHandler(module) {
      return function (state) {
        return setState(module, state);
      };
    };

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
    ccContext.sharedToGlobalMapping = sharedToGlobalMapping;
    bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
    if (isReducerKeyMeanNamespacedActionType) bindNamespacedKeyReducerToCcContext(reducer);else bindReducerToCcContext(reducer, isModuleMode);

    if (init) {
      var computedStore = ccContext.store._state;
      executeInitializer(isModuleMode, computedStore, init);
    }

    ccContext.isCcAlreadyStartup = true;

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.cc = ccContext;
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
      ccKey_ref_ = ccContext.ccKey_ref_,
      ccKey_option_ = ccContext.ccKey_option_,
      globalCcClassKeys = ccContext.globalCcClassKeys,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
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
    if (!isStateValid(state)) {
      return {
        partialState: {},
        isStateEmpty: true
      };
    }

    var partialState = {};
    var isStateEmpty = true;
    targetKeys.forEach(function (key) {
      var value = state[key];

      if (util.isValueNotNull(value)) {
        partialState[key] = value;
        isStateEmpty = false;
      }
    });
    return {
      partialState: partialState,
      isStateEmpty: isStateEmpty
    };
  }

  function extractGlobalStateByKeys(targetModule, commitState, globalStateKeys, sharedToGlobalMapping, globalMappingKey_sharedKey_) {
    //all stateValue if belong to globalState will be collected to module_globalState_ , key means module name, stateKey mean globalMappingKey
    var module_globalState_ = {}; //all stateValue if belong to globalState will be collected to module_originalState_, key means module name, stateKey mean sharedKey

    var module_originalState_ = {}; //all stateValue if belong to globalState will be collected to partialGlobalState

    var partialGlobalState = {};

    if (!isStateValid(commitState) || globalStateKeys.length === 0) {
      return {
        partialGlobalState: partialGlobalState,
        isPartialGlobalStateEmpty: true,
        module_globalState_: module_globalState_
      };
    }

    var isPartialGlobalStateEmpty = true;
    globalStateKeys.forEach(function (gKey) {
      if (commitState.hasOwnProperty(gKey)) {
        isPartialGlobalStateEmpty = false;
        var stateValue = commitState[gKey];
        partialGlobalState[gKey] = stateValue;
        var sharedKeyDescriptor = globalMappingKey_sharedKey_[gKey];

        if (sharedKeyDescriptor) {
          //this global key is mapping to some module's state key
          var module = sharedKeyDescriptor.module,
              key = sharedKeyDescriptor.key;
          var tmpModuleGlobalState = module_originalState_[module];

          if (!tmpModuleGlobalState) {
            tmpModuleGlobalState = module_originalState_[module] = {};
          }

          tmpModuleGlobalState[key] = commitState[gKey];
        }
      }
    });
    /*
      in case of commitState of targetModule including globalMappingState, check it with sharedToGlobalMapping
    */

    var mappingOfThisModule = sharedToGlobalMapping[targetModule];

    if (mappingOfThisModule) {
      var originalSharedKeys = Object.keys(mappingOfThisModule);
      originalSharedKeys.forEach(function (originalSharedKey) {
        if (commitState.hasOwnProperty(originalSharedKey)) {
          var globalMappingKey = mappingOfThisModule[originalSharedKey];
          var stateValue = commitState[originalSharedKey];
          isPartialGlobalStateEmpty = false;
          partialGlobalState[globalMappingKey] = stateValue; //collect this stateValue to partialGlobalState

          var targetModuleGlobalState = module_globalState_[targetModule];

          if (!targetModuleGlobalState) {
            targetModuleGlobalState = module_globalState_[targetModule] = {};
          }

          targetModuleGlobalState[globalMappingKey] = stateValue;
        }
      });
    }

    return {
      partialGlobalState: partialGlobalState,
      isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
      module_globalState_: module_globalState_,
      module_originalState_: module_originalState_
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


  function isInputModuleInvalid(inputModule, currentModule, reactCallback, cb) {
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
        ccUniqueKey = ccClassKey + "/" + uuid_1();
        isCcUniqueKeyAutoGenerated = true;
      }
    }

    return {
      ccUniqueKey: ccUniqueKey,
      isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated
    };
  }

  function checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys) {
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
  }

  function checkCcStartupOrNot() {
    if (!window.cc) throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }

  function extractStateToBeBroadcasted(module, sourceState, sharedToGlobalMapping, globalMappingKey_sharedKey_, sharedStateKeys, globalStateKeys) {
    var partialSharedState = {};
    var isPartialSharedStateEmpty = true;

    if (sharedStateKeys.length > 0) {
      var _extractStateByKeys = extractStateByKeys(sourceState, sharedStateKeys),
          partialState = _extractStateByKeys.partialState,
          isStateEmpty = _extractStateByKeys.isStateEmpty;

      if (!isStateEmpty) {
        ccContext.store.setState(module, partialState);
        isPartialSharedStateEmpty = isStateEmpty;
        partialSharedState = partialState;
      }
    }

    var _extractGlobalStateBy = extractGlobalStateByKeys(module, sourceState, globalStateKeys, sharedToGlobalMapping, globalMappingKey_sharedKey_),
        partialGlobalState = _extractGlobalStateBy.partialGlobalState,
        isPartialGlobalStateEmpty = _extractGlobalStateBy.isPartialGlobalStateEmpty,
        module_globalState_ = _extractGlobalStateBy.module_globalState_,
        module_originalState_ = _extractGlobalStateBy.module_originalState_;

    if (!isPartialGlobalStateEmpty) {
      ccContext.store.setGlobalState(partialGlobalState);
    }

    return {
      isPartialSharedStateEmpty: isPartialSharedStateEmpty,
      partialSharedState: partialSharedState,
      isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
      partialGlobalState: partialGlobalState,
      module_globalState_: module_globalState_,
      module_originalState_: module_originalState_
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
        _ref$asyncLifeCycleHo = _ref.asyncLifeCycleHook,
        asyncLifeCycleHook = _ref$asyncLifeCycleHo === void 0 ? false : _ref$asyncLifeCycleHo,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        reducerModule = _ref.reducerModule,
        _ref$sharedStateKeys = _ref.sharedStateKeys,
        sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys,
        _ref$globalStateKeys = _ref.globalStateKeys,
        globalStateKeys = _ref$globalStateKeys === void 0 ? [] : _ref$globalStateKeys;

    checkCcStartupOrNot();
    var _curStateModule = module;
    var _asyncLifeCycleHook = asyncLifeCycleHook;

    var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


    checkStoreModule(_curStateModule);
    checkReducerModule(_reducerModule);
    checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys); //tell cc this ccClass is watching some globalStateKeys of global module

    if (globalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);
    var contextMap = ccContext.ccClassKey_ccClassContext_;

    if (contextMap[ccClassKey] !== undefined) {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    } else {
      //tell cc this ccClass is watching some sharedStateKeys of a module
      contextMap[ccClassKey] = util.makeCcClassContext(_curStateModule, sharedStateKeys, globalStateKeys);
    }

    var ccClassKeys_ = moduleName_ccClassKeys_[_curStateModule];
    if (!ccClassKeys_) ccClassKeys_ = moduleName_ccClassKeys_[_curStateModule] = [];
    ccClassKeys_.push(ccClassKey);
    return function (ReactClass) {
      if (ccClassKey == 'XX_1') {
        console.log();
      }

      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi$1("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CCClass!"));
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
          util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState']);
          if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];
          if (ccOption.syncState === undefined) ccOption.syncState = true;
          if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
          if (ccOption.asyncLifeCycleHook === undefined) ccOption.asyncLifeCycleHook = _asyncLifeCycleHook;
          var asyncLifeCycleHook = ccOption.asyncLifeCycleHook,
              storedStateKeys = ccOption.storedStateKeys;

          var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
              ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
              isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

          var ccClassContext = _this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

          _this.__$$mapCcToInstance(isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys);

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
          var syncState = ccOption.syncState,
              syncGlobalState = ccOption.syncGlobalState;
          var partialSharedState = {},
              partialGlobalState = {};

          if (syncState) {
            var _extractStateByKeys2 = extractStateByKeys(sharedState, sharedStateKeys),
                partialState = _extractStateByKeys2.partialState;

            partialSharedState = partialState;
          }

          if (syncGlobalState) {
            var _extractStateByKeys3 = extractStateByKeys(globalState, globalStateKeys),
                _partialState = _extractStateByKeys3.partialState;

            partialGlobalState = _partialState;
          }

          var selfState = this.state;
          this.state = _extends({}, selfState, refState, partialSharedState, partialGlobalState);
        };

        _proto.__$$bindDataToCcClassContext = function __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
          var classContext = contextMap[ccClassKey];
          var ccKeys = classContext.ccKeys;

          if (ccContext.isDebug) {
            console.log(ss$1("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl$1());
          }

          if (!util.isCcOptionValid(ccOption)) {
            throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi$1("a standard default ccOption may like: {\"syncState\": true, \"asyncLifeCycleHook\":false, \"storedStateKeys\": []}"));
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

        _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys, globalStateKeys) {
          var _this2 = this;

          var reactSetStateRef = this.setState.bind(this);
          var reactForceUpdateRef = this.forceUpdate.bind(this);
          var ccState = {
            renderCount: 1,
            isSingle: isSingle,
            asyncLifeCycleHook: asyncLifeCycleHook,
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
            storedStateKeys: storedStateKeys,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: currentModule,
            reducerModule: reducerModule,
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
            prepareReactSetState: function prepareReactSetState(changeWay, state, isStateGlobal, next, reactCallback) {
              var _targetState = null;

              if (isStateGlobal) {
                //this state is prepare for global, usually called by setGlobalState
                var _extractStateByKeys4 = extractStateByKeys(state, globalStateKeys),
                    partialGlobalState = _extractStateByKeys4.partialState,
                    isStateEmpty = _extractStateByKeys4.isStateEmpty;

                if (!isStateEmpty) _targetState = partialGlobalState;
              } else {
                if (storedStateKeys.length > 0) {
                  var _extractStateByKeys5 = extractStateByKeys(state, storedStateKeys),
                      partialState = _extractStateByKeys5.partialState,
                      _isStateEmpty = _extractStateByKeys5.isStateEmpty;

                  if (!_isStateEmpty) {
                    refStore.setState(ccUniqueKey, partialState);
                  }
                }

                _targetState = state;
              }

              if (!_targetState) {
                if (next) next();
                return;
              }

              if (_this2.$$beforeSetState) {
                if (asyncLifeCycleHook) {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  _this2.$$beforeSetState({
                    changeWay: changeWay
                  }, function () {
                    _this2.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  });
                } else {
                  _this2.$$beforeSetState({
                    changeWay: changeWay
                  });

                  _this2.cc.reactSetState(state, reactCallback);

                  if (next) next();
                }
              } else {
                _this2.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            },
            prepareBroadcastState: function prepareBroadcastState(triggerType, moduleName, originalState, needClone) {
              var _this2$cc$ccState = _this2.cc.ccState,
                  sharedStateKeys = _this2$cc$ccState.sharedStateKeys,
                  globalStateKeys = _this2$cc$ccState.globalStateKeys;
              var sharedToGlobalMapping = ccContext.sharedToGlobalMapping;

              var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, originalState, sharedToGlobalMapping, globalMappingKey_sharedKey_, sharedStateKeys, globalStateKeys),
                  isPartialSharedStateEmpty = _extractStateToBeBroa.isPartialSharedStateEmpty,
                  isPartialGlobalStateEmpty = _extractStateToBeBroa.isPartialGlobalStateEmpty,
                  partialSharedState = _extractStateToBeBroa.partialSharedState,
                  partialGlobalState = _extractStateToBeBroa.partialGlobalState,
                  module_globalState_ = _extractStateToBeBroa.module_globalState_,
                  module_originalState_ = _extractStateToBeBroa.module_originalState_;

              if (!isPartialSharedStateEmpty || !isPartialGlobalStateEmpty) {
                if (_this2.$$beforeBroadcastState) {
                  //user define life cycle hook $$beforeBroadcastState
                  if (asyncLifeCycleHook) {
                    _this2.$$beforeBroadcastState({
                      triggerType: triggerType
                    }, function () {
                      _this2.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                    });
                  } else {
                    _this2.$$beforeBroadcastState({
                      triggerType: triggerType
                    });

                    _this2.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                  }
                } else {
                  _this2.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                }
              }
            },
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
                module: currentModule,
                cb: cb
              });
            },
            setGlobalState: function setGlobalState(partialGlobalState, changeWay) {
              if (changeWay === void 0) {
                changeWay = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
              }

              // this.cc.prepareBroadcastState(changeWay, module, null, partialGlobalState, false, false);
              ccContext.store.setGlobalState(partialGlobalState);

              _this2.$$changeState(partialGlobalState, {
                module: currentModule,
                changeWay: changeWay,
                isStateGlobal: true
              });
            },
            forceUpdate: function forceUpdate(cb) {
              _this2.$$changeState(_this2.state, {
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

              (_this2$cc = _this2.cc).invokeWith.apply(_this2$cc, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            // change other module's state
            effect: function effect(targetModule, userLogicFn) {
              var _this2$cc2;

              for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              (_this2$cc2 = _this2.cc).invokeWith.apply(_this2$cc2, [userLogicFn, {
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

              (_this2$cc3 = _this2.cc).invokeWith.apply(_this2$cc3, [userLogicFn, {
                context: true,
                module: targetModule
              }].concat(args));
            },
            invokeWith: function invokeWith(userLogicFn, _temp2) {
              var _ref2 = _temp2 === void 0 ? {} : _temp2,
                  _ref2$module = _ref2.module,
                  module = _ref2$module === void 0 ? currentModule : _ref2$module,
                  _ref2$context = _ref2.context,
                  context = _ref2$context === void 0 ? false : _ref2$context,
                  _ref2$forceSync = _ref2.forceSync,
                  forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                  cb = _ref2.cb;

              for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                args[_key4 - 2] = arguments[_key4];
              }

              isInputModuleInvalid(module, currentModule, cb, function (newCb) {
                if (context) args.unshift({
                  module: module,
                  state: getState(module),
                  effect: _this2.$$effect,
                  xeffect: _this2.$$xeffect
                });
                co_1.wrap(userLogicFn).apply(void 0, args).then(function (state) {
                  _this2.$$changeState(state, {
                    module: module,
                    forceSync: forceSync,
                    cb: newCb
                  });
                }).catch(justWarning$1);
              });
            },
            call: function call(userLogicFn) {
              var _this2$cc4;

              for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
              }

              (_this2$cc4 = _this2.cc).callWith.apply(_this2$cc4, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            callWith: function callWith(userLogicFn, _temp3) {
              var _ref3 = _temp3 === void 0 ? {} : _temp3,
                  _ref3$module = _ref3.module,
                  module = _ref3$module === void 0 ? currentModule : _ref3$module,
                  _ref3$forceSync = _ref3.forceSync,
                  forceSync = _ref3$forceSync === void 0 ? false : _ref3$forceSync,
                  cb = _ref3.cb;

              for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                args[_key6 - 2] = arguments[_key6];
              }

              isInputModuleInvalid(module, currentModule, cb, function (newCb) {
                userLogicFn.call.apply(userLogicFn, [_this2, _this2.__$$getChangeStateHandler({
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                })].concat(args));
              });
            },
            callThunk: function callThunk(userLogicFn) {
              var _this2$cc5;

              for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                args[_key7 - 1] = arguments[_key7];
              }

              (_this2$cc5 = _this2.cc).callThunkWith.apply(_this2$cc5, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            callThunkWith: function callThunkWith(userLogicFn, _temp4) {
              var _ref4 = _temp4 === void 0 ? {} : _temp4,
                  _ref4$module = _ref4.module,
                  module = _ref4$module === void 0 ? currentModule : _ref4$module,
                  _ref4$forceSync = _ref4.forceSync,
                  forceSync = _ref4$forceSync === void 0 ? false : _ref4$forceSync,
                  cb = _ref4.cb;

              for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                args[_key8 - 2] = arguments[_key8];
              }

              isInputModuleInvalid(module, currentModule, cb, function (newCb) {
                userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.__$$getChangeStateHandler({
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                }));
              });
            },
            commit: function commit(userLogicFn) {
              var _this2$cc6;

              for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
                args[_key9 - 1] = arguments[_key9];
              }

              (_this2$cc6 = _this2.cc).commitWith.apply(_this2$cc6, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            commitWith: function commitWith(userLogicFn, _temp5) {
              var _ref5 = _temp5 === void 0 ? {} : _temp5,
                  _ref5$module = _ref5.module,
                  module = _ref5$module === void 0 ? currentModule : _ref5$module,
                  _ref5$forceSync = _ref5.forceSync,
                  forceSync = _ref5$forceSync === void 0 ? false : _ref5$forceSync,
                  cb = _ref5.cb;

              for (var _len10 = arguments.length, args = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
                args[_key10 - 2] = arguments[_key10];
              }

              isInputModuleInvalid(module, currentModule, cb, function (newCb) {
                var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

                _this2.$$changeState(state, {
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                });
              });
            },
            dispatch: function dispatch(_temp6) {
              var _ref6 = _temp6 === void 0 ? {} : _temp6,
                  module = _ref6.module,
                  reducerModule = _ref6.reducerModule,
                  _ref6$forceSync = _ref6.forceSync,
                  forceSync = _ref6$forceSync === void 0 ? false : _ref6$forceSync,
                  type = _ref6.type,
                  payload = _ref6.payload,
                  reactCallback = _ref6.cb;

              var inputModule = module || currentModule;
              var currentReducerModule = _this2.cc.ccState.reducerModule;
              var targetReducerModule = reducerModule || currentReducerModule; //if reducerModule not defined, will find currentReducerModule's reducer

              var targetReducerMap = _reducer$1[targetReducerModule];
              if (!targetReducerMap) return justWarning$1("no reducerMap found for module:" + targetReducerModule);
              var reducerFn = targetReducerMap[type];
              if (!reducerFn) return justWarning$1("no reducer defined in ccContext for module:" + targetReducerModule + " type:" + type);
              var errMsg = util.isCcActionValid({
                type: type,
                payload: payload
              });
              if (errMsg) return justWarning$1(errMsg);
              var executionContext = {
                ccUniqueKey: ccUniqueKey,
                ccOption: ccOption,
                module: module,
                reducerModule: reducerModule,
                type: type,
                payload: payload,
                state: _this2.state
              };
              isInputModuleInvalid(inputModule, currentModule, reactCallback, function (newCb) {
                _this2.cc.invokeWith(reducerFn, {
                  inputModule: inputModule,
                  forceSync: forceSync,
                  cb: newCb
                }, executionContext);
              });
            },
            broadcastState: function broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone) {
              var _partialSharedState = partialSharedState;
              if (needClone) _partialSharedState = util.clone(partialSharedState); // this clone may cause performance issue, if partialSharedState is too big!!

              ccContext.store.setState(moduleName, _partialSharedState);
              var currentCcKey = _this2.cc.ccState.ccUniqueKey;
              var ccClassKey_isHandled_ = {}; //record which ccClassKey has been handled

              var ccClassKeys = moduleName_ccClassKeys_[moduleName];

              if (ccClassKeys) {
                //these ccClass subscribe the same module's state
                ccClassKeys.forEach(function (ccClassKey) {
                  ccClassKey_isHandled_[ccClassKey] = true;
                  var classContext = ccClassKey_ccClassContext_[ccClassKey];
                  var ccKeys = classContext.ccKeys,
                      sharedStateKeys = classContext.sharedStateKeys,
                      globalStateKeys = classContext.globalStateKeys;
                  if (ccKeys.length === 0) return;
                  if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return; // extract _partialSharedState! because different class with a same module may have different sharedStateKeys!!!

                  var _extractStateByKeys6 = extractStateByKeys(_partialSharedState, sharedStateKeys),
                      sharedStateForCurrentCcClass = _extractStateByKeys6.partialState,
                      isSharedStateEmpty = _extractStateByKeys6.isStateEmpty; // extract sourcePartialGlobalState! because different class watch different globalStateKeys.
                  // it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                  // just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                  var _extractStateByKeys7 = extractStateByKeys(partialGlobalState, globalStateKeys),
                      globalStateForCurrentCcClass = _extractStateByKeys7.partialState,
                      isPartialGlobalStateEmpty = _extractStateByKeys7.isStateEmpty;

                  if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;

                  var mergedStateForCurrentCcClass = _extends({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);

                  ccKeys.forEach(function (ccKey) {
                    if (ccKey === currentCcKey) return;
                    var ref = ccKey_ref_[ccKey];

                    if (ref) {
                      var option = ccKey_option_[ccKey];
                      var toSet = null,
                          changeWay = -1;

                      if (option.syncState && option.syncGlobalState) {
                        changeWay = SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE;
                        toSet = mergedStateForCurrentCcClass;
                      } else if (option.syncState) {
                        changeWay = SYNC_FROM_CC_INSTANCE_SHARED_STATE;
                        toSet = sharedStateForCurrentCcClass;
                      } else if (option.syncGlobalState) {
                        changeWay = SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE;
                        toSet = globalStateForCurrentCcClass;
                      }

                      if (toSet) {
                        if (ccContext.isDebug) {
                          console.log(ss$1("ref " + ccKey + " render triggered by broadcast's way1"), cl$1());
                        }

                        ref.cc.prepareReactSetState(changeWay, toSet);
                      }
                    }
                  });
                });
              }

              if (partialGlobalState) {
                //these ccClass are watching globalState
                globalCcClassKeys.forEach(function (ccClassKey) {
                  if (ccClassKey_isHandled_[ccClassKey]) return;
                  var classContext = ccClassKey_ccClassContext_[ccClassKey];
                  var watchingGlobalStateCcKeys = classContext.ccKeys,
                      globalStateKeys = classContext.globalStateKeys,
                      currentCcClassModule = classContext.module; // if there is no any ccInstance of this ccClass are watching globalStateKey, return;

                  if (watchingGlobalStateCcKeys.length === 0) return;
                  var originalStateOfMappingState = module_originalState_[currentCcClassModule];

                  if (originalStateOfMappingState) {
                    ccContext.store.setState(currentCcClassModule, originalStateOfMappingState);
                  }

                  var _extractStateByKeys8 = extractStateByKeys(partialGlobalState, globalStateKeys),
                      globalStateForCurrentCcClass = _extractStateByKeys8.partialState,
                      isPartialGlobalStateEmpty = _extractStateByKeys8.isStateEmpty;

                  var mappedGlobalStateForCurrentCcClass = module_globalState_[currentCcClassModule]; //!!! backup state for current module

                  ccContext.store.setGlobalState(mappedGlobalStateForCurrentCcClass);
                  if (isPartialGlobalStateEmpty && !mappedGlobalStateForCurrentCcClass && !originalStateOfMappingState) return;

                  var toSet = _extends({}, globalStateForCurrentCcClass, mappedGlobalStateForCurrentCcClass, originalStateOfMappingState);

                  watchingGlobalStateCcKeys.forEach(function (ccKey) {
                    // if (excludeTriggerRef && ccKey === currentCcKey) return;
                    var ref = ccKey_ref_[ccKey];

                    if (ref) {
                      if (ccContext.isDebug) {
                        console.log(ss$1("ref " + ccKey + " render triggered by broadcast's way2"), cl$1());
                      }

                      ref.cc.prepareReactSetState(SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE, toSet);
                    }
                  });
                });
              }
            }
          };
          this.cc.reactSetState = this.cc.reactSetState.bind(this);
          this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
          this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
          this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
          this.$$dispatch = this.cc.dispatch.bind(this);

          this.$$invoke = this.cc.invoke.bind(this);

          this.$$invokeWith = this.cc.invokeWith.bind(this);
          this.$$call = this.cc.call.bind(this);

          this.$$callWith = this.cc.callWith.bind(this);
          this.$$callThunk = this.cc.callThunk.bind(this);

          this.$$callThunkWith = this.cc.callThunkWith.bind(this);
          this.$$commit = this.cc.commit.bind(this);

          this.$$commitWith = this.cc.commitWith.bind(this);
          this.$$effect = this.cc.effect.bind(this);

          this.$$xeffect = this.cc.xeffect.bind(this);
          this.setState = this.cc.setState; //let setState call cc.setState

          this.setGlobalState = this.cc.setGlobalState; //let setState call cc.setState

          this.forceUpdate = this.cc.forceUpdate; //let forceUpdate call cc.forceUpdate
        }; // note!!! changeState do two thing, decide if it will change self's state or not, if it will broadcast state or not;
        // when ccIns's module != target module,
        //        cc will only broadcast the state to target module, caution: it will overwrite the target module's state!!
        // when ccIns's module == target module,
        //        if ccIns option.syncState is false, cc only change it's own state, 
        //           but if you pass forceSync=true, cc also will broadcast the state to target module and caution: it will overwrite the target module's state !!!
        //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module


        _proto.$$changeState = function $$changeState(state, _temp7) {
          var _this3 = this;

          var _ref7 = _temp7 === void 0 ? {} : _temp7,
              _ref7$isStateGlobal = _ref7.isStateGlobal,
              isStateGlobal = _ref7$isStateGlobal === void 0 ? false : _ref7$isStateGlobal,
              module = _ref7.module,
              changeWay = _ref7.changeWay,
              forceSync = _ref7.forceSync,
              reactCallback = _ref7.cb;

          //executionContext
          var ccState = this.cc.ccState;
          var currentModule = ccState.module;

          if (module === currentModule) {
            // who trigger $$changeState, who will go to change the whole received state 
            this.cc.prepareReactSetState(changeWay || CHANGE_BY_SELF, state, isStateGlobal, function () {
              //if forceSync=true, cc clone the input state
              if (forceSync) {
                _this3.cc.prepareBroadcastState(changeWay || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, forceSync);
              } else if (ccState.ccOption.syncState) {
                _this3.cc.prepareBroadcastState(changeWay || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
              }
            }, reactCallback);
          } else {
            if (forceSync) justWarning$1("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi$1("module:" + module + " currentModule" + currentModule));
            if (reactCallback) justWarning$1("callback for react.setState will be ignore");
            this.cc.prepareBroadcastState(changeWay || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
          }
        }; //{ module, forceSync, cb }


        _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
          var _this4 = this;

          return function (state) {
            _this4.$$changeState(state, executionContext);
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
          unsetCcInstanceRef(ccKeys, ccUniqueKey); //如果父组件实现了componentWillUnmount，要调用一遍

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

  /****
   * if you are sure this state is really belong to global state, call cc.setGlobalState,
   * cc will only pass this state to global module
   */

  function setGlobalState (state) {
    try {
      var ref = pickOneRef();
      ref.setGlobalState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
    } catch (err) {
      ccContext.store.setState(MODULE_GLOBAL, state); //store this state to global;

      util.justWarning(err.message);
    }
  }

  ccContext.startup = startup;
  ccContext.register = register;
  ccContext.invoke = invoke;
  ccContext.setGlobalState = setGlobalState;
  ccContext.setState = setState;

  return ccContext;

})));
