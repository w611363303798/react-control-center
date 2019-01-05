"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

function _default(moduleName, sharedKey, globalMappingKey) {
  var _state = _ccContext.default.store._state;
  var globalMappingKey_sharedKey_ = _ccContext.default.globalMappingKey_sharedKey_;
  var globalStateKeys = _ccContext.default.globalStateKeys;
  var moduleName_sharedKeysWhichMapToGlobal_ = _ccContext.default.moduleName_sharedKeysWhichMapToGlobal_;
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
  globalMappingKey_sharedKey_[globalMappingKey] = {
    module: moduleName,
    key: sharedKey
  };
  var sharedKeysWhichMapToGlobal = moduleName_sharedKeysWhichMapToGlobal_[moduleName];

  if (!sharedKeysWhichMapToGlobal) {
    sharedKeysWhichMapToGlobal = moduleName_sharedKeysWhichMapToGlobal_[moduleName] = [];
  }

  sharedKeysWhichMapToGlobal.push(sharedKey);
}