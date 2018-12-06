
import {
  MODULE_DEFAULT, MODULE_GLOBAL, ERR, CHANGE_BY_SELF, SYNC_FROM_CC_INSTANCE_STATE, SYNC_FROM_CC_REF_STORE,
  SYNC_FROM_CC_CLASS_STORE, SYNC_FROM_CC_CLASS_STORE_AND_REF_STORE, BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  SYNC_FROM_GLOBAL_STORE_AND_CC_CLASS_STORE,
  SYNC_FROM_GLOBAL_STORE_AND_CC_CLASS_STORE_AND_REF_STORE,
  SYNC_FROM_GLOBAL_STORE,
  SYNC_FROM_GLOBAL_STORE_AND_REF_STORE,
} from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';
import co from 'co';

const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning } = util;
const { store: { _state }, reducer: { _reducers } } = ccContext;
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

function handleError(err, throwError = true) {
  if (throwError) throw err;
  else {
    justWarning(err);
  }
}

function checkStoreModule(module, throwError = true) {
  if (!ccContext.isModuleMode) {
    if (module !== MODULE_DEFAULT) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `module:${module}`), throwError);
      return false;
    } else return true;
  } else {
    if (!_state[module]) {
      handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, `module:${module}`), throwError);
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
    if (!_reducers[reducerModule]) {
      handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, `reducerModule:${reducerModule}`), throwError);
    }
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

/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/
export default function register(ccClassKey, {
  isSingle = false,
  asyncLifeCycleHook = false,// is asyncLifeCycleHook = true, it may block cc broadcast state to other when it takes a long time to finish
  module = MODULE_DEFAULT,
  reducerModule,
  sharedStateKeys = [],
  globalStateKeys = [],
} = {}) {
  const _asyncLifeCycleHook = asyncLifeCycleHook;
  const _reducerModule = reducerModule || module;//if reducerModule not defined, will be equal module;
  checkStoreModule(module);
  checkReducerModule(_reducerModule);
  checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys);

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  if (contextMap[ccClassKey] !== undefined) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  } else {
    contextMap[ccClassKey] = util.makeCcClassContext(module, sharedStateKeys, globalStateKeys);
  }

  let ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module];
  if (!ccClassKeys_) ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module] = [];
  ccClassKeys_.push(ccClassKey);

  return function (ReactClass) {
    const CcClass = class extends ReactClass {

      constructor(props, context) {
        super(props, context);
        const { ccKey, ccOption = {} } = props;
        util.bindThis(this, [
          '__$$bindDataToCcClassContext', '__$$mapCcToInstance', '$$getChangeStateHandler', '$$changeState',
        ]);
        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];
        if (ccOption.syncState === undefined) ccOption.syncState = true;
        if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
        if (ccOption.asyncLifeCycleHook === undefined) ccOption.asyncLifeCycleHook = _asyncLifeCycleHook;
        const { asyncLifeCycleHook, storedStateKeys } = ccOption;

        const { ccUniqueKey, isCcUniqueKeyAutoGenerated } = computeCcUniqueKey(isSingle, ccClassKey, ccKey)
        const ccClassContext = this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);
        this.__$$mapCcToInstance(
          isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, module, _reducerModule, sharedStateKeys, globalStateKeys
        );
      }

      // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;
      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      }

      componentDidMount() {
        if (super.componentDidMount) super.componentDidMount();

        const { module, globalStateKeys, sharedStateKeys, storedStateKeys, ccOption, ccUniqueKey } = this.cc.ccState;
        const selfState = ccContext.refStore._state[ccUniqueKey];
        const { partialState: newSelfState, isStateEmpty: isSelfStateEmpty } = extractStateByKeys(selfState, storedStateKeys);

        const sharedState = ccContext.store._state[module];
        const globalState = ccContext.store._state[MODULE_GLOBAL];
        const { syncState, syncGlobalState } = ccOption;

        const { partialState: newSharedState, isStateEmpty: isSharedStateEmpty } = extractStateByKeys(sharedState, sharedStateKeys);
        const { partialState: newGlobalState, isStateEmpty: isGlobalStateEmpty } = extractStateByKeys(globalState, globalStateKeys);

        let changeWay = -1, toSet = null;
        function mergeSharedStateToSelfState() {
          if (!isSharedStateEmpty && isSelfStateEmpty) {
            changeWay = SYNC_FROM_CC_CLASS_STORE;
            toSet = newSharedState;
          } else if (isSharedStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_CC_REF_STORE;
            toSet = newSelfState;
          } else if (!isSharedStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_CC_CLASS_STORE_AND_REF_STORE;
            toSet = { ...newSharedState, ...newSelfState };
          }
        }

        function mergeGlobalStateAndSharedStateToSelfState() {
          if (!isGlobalStateEmpty && !isSharedStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_GLOBAL_STORE_AND_CC_CLASS_STORE_AND_REF_STORE;
            toSet = { ...newGlobalState, ...newSharedState, ...newSelfState };
          } else if (!isGlobalStateEmpty && !isSharedStateEmpty && isSelfStateEmpty) {
            changeWay = SYNC_FROM_GLOBAL_STORE_AND_CC_CLASS_STORE;
            toSet = { ...newGlobalState, ...newSharedState };
          } else if (!isGlobalStateEmpty && isSharedStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_GLOBAL_STORE_AND_REF_STORE;
            toSet = { ...newGlobalState, ...newSelfState };
          } else if (!isGlobalStateEmpty && isSharedStateEmpty && isSelfStateEmpty) {
            changeWay = SYNC_FROM_GLOBAL_STORE;
            toSet = newGlobalState;
          } else if (isGlobalStateEmpty && !isSharedStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_CC_CLASS_STORE_AND_REF_STORE;
            toSet = { ...newSharedState, ...newSelfState };
          } else if (isGlobalStateEmpty && isSharedStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_CC_REF_STORE;
            toSet = newSelfState;
          }
        }

        function mergeGlobalStateToSelfState() {
          if (!isGlobalStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_GLOBAL_STORE_AND_REF_STORE;
            toSet = { ...newGlobalState, ...newSelfState };
          } else if (isGlobalStateEmpty && !isSelfStateEmpty) {
            changeWay = SYNC_FROM_CC_REF_STORE;
            toSet = newSelfState;
          } else if (!isGlobalStateEmpty && isSelfStateEmpty) {
            changeWay = SYNC_FROM_GLOBAL_STORE;
            toSet = newGlobalState;
          }
        }

        if (syncState && syncGlobalState) {
          mergeGlobalStateAndSharedStateToSelfState();
        } else if (syncGlobalState) {
          mergeGlobalStateToSelfState();
        } else if (syncState) {
          mergeSharedStateToSelfState();
        } else {
          changeWay = SYNC_FROM_CC_REF_STORE;
          toSet = newSelfState;
        }

        if (toSet) this.cc.prepareBroadcastState(changeWay, toSet);
      }

      __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
        const classContext = contextMap[ccClassKey];
        const ccKeys = classContext.ccKeys;
        if (ccContext.isDebug) {
          console.log(ss(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
        }

        if (!util.verifyCcOption(ccOption)) {
          throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi(`a standard default ccOption may like: {"syncState": true, "asyncLifeCycleHook":false, "storedStateKeys": []}`));
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
        isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
        ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys, globalStateKeys
      ) {
        const reactSetStateRef = this.setState.bind(this);
        const reactForceUpdateRef = this.forceUpdate.bind(this);
        const ccState = {
          renderCount: 1, isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
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
          prepareReactSetState: (changeWay, state, next, reactCallback) => {
            if (storedStateKeys.length > 0) {
              const { partialState, isStateEmpty } = extractStateByKeys(state, storedStateKeys);
              if (!isStateEmpty) {
                ccContext.refStore._state[ccUniqueKey] = partialState;
              }
            }
            if (this.$$beforeSetState) {
              if (asyncLifeCycleHook) {
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
          prepareBroadcastState: (triggerType, moduleName, sourceSharedState, needClone) => {
            if (this.$$beforeBroadcastState) {
              if (asyncLifeCycleHook) {
                this.$$beforeBroadcastState({ triggerType }, () => {
                  this.cc.broadcastState(moduleName, sourceSharedState, needClone);
                })
              } else {
                this.$$beforeBroadcastState({ triggerType })
                this.cc.broadcastState(moduleName, sourceSharedState, needClone);
              }
            } else {
              this.cc.broadcastState(moduleName, sourceSharedState, needClone);
            }
          },
          reactSetState: (state, cb) => {
            ccState.renderCount += 1;
            reactSetStateRef(state, cb)
          },
          reactForceUpdate: (state, cb) => {
            ccState.renderCount += 1;
            reactForceUpdateRef(state, cb)
          },
          setState: (state, cb) => {
            this.$$changeState(state, { module: currentModule, cb });
          },
          setGlobalState: (state, cb) => {
            this.$$changeState(state, { module: MODULE_GLOBAL, cb });
          },
          forceUpdate: (cb) => {
            this.$$changeState(this.state, { module: currentModule, cb });
          },
          invoke: (userLogicFn, ...args) => {
            this.cc.invokeWith(userLogicFn, { module: currentModule }, ...args);
          },
          invokeWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isInputModuleInvalid(module, currentModule, cb, (newCb) => {
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
              userLogicFn.call(this, this.$$getChangeStateHandler({ module, forceSync, cb: newCb }), ...args);
            });
          },
          callThunk: (userLogicFn, ...args) => {
            this.cc.callThunkWith(userLogicFn, { module: currentModule }, ...args);
          },
          callThunkWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            isInputModuleInvalid(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, ...args)(this.$$getChangeStateHandler({ module, forceSync, cb: newCb }));
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

            const targetReducerMap = _reducers[targetReducerModule];
            if (!targetReducerMap) return justWarning(`no reducerMap found for module:${targetReducerModule}`);
            const reducerFn = targetReducerMap[type];
            if (!reducerFn) return justWarning(`no reducer defined in ccContext for module:${targetReducerModule} type:${type}`);
            const errMsg = util.verifyCcAction({ type, payload });
            if (errMsg) return justWarning(errMsg);

            const executionContext = { ccUniqueKey, ccOption, module, reducerModule, type, payload, state: this.state };

            isInputModuleInvalid(inputModule, currentModule, reactCallback, (newCb) => {
              this.cc.invokeWith(reducerFn, { inputModule, forceSync, cb: newCb } = {}, executionContext);
            });
          },
          broadcastState: (moduleName, sourceSharedState, needClone) => {
            let _sourceSharedState = sourceSharedState;
            if (needClone) _sourceSharedState = util.clone(sourceSharedState);// this clone may cause performance issue, if sourceSharedState is too big!!

            ccContext.store.setState(module, _sourceSharedState);

            const { ccUniqueKey: currentCcKey } = this.cc.ccState;
            const ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName];
            if (!ccClassKeys) return;
            const ccKey_ref_ = ccContext.ccKey_ref_;
            const ccKey_option_ = ccContext.ccKey_option_;

            //these ccClass subscribe the same module's state
            ccClassKeys.forEach(classKey => {
              const classContext = ccContext.ccClassKey_ccClassContext_[classKey];
              const { ccKeys, sharedStateKeys } = classContext;
              if (sharedStateKeys.length === 0) return;
              // extractStateByKeys again! because different class with a same module may have different sharedStateKeys!!!
              const {
                partialState: sharedStateForCurrentCcClass, isStateEmpty
              } = extractStateByKeys(_sourceSharedState, sharedStateKeys);
              if (isStateEmpty) return;

              ccKeys.forEach(ccKey => {
                //exclude currentCcKey, whether its reactSetState has been invoked or not, currentCcKey can't trigger prepareReactSetState here
                if (ccKey !== currentCcKey) {
                  const ref = ccKey_ref_[ccKey];
                  if (ref) {
                    const option = ccKey_option_[ccKey];
                    if (option.syncState) {
                      ref.cc.prepareReactSetState(SYNC_FROM_CC_INSTANCE_STATE, sharedStateForCurrentCcClass);
                    }
                  }
                }
              });
            });
          }
        }
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
        this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
        this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
        this.$$dispatch = this.cc.dispatch;//let CCComponent instance can call dispatch directly
        this.$$invoke = this.cc.invoke;//commit state to cc directly, but userFn can be promise or generator both!
        this.$$invokeWith = this.cc.invokeWith;
        this.$$call = this.cc.call;// commit state by setState handler
        this.$$callWith = this.cc.callWith;
        this.$$callThunk = this.cc.callThunk;// commit state by setState handler
        this.$$callThunkWith = this.cc.callThunkWith;
        this.$$commit = this.cc.commit;// commit state to cc directly, userFn can only be normal function
        this.$$commitWith = this.cc.commitWith;

        this.setState = this.cc.setState;//let setState call cc.setState
        this.setGlobalState = this.cc.setGlobalState;//let setState call cc.setState
        this.forceUpdate = this.cc.forceUpdate;//let forceUpdate call cc.forceUpdate
      }

      // note!!! changeState do two thing, decide if change self's state or not, if broadcast state or not;
      // when ccIns's module != target module,
      //        cc will only broadcast the state to target module, caution: it will overwrite the target module's state!!
      // when ccIns's module == target module,
      //        if ccIns option.syncState is false, cc only change it's own state, 
      //           but if you pass forceSync=true, cc also will broadcast the state to target module and caution: it will overwrite the target module's state !!!
      //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module
      $$changeState(state, { module, forceSync, cb: reactCallback } = {}) {//executionContext
        const currentModule = this.cc.ccState.module;
        if (module === currentModule) {
          // who trigger $$changeState, who will go to change the whole received state 
          this.cc.prepareReactSetState(CHANGE_BY_SELF, state, () => {
            if (this.cc.ccState.ccOption.syncState) {// note!!! if syncState == false, other ccIns will have not change to receive new state
              this.cc.prepareBroadcastState(BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
            } else if (forceSync) {
              this.cc.prepareBroadcastState(BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
            } else {
              // other ccIns will have no chance to receive new state
            }
          }, reactCallback);
        } else {
          if (forceSync) justWarning(`you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!` + vbi(`module:${module} currentModule${currentModule}`));
          this.cc.prepareBroadcastState(BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
        }
      }

      //{ module, forceSync, cb }
      $$getChangeStateHandler(executionContext) {
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
