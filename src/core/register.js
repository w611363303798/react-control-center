
import { MODULE_GLOBAL, ERR } from '../support/constant';
import ccContext from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';

const vbi = util.verboseInfo;
const me = util.makeError;
const ccClassDisplayName = util.ccClassDisplayName;
const { store: { _state }, reducer: { _reducers } } = ccContext;
const cl = (color = 'green') => `color:${color};border:1px solid ${color}`;
const ifo = (str) => `%c${str}`;

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

function checkStoreModule(module, throwError = true, cb) {
  if (!ccContext.isModuleMode) {
    if (module !== MODULE_GLOBAL) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `module:${module}`), throwError);
    } else if (cb) cb();
  } else {
    if (!_state[module]) {
      handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, `module:${module}`), throwError);
    } else if (cb) cb();
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
        let isCcUniqueKeyFromUuid = false;
        if (ccKey) {
          ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        } else {
          ccUniqueKey = uuid();
          isCcUniqueKeyFromUuid = true;
          ccKey = ccUniqueKey;
        }

        const ccClassContext = this.bindDataToCcClassContext(ccClassKey, ccUniqueKey, ccOption);
        this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyFromUuid, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys);
      }

      // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;
      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
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

      bindDataToCcClassContext(ccClassKey, ccUniqueKey, ccOption) {
        const classContext = contextMap[ccClassKey];

        if (classContext.ccKeys.includes(ccUniqueKey)) {
          throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
        }
        ccContext.ccKey_ref_[ccUniqueKey] = this;
        if (ccContext.isDebug) {
          console.log(ifo(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
        }
        classContext.ccKeys.push(ccUniqueKey);

        if (!ccOption) ccContext.ccKey_option_[ccUniqueKey] = { syncState: true };
        else {
          if (!util.verifyCcOption(ccOption)) {
            throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }
          ccContext.ccKey_option_[ccUniqueKey] = ccOption;
        }
        return classContext;
      }

      mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyFromUuid, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys) {
        const reactSetState = this.setState;
        const executionContext = { ccUniqueKey, ccOption, module, reducerModule: targetModule, type, state: this.state };
        this.cc = {
          ccState: { ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyFromUuid, ccOption, ccClassContext, module: currentModule, reducerModule, sharedStateKeys },
          ccUniqueKey,
          ccKey,
          reactSetState,
          setState: this.changeState,
          callWith: (userLogicFn, { module = currentModule, cb } = {}, ...args) => {
            let targetCb = cb;
            checkStoreModule(module, false, () => {
              if (module != currentModule) {
                if (cb) {
                  handleError(
                    me(
                      ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID,
                      vbi(`if you pass param reactCallback, param module must equal current CCInstance's module, module: ${module}, CCInstance's module:${currentModule} `)),
                    false
                  );
                  targetCb = null;//let user's reactCallback has no change to be triggered
                }
              }
              userLogicFn.call(this, this.changeStateClosureExecutionContext({ module, targetCb }), ...args);
            });
          },
          call: (userLogicFn, ...args) => {
            this.cc.callWith(userLogicFn, { module: currentModule }, ...args);
          },
          dispatch: ({ reducerModule, type, payload, cb } = {}) => {
            const { reducerModule: currentReducerModule } = this.cc.ccState;
            const targetModule = reducerModule || currentReducerModule;//if reducerModule not defined, will find currentReducerModule's reducer

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
          dispatchPayload: (type, payload, module = MODULE_GLOBAL, cb) => {
            this.cc.dispatch({ module, type, payload, cb });
          }
        }
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.dispatch = this.cc.dispatch;//let CCComponent instance can call dispatch directly
        this.setState = this.cc.setState;//let setState call cc.setState
        this.call = this.cc.call;
        this.callWith = this.cc.callWith;
      }

      changeStateClosureExecutionContext({ module, cb }) {
        return (state) => {
          if (module === this.cc.ccState.module) this.cc.reactSetState(state, cb);
          this.broadcastState(module, state);
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
        if (ccContext.isDebug) {
          console.log(inf(`${ccUniqueKey} unset ref`), cl('red'));
        }
        // ccContext.ccKey_ref_[ccUniqueKey] = null;
        delete ccContext.ccKey_ref_[ccUniqueKey];
        delete ccContext.ccKey_option_[ccUniqueKey];
        const ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
        if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
      }

      render() {
        if (ccContext.isDebug) {
          console.log(inf(`@@@ ${ccClassDisplayName(ccClassKey)} render`), cl());
        }
        return super.render();
      }
    }

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  }
}
