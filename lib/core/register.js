"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = register;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireWildcard(require("../cc-context"));

var _util = _interopRequireDefault(require("../support/util"));

var _uuid = _interopRequireDefault(require("uuid"));

var vbi = _util.default.verboseInfo;
var me = _util.default.makeError;
var ccClassDisplayName = _util.default.ccClassDisplayName;
var _state = _ccContext.default.store._state,
    _reducers = _ccContext.default.reducer._reducers;

var cl = function cl(color) {
  if (color === void 0) {
    color = 'green';
  }

  return "color:" + color + ";border:1px solid " + color;
};

var info = function info(str) {
  return "%c" + str;
};

var ccKey_insCount = {};

function incCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 1;else ccKey_insCount[ccUniqueKey] += 1;
}

function decCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 0;else ccKey_insCount[ccUniqueKey] -= 1;
}

function getCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) return 0;else return ccKey_insCount[ccUniqueKey];
}

function isStateValid(state) {
  if (!state || !_util.default.isPlainJsonObject(state)) {
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

    if (_util.default.isValueNotNull(value)) {
      newState[key] = value;
      isStateEmpty = false;
    }
  });
  return {
    sharedState: newState,
    isStateEmpty: isStateEmpty
  };
}

function handleError(err, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (throwError) throw err;else {
    console.error(' ------------ CC WARNING ------------');
    console.error(err.message);
  }
}

function checkStoreModule(module, throwError, cb) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!_ccContext.default.isModuleMode) {
    if (module !== _constant.MODULE_GLOBAL) {
      handleError(me(_constant.ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "module:" + module), throwError);
    } else if (cb) cb();
  } else {
    if (!_state[module]) {
      handleError(me(_constant.ERR.CC_CLASS_STORE_MODULE_INVALID, "module:" + module), throwError);
    } else if (cb) cb();
  }
}

function checkReducerModule(reducerModule, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!_ccContext.default.isModuleMode) {
    if (reducerModule != _constant.MODULE_GLOBAL) {
      handleError(me(_constant.ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "reducerModule:" + reducerModule), throwError);
    }
  } else {
    if (!_reducers[reducerModule]) {
      handleError(me(_constant.ERR.CC_CLASS_REDUCER_MODULE_INVALID, "reducerModule:" + reducerModule), throwError);
    }
  }
}

function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
  if (_ccContext.default.isDebug) {
    console.log(info(ccUniqueKey + " unset ref"), cl('red'));
  } // ccContext.ccKey_ref_[ccUniqueKey] = null;


  delete _ccContext.default.ccKey_ref_[ccUniqueKey];
  delete _ccContext.default.ccKey_option_[ccUniqueKey];
  var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  decCcKeyInsCount(ccUniqueKey);
}

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
  function setRef() {
    _ccContext.default.ccKey_ref_[ccUniqueKey] = ref;
    ccKeys.push(ccUniqueKey);
    _ccContext.default.ccKey_option_[ccUniqueKey] = option;
  }

  incCcKeyInsCount(ccUniqueKey);

  if (delayMs) {
    setTimeout(setRef, delayMs);
  } else {
    setRef();
  }
}
/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/


function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_GLOBAL : _ref$module,
      reducerModule = _ref.reducerModule,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys;

  var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


  checkStoreModule(module);
  checkReducerModule(_reducerModule);
  var contextMap = _ccContext.default.ccClassKey_ccClassContext_;

  if (contextMap[ccClassKey] !== undefined) {
    throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  } else {
    contextMap[ccClassKey] = _util.default.makeCcClassContext(module, sharedStateKeys);
  }

  var ccClassKeys_ = _ccContext.default.moduleName_ccClassKeys_[module];
  if (!ccClassKeys_) ccClassKeys_ = _ccContext.default.moduleName_ccClassKeys_[module] = [];
  ccClassKeys_.push(ccClassKey);
  return function (ReactClass) {
    var CcClass =
    /*#__PURE__*/
    function (_ReactClass) {
      (0, _inheritsLoose2.default)(CcClass, _ReactClass);

      function CcClass(props, context) {
        var _this;

        _this = _ReactClass.call(this, props, context) || this;
        var ccKey = props.ccKey,
            _props$ccOption = props.ccOption,
            ccOption = _props$ccOption === void 0 ? {
          syncState: true
        } : _props$ccOption;

        _util.default.bindThis((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), ['bindDataToCcClassContext', 'mapCcToInstance', 'broadcastState', 'changeState', 'syncStateToOtherCcComponent', 'changeStateClosureReactCb']);

        var ccUniqueKey;
        var isCcUniqueKeyAutoGenerated = false;

        if (ccKey) {
          ccUniqueKey = _util.default.makeUniqueCcKey(ccClassKey, ccKey);
        } else {
          ccUniqueKey = ccClassKey + "/" + (0, _uuid.default)();
          isCcUniqueKeyAutoGenerated = true;
          ccKey = ccUniqueKey;
        }

        var ccClassContext = _this.bindDataToCcClassContext(ccClassKey, ccKey, ccUniqueKey, ccOption);

        _this.mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys);

        return _this;
      } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


      var _proto = CcClass.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      };

      _proto.componentDidCatch = function componentDidCatch() {
        console.log('componentDidCatch');
      };

      _proto.componentDidMount = function componentDidMount() {
        if (_ReactClass.prototype.componentDidMount) _ReactClass.prototype.componentDidMount.call(this);
        var _this$cc$ccState = this.cc.ccState,
            module = _this$cc$ccState.module,
            sharedStateKeys = _this$cc$ccState.sharedStateKeys,
            ccOption = _this$cc$ccState.ccOption;
        var state = _ccContext.default.store._state[module];

        var _extractSharedState = extractSharedState(state, sharedStateKeys),
            sharedState = _extractSharedState.sharedState,
            isStateEmpty = _extractSharedState.isStateEmpty;

        if (!isStateEmpty && ccOption.syncState) {
          //sync store's state to instance
          this.cc.reactSetState(sharedState);
        }
      };

      _proto.bindDataToCcClassContext = function bindDataToCcClassContext(ccClassKey, ccKey, ccUniqueKey, ccOption) {
        var classContext = contextMap[ccClassKey];
        var ccKeys = classContext.ccKeys;

        if (_ccContext.default.isDebug) {
          console.log(info("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
        }

        var option;
        if (!ccOption) option = {
          syncState: true
        };else {
          if (!_util.default.verifyCcOption(ccOption)) {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }

          option = ccOption;
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (_util.default.isHotReloadMode()) {
            if (getCcKeyInsCount(ccUniqueKey) > 2) {
              // cc now can make sure the ccKey duplicate
              throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            } // just warning


            console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
            console.error(vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later

            setCcInstanceRef(ccUniqueKey, this, ccKeys, option, 600);
          } else {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
          }
        } else {
          setCcInstanceRef(ccUniqueKey, this, ccKeys, option);
        }

        return classContext;
      };

      _proto.mapCcToInstance = function mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys) {
        var _this2 = this;

        var reactSetStateRef = this.setState.bind(this);
        this.cc = {
          ccState: {
            renderCount: 0,
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: currentModule,
            reducerModule: reducerModule,
            sharedStateKeys: sharedStateKeys
          },
          ccUniqueKey: ccUniqueKey,
          ccKey: ccKey,
          reactSetState: function reactSetState(state, cb) {
            _this2.cc.ccState.renderCount += 1;
            reactSetStateRef(state, cb);
          },
          setState: this.changeState,
          // note! see changeStateClosureExecutionContext implement
          // when ccIns's module != target module,
          //         cc will only broadcast the state to target module and overwrite the target module's state
          // when ccIns's module == target module,
          //        if ccIns option.syncState is false, cc only change it's own state, 
          //           but if you pass forceSync=true, cc also will broadcast the state to target module and >>> overwrite the target module's state !<<<
          //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module
          callWith: function callWith(userLogicFn, _temp2) {
            var _ref2 = _temp2 === void 0 ? {} : _temp2,
                _ref2$module = _ref2.module,
                module = _ref2$module === void 0 ? currentModule : _ref2$module,
                _ref2$forceSync = _ref2.forceSync,
                forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                cb = _ref2.cb;

            for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              args[_key - 2] = arguments[_key];
            }

            var targetCb = cb;
            checkStoreModule(module, false, function () {
              if (module != currentModule) {
                if (cb) {
                  handleError(me(_constant.ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi("if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + " ")), false);
                  targetCb = null; //let user's reactCallback has no change to be triggered
                }
              }

              userLogicFn.call.apply(userLogicFn, [_this2, _this2.changeStateClosureExecutionContext({
                module: module,
                forceSync: forceSync,
                targetCb: targetCb
              })].concat(args));
            });
          },
          call: function call(userLogicFn) {
            var _this2$cc;

            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }

            (_this2$cc = _this2.cc).callWith.apply(_this2$cc, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          dispatch: function dispatch(_temp3) {
            var _ref3 = _temp3 === void 0 ? {} : _temp3,
                reducerModule = _ref3.reducerModule,
                type = _ref3.type,
                payload = _ref3.payload,
                cb = _ref3.cb;

            var currentReducerModule = _this2.cc.ccState.reducerModule;
            var targetModule = reducerModule || currentReducerModule; //if reducerModule not defined, will find currentReducerModule's reducer

            var executionContext = {
              ccUniqueKey: ccUniqueKey,
              ccOption: ccOption,
              module: module,
              reducerModule: reducerModule,
              type: type,
              state: _this2.state
            };
            var targetReducerMap = _reducers[targetModule];
            if (!targetReducerMap) return console.error("no reducerMap found for module:" + targetModule);
            var reducerFn = targetReducerMap[type];
            if (!reducerFn) return console.error("no reducer defined in ccContext for module:" + targetModule + "/type:" + type);

            var errMsg = _util.default.verifyCcAction({
              type: type,
              payload: payload
            });

            if (errMsg) return console.error(errMsg);

            if (cb) {
              reducerFn(_this2.changeStateClosureReactCb(cb), payload, executionContext);
            } else {
              reducerFn(_this2.changeState, payload, executionContext);
            }
          },
          dispatchPayload: function dispatchPayload(type, payload, module, cb) {
            if (module === void 0) {
              module = _constant.MODULE_GLOBAL;
            }

            _this2.cc.dispatch({
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

        this.call = this.cc.call;
        this.callWith = this.cc.callWith;
      };

      _proto.changeStateClosureExecutionContext = function changeStateClosureExecutionContext(_ref4) {
        var _this3 = this;

        var module = _ref4.module,
            forceSync = _ref4.forceSync,
            cb = _ref4.cb;
        return function (state) {
          if (module === _this3.cc.ccState.module) {
            _this3.cc.reactSetState(state, cb);

            if (_this3.cc.ccState.ccOption.syncState) {
              _this3.broadcastState(module, state);
            } else if (forceSync) {
              _this3.broadcastState(module, _util.default.clone(state));
            }
          } else {
            _this3.broadcastState(module, _util.default.clone(state));
          }
        };
      };

      _proto.changeStateClosureReactCb = function changeStateClosureReactCb(cb) {
        var _this4 = this;

        return function (state) {
          _this4.changeState(state, cb);
        };
      };

      _proto.changeState = function changeState(state, reactCallback) {
        var _this$cc$ccState2 = this.cc.ccState,
            module = _this$cc$ccState2.module,
            ccOption = _this$cc$ccState2.ccOption; // who dispatch the action, who will go to change the whole received state 

        this.cc.reactSetState(state, reactCallback);

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
          _ccContext.default.store.setState(module, sharedState);

          this.syncStateToOtherCcComponent(module, sharedState);
        }
      };

      _proto.syncStateToOtherCcComponent = function syncStateToOtherCcComponent(moduleName, sourceSharedState) {
        var currentCcKey = this.cc.ccState.ccUniqueKey;
        var ccClassKeys = _ccContext.default.moduleName_ccClassKeys_[moduleName];
        var ccKey_ref_ = _ccContext.default.ccKey_ref_;
        var ccKey_option_ = _ccContext.default.ccKey_option_; //these ccClass subscribe the same module's state

        ccClassKeys.forEach(function (classKey) {
          var classContext = _ccContext.default.ccClassKey_ccClassContext_[classKey];
          var ccKeys = classContext.ccKeys,
              sharedStateKeys = classContext.sharedStateKeys;
          if (sharedStateKeys.length === 0) return; // extractSharedState again! because different class with a same module may have different sharedStateKeys!!!

          var _extractSharedState3 = extractSharedState(sourceSharedState, sharedStateKeys),
              sharedStateForCurrentCcClass = _extractSharedState3.sharedState,
              isStateEmpty = _extractSharedState3.isStateEmpty;

          if (isStateEmpty) return;
          ccKeys.forEach(function (ccKey) {
            if (ccKey !== currentCcKey) {
              //exclude currentCcKey, it's reactSetState may have been invoked 
              var ref = ccKey_ref_[ccKey];

              if (ref) {
                var option = ccKey_option_[ccKey];
                if (option.syncState) ref.cc.reactSetState(sharedStateForCurrentCcClass);
              }
            }
          });
        });
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        //如果父组件实现了componentWillUnmount，要调用一遍
        if (_ReactClass.prototype.componentWillUnmount) _ReactClass.prototype.componentWillUnmount.call(this);
        var _this$cc$ccState3 = this.cc.ccState,
            ccUniqueKey = _this$cc$ccState3.ccUniqueKey,
            ccKeys = _this$cc$ccState3.ccClassContext.ccKeys;
        unsetCcInstanceRef(ccKeys, ccUniqueKey);
      };

      _proto.render = function render() {
        if (_ccContext.default.isDebug) {
          console.log(info("@@@ " + ccClassDisplayName(ccClassKey) + " render"), cl());
        }

        return _ReactClass.prototype.render.call(this);
      };

      return CcClass;
    }(ReactClass);

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  };
}