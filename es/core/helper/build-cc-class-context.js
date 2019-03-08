import ccContext from '../../cc-context';
import { ERR } from '../../support/constant';
import util from '../../support/util';
import _setPropState from './set-prop-state';
var me = util.makeError,
    vbi = util.verboseInfo,
    throwCcHmrError = util.throwCcHmrError;

function _throwPropDuplicateError(prefixedKey, module) {
  throw me("cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error", vbi("the prefixedKey is " + prefixedKey + ", module is:" + module));
}

function _getPropKeyPair(isPropStateModuleMode, module, propKey) {
  if (isPropStateModuleMode === true) {
    return {
      moduledPropKey: module + "/" + propKey,
      originalPropKey: propKey
    };
  } else {
    return {
      moduledPropKey: propKey,
      originalPropKey: propKey
    };
  }
}

export default function (ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode, forCcFragment) {
  if (forCcFragment === void 0) {
    forCcFragment = false;
  }

  var contextMap = ccContext.ccClassKey_ccClassContext_;
  var ccClassContext = contextMap[ccClassKey];

  if (forCcFragment === true) {
    //if this is called fro CcFragment, just reuse  ccClassContext;
    if (ccClassContext === undefined) {
      ccClassContext = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }
  } else {
    if (ccClassContext !== undefined) {
      throwCcHmrError(me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
    }

    ccClassContext = util.makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
  }

  var _state = ccContext.store._state;
  var propModuleName_ccClassKeys_ = ccContext.propModuleName_ccClassKeys_;

  if (stateToPropMapping != undefined) {
    var propKey_stateKeyDescriptor_ = ccClassContext.propKey_stateKeyDescriptor_;
    var stateKey_propKeyDescriptor_ = ccClassContext.stateKey_propKeyDescriptor_;
    var propState = ccClassContext.propState;

    if (typeof stateToPropMapping !== 'object') {
      throw me(ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey);
    }

    var module_mapAllStateToProp_ = {};
    var module_sharedKey_ = {};
    var module_prefixedKeys_ = {};
    var prefixedKeys = Object.keys(stateToPropMapping);
    var len = prefixedKeys.length;

    for (var i = 0; i < len; i++) {
      var prefixedKey = prefixedKeys[i];

      if (!util.isPrefixedKeyValid(prefixedKey)) {
        throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey + ", key:" + prefixedKey);
      }

      var _prefixedKey$split = prefixedKey.split('/'),
          targetModule = _prefixedKey$split[0],
          targetKey = _prefixedKey$split[1];

      if (module_mapAllStateToProp_[targetModule] === true) {// ignore other keys...
      } else {
        if (targetKey === '*') {
          module_mapAllStateToProp_[targetModule] = true;
          module_sharedKey_[targetModule] = prefixedKey;
        } else {
          var modulePrefixedKeys = util.safeGetArrayFromObject(module_prefixedKeys_, targetModule);
          modulePrefixedKeys.push(prefixedKey);
          module_mapAllStateToProp_[targetModule] = false;
        }
      }
    }

    var targetModules = Object.keys(module_mapAllStateToProp_);
    var propKey_appeared_ = {}; //help cc to judge propKey is duplicated or not

    targetModules.forEach(function (module) {
      var moduleState = _state[module];

      if (moduleState === undefined) {
        throw me(ERR.CC_MODULE_NOT_FOUND, vbi("module:" + module + ", check your stateToPropMapping config!"));
      }

      var isPropStateSet = false;

      if (module_mapAllStateToProp_[module] === true) {
        var moduleStateKeys = Object.keys(moduleState);
        moduleStateKeys.forEach(function (msKey) {
          // now prop key equal state key if user declare key like m1/* in stateToPropMapping;
          var _getPropKeyPair2 = _getPropKeyPair(isPropStateModuleMode, module, msKey),
              moduledPropKey = _getPropKeyPair2.moduledPropKey,
              originalPropKey = _getPropKeyPair2.originalPropKey;

          var appeared = propKey_appeared_[moduledPropKey];

          if (appeared === true) {
            _throwPropDuplicateError(module_sharedKey_[module], module);
          } else {
            propKey_appeared_[moduledPropKey] = true; // moduledPropKey and moduledStateKey is equal

            propKey_stateKeyDescriptor_[moduledPropKey] = {
              module: module,
              originalStateKey: msKey,
              moduledStateKey: moduledPropKey
            };
            stateKey_propKeyDescriptor_[moduledPropKey] = {
              module: module,
              moduledPropKey: moduledPropKey,
              originalPropKey: originalPropKey
            };

            _setPropState(propState, msKey, moduleState[msKey], isPropStateModuleMode, module);

            isPropStateSet = true;
          }
        });
      } else {
        var _prefixedKeys = module_prefixedKeys_[module];

        _prefixedKeys.forEach(function (prefixedKey) {
          var _prefixedKey$split2 = prefixedKey.split('/'),
              stateModule = _prefixedKey$split2[0],
              stateKey = _prefixedKey$split2[1];

          var propKey = stateToPropMapping[prefixedKey];

          var _getPropKeyPair3 = _getPropKeyPair(isPropStateModuleMode, module, propKey),
              moduledPropKey = _getPropKeyPair3.moduledPropKey,
              originalPropKey = _getPropKeyPair3.originalPropKey;

          var appeared = propKey_appeared_[moduledPropKey];

          if (appeared === true) {
            _throwPropDuplicateError(prefixedKey, module);
          } else {
            propKey_appeared_[moduledPropKey] = true;
            var moduledStateKey = module + "/" + stateKey; // stateKey_propKeyDescriptor_ map's key must be moduledStateKey like 'foo/key', cause different module may include the same state key

            propKey_stateKeyDescriptor_[moduledPropKey] = {
              module: stateModule,
              originalStateKey: stateKey,
              moduledStateKey: moduledStateKey
            };
            stateKey_propKeyDescriptor_[moduledStateKey] = {
              module: stateModule,
              moduledPropKey: moduledPropKey,
              originalPropKey: originalPropKey,
              originalStateKey: stateKey
            };

            _setPropState(propState, propKey, moduleState[stateKey], isPropStateModuleMode, module);

            isPropStateSet = true;
          }
        });
      }

      if (isPropStateSet === true) {
        var pCcClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
        if (!pCcClassKeys.includes(ccClassKey)) pCcClassKeys.push(ccClassKey);
      }
    });
    ccClassContext.stateToPropMapping = stateToPropMapping;
    ccClassContext.isPropStateModuleMode = isPropStateModuleMode;
  }

  contextMap[ccClassKey] = ccClassContext;
}