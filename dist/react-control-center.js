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
  var MODULE_CC = '$$cc';
  var MODULE_CC_LIKE = [MODULE_CC, '$$cC', '$$Cc', '$$CC'];
  var ERR = {
    CC_ALREADY_STARTUP: 1000,
    CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
    CC_CLASS_KEY_DUPLICATE: 1002,
    CC_CLASS_NOT_FOUND: 1003,
    CC_CLASS_STORE_MODULE_INVALID: 1004,
    CC_CLASS_REDUCER_MODULE_INVALID: 1005,
    CC_CLASS_INSTANCE_KEY_DUPLICATE: 1006,
    CC_CLASS_INSTANCE_OPTION_INVALID: 1007,
    CC_CLASS_INSTANCE_NOT_FOUND: 1008,
    CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1009,
    CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1010,
    MODULE_KEY_CC_FOUND: 1100,
    STORE_KEY_NAMING_INVALID: 1101,
    STORE_MODULE_VALUE_INVALID: 1102,
    REDUCER_ACTION_TYPE_NAMING_INVALID: 1201,
    REDUCER_ACTION_TYPE_NO_MODULE: 1202 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it in you store or reducers! ', _ERR_MESSAGE[ERR.STORE_KEY_NAMING_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.STORE_MODULE_VALUE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE);

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
  function verifyActionType(type) {
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
  function makeCcClassContext(module, sharedStateKeys) {
    return {
      module: module,
      sharedStateKeys: sharedStateKeys,
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
  function verifyModuleName(moduleName) {
    return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
  }
  function verifyModuleValue(value) {
    return isPlainJsonObject(value);
  }
  function verifyCcOption(ccOption) {
    return isPlainJsonObject(ccOption);
  }
  function verifyCcAction(action) {
    var errMessage = '';

    if (!action) {
      errMessage = 'trying to dispatch an null action is meaningless!';
    } else {
      var type = action.type,
          payload = action.payload;

      if (!verifyActionType(type)) {
        errMessage += 'action type must be string and length must LTE 1! ';
      }

      if (!isPlainJsonObject(payload, true)) {
        errMessage += 'payload must be a plain json object! ';
      }
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
    return "CC" + className;
  }
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  var util = {
    makeError: makeError,
    isHotReloadMode: isHotReloadMode,
    makeCcClassContext: makeCcClassContext,
    makeStateMail: makeStateMail,
    makeUniqueCcKey: makeUniqueCcKey,
    verifyActionType: verifyActionType,
    verifyModuleName: verifyModuleName,
    verifyModuleValue: verifyModuleValue,
    verifyCcOption: verifyCcOption,
    verifyCcAction: verifyCcAction,
    isPlainJsonObject: isPlainJsonObject,
    isValueNotNull: isValueNotNull,
    disassembleActionType: disassembleActionType,
    verboseInfo: verboseInfo,
    bindThis: bindThis,
    ccClassDisplayName: ccClassDisplayName,
    clone: clone
  };

  var _state2, _reducers;
  var refs = {};
  /**
   ccClassContext:{
    ccKeys: [],
    ccKey_componentRef_: {},
    ccKey_option_: {},
   }
   */

  var ccContext = {
    // if isStrict is true, every error will be throw out instead of console.error, 
    // but this may crash your app, make sure you have a nice error handling way,
    // like componentDidCatch in react 16.*
    isDebug: false,
    isStrict: false,
    returnRootState: false,
    isModuleMode: false,
    isCcAlreadyStartup: false,
    moduleName_ccClassKeys_: {},
    ccClassKey_ccClassContext_: {},
    store: {
      _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
      getState: function getState() {
        if (ccContext.returnRootState) {
          return ccContext.store._state;
        } else {
          if (ccContext.isModuleMode) {
            return ccContext.store._state;
          } else {
            return ccContext.store._state[MODULE_GLOBAL];
          }
        }
      },
      setState: function setState(module, partialModuleState) {
        var _state = ccContext.store._state;
        var fullModuleState = _state[module];

        var mergedState = _extends({}, fullModuleState, partialModuleState);

        _state[module] = mergedState;
      }
    },
    reducer: {
      _reducers: (_reducers = {}, _reducers[MODULE_GLOBAL] = {}, _reducers[MODULE_CC] = {}, _reducers)
    },
    ccKey_ref_: refs,
    ccKey_option_: {},
    refs: refs,
    info: {
      startupTime: Date.now()
    }
  };

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


  function startup (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$store = _ref.store,
        store = _ref$store === void 0 ? {} : _ref$store,
        _ref$reducers = _ref.reducers,
        reducers = _ref$reducers === void 0 ? {} : _ref$reducers,
        _ref$enableInvoke = _ref.enableInvoke,
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

  var vbi$1 = util.verboseInfo;
  var me = util.makeError;
  var ccClassDisplayName$1 = util.ccClassDisplayName;
  var _state = ccContext.store._state,
      _reducers$1 = ccContext.reducer._reducers;

  var cl = function cl(color) {
    if (color === void 0) {
      color = 'green';
    }

    return "color:" + color + ";border:1px solid " + color;
  };

  var info = function info(str) {
    return "%c" + str;
  };

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

  function extractSharedState(state, sharedStateKeys) {
    if (!isStateValid(state)) {
      return {
        sharedState: {},
        isStateEmpty: true
      };
    }

    var newState = {};
    var isStateEmpty = true;
    sharedStateKeys.forEach(function (key) {
      var value = state[key];

      if (util.isValueNotNull(value)) {
        newState[key] = value;
        isStateEmpty = false;
      }
    });
    return {
      sharedState: newState,
      isStateEmpty: isStateEmpty
    };
  }

  function handleError(err, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (throwError) throw err;else {
      console.error(' ------------ CC WARNING ------------');
      console.error(err.message);
    }
  }

  function checkStoreModule(module, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (!ccContext.isModuleMode) {
      if (module !== MODULE_GLOBAL) {
        handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "module:" + module), throwError);
        return false;
      } else return true;
    } else {
      if (!_state[module]) {
        handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, "module:" + module), throwError);
        return false;
      } else return true;
    }
  }

  function checkReducerModule(reducerModule, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (!ccContext.isModuleMode) {
      if (reducerModule != MODULE_GLOBAL) {
        handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "reducerModule:" + reducerModule), throwError);
      }
    } else {
      if (!_reducers$1[reducerModule]) {
        handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, "reducerModule:" + reducerModule), throwError);
      }
    }
  }

  function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
    if (ccContext.isDebug) {
      console.log(info(ccUniqueKey + " unset ref"), cl('red'));
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
  }

  function ifCallWillExecute(module, currentModule, reactCallback, cb) {
    var targetCb = reactCallback;

    if (checkStoreModule(module, false)) {
      if (module != currentModule) {
        if (reactCallback) {
          handleError(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$1(paramCallBackShouldNotSupply(module, currentModule))), false);
          targetCb = null; //let user's reactCallback has no change to be triggered
        }
      }

      cb(targetCb);
    }
  }
  /*
  options.module = 'xxx'
  options.sharedStateKeys = ['aa', 'bbb']
  */


  function register(ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_GLOBAL : _ref$module,
        reducerModule = _ref.reducerModule,
        _ref$sharedStateKeys = _ref.sharedStateKeys,
        sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys;

    var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


    checkStoreModule(module);
    checkReducerModule(_reducerModule);
    var contextMap = ccContext.ccClassKey_ccClassContext_;

    if (contextMap[ccClassKey] !== undefined) {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    } else {
      contextMap[ccClassKey] = util.makeCcClassContext(module, sharedStateKeys);
    }

    var ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module];
    if (!ccClassKeys_) ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module] = [];
    ccClassKeys_.push(ccClassKey);
    return function (ReactClass) {
      var CcClass =
      /*#__PURE__*/
      function (_ReactClass) {
        _inheritsLoose(CcClass, _ReactClass);

        function CcClass(props, context) {
          var _this;

          _this = _ReactClass.call(this, props, context) || this;
          var ccKey = props.ccKey,
              _props$ccOption = props.ccOption,
              ccOption = _props$ccOption === void 0 ? {
            syncState: true
          } : _props$ccOption;
          util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['bindDataToCcClassContext', 'mapCcToInstance', 'broadcastState', 'changeState', 'syncStateToOtherCcComponent', 'changeStateClosureReactCb']);
          var ccUniqueKey;
          var isCcUniqueKeyAutoGenerated = false;

          if (ccKey) {
            ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
          } else {
            ccUniqueKey = ccClassKey + "/" + uuid_1();
            isCcUniqueKeyAutoGenerated = true;
            ccKey = ccUniqueKey;
          }

          var ccClassContext = _this.bindDataToCcClassContext(ccClassKey, ccKey, ccUniqueKey, ccOption);

          _this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys);

          return _this;
        } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


        var _proto = CcClass.prototype;

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
          return this.state !== nextState;
        };

        _proto.componentDidCatch = function componentDidCatch() {
          console.log('componentDidCatch');
        };

        _proto.componentDidMount = function componentDidMount() {
          if (_ReactClass.prototype.componentDidMount) _ReactClass.prototype.componentDidMount.call(this);
          var _this$cc$ccState = this.cc.ccState,
              module = _this$cc$ccState.module,
              sharedStateKeys = _this$cc$ccState.sharedStateKeys,
              ccOption = _this$cc$ccState.ccOption;
          var state = ccContext.store._state[module];

          var _extractSharedState = extractSharedState(state, sharedStateKeys),
              sharedState = _extractSharedState.sharedState,
              isStateEmpty = _extractSharedState.isStateEmpty;

          if (!isStateEmpty && ccOption.syncState) {
            //sync store's state to instance
            this.cc.reactSetState(sharedState);
          }
        };

        _proto.bindDataToCcClassContext = function bindDataToCcClassContext(ccClassKey, ccKey, ccUniqueKey, ccOption) {
          var classContext = contextMap[ccClassKey];
          var ccKeys = classContext.ccKeys;

          if (ccContext.isDebug) {
            console.log(info("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
          }

          var option;
          if (!ccOption) option = {
            syncState: true
          };else {
            if (!util.verifyCcOption(ccOption)) {
              throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
            }

            option = ccOption;
          }

          if (ccKeys.includes(ccUniqueKey)) {
            if (util.isHotReloadMode()) {
              if (getCcKeyInsCount(ccUniqueKey) > 2) {
                // now cc can make sure the ccKey duplicate
                throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
              } // just warning


              console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
              console.error(vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not well,
              // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
              // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
              // so cc set ref later

              setCcInstanceRef(ccUniqueKey, this, ccKeys, option, 600);
            } else {
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            }
          } else {
            setCcInstanceRef(ccUniqueKey, this, ccKeys, option);
          }

          return classContext;
        };

        _proto.mapCcToInstance = function mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys) {
          var _this2 = this;

          var reactSetStateRef = this.setState.bind(this);
          var reactForceUpdateRef = this.forceUpdate.bind(this);
          var ccState = {
            renderCount: 0,
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: currentModule,
            reducerModule: reducerModule,
            sharedStateKeys: sharedStateKeys
          };
          this.cc = {
            ccState: ccState,
            ccUniqueKey: ccUniqueKey,
            ccKey: ccKey,
            reactSetState: function reactSetState(state, cb) {
              ccState.renderCount += 1;
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: function reactForceUpdate(state, cb) {
              ccState.renderCount += 1;
              reactForceUpdateRef(state, cb);
            },
            setState: this.changeState,
            forceUpdate: function forceUpdate(cb) {
              _this2.changeState(_this2.state, cb);
            },
            call: function call(userLogicFn) {
              var _this2$cc;

              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }

              (_this2$cc = _this2.cc).callWith.apply(_this2$cc, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            // note! see changeStateClosureExecutionContext implement
            // when ccIns's module != target module,
            //         cc will only broadcast the state to target module and overwrite the target module's state
            // when ccIns's module == target module,
            //        if ccIns option.syncState is false, cc only change it's own state, 
            //           but if you pass forceSync=true, cc also will broadcast the state to target module and >>> overwrite the target module's state !<<<
            //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module
            callWith: function callWith(userLogicFn, _temp2) {
              var _ref2 = _temp2 === void 0 ? {} : _temp2,
                  _ref2$module = _ref2.module,
                  module = _ref2$module === void 0 ? currentModule : _ref2$module,
                  _ref2$forceSync = _ref2.forceSync,
                  forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                  cb = _ref2.cb;

              for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              ifCallWillExecute(module, currentModule, cb, function (newCb) {
                userLogicFn.call.apply(userLogicFn, [_this2, _this2.changeStateClosureExecutionContext({
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                })].concat(args));
              });
            },
            callThunk: function callThunk(userLogicFn) {
              var _this2$cc2;

              for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
              }

              (_this2$cc2 = _this2.cc).callThunkWith.apply(_this2$cc2, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            callThunkWith: function callThunkWith(userLogicFn, _temp3) {
              var _ref3 = _temp3 === void 0 ? {} : _temp3,
                  _ref3$module = _ref3.module,
                  module = _ref3$module === void 0 ? currentModule : _ref3$module,
                  _ref3$forceSync = _ref3.forceSync,
                  forceSync = _ref3$forceSync === void 0 ? false : _ref3$forceSync,
                  cb = _ref3.cb;

              for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                args[_key4 - 2] = arguments[_key4];
              }

              ifCallWillExecute(module, currentModule, cb, function (newCb) {
                userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.changeStateClosureExecutionContext({
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                }));
              });
            },
            commit: function commit(userLogicFn) {
              var _this2$cc3;

              for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
              }

              (_this2$cc3 = _this2.cc).commitWith.apply(_this2$cc3, [userLogicFn, {
                module: currentModule
              }].concat(args));
            },
            commitWith: function commitWith(userLogicFn, _temp4) {
              var _ref4 = _temp4 === void 0 ? {} : _temp4,
                  _ref4$module = _ref4.module,
                  module = _ref4$module === void 0 ? currentModule : _ref4$module,
                  _ref4$forceSync = _ref4.forceSync,
                  forceSync = _ref4$forceSync === void 0 ? false : _ref4$forceSync,
                  cb = _ref4.cb;

              for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                args[_key6 - 2] = arguments[_key6];
              }

              ifCallWillExecute(module, currentModule, cb, function (newCb) {
                var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

                _this2.changeStateWithExecutionContext(state, {
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                });
              });
            },
            dispatch: function dispatch(_temp5) {
              var _ref5 = _temp5 === void 0 ? {} : _temp5,
                  reducerModule = _ref5.reducerModule,
                  type = _ref5.type,
                  payload = _ref5.payload,
                  cb = _ref5.cb;

              var currentReducerModule = _this2.cc.ccState.reducerModule;
              var targetModule = reducerModule || currentReducerModule; //if reducerModule not defined, will find currentReducerModule's reducer

              var executionContext = {
                ccUniqueKey: ccUniqueKey,
                ccOption: ccOption,
                module: module,
                reducerModule: reducerModule,
                type: type,
                state: _this2.state
              };
              var targetReducerMap = _reducers$1[targetModule];
              if (!targetReducerMap) return console.error("no reducerMap found for module:" + targetModule);
              var reducerFn = targetReducerMap[type];
              if (!reducerFn) return console.error("no reducer defined in ccContext for module:" + targetModule + "/type:" + type);
              var errMsg = util.verifyCcAction({
                type: type,
                payload: payload
              });
              if (errMsg) return console.error(errMsg);

              if (cb) {
                reducerFn(_this2.changeStateClosureReactCb(cb), payload, executionContext);
              } else {
                reducerFn(_this2.changeState, payload, executionContext);
              }
            },
            dispatchPayload: function dispatchPayload(type, payload, module, cb) {
              if (module === void 0) {
                module = module;
              }

              _this2.cc.dispatch({
                module: module,
                type: type,
                payload: payload,
                cb: cb
              });
            }
          };
          this.cc.reactSetState = this.cc.reactSetState.bind(this);
          this.$dispatch = this.cc.dispatch; //let CCComponent instance can call dispatch directly

          this.$dispatchPayload = this.cc.dispatchPayload; //let CCComponent instance can call dispatchPayload directly

          this.setState = this.cc.setState; //let setState call cc.setState

          this.forceUpdate = this.cc.forceUpdate; //let forceUpdate call cc.forceUpdate

          this.$call = this.cc.call;
          this.$callWith = this.cc.callWith;
          this.$callThunk = this.cc.callThunk;
          this.$callThunkWith = this.cc.callThunkWith;
          this.$commit = this.cc.commit;
          this.$commitWith = this.cc.commitWith;
        };

        _proto.changeStateWithExecutionContext = function changeStateWithExecutionContext(state, _ref6) {
          var module = _ref6.module,
              forceSync = _ref6.forceSync,
              cb = _ref6.cb;

          if (module === this.cc.ccState.module) {
            this.cc.reactSetState(state, cb);

            if (this.cc.ccState.ccOption.syncState) {
              this.broadcastState(module, state);
            } else if (forceSync) {
              this.broadcastState(module, util.clone(state));
            }
          } else {
            this.broadcastState(module, util.clone(state));
          }
        };

        _proto.changeStateClosureExecutionContext = function changeStateClosureExecutionContext(_ref7) {
          var _this3 = this;

          var module = _ref7.module,
              forceSync = _ref7.forceSync,
              cb = _ref7.cb;
          return function (state) {
            _this3.changeStateWithExecutionContext(state, {
              module: module,
              forceSync: forceSync,
              cb: cb
            });
          };
        };

        _proto.changeStateClosureReactCb = function changeStateClosureReactCb(cb) {
          var _this4 = this;

          return function (state) {
            _this4.changeState(state, cb);
          };
        };

        _proto.changeState = function changeState(state, reactCallback) {
          var _this$cc$ccState2 = this.cc.ccState,
              module = _this$cc$ccState2.module,
              ccOption = _this$cc$ccState2.ccOption; // who dispatch the action, who will go to change the whole received state 

          this.cc.reactSetState(state, reactCallback);

          if (ccOption.syncState) {
            this.broadcastState(module, state);
          }
        };

        _proto.broadcastState = function broadcastState(module, state) {
          var sharedStateKeys = this.cc.ccState.sharedStateKeys;

          var _extractSharedState2 = extractSharedState(state, sharedStateKeys),
              sharedState = _extractSharedState2.sharedState,
              isStateEmpty = _extractSharedState2.isStateEmpty;

          if (!isStateEmpty) {
            ccContext.store.setState(module, sharedState);
            this.syncStateToOtherCcComponent(module, sharedState);
          }
        };

        _proto.syncStateToOtherCcComponent = function syncStateToOtherCcComponent(moduleName, sourceSharedState) {
          var currentCcKey = this.cc.ccState.ccUniqueKey;
          var ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName];
          var ccKey_ref_ = ccContext.ccKey_ref_;
          var ccKey_option_ = ccContext.ccKey_option_; //these ccClass subscribe the same module's state

          ccClassKeys.forEach(function (classKey) {
            var classContext = ccContext.ccClassKey_ccClassContext_[classKey];
            var ccKeys = classContext.ccKeys,
                sharedStateKeys = classContext.sharedStateKeys;
            if (sharedStateKeys.length === 0) return; // extractSharedState again! because different class with a same module may have different sharedStateKeys!!!

            var _extractSharedState3 = extractSharedState(sourceSharedState, sharedStateKeys),
                sharedStateForCurrentCcClass = _extractSharedState3.sharedState,
                isStateEmpty = _extractSharedState3.isStateEmpty;

            if (isStateEmpty) return;
            ccKeys.forEach(function (ccKey) {
              if (ccKey !== currentCcKey) {
                //exclude currentCcKey, it's reactSetState may have been invoked 
                var ref = ccKey_ref_[ccKey];

                if (ref) {
                  var option = ccKey_option_[ccKey];
                  if (option.syncState) ref.cc.reactSetState(sharedStateForCurrentCcClass);
                }
              }
            });
          });
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          //如果父组件实现了componentWillUnmount，要调用一遍
          if (_ReactClass.prototype.componentWillUnmount) _ReactClass.prototype.componentWillUnmount.call(this);
          var _this$cc$ccState3 = this.cc.ccState,
              ccUniqueKey = _this$cc$ccState3.ccUniqueKey,
              ccKeys = _this$cc$ccState3.ccClassContext.ccKeys;
          unsetCcInstanceRef(ccKeys, ccUniqueKey);
        };

        _proto.render = function render() {
          if (ccContext.isDebug) {
            console.log(info("@@@ " + ccClassDisplayName$1(ccClassKey) + " render"), cl());
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
  var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      ccKey_ref_ = ccContext.ccKey_ref_;
  function invoke (ccClassKey, ccInstanceKey, method) {
    var _ref$method;

    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext) {
      var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi$2(" ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
    var ref = ccKey_ref_[ccKey];

    if (!ref) {
      var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi$2(" ccClassKey:" + ccClassKey + "/ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


      return console.error(_err.message);
    }

    var fn = ref[method];

    if (!fn) {
      var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi$2(" method:" + method));

      return console.error(_err2.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
  }

  ccContext.startup = startup;
  ccContext.register = register;
  ccContext.invoke = invoke;

  return ccContext;

})));
