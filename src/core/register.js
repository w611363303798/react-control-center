
import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_DEFAULT, MODULE_GLOBAL, ERR,
  CHANGE_BY_SELF,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE,
  CHANGE_BY_BROADCASTED_SHARED_STATE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE,

  BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
} from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util, { isPlainJsonObject, makeHandlerKey } from '../support/util';
import uuid from 'uuid';
import co from 'co';
import * as helper from './helper';

const { extractStateByKeys, getAndStoreValidGlobalState } = helper;
const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning } = util;
const {
  store: { _state, getState, setState: ccStoreSetState, setStateByModuleAndKey },
  reducer: { _reducer }, refStore, globalMappingKey_sharedKey_,
  computed: { _computedValue }, event_handlers_, handlerKey_handler_, ccUniqueKey_handlerKeys_,
  propModuleName_ccClassKeys_, moduleName_sharedStateKeys_, moduleName_globalStateKeys_,
  ccKey_ref_, ccKey_option_, globalCcClassKeys, moduleName_ccClassKeys_, ccClassKey_ccClassContext_,
  globalMappingKey_toModules_, globalMappingKey_fromModule_, globalKey_toModules_, sharedKey_globalMappingKeyDescriptor_,
} = ccContext;
const cl = color;
const ss = styleStr;
const me = makeError;
const vbi = verboseInfo;

const ccKey_insCount = {};
function incCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 1;
  else ccKey_insCount[ccUniqueKey] += 1;
}
function decCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 0;
  else ccKey_insCount[ccUniqueKey] -= 1;
}
function getCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) return 0;
  else return ccKey_insCount[ccUniqueKey];
}

function paramCallBackShouldNotSupply(module, currentModule) {
  return `if you pass param reactCallback, param module must equal current CCInstance's module, module: ${module}, CCInstance's module:${currentModule}, now the cb will never been triggered! `;
}

function handleError(err, throwError = true) {
  if (throwError) throw err;
  else {
    handleCcFnError(err);
  }
}

function checkStoreModule(module, throwError = true) {
  if (!ccContext.isModuleMode) {
    if (module !== MODULE_DEFAULT) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi(`module:${module}`)), throwError);
      return false;
    } else return true;
  } else {
    if (module === MODULE_GLOBAL) {
      handleError(me(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
      return false;
    }

    if (!_state[module]) {
      handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, vbi(`module:${module} is not configured in cc's store`)), throwError);
      return false;
    } else return true;
  }
}

function checkReducerModule(reducerModule, throwError = true) {
  if (!ccContext.isModuleMode) {
    if (reducerModule != MODULE_DEFAULT) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `reducerModule:${reducerModule}`), throwError);
    }
  } else {
    //this check can be optional?? if user don't configure a reducer for a module, may be he really don't want to use dispatch
    // if (!_reducer[reducerModule]) {
    //   handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, `reducerModule:${reducerModule}`), throwError);
    // }
  }
}

function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
  if (ccContext.isDebug) {
    console.log(ss(`${ccUniqueKey} unset ref`), cl('red'));
  }
  // ccContext.ccKey_ref_[ccUniqueKey] = null;
  delete ccContext.ccKey_ref_[ccUniqueKey];
  delete ccContext.ccKey_option_[ccUniqueKey];
  const ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  decCcKeyInsCount(ccUniqueKey);

  const handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    handlerKeys.forEach(hKey => {
      delete handlerKey_handler_[hKey];
      // ccUniqueKey maybe generated randomly, so delete the key instead of set null
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
    setTimeout(setRef, delayMs)
  } else {
    setRef()
  }
}

// any error in this function will not been throwed, cc just warning, 
function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  let targetCb = reactCallback;
  if (checkStoreModule(inputModule, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null;//let user's reactCallback has no change to be triggered
      }
    }
    cb(null, targetCb);
  } else {
    cb(new Error(`inputModule:${inputModule} invalid`), null);
  }
}

function computeCcUniqueKey(isClassSingle, ccClassKey, ccKey) {
  let ccUniqueKey;
  let isCcUniqueKeyAutoGenerated = false;
  if (isClassSingle) {
    if (ccKey) justWarning(`now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:${ccKey}`)
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      const uuidStr = uuid().replace(/-/g, '_');
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, uuidStr);
      isCcUniqueKeyAutoGenerated = true;
    }
  }
  return { ccUniqueKey, isCcUniqueKeyAutoGenerated };
}

function getSharedKeysAndGlobalKeys(module, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
  let sharedStateKeys = inputSharedStateKeys, globalStateKeys = inputGlobalStateKeys;
  if (inputSharedStateKeys === '*') {
    sharedStateKeys = Object.keys(getState(module));
  }

  if (inputGlobalStateKeys === '*') {
    globalStateKeys = Object.keys(getState(MODULE_GLOBAL));
  }

  const { duplicate, notArray, keyElementNotString } = verifyKeys(sharedStateKeys, globalStateKeys);
  if (notArray) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi(`ccClassKey:${ccClassKey}`));
  }
  if (keyElementNotString) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi(`ccClassKey:${ccClassKey}`));
  }
  if (duplicate) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi(`ccClassKey:${ccClassKey} globalStateKeys:${globalStateKeys} sharedStateKeys:${sharedStateKeys}`));
  }

  const globalState = getState(MODULE_GLOBAL);

  let hasGlobalMappingKeyInSharedStateKeys = false;
  let matchedGlobalKey, matchedSharedKey;
  const len = globalStateKeys.length;
  for (let i = 0; i < len; i++) {
    const gKey = globalStateKeys[i];
    if (globalState[gKey] === undefined) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi(`ccClassKey:${ccClassKey}, invalid key in globalStateKeys is [${gKey}]`));
    }

    const sharedKey = globalMappingKey_sharedKey_[gKey];
    const fromModule = globalMappingKey_fromModule_[gKey];

    //  if cc found one of the globalStateKeys of this module is just mapped from shared to global
    //  it is strictly prohibited here
    if (fromModule == module && sharedStateKeys.includes(sharedKey)) {
      hasGlobalMappingKeyInSharedStateKeys = true;
      matchedGlobalKey = gKey;
      matchedSharedKey = sharedKey;
      break;
    }
  }

  // maybe in the future, this is ok？ if user change sharedToGlobalMapping frequently, user don't have to change ccClass's globalStateKeys at the same time
  // but currently, this situation is strictly prohibited...... prevent from syncGlobalState and syncSharedState signal working badly
  if (hasGlobalMappingKeyInSharedStateKeys) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi(`ccClassKey [${ccClassKey}], invalid global key [${matchedGlobalKey}], matched state key [${matchedSharedKey}]`));
  }

  return { sharedStateKeys, globalStateKeys };
}

function checkCcStartupOrNot() {
  if (!window.cc || ccContext.isCcAlreadyStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function extractStateToBeBroadcasted(refModule, sourceState, sharedStateKeys, globalStateKeys) {
  const { partialState: partialSharedState, isStateEmpty: isPartialSharedStateEmpty } = extractStateByKeys(sourceState, sharedStateKeys);
  const { partialState: partialGlobalState, isStateEmpty: isPartialGlobalStateEmpty } = extractStateByKeys(sourceState, globalStateKeys);

  //  any stateValue's key if it is a global key (a normal global key , or a global key mapped from a state key)
  //  the stateValue will been collected to module_globalState_, 
  //  any stateValue's key if it is a shared key that mapped to global key,
  //  the stateValue will been collected to module_globalState_ also,
  //  key means module name, value means the state to been broadcasted to the module
  const module_globalState_ = {};

  //  see if sourceState includes globalMappingKeys, extract the target state that will been broadcasted to other module by globalMappingKey_sharedKey_
  globalStateKeys.forEach(gKey => {
    const stateValue = sourceState[gKey];
    if (stateValue !== undefined) {
      const sharedKey = globalMappingKey_sharedKey_[gKey];
      let toModules, stateKey;
      if (sharedKey) {//  this global key is created from some other module's sharedToGlobalMapping setting
        toModules = globalMappingKey_toModules_[gKey];
        stateKey = sharedKey;
      } else {//  this is normal global key
        toModules = globalKey_toModules_[gKey];
        stateKey = gKey;
      }
      if (toModules) {
        toModules.forEach(m => {
          if (m != refModule) {// current ref's module global state has been extracted into partialGlobalState above, so here exclude it
            let modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
            modulePartialGlobalState[stateKey] = stateValue;
          }
        });
      }
    }
  });

  //  see if sourceState includes sharedStateKey which are mapped to globalStateKey
  sharedStateKeys.forEach(sKey => {
    const stateValue = sourceState[sKey];
    if (stateValue !== undefined) {
      const descriptor = sharedKey_globalMappingKeyDescriptor_[sKey];
      if (descriptor) {
        const { globalMappingKey } = descriptor;
        const toModules = globalMappingKey_toModules_[globalMappingKey];
        if (toModules) {
          toModules.forEach(m => {
            if (m != refModule) {// current ref's module global state has been extracted into partialGlobalState above, so here exclude it
              let modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
              modulePartialGlobalState[globalMappingKey] = stateValue;
              //  !!!set this state to globalState, let other module that watching this globalMappingKey
              //  can recover it correctly while they are mounted again!
              setStateByModuleAndKey(MODULE_GLOBAL, globalMappingKey, stateValue);
            }
          });
        }
      }
    }
  });

  // partialSharedState is prepared for input module 
  // partialGlobalState is prepared for input module 
  // module_globalState_ is prepared for other module 
  return { isPartialSharedStateEmpty, partialSharedState, isPartialGlobalStateEmpty, partialGlobalState, module_globalState_ };
}

//to let cc know a specified module are watching what sharedStateKeys
function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
  let sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
  if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
  partialSharedStateKeys.forEach(sKey => {
    if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
  });
}

function mapGlobalKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(gKey => {
    const toModules = util.safeGetArrayFromObject(globalKey_toModules_, gKey);
    // because cc allow multi class register to a same module, so here judge if toModules includes module or not
    if (!toModules.includes(_curStateModule)) {
      toModules.push(_curStateModule);
    }
  });
}

function mapGlobalMappingKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(gKey => {
    const toModules = util.safeGetArrayFromObject(globalMappingKey_toModules_, gKey);
    if (globalMappingKey_sharedKey_[gKey]) {//  if this gKey is globalMappingKey
      if (!toModules.includes(_curStateModule)) toModules.push(_curStateModule)
    }
  });
}

//to let cc know a specified module are watching what globalStateKeys
function mapModuleAndGlobalStateKeys(moduleName, partialGlobalStateKeys) {
  const globalStateKeysOfModule = util.safeGetArrayFromObject(moduleName_globalStateKeys_, moduleName);
  partialGlobalStateKeys.forEach(gKey => {
    if (!globalStateKeysOfModule.includes(gKey)) globalStateKeysOfModule.push(gKey);
  });
}

function _throwPropDuplicateError(prefixedKey, module) {
  throw me(`cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error`,
    vbi(`the prefixedKey is ${prefixedKey}, module is:${module}`));
}
function _getPropKeyPair(isPropStateModuleMode, module, propKey) {
  if (isPropStateModuleMode === true) {
    return { moduledPropKey: `${module}/${propKey}`, originalPropKey: propKey };
  } else {
    return { moduledPropKey: propKey, originalPropKey: propKey };
  }
}
function _getStateKeyPair(isPropStateModuleMode, module, stateKey) {
  if (isPropStateModuleMode === true) {
    return { moduledStateKey: `${module}/${stateKey}`, originalStateKey: stateKey };
  } else {
    return { moduledStateKey: stateKey, originalStateKey: stateKey };
  }
}
function _setPropState(propState, propKey, propValue, isPropStateModuleMode, module) {
  if (isPropStateModuleMode) {
    const modulePropState = util.safeGetObjectFromObject(propState, module);
    modulePropState[propKey] = propValue;
  } else {
    propState[propKey] = propValue;
  }
}
//tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state
function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
  const contextMap = ccContext.ccClassKey_ccClassContext_;
  if (contextMap[ccClassKey] !== undefined) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  } else {
    const ccClassContext = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys);
    if (stateToPropMapping != undefined) {
      const propKey_stateKeyDescriptor_ = ccClassContext.propKey_stateKeyDescriptor_;
      const stateKey_propKeyDescriptor_ = ccClassContext.stateKey_propKeyDescriptor_;
      const propState = ccClassContext.propState;

      if (typeof stateToPropMapping !== 'object') {
        throw me(ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID, `ccClassKey:${ccClassKey}`);
      }

      const module_mapAllStateToProp_ = {};
      const module_staredKey_ = {};
      const module_prefixedKeys_ = {};
      const prefixedKeys = Object.keys(stateToPropMapping);
      const len = prefixedKeys.length;
      for (let i = 0; i < len; i++) {
        const prefixedKey = prefixedKeys[i];
        if (!util.isPrefixedKeyValid(prefixedKey)) {
          throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, `ccClassKey:${ccClassKey}, key:${prefixedKey}`);
        }
        const [targetModule, targetKey] = prefixedKey.split('/');
        if (module_mapAllStateToProp_[targetModule] === true) {
          // ignore other keys...
        } else {
          if (targetKey === '*') {
            module_mapAllStateToProp_[targetModule] = true;
            module_staredKey_[targetModule] = prefixedKey;
          } else {
            const modulePrefixedKeys = util.safeGetArrayFromObject(module_prefixedKeys_, targetModule);
            modulePrefixedKeys.push(prefixedKey);
            module_mapAllStateToProp_[targetModule] = false;
          }
        }
      }

      const targetModules = Object.keys(module_mapAllStateToProp_);
      const propKey_appeared_ = {};//help cc to judge propKey is duplicated or not
      targetModules.forEach(module => {
        const moduleState = _state[module];
        let isPropStateSet = false;

        if (module_mapAllStateToProp_[module] === true) {
          const moduleStateKeys = Object.keys(moduleState);
          moduleStateKeys.forEach(msKey => {
            // now prop key equal state key if user declare key like m1/* in stateToPropMapping;
            const { moduledPropKey, originalPropKey } = _getPropKeyPair(isPropStateModuleMode, module, msKey);
            const appeared = propKey_appeared_[moduledPropKey];

            if (appeared === true) {
              _throwPropDuplicateError(module_staredKey_[module], module);
            } else {
              propKey_appeared_[moduledPropKey] = true;
              // moduledPropKey and moduledStateKey is equal
              propKey_stateKeyDescriptor_[moduledPropKey] = { module, originalStateKey: msKey, moduledStateKey: moduledPropKey };
              stateKey_propKeyDescriptor_[moduledPropKey] = { module, moduledPropKey, originalPropKey };

              _setPropState(propState, msKey, moduleState[msKey], isPropStateModuleMode, module);
              isPropStateSet = true;
            }
          });
        } else {
          const prefixedKeys = module_prefixedKeys_[module];
          prefixedKeys.forEach(prefixedKey => {
            const [stateModule, stateKey] = prefixedKey.split('/');
            const propKey = stateToPropMapping[prefixedKey];
            const { moduledPropKey, originalPropKey } = _getPropKeyPair(isPropStateModuleMode, module, propKey);

            const appeared = propKey_appeared_[moduledPropKey];
            if (appeared === true) {
              _throwPropDuplicateError(prefixedKey, module);
            } else {
              propKey_appeared_[moduledPropKey] = true;
              const { moduledStateKey } = _getStateKeyPair(isPropStateModuleMode, module, stateKey);
              propKey_stateKeyDescriptor_[moduledPropKey] = { module: stateModule, originalStateKey: stateKey, moduledStateKey };
              stateKey_propKeyDescriptor_[moduledStateKey] = { module: stateModule, moduledPropKey, originalPropKey };

              _setPropState(propState, propKey, moduleState[stateKey], isPropStateModuleMode, module);
              isPropStateSet = true;
            }
          });
        }

        if (isPropStateSet === true) {
          const pCcClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
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
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
  if (ccClassKeys.includes(ccClassKey)) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  }
  const moduleSingleClass = ccContext.moduleSingleClass;
  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw me(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi(`module ${moduleName}, ccClassKey ${ccClassKey}`));
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
  let globalStateKeys, sharedStateKeys;
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
    throw new Error(`stateFor is not set correctly! `)
    // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
  }
  return { globalStateKeys, sharedStateKeys };
}

function _throwForExtendInputClassAsFalseCheck(ccClassKey) {
  throw me(`cc found that you set sharedStateKeys、globalStateKeys or storedStateKeys, but you set extendInputClass as false at the same time
    while you register a ccClass:${ccClassKey}, this is not allowed, extendInputClass=false means cc will give you
    a props proxy component, in this situation, cc is unable to take over your component state, so set sharedStateKeys or globalStateKeys
    is strictly prohibited, but you can still set stateToPropMapping to let cc control your component render timing!
  `);
}
function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
  if (extendInputClass === false) {
    if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
      _throwForExtendInputClassAsFalseCheck(ccClassKey);
    }
  }

  const { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys } =
    getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys);

  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, targetSharedStateKeys, targetGlobalStateKeys, stateToPropMapping, isPropStateModuleMode)
  mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);

  mapModuleAndGlobalStateKeys(stateModule, targetGlobalStateKeys);
  mapGlobalKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapGlobalMappingKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapModuleAndCcClassKeys(stateModule, ccClassKey);

  //tell cc this ccClass is watching some globalStateKeys of global module
  if (targetGlobalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);

  return { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys };
}

function computeValueForRef(computed, refComputed, state) {
  if (computed) {
    const toBeComputed = computed();
    const toBeComputedKeys = Object.keys(toBeComputed);
    toBeComputedKeys.forEach(key => {
      const fn = toBeComputed[key];
      const originalValue = state[key];
      if (originalValue !== undefined) {
        const computedValue = fn(originalValue, state);
        refComputed[key] = computedValue;
      }
    })
  }
}

function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  const handlers = util.safeGetArrayFromObject(event_handlers_, event);
  if (typeof handler !== 'function') {
    return justWarning(`event ${event}'s handler is not a function!`);
  }
  const targetHandler = handlers.find(v => v.ccKey === ccUniqueKey && v.identity === identity);
  const handlerKeys = util.safeGetArrayFromObject(ccUniqueKey_handlerKeys_, ccUniqueKey);
  const handlerKey = makeHandlerKey(ccUniqueKey, event);
  //  that means the component of ccUniqueKey mounted again 
  //  or user call $$on for a same event in a same instance more than once
  if (targetHandler) {
    //  cc will alway use the latest handler
    targetHandler.handler = handlerKey;
  } else {
    handlers.push({ module, ccClassKey, ccKey: ccUniqueKey, identity, handlerKey });
    handlerKeys.push(handlerKey);
  }
  handlerKey_handler_[handlerKey] = handler;
}

function _findEventHandlers(event, module, ccClassKey, identity) {
  const handlers = event_handlers_[event];
  if (handlers) {
    let filteredHandlers = [];
    if (module) filteredHandlers = handlers.filter(v => v.module === module);
    if (ccClassKey) filteredHandlers = handlers.filter(v => v.ccClassKey === ccClassKey);

    // identity is null means user call emit or emitIdentity which set identity as null
    // identity is not null means user call emitIdentity
    filteredHandlers = handlers.filter(v => v.identity === identity);
    return filteredHandlers;
  } else {
    return [];
  }
}

function findEventHandlersToPerform(event, { module, ccClassKey, identity }, ...args) {
  const handlers = _findEventHandlers(event, module, ccClassKey, identity);
  handlers.forEach(({ ccKey, handlerKey }) => {
    if (ccKey_ref_[ccKey] && handlerKey) {//  confirm the instance is mounted and handler is not been offed
      const handlerFn = handlerKey_handler_[handlerKey];
      if (handlerFn) handlerFn(...args);
    }
  });
}

function findEventHandlersToOff(event, { module, ccClassKey, identity }) {
  const handlers = _findEventHandlers(event, module, ccClassKey, identity);
  handlers.forEach(item => {
    handlerKey_handler_[item.handler] = null;
    item.handler = null;
  });
}

function updateModulePropState(module_isPropStateChanged, changedPropStateList, targetClassContext, state, stateModuleName) {
  const { stateToPropMapping, stateKey_propKeyDescriptor_, propState, isPropStateModuleMode } = targetClassContext;
  if (stateToPropMapping) {
    Object.keys(state).forEach(sKey => {
      // use input stateModuleName to compute moduledStateKey for current stateKey
      // to see if the propState should be updated
      const { moduledStateKey } = _getStateKeyPair(isPropStateModuleMode, stateModuleName, sKey);
      const moduledPropKeyDescriptor = stateKey_propKeyDescriptor_[moduledStateKey];
      if (moduledPropKeyDescriptor) {
        const { originalPropKey } = moduledPropKeyDescriptor;

        if (module_isPropStateChanged[stateModuleName] !== true) {//mark propState changed
          module_isPropStateChanged[stateModuleName] = true;
          changedPropStateList.push(propState);// push this ref to changedPropStateList
        }

        const stateValue = state[sKey];
        _setPropState(propState, originalPropKey, stateValue, isPropStateModuleMode, stateModuleName);
        setStateByModuleAndKey(stateModuleName, sKey, stateValue);
      }
    });
  }
}

function broadcastPropState(module, commitState) {
  const changedPropStateList = [];
  const module_isPropStateChanged = {};// record which module's propState has been changed

  // if no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  Object.keys(moduleName_ccClassKeys_).forEach(moduleName => {
    const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
    ccClassKeys.forEach(ccClassKey => {
      const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateModulePropState(module_isPropStateChanged, changedPropStateList, ccClassContext, commitState, module);
    });
  });

  Object.keys(module_isPropStateChanged).forEach(module => {
    //  this module has stateToPropMapping and propState has been changed!!!
    const ccClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
    ccClassKeys.forEach(ccClassKey => {
      const classContext = ccClassKey_ccClassContext_[ccClassKey];
      const { ccKeys } = classContext;
      ccKeys.forEach(ccKey => {
        const ref = ccKey_ref_[ccKey];
        if (ref) {
          ref.cc.reactForceUpdate();
        }
      });
    });
  });
}

function _promiseErrorHandler(resolve, reject) {
  return (err, ...args) => err ? reject(err) : resolve(...args);
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, ...args) {
  return new Promise((resolve, reject) => {
    const _executionContext = { ...executionContext, __innerCb: _promiseErrorHandler(resolve, reject) }
    ccFn(userLogicFn, _executionContext, ...args);
  });
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);
    else {
      justWarning(err);
      if (ccContext.errorHandler) ccContext.errorHandler(err);
    }
  }
}

/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/
export default function register(ccClassKey, {
  extendInputClass = true,
  isSingle = false,
  asyncLifecycleHook = true,// is asyncLifecycleHook = false, it may block cc broadcast state to other when it takes a long time to finish
  module = MODULE_DEFAULT,
  reducerModule,
  sharedStateKeys: inputSharedStateKeys = [],
  globalStateKeys: inputGlobalStateKeys = [],
  stateToPropMapping,
  isPropStateModuleMode = false,
} = {}) {
  checkCcStartupOrNot();
  const _curStateModule = module;
  const _asyncLifecycleHook = asyncLifecycleHook;
  const _reducerModule = reducerModule || _curStateModule;//if reducerModule not defined, will be equal module;

  checkStoreModule(_curStateModule);
  checkReducerModule(_reducerModule);

  const { sharedStateKeys: sKeys, globalStateKeys: gKeys } =
    mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, stateToPropMapping, isPropStateModuleMode);
  const sharedStateKeys = sKeys, globalStateKeys = gKeys;

  return function (ReactClass) {
    if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
      throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi(`if you want to register ${ccClassKey} to cc successfully, the ReactClass can not be a CcClass!`));
    }

    const TargetClass = extendInputClass ? ReactClass : React.Component;
    const CcClass = class CcClass extends TargetClass {

      constructor(props, context) {
        super(props, context);
        if (!this.state) this.state = {};
        const { ccKey, ccOption = {} } = props;
        util.bindThis(this, [
          '__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState',
          '__$$recoverState', '__$$getDispatchHandler', '$$domDispatch'
        ]);
        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];

        // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing
        if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true;
        // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing
        if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;

        if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
        const { asyncLifecycleHook, storedStateKeys } = ccOption;

        const { ccUniqueKey, isCcUniqueKeyAutoGenerated } = computeCcUniqueKey(isSingle, ccClassKey, ccKey)
        const ccClassContext = this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);
        this.__$$mapCcToInstance(
          isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys
        );
        // bind propState to $$propState
        this.$$propState = ccClassKey_ccClassContext_[ccClassKey].propState || {};

        this.__$$recoverState(ccClassKey);
      }

      // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;
      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      }

      __$$recoverState() {
        const { module: currentModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey } = this.cc.ccState;
        let refState = refStore._state[ccUniqueKey] || {};

        const sharedState = _state[currentModule];
        const globalState = _state[MODULE_GLOBAL];
        const { syncSharedState, syncGlobalState } = ccOption;

        let partialSharedState = {}, partialGlobalState = {};
        if (syncSharedState) {
          const { partialState } = extractStateByKeys(sharedState, sharedStateKeys);
          partialSharedState = partialState;
        }
        if (syncGlobalState) {
          const { partialState } = extractStateByKeys(globalState, globalStateKeys);
          partialGlobalState = partialState;
        }

        const selfState = this.state;
        const entireState = { ...selfState, ...refState, ...partialSharedState, ...partialGlobalState };
        this.state = entireState;
        computeValueForRef(this.$$computed, this.$$refComputed, entireState);
      }

      __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
        const classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
        const ccKeys = classContext.ccKeys;
        if (ccContext.isDebug) {
          console.log(ss(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
        }

        if (!util.isCcOptionValid(ccOption)) {
          throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi(`a standard default ccOption may like: {"syncSharedState": true, "asyncLifecycleHook":false, "storedStateKeys": []}`));
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (util.isHotReloadMode()) {
            const insCount = getCcKeyInsCount(ccUniqueKey);
            if (isSingle && insCount > 1) throw me(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi(`ccClass:${ccClassKey}`));
            if (insCount > 2) {// now cc can make sure the ccKey duplicate
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
            }
            // just warning
            console.error(`found ccKey ${ccKey} may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually`);
            console.error(vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} ccUniqueKey:${ccUniqueKey}`));

            // in webpack hot reload mode, cc works not very well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later
            setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption, 600);
          } else {
            throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
          }
        } else {
          setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption);
        }

        return classContext;
      }

      __$$mapCcToInstance(
        isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
        ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys
      ) {
        const reactSetStateRef = this.setState.bind(this);
        const reactForceUpdateRef = this.forceUpdate.bind(this);
        const ccState = {
          renderCount: 1, isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, module: currentModule, reducerModule: currentReducerModule, sharedStateKeys, globalStateKeys
        };

        const { duplicate, notArray, keyElementNotString } = verifyKeys(sharedStateKeys, storedStateKeys);
        if (notArray) {
          throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
        }
        if (keyElementNotString) {
          throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
        }
        if (duplicate) {
          throw me(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} sharedStateKeys:${sharedStateKeys} storedStateKeys:${storedStateKeys}`));
        }
        if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
          throw me(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi(`ccClassKey:${ccClassKey}`));
        }

        this.cc = {
          ccState,
          ccUniqueKey,
          ccKey,
          beforeSetState: this.$$beforeSetState,
          beforeBroadcastState: this.$$beforeBroadcastState,
          afterSetState: this.$$afterSetState,
          reactSetState: (state, cb) => {
            ccState.renderCount += 1;
            reactSetStateRef(state, cb);
          },
          reactForceUpdate: (state, cb) => {
            ccState.renderCount += 1;
            reactForceUpdateRef(state, cb);
          },
          setState: (state, cb) => {
            this.$$changeState(state, { module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb });
          },
          setGlobalState: (partialGlobalState, broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE) => {
            this.$$changeState(partialGlobalState, { module: MODULE_GLOBAL, broadcastTriggeredBy });
          },
          forceUpdate: (cb) => {
            this.$$changeState(this.state, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb });
          },
          // always change self module's state
          invoke: (userLogicFn, ...args) => {
            return this.cc.__promisifiedInvokeWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          // change other module's state, mostly you should use this method to generate new state instead of xeffect,
          // because xeffect will force your logicFn to put your first param as ExecutionContext
          effect: (targetModule, userLogicFn, ...args) => {
            return this.cc.__promisifiedInvokeWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, context: false, module: targetModule }, ...args);
          },
          // change other module's state, cc will give userLogicFn EffectContext object as first param
          xeffect: (targetModule, userLogicFn, ...args) => {
            return this.cc.__promisifiedInvokeWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, xeffect: this.cc.xeffect, moduleState: getState(targetModule), state: this.state, context: true, module: targetModule }, ...args);
          },
          __promisifiedInvokeWith: (userLogicFn, executionContext, ...args) => {
            return _promisifyCcFn(this.cc.__invokeWith, userLogicFn, executionContext, ...args);
          },
          // advanced invoke, can change other module state, but user should put module to option
          // and user can decide userLogicFn's first param is ExecutionContext by set context = true
          invokeWith: (userLogicFn, option, ...args) => {
            const { module = currentModule, context = false, forceSync = false, cb } = option;
            return this.cc.__promisifiedInvokeWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, moduleState: getState(module), state: this.state, context, forceSync, cb }, ...args);
          },
          __invokeWith: (userLogicFn, executionContext, ...args) => {
            const { stateFor, module: targetModule = currentModule, context = false, forceSync = false, cb, __innerCb } = executionContext;
            isStateModuleValid(targetModule, currentModule, cb, (err, newCb) => {
              if (err) return handleCcFnError(err, __innerCb);

              if (context) args.unshift(executionContext);
              let _partialState = null;
              co.wrap(userLogicFn)(...args).then(partialState => {
                _partialState = partialState;
                this.$$changeState(partialState, { stateFor, module: targetModule, forceSync, cb: newCb });
              }).then(() => {
                if (__innerCb) __innerCb(null, _partialState);
              }).catch(err => {
                handleCcFnError(err, __innerCb);
              });
            });
          },

          call: (userLogicFn, ...args) => {
            return this.cc.__promisifiedCallWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          callWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            return this.cc.__promisifiedCallWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb }, ...args);
          },
          __promisifiedCallWith: (userLogicFn, executionContext, ...args) => {
            return _promisifyCcFn(this.cc.__callWith, userLogicFn, executionContext, ...args);
          },
          __callWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb, __innerCb } = {}, ...args) => {
            isStateModuleValid(module, currentModule, cb, (err, newCb) => {
              if (err) return handleCcFnError(err, __innerCb);
              try {
                userLogicFn.call(this, this.__$$getChangeStateHandler({ stateFor, module, forceSync, cb: newCb }), ...args);
              } catch (err) {
                handleCcFnError(err, __innerCb);
              }
            });
          },

          callThunk: (userLogicFn, ...args) => {
            this.cc.__promisifiedCallThunkWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          callThunkWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            this.cc.__promisifiedCallThunkWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb }, ...args);
          },
          __promisifiedCallThunkWith: (userLogicFn, executionContext, ...args) => {
            return _promisifyCcFn(this.cc.__callThunkWith, userLogicFn, executionContext, ...args);
          },
          __callThunkWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb, __innerCb } = {}, ...args) => {
            isStateModuleValid(module, currentModule, cb, (err, newCb) => {
              if (err) return handleCcFnError(err, __innerCb);
              try {
                userLogicFn.call(this, ...args)(this.__$$getChangeStateHandler({ stateFor, module, forceSync, cb: newCb }));
              } catch (err) {
                handleCcFnError(err, __innerCb);
              }
            });
          },

          commit: (userLogicFn, ...args) => {
            this.cc.__commitWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          commitWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            this.cc.__commitWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb }, ...args);
          },
          __promisifiedCallWith: (userLogicFn, executionContext, ...args) => {
            return _promisifyCcFn(this.cc.__commitWith, userLogicFn, executionContext, ...args);
          },
          __commitWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb, __innerCb } = {}, ...args) => {
            isStateModuleValid(module, currentModule, cb, (err, newCb) => {
              if (err) return handleCcFnError(err, __innerCb);
              try {
                const state = userLogicFn.call(this, ...args);
                this.$$changeState(state, { stateFor, module, forceSync, cb: newCb });
              } catch (err) {
                handleCcFnError(err, __innerCb);
              }
            });
          },

          dispatch: ({ stateFor, module: inputModule, reducerModule: inputReducerModule, forceSync = false, type, payload, cb: reactCallback, __innerCb } = {}) => {
            //if module not defined, targetStateModule will be currentModule
            const targetStateModule = inputModule || currentModule;

            //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule
            const targetReducerModule = inputReducerModule || targetStateModule;

            const targetReducerMap = _reducer[targetReducerModule];
            if (!targetReducerMap) {
              return __innerCb(new Error(`no reducerMap found for reducer module:${targetReducerModule}`));
            }
            const reducerFn = targetReducerMap[type];
            if (!reducerFn) {
              const fns = Object.keys(targetReducerMap);
              return __innerCb(new Error(`no reducer defined in ccContext for reducer module:${targetReducerModule} type:${type}, maybe you want to invoke one of them:${fns}`));
            }
            // const errMsg = util.isCcActionValid({ type, payload });
            // if (errMsg) return justWarning(errMsg);

            const contextDispatch = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetStateModule, targetReducerModule);

            isStateModuleValid(targetStateModule, currentModule, reactCallback, (err, newCb) => {
              if (err) return __innerCb(err);
              const executionContext = {
                stateFor, ccUniqueKey, ccOption, module: targetStateModule, reducerModule: targetReducerModule, type, dispatch: contextDispatch,
                payload, state: this.state, moduleState: getState(targetStateModule), effect: this.$$effect, xeffect: this.$$xeffect,
                forceSync, cb: newCb, context: true, __innerCb
              };

              this.cc.__invokeWith(reducerFn, executionContext);
            });
          },
          prepareReactSetState: (changeBy, state, next, reactCallback) => {
            if (storedStateKeys.length > 0) {
              const { partialState, isStateEmpty } = extractStateByKeys(state, storedStateKeys);
              if (!isStateEmpty) {
                refStore.setState(ccUniqueKey, partialState);
              }
            }

            if (!state) {
              if (next) next();
              return;
            } else {
              computeValueForRef(this.$$computed, this.$$refComputed, state);
            }

            if (this.$$beforeSetState) {
              if (asyncLifecycleHook) {
                this.$$beforeSetState({ changeBy });
                this.cc.reactSetState(state, reactCallback);
                if (next) next();
              } else {
                // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                // $$beforeSetState(context, next){}
                this.$$beforeSetState({ changeBy }, () => {
                  this.cc.reactSetState(state, reactCallback);
                  if (next) next();
                });
              }
            } else {
              this.cc.reactSetState(state, reactCallback);
              if (next) next();
            }
          },
          prepareBroadcastGlobalState: (broadcastTriggeredBy, globalState) => {
            const { partialState: validGlobalState, isStateEmpty } = getAndStoreValidGlobalState(globalState);

            if (!isStateEmpty) {
              if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                if (asyncLifecycleHook) {
                  this.$$beforeBroadcastState({ broadcastTriggeredBy });
                  this.cc.broadcastGlobalState(validGlobalState);
                } else {
                  this.$$beforeBroadcastState({ broadcastTriggeredBy }, () => {
                    this.cc.broadcastGlobalState(validGlobalState);
                  });
                }
              } else {
                this.cc.broadcastGlobalState(validGlobalState);
              }
            }
          },
          prepareBroadcastState: (stateFor, broadcastTriggeredBy, moduleName, originalState, needClone) => {
            let targetSharedStateKeys, targetGlobalStateKeys;
            try {
              const result = getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, globalStateKeys, sharedStateKeys);
              targetSharedStateKeys = result.sharedStateKeys;
              targetGlobalStateKeys = result.globalStateKeys;
            } catch (err) {
              return justWarning(`${err.message} prepareBroadcastState failed!`)
            }

            const { isPartialSharedStateEmpty, isPartialGlobalStateEmpty, partialSharedState, partialGlobalState, module_globalState_ }
              = extractStateToBeBroadcasted(moduleName, originalState, targetSharedStateKeys, targetGlobalStateKeys);

            if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);
            if (!isPartialGlobalStateEmpty) ccStoreSetState(MODULE_GLOBAL, partialGlobalState);
            Object.keys(module_globalState_).forEach(moduleName => {
              ccStoreSetState(moduleName, module_globalState_[moduleName]);
            });

            if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
              if (asyncLifecycleHook) {
                this.$$beforeBroadcastState({ broadcastTriggeredBy }, () => {
                  this.cc.broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                });
              } else {
                this.$$beforeBroadcastState({ broadcastTriggeredBy });
                this.cc.broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
              }
            } else {
              this.cc.broadcastState(originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
            }
          },
          broadcastState: (originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone) => {

            let _partialSharedState = partialSharedState;
            if (needClone) _partialSharedState = util.clone(partialSharedState);// this clone operation may cause performance issue, if partialSharedState is too big!!

            const { ccUniqueKey: currentCcKey } = this.cc.ccState;
            const ccClassKey_isHandled_ = {};//record which ccClassKey has been handled

            // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
            // so flag ignoreCurrentCcKey as true;
            const ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;

            const ccClassKeys = moduleName_ccClassKeys_[moduleName];
            if (ccClassKeys) {
              //  these ccClass are watching the same module's state
              ccClassKeys.forEach(ccClassKey => {
                //  flag this ccClassKey been handled
                ccClassKey_isHandled_[ccClassKey] = true;

                const classContext = ccClassKey_ccClassContext_[ccClassKey];
                const { ccKeys, sharedStateKeys, globalStateKeys } = classContext;
                if (ccKeys.length === 0) return;
                if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return;

                //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!
                const {
                  partialState: sharedStateForCurrentCcClass, isStateEmpty: isSharedStateEmpty
                } = extractStateByKeys(_partialSharedState, sharedStateKeys);

                //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass
                const {
                  partialState: globalStateForCurrentCcClass, isStateEmpty: isPartialGlobalStateEmpty
                } = extractStateByKeys(partialGlobalState, globalStateKeys);
                if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;

                let mergedStateForCurrentCcClass = { ...globalStateForCurrentCcClass, ...sharedStateForCurrentCcClass };

                ccKeys.forEach(ccKey => {
                  if (ccKey === currentCcKey && ignoreCurrentCcKey) return;

                  const ref = ccKey_ref_[ccKey];
                  if (ref) {
                    const option = ccKey_option_[ccKey];
                    let toSet = null, changeBy = -1;
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
                        console.log(ss(`ref ${ccKey} to be rendered state(changeBy ${changeBy}) is broadcast from same module's other ref ${currentCcKey}`), cl());
                      }
                      ref.cc.prepareReactSetState(changeBy, toSet)
                    };
                  }
                });

              });
            }

            if (util.isObjectNotNull(module_globalState_)) {
              const moduleNames = Object.keys(module_globalState_);
              moduleNames.forEach(mName => {
                const partialGlobalState = module_globalState_[mName];
                const ccClassKeys = moduleName_ccClassKeys_[mName];
                ccClassKeys.forEach(ccClassKey => {
                  const classContext = ccClassKey_ccClassContext_[ccClassKey];
                  const { ccKeys, globalStateKeys } = classContext;

                  if (ccKeys.length === 0) return;
                  if (globalStateKeys.length === 0) return;
                  const {
                    partialState: globalStateForCurrentCcClass, isStateEmpty: isPartialGlobalStateEmpty
                  } = extractStateByKeys(partialGlobalState, globalStateKeys);

                  if (isPartialGlobalStateEmpty) return;

                  ccKeys.forEach(ccKey => {
                    const ref = ccKey_ref_[ccKey];
                    if (ref) {
                      const option = ccKey_option_[ccKey];
                      if (option.syncGlobalState) {
                        if (ccContext.isDebug) {
                          console.log(ss(`ref ${ccKey} to be rendered state(only global state) is broadcast from other module ${moduleName}`), cl());
                        }
                        ref.cc.prepareReactSetState(CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, globalStateForCurrentCcClass)
                      }
                    }
                  });

                });
              });
            }

            broadcastPropState(moduleName, originalState);
          },
          broadcastGlobalState: (globalSate) => {
            globalCcClassKeys.forEach(ccClassKey => {
              const classContext = ccClassKey_ccClassContext_[ccClassKey];
              const { globalStateKeys, ccKeys } = classContext;
              const { partialState, isStateEmpty } = extractStateByKeys(globalSate, globalStateKeys);
              if (!isStateEmpty) {
                ccKeys.forEach(ccKey => {
                  const ref = ccKey_ref_[ccKey];
                  if (ref) {
                    const option = ccKey_option_[ccKey];
                    if (option.syncGlobalState === true) {
                      ref.cc.prepareReactSetState(CHANGE_BY_BROADCASTED_GLOBAL_STATE, partialState);
                    }
                  }
                });
              }
            });
            broadcastPropState(MODULE_GLOBAL, globalSate);
          },

          emit: (event, ...args) => {
            findEventHandlersToPerform(event, { identity: null }, ...args);
          },
          emitIdentity: (event, identity, ...args) => {
            findEventHandlersToPerform(event, { identity }, ...args);
          },
          emitWith: (event, option, ...args) => {
            findEventHandlersToPerform(event, option, ...args);
          },
          on: (event, handler) => {
            bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler)
          },
          onIdentity: (event, identity, handler) => {
            bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler)
          },
          off: (event, { module, ccClassKey, identity } = {}) => {
            //  consider if module === currentModule, let off happened?
            findEventHandlersToOff(event, { module, ccClassKey, identity })
          },
        }

        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
        this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
        this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
        this.cc.dispatch = this.cc.dispatch.bind(this);
        this.cc.__callWith = this.cc.__callWith.bind(this);
        this.cc.__callThunkWith = this.cc.__callThunkWith.bind(this);
        this.cc.__commitWith = this.cc.__commitWith.bind(this);
        this.cc.__invokeWith = this.cc.__invokeWith.bind(this);

        // let CcComponent instance can call dispatch directly
        // if you call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY
        this.$$dispatch = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
        this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE);

        this.$$invoke = this.cc.invoke.bind(this);// commit state to cc directly, but userFn can be promise or generator both!
        this.$$invokeWith = this.cc.invokeWith.bind(this);
        this.$$call = this.cc.call.bind(this);// commit state by setState handler
        this.$$callWith = this.cc.callWith.bind(this);
        this.$$callThunk = this.cc.callThunk.bind(this);// commit state by setState handler
        this.$$callThunkWith = this.cc.callThunkWith.bind(this);
        this.$$commit = this.cc.commit.bind(this);// commit state to cc directly, userFn can only be normal function
        this.$$commitWith = this.cc.commitWith.bind(this);
        this.$$effect = this.cc.effect.bind(this);// commit state to cc directly, userFn can only be normal function
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

        this.setState = this.cc.setState;//let setState call cc.setState
        this.setGlobalState = this.cc.setGlobalState;//let setState call cc.setState
        this.forceUpdate = this.cc.forceUpdate;//let forceUpdate call cc.forceUpdate
      }

      // this method is useful only if you want to change other ccInstance's sate one time in a ccInstance which its syncSharedState is false, 
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
      $$changeState(state, { stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, broadcastTriggeredBy, changeBy, forceSync, cb: reactCallback } = {}) {//executionContext
        if (state == undefined) return;//do nothing

        if (!isPlainJsonObject(state)) {
          justWarning(`cc found your commit state is not a plain json object!`);
        }

        if (module == MODULE_GLOBAL) {
          this.cc.prepareBroadcastGlobalState(broadcastTriggeredBy, state);
        } else {
          const ccState = this.cc.ccState;
          const currentModule = ccState.module;
          if (module === currentModule) {
            // who trigger $$changeState, who will go to change the whole received state 
            this.cc.prepareReactSetState(changeBy || CHANGE_BY_SELF, state, () => {
              //if forceSync=true, cc clone the input state
              if (forceSync === true) {
                this.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
              } else if (ccState.ccOption.syncSharedState) {
                this.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
              } else {
                // stop broadcast state!
              }
            }, reactCallback);
          } else {
            if (forceSync) justWarning(`you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!` + vbi(`module:${module} currentModule${currentModule}`));
            if (reactCallback) justWarning(`callback for react.setState will be ignore`);
            this.cc.prepareBroadcastState(stateFor, broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
          }
        }
      }

      //{ module, forceSync, cb }
      __$$getChangeStateHandler(executionContext) {
        return (state) => {
          this.$$changeState(state, executionContext);
        }
      }

      __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload) {
        return ({ module = originalComputedStateModule, reducerModule = originalComputedReducerModule,
          forceSync = false, type = inputType, payload = inputPayload, cb: reactCallback } = {}) => {
          return new Promise((resolve, reject) => {
            this.cc.dispatch({ stateFor, module, reducerModule, forceSync, type, payload, cb: reactCallback, __innerCb: _promiseErrorHandler(resolve, reject) });
          });
        }
      }

      $$domDispatch(event) {
        const currentTarget = event.currentTarget;
        const { value, dataset } = currentTarget;
        const { cct: type, ccm: module, ccrm: reducerModule } = dataset;
        const payload = { event, dataset, value };
        const handler = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload);
        handler();
      }

      componentDidUpdate() {
        if (super.componentDidUpdate) super.componentDidUpdate()
        if (this.$$afterSetState) this.$$afterSetState();
      }

      componentWillUnmount() {
        const { ccUniqueKey, ccClassContext: { ccKeys } } = this.cc.ccState;
        unsetCcInstanceRef(ccKeys, ccUniqueKey);

        //if father component implement componentWillUnmount，call it again
        if (super.componentWillUnmount) super.componentWillUnmount();
      }

      render() {
        if (ccContext.isDebug) {
          console.log(ss(`@@@ render ${ccClassDisplayName(ccClassKey)}`), cl());
        }
        if (extendInputClass) {
          return super.render();
        } else {//now cc class extends ReactClass, call super.render()
          // now cc class extends ReactComponent, render user inputted ReactClass
          return <ReactClass {...this} {...this.props} />
        }
      }
    }

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  }
}
