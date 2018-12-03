
import { MODULE_GLOBAL, ERR } from '../support/constant';
import ccContext from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';

const vbi = util.verboseInfo;
const { store: { _state }, reducer: { _reducers } } = ccContext;
const cl = () => 'color:green;border:1px solid green';
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


/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/
export default function register(ccClassKey, { module = MODULE_GLOBAL, reducerModule, sharedStateKeys = [] } = {}) {
  const _reducerModule = reducerModule || module;//if reducerModule not defined, will be equal module;
  if (!ccContext.isModuleMode) {
    if (module !== MODULE_GLOBAL) {
      throw util.makeError(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `module:${module}`);
    }
    if (_reducerModule != MODULE_GLOBAL) {
      throw util.makeError(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `reducerModule:${_reducerModule}`);
    }
  } else {
    if (!_state[module]) {
      throw util.makeError(ERR.CC_CLASS_STORE_MODULE_INVALID, `module:${module}`);
    }
    if (!_reducers[_reducerModule]) {
      throw util.makeError(ERR.CC_CLASS_REDUCER_MODULE_INVALID, `reducerModule:${_reducerModule}`);
    }
  }

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  if (contextMap[ccClassKey] !== undefined) {
    throw util.makeError(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
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
        const reactSetState = this.setState;
        this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyFromUuid, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys, reactSetState);
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
          throw util.makeError(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`ccClass:${ccClassKey},ccKey:${ccUniqueKey}`));
        }
        ccContext.ccKey_ref_[ccUniqueKey] = this;
        if (ccContext.isDebug) {
          console.log(ifo(`register ccKey ${ccUniqueKey} to CC_CONTEXT`), cl());
        }
        classContext.ccKeys.push(ccUniqueKey);

        if (!ccOption) ccContext.ccKey_option_[ccUniqueKey] = { syncState: true };
        else {
          if (!util.verifyCcOption(ccOption)) {
            throw util.makeError(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }
          ccContext.ccKey_option_[ccUniqueKey] = ccOption;
        }
        return classContext;
      }

      mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyFromUuid, ccOption, ccClassContext, module, reducerModule, sharedStateKeys, reactSetState) {
        this.cc = {
          ccState: { ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyFromUuid, ccOption, ccClassContext, module, reducerModule, sharedStateKeys },
          ccUniqueKey,
          ccKey,
          reactSetState,
          setState: this.changeState,
          dispatch: ({ reducerModule, type, payload, cb } = {}) => {
            const { ccUniqueKey, ccOption, module, reducerModule: currentReducerModule } = this.cc.ccState;
            const targetModule = reducerModule || currentReducerModule;//if reducerModule not defined, will find currentReducerModule's reducer

            const targetReducerMap = _reducers[targetModule];
            if (!targetReducerMap) return console.error(`no reducerMap found for module:${targetModule}`);
            const reducerFn = targetReducerMap[type];
            if (!reducerFn) return console.error(`no reducer defined in ccContext for module:${targetModule}/type:${type}`);
            const errMsg = util.verifyCcAction({ type, payload });
            if (errMsg) return console.error(errMsg);

            const dispatchContext = { ccUniqueKey, ccOption, module, reducerModule: targetModule, type, state: this.state };
            // const mail = util.makeStateMail(ccUniqueKey, ccOption, toModule, type, cb);
            if (cb) {
              reducerFn(this.changeStateClosureReactCb(cb), payload, dispatchContext);
            } else {
              reducerFn(this.changeState, payload, dispatchContext);
            }

          },
          dispatchPayload: (type, payload, module = MODULE_GLOBAL, cb) => {
            super.cc.dispatch({ module, type, payload, cb });
          }
        }
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.dispatch = this.cc.dispatch;//let CCComponent instance can call dispatch directly
        this.setState = this.cc.setState;//let setState call cc.setState
      }

      changeStateClosureReactCb(cb) {
        return (state) => {
          this.changeState(state, cb);
        }
      }

      changeState(state, cb) {
        const { module, ccOption } = this.cc.ccState;
        // who dispatch the action, who will go to change the whole received state 
        this.cc.reactSetState(state, cb);
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
          const {
            sharedState: sharedStateForCurrentCcClass, isStateEmpty
          } = extractSharedState(sourceSharedState, sharedStateKeys);
          if (isStateEmpty) return;

          ccKeys.forEach(ccKey => {
            if (ccKey !== currentCcKey) {//exclude currentCcKey, it's setState been invoked 
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
        console.log(`%c ${ccUniqueKey} unset ref`, 'color:blue;border:1px solid blue');
        // ccContext.ccKey_ref_[ccUniqueKey] = null;
        delete ccContext.ccKey_ref_[ccUniqueKey];
        delete ccContext.ccKey_option_[ccUniqueKey];
        const ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
        if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
      }

      render() {
        console.log(`%c@@@ CC  ${ccClassKey} render`, 'color:darkred;border:1px solid darkred;');
        return super.render();
      }
    }

    CcClass.displayName = `CC(${ccClassKey})`;
    return CcClass;
  }
}
