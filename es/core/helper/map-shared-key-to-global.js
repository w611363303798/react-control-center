import ccContext from '../../cc-context';
import { MODULE_GLOBAL } from '../../support/constant';
export default function (moduleName, sharedKey, globalMappingKey) {
  var _state = ccContext.store._state;
  var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
  var globalStateKeys = ccContext.globalStateKeys;
  var moduleName_sharedKeysWhichMapToGlobal_ = ccContext.moduleName_sharedKeysWhichMapToGlobal_;
  var globalState = _state[MODULE_GLOBAL];
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