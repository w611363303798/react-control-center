
import { MODULE_GLOBAL, ERR } from '../support/constant';
import ccContext from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';

const vbi = util.verboseInfo;

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
export default function register(ccClassKey, { module = MODULE_GLOBAL, sharedStateKeys = [] } = {}) {
  if (!ccContext.isModuleMode && module !== MODULE_GLOBAL) {
    throw util.makeError(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `module:${module}`);
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
        const { ccKey, ccOption = { syncState: true } } = props;
        util.bindThis(this, [
          'bindDataToCcClassContext', 'mapCcToInstance', 'broadcastState', 'changeState',
          'syncStateToOtherCcComponent', 'changeStateClosureReactCb',
        ]);

        let ccUniqueKey;
        if (ccKey) {
          ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        } else {
          ccUniqueKey = uuid();
        }

        const ccClassContext = this.bindDataToCcClassContext(ccClassKey, ccUniqueKey, ccOption);
        const reactSetState = this.setState;
        this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, ccOption, ccClassContext, module, sharedStateKeys, reactSetState);
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
        classContext.ccKey_componentRef_[ccUniqueKey] = this;
        classContext.ccKeys.push(ccUniqueKey);

        if (!ccOption) classContext.ccKey_option_[ccUniqueKey] = { syncState: true };
        else {
          if (!util.verifyCcOption(ccOption)) {
            throw util.makeError(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }
          classContext.ccKey_option_[ccUniqueKey] = ccOption;
        }
        return classContext;
      }

      mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, ccOption, ccClassContext, module, sharedStateKeys, reactSetState) {
        this.cc = {
          ccState: { ccClassKey, ccKey, ccUniqueKey, ccOption, ccClassContext, module, sharedStateKeys },
          ccUniqueKey,
          ccKey,
          reactSetState,
          setState: this.changeState,
          dispatch: ({ module, type, payload, cb } = {}) => {
            const { ccUniqueKey, ccOption, module: currentModule } = this.cc.ccState;
            const toModule = module || currentModule;//if module not defined, will find currentModule's reducer

            const reducerFn = ccContext.reducer._reducers[toModule][type];
            if (!reducerFn) return console.error(`no reducer defined in ccContext for module:${toModule}/type:${type}`);
            const errMsg = util.verifyCcAction({ type, payload });
            if (errMsg) return console.error(errMsg);

            const dispatchContext = { ccUniqueKey, ccOption, toModule, type, state: this.state };
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
        // who dispatch the action, who will receive the whole state
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

      syncStateToOtherCcComponent(moduleName, state) {
        const { ccUniqueKey: currentCcKey } = this.cc.ccState;
        const ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName];

        //these ccClass subscribe the same module's state
        ccClassKeys.forEach(classKey => {
          const classContext = ccContext.ccClassKey_ccClassContext_[classKey];
          const { ccKeys, ccKey_componentRef_, ccKey_option_ } = classContext;
          ccKeys.forEach(ccKey => {
            if (ccKey !== currentCcKey) {//exclude currentCcKey, it's setState been invoked 
              const ref = ccKey_componentRef_[ccKey];
              if (ref) {
                const option = ccKey_option_[ccKey];
                if (option.syncState) ref.cc.reactSetState(state);
              }
            } else {

            }
          });
        });
      }

      componentWillUnmount() {
        //如果父组件实现了componentWillUnmount，要调用一遍
        if (super.componentWillUnmount) super.componentWillUnmount();

        const { ccUniqueKey, ccClassContext: { ccKey_componentRef_, ccKeys, ccKey_option_ } } = this.cc.ccState;
        console.log(`%c ${ccUniqueKey} unset ref`, 'color:blue;border:1px solid blue');
        ccKey_componentRef_[ccUniqueKey] = null;
        const ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
        if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
        delete ccKey_option_[ccUniqueKey];
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
