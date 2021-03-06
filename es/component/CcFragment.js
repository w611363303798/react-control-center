import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import * as helper from '../core/helper';
import React, { Component, Fragment } from 'react';
import { MODULE_DEFAULT, ERR, CC_FRAGMENT_PREFIX, MODULE_GLOBAL, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE } from '../support/constant';
import emit from '../core/emit';
import ccContext from '../cc-context';
import util from '../support/util';
var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
    fragmentFeature_classKey_ = ccContext.fragmentFeature_classKey_;

function getFeatureStr(stateToPropMapping) {
  var prefixedPropKeys = Object.keys(stateToPropMapping);
  var module_mapAllStateToProp_ = {};
  var index_targetModule_ = {};
  prefixedPropKeys.sort();
  prefixedPropKeys.forEach(function (prefixedKey, index) {
    if (!util.isPrefixedKeyValid(prefixedKey)) {
      throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, "error occurred in cc fragment");
    }

    var _prefixedKey$split = prefixedKey.split('/'),
        targetModule = _prefixedKey$split[0],
        targetKey = _prefixedKey$split[1];

    index_targetModule_[index] = {
      targetModule: targetModule,
      targetKey: targetKey
    };

    if (targetKey === '*') {
      module_mapAllStateToProp_[targetModule] = true;
    }
  });
  var strArr = [];
  prefixedPropKeys.forEach(function (prefixedKey, index) {
    var targetModule = index_targetModule_[index];

    if (module_mapAllStateToProp_[targetModule] === true) {
      var str = targetModule + "/*";

      if (!strArr.includes(str)) {
        strArr.push(str);
      } else {
        util.justWarning("prefixedKey:" + prefixedKey + " will be ignored in stateToPropMapping because of existing prefixedKey:" + str);
      }
    } else {
      strArr.push(prefixedKey);
    }
  });
  return strArr.join(',');
}

function getFragmentClassKey(stateToPropMapping) {
  var featureStr = getFeatureStr(stateToPropMapping);
  var targetClassKey = fragmentFeature_classKey_[featureStr];

  if (targetClassKey) {
    return targetClassKey;
  } else {
    var oldFragmentNameCount = ccContext.fragmentNameCount;
    var fragmentNameCount = oldFragmentNameCount + 1;
    ccContext.fragmentNameCount = fragmentNameCount;
    targetClassKey = CC_FRAGMENT_PREFIX + "_" + fragmentNameCount;
    fragmentFeature_classKey_[featureStr] = targetClassKey;
    return targetClassKey;
  }
}

var CcFragment =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(CcFragment, _Component);

  function CcFragment(props, context) {
    var _this;

    _this = _Component.call(this, props, context) || this;
    var stateToPropMapping = props.stateToPropMapping,
        pm = props.pm,
        isPropStateModuleMode = props.isPropStateModuleMode,
        mm = props.mm,
        ccKey = props.ccKey,
        connect = props.connect;

    var _stateToPropMapping = stateToPropMapping || pm;

    var _isPropStateModuleMode = isPropStateModuleMode || mm;

    if (_stateToPropMapping === undefined) _stateToPropMapping = {};
    if (_isPropStateModuleMode === undefined) _isPropStateModuleMode = false; //allow use connect replace stateToPropMapping, and when use connect, isPropStateModuleMode is always true

    if (connect) {
      _stateToPropMapping = connect;
      _isPropStateModuleMode = true;
    }

    var ccClassKey = getFragmentClassKey(_stateToPropMapping);
    var ccUniqueKey = '',
        isCcUniqueKeyAutoGenerated = false;

    if (ccKey) {
      // for CcFragment, if user supply ccKey to props, ccUniqueKey will equal ccKey
      ccUniqueKey = ccKey;
    } else {
      var _helper$computeCcUniq = helper.computeCcUniqueKey(false, ccClassKey, ccKey, true),
          ck = _helper$computeCcUniq.ccKey,
          cuk = _helper$computeCcUniq.ccUniqueKey,
          ag = _helper$computeCcUniq.isCcUniqueKeyAutoGenerated;

      ccUniqueKey = cuk;
      isCcUniqueKeyAutoGenerated = ag;
      ccKey = ck;
    }

    helper.buildCcClassContext(ccClassKey, MODULE_DEFAULT, [], [], [], [], _stateToPropMapping, _isPropStateModuleMode, true);
    helper.setRef(_assertThisInitialized(_assertThisInitialized(_this)), false, ccClassKey, ccKey, ccUniqueKey, {}, true); // for CcFragment, just put ccClassKey to module's cc class keys

    var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_;
    var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, MODULE_DEFAULT);
    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
    _this.$$propState = ccClassKey_ccClassContext_[ccClassKey].propState || {}; // only bind reactForceUpdateRef for CcFragment

    var reactForceUpdateRef = _this.forceUpdate.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    var ccState = {
      module: MODULE_DEFAULT,
      ccClassKey: ccClassKey,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
      stateToPropMapping: _stateToPropMapping,
      renderCount: 0
    };
    _this.cc = {
      ccState: ccState,
      reactForceUpdate: function reactForceUpdate(state, cb) {
        ccState.renderCount += 1;
        reactForceUpdateRef(state, cb);
      }
    }; // hook implement fo CcFragment

    var __hookMeta = {
      isCcFragmentMounted: false,
      useStateCount: 0,
      useStateCursor: 0,
      stateArr: [],
      useEffectCount: 0,
      useEffectCursor: 0,
      effectCbArr: [],
      effectSeeAoa: [],
      // shouldEffectExecute array of array
      effectSeeResult: [],
      // collect every effect fn's shouldExecute result
      effectCbReturnArr: []
    };
    _this.__hookMeta = __hookMeta;
    var hook = {
      useState: function useState(initialState) {
        var cursor = __hookMeta.useStateCursor;
        var stateArr = __hookMeta.stateArr;
        __hookMeta.useStateCursor++;

        if (__hookMeta.isCcFragmentMounted === false) {
          //render CcFragment before componentDidMount
          __hookMeta.useStateCount++;
          stateArr[cursor] = initialState;
        } else {
          cursor = cursor % __hookMeta.useStateCount;
        }

        var setter = function setter(newState) {
          stateArr[cursor] = newState;

          _this.cc.reactForceUpdate();
        };

        return [stateArr[cursor], setter];
      },
      useEffect: function useEffect(cb, shouldEffectExecute) {
        var cursor = __hookMeta.useEffectCursor;
        __hookMeta.useEffectCursor++;

        if (__hookMeta.isCcFragmentMounted === false) {
          __hookMeta.effectCbArr.push(cb);

          __hookMeta.effectSeeAoa.push(shouldEffectExecute);

          __hookMeta.useEffectCount++;
        } else {
          // if code running jump into this block, CcFragment already mounted, and now compute result for didUpdate
          cursor = cursor % __hookMeta.useEffectCount;

          if (Array.isArray(shouldEffectExecute)) {
            var len = shouldEffectExecute.length;

            if (len == 0) {
              __hookMeta.effectSeeResult = false; // effect fn will been executed only in didMount
            } else {
              // compare prevSee and curSee
              var effectSeeResult = false;
              var prevSeeArr = __hookMeta.effectSeeAoa[cursor];

              if (!prevSeeArr) {
                effectSeeResult = true;
              } else {
                for (var i = 0; i < len; i++) {
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
            __hookMeta.effectSeeResult[cursor] = true; // effect fn will always been executed in didMount and didUpdate

            __hookMeta.effectSeeAoa[cursor] = shouldEffectExecute;
            __hookMeta.effectCbArr[cursor] = cb;
          }
        }
      }
    };
    var dispatcher = helper.getDispatcherRef();
    _this.__fragmentParams = {
      hook: hook,
      propState: _this.$$propState,
      emit: emit,
      dispatch: dispatcher.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, MODULE_DEFAULT, null, null, null, -1, ccKey),
      effect: dispatcher.__$$getEffectHandler(ccKey),
      xeffect: dispatcher.__$$getXEffectHandler(ccKey),
      lazyEffect: dispatcher.__$$getLazyEffectHandler(ccKey),
      lazyXeffect: dispatcher.__$$getLazyXEffectHandler(ccKey),
      setState: function setState(module, state, lazyMs) {
        dispatcher.$$changeState(state, {
          ccKey: ccKey,
          module: module,
          stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
          broadcastTriggeredBy: null,
          lazyMs: lazyMs
        });
      },
      setGlobalState: function setGlobalState(state, lazyMs) {
        dispatcher.$$changeState(state, {
          ccKey: ccKey,
          MODULE_GLOBAL: MODULE_GLOBAL,
          stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
          broadcastTriggeredBy: null,
          lazyMs: lazyMs
        });
      }
    };
    return _this;
  }

  var _proto = CcFragment.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$__hookMeta = this.__hookMeta,
        effectCbArr = _this$__hookMeta.effectCbArr,
        effectCbReturnArr = _this$__hookMeta.effectCbReturnArr;
    this.__hookMeta.isCcFragmentMounted = true;
    effectCbArr.forEach(function (cb) {
      var cbReturn = cb();

      if (typeof cbReturn === 'function') {
        effectCbReturnArr.push(cbReturn);
      } else {
        effectCbReturnArr.push(null);
      }
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    var _this$__hookMeta2 = this.__hookMeta,
        effectCbArr = _this$__hookMeta2.effectCbArr,
        effectCbReturnArr = _this$__hookMeta2.effectCbReturnArr,
        effectSeeResult = _this$__hookMeta2.effectSeeResult;
    effectCbArr.forEach(function (cb, idx) {
      var shouldEffectExecute = effectSeeResult[idx];

      if (shouldEffectExecute) {
        var cbReturn = cb();

        if (typeof cbReturn === 'function') {
          effectCbReturnArr[idx] = cbReturn;
        }
      }
    });
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate() {
    return false;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.__hookMeta.effectCbReturnArr.forEach(function (cb) {
      if (cb) cb();
    });

    var _this$cc$ccState = this.cc.ccState,
        ccUniqueKey = _this$cc$ccState.ccUniqueKey,
        ccClassKey = _this$cc$ccState.ccClassKey;
    helper.unsetRef(ccClassKey, ccUniqueKey);
    if (_Component.prototype.componentWillUnmount) _Component.prototype.componentWillUnmount.call(this);
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        render = _this$props.render;
    var target = render || children;

    if (typeof target === 'function') {
      return target(this.__fragmentParams) || React.createElement(Fragment, null);
    } else {
      return target;
    }
  };

  return CcFragment;
}(Component);

export { CcFragment as default };