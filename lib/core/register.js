"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = register;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireWildcard(require("../cc-context"));

var _util = _interopRequireDefault(require("../support/util"));

var _uuid = _interopRequireDefault(require("uuid"));

var _co = _interopRequireDefault(require("co"));

var verifyKeys = _util.default.verifyKeys,
    ccClassDisplayName = _util.default.ccClassDisplayName,
    styleStr = _util.default.styleStr,
    color = _util.default.color,
    verboseInfo = _util.default.verboseInfo,
    makeError = _util.default.makeError,
    justWarning = _util.default.justWarning;
var _ccContext$store = _ccContext.default.store,
    _state = _ccContext$store._state,
    getState = _ccContext$store.getState,
    _reducers = _ccContext.default.reducer._reducers,
    refStore = _ccContext.default.refStore,
    globalMappingKey_sharedKey_ = _ccContext.default.globalMappingKey_sharedKey_,
    ccKey_ref_ = _ccContext.default.ccKey_ref_,
    ccKey_option_ = _ccContext.default.ccKey_option_,
    globalCcClassKeys = _ccContext.default.globalCcClassKeys,
    moduleName_ccClassKeys_ = _ccContext.default.moduleName_ccClassKeys_,
    ccClassKey_ccClassContext_ = _ccContext.default.ccClassKey_ccClassContext_;
var cl = color;
var ss = styleStr;
var me = makeError;
var vbi = verboseInfo;
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
  if (!state || !_util.default.isPlainJsonObject(state)) {
    return false;
  } else {
    return true;
  }
}

function extractStateByKeys(state, targetKeys) {
  if (!isStateValid(state)) {
    return {
      partialState: {},
      isStateEmpty: true
    };
  }

  var partialState = {};
  var isStateEmpty = true;
  targetKeys.forEach(function (key) {
    var value = state[key];

    if (_util.default.isValueNotNull(value)) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return {
    partialState: partialState,
    isStateEmpty: isStateEmpty
  };
}

function extractGlobalStateByKeys(targetModule, commitState, globalStateKeys, sharedToGlobalMapping, globalMappingKey_sharedKey_) {
  //all stateValue if belong to globalState will be collected to module_globalState_ , key means module name, stateKey mean globalMappingKey
  var module_globalState_ = {}; //all stateValue if belong to globalState will be collected to module_originalState_, key means module name, stateKey mean sharedKey

  var module_originalState_ = {}; //all stateValue if belong to globalState will be collected to partialGlobalState

  var partialGlobalState = {};

  if (!isStateValid(commitState) || globalStateKeys.length === 0) {
    return {
      partialGlobalState: partialGlobalState,
      isPartialGlobalStateEmpty: true,
      module_globalState_: module_globalState_
    };
  }

  var isPartialGlobalStateEmpty = true;
  globalStateKeys.forEach(function (gKey) {
    if (commitState.hasOwnProperty(gKey)) {
      isPartialGlobalStateEmpty = false;
      var stateValue = commitState[gKey];
      partialGlobalState[gKey] = stateValue;
      var sharedKeyDescriptor = globalMappingKey_sharedKey_[gKey];

      if (sharedKeyDescriptor) {
        //this global key is mapping to some module's state key
        var module = sharedKeyDescriptor.module,
            key = sharedKeyDescriptor.key;
        var tmpModuleGlobalState = module_originalState_[module];

        if (!tmpModuleGlobalState) {
          tmpModuleGlobalState = module_originalState_[module] = {};
        }

        tmpModuleGlobalState[key] = commitState[gKey];
      }
    }
  });
  /*
    in case of commitState of targetModule including globalMappingState, check it with sharedToGlobalMapping
  */

  var mappingOfThisModule = sharedToGlobalMapping[targetModule];

  if (mappingOfThisModule) {
    var originalSharedKeys = Object.keys(mappingOfThisModule);
    originalSharedKeys.forEach(function (originalSharedKey) {
      if (commitState.hasOwnProperty(originalSharedKey)) {
        var globalMappingKey = mappingOfThisModule[originalSharedKey];
        var stateValue = commitState[originalSharedKey];
        isPartialGlobalStateEmpty = false;
        partialGlobalState[globalMappingKey] = stateValue; //collect this stateValue to partialGlobalState

        var targetModuleGlobalState = module_globalState_[targetModule];

        if (!targetModuleGlobalState) {
          targetModuleGlobalState = module_globalState_[targetModule] = {};
        }

        targetModuleGlobalState[globalMappingKey] = stateValue;
      }
    });
  }

  return {
    partialGlobalState: partialGlobalState,
    isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
    module_globalState_: module_globalState_,
    module_originalState_: module_originalState_
  };
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

  if (!_ccContext.default.isModuleMode) {
    if (module !== _constant.MODULE_DEFAULT) {
      handleError(me(_constant.ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi("module:" + module)), throwError);
      return false;
    } else return true;
  } else {
    if (module === _constant.MODULE_GLOBAL) {
      handleError(me(_constant.ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
      return false;
    }

    if (!_state[module]) {
      handleError(me(_constant.ERR.CC_CLASS_STORE_MODULE_INVALID, vbi("module:" + module + " is not configured in cc's store")), throwError);
      return false;
    } else return true;
  }
}

function checkReducerModule(reducerModule, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (!_ccContext.default.isModuleMode) {
    if (reducerModule != _constant.MODULE_DEFAULT) {
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
    console.log(ss(ccUniqueKey + " unset ref"), cl('red'));
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
} // any error in this function will not been throwed, cc just warning, 


function isInputModuleInvalid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(_constant.ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
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
      ccUniqueKey = _util.default.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      ccUniqueKey = ccClassKey + "/" + (0, _uuid.default)();
      isCcUniqueKeyAutoGenerated = true;
    }
  }

  return {
    ccUniqueKey: ccUniqueKey,
    isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated
  };
}

function checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys) {
  var _verifyKeys = verifyKeys(sharedStateKeys, globalStateKeys),
      duplicate = _verifyKeys.duplicate,
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  if (keyElementNotString) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey));
  }

  if (duplicate) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey + " globalStateKeys:" + globalStateKeys + " sharedStateKeys:" + sharedStateKeys));
  }
}

function extractStateToBeBroadcasted(module, sourceState, sharedToGlobalMapping, globalMappingKey_sharedKey_, sharedStateKeys, globalStateKeys) {
  var partialSharedState = {};
  var isPartialSharedStateEmpty = true;

  if (sharedStateKeys.length > 0) {
    var _extractStateByKeys = extractStateByKeys(sourceState, sharedStateKeys),
        partialState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    if (!isStateEmpty) {
      _ccContext.default.store.setState(module, partialState);

      isPartialSharedStateEmpty = isStateEmpty;
      partialSharedState = partialState;
    }
  }

  var _extractGlobalStateBy = extractGlobalStateByKeys(module, sourceState, globalStateKeys, sharedToGlobalMapping, globalMappingKey_sharedKey_),
      partialGlobalState = _extractGlobalStateBy.partialGlobalState,
      isPartialGlobalStateEmpty = _extractGlobalStateBy.isPartialGlobalStateEmpty,
      module_globalState_ = _extractGlobalStateBy.module_globalState_,
      module_originalState_ = _extractGlobalStateBy.module_originalState_;

  if (!isPartialGlobalStateEmpty) {
    _ccContext.default.store.setGlobalState(partialGlobalState);
  }

  return {
    isPartialSharedStateEmpty: isPartialSharedStateEmpty,
    partialSharedState: partialSharedState,
    isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
    partialGlobalState: partialGlobalState,
    module_globalState_: module_globalState_,
    module_originalState_: module_originalState_
  };
}
/*
options.module = 'xxx'
options.sharedStateKeys = ['aa', 'bbb']
*/


function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$isSingle = _ref.isSingle,
      isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
      _ref$asyncLifeCycleHo = _ref.asyncLifeCycleHook,
      asyncLifeCycleHook = _ref$asyncLifeCycleHo === void 0 ? false : _ref$asyncLifeCycleHo,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
      reducerModule = _ref.reducerModule,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      sharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys,
      _ref$globalStateKeys = _ref.globalStateKeys,
      globalStateKeys = _ref$globalStateKeys === void 0 ? [] : _ref$globalStateKeys;

  var _asyncLifeCycleHook = asyncLifeCycleHook;

  var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


  checkStoreModule(module);
  checkReducerModule(_reducerModule);
  checkSharedKeysAndGlobalKeys(ccClassKey, sharedStateKeys, globalStateKeys); //tell cc this ccClass is watching some globalStateKeys of global module

  if (globalStateKeys.length > 0) _ccContext.default.globalCcClassKeys.push(ccClassKey);
  var contextMap = _ccContext.default.ccClassKey_ccClassContext_;

  if (contextMap[ccClassKey] !== undefined) {
    throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  } else {
    //tell cc this ccClass is watching some sharedStateKeys of a module
    contextMap[ccClassKey] = _util.default.makeCcClassContext(module, sharedStateKeys, globalStateKeys);
  }

  var ccClassKeys_ = moduleName_ccClassKeys_[module];
  if (!ccClassKeys_) ccClassKeys_ = moduleName_ccClassKeys_[module] = [];
  ccClassKeys_.push(ccClassKey);
  return function (ReactClass) {
    var CcClass =
    /*#__PURE__*/
    function (_ReactClass) {
      (0, _inheritsLoose2.default)(CcClass, _ReactClass);

      function CcClass(props, context) {
        var _this;

        _this = _ReactClass.call(this, props, context) || this;
        if (!_this.state) _this.state = {};
        var ccKey = props.ccKey,
            _props$ccOption = props.ccOption,
            ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;

        _util.default.bindThis((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), ['__$$bindDataToCcClassContext', '__$$mapCcToInstance', '$$getChangeStateHandler', '$$changeState', '__$$recoverState']);

        if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];
        if (ccOption.syncState === undefined) ccOption.syncState = true;
        if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
        if (ccOption.asyncLifeCycleHook === undefined) ccOption.asyncLifeCycleHook = _asyncLifeCycleHook;
        var asyncLifeCycleHook = ccOption.asyncLifeCycleHook,
            storedStateKeys = ccOption.storedStateKeys;

        var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
            ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
            isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

        var ccClassContext = _this.__$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption);

        _this.__$$mapCcToInstance(isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, module, _reducerModule, sharedStateKeys, globalStateKeys);

        _this.__$$recoverState();

        return _this;
      } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


      var _proto = CcClass.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      };

      _proto.__$$recoverState = function __$$recoverState() {
        var _this$cc$ccState = this.cc.ccState,
            currentModule = _this$cc$ccState.module,
            globalStateKeys = _this$cc$ccState.globalStateKeys,
            sharedStateKeys = _this$cc$ccState.sharedStateKeys,
            ccOption = _this$cc$ccState.ccOption,
            ccUniqueKey = _this$cc$ccState.ccUniqueKey;
        var refState = refStore._state[ccUniqueKey] || {};
        var sharedState = _state[currentModule];
        var globalState = _state[_constant.MODULE_GLOBAL];
        var syncState = ccOption.syncState,
            syncGlobalState = ccOption.syncGlobalState;
        var partialSharedState = {},
            partialGlobalState = {};

        if (syncState) {
          var _extractStateByKeys2 = extractStateByKeys(sharedState, sharedStateKeys),
              partialState = _extractStateByKeys2.partialState;

          partialSharedState = partialState;
        }

        if (syncGlobalState) {
          var _extractStateByKeys3 = extractStateByKeys(globalState, globalStateKeys),
              _partialState = _extractStateByKeys3.partialState;

          partialGlobalState = _partialState;
        }

        var selfState = this.state;
        this.state = (0, _extends2.default)({}, selfState, refState, partialSharedState, partialGlobalState);
      };

      _proto.__$$bindDataToCcClassContext = function __$$bindDataToCcClassContext(isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
        var classContext = contextMap[ccClassKey];
        var ccKeys = classContext.ccKeys;

        if (_ccContext.default.isDebug) {
          console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
        }

        if (!_util.default.isCcOptionValid(ccOption)) {
          throw me(_constant.ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi("a standard default ccOption may like: {\"syncState\": true, \"asyncLifeCycleHook\":false, \"storedStateKeys\": []}"));
        }

        if (ccKeys.includes(ccUniqueKey)) {
          if (_util.default.isHotReloadMode()) {
            var insCount = getCcKeyInsCount(ccUniqueKey);
            if (isSingle && insCount > 1) throw me(_constant.ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

            if (insCount > 2) {
              // now cc can make sure the ccKey duplicate
              throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
            } // just warning


            console.error("found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually");
            console.error(vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey)); // in webpack hot reload mode, cc works not very well,
            // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
            // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
            // so cc set ref later

            setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption, 600);
          } else {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
          }
        } else {
          setCcInstanceRef(ccUniqueKey, this, ccKeys, ccOption);
        }

        return classContext;
      };

      _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifeCycleHook, ccClassKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, reducerModule, sharedStateKeys, globalStateKeys) {
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
          sharedStateKeys: sharedStateKeys,
          globalStateKeys: globalStateKeys
        };

        var _verifyKeys2 = verifyKeys(sharedStateKeys, storedStateKeys),
            duplicate = _verifyKeys2.duplicate,
            notArray = _verifyKeys2.notArray,
            keyElementNotString = _verifyKeys2.keyElementNotString;

        if (notArray) {
          throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
        }

        if (keyElementNotString) {
          throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
        }

        if (duplicate) {
          throw me(_constant.ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
        }

        if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
          throw me(_constant.ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey));
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
              var _extractStateByKeys4 = extractStateByKeys(state, storedStateKeys),
                  partialState = _extractStateByKeys4.partialState,
                  isStateEmpty = _extractStateByKeys4.isStateEmpty;

              if (!isStateEmpty) {
                refStore.setState(ccUniqueKey, partialState);
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
          prepareBroadcastState: function prepareBroadcastState(triggerType, moduleName, originalState, needClone) {
            var _this2$cc$ccState = _this2.cc.ccState,
                sharedStateKeys = _this2$cc$ccState.sharedStateKeys,
                globalStateKeys = _this2$cc$ccState.globalStateKeys;
            var sharedToGlobalMapping = _ccContext.default.sharedToGlobalMapping;

            var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, originalState, sharedToGlobalMapping, globalMappingKey_sharedKey_, sharedStateKeys, globalStateKeys),
                isPartialSharedStateEmpty = _extractStateToBeBroa.isPartialSharedStateEmpty,
                isPartialGlobalStateEmpty = _extractStateToBeBroa.isPartialGlobalStateEmpty,
                partialSharedState = _extractStateToBeBroa.partialSharedState,
                partialGlobalState = _extractStateToBeBroa.partialGlobalState,
                module_globalState_ = _extractStateToBeBroa.module_globalState_,
                module_originalState_ = _extractStateToBeBroa.module_originalState_;

            if (!isPartialSharedStateEmpty || !isPartialGlobalStateEmpty) {
              if (_this2.$$beforeBroadcastState) {
                //user define life cycle hook $$beforeBroadcastState
                if (asyncLifeCycleHook) {
                  _this2.$$beforeBroadcastState({
                    triggerType: triggerType
                  }, function () {
                    _this2.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                  });
                } else {
                  _this2.$$beforeBroadcastState({
                    triggerType: triggerType
                  });

                  _this2.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
                }
              } else {
                _this2.cc.broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone);
              }
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
          setGlobalState: function setGlobalState(partialGlobalState, changeWay) {
            if (changeWay === void 0) {
              changeWay = _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
            }

            // this.cc.prepareBroadcastState(changeWay, module, null, partialGlobalState, false, false);
            _ccContext.default.store.setGlobalState(partialGlobalState);

            _this2.$$changeState(partialGlobalState, {
              module: currentModule,
              changeWay: changeWay
            });
          },
          forceUpdate: function forceUpdate(cb) {
            _this2.$$changeState(_this2.state, {
              module: currentModule,
              cb: cb
            });
          },
          // always change self module's state
          invoke: function invoke(userLogicFn) {
            var _this2$cc;

            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            (_this2$cc = _this2.cc).invokeWith.apply(_this2$cc, [userLogicFn, {
              module: currentModule
            }].concat(args));
          },
          // change other module's state
          effect: function effect(targetModule, userLogicFn) {
            var _this2$cc2;

            //
            var excludeTriggerRef = currentModule == targetModule;

            for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            (_this2$cc2 = _this2.cc).invokeWith.apply(_this2$cc2, [userLogicFn, {
              module: targetModule,
              context: false
            }].concat(args));
          },
          // change other module's state, cc will give userLogicFn first param = module context
          effectCtx: function effectCtx(targetModule, userLogicFn) {
            var _this2$cc3;

            for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
              args[_key3 - 2] = arguments[_key3];
            }

            (_this2$cc3 = _this2.cc).invokeWith.apply(_this2$cc3, [userLogicFn, {
              context: true,
              module: targetModule
            }].concat(args));
          },
          invokeWith: function invokeWith(userLogicFn, _temp2) {
            var _ref2 = _temp2 === void 0 ? {} : _temp2,
                _ref2$module = _ref2.module,
                module = _ref2$module === void 0 ? currentModule : _ref2$module,
                _ref2$context = _ref2.context,
                context = _ref2$context === void 0 ? false : _ref2$context,
                _ref2$forceSync = _ref2.forceSync,
                forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                cb = _ref2.cb;

            for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
              args[_key4 - 2] = arguments[_key4];
            }

            isInputModuleInvalid(module, currentModule, cb, function (newCb) {
              if (context) args.unshift({
                module: module,
                state: getState(module),
                effect: _this2.$$effect,
                effectCtx: _this2.$$effectCtx
              });

              _co.default.wrap(userLogicFn).apply(void 0, args).then(function (state) {
                _this2.$$changeState(state, {
                  excludeTriggerRef: false,
                  module: module,
                  forceSync: forceSync,
                  cb: newCb
                });
              }).catch(justWarning);
            });
          },
          call: function call(userLogicFn) {
            var _this2$cc4;

            for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
              args[_key5 - 1] = arguments[_key5];
            }

            (_this2$cc4 = _this2.cc).callWith.apply(_this2$cc4, [userLogicFn, {
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

            for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
              args[_key6 - 2] = arguments[_key6];
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
            var _this2$cc5;

            for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
              args[_key7 - 1] = arguments[_key7];
            }

            (_this2$cc5 = _this2.cc).callThunkWith.apply(_this2$cc5, [userLogicFn, {
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

            for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
              args[_key8 - 2] = arguments[_key8];
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
            var _this2$cc6;

            for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
              args[_key9 - 1] = arguments[_key9];
            }

            (_this2$cc6 = _this2.cc).commitWith.apply(_this2$cc6, [userLogicFn, {
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

            for (var _len10 = arguments.length, args = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
              args[_key10 - 2] = arguments[_key10];
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

            var errMsg = _util.default.isCcActionValid({
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
          broadcastState: function broadcastState(moduleName, partialSharedState, partialGlobalState, module_globalState_, module_originalState_, needClone, excludeTriggerRef) {
            if (excludeTriggerRef === void 0) {
              excludeTriggerRef = true;
            }

            var _partialSharedState = partialSharedState;
            if (needClone) _partialSharedState = _util.default.clone(partialSharedState); // this clone may cause performance issue, if partialSharedState is too big!!

            _ccContext.default.store.setState(moduleName, _partialSharedState);

            var currentCcKey = _this2.cc.ccState.ccUniqueKey;
            var ccClassKey_isHandled_ = {}; //record which ccClassKey has been handled

            var ccClassKeys = moduleName_ccClassKeys_[moduleName];

            if (ccClassKeys) {
              //these ccClass subscribe the same module's state
              ccClassKeys.forEach(function (ccClassKey) {
                ccClassKey_isHandled_[ccClassKey] = true;
                var classContext = ccClassKey_ccClassContext_[ccClassKey];
                var ccKeys = classContext.ccKeys,
                    sharedStateKeys = classContext.sharedStateKeys,
                    globalStateKeys = classContext.globalStateKeys;
                if (ccKeys.length === 0) return;
                if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return; // extract _partialSharedState! because different class with a same module may have different sharedStateKeys!!!

                var _extractStateByKeys5 = extractStateByKeys(_partialSharedState, sharedStateKeys),
                    sharedStateForCurrentCcClass = _extractStateByKeys5.partialState,
                    isSharedStateEmpty = _extractStateByKeys5.isStateEmpty; // extract sourcePartialGlobalState! because different class watch different globalStateKeys.
                // it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                // just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                var _extractStateByKeys6 = extractStateByKeys(partialGlobalState, globalStateKeys),
                    globalStateForCurrentCcClass = _extractStateByKeys6.partialState,
                    isPartialGlobalStateEmpty = _extractStateByKeys6.isStateEmpty;

                if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;
                var mergedStateForCurrentCcClass = (0, _extends2.default)({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);
                ccKeys.forEach(function (ccKey) {
                  // if (excludeTriggerRef && ccKey === currentCcKey) return;
                  var ref = ccKey_ref_[ccKey];

                  if (ref) {
                    var option = ccKey_option_[ccKey];
                    var toSet = null,
                        changeWay = -1;

                    if (option.syncState && option.syncGlobalState) {
                      changeWay = _constant.SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE;
                      toSet = mergedStateForCurrentCcClass;
                    } else if (option.syncState) {
                      changeWay = _constant.SYNC_FROM_CC_INSTANCE_SHARED_STATE;
                      toSet = sharedStateForCurrentCcClass;
                    } else if (option.syncGlobalState) {
                      changeWay = _constant.SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE;
                      toSet = globalStateForCurrentCcClass;
                    }

                    if (toSet) {
                      if (_ccContext.default.isDebug) {
                        console.log(ss("ref " + ccKey + " render triggered by broadcast's way1"), cl());
                      }

                      ref.cc.prepareReactSetState(changeWay, toSet);
                    }

                    ;
                  }
                });
              });
            }

            if (partialGlobalState) {
              //these ccClass are watching globalState
              globalCcClassKeys.forEach(function (ccClassKey) {
                if (ccClassKey_isHandled_[ccClassKey]) return;
                var classContext = ccClassKey_ccClassContext_[ccClassKey];
                var watchingGlobalStateCcKeys = classContext.ccKeys,
                    globalStateKeys = classContext.globalStateKeys,
                    currentCcClassModule = classContext.module; // if there is no any ccInstance of this ccClass are watching globalStateKey, return;

                if (watchingGlobalStateCcKeys.length === 0) return;
                var originalStateOfMappingState = module_originalState_[currentCcClassModule];

                if (originalStateOfMappingState) {
                  _ccContext.default.store.setState(currentCcClassModule, originalStateOfMappingState);
                }

                var _extractStateByKeys7 = extractStateByKeys(partialGlobalState, globalStateKeys),
                    globalStateForCurrentCcClass = _extractStateByKeys7.partialState,
                    isPartialGlobalStateEmpty = _extractStateByKeys7.isStateEmpty;

                var mappedGlobalStateForCurrentCcClass = module_globalState_[currentCcClassModule]; //!!! backup state for current module

                _ccContext.default.store.setGlobalState(mappedGlobalStateForCurrentCcClass);

                if (isPartialGlobalStateEmpty && !mappedGlobalStateForCurrentCcClass && !originalStateOfMappingState) return;
                var toSet = (0, _extends2.default)({}, globalStateForCurrentCcClass, mappedGlobalStateForCurrentCcClass, originalStateOfMappingState);
                watchingGlobalStateCcKeys.forEach(function (ccKey) {
                  // if (excludeTriggerRef && ccKey === currentCcKey) return;
                  var ref = ccKey_ref_[ccKey];

                  if (ref) {
                    if (_ccContext.default.isDebug) {
                      console.log(ss("ref " + ccKey + " render triggered by broadcast's way2"), cl());
                    }

                    ref.cc.prepareReactSetState(_constant.SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE, toSet);
                  }
                });
              });
            }
          }
        };
        this.cc.reactSetState = this.cc.reactSetState.bind(this);
        this.cc.prepareReactSetState = this.cc.prepareReactSetState.bind(this);
        this.cc.forceUpdate = this.cc.forceUpdate.bind(this);
        this.cc.prepareBroadcastState = this.cc.prepareBroadcastState.bind(this);
        this.$$dispatch = this.cc.dispatch.bind(this);
        ; //let CCComponent instance can call dispatch directly

        this.$$invoke = this.cc.invoke.bind(this);
        ; //commit state to cc directly, but userFn can be promise or generator both!

        this.$$invokeWith = this.cc.invokeWith.bind(this);
        ;
        this.$$call = this.cc.call.bind(this);
        ; // commit state by setState handler

        this.$$callWith = this.cc.callWith.bind(this);
        ;
        this.$$callThunk = this.cc.callThunk.bind(this);
        ; // commit state by setState handler

        this.$$callThunkWith = this.cc.callThunkWith.bind(this);
        ;
        this.$$commit = this.cc.commit.bind(this);
        ; // commit state to cc directly, userFn can only be normal function

        this.$$commitWith = this.cc.commitWith.bind(this);
        ;
        this.$$effect = this.cc.effect.bind(this);
        ; // commit state to cc directly, userFn can only be normal function

        this.$$effectCtx = this.cc.effectCtx.bind(this);
        ;
        this.setState = this.cc.setState; //let setState call cc.setState

        this.setGlobalState = this.cc.setGlobalState; //let setState call cc.setState

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
            changeWay = _ref8.changeWay,
            forceSync = _ref8.forceSync,
            reactCallback = _ref8.cb;

        //executionContext
        var ccState = this.cc.ccState;
        var currentModule = ccState.module;

        if (module === currentModule) {
          // who trigger $$changeState, who will go to change the whole received state 
          this.cc.prepareReactSetState(changeWay || _constant.CHANGE_BY_SELF, state, function () {
            //if forceSync=true, cc clone the input state
            if (forceSync) {
              _this3.cc.prepareBroadcastState(changeWay || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, forceSync);
            } else if (ccState.ccOption.syncState) {
              _this3.cc.prepareBroadcastState(changeWay || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, false);
            } else {// stop broadcast state!
            }
          }, reactCallback);
        } else {
          if (forceSync) justWarning("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi("module:" + module + " currentModule" + currentModule));
          this.cc.prepareBroadcastState(changeWay || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD, module, state, true);
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
        if (_ccContext.default.isDebug) {
          console.log(ss("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
        }

        return _ReactClass.prototype.render.call(this);
      };

      return CcClass;
    }(ReactClass);

    CcClass.displayName = ccClassDisplayName(ccClassKey);
    return CcClass;
  };
}