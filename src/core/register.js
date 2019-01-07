
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
import util, { isPlainJsonObject } from '../support/util';
import uuid from 'uuid';
import co from 'co';

const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning } = util;
const {
  store: { _state, getState }, reducer: { _reducer }, refStore, globalMappingKey_sharedKey_,
  moduleName_sharedStateKeys_, moduleName_globalStateKeys_,
  ccKey_ref_, ccKey_option_, globalCcClassKeys, moduleName_ccClassKeys_, ccClassKey_ccClassContext_,
  globalStateKeys: ccGlobalStateKeys,
  globalMappingKey_toModules_, globalMappingKey_fromModule_, globalKey_toModules_, sharedKey_globalMappingKeyDescriptor_
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

function isStateValid(state) {
  if (!state || !util.isPlainJsonObject(state)) {
    return false;
  } else {
    return true;
  }
}

function extractStateByKeys(state, targetKeys) {
  if (!isStateValid(state) || !util.isObjectNotNull(state)) {
    return { partialState: {}, isStateEmpty: true };
  }
  const partialState = {};
  let isStateEmpty = true;
  targetKeys.forEach(key => {
    const value = state[key];
    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return { partialState, isStateEmpty };
}

function handleError(err, throwError = true) {
  if (throwError) throw err;
  else {
    justWarning(err);
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
    cb(targetCb);
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

const stateKeyDuplicateInNonModuleWarning = `
now cc is running in non module mode, and cc found you are initializing a ccClass with inputSharedStateKeys='all' in register option, 
in this situation, the ccInstance's state will automatically take all the default state merge into it's own state, but some keys of ccInstance state
duplicate with default module state keys, so cc will ignore the ccInstance state value of these duplicate state keys, and take their state value from
default module! if this is not as you expected, please check your ccInstance state declaration statement!`
function getSharedKeysAndGlobalKeys(module, refState, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
  let sharedStateKeys = inputSharedStateKeys, globalStateKeys = inputGlobalStateKeys;
  if (ccContext.isModuleMode) {
    if (inputSharedStateKeys === 'all' || inputSharedStateKeys === undefined) {
      sharedStateKeys = Object.keys(getState(module));
    }
  } else {
    //  for non module mode, any ccClass must set inputSharedStateKeys as 'all' in register option if it want to watch default module's state changing
    //  because if cc automatically let a ccClass watching default module's whole state keys, it is very easy and implicit to dirty the ccClass's instance state
    if (inputSharedStateKeys === 'all') {
      const defaultModuleState = getState(module);
      const refStateKeys = Object.keys(refState);
      const duplicateKeys = [];
      refStateKeys.forEach(key => {
        //  set state value to default module state dynamically while a ccInstance created
        const stateValueOfDefault = defaultModuleState[key];
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
        justWarning(stateKeyDuplicateInNonModuleWarning + ' ' + verboseInfo(`module ${module}, ccClassKey${ccClassKey}, ccInstance state of these keys will been ignored: ${duplicateKeys.toString()}`));
      }

      sharedStateKeys = Object.keys(defaultModuleState);
    } else if (inputSharedStateKeys === undefined) {
      sharedStateKeys = [];
    }
  }

  if (inputGlobalStateKeys === 'all') {
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
  if (!window.cc) throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
}

function extractStateToBeBroadcasted(module, sourceState, sharedStateKeys, globalStateKeys) {
  const ccSetState = ccContext.store.setState;
  const globalState = getState(MODULE_GLOBAL);

  const { partialState: partialSharedState, isStateEmpty: isPartialSharedStateEmpty } = extractStateByKeys(sourceState, sharedStateKeys);
  if (!isPartialSharedStateEmpty) {
    ccSetState(module, partialSharedState);
  }

  const { partialState: partialGlobalState, isStateEmpty: isPartialGlobalStateEmpty } = extractStateByKeys(sourceState, globalStateKeys);
  if (!isPartialGlobalStateEmpty) {
    ccSetState(MODULE_GLOBAL, partialGlobalState);
  }

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
      toModules.forEach(m => {
        let modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
        modulePartialGlobalState[stateKey] = stateValue;
      });
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
        toModules.forEach(m => {
          let modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
          modulePartialGlobalState[globalMappingKey] = stateValue;
          //  !!!set this state to globalState, let other module that watching this globalMappingKey
          //  can recover it correctly while they are mounted again!
          globalState[globalMappingKey] = stateValue;
        });
      }
    }
  });

  Object.keys(module_globalState_).forEach(moduleName => {
    ccSetState(moduleName, module_globalState_[moduleName]);
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

//tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state
function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, sharedStateKeys, globalStateKeys) {
  const contextMap = ccContext.ccClassKey_ccClassContext_;
  if (contextMap[ccClassKey] !== undefined) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  } else {
    contextMap[ccClassKey] = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys);
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
    globalStateKeys = moduleName_globalStateKeys_[moduleName];
    sharedStateKeys = moduleName_sharedStateKeys_[moduleName];
  } else {
    throw new Error(`stateFor is not set correctly! `)
    // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
  }
  return { globalStateKeys, sharedStateKeys };
}

function mapModuleAssociateDataToCcContext(ccClassKey, stateModule, refState, sharedStateKeys, globalStateKeys) {
  const { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys } =
    getSharedKeysAndGlobalKeys(stateModule, refState, ccClassKey, sharedStateKeys, globalStateKeys);

  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, targetSharedStateKeys, targetGlobalStateKeys)
  mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);

  mapModuleAndGlobalStateKeys(stateModule, targetGlobalStateKeys);
  mapGlobalKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapGlobalMappingKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapModuleAndCcClassKeys(stateModule, ccClassKey);

  //tell cc this ccClass is watching some globalStateKeys of global module
  if (targetGlobalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);

  return { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys };
}

/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/
export default function register(ccClassKey, {
  isSingle = false,
  asyncLifecycleHook = false,// is asyncLifecycleHook = true, it may block cc broadcast state to other when it takes a long time to finish
  module = MODULE_DEFAULT,
  reducerModule,
  sharedStateKeys: inputSharedStateKeys,
  globalStateKeys: inputGlobalStateKeys = [],
} = {}) {
  checkCcStartupOrNot();
  const _curStateModule = module;
  const _asyncLifecycleHook = asyncLifecycleHook;
  const _reducerModule = reducerModule || _curStateModule;//if reducerModule not defined, will be equal module;

  checkStoreModule(_curStateModule);
  checkReducerModule(_reducerModule);

  let sharedStateKeys, globalStateKeys;
  if (ccContext.isModuleMode) {
    const { sharedStateKeys: sKeys, globalStateKeys: gKeys } = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, null, inputSharedStateKeys, inputGlobalStateKeys);
    sharedStateKeys = sKeys, globalStateKeys = gKeys;
  } else {
    //  for non module mode, map operation delay execute until one ccInstance generated
  }


  return function (ReactClass) {
    if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
      throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi(`if you want to register ${ccClassKey} to cc successfully, the ReactClass can not be a CcClass!`));
    }

    const CcClass = class extends ReactClass {

      constructor(props, context) {
        super(props, context);
        if (!this.state) this.state = {};
        const { ccKey, ccOption = {} } = props;
        util.bindThis(this, [
          '__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState', '__$$getDispatchHandler'
        ]);
        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];
        // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing
        if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true;
        // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing
        if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;

        if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
        const { asyncLifecycleHook, storedStateKeys } = ccOption;

        if (!ccClassContext.isModuleMode) {
          const { sharedStateKeys: sKeys, globalStateKeys: gKeys } = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, this.state, inputSharedStateKeys, inputGlobalStateKeys);
          sharedStateKeys = sKeys, globalStateKeys = gKeys;
        }

        const { ccUniqueKey, isCcUniqueKeyAutoGenerated } = computeCcUniqueKey(isSingle, ccClassKey, ccKey)
        const ccClassContext = this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);
        this.__$$mapCcToInstance(
          isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys
        );

        this.__$$recoverState();
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
        this.state = { ...selfState, ...refState, ...partialSharedState, ...partialGlobalState };
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
            this.$$changeState(state, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb });
          },
          setGlobalState: (partialGlobalState, broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE) => {
            ccContext.store.setGlobalState(partialGlobalState);
            this.$$changeState(partialGlobalState, { module: currentModule, broadcastTriggeredBy, isStateGlobal: true });
          },
          forceUpdate: (cb) => {
            this.$$changeState(this.state, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb });
          },
          // always change self module's state
          invoke: (userLogicFn, ...args) => {
            this.cc.__invokeWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          // change other module's state, mostly you should use this method to generate new state instead of xeffect,
          // because xeffect will force your logicFn to put your first param as ExecutionContext
          effect: (targetModule, userLogicFn, ...args) => {
            this.cc.__invokeWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, context: false, module: targetModule }, ...args);
          },
          // change other module's state, cc will give userLogicFn EffectContext object as first param
          xeffect: (targetModule, userLogicFn, ...args) => {
            this.cc.__invokeWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, state: getState(targetModule), context: true, module: targetModule }, ...args);
          },
          invokeWith: (userLogicFn, option, ...args) => {
            const { module = currentModule, context = false, forceSync = false, cb } = option;
            this.cc.__invokeWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, state: getState(module), context, forceSync, cb }, ...args);
          },
          __invokeWith: (userLogicFn, executionContext, ...args) => {
            const { stateFor, module: targetModule = currentModule, context = false, forceSync = false, cb } = executionContext;
            isStateModuleValid(targetModule, currentModule, cb, (newCb) => {
              if (context) args.unshift(executionContext);
              co.wrap(userLogicFn)(...args).then(partialState => {
                this.$$changeState(partialState, { stateFor, module: targetModule, forceSync, cb: newCb });
              }).catch(justWarning);
            });
          },

          call: (userLogicFn, ...args) => {
            this.cc.__callWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          callWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            this.cc.__callWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb }, ...args);
          },
          __callWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isStateModuleValid(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, this.__$$getChangeStateHandler({ stateFor, module, forceSync, cb: newCb }), ...args);
            });
          },

          callThunk: (userLogicFn, ...args) => {
            this.cc.__callThunkWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          callThunkWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            this.cc.__callThunkWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb }, ...args);
          },
          __callThunkWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isStateModuleValid(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, ...args)(this.__$$getChangeStateHandler({ stateFor, module, forceSync, cb: newCb }));
            });
          },

          commit: (userLogicFn, ...args) => {
            this.cc.__commitWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule }, ...args);
          },
          commitWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            this.cc.__commitWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb }, ...args);
          },
          __commitWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isStateModuleValid(module, currentModule, cb, (newCb) => {
              const state = userLogicFn.call(this, ...args);
              this.$$changeState(state, { stateFor, module, forceSync, cb: newCb });
            });
          },

          dispatch: ({ stateFor, module: inputModule, reducerModule: inputReducerModule, forceSync = false, type, payload, cb: reactCallback } = {}) => {
            //if module not defined, targetStateModule will be currentModule
            const targetStateModule = inputModule || currentModule;

            //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule
            const targetReducerModule = inputReducerModule || targetStateModule;

            const targetReducerMap = _reducer[targetReducerModule];
            if (!targetReducerMap) return justWarning(`no reducerMap found for module:${targetReducerModule}`);
            const reducerFn = targetReducerMap[type];
            if (!reducerFn) return justWarning(`no reducer defined in ccContext for module:${targetReducerModule} type:${type}`);
            // const errMsg = util.isCcActionValid({ type, payload });
            // if (errMsg) return justWarning(errMsg);

            const contextDispatch = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE);

            isStateModuleValid(targetStateModule, currentModule, reactCallback, (newCb) => {
              const executionContext = {
                stateFor, ccUniqueKey, ccOption, module: targetStateModule, reducerModule: targetReducerModule, type, dispatch: contextDispatch,
                payload, state: getState(targetStateModule), effect: this.$$effect, xeffect: this.$$xeffect, forceSync, cb: newCb, context: true
              };

              this.cc.__invokeWith(reducerFn, executionContext);
            });
          },
          prepareReactSetState: (changeBy, state, next, reactCallback) => {
            let _targetState = null;
            if (storedStateKeys.length > 0) {
              const { partialState, isStateEmpty } = extractStateByKeys(state, storedStateKeys);
              if (!isStateEmpty) {
                refStore.setState(ccUniqueKey, partialState);
              }
            }
            _targetState = state;

            if (!_targetState) {
              if (next) next();
              return;
            }

            if (this.$$beforeSetState) {
              if (asyncLifecycleHook) {
                // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                // $$beforeSetState(context, next){}
                this.$$beforeSetState({ changeBy }, () => {
                  this.cc.reactSetState(state, reactCallback);
                  if (next) next();
                });
              } else {
                this.$$beforeSetState({ changeBy });
                this.cc.reactSetState(state, reactCallback);
                if (next) next();
              }
            } else {
              this.cc.reactSetState(state, reactCallback);
              if (next) next();
            }
          },
          prepareBroadcastGlobalState: (broadcastTriggeredBy, globalState) => {
            const { partialState: partialGlobalState, isStateEmpty } = extractStateByKeys(globalState, ccGlobalStateKeys);
            if (Object.keys(partialGlobalState) < Object.keys(globalState)) {
              justWarning(`
                note! you are calling method setGlobalState, but the state you commit include some invalid keys which is not declared in cc's global state, 
                cc will ignore them, but if this result is not as you expected, please check your committed global state!`
              );
            }
            if (!isStateEmpty) {
              if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                if (asyncLifecycleHook) {
                  this.$$beforeBroadcastState({ broadcastTriggeredBy }, () => {
                    this.cc.broadcastGlobalState(partialGlobalState);
                  });
                } else {
                  this.$$beforeBroadcastState({ broadcastTriggeredBy });
                  this.cc.broadcastGlobalState(partialGlobalState);
                }
              } else {
                this.cc.broadcastGlobalState(partialGlobalState);
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

            if (!isPartialSharedStateEmpty || !isPartialGlobalStateEmpty) {
              if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                if (asyncLifecycleHook) {
                  this.$$beforeBroadcastState({ broadcastTriggeredBy }, () => {
                    this.cc.broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                  });
                } else {
                  this.$$beforeBroadcastState({ broadcastTriggeredBy });
                  this.cc.broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
                }
              } else {
                this.cc.broadcastState(stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone);
              }
            }
          },
          broadcastState: (stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone) => {

            let _partialSharedState = partialSharedState;
            if (needClone) _partialSharedState = util.clone(partialSharedState);// this clone operation may cause performance issue, if partialSharedState is too big!!

            ccContext.store.setState(moduleName, _partialSharedState);
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

          },
          broadcastGlobalState: (globalSate) => {
            globalCcClassKeys.forEach(ccClassKey => {
              const { globalStateKeys, ccKeys } = ccClassKey_ccClassContext_[ccClassKey];
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
          }
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
      $$changeState(state, { stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, isStateGlobal = false, module, broadcastTriggeredBy, changeBy, forceSync, cb: reactCallback } = {}) {//executionContext
        if (!isPlainJsonObject(state)) {
          justWarning(`cc found your commit state is not a plain json object!`);
        }

        if (isStateGlobal) {
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

      __$$getDispatchHandler(stateFor) {
        return ({ module, reducerModule, forceSync = false, type, payload, cb: reactCallback } = {}) => {
          this.cc.dispatch({ stateFor, module, reducerModule, forceSync, type, payload, cb: reactCallback });
        }
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
        return super.render();
      }
    }

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  }
}
