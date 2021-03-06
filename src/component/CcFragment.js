import * as helper from '../core/helper';
import React, { Component, Fragment } from 'react';
import {
  MODULE_DEFAULT, ERR, CC_FRAGMENT_PREFIX,
  MODULE_GLOBAL, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE
} from '../support/constant';
import emit from '../core/emit';
import ccContext from '../cc-context';
import util from '../support/util';

const { ccClassKey_ccClassContext_, fragmentFeature_classKey_ } = ccContext;

function getFeatureStr(stateToPropMapping) {
  const prefixedPropKeys = Object.keys(stateToPropMapping);
  const module_mapAllStateToProp_ = {};
  const index_targetModule_ = {};
  prefixedPropKeys.sort();

  prefixedPropKeys.forEach((prefixedKey, index) => {
    if (!util.isPrefixedKeyValid(prefixedKey)) {
      throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, `error occurred in cc fragment`);
    }
    const [targetModule, targetKey] = prefixedKey.split('/');
    index_targetModule_[index] = { targetModule, targetKey };
    if (targetKey === '*') {
      module_mapAllStateToProp_[targetModule] = true;
    }
  });

  const strArr = [];
  prefixedPropKeys.forEach((prefixedKey, index) => {
    const targetModule = index_targetModule_[index];
    if (module_mapAllStateToProp_[targetModule] === true) {
      const str = `${targetModule}/*`;
      if (!strArr.includes(str)) {
        strArr.push(str);
      } else {
        util.justWarning(`prefixedKey:${prefixedKey} will be ignored in stateToPropMapping because of existing prefixedKey:${str}`);
      }
    } else {
      strArr.push(prefixedKey);
    }
  });

  return strArr.join(',');
}

function getFragmentClassKey(stateToPropMapping) {
  const featureStr = getFeatureStr(stateToPropMapping);
  let targetClassKey = fragmentFeature_classKey_[featureStr];
  if (targetClassKey) {
    return targetClassKey;
  } else {
    const oldFragmentNameCount = ccContext.fragmentNameCount;
    const fragmentNameCount = oldFragmentNameCount + 1;
    ccContext.fragmentNameCount = fragmentNameCount;
    targetClassKey = `${CC_FRAGMENT_PREFIX}_${fragmentNameCount}`;
    fragmentFeature_classKey_[featureStr] = targetClassKey;
    return targetClassKey;
  }
}

export default class CcFragment extends Component {
  constructor(props, context) {
    super(props, context);

    let { stateToPropMapping, pm, isPropStateModuleMode, mm, ccKey, connect } = props;
    let _stateToPropMapping = stateToPropMapping || pm;
    let _isPropStateModuleMode = isPropStateModuleMode || mm;

    if (_stateToPropMapping === undefined) _stateToPropMapping = {};
    if (_isPropStateModuleMode === undefined) _isPropStateModuleMode = false;

    //allow use connect replace stateToPropMapping, and when use connect, isPropStateModuleMode is always true
    if (connect) {
      _stateToPropMapping = connect;
      _isPropStateModuleMode = true;
    }

    const ccClassKey = getFragmentClassKey(_stateToPropMapping);

    let ccUniqueKey = '', isCcUniqueKeyAutoGenerated = false;
    if (ccKey) {// for CcFragment, if user supply ccKey to props, ccUniqueKey will equal ccKey
      ccUniqueKey = ccKey;
    } else {
      const { ccKey: ck, ccUniqueKey: cuk, isCcUniqueKeyAutoGenerated: ag } = helper.computeCcUniqueKey(false, ccClassKey, ccKey, true);
      ccUniqueKey = cuk;
      isCcUniqueKeyAutoGenerated = ag;
      ccKey = ck;
    }

    helper.buildCcClassContext(ccClassKey, MODULE_DEFAULT, [], [], [], [], _stateToPropMapping, _isPropStateModuleMode, true);
    helper.setRef(this, false, ccClassKey, ccKey, ccUniqueKey, {}, true);

    // for CcFragment, just put ccClassKey to module's cc class keys
    const { moduleName_ccClassKeys_ } = ccContext;
    const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, MODULE_DEFAULT);
    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);

    this.$$propState = ccClassKey_ccClassContext_[ccClassKey].propState || {};

    // only bind reactForceUpdateRef for CcFragment
    const reactForceUpdateRef = this.forceUpdate.bind(this);
    const ccState = {
      module: MODULE_DEFAULT, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, stateToPropMapping: _stateToPropMapping, renderCount: 0
    };
    this.cc = {
      ccState,
      reactForceUpdate: (state, cb) => {
        ccState.renderCount += 1;
        reactForceUpdateRef(state, cb);
      },
    };

    // hook implement fo CcFragment
    const __hookMeta = {
      isCcFragmentMounted:false,
      useStateCount: 0,
      useStateCursor: 0,
      stateArr:[],
      useEffectCount: 0,
      useEffectCursor: 0,
      effectCbArr:[],
      effectSeeAoa:[],// shouldEffectExecute array of array
      effectSeeResult:[],// collect every effect fn's shouldExecute result
      effectCbReturnArr:[], 
    }
    this.__hookMeta = __hookMeta;
    const hook = {
      useState: initialState => {
        let cursor = __hookMeta.useStateCursor;
        const stateArr = __hookMeta.stateArr;
        __hookMeta.useStateCursor++;
        if (__hookMeta.isCcFragmentMounted === false) {//render CcFragment before componentDidMount
          __hookMeta.useStateCount++;
          stateArr[cursor] = initialState;
        } else {
          cursor = cursor % __hookMeta.useStateCount;
        }

        const setter = newState => {
          stateArr[cursor] = newState;
          this.cc.reactForceUpdate();
        }
        return [stateArr[cursor], setter];
      },
      useEffect: (cb, shouldEffectExecute) => {
        let cursor = __hookMeta.useEffectCursor;
        __hookMeta.useEffectCursor++;
        if (__hookMeta.isCcFragmentMounted === false) {
          __hookMeta.effectCbArr.push(cb);
          __hookMeta.effectSeeAoa.push(shouldEffectExecute);
          __hookMeta.useEffectCount++;
        } else {
          // if code running jump into this block, CcFragment already mounted, and now compute result for didUpdate
          cursor = cursor % __hookMeta.useEffectCount;
          if (Array.isArray(shouldEffectExecute)) {
            const len = shouldEffectExecute.length;
            if (len == 0) {
              __hookMeta.effectSeeResult = false;// effect fn will been executed only in didMount
            } else {// compare prevSee and curSee
              let effectSeeResult = false;
              const prevSeeArr = __hookMeta.effectSeeAoa[cursor];
              if (!prevSeeArr) {
                effectSeeResult = true;
              } else {
                for (let i = 0; i < len; i++) {
                  if (shouldEffectExecute[i] !== prevSeeArr[i]) {
                    effectSeeResult = true;
                    break;
                  }
                }
              }
              __hookMeta.effectSeeAoa[cursor] = shouldEffectExecute;
              __hookMeta.effectSeeResult[cursor] = effectSeeResult;
              if (effectSeeResult) __hookMeta.effectCbArr[cursor] = cb;
            }
          } else {
            __hookMeta.effectSeeResult[cursor] = true;// effect fn will always been executed in didMount and didUpdate
            __hookMeta.effectSeeAoa[cursor] = shouldEffectExecute;
            __hookMeta.effectCbArr[cursor] = cb;
          }
        }
      }
    }

    const dispatcher = helper.getDispatcherRef();
    this.__fragmentParams = {
      hook,
      propState: this.$$propState,
      emit,
      dispatch: dispatcher.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, MODULE_DEFAULT, null, null, null, -1, ccKey),
      effect: dispatcher.__$$getEffectHandler(ccKey),
      xeffect: dispatcher.__$$getXEffectHandler(ccKey),
      lazyEffect: dispatcher.__$$getLazyEffectHandler(ccKey),
      lazyXeffect: dispatcher.__$$getLazyXEffectHandler(ccKey),
      setState: (module, state, lazyMs) => {
        dispatcher.$$changeState(state, {
          ccKey, module, stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
          broadcastTriggeredBy: null, lazyMs
        });
      },
      setGlobalState: (state, lazyMs) => {
        dispatcher.$$changeState(state, {
          ccKey, MODULE_GLOBAL, stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, broadcastTriggeredBy: null, lazyMs
        });
      },
    };

  }
  componentDidMount() {
    const { effectCbArr, effectCbReturnArr } = this.__hookMeta;
    this.__hookMeta.isCcFragmentMounted = true;
    effectCbArr.forEach(cb => {
      const cbReturn = cb();
      if (typeof cbReturn === 'function') {
        effectCbReturnArr.push(cbReturn);
      }else{
        effectCbReturnArr.push(null);
      }
    });
  }
  componentDidUpdate() {
    const { effectCbArr, effectCbReturnArr, effectSeeResult } = this.__hookMeta;
    effectCbArr.forEach((cb, idx) => {
      const shouldEffectExecute = effectSeeResult[idx];
      if(shouldEffectExecute){
        const cbReturn = cb();
        if (typeof cbReturn === 'function') {
          effectCbReturnArr[idx] = cbReturn;
        }
      }
    });
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.__hookMeta.effectCbReturnArr.forEach(cb=>{
      if(cb)cb();
    });

    const { ccUniqueKey, ccClassKey } = this.cc.ccState;
    helper.unsetRef(ccClassKey, ccUniqueKey);
    if (super.componentWillUnmount) super.componentWillUnmount();
  }
  render() {
    const { children, render } = this.props
    const target = render || children;
    if (typeof target === 'function') {
      return target(this.__fragmentParams) || <Fragment />;
    } else {
      return target;
    }
  }

}