import ccContext from '../cc-context';
import * as helper from './helper';
import { ERR, MODULE_GLOBAL } from '../support/constant';
import { makeError, verboseInfo, isPlainJsonObject } from '../support/util';
var ccGlobalStateKeys = ccContext.globalStateKeys;
/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {String} module
 * @param {Object} state
 * @param {Object} [option] reducer、init、sharedToGlobalMapping
 * @param {Object} [option.reducer]  you can define multi reducer for a module by specify a reducer
 * @param {Object} [option.moduleReducer]  if you specify moduleReducer and reducer at the same time, the reducer will be ignored!
 * cc will give state module name as moduleReducer key
 * @param {Object} [option.init]
 * @param {Object} [option.globalState]  this globalState will been merged to $$global module state
 * @param {Object} [option.sharedToGlobalMapping]
 * @param {Object} [option.middlewares]
 */

export default function (module, state, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      singleClass = _ref.singleClass,
      moduleReducer = _ref.moduleReducer,
      reducer = _ref.reducer,
      init = _ref.init,
      globalState = _ref.globalState,
      sharedToGlobalMapping = _ref.sharedToGlobalMapping,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares;

  if (!ccContext.isCcAlreadyStartup) {
    throw new Error('cc is not startup yet, you can not call cc.configure!');
  }

  if (!ccContext.isModuleMode) {
    throw new Error('cc is running in non module node, can not call cc.configure');
  }

  helper.checkModuleName(module);
  helper.checkModuleState(state, module);
  var _state = ccContext.store._state;
  var _reducer = ccContext.reducer._reducer;

  if (_state[module]) {
    throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo("moduleName " + module));
  }

  _state[module] = state;

  if (singleClass === true) {
    ccContext.moduleSingleClass[module] = true;
  }

  if (moduleReducer) {
    if (!isPlainJsonObject(moduleReducer)) {
      throw makeError(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " 's moduleReducer is invalid"));
    }

    _reducer[module] = moduleReducer;
  } else if (reducer) {
    if (!isPlainJsonObject(reducer)) {
      throw makeError(ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " 's moduleReducer is invalid"));
    }

    var reducerModuleNames = Object.keys(reducer);
    reducerModuleNames.forEach(function (rmName) {
      helper.checkModuleName(rmName);
      var moduleReducer = reducer[rmName];

      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " reducer 's value  is invalid"));
      }

      if (rmName == MODULE_GLOBAL) {
        //merge input globalReducer to existed globalReducer
        var typesOfGlobal = Object.keys(moduleReducer);
        var globalReducer = _reducer[MODULE_GLOBAL];
        typesOfGlobal.forEach(function (type) {
          if (globalReducer[type]) {
            throw makeError(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo("type " + type));
          }

          var reducerFn = moduleReducer[type];

          if (typeof reducerFn !== 'function') {
            throw makeError(ERR.CC_REDUCER_NOT_A_FUNCTION);
          }

          globalReducer[type] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  var storedGlobalState = _state[MODULE_GLOBAL];

  if (globalState) {
    helper.checkModuleState(globalState, MODULE_GLOBAL);
    var globalStateKeys = Object.keys(globalState);
    globalStateKeys.forEach(function (gKey) {
      if (storedGlobalState[gKey]) {
        throw makeError(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE, verboseInfo("duplicate globalKey: " + gKey));
      }

      var stateValue = globalState[gKey];
      storedGlobalState[gKey] = stateValue;
      ccGlobalStateKeys.push(gKey);
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

  if (middlewares.length > 0) {
    var ccMiddlewares = ccContext.middlewares;
    middlewares.forEach(function (m) {
      return ccMiddlewares.push(m);
    });
  }
}