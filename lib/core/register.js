"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = register;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireWildcard(require("../cc-context"));

var _util = _interopRequireWildcard(require("../support/util"));

var _uuid = _interopRequireDefault(require("uuid"));

var _co = _interopRequireDefault(require("co"));

var verifyKeys = _util.default.verifyKeys,
    ccClassDisplayName = _util.default.ccClassDisplayName,
    styleStr = _util.default.styleStr,
    color = _util.default.color,
    verboseInfo = _util.default.verboseInfo,
    makeError = _util.default.makeError,
    justWarning = _util.default.justWarning;
var _ccContext$store = _ccContext.default.store,
    _state = _ccContext$store._state,
    getState = _ccContext$store.getState,
    _reducer = _ccContext.default.reducer._reducer,
    refStore = _ccContext.default.refStore,
    globalMappingKey_sharedKey_ = _ccContext.default.globalMappingKey_sharedKey_,
    moduleName_sharedStateKeys_ = _ccContext.default.moduleName_sharedStateKeys_,
    moduleName_globalStateKeys_ = _ccContext.default.moduleName_globalStateKeys_,
    ccKey_ref_ = _ccContext.default.ccKey_ref_,
    ccKey_option_ = _ccContext.default.ccKey_option_,
    globalCcClassKeys = _ccContext.default.globalCcClassKeys,
    moduleName_ccClassKeys_ = _ccContext.default.moduleName_ccClassKeys_,
    ccClassKey_ccClassContext_ = _ccContext.default.ccClassKey_ccClassContext_,
    ccGlobalStateKeys = _ccContext.default.globalStateKeys,
    globalMappingKey_toModules_ = _ccContext.default.globalMappingKey_toModules_,
    globalMappingKey_fromModule_ = _ccContext.default.globalMappingKey_fromModule_,
    globalKey_toModules_ = _ccContext.default.globalKey_toModules_,
    sharedKey_globalMappingKeyDescriptor_ = _ccContext.default.sharedKey_globalMappingKeyDescriptor_;
var cl = color;
var ss = styleStr;
var me = makeError;
var vbi = verboseInfo;
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
  if (!state || !_util.default.isPlainJsonObject(state)) {
    return false;
  } else {
    return true;
  }
}

function extractStateByKeys(state, targetKeys) {
  if (!isStateValid(state) || !_util.default.isObjectNotNull(state)) {
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
    justWarning(err);
  }
}

function checkStoreModule(module, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!_ccContext.default.isModuleMode) {
    if (module !== _constant.MODULE_DEFAULT) {
      handleError(me(_constant.ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi("module:" + module)), throwError);
      return false;
    } else return true;
  } else {
    if (module === _constant.MODULE_GLOBAL) {
      handleError(me(_constant.ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
      return false;
    }

    if (!_state[module]) {
      handleError(me(_constant.ERR.CC_CLASS_STORE_MODULE_INVALID, vbi("module:" + module + " is not configured in cc's store")), throwError);
      return false;
    } else return true;
  }
}

function checkReducerModule(reducerModule, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!_ccContext.default.isModuleMode) {
    if (reducerModule != _constant.MODULE_DEFAULT) {
      handleError(me(_constant.ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "reducerModule:" + reducerModule), throwError);
    }
  } else {//this check can be optional?? if user don't configure a reducer for a module, may be he really don't want to use dispatch
    // if (!_reducer[reducerModule]) {
    //   handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, `reducerModule:${reducerModule}`), throwError);
    // }
  }
}

function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
  if (_ccContext.default.isDebug) {
    console.log(ss(ccUniqueKey + " unset ref"), cl('red'));
  } // ccContext.ccKey_ref_[ccUniqueKey] = null;


  delete _ccContext.default.ccKey_ref_[ccUniqueKey];
  delete _ccContext.default.ccKey_option_[ccUniqueKey];
  var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  decCcKeyInsCount(ccUniqueKey);
}

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
  function setRef() {
    _ccContext.default.ccKey_ref_[ccUniqueKey] = ref;
    ccKeys.push(ccUniqueKey);
    _ccContext.default.ccKey_option_[ccUniqueKey] = option;
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
        justWarning(me(_constant.ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
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
    if (ccKey) justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:" + ccKey);
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = _util.default.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      var uuidStr = (0, _uuid.default)().replace(/-/g, '_');
      ccUniqueKey = _util.default.makeUniqueCcKey(ccClassKey, uuidStr);
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

  if (_ccContext.default.isModuleMode) {
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
        justWarning(stateKeyDuplicateInNonModuleWarning + ' ' + verboseInfo("module " + module + ", ccClassKey" + ccClassKey + ", ccInstance state of these keys will been ignored: " + duplicateKeys.toString()));
      }

      sharedStateKeys = Object.keys(defaultModuleState);
    } else if (inputSharedStateKeys === undefined) {
      sharedStateKeys = [];
    }
  }

  if (inputGlobalStateKeys === 'all') {
    globalStateKeys = Object.keys(getState(_constant.MODULE_GLOBAL));
  }

  var _verifyKeys = verifyKeys(sharedStateKeys, globalStateKeys),
      duplicate = _verifyKeys.duplicate,
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  if (keyElementNotString) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey));
  }

  if (duplicate) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey + " globalStateKeys:" + globalStateKeys + " sharedStateKeys:" + sharedStateKeys));
  }

  var globalState = getState(_constant.MODULE_GLOBAL);
  var hasGlobalMappingKeyInSharedStateKeys = false;
  var matchedGlobalKey, matchedSharedKey;
  var len = globalStateKeys.length;

  for (var i = 0; i < len; i++) {
    var gKey = globalStateKeys[i];

    if (globalState[gKey] === undefined) {
      throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi("ccClassKey:" + ccClassKey + ", invalid key in globalStateKeys is [" + gKey + "]"));
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
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi("ccClassKey [" + ccClassKey + "], invalid global key [" + matchedGlobalKey + "], matched state key [" + matchedSharedKey + "]"));
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
  var ccSetState = _ccContext.default.store.setState;
  var globalState = getState(_constant.MODULE_GLOBAL);

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
    ccSetState(_constant.MODULE_GLOBAL, partialGlobalState);
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
        var modulePartialGlobalState = _util.default.safeGetObjectFromObject(module_globalState_, m);

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
          var modulePartialGlobalState = _util.default.safeGetObjectFromObject(module_globalState_, m);

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
    var toModules = _util.default.safeGetArrayFromObject(globalKey_toModules_, gKey); // because cc allow multi class register to a same module, so here judge if toModules includes module or not


    if (!toModules.includes(_curStateModule)) {
      toModules.push(_curStateModule);
    }
  });
}

function mapGlobalMappingKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(function (gKey) {
    var toModules = _util.default.safeGetArrayFromObject(globalMappingKey_toModules_, gKey);

    if (globalMappingKey_sharedKey_[gKey]) {
      //  if this gKey is globalMappingKey
      if (!toModules.includes(_curStateModule)) toModules.push(_curStateModule);
    }
  });
} //to let cc know a specified module are watching what globalStateKeys


function mapModuleAndGlobalStateKeys(moduleName, partialGlobalStateKeys) {
  var globalStateKeysOfModule = _util.default.safeGetArrayFromObject(moduleName_globalStateKeys_, moduleName);

  partialGlobalStateKeys.forEach(function (gKey) {
    if (!globalStateKeysOfModule.includes(gKey)) globalStateKeysOfModule.push(gKey);
  });
} //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, sharedStateKeys, globalStateKeys) {
  var contextMap = _ccContext.default.ccClassKey_ccClassContext_;

  if (contextMap[ccClassKey] !== undefined) {
    throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  } else {
    contextMap[ccClassKey] = _util.default.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys);
  }
}

function mapModuleAndCcClassKeys(moduleName, ccClassKey) {
  var ccClassKeys = _util.default.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

  if (ccClassKeys.includes(ccClassKey)) {
    throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  }

  var moduleSingleClass = _ccContext.default.moduleSingleClass;

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw me(_constant.ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi("module " + moduleName + ", ccClassKey " + ccClassKey));
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

  if (stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    globalStateKeys = ccClassGlobalStateKeys;
    sharedStateKeys = ccClassSharedStateKeys;
  } else if (stateFor === _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
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

  if (targetGlobalStateKeys.length > 0) _ccContext.default.globalCcClassKeys.push(ccClassKey);
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
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
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

  if (_ccContext.default.isModuleMode) {
    var _mapModuleAssociateDa = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, null, inputSharedStateKeys, inputGlobalStateKeys),
        sKeys = _mapModuleAssociateDa.sharedStateKeys,
        gKeys = _mapModuleAssociateDa.globalStateKeys;

    sharedStateKeys = sKeys, globalStateKeys = gKeys;
  } else {//  for non module mode, map operation delay execute until one ccInstance generated
  }

  return function (ReactClass) {
    if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
      throw me(_constant.ERR.CC_REGISTER_A_CC_CLASS, vbi("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
    }

    var CcClass =
    /*#__PURE__*/
    function (_ReactClass) {
      (0, _inheritsLoose2.default)(CcClass, _ReactClass);

      function CcClass(props, context) {
        var _this;

        _this = _ReactClass.call(this, props, context) || this;
        if (!_this.state) _this.state = {};
        var ccKey = props.ccKey,
            _props$ccOption = props.ccOption,
            ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;

        _util.default.bindThis((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), ['__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState', '__$$getDispatchHandler']);

        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = []; // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing

        if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

        if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
        if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
        var asyncLifecycleHook = ccOption.asyncLifecycleHook,
            storedStateKeys = ccOption.storedStateKeys;

        if (!_ccContext.default.isModuleMode) {
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
        var globalState = _state[_constant.MODULE_GLOBAL];
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
        this.state = (0, _extends2.default)({}, selfState, refState, partialSharedState, partialGlobalState);
      };

      _proto.__$$bindDataToCcClassContext = function __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
        var classContext = _ccContext.default.ccClassKey_ccClassContext_[ccClassKey];
        var ccKeys = classContext.ccKeys;

        if (_ccContext.default.isDebug) {
          console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
        }

        if (!_util.default.isCcOptionValid(ccOption)) {
          throw me(_constant.ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (_util.default.isHotReloadMode()) {
            var insCount = getCcKeyInsCount(ccUniqueKey);
            if (isSingle && insCount > 1) throw me(_constant.ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

            if (insCount > 2) {
              // now cc can make sure the ccKey duplicate
              throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            } // just warning


            console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
            console.error(vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not very well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later

            setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption, 600);
          } else {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
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

        var _verifyKeys2 = verifyKeys(sharedStateKeys, storedStateKeys),
            duplicate = _verifyKeys2.duplicate,
            notArray = _verifyKeys2.notArray,
            keyElementNotString = _verifyKeys2.keyElementNotString;

        if (notArray) {
          throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
        }

        if (keyElementNotString) {
          throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
        }

        if (duplicate) {
          throw me(_constant.ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
        }

        if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
          throw me(_constant.ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey));
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
              stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
              module: currentModule,
              cb: cb
            });
          },
          setGlobalState: function setGlobalState(partialGlobalState, broadcastTriggeredBy) {
            if (broadcastTriggeredBy === void 0) {
              broadcastTriggeredBy = _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
            }

            _ccContext.default.store.setGlobalState(partialGlobalState);

            _this2.$$changeState(partialGlobalState, {
              module: currentModule,
              broadcastTriggeredBy: broadcastTriggeredBy,
              isStateGlobal: true
            });
          },
          forceUpdate: function forceUpdate(cb) {
            _this2.$$changeState(_this2.state, {
              stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
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
              stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
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
              stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
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
              stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
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
              stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
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

              _co.default.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
                _this2.$$changeState(partialState, {
                  stateFor: stateFor,
                  module: targetModule,
                  forceSync: forceSync,
                  cb: newCb
                });
              }).catch(justWarning);
            });
          },
          call: function call(userLogicFn) {
            var _this2$cc5;

            for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
              args[_key6 - 1] = arguments[_key6];
            }

            (_this2$cc5 = _this2.cc).__callWith.apply(_this2$cc5, [userLogicFn, {
              stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
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
              stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
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
              stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
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
              stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
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
              stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
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
              stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
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
            var targetReducerMap = _reducer[targetReducerModule];
            if (!targetReducerMap) return justWarning("no reducerMap found for module:" + targetReducerModule);
            var reducerFn = targetReducerMap[type];
            if (!reducerFn) return justWarning("no reducer defined in ccContext for module:" + targetReducerModule + " type:" + type); // const errMsg = util.isCcActionValid({ type, payload });
            // if (errMsg) return justWarning(errMsg);

            var contextDispatch = _this2.__$$getDispatchHandler(_constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE);

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
              justWarning("\n                note! you are calling method setGlobalState, but the state you commit include some invalid keys which is not declared in cc's global state, \n                cc will ignore them, but if this result is not as you expected, please check your committed global state!");
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
              return justWarning(err.message + " prepareBroadcastState failed!");
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
            if (needClone) _partialSharedState = _util.default.clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

            _ccContext.default.store.setState(moduleName, _partialSharedState);

            var currentCcKey = _this2.cc.ccState.ccUniqueKey;
            var ccClassKey_isHandled_ = {}; //record which ccClassKey has been handled
            // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
            // so flag ignoreCurrentCcKey as true;

            var ignoreCurrentCcKey = stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
            var ccClassKeys = moduleName_ccClassKeys_[moduleName];

            if (ccClassKeys) {
              //  these ccClass are watching the same module's state
              ccClassKeys.forEach(function (ccClassKey) {
                //  flag this ccClassKey been handled
                ccClassKey_isHandled_[ccClassKey] = true;
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
                var mergedStateForCurrentCcClass = (0, _extends2.default)({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);
                ccKeys.forEach(function (ccKey) {
                  if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
                  var ref = ccKey_ref_[ccKey];

                  if (ref) {
                    var option = ccKey_option_[ccKey];
                    var toSet = null,
                        changeBy = -1;

                    if (option.syncSharedState && option.syncGlobalState) {
                      changeBy = _constant.CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE;
                      toSet = mergedStateForCurrentCcClass;
                    } else if (option.syncSharedState) {
                      changeBy = _constant.CHANGE_BY_BROADCASTED_SHARED_STATE;
                      toSet = sharedStateForCurrentCcClass;
                    } else if (option.syncGlobalState) {
                      changeBy = _constant.CHANGE_BY_BROADCASTED_GLOBAL_STATE;
                      toSet = globalStateForCurrentCcClass;
                    }

                    if (toSet) {
                      if (_ccContext.default.isDebug) {
                        console.log(ss("ref " + ccKey + " to be rendered state(changeBy " + changeBy + ") is broadcast from same module's other ref " + currentCcKey), cl());
                      }

                      ref.cc.prepareReactSetState(changeBy, toSet);
                    }

                    ;
                  }
                });
              });
            }

            if (_util.default.isObjectNotNull(module_globalState_)) {
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
                        if (_ccContext.default.isDebug) {
                          console.log(ss("ref " + ccKey + " to be rendered state(only global state) is broadcast from other module " + moduleName), cl());
                        }

                        ref.cc.prepareReactSetState(_constant.CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, globalStateForCurrentCcClass);
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
                      ref.cc.prepareReactSetState(_constant.CHANGE_BY_BROADCASTED_GLOBAL_STATE, partialState);
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

        this.$$dispatch = this.__$$getDispatchHandler(_constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
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
            stateFor = _ref9$stateFor === void 0 ? _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref9$stateFor,
            _ref9$isStateGlobal = _ref9.isStateGlobal,
            isStateGlobal = _ref9$isStateGlobal === void 0 ? false : _ref9$isStateGlobal,
            module = _ref9.module,
            broadcastTriggeredBy = _ref9.broadcastTriggeredBy,
            changeBy = _ref9.changeBy,
            forceSync = _ref9.forceSync,
            reactCallback = _ref9.cb;

        //executionContext
        if (!(0, _util.isPlainJsonObject)(state)) {
          justWarning("cc found your commit state is not a plain json object!");
        }

        if (isStateGlobal) {
          this.cc.prepareBroadcastGlobalState(broadcastTriggeredBy, state);
        } else {
          var ccState = this.cc.ccState;
          var currentModule = ccState.module;

          if (module === currentModule) {
            // who trigger $$changeState, who will go to change the whole received state 
            this.cc.prepareReactSetState(changeBy || _constant.CHANGE_BY_SELF, state, function () {
              //if forceSync=true, cc clone the input state
              if (forceSync === true) {
                _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
              } else if (ccState.ccOption.syncSharedState) {
                _this3.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
              } else {// stop broadcast state!
              }
            }, reactCallback);
          } else {
            if (forceSync) justWarning("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi("module:" + module + " currentModule" + currentModule));
            if (reactCallback) justWarning("callback for react.setState will be ignore");
            this.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
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
        if (_ccContext.default.isDebug) {
          console.log(ss("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
        }

        return _ReactClass.prototype.render.call(this);
      };

      return CcClass;
    }(ReactClass);

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  };
}