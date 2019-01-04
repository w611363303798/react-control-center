
import {
  MODULE_DEFAULT, MODULE_GLOBAL, ERR, CHANGE_BY_SELF,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  SYNC_FROM_CC_INSTANCE_SHARED_STATE,
  SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE,
  SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE,
} from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';
import co from 'co';

const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning } = util;
const {
  store: { _state, getState }, reducer: { _reducer }, refStore, globalMappingKey_sharedKey_,
  ccKey_ref_, ccKey_option_, globalCcClassKeys, moduleName_ccClassKeys_, ccClassKey_ccClassContext_
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
  if (!isStateValid(state)) {
    return { partialState: {}, isStateEmpty: true };
  }
  const partialState = {};
  let isStateEmpty = true;
  targetKeys.forEach(key => {
    const value = state[key];
    if (util.isValueNotNull(value)) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return { partialState, isStateEmpty };
}

function extractGlobalStateByKeys(targetModule, commitState, globalStateKeys, sharedToGlobalMapping, globalMappingKey_sharedKey_) {
  //all stateValue if belong to globalState will be collected to module_globalState_ , key means module name, stateKey mean globalMappingKey
  const module_globalState_ = {};
  //all stateValue if belong to globalState will be collected to module_originalState_, key means module name, stateKey mean sharedKey
  const module_originalState_ = {};
  //all stateValue if belong to globalState will be collected to partialGlobalState
  const partialGlobalState = {};
  if (!isStateValid(commitState) || globalStateKeys.length === 0) {
    return { partialGlobalState, isPartialGlobalStateEmpty: true, module_globalState_ };
  }

  let isPartialGlobalStateEmpty = true;
  globalStateKeys.forEach(gKey => {
    if (commitState.hasOwnProperty(gKey)) {
      isPartialGlobalStateEmpty = false;
      const stateValue = commitState[gKey];
      partialGlobalState[gKey] = stateValue;

      const sharedKeyDescriptor = globalMappingKey_sharedKey_[gKey];
      if (sharedKeyDescriptor) {//this global key is mapping to some module's state key
        const { module, key } = sharedKeyDescriptor;
        let tmpModuleGlobalState = module_originalState_[module];
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
  const mappingOfThisModule = sharedToGlobalMapping[targetModule];
  if (mappingOfThisModule) {
    const originalSharedKeys = Object.keys(mappingOfThisModule);

    originalSharedKeys.forEach(originalSharedKey => {
      if (commitState.hasOwnProperty(originalSharedKey)) {
        const globalMappingKey = mappingOfThisModule[originalSharedKey];
        const stateValue = commitState[originalSharedKey];
        isPartialGlobalStateEmpty = false;
        partialGlobalState[globalMappingKey] = stateValue;//collect this stateValue to partialGlobalState

        let targetModuleGlobalState = module_globalState_[targetModule];
        if (!targetModuleGlobalState) {
          targetModuleGlobalState = module_globalState_[targetModule] = {};
        }
        targetModuleGlobalState[globalMappingKey] = stateValue;
      }
    });
  }

  return { partialGlobalState, isPartialGlobalStateEmpty, module_globalState_, module_originalState_ };
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
function isInputModuleInvalid(inputModule, currentModule, reactCallback, cb) {
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
      ccUniqueKey = `${ccClassKey}/${uuid()}`;
      isCcUniqueKeyAutoGenerated = true;
    }
  }
  return { ccUniqueKey, isCcUniqueKeyAutoGenerated };
}

function checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys) {
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
}

function checkCcStartupOrNot() {
  if (!window.cc) throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
}

function extractStateToBeBroadcasted(module, sourceState, sharedToGlobalMapping, globalMappingKey_sharedKey_, sharedStateKeys, globalStateKeys) {
  let partialSharedState = {};
  let isPartialSharedStateEmpty = true;
  if (sharedStateKeys.length > 0) {
    const { partialState, isStateEmpty } = extractStateByKeys(sourceState, sharedStateKeys);
    if (!isStateEmpty) {
      ccContext.store.setState(module, partialState);
      isPartialSharedStateEmpty = isStateEmpty;
      partialSharedState = partialState;
    }
  }
  const { partialGlobalState, isPartialGlobalStateEmpty, module_globalState_, module_originalState_ } =
    extractGlobalStateByKeys(module, sourceState, globalStateKeys, sharedToGlobalMapping, globalMappingKey_sharedKey_);
  if (!isPartialGlobalStateEmpty) {
    ccContext.store.setGlobalState(partialGlobalState);
  }

  return { isPartialSharedStateEmpty, partialSharedState, isPartialGlobalStateEmpty, partialGlobalState, module_globalState_, module_originalState_ };
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
  sharedStateKeys = [],
  globalStateKeys = [],
} = {}) {
  checkCcStartupOrNot();
  const _curStateModule = module;
  const _asyncLifecycleHook = asyncLifecycleHook;
  const _reducerModule = reducerModule || _curStateModule;//if reducerModule not defined, will be equal module;
  checkStoreModule(_curStateModule);
  checkReducerModule(_reducerModule);
  checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys);

  //tell cc this ccClass is watching some globalStateKeys of global module
  if (globalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  if (contextMap[ccClassKey] !== undefined) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  } else {
    //tell cc this ccClass is watching some sharedStateKeys of a module
    contextMap[ccClassKey] = util.makeCcClassContext(_curStateModule, sharedStateKeys, globalStateKeys);
  }

  let ccClassKeys_ = moduleName_ccClassKeys_[_curStateModule];
  if (!ccClassKeys_) ccClassKeys_ = moduleName_ccClassKeys_[_curStateModule] = [];
  ccClassKeys_.push(ccClassKey);

  return function (ReactClass) {
    if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
      throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi(`if you want to register ${ccClassKey} to cc successfully, the ReactClass can not be a CCClass!`));
    }

    const CcClass = class extends ReactClass {

      constructor(props, context) {
        super(props, context);
        if (!this.state) this.state = {};
        const { ccKey, ccOption = {} } = props;
        util.bindThis(this, [
          '__$$bindDataToCcClassContext', '__$$mapCcToInstance', '__$$getChangeStateHandler', '$$changeState', '__$$recoverState'
        ]);
        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];
        if (ccOption.syncState === undefined) ccOption.syncState = true;
        if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
        if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
        const { asyncLifecycleHook, storedStateKeys } = ccOption;

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
        const { syncState, syncGlobalState } = ccOption;

        let partialSharedState = {}, partialGlobalState = {};
        if (syncState) {
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
        const classContext = contextMap[ccClassKey];
        const ccKeys = classContext.ccKeys;
        if (ccContext.isDebug) {
          console.log(ss(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
        }

        if (!util.isCcOptionValid(ccOption)) {
          throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi(`a standard default ccOption may like: {"syncState": true, "asyncLifecycleHook":false, "storedStateKeys": []}`));
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
        ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys, globalStateKeys
      ) {
        const reactSetStateRef = this.setState.bind(this);
        const reactForceUpdateRef = this.forceUpdate.bind(this);
        const ccState = {
          renderCount: 1, isSingle, asyncLifecycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, module: currentModule, reducerModule, sharedStateKeys, globalStateKeys
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
          prepareReactSetState: (changeWay, state, isStateGlobal, next, reactCallback) => {
            let _targetState = null;
            if (isStateGlobal) {//this state is prepare for global, usually called by setGlobalState
              const { partialState: partialGlobalState, isStateEmpty } = extractStateByKeys(state, globalStateKeys);
              if (!isStateEmpty) _targetState = partialGlobalState;
            } else {
              if (storedStateKeys.length > 0) {
                const { partialState, isStateEmpty } = extractStateByKeys(state, storedStateKeys);
                if (!isStateEmpty) {
                  refStore.setState(ccUniqueKey, partialState);
                }
              }
              _targetState = state;
            }

            if (!_targetState) {
              if (next) next();
              return;
            }

            if (this.$$beforeSetState) {
              if (asyncLifecycleHook) {
                // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                // $$beforeSetState(context, next){}
                this.$$beforeSetState({ changeWay }, () => {
                  this.cc.reactSetState(state, reactCallback);
                  if (next) next();
                });
              } else {
                this.$$beforeSetState({ changeWay });
                this.cc.reactSetState(state, reactCallback);
                if (next) next();
              }
            } else {
              this.cc.reactSetState(state, reactCallback);
              if (next) next();
            }
          },
          prepareBroadcastState: (triggerType, moduleName, originalState, needClone) => {
            const { sharedStateKeys, globalStateKeys } = this.cc.ccState;
            const sharedToGlobalMapping = ccContext.sharedToGlobalMapping;
            const { isPartialSharedStateEmpty, isPartialGlobalStateEmpty, partialSharedState, partialGlobalState, module_globalState_, module_originalState_ }
              = extractStateToBeBroadcasted(moduleName, originalState, sharedToGlobalMapping, globalMappingKey_sharedKey_, sharedStateKeys, globalStateKeys);

            if (!isPartialSharedStateEmpty || !isPartialGlobalStateEmpty) {
              if (this.$$beforeBroadcastState) {//user define life cycle hook $$beforeBroadcastState
                if (asyncLifecycleHook) {
                  this.$$beforeBroadcastState({ triggerType }, () => {
                    this.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                  });
                } else {
                  this.$$beforeBroadcastState({ triggerType });
                  this.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                }
              } else {
                this.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
              }
            }
          },
          reactSetState: (state, cb) => {
            ccState.renderCount += 1;
            reactSetStateRef(state, cb);
          },
          reactForceUpdate: (state, cb) => {
            ccState.renderCount += 1;
            reactForceUpdateRef(state, cb);
          },
          setState: (state, cb) => {
            this.$$changeState(state, { module: currentModule, cb });
          },
          setGlobalState: (partialGlobalState, changeWay = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE) => {
            // this.cc.prepareBroadcastState(changeWay, module, null, partialGlobalState, false, false);
            ccContext.store.setGlobalState(partialGlobalState);
            this.$$changeState(partialGlobalState, { module: currentModule, changeWay, isStateGlobal: true });
          },
          forceUpdate: (cb) => {
            this.$$changeState(this.state, { module: currentModule, cb });
          },
          // always change self module's state
          invoke: (userLogicFn, ...args) => {
            this.cc.invokeWith(userLogicFn, { module: currentModule }, ...args);
          },
          // change other module's state, mostly you should use this method to generate new state instead of xeffect,
          // because xeffect will force your logicFn to put your first param as ExecutionContext
          effect: (targetModule, userLogicFn, ...args) => {
            this.cc.invokeWith(userLogicFn, { context: false, module: targetModule }, ...args);
          },
          // change other module's state, cc will give userLogicFn EffectContext object as first param
          xeffect: (targetModule, userLogicFn, ...args) => {
            this.cc.invokeWith(userLogicFn, { context: true, module: targetModule }, ...args);
          },
          invokeWith: (userLogicFn, { module = currentModule, context = false, forceSync = false, cb } = {}, ...args) => {
            isInputModuleInvalid(module, currentModule, cb, (newCb) => {
              if (context) args.unshift({ module, state: getState(module), effect: this.$$effect, xeffect: this.$$xeffect });
              co.wrap(userLogicFn)(...args).then(state => {
                this.$$changeState(state, { module, forceSync, cb: newCb });
              }).catch(justWarning);
            });
          },
          call: (userLogicFn, ...args) => {
            this.cc.callWith(userLogicFn, { module: currentModule }, ...args);
          },
          callWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isInputModuleInvalid(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, this.__$$getChangeStateHandler({ module, forceSync, cb: newCb }), ...args);
            });
          },
          callThunk: (userLogicFn, ...args) => {
            this.cc.callThunkWith(userLogicFn, { module: currentModule }, ...args);
          },
          callThunkWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isInputModuleInvalid(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, ...args)(this.__$$getChangeStateHandler({ module, forceSync, cb: newCb }));
            });
          },
          commit: (userLogicFn, ...args) => {
            this.cc.commitWith(userLogicFn, { module: currentModule }, ...args);
          },
          commitWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isInputModuleInvalid(module, currentModule, cb, (newCb) => {
              const state = userLogicFn.call(this, ...args);
              this.$$changeState(state, { module, forceSync, cb: newCb });
            });
          },
          dispatch: ({ module, reducerModule, forceSync = false, type, payload, cb: reactCallback } = {}) => {
            let inputModule = module || currentModule;
            const { reducerModule: currentReducerModule } = this.cc.ccState;
            const targetReducerModule = reducerModule || currentReducerModule;//if reducerModule not defined, will find currentReducerModule's reducer

            const targetReducerMap = _reducer[targetReducerModule];
            if (!targetReducerMap) return justWarning(`no reducerMap found for module:${targetReducerModule}`);
            const reducerFn = targetReducerMap[type];
            if (!reducerFn) return justWarning(`no reducer defined in ccContext for module:${targetReducerModule} type:${type}`);
            const errMsg = util.isCcActionValid({ type, payload });
            if (errMsg) return justWarning(errMsg);

            const executionContext = {
              ccUniqueKey, ccOption, module, reducerModule, type,
              payload, state: this.state, effect: this.$$effect, xeffect: this.$$xeffect
            };

            isInputModuleInvalid(inputModule, currentModule, reactCallback, (newCb) => {
              this.cc.invokeWith(reducerFn, { inputModule, forceSync, cb: newCb }, executionContext);
            });
          },
          broadcastState: (moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone) => {
            let _partialSharedState = partialSharedState;
            if (needClone) _partialSharedState = util.clone(partialSharedState);// this clone may cause performance issue, if partialSharedState is too big!!

            ccContext.store.setState(moduleName, _partialSharedState);
            const { ccUniqueKey: currentCcKey } = this.cc.ccState;
            const ccClassKey_isHandled_ = {};//record which ccClassKey has been handled

            const ccClassKeys = moduleName_ccClassKeys_[moduleName];
            if (ccClassKeys) {
              //these ccClass subscribe the same module's state
              ccClassKeys.forEach(ccClassKey => {
                ccClassKey_isHandled_[ccClassKey] = true;
                const classContext = ccClassKey_ccClassContext_[ccClassKey];
                const { ccKeys, sharedStateKeys, globalStateKeys } = classContext;
                if (ccKeys.length === 0) return;

                if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return;

                // extract _partialSharedState! because different class with a same module may have different sharedStateKeys!!!
                const {
                  partialState: sharedStateForCurrentCcClass, isStateEmpty: isSharedStateEmpty
                } = extractStateByKeys(_partialSharedState, sharedStateKeys);

                // extract sourcePartialGlobalState! because different class watch different globalStateKeys.
                // it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                // just call extract state from partialGlobalState to get globalStateForCurrentCcClass
                const {
                  partialState: globalStateForCurrentCcClass, isStateEmpty: isPartialGlobalStateEmpty
                } = extractStateByKeys(partialGlobalState, globalStateKeys);
                if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;

                let mergedStateForCurrentCcClass = { ...globalStateForCurrentCcClass, ...sharedStateForCurrentCcClass };

                ccKeys.forEach(ccKey => {
                  if (ccKey === currentCcKey) return;

                  const ref = ccKey_ref_[ccKey];
                  if (ref) {
                    const option = ccKey_option_[ccKey];
                    let toSet = null, changeWay = -1;
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
                        console.log(ss(`ref ${ccKey} render triggered by broadcast's way1`), cl());
                      }
                      ref.cc.prepareReactSetState(changeWay, toSet)
                    };
                  }
                });

              });
            }

            if (partialGlobalState) {
              //these ccClass are watching globalState
              globalCcClassKeys.forEach(ccClassKey => {
                if (ccClassKey_isHandled_[ccClassKey]) return;

                const classContext = ccClassKey_ccClassContext_[ccClassKey];
                const { ccKeys: watchingGlobalStateCcKeys, globalStateKeys, module: currentCcClassModule } = classContext;

                // if there is no any ccInstance of this ccClass are watching globalStateKey, return;
                if (watchingGlobalStateCcKeys.length === 0) return;

                const originalStateOfMappingState = module_originalState_[currentCcClassModule];
                if (originalStateOfMappingState) {
                  ccContext.store.setState(currentCcClassModule, originalStateOfMappingState);
                }

                const {
                  partialState: globalStateForCurrentCcClass, isStateEmpty: isPartialGlobalStateEmpty
                } = extractStateByKeys(partialGlobalState, globalStateKeys);

                const mappedGlobalStateForCurrentCcClass = module_globalState_[currentCcClassModule];
                //!!! backup state for current module
                ccContext.store.setGlobalState(mappedGlobalStateForCurrentCcClass);

                if (isPartialGlobalStateEmpty && !mappedGlobalStateForCurrentCcClass && !originalStateOfMappingState) return;


                const toSet = { ...globalStateForCurrentCcClass, ...mappedGlobalStateForCurrentCcClass, ...originalStateOfMappingState };

                watchingGlobalStateCcKeys.forEach(ccKey => {
                  // if (excludeTriggerRef && ccKey === currentCcKey) return;
                  const ref = ccKey_ref_[ccKey];
                  if (ref) {
                    if (ccContext.isDebug) {
                      console.log(ss(`ref ${ccKey} render triggered by broadcast's way2`), cl());
                    }
                    ref.cc.prepareReactSetState(SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE, toSet);
                  }
                });

              });

            }

          }
        }
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
        this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
        this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
        this.$$dispatch = this.cc.dispatch.bind(this);;//let CCComponent instance can call dispatch directly
        this.$$invoke = this.cc.invoke.bind(this);;//commit state to cc directly, but userFn can be promise or generator both!
        this.$$invokeWith = this.cc.invokeWith.bind(this);;
        this.$$call = this.cc.call.bind(this);;// commit state by setState handler
        this.$$callWith = this.cc.callWith.bind(this);;
        this.$$callThunk = this.cc.callThunk.bind(this);;// commit state by setState handler
        this.$$callThunkWith = this.cc.callThunkWith.bind(this);;
        this.$$commit = this.cc.commit.bind(this);;// commit state to cc directly, userFn can only be normal function
        this.$$commitWith = this.cc.commitWith.bind(this);;
        this.$$effect = this.cc.effect.bind(this);;// commit state to cc directly, userFn can only be normal function
        this.$$xeffect = this.cc.xeffect.bind(this);;

        this.setState = this.cc.setState;//let setState call cc.setState
        this.setGlobalState = this.cc.setGlobalState;//let setState call cc.setState
        this.forceUpdate = this.cc.forceUpdate;//let forceUpdate call cc.forceUpdate
      }

      // note!!! changeState do two thing, decide if it will change self's state or not, if it will broadcast state or not;
      // when ccIns's module != target module,
      //        cc will only broadcast the state to target module, caution: it will overwrite the target module's state!!
      // when ccIns's module == target module,
      //        if ccIns option.syncState is false, cc only change it's own state, 
      //           but if you pass forceSync=true, cc also will broadcast the state to target module and caution: it will overwrite the target module's state !!!
      //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module
      $$changeState(state, { isStateGlobal = false, module, changeWay, forceSync, cb: reactCallback } = {}) {//executionContext
        const ccState = this.cc.ccState;
        const currentModule = ccState.module;
        if (module === currentModule) {
          // who trigger $$changeState, who will go to change the whole received state 
          this.cc.prepareReactSetState(changeWay || CHANGE_BY_SELF, state, isStateGlobal, () => {
            //if forceSync=true, cc clone the input state
            if (forceSync) {
              this.cc.prepareBroadcastState(changeWay || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, forceSync);
            } else if (ccState.ccOption.syncState) {
              this.cc.prepareBroadcastState(changeWay || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
            } else {
              // stop broadcast state!
            }
          }, reactCallback);
        } else {
          if (forceSync) justWarning(`you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!` + vbi(`module:${module} currentModule${currentModule}`));
          if (reactCallback) justWarning(`callback for react.setState will be ignore`);
          this.cc.prepareBroadcastState(changeWay || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
        }
      }

      //{ module, forceSync, cb }
      __$$getChangeStateHandler(executionContext) {
        return (state) => {
          this.$$changeState(state, executionContext);
        }
      }

      componentDidUpdate() {
        if (super.componentDidUpdate) super.componentDidUpdate()
        if (this.$$afterSetState) this.$$afterSetState();
      }

      componentWillUnmount() {
        const { ccUniqueKey, ccClassContext: { ccKeys } } = this.cc.ccState;
        unsetCcInstanceRef(ccKeys, ccUniqueKey);

        //如果父组件实现了componentWillUnmount，要调用一遍
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
