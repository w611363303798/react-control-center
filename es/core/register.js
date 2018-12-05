import _extends from "@babel/runtime/helpers/esm/extends";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import { MODULE_GLOBAL, ERR, CHANGE_BY_SELF, SYNC_FROM_CC_INSTANCE_STATE, SYNC_FROM_CC_REF_STORE, SYNC_FROM_CC_CLASS_STORE, SYNC_FROM_CC_CLASS_STORE_AND_REF_STORE, BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY } from '../support/constant';
import ccContext, { getCcContext } from '../cc-context';
import util from '../support/util';
import uuid from 'uuid';
import co from 'co';
var vbi = util.verboseInfo;
var me = util.makeError;
var verifyKeys = util.verifyKeys,
    ccClassDisplayName = util.ccClassDisplayName;
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

function extractStateByKeys(state, sharedStateKeys) {
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
    newState: newState,
    isStateEmpty: isStateEmpty
  };
}

function justWarning(err) {
  console.error(' ------------ CC WARNING ------------');
  if (err instanceof Error) console.error(err.message);else console.error(err);
}

function handleError(err, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (throwError) throw err;else {
    justWarning(err);
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
} // any error in this function will not been throwed, cc just warning, 


function isInputModuleInvalid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null; //let user's reactCallback has no change to be triggered
      }
    }

    cb(targetCb);
  }
}

function computeCcUniqueKey(isClassSingle, ccClassKey, ccKey) {
  var ccUniqueKey;
  var isCcUniqueKeyAutoGenerated = false;

  if (isClassSingle) {
    if (ccKey) justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:" + ccKey);
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      ccUniqueKey = ccClassKey + "/" + uuid();
      isCcUniqueKeyAutoGenerated = true;
    }
  }

  return {
    ccUniqueKey: ccUniqueKey,
    isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated
  };
}
/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/


export default function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$isSingle = _ref.isSingle,
      isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
      _ref$asyncLifeCycleHo = _ref.asyncLifeCycleHook,
      asyncLifeCycleHook = _ref$asyncLifeCycleHo === void 0 ? false : _ref$asyncLifeCycleHo,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? MODULE_GLOBAL : _ref$module,
      reducerModule = _ref.reducerModule,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys;

  var _asyncLifeCycleHook = asyncLifeCycleHook;

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
            ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
        util.bindThis(_assertThisInitialized(_assertThisInitialized(_this)), ['__$$bindDataToCcClassContext', '__$$mapCcToInstance', '$$getChangeStateHandler', '$$changeState']);
        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];
        if (ccOption.syncState === undefined) ccOption.syncState = true;
        if (ccOption.asyncLifeCycleHook === undefined) ccOption.asyncLifeCycleHook = _asyncLifeCycleHook;
        var asyncLifeCycleHook = ccOption.asyncLifeCycleHook,
            storedStateKeys = ccOption.storedStateKeys;

        var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
            ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
            isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

        var ccClassContext = _this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

        _this.__$$mapCcToInstance(isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys);

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
            storedStateKeys = _this$cc$ccState.storedStateKeys,
            ccOption = _this$cc$ccState.ccOption,
            ccUniqueKey = _this$cc$ccState.ccUniqueKey;
        var selfState = ccContext.refStore._state[ccUniqueKey];

        var _extractStateByKeys = extractStateByKeys(selfState, storedStateKeys),
            newSelfState = _extractStateByKeys.newState,
            isSelfStateEmpty = _extractStateByKeys.isStateEmpty;

        if (ccOption.syncState) {
          //sync store's state to instance
          var sharedState = ccContext.store._state[module];

          var _extractStateByKeys2 = extractStateByKeys(sharedState, sharedStateKeys),
              newSharedState = _extractStateByKeys2.newState,
              isSharedStateEmpty = _extractStateByKeys2.isStateEmpty;

          if (!isSharedStateEmpty && isSelfStateEmpty) {
            this.cc.prepareReactSetState(SYNC_FROM_CC_CLASS_STORE, newSharedState);
          } else if (isSharedStateEmpty && !isSelfStateEmpty) {
            this.cc.prepareReactSetState(SYNC_FROM_CC_REF_STORE, newSelfState);
          } else if (!isSharedStateEmpty && !isSelfStateEmpty) {
            this.cc.prepareReactSetState(SYNC_FROM_CC_CLASS_STORE_AND_REF_STORE, _extends({}, newSharedState, newSelfState));
          }
        } else if (!isSelfStateEmpty) {
          this.cc.prepareReactSetState(SYNC_FROM_CC_REF_STORE, newSelfState);
        }
      };

      _proto.__$$bindDataToCcClassContext = function __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
        var classContext = contextMap[ccClassKey];
        var ccKeys = classContext.ccKeys;

        if (ccContext.isDebug) {
          console.log(info("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
        }

        if (!util.verifyCcOption(ccOption)) {
          throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi("a standard default ccOption may like: {\"syncState\": true, \"asyncLifeCycleHook\":false, \"storedStateKeys\": []}"));
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (util.isHotReloadMode()) {
            var insCount = getCcKeyInsCount(ccUniqueKey);
            if (isSingle && insCount > 1) throw me(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

            if (insCount > 2) {
              // now cc can make sure the ccKey duplicate
              throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            } // just warning


            console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
            console.error(vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not very well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later

            setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption, 600);
          } else {
            throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
          }
        } else {
          setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption);
        }

        return classContext;
      };

      _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys) {
        var _this2 = this;

        var reactSetStateRef = this.setState.bind(this);
        var reactForceUpdateRef = this.forceUpdate.bind(this);
        var ccState = {
          renderCount: 1,
          isSingle: isSingle,
          asyncLifeCycleHook: asyncLifeCycleHook,
          ccClassKey: ccClassKey,
          ccKey: ccKey,
          ccUniqueKey: ccUniqueKey,
          isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
          storedStateKeys: storedStateKeys,
          ccOption: ccOption,
          ccClassContext: ccClassContext,
          module: currentModule,
          reducerModule: reducerModule,
          sharedStateKeys: sharedStateKeys
        };

        var _verifyKeys = verifyKeys(sharedStateKeys, storedStateKeys),
            duplicate = _verifyKeys.duplicate,
            notArray = _verifyKeys.notArray,
            keyElementNotString = _verifyKeys.keyElementNotString;

        if (notArray) {
          throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
        }

        if (keyElementNotString) {
          throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
        }

        if (duplicate) {
          throw me(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
        }

        if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
          throw me(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey));
        }

        this.cc = {
          ccState: ccState,
          ccUniqueKey: ccUniqueKey,
          ccKey: ccKey,
          beforeSetState: this.$$beforeSetState,
          beforeBroadcastState: this.$$beforeBroadcastState,
          afterSetState: this.$$afterSetState,
          prepareReactSetState: function prepareReactSetState(changeWay, state, next, reactCallback) {
            if (storedStateKeys.length > 0) {
              var _extractStateByKeys3 = extractStateByKeys(state, storedStateKeys),
                  newState = _extractStateByKeys3.newState,
                  isStateEmpty = _extractStateByKeys3.isStateEmpty;

              if (!isStateEmpty) {
                ccContext.refStore._state[ccUniqueKey] = newState;
              }
            }

            if (_this2.$$beforeSetState) {
              if (asyncLifeCycleHook) {
                // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                // $$beforeSetState(context, next){}
                _this2.$$beforeSetState({
                  changeWay: changeWay
                }, function () {
                  _this2.cc.reactSetState(state, reactCallback);

                  if (next) next();
                });
              } else {
                _this2.$$beforeSetState({
                  changeWay: changeWay
                });

                _this2.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            } else {
              _this2.cc.reactSetState(state, reactCallback);

              if (next) next();
            }
          },
          prepareBroadcastState: function prepareBroadcastState(triggerType, moduleName, sourceSharedState, needClone) {
            if (_this2.$$beforeBroadcastState) {
              if (asyncLifeCycleHook) {
                _this2.$$beforeBroadcastState({
                  triggerType: triggerType
                }, function () {
                  _this2.cc.broadcastState(moduleName, sourceSharedState, needClone);
                });
              } else {
                _this2.$$beforeBroadcastState({
                  triggerType: triggerType
                });

                _this2.cc.broadcastState(moduleName, sourceSharedState, needClone);
              }
            } else {
              _this2.cc.broadcastState(moduleName, sourceSharedState, needClone);
            }
          },
          reactSetState: function reactSetState(state, cb) {
            ccState.renderCount += 1;
            reactSetStateRef(state, cb);
          },
          reactForceUpdate: function reactForceUpdate(state, cb) {
            ccState.renderCount += 1;
            reactForceUpdateRef(state, cb);
          },
          setState: function setState(state, cb) {
            _this2.$$changeState(state, {
              module: currentModule,
              cb: cb
            });
          },
          forceUpdate: function forceUpdate(cb) {
            _this2.$$changeState(_this2.state, {
              module: currentModule,
              cb: cb
            });
          },
          invoke: function invoke(userLogicFn) {
            var _this2$cc;

            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            (_this2$cc = _this2.cc).invokeWith.apply(_this2$cc, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          invokeWith: function invokeWith(userLogicFn, _temp2) {
            var _ref2 = _temp2 === void 0 ? {} : _temp2,
                _ref2$module = _ref2.module,
                module = _ref2$module === void 0 ? currentModule : _ref2$module,
                _ref2$forceSync = _ref2.forceSync,
                forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                cb = _ref2.cb;

            for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            isInputModuleInvalid(module, currentModule, cb, function (newCb) {
              co.wrap(userLogicFn).apply(void 0, args).then(function (state) {
                _this2.$$changeState(state, {
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                });
              }).catch(justWarning);
            });
          },
          call: function call(userLogicFn) {
            var _this2$cc2;

            for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
              args[_key3 - 1] = arguments[_key3];
            }

            (_this2$cc2 = _this2.cc).callWith.apply(_this2$cc2, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          callWith: function callWith(userLogicFn, _temp3) {
            var _ref3 = _temp3 === void 0 ? {} : _temp3,
                _ref3$module = _ref3.module,
                module = _ref3$module === void 0 ? currentModule : _ref3$module,
                _ref3$forceSync = _ref3.forceSync,
                forceSync = _ref3$forceSync === void 0 ? false : _ref3$forceSync,
                cb = _ref3.cb;

            for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
              args[_key4 - 2] = arguments[_key4];
            }

            isInputModuleInvalid(module, currentModule, cb, function (newCb) {
              userLogicFn.call.apply(userLogicFn, [_this2, _this2.$$getChangeStateHandler({
                module: module,
                forceSync: forceSync,
                cb: newCb
              })].concat(args));
            });
          },
          callThunk: function callThunk(userLogicFn) {
            var _this2$cc3;

            for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
              args[_key5 - 1] = arguments[_key5];
            }

            (_this2$cc3 = _this2.cc).callThunkWith.apply(_this2$cc3, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          callThunkWith: function callThunkWith(userLogicFn, _temp4) {
            var _ref4 = _temp4 === void 0 ? {} : _temp4,
                _ref4$module = _ref4.module,
                module = _ref4$module === void 0 ? currentModule : _ref4$module,
                _ref4$forceSync = _ref4.forceSync,
                forceSync = _ref4$forceSync === void 0 ? false : _ref4$forceSync,
                cb = _ref4.cb;

            for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
              args[_key6 - 2] = arguments[_key6];
            }

            isInputModuleInvalid(module, currentModule, cb, function (newCb) {
              userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.$$getChangeStateHandler({
                module: module,
                forceSync: forceSync,
                cb: newCb
              }));
            });
          },
          commit: function commit(userLogicFn) {
            var _this2$cc4;

            for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
              args[_key7 - 1] = arguments[_key7];
            }

            (_this2$cc4 = _this2.cc).commitWith.apply(_this2$cc4, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          commitWith: function commitWith(userLogicFn, _temp5) {
            var _ref5 = _temp5 === void 0 ? {} : _temp5,
                _ref5$module = _ref5.module,
                module = _ref5$module === void 0 ? currentModule : _ref5$module,
                _ref5$forceSync = _ref5.forceSync,
                forceSync = _ref5$forceSync === void 0 ? false : _ref5$forceSync,
                cb = _ref5.cb;

            for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
              args[_key8 - 2] = arguments[_key8];
            }

            isInputModuleInvalid(module, currentModule, cb, function (newCb) {
              var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

              _this2.$$changeState(state, {
                module: module,
                forceSync: forceSync,
                cb: newCb
              });
            });
          },
          dispatch: function dispatch(_temp6) {
            var _ref6 = _temp6 === void 0 ? {} : _temp6,
                module = _ref6.module,
                reducerModule = _ref6.reducerModule,
                _ref6$forceSync = _ref6.forceSync,
                forceSync = _ref6$forceSync === void 0 ? false : _ref6$forceSync,
                type = _ref6.type,
                payload = _ref6.payload,
                reactCallback = _ref6.cb;

            var inputModule = module || currentModule;
            var currentReducerModule = _this2.cc.ccState.reducerModule;
            var targetReducerModule = reducerModule || currentReducerModule; //if reducerModule not defined, will find currentReducerModule's reducer

            var targetReducerMap = _reducers[targetReducerModule];
            if (!targetReducerMap) return justWarning("no reducerMap found for module:" + targetReducerModule);
            var reducerFn = targetReducerMap[type];
            if (!reducerFn) return justWarning("no reducer defined in ccContext for module:" + targetReducerModule + " type:" + type);
            var errMsg = util.verifyCcAction({
              type: type,
              payload: payload
            });
            if (errMsg) return justWarning(errMsg);
            var executionContext = {
              ccUniqueKey: ccUniqueKey,
              ccOption: ccOption,
              module: module,
              reducerModule: reducerModule,
              type: type,
              payload: payload,
              state: _this2.state
            };
            isInputModuleInvalid(inputModule, currentModule, reactCallback, function (newCb) {
              var _ref7;

              _this2.cc.invokeWith(reducerFn, (_ref7 = {}, inputModule = _ref7.inputModule, forceSync = _ref7.forceSync, newCb = _ref7.cb, _ref7), executionContext);
            });
          },
          broadcastState: function broadcastState(moduleName, sourceSharedState, needClone) {
            var _sourceSharedState = sourceSharedState;
            if (needClone) _sourceSharedState = util.clone(sourceSharedState); // this clone may cause performance issue, if sourceSharedState is too big!!

            ccContext.store.setState(module, _sourceSharedState);
            var currentCcKey = _this2.cc.ccState.ccUniqueKey;
            var ccClassKeys = ccContext.moduleName_ccClassKeys_[moduleName];
            if (!ccClassKeys) return;
            var ccKey_ref_ = ccContext.ccKey_ref_;
            var ccKey_option_ = ccContext.ccKey_option_; //these ccClass subscribe the same module's state

            ccClassKeys.forEach(function (classKey) {
              var classContext = ccContext.ccClassKey_ccClassContext_[classKey];
              var ccKeys = classContext.ccKeys,
                  sharedStateKeys = classContext.sharedStateKeys;
              if (sharedStateKeys.length === 0) return; // extractStateByKeys again! because different class with a same module may have different sharedStateKeys!!!

              var _extractStateByKeys4 = extractStateByKeys(_sourceSharedState, sharedStateKeys),
                  sharedStateForCurrentCcClass = _extractStateByKeys4.newState,
                  isStateEmpty = _extractStateByKeys4.isStateEmpty;

              if (isStateEmpty) return;
              ccKeys.forEach(function (ccKey) {
                //exclude currentCcKey, whether its reactSetState has been invoked or not, currentCcKey can't trigger prepareReactSetState here
                if (ccKey !== currentCcKey) {
                  var ref = ccKey_ref_[ccKey];

                  if (ref) {
                    var option = ccKey_option_[ccKey];

                    if (option.syncState) {
                      ref.cc.prepareReactSetState(SYNC_FROM_CC_INSTANCE_STATE, sharedStateForCurrentCcClass);
                    }
                  }
                }
              });
            });
          }
        };
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
        this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
        this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
        this.$$dispatch = this.cc.dispatch; //let CCComponent instance can call dispatch directly

        this.$$invoke = this.cc.invoke; //commit state to cc directly, but userFn can be promise or generator both!

        this.$$invokeWith = this.cc.invokeWith;
        this.$$call = this.cc.call; // commit state by setState handler

        this.$$callWith = this.cc.callWith;
        this.$$callThunk = this.cc.callThunk; // commit state by setState handler

        this.$$callThunkWith = this.cc.callThunkWith;
        this.$$commit = this.cc.commit; // commit state to cc directly, userFn can only be normal function

        this.$$commitWith = this.cc.commitWith;
        this.setState = this.cc.setState; //let setState call cc.setState

        this.forceUpdate = this.cc.forceUpdate; //let forceUpdate call cc.forceUpdate
      }; // note!!! changeState do two thing, decide if change self's state or not, if broadcast state or not;
      // when ccIns's module != target module,
      //        cc will only broadcast the state to target module, caution: it will overwrite the target module's state!!
      // when ccIns's module == target module,
      //        if ccIns option.syncState is false, cc only change it's own state, 
      //           but if you pass forceSync=true, cc also will broadcast the state to target module and caution: it will overwrite the target module's state !!!
      //        if ccIns option.syncState is true, change it's own state and broadcast the state to target module


      _proto.$$changeState = function $$changeState(state, _temp7) {
        var _this3 = this;

        var _ref8 = _temp7 === void 0 ? {} : _temp7,
            module = _ref8.module,
            forceSync = _ref8.forceSync,
            reactCallback = _ref8.cb;

        //executionContext
        var currentModule = this.cc.ccState.module;

        if (module === currentModule) {
          // who trigger $$changeState, who will go to change the whole received state 
          this.cc.prepareReactSetState(CHANGE_BY_SELF, state, function () {
            if (_this3.cc.ccState.ccOption.syncState) {
              // note!!! if syncState == false, other ccIns will have not change to receive new state
              _this3.cc.prepareBroadcastState(BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
            } else if (forceSync) {
              _this3.cc.prepareBroadcastState(BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
            } else {// other ccIns will have no chance to receive new state
            }
          }, reactCallback);
        } else {
          if (forceSync) justWarning("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi("module:" + module + " currentModule" + currentModule));
          this.cc.prepareBroadcastState(BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
        }
      }; //{ module, forceSync, cb }


      _proto.$$getChangeStateHandler = function $$getChangeStateHandler(executionContext) {
        var _this4 = this;

        return function (state) {
          _this4.$$changeState(state, executionContext);
        };
      };

      _proto.componentDidUpdate = function componentDidUpdate() {
        if (_ReactClass.prototype.componentDidUpdate) _ReactClass.prototype.componentDidUpdate.call(this);
        if (this.$$afterSetState) this.$$afterSetState();
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        var _this$cc$ccState2 = this.cc.ccState,
            ccUniqueKey = _this$cc$ccState2.ccUniqueKey,
            ccKeys = _this$cc$ccState2.ccClassContext.ccKeys;
        unsetCcInstanceRef(ccKeys, ccUniqueKey); //如果父组件实现了componentWillUnmount，要调用一遍

        if (_ReactClass.prototype.componentWillUnmount) _ReactClass.prototype.componentWillUnmount.call(this);
      };

      _proto.render = function render() {
        if (ccContext.isDebug) {
          console.log(info("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
        }

        return _ReactClass.prototype.render.call(this);
      };

      return CcClass;
    }(ReactClass);

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  };
}