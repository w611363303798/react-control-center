"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var _util = _interopRequireDefault(require("../../support/util"));

function _default(moduleName, sharedKey, globalMappingKey) {
  var _state = _ccContext.default.store._state;
  var globalMappingKey_sharedKey_ = _ccContext.default.globalMappingKey_sharedKey_;
  var globalMappingKey_toModules_ = _ccContext.default.globalMappingKey_toModules_;
  var globalMappingKey_fromModule_ = _ccContext.default.globalMappingKey_fromModule_;
  var globalStateKeys = _ccContext.default.globalStateKeys;
  var globalState = _state[_constant.MODULE_GLOBAL];
  var moduleState = _state[moduleName];

  if (!moduleState.hasOwnProperty(sharedKey)) {
    throw new Error("the module:" + moduleName + " doesn't have a key named " + sharedKey + ", check your sharedToGlobalMapping or your module state");
  }

  if (globalState.hasOwnProperty(globalMappingKey)) {
    throw new Error("the key:" + globalMappingKey + " has been declared already in globalState, you can't use it to map the sharedStateKey:" + sharedKey + " to global state, try rename your mappingKey in sharedToGlobalMapping!");
  }

  globalStateKeys.push(globalMappingKey);
  globalState[globalMappingKey] = moduleState[sharedKey];
  globalMappingKey_sharedKey_[globalMappingKey] = sharedKey;
  globalMappingKey_fromModule_[globalMappingKey] = moduleName;

  var mappingKeyModules = _util.default.safeGetArrayFromObject(globalMappingKey_toModules_, globalMappingKey);

  mappingKeyModules.push(moduleName);
}