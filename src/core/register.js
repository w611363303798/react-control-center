
import { MODULE_GLOBAL, ERR } from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';

const vbi = util.verboseInfo;
const me = util.makeError;
const ccClassDisplayName = util.ccClassDisplayName;
const { store: { _state }, reducer: { _reducers } } = ccContext;
const cl = (color = 'green') => `color:${color};border:1px solid ${color}`;
const info = (str) => `%c${str}`;

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

function extractSharedState(state, sharedStateKeys) {
  if (!isStateValid(state)) {
    return { sharedState: {}, isStateEmpty: true };
  }
  const newState = {};
  let isStateEmpty = true;
  sharedStateKeys.forEach(key => {
    const value = state[key];
    if (util.isValueNotNull(value)) {
      newState[key] = value;
      isStateEmpty = false;
    }
  });
  return { sharedState: newState, isStateEmpty };
}

function handleError(err, throwError = true) {
  if (throwError) throw err;
  else {
    console.error(' ------------ CC WARNING ------------');
    console.error(err.message);
  }
}

function checkStoreModule(module, throwError = true) {
  if (!ccContext.isModuleMode) {
    if (module !== MODULE_GLOBAL) {
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
    if (reducerModule != MODULE_GLOBAL) {
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
    console.log(info(`${ccUniqueKey} unset ref`), cl('red'));
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

function ifCallWillExecute(module, currentModule, reactCallback, cb) {
  let targetCb = reactCallback;
  if (checkStoreModule(module, false)) {
    if (module != currentModule) {
      if (reactCallback) {
        handleError(
          me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(module, currentModule))), false
        );
        targetCb = null;//let user's reactCallback has no change to be triggered
      }
    }
    cb(targetCb);
  }
}

/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/
export default function register(ccClassKey, { module = MODULE_GLOBAL, reducerModule, sharedStateKeys = [] } = {}) {
  const _reducerModule = reducerModule || module;//if reducerModule not defined, will be equal module;
  checkStoreModule(module);
  checkReducerModule(_reducerModule);

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  if (contextMap[ccClassKey] !== undefined) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
  } else {
    contextMap[ccClassKey] = util.makeCcClassContext(module, sharedStateKeys);
  }

  let ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module];
  if (!ccClassKeys_) ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module] = [];
  ccClassKeys_.push(ccClassKey);

  return function (ReactClass) {
    const CcClass = class extends ReactClass {

      constructor(props, context) {
        super(props, context);
        let { ccKey, ccOption = { syncState: true } } = props;
        util.bindThis(this, [
          'bindDataToCcClassContext', 'mapCcToInstance', 'broadcastState', 'changeState',
          'syncStateToOtherCcComponent', 'changeStateClosureReactCb',
        ]);

        let ccUniqueKey;
        let isCcUniqueKeyAutoGenerated = false;
        if (ccKey) {
          ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        } else {
          ccUniqueKey = `${ccClassKey}/${uuid()}`;
          isCcUniqueKeyAutoGenerated = true;
          ccKey = ccUniqueKey;
        }

        const ccClassContext = this.bindDataToCcClassContext(ccClassKey, ccKey, ccUniqueKey, ccOption);
        this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys);
      }

      // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;
      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      }

      componentDidCatch() {
        console.log('componentDidCatch')
      }

      componentDidMount() {
        if (super.componentDidMount) super.componentDidMount();
        const { module, sharedStateKeys, ccOption } = this.cc.ccState;
        const state = ccContext.store._state[module];
        const { sharedState, isStateEmpty } = extractSharedState(state, sharedStateKeys);
        if (!isStateEmpty && ccOption.syncState) {//sync store's state to instance
          this.cc.reactSetState(sharedState);
        }
      }

      bindDataToCcClassContext(ccClassKey, ccKey, ccUniqueKey, ccOption) {
        const classContext = contextMap[ccClassKey];
        const ccKeys = classContext.ccKeys;
        if (ccContext.isDebug) {
          console.log(info(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
        }

        let option;
        if (!ccOption) option = { syncState: true };
        else {
          if (!util.verifyCcOption(ccOption)) {
            throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }
          option = ccOption;
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (util.isHotReloadMode()) {
            if (getCcKeyInsCount(ccUniqueKey) > 2) {// now cc can make sure the ccKey duplicate
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
            }
            // just warning
            console.error(`found ccKey ${ccKey} may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually`);
            console.error(vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} ccUniqueKey:${ccUniqueKey}`));

            // in webpack hot reload mode, cc works not well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later
            setCcInstanceRef(ccUniqueKey, this, ccKeys, option, 600);
          } else {
            throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
          }
        } else {
          setCcInstanceRef(ccUniqueKey, this, ccKeys, option);
        }

        return classContext;
      }

      mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys) {
        const reactSetStateRef = this.setState.bind(this);
        const reactForceUpdateRef = this.forceUpdate.bind(this);
        const ccState = { renderCount: 0, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, module: currentModule, reducerModule, sharedStateKeys };
        this.cc = {
          ccState,
          ccUniqueKey,
          ccKey,
          reactSetState: (state, cb) => {
            ccState.renderCount += 1;
            reactSetStateRef(state, cb)
          },
          reactForceUpdate: (state, cb) => {
            ccState.renderCount += 1;
            reactForceUpdateRef(state, cb)
          },
          setState: this.changeState,
          forceUpdate: (cb) => {
            this.changeState(this.state, cb);
          },
          call: (userLogicFn, ...args) => {
            this.cc.callWith(userLogicFn, { module: currentModule }, ...args);
          },
          // note! see changeStateClosureExecutionContext implement
          // when ccIns's module != target module,
          //         cc will only broadcast the state to target module and overwrite the target module's state
          // when ccIns's module == target module,
          //        if ccIns option.syncState is false, cc only change it's own state, 
          //           but if you pass forceSync=true, cc also will broadcast the state to target module and >>> overwrite the target module's state !<<<
          //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module
          callWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            ifCallWillExecute(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, this.changeStateClosureExecutionContext({ module, forceSync, cb: newCb }), ...args);
            });
          },
          callThunk: (userLogicFn, ...args) => {
            this.cc.callThunkWith(userLogicFn, { module: currentModule }, ...args);
          },
          callThunkWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            ifCallWillExecute(module, currentModule, cb, (newCb) => {
              userLogicFn.call(this, ...args)(this.changeStateClosureExecutionContext({ module, forceSync, cb: newCb }));
            });
          },
          commit: (userLogicFn, ...args) => {
            this.cc.commitWith(userLogicFn, { module: currentModule }, ...args);
          },
          commitWith: (userLogicFn, { module = currentModule, forceSync = false, cb } = {}, ...args) => {
            ifCallWillExecute(module, currentModule, cb, (newCb) => {
              const state = userLogicFn.call(this, ...args);
              this.changeStateWithExecutionContext(state, { module, forceSync, cb: newCb });
            });
          },
          dispatch: ({ reducerModule, type, payload, cb } = {}) => {
            const { reducerModule: currentReducerModule } = this.cc.ccState;
            const targetModule = reducerModule || currentReducerModule;//if reducerModule not defined, will find currentReducerModule's reducer
            const executionContext = { ccUniqueKey, ccOption, module, reducerModule, type, state: this.state };

            const targetReducerMap = _reducers[targetModule];
            if (!targetReducerMap) return console.error(`no reducerMap found for module:${targetModule}`);
            const reducerFn = targetReducerMap[type];
            if (!reducerFn) return console.error(`no reducer defined in ccContext for module:${targetModule}/type:${type}`);
            const errMsg = util.verifyCcAction({ type, payload });
            if (errMsg) return console.error(errMsg);

            if (cb) {
              reducerFn(this.changeStateClosureReactCb(cb), payload, executionContext);
            } else {
              reducerFn(this.changeState, payload, executionContext);
            }

          },
          dispatchPayload: (type, payload, module = module, cb) => {
            this.cc.dispatch({ module, type, payload, cb });
          }
        }
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.$dispatch = this.cc.dispatch;//let CCComponent instance can call dispatch directly
        this.$dispatchPayload = this.cc.dispatchPayload;//let CCComponent instance can call dispatchPayload directly
        this.setState = this.cc.setState;//let setState call cc.setState
        this.forceUpdate = this.cc.forceUpdate;//let forceUpdate call cc.forceUpdate
        this.$call = this.cc.call;
        this.$callWith = this.cc.callWith;
        this.$callThunk = this.cc.callThunk;
        this.$callThunkWith = this.cc.callThunkWith;
        this.$commit = this.cc.commit;
        this.$commitWith = this.cc.commitWith;
      }

      changeStateWithExecutionContext(state, { module, forceSync, cb }) {
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
      }

      changeStateClosureExecutionContext({ module, forceSync, cb }) {
        return (state) => {
          this.changeStateWithExecutionContext(state, { module, forceSync, cb });
        }
      }

      changeStateClosureReactCb(cb) {
        return (state) => {
          this.changeState(state, cb);
        }
      }

      changeState(state, reactCallback) {
        const { module, ccOption } = this.cc.ccState;
        // who dispatch the action, who will go to change the whole received state 
        this.cc.reactSetState(state, reactCallback);
        if (ccOption.syncState) {
          this.broadcastState(module, state);
        }
      }

      broadcastState(module, state) {
        const { sharedStateKeys } = this.cc.ccState;
        const { sharedState, isStateEmpty } = extractSharedState(state, sharedStateKeys);
        if (!isStateEmpty) {
          ccContext.store.setState(module, sharedState);
          this.syncStateToOtherCcComponent(module, sharedState);
        }
      }

      syncStateToOtherCcComponent(moduleName, sourceSharedState) {
        const { ccUniqueKey: currentCcKey } = this.cc.ccState;
        const ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName];
        const ccKey_ref_ = ccContext.ccKey_ref_;
        const ccKey_option_ = ccContext.ccKey_option_;

        //these ccClass subscribe the same module's state
        ccClassKeys.forEach(classKey => {
          const classContext = ccContext.ccClassKey_ccClassContext_[classKey];
          const { ccKeys, sharedStateKeys } = classContext;
          if (sharedStateKeys.length === 0) return;
          // extractSharedState again! because different class with a same module may have different sharedStateKeys!!!
          const {
            sharedState: sharedStateForCurrentCcClass, isStateEmpty
          } = extractSharedState(sourceSharedState, sharedStateKeys);
          if (isStateEmpty) return;

          ccKeys.forEach(ccKey => {
            if (ccKey !== currentCcKey) {//exclude currentCcKey, it's reactSetState may have been invoked 
              const ref = ccKey_ref_[ccKey];
              if (ref) {
                const option = ccKey_option_[ccKey];
                if (option.syncState) ref.cc.reactSetState(sharedStateForCurrentCcClass);
              }
            }
          });
        });
      }

      componentWillUnmount() {
        //如果父组件实现了componentWillUnmount，要调用一遍
        if (super.componentWillUnmount) super.componentWillUnmount();

        const { ccUniqueKey, ccClassContext: { ccKeys } } = this.cc.ccState;
        unsetCcInstanceRef(ccKeys, ccUniqueKey);
      }

      render() {
        if (ccContext.isDebug) {
          console.log(info(`@@@ ${ccClassDisplayName(ccClassKey)} render`), cl());
        }
        return super.render();
      }
    }

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  }
}
