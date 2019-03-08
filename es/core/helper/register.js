import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react'; // import hoistNonReactStatic from 'hoist-non-react-statics';

import { MODULE_DEFAULT, MODULE_GLOBAL, ERR, CC_FRAGMENT_PREFIX, CC_DISPATCHER, CHANGE_BY_SELF, CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, CHANGE_BY_BROADCASTED_GLOBAL_STATE, CHANGE_BY_BROADCASTED_SHARED_STATE, CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE, BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE, BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE } from '../../support/constant';
import ccContext from '../../cc-context';
import util, { isPlainJsonObject, makeHandlerKey } from '../../support/util';
import co from 'co';
import * as helper from './../helper';
var extractStateByKeys = helper.extractStateByKeys,
    getAndStoreValidGlobalState = helper.getAndStoreValidGlobalState;
var verifyKeys = util.verifyKeys,
    ccClassDisplayName = util.ccClassDisplayName,
    styleStr = util.styleStr,
    color = util.color,
    verboseInfo = util.verboseInfo,
    makeError = util.makeError,
    justWarning = util.justWarning,
    throwCcHmrError = util.throwCcHmrError;
var _ccContext$store = ccContext.store,
    _state = _ccContext$store._state,
    getState = _ccContext$store.getState,
    ccStoreSetState = _ccContext$store.setState,
    setStateByModuleAndKey = _ccContext$store.setStateByModuleAndKey,
    _reducer = ccContext.reducer._reducer,
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
var cl = color;
var ss = styleStr;
var me = makeError;
var vbi = verboseInfo;
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
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi("module:" + module)), throwError);
      return false;
    } else return true;
  } else {
    if (checkGlobalModule && module === MODULE_GLOBAL) {
      handleError(me(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
      return false;
    }

    if (!_state[module]) {
      handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, vbi("module:" + module + " is not configured in cc's store")), throwError);
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
  } else {//this check can be optional?? if user don't configure a reducer for a module, may be he really don't want to use dispatch
    // if (!_reducer[reducerModule]) {
    //   handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, `reducerModule:${reducerModule}`), throwError);
    // }
  }
} // any error in this function will not been throwed, cc just warning, 


function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null; //let user's reactCallback has no change to be triggered
      }
    }

    cb(null, targetCb);
  } else {
    cb(new Error("inputModule:" + inputModule + " invalid"), null);
  }
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

  var _verifyKeys = verifyKeys(sharedStateKeys, globalStateKeys),
      duplicate = _verifyKeys.duplicate,
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  if (keyElementNotString) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey));
  }

  if (duplicate) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey + " globalStateKeys:" + globalStateKeys + " sharedStateKeys:" + sharedStateKeys));
  }

  var globalState = getState(MODULE_GLOBAL);
  var hasGlobalMappingKeyInSharedStateKeys = false;
  var matchedGlobalKey, matchedSharedKey;
  var len = globalStateKeys.length;

  for (var i = 0; i < len; i++) {
    var gKey = globalStateKeys[i];

    if (globalState[gKey] === undefined) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi("ccClassKey:" + ccClassKey + ", invalid key in globalStateKeys is [" + gKey + "]"));
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
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi("ccClassKey [" + ccClassKey + "], invalid global key [" + matchedGlobalKey + "], matched state key [" + matchedSharedKey + "]"));
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
  var _extractStateByKeys = extractStateByKeys(sourceState, sharedStateKeys),
      partialSharedState = _extractStateByKeys.partialState,
      isPartialSharedStateEmpty = _extractStateByKeys.isStateEmpty;

  var _extractStateByKeys2 = extractStateByKeys(sourceState, globalStateKeys),
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

        setStateByModuleAndKey(MODULE_GLOBAL, globalMappingKey, stateValue);

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
} //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
  var fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;

  if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
    throw me(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
  }

  var contextMap = ccContext.ccClassKey_ccClassContext_;

  if (contextMap[ccClassKey] !== undefined) {
    throwCcHmrError(me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
  }

  helper.buildCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode);
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
  helper.mapModuleAndCcClassKeys(stateModule, ccClassKey); //tell cc this ccClass is watching some globalStateKeys of global module

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
    return justWarning("event " + event + "'s handler is not a function!");
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
      var moduledStateKey = stateModuleName + "/" + sKey;
      var moduledPropKeyDescriptor = stateKey_propKeyDescriptor_[moduledStateKey];

      if (moduledPropKeyDescriptor) {
        var originalPropKey = moduledPropKeyDescriptor.originalPropKey;

        if (module_isPropStateChanged[stateModuleName] !== true) {
          //mark propState changed
          module_isPropStateChanged[stateModuleName] = true;
          changedPropStateList.push(propState); // push this ref to changedPropStateList
        }

        var stateValue = state[sKey];
        helper.setPropState(propState, originalPropKey, stateValue, isPropStateModuleMode, stateModuleName);
        setStateByModuleAndKey(stateModuleName, sKey, stateValue);
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
  }).catch(helper.catchCcError);
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);else {
      justWarning(err);
      if (ccContext.errorHandler) ccContext.errorHandler(err);
    }
  }
}

export default function register(ccClassKey, _temp) {
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
      asyncLifecycleHook = _ref4$asyncLifecycleH === void 0 ? true : _ref4$asyncLifecycleH,
      _ref4$checkStartUp = _ref4.checkStartUp,
      checkStartUp = _ref4$checkStartUp === void 0 ? true : _ref4$checkStartUp;

  try {
    if (checkStartUp === true) checkCcStartupOrNot();
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
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
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
            util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState', '__$$getDispatchHandler', '$$domDispatch']);
            if (!ccOption.storedStateKeys) ccOption.storedStateKeys = []; // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing

            if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

            if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
            if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
            var _asyncLifecycleHook2 = ccOption.asyncLifecycleHook,
                storedStateKeys = ccOption.storedStateKeys;

            var _helper$computeCcUniq = helper.computeCcUniqueKey(isSingle, ccClassKey, ccKey),
                ccUniqueKey = _helper$computeCcUniq.ccUniqueKey,
                isCcUniqueKeyAutoGenerated = _helper$computeCcUniq.isCcUniqueKeyAutoGenerated;

            var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
            helper.setRef(_assertThisInitialized(_assertThisInitialized(_this)), isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

            _this.__$$mapCcToInstance(isSingle, _asyncLifecycleHook2, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys); // bind propState to $$propState


            _this.$$propState = ccClassKey_ccClassContext_[ccClassKey].propState || {};

            _this.__$$recoverState(ccClassKey);
          } catch (err) {
            helper.catchCcError(err);
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
            var _extractStateByKeys3 = extractStateByKeys(sharedState, sharedStateKeys),
                partialState = _extractStateByKeys3.partialState;

            partialSharedState = partialState;
          }

          if (syncGlobalState) {
            var _extractStateByKeys4 = extractStateByKeys(globalState, globalStateKeys),
                _partialState2 = _extractStateByKeys4.partialState;

            partialGlobalState = _partialState2;
          }

          var selfState = this.state;

          var entireState = _extends({}, selfState, refState, partialSharedState, partialGlobalState);

          this.state = entireState;
          computeValueForRef(this.$$computed, this.$$refComputed, entireState);
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

          var _verifyKeys2 = verifyKeys(sharedStateKeys, storedStateKeys),
              duplicate = _verifyKeys2.duplicate,
              notArray = _verifyKeys2.notArray,
              keyElementNotString = _verifyKeys2.keyElementNotString;

          if (notArray) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (keyElementNotString) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (duplicate) {
            throw me(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
          }

          if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
            throw me(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey));
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
            setState: function setState(state, cb, lazyMs) {
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
            setGlobalState: function setGlobalState(partialGlobalState, lazyMs, broadcastTriggeredBy) {
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
                co.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
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
            var targetReducerMap = _reducer[targetReducerModule];

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
              var _extractStateByKeys5 = extractStateByKeys(state, storedStateKeys),
                  partialState = _extractStateByKeys5.partialState,
                  isStateEmpty = _extractStateByKeys5.isStateEmpty;

              if (!isStateEmpty) {
                if (ccOption.storeInLocalStorage === true) {
                  var _extractStateByKeys6 = extractStateByKeys(_this2.state, storedStateKeys),
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
            var _getAndStoreValidGlob = getAndStoreValidGlobalState(globalState),
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
              helper.runLater(startBroadcastGlobalState, feature, lazyMs);
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
              return justWarning(err.message + " prepareBroadcastState failed!");
            }

            var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, committedState, targetSharedStateKeys, targetGlobalStateKeys),
                isPartialSharedStateEmpty = _extractStateToBeBroa.isPartialSharedStateEmpty,
                isPartialGlobalStateEmpty = _extractStateToBeBroa.isPartialGlobalStateEmpty,
                partialSharedState = _extractStateToBeBroa.partialSharedState,
                partialGlobalState = _extractStateToBeBroa.partialGlobalState,
                module_globalState_ = _extractStateToBeBroa.module_globalState_;

            if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);
            if (!isPartialGlobalStateEmpty) ccStoreSetState(MODULE_GLOBAL, partialGlobalState); // ??? here logic code is redundant, in extractStateToBeBroadcasted, 
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
              helper.runLater(startBroadcastState, feature, lazyMs);
            } else {
              startBroadcastState();
            }
          }, _this$cc.broadcastState = function broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone) {
            var _partialSharedState = partialSharedState;
            if (needClone) _partialSharedState = util.clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

            var currentCcKey = _this2.cc.ccState.ccUniqueKey;
            var ccClassKey_isHandled_ = {}; //record which ccClassKey has been handled
            // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
            // so flag ignoreCurrentCcKey as true;

            var ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
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
                        console.log(ss("ref " + ccKey + " to be rendered state(changedBy " + changedBy + ") is broadcast from same module's other ref " + currentCcKey), cl());
                      }

                      ref.cc.prepareReactSetState(changedBy, toSet);
                    }

                    ;
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
                          console.log(ss("ref " + ccKey + " to be rendered state(only global state) is broadcast from other module " + moduleName), cl());
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
            justWarning("cc found your commit state is not a plain json object!");
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
                  } else {// stop broadcast state!
                  }
                }, reactCallback);
              } else {
                if (forceSync) justWarning("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi("module:" + module + " currentModule" + currentModule));
                if (reactCallback) justWarning("callback for react.setState will be ignore");

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
                return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi(paramObj)));
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
            }).catch(helper.catchCcError);
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
              ccClassKey = _this$cc$ccState2.ccClassKey;
          helper.unsetRef(ccClassKey, ccUniqueKey); //if father component implement componentWillUnmount，call it again

          if (_TargetClass.prototype.componentWillUnmount) _TargetClass.prototype.componentWillUnmount.call(this);
        };

        _proto.render = function render() {
          if (ccContext.isDebug) {
            console.log(ss("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
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

      if (ccClassKey === CC_DISPATCHER) CcClass.displayName = 'CcDispatcher';else CcClass.displayName = ccClassDisplayName(ccClassKey);
      return CcClass;
    };
  } catch (err) {
    helper.catchCcError(err);
  }
}