import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react'; // import hoistNonReactStatic from 'hoist-non-react-statics';

import { MODULE_DEFAULT, MODULE_GLOBAL, ERR, CHANGE_BY_SELF, CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, CHANGE_BY_BROADCASTED_GLOBAL_STATE, CHANGE_BY_BROADCASTED_SHARED_STATE, CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE, BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE, BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE } from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util, { isPlainJsonObject, makeHandlerKey } from '../support/util';
import uuid from 'uuid';
import co from 'co';
import * as helper from './helper';
var extractStateByKeys = helper.extractStateByKeys,
    getAndStoreValidGlobalState = helper.getAndStoreValidGlobalState;
var verifyKeys = util.verifyKeys,
    ccClassDisplayName = util.ccClassDisplayName,
    styleStr = util.styleStr,
    color = util.color,
    verboseInfo = util.verboseInfo,
    makeError = util.makeError,
    justWarning = util.justWarning;
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
    sharedKey_globalMappingKeyDescriptor_ = ccContext.sharedKey_globalMappingKeyDescriptor_;
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
}

function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
  if (ccContext.isDebug) {
    console.log(ss(ccUniqueKey + " unset ref"), cl('red'));
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
        justWarning(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
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
    if (ccKey) justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:" + ccKey);
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      var uuidStr = uuid().replace(/-/g, '_');
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
}

function _throwPropDuplicateError(prefixedKey, module) {
  throw me("cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error", vbi("the prefixedKey is " + prefixedKey + ", module is:" + module));
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

        if (module_mapAllStateToProp_[targetModule] === true) {// ignore other keys...
        } else {
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
          throw me(ERR.CC_MODULE_NOT_FOUND, vbi("module:" + module + ", check your stateToPropMapping config!"));
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
    throw me(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi("module " + moduleName + ", ccClassKey " + ccClassKey));
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
  });
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);else {
      justWarning(err);
      if (ccContext.errorHandler) ccContext.errorHandler(err);
    }
  }
}
/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/


export default function register(ccClassKey, _temp) {
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
      throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
    }

    var TargetClass = extendInputClass ? ReactClass : React.Component;

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

      _proto.__$$bindDataToCcClassContext = function __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
        var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
        var ccKeys = classContext.ccKeys;

        if (ccContext.isDebug) {
          console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
        }

        if (!util.isCcOptionValid(ccOption)) {
          throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (util.isHotReloadMode()) {
            var insCount = getCcKeyInsCount(ccUniqueKey);
            if (isSingle && insCount > 1) throw me(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

            if (insCount > 2) {
              // now cc can make sure the ccKey duplicate
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            } // just warning


            console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
            console.error(vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not very well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later

            setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption, 600);
          } else {
            throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
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
          setState: function setState(state, cb) {
            _this2.$$changeState(state, {
              module: currentModule,
              stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
              cb: cb
            });
          },
          setGlobalState: function setGlobalState(partialGlobalState, broadcastTriggeredBy) {
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
              co.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
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
            var _extractStateByKeys5 = extractStateByKeys(state, storedStateKeys),
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
          var _getAndStoreValidGlob = getAndStoreValidGlobalState(globalState),
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
            return justWarning(err.message + " prepareBroadcastState failed!");
          }

          var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, originalState, targetSharedStateKeys, targetGlobalStateKeys),
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

              var _extractStateByKeys6 = extractStateByKeys(_partialSharedState, sharedStateKeys),
                  sharedStateForCurrentCcClass = _extractStateByKeys6.partialState,
                  isSharedStateEmpty = _extractStateByKeys6.isStateEmpty; //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
              //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
              //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
              //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass


              var _extractStateByKeys7 = extractStateByKeys(partialGlobalState, globalStateKeys),
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
                      console.log(ss("ref " + ccKey + " to be rendered state(changeBy " + changeBy + ") is broadcast from same module's other ref " + currentCcKey), cl());
                    }

                    ref.cc.prepareReactSetState(changeBy, toSet);
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

                var _extractStateByKeys8 = extractStateByKeys(partialGlobalState, globalStateKeys),
                    globalStateForCurrentCcClass = _extractStateByKeys8.partialState,
                    isPartialGlobalStateEmpty = _extractStateByKeys8.isStateEmpty;

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

            var _extractStateByKeys9 = extractStateByKeys(globalSate, globalStateKeys),
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
          justWarning("cc found your commit state is not a plain json object!");
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
              } else {// stop broadcast state!
              }
            }, reactCallback);
          } else {
            if (forceSync) justWarning("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi("module:" + module + " currentModule" + currentModule));
            if (reactCallback) justWarning("callback for react.setState will be ignore");
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
          console.log(ss("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
        }

        if (extendInputClass) {
          return _TargetClass.prototype.render.call(this);
        } else {
          //now cc class extends ReactClass, call super.render()
          // now cc class extends ReactComponent, render user inputted ReactClass
          return React.createElement(ReactClass, _extends({}, this, this.props));
        }
      };

      return CcClass;
    }(TargetClass);

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  };
}