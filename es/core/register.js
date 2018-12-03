import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import { MODULE_GLOBAL, ERR } from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';
var vbi = util.verboseInfo;
var me = util.makeError;
var ccClassDisplayName = util.ccClassDisplayName;
var _state = ccContext.store._state,
    _reducers = ccContext.reducer._reducers;

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

function paramCallBackShouldNotSupply(module, currentModule) {
  return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
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

function handleError(err, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (throwError) throw err;else {
    console.error(' ------------ CC WARNING ------------');
    console.error(err.message);
  }
}

function checkStoreModule(module, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!ccContext.isModuleMode) {
    if (module !== MODULE_GLOBAL) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "module:" + module), throwError);
      return false;
    } else return true;
  } else {
    if (!_state[module]) {
      handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, "module:" + module), throwError);
      return false;
    } else return true;
  }
}

function checkReducerModule(reducerModule, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!ccContext.isModuleMode) {
    if (reducerModule != MODULE_GLOBAL) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "reducerModule:" + reducerModule), throwError);
    }
  } else {
    if (!_reducers[reducerModule]) {
      handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, "reducerModule:" + reducerModule), throwError);
    }
  }
}

function unsetCcInstanceRef(ccKeys, ccUniqueKey) {
  if (ccContext.isDebug) {
    console.log(info(ccUniqueKey + " unset ref"), cl('red'));
  } // ccContext.ccKey_ref_[ccUniqueKey] = null;


  delete ccContext.ccKey_ref_[ccUniqueKey];
  delete ccContext.ccKey_option_[ccUniqueKey];
  var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
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
    setTimeout(setRef, delayMs);
  } else {
    setRef();
  }
}

function ifCallWillExecute(module, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(module, false)) {
    if (module != currentModule) {
      if (reactCallback) {
        handleError(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(module, currentModule))), false);
        targetCb = null; //let user's reactCallback has no change to be triggered
      }
    }

    cb(targetCb);
  }
}
/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/


export default function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? MODULE_GLOBAL : _ref$module,
      reducerModule = _ref.reducerModule,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys;

  var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


  checkStoreModule(module);
  checkReducerModule(_reducerModule);
  var contextMap = ccContext.ccClassKey_ccClassContext_;

  if (contextMap[ccClassKey] !== undefined) {
    throw me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
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
        var isCcUniqueKeyAutoGenerated = false;

        if (ccKey) {
          ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        } else {
          ccUniqueKey = ccClassKey + "/" + uuid();
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
        var state = ccContext.store._state[module];

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

        if (ccContext.isDebug) {
          console.log(info("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
        }

        var option;
        if (!ccOption) option = {
          syncState: true
        };else {
          if (!util.verifyCcOption(ccOption)) {
            throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID);
          }

          option = ccOption;
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (util.isHotReloadMode()) {
            if (getCcKeyInsCount(ccUniqueKey) > 2) {
              // now cc can make sure the ccKey duplicate
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            } // just warning


            console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
            console.error(vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later

            setCcInstanceRef(ccUniqueKey, this, ccKeys, option, 600);
          } else {
            throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
          }
        } else {
          setCcInstanceRef(ccUniqueKey, this, ccKeys, option);
        }

        return classContext;
      };

      _proto.mapCcToInstance = function mapCcToInstance(ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys) {
        var _this2 = this;

        var reactSetStateRef = this.setState.bind(this);
        var reactForceUpdateRef = this.forceUpdate.bind(this);
        var ccState = {
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
        };
        this.cc = {
          ccState: ccState,
          ccUniqueKey: ccUniqueKey,
          ccKey: ccKey,
          reactSetState: function reactSetState(state, cb) {
            ccState.renderCount += 1;
            reactSetStateRef(state, cb);
          },
          reactForceUpdate: function reactForceUpdate(state, cb) {
            ccState.renderCount += 1;
            reactForceUpdateRef(state, cb);
          },
          setState: this.changeState,
          forceUpdate: function forceUpdate(cb) {
            _this2.changeState(_this2.state, cb);
          },
          call: function call(userLogicFn) {
            var _this2$cc;

            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            (_this2$cc = _this2.cc).callWith.apply(_this2$cc, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
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

            for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            ifCallWillExecute(module, currentModule, cb, function (newCb) {
              userLogicFn.call.apply(userLogicFn, [_this2, _this2.changeStateClosureExecutionContext({
                module: module,
                forceSync: forceSync,
                cb: newCb
              })].concat(args));
            });
          },
          callThunk: function callThunk(userLogicFn) {
            var _this2$cc2;

            for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
              args[_key3 - 1] = arguments[_key3];
            }

            (_this2$cc2 = _this2.cc).callThunkWith.apply(_this2$cc2, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          callThunkWith: function callThunkWith(userLogicFn, _temp3) {
            var _ref3 = _temp3 === void 0 ? {} : _temp3,
                _ref3$module = _ref3.module,
                module = _ref3$module === void 0 ? currentModule : _ref3$module,
                _ref3$forceSync = _ref3.forceSync,
                forceSync = _ref3$forceSync === void 0 ? false : _ref3$forceSync,
                cb = _ref3.cb;

            for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
              args[_key4 - 2] = arguments[_key4];
            }

            ifCallWillExecute(module, currentModule, cb, function (newCb) {
              userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.changeStateClosureExecutionContext({
                module: module,
                forceSync: forceSync,
                cb: newCb
              }));
            });
          },
          commit: function commit(userLogicFn) {
            var _this2$cc3;

            for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
              args[_key5 - 1] = arguments[_key5];
            }

            (_this2$cc3 = _this2.cc).commitWith.apply(_this2$cc3, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          commitWith: function commitWith(userLogicFn, _temp4) {
            var _ref4 = _temp4 === void 0 ? {} : _temp4,
                _ref4$module = _ref4.module,
                module = _ref4$module === void 0 ? currentModule : _ref4$module,
                _ref4$forceSync = _ref4.forceSync,
                forceSync = _ref4$forceSync === void 0 ? false : _ref4$forceSync,
                cb = _ref4.cb;

            for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
              args[_key6 - 2] = arguments[_key6];
            }

            ifCallWillExecute(module, currentModule, cb, function (newCb) {
              var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

              _this2.changeStateWithExecutionContext(state, {
                module: module,
                forceSync: forceSync,
                cb: newCb
              });
            });
          },
          dispatch: function dispatch(_temp5) {
            var _ref5 = _temp5 === void 0 ? {} : _temp5,
                reducerModule = _ref5.reducerModule,
                type = _ref5.type,
                payload = _ref5.payload,
                cb = _ref5.cb;

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
            var errMsg = util.verifyCcAction({
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
              module = module;
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
        this.$dispatch = this.cc.dispatch; //let CCComponent instance can call dispatch directly

        this.$dispatchPayload = this.cc.dispatchPayload; //let CCComponent instance can call dispatchPayload directly

        this.setState = this.cc.setState; //let setState call cc.setState

        this.forceUpdate = this.cc.forceUpdate; //let forceUpdate call cc.forceUpdate

        this.$call = this.cc.call;
        this.$callWith = this.cc.callWith;
        this.$callThunk = this.cc.callThunk;
        this.$callThunkWith = this.cc.callThunkWith;
        this.$commit = this.cc.commit;
        this.$commitWith = this.cc.commitWith;
      };

      _proto.changeStateWithExecutionContext = function changeStateWithExecutionContext(state, _ref6) {
        var module = _ref6.module,
            forceSync = _ref6.forceSync,
            cb = _ref6.cb;

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
      };

      _proto.changeStateClosureExecutionContext = function changeStateClosureExecutionContext(_ref7) {
        var _this3 = this;

        var module = _ref7.module,
            forceSync = _ref7.forceSync,
            cb = _ref7.cb;
        return function (state) {
          _this3.changeStateWithExecutionContext(state, {
            module: module,
            forceSync: forceSync,
            cb: cb
          });
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
          ccContext.store.setState(module, sharedState);
          this.syncStateToOtherCcComponent(module, sharedState);
        }
      };

      _proto.syncStateToOtherCcComponent = function syncStateToOtherCcComponent(moduleName, sourceSharedState) {
        var currentCcKey = this.cc.ccState.ccUniqueKey;
        var ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName];
        var ccKey_ref_ = ccContext.ccKey_ref_;
        var ccKey_option_ = ccContext.ccKey_option_; //these ccClass subscribe the same module's state

        ccClassKeys.forEach(function (classKey) {
          var classContext = ccContext.ccClassKey_ccClassContext_[classKey];
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
        if (ccContext.isDebug) {
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