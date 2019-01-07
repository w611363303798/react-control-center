"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var helper = _interopRequireWildcard(require("./helper"));

var _constant = require("../support/constant");

var _util = require("../support/util");

/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {String} module
 * @param {Object} state
 * @param {Option？} [option] reducer、init、sharedToGlobalMapping
 * @param {Option？} [option.reducer]  you can define multi reducer for a module by specify a reducer
 * @param {Option？} [option.moduleReducer]  if you specify moduleReducer for module, 
 * the reducer's module name is equal to statue module name, and the reducer will be ignored automatically
 */
function _default(module, state, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      singleClass = _ref.singleClass,
      moduleReducer = _ref.moduleReducer,
      reducer = _ref.reducer,
      init = _ref.init,
      globalState = _ref.globalState,
      sharedToGlobalMapping = _ref.sharedToGlobalMapping;

  if (!_ccContext.default.isCcAlreadyStartup) {
    throw new Error('cc is not startup yet, you can not call cc.configure!');
  }

  if (!_ccContext.default.isModuleMode) {
    throw new Error('cc is running in non module node, can not call cc.configure');
  }

  helper.checkModuleName(module);
  helper.checkModuleState(state);
  var _state = _ccContext.default.store._state;
  var _reducer = _ccContext.default.reducer._reducer;

  if (_state[module]) {
    throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NAME_DUPLICATE, (0, _util.verboseInfo)("moduleName " + module));
  }

  _state[module] = state;

  if (singleClass === true) {
    _ccContext.default.moduleSingleClass[module] = true;
  }

  if (moduleReducer) {
    if (typeof moduleReducer !== 'function') {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("moduleName " + module + " 's moduleReducer is invalid"));
    }

    _reducer[module] = moduleReducer;
  } else if (reducer) {
    if (!(0, _util.isPlainJsonObject)(reducer)) {
      throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("moduleName " + module + " 's moduleReducer is invalid"));
    }

    var reducerModuleNames = Object.keys(reducer);
    reducerModuleNames.forEach(function (rmName) {
      helper.checkModuleName(rmName);
      var moduleReducer = reducer[rmName];

      if (!(0, _util.isPlainJsonObject)(moduleReducer)) {
        throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("moduleName " + module + " reducer 's value  is invalid"));
      }

      if (rmName == _constant.MODULE_GLOBAL) {
        //merge input globalReducer to existed globalReducer
        var typesOfGlobal = Object.keys(moduleReducer);
        var globalReducer = _reducer[_constant.MODULE_GLOBAL];
        typesOfGlobal.forEach(function (type) {
          if (globalReducer[type]) {
            throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, (0, _util.verboseInfo)("type " + type));
          }

          var reducerFn = moduleReducer[type];

          if (typeof reducerFn !== 'function') {
            throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_NOT_A_FUNCTION);
          }

          globalReducer[type] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  var storedGlobalState = _state[_constant.MODULE_GLOBAL];

  if (globalState) {
    helper.checkModuleState(globalState);
    var globalStateKeys = Object.keys(globalState);
    globalStateKeys.forEach(function (gKey) {
      if (storedGlobalState[gKey]) {
        throw (0, _util.makeError)(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE, (0, _util.verboseInfo)("duplicate globalKey: " + gKey));
      }

      var stateValue = globalState[gKey];
      storedGlobalState[gKey] = stateValue;
    });
  }

  if (sharedToGlobalMapping) {
    helper.handleModuleSharedToGlobalMapping(module, sharedToGlobalMapping);
  }

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }

    init(helper.getStateHandlerForInit(module));
  }
}