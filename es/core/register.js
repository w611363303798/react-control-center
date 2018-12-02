import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import { MODULE_GLOBAL, ERR } from '../support/constant';
import ccContext from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';
var vbi = util.verboseInfo;

function isStateValid(state) {
  if (!state || !util.isPlainJsonObject(state)) {
    return false;
  } else {
    return true;
  }
}

function extractSharedState(state, sharedStateKeys) {
  if (!isStateValid(state)) {
    return {
      sharedState: {},
      isStateEmpty: true
    };
  }

  var newState = {};
  var isStateEmpty = true;
  sharedStateKeys.forEach(function (key) {
    var value = state[key];

    if (util.isValueNotNull(value)) {
      newState[key] = value;
      isStateEmpty = false;
    }
  });
  return {
    sharedState: newState,
    isStateEmpty: isStateEmpty
  };
}
/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/


export default function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? MODULE_GLOBAL : _ref$module,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys;

  if (!ccContext.isModuleMode && module !== MODULE_GLOBAL) {
    throw util.makeError(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "module:" + module);
  }

  var contextMap = ccContext.ccClassKey_ccClassContext_;

  if (contextMap[ccClassKey] !== undefined) {
    throw util.makeError(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  } else {
    contextMap[ccClassKey] = util.makeCcClassContext(module, sharedStateKeys);
  }

  var ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module];
  if (!ccClassKeys_) ccClassKeys_ = ccContext.moduleName_ccClassKeys_[module] = [];
  ccClassKeys_.push(ccClassKey);
  return function (ReactClass) {
    var CcClass =
    /*#__PURE__*/
    function (_ReactClass) {
      _inheritsLoose(CcClass, _ReactClass);

      function CcClass(props, context) {
        var _this;

        _this = _ReactClass.call(this, props, context) || this;
        var ccKey = props.ccKey,
            _props$ccOption = props.ccOption,
            ccOption = _props$ccOption === void 0 ? {
          syncState: true
        } : _props$ccOption;
        util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['bindDataToCcClassContext', 'mapCcToInstance', 'broadcastState', 'changeState', 'syncStateToOtherCcComponent', 'changeStateClosureReactCb']);
        var ccUniqueKey;

        if (ccKey) {
          ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        } else {
          ccUniqueKey = uuid();
        }

        var ccClassContext = _this.bindDataToCcClassContext(ccClassKey, ccUniqueKey, ccOption);

        var reactSetState = _this.setState;

        _this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, ccOption, ccClassContext, module, sharedStateKeys, reactSetState);

        return _this;
      } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


      var _proto = CcClass.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      };

      _proto.componentDidMount = function componentDidMount() {
        if (_ReactClass.prototype.componentDidMount) _ReactClass.prototype.componentDidMount.call(this);
        var _this$cc$ccState = this.cc.ccState,
            module = _this$cc$ccState.module,
            sharedStateKeys = _this$cc$ccState.sharedStateKeys,
            ccOption = _this$cc$ccState.ccOption;
        var state = ccContext.store._state[module];

        var _extractSharedState = extractSharedState(state, sharedStateKeys),
            sharedState = _extractSharedState.sharedState,
            isStateEmpty = _extractSharedState.isStateEmpty;

        if (!isStateEmpty && ccOption.syncState) {
          //sync store's state to instance
          this.cc.reactSetState(sharedState);
        }
      };

      _proto.bindDataToCcClassContext = function bindDataToCcClassContext(ccClassKey, ccUniqueKey, ccOption) {
        var classContext = contextMap[ccClassKey];

        if (classContext.ccKeys.includes(ccUniqueKey)) {
          throw util.makeError(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
        }

        classContext.ccKey_componentRef_[ccUniqueKey] = this;
        classContext.ccKeys.push(ccUniqueKey);
        if (!ccOption) classContext.ccKey_option_[ccUniqueKey] = {
          syncState: true
        };else {
          if (!util.verifyCcOption(ccOption)) {
            throw util.makeError(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }

          classContext.ccKey_option_[ccUniqueKey] = ccOption;
        }
        return classContext;
      };

      _proto.mapCcToInstance = function mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, ccOption, ccClassContext, module, sharedStateKeys, reactSetState) {
        var _this2 = this;

        this.cc = {
          ccState: {
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: module,
            sharedStateKeys: sharedStateKeys
          },
          ccUniqueKey: ccUniqueKey,
          ccKey: ccKey,
          reactSetState: reactSetState,
          setState: this.changeState,
          dispatch: function dispatch(_temp2) {
            var _ref2 = _temp2 === void 0 ? {} : _temp2,
                module = _ref2.module,
                type = _ref2.type,
                payload = _ref2.payload,
                cb = _ref2.cb;

            var _this2$cc$ccState = _this2.cc.ccState,
                ccUniqueKey = _this2$cc$ccState.ccUniqueKey,
                ccOption = _this2$cc$ccState.ccOption,
                currentModule = _this2$cc$ccState.module;
            var toModule = module || currentModule; //if module not defined, will find currentModule's reducer

            var reducerFn = ccContext.reducer._reducers[toModule][type];
            if (!reducerFn) return console.error("no reducer defined in ccContext for module:" + toModule + "/type:" + type);
            var errMsg = util.verifyCcAction({
              type: type,
              payload: payload
            });
            if (errMsg) return console.error(errMsg);
            var dispatchContext = {
              ccUniqueKey: ccUniqueKey,
              ccOption: ccOption,
              toModule: toModule,
              type: type,
              state: _this2.state
            }; // const mail = util.makeStateMail(ccUniqueKey, ccOption, toModule, type, cb);

            if (cb) {
              reducerFn(_this2.changeStateClosureReactCb(cb), payload, dispatchContext);
            } else {
              reducerFn(_this2.changeState, payload, dispatchContext);
            }
          },
          dispatchPayload: function dispatchPayload(type, payload, module, cb) {
            if (module === void 0) {
              module = MODULE_GLOBAL;
            }

            _ReactClass.prototype.cc.dispatch({
              module: module,
              type: type,
              payload: payload,
              cb: cb
            });
          }
        };
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.dispatch = this.cc.dispatch; //let CCComponent instance can call dispatch directly

        this.setState = this.cc.setState; //let setState call cc.setState
      };

      _proto.changeStateClosureReactCb = function changeStateClosureReactCb(cb) {
        var _this3 = this;

        return function (state) {
          _this3.changeState(state, cb);
        };
      };

      _proto.changeState = function changeState(state, cb) {
        var _this$cc$ccState2 = this.cc.ccState,
            module = _this$cc$ccState2.module,
            ccOption = _this$cc$ccState2.ccOption; // who dispatch the action, who will receive the whole state

        this.cc.reactSetState(state, cb);

        if (ccOption.syncState) {
          this.broadcastState(module, state);
        }
      };

      _proto.broadcastState = function broadcastState(module, state) {
        var sharedStateKeys = this.cc.ccState.sharedStateKeys;

        var _extractSharedState2 = extractSharedState(state, sharedStateKeys),
            sharedState = _extractSharedState2.sharedState,
            isStateEmpty = _extractSharedState2.isStateEmpty;

        if (!isStateEmpty) {
          ccContext.store.setState(module, sharedState);
          this.syncStateToOtherCcComponent(module, sharedState);
        }
      };

      _proto.syncStateToOtherCcComponent = function syncStateToOtherCcComponent(moduleName, state) {
        var currentCcKey = this.cc.ccState.ccUniqueKey;
        var ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName]; //these ccClass subscribe the same module's state

        ccClassKeys.forEach(function (classKey) {
          var classContext = ccContext.ccClassKey_ccClassContext_[classKey];
          var ccKeys = classContext.ccKeys,
              ccKey_componentRef_ = classContext.ccKey_componentRef_,
              ccKey_option_ = classContext.ccKey_option_;
          ccKeys.forEach(function (ccKey) {
            if (ccKey !== currentCcKey) {
              //exclude currentCcKey, it's setState been invoked 
              var ref = ccKey_componentRef_[ccKey];

              if (ref) {
                var option = ccKey_option_[ccKey];
                if (option.syncState) ref.cc.reactSetState(state);
              }
            } else {}
          });
        });
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        //如果父组件实现了componentWillUnmount，要调用一遍
        if (_ReactClass.prototype.componentWillUnmount) _ReactClass.prototype.componentWillUnmount.call(this);
        var _this$cc$ccState3 = this.cc.ccState,
            ccUniqueKey = _this$cc$ccState3.ccUniqueKey,
            _this$cc$ccState3$ccC = _this$cc$ccState3.ccClassContext,
            ccKey_componentRef_ = _this$cc$ccState3$ccC.ccKey_componentRef_,
            ccKeys = _this$cc$ccState3$ccC.ccKeys,
            ccKey_option_ = _this$cc$ccState3$ccC.ccKey_option_;
        console.log("%c " + ccUniqueKey + " unset ref", 'color:blue;border:1px solid blue');
        ccKey_componentRef_[ccUniqueKey] = null;
        var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
        if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
        delete ccKey_option_[ccUniqueKey];
      };

      _proto.render = function render() {
        console.log("%c@@@ CC  " + ccClassKey + " render", 'color:darkred;border:1px solid darkred;');
        return _ReactClass.prototype.render.call(this);
      };

      return CcClass;
    }(ReactClass);

    CcClass.displayName = "CC(" + ccClassKey + ")";
    return CcClass;
  };
}