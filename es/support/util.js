import { ERR_MESSAGE, MODULE_GLOBAL, MODULE_CC } from './constant';
export function isHotReloadMode() {
  return window && window.webpackHotUpdate;
}
export function bindThis(_this, methods) {
  methods.forEach(function (method) {
    return _this[method] = _this[method].bind(_this);
  });
}
export function isValueNotNull(value) {
  return !(value === null || value === undefined);
}
export function isObjectNotNull(object) {
  if (object === null || object === undefined) {
    return false;
  } else if (Object.keys(object).length > 0) {
    return true;
  } else {
    return false;
  }
}
export function isPlainJsonObject(obj, canBeArray) {
  if (canBeArray === void 0) {
    canBeArray = false;
  }

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      if (canBeArray) return true;else return false;
    }

    return true;
  } else {
    return false;
  }
}
export function isPrefixedKeyValid(key) {
  var slashCount = key.split('').filter(function (v) {
    return v === '/';
  }).length;

  if (slashCount === 1) {
    return true;
  } else {
    return false;
  }
}
export function isActionTypeValid(type) {
  if (typeof type !== 'string') {
    return false;
  } else {
    if (type.length === 0) return false;else return true;
  }
}
export function makeError(code, extraMessage) {
  var message = ERR_MESSAGE[code] || '';
  if (extraMessage) message += extraMessage;
  if (!message) message = "undefined message for code:" + code;
  var error = new Error(message);
  error.code = code;
  return error;
}
export function makeCcClassContext(module, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys) {
  return {
    module: module,
    originalSharedStateKeys: originalSharedStateKeys,
    originalGlobalStateKeys: originalGlobalStateKeys,
    sharedStateKeys: sharedStateKeys,
    globalStateKeys: globalStateKeys,
    ccKeys: [],
    propState: {},
    propKey_stateKeyDescriptor_: {},
    stateKey_propKeyDescriptor_: {},
    stateToPropMapping: null
  };
}
export function makeStateMail(ccUniqueKey, ccOption, module, type, cb) {
  var mail = {};
  Object.defineProperty(mail, 'ccUniqueKey', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: ccUniqueKey
  });
  Object.defineProperty(mail, 'ccOption', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: ccOption
  });
  Object.defineProperty(mail, 'module', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: module
  });
  Object.defineProperty(mail, 'type', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: type
  });
  Object.defineProperty(mail, 'state', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {}
  });
  Object.defineProperty(mail, 'cb', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function value() {}
  });
  return mail;
} // !!! different ccClass enable own a same key

export function makeUniqueCcKey(ccClassKey, ccKey) {
  // return `${ccClassKey}/${ccKey}`;
  return ccClassKey + "$" + ccKey;
}
export function makeHandlerKey(ccUniqueKey, eventName) {
  return ccUniqueKey + "$" + eventName;
}
export function isModuleNameValid(moduleName) {
  return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
}
export function isModuleNameCcLike(moduleName) {
  var name = moduleName.toLowerCase();
  return name === MODULE_CC;
}
export function isModuleStateValid(state) {
  return isPlainJsonObject(state);
}
export function verifyNamespacedActionType(actionType, allowSlashCountZero) {
  if (allowSlashCountZero === void 0) {
    allowSlashCountZero = true;
  }

  var isOk = /^[\$\#\/\&a-zA-Z0-9_-]+$/.test(actionType);

  if (isOk) {
    var charArr = actionType.split('');
    var slashCount = charArr.filter(function (char) {
      return char === '/';
    }).length;

    if (slashCount !== 1) {
      if (slashCount === 0) {
        if (allowSlashCountZero) return true;else return false;
      } else {
        return false;
      }
    } else {
      if (charArr[0] === '/' || charArr[charArr.length - 1] === '/') {
        return false;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
} // todo, modify verify rule

export function isCcOptionValid(ccOption) {
  return isPlainJsonObject(ccOption);
}
export function isCcActionValid(action) {
  var errMessage = '';

  if (!action) {
    errMessage = 'trying to dispatch an null action is meaningless!';
  } else {
    // const { type, payload } = action;
    var type = action.type;

    if (!isActionTypeValid(type)) {
      errMessage += 'action type must be string and length must LTE 1! ';
    } // if (!isPlainJsonObject(payload, true)) {
    //   errMessage += 'payload must be a plain json object! ';
    // }

  }

  return errMessage;
}
export function disassembleActionType(namespacedActionType) {
  if (namespacedActionType.includes('/')) {
    var _namespacedActionType = namespacedActionType.split('/'),
        moduleName = _namespacedActionType[0],
        _actionType = _namespacedActionType[1];

    return {
      moduleName: moduleName,
      actionType: _actionType
    };
  } else {
    return {
      moduleName: MODULE_GLOBAL,
      actionType: actionType
    };
  }
}
export function verboseInfo(info) {
  return " --verbose-info: " + info;
}
export function ccClassDisplayName(className) {
  return "CC(" + className + ")";
}
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export function verifyKeys(keys1, keys2) {
  var duplicate = false,
      notArray = false,
      keyElementNotString = false;
  if (!Array.isArray(keys1)) return {
    duplicate: duplicate,
    notArray: true,
    keyElementNotString: keyElementNotString
  };
  if (!Array.isArray(keys2)) return {
    duplicate: duplicate,
    notArray: true,
    keyElementNotString: keyElementNotString
  };
  var len1 = keys1.length;
  var len2 = keys2.length;

  outLoop: for (var i = 0; i < len1; i++) {
    var tmpKey = keys1[i];

    if (typeof tmpKey !== 'string') {
      keyElementNotString = true;
      break outLoop;
    }

    for (var j = 0; j < len2; j++) {
      var tmpKey2 = keys2[j];

      if (typeof tmpKey2 !== 'string') {
        keyElementNotString = true;
        break outLoop;
      }

      if (tmpKey2 === tmpKey) {
        duplicate = true;
        break outLoop;
      }
    }
  }

  return {
    duplicate: duplicate,
    notArray: notArray,
    keyElementNotString: keyElementNotString
  };
}
export function color(color) {
  if (color === void 0) {
    color = 'green';
  }

  return "color:" + color + ";border:1px solid " + color;
}
export function styleStr(str) {
  return "%c" + str;
}
export function justWarning(err) {
  console.error(' ------------ CC WARNING ------------');
  if (err instanceof Error) console.error(err.message);else console.error(err);
}
export function justTip(msg) {
  console.log(' ------------ CC TIP ------------');
  console.log("%c" + msg, 'color:green;border:1px solid green;');
}
export function safeGetObjectFromObject(object, key) {
  var childrenObject = object[key];

  if (!childrenObject) {
    childrenObject = object[key] = {};
  }

  return childrenObject;
}
export function safeGetArrayFromObject(object, key) {
  var childrenArray = object[key];

  if (!childrenArray) {
    childrenArray = object[key] = [];
  }

  return childrenArray;
}
export function safeAssignObjectValue(assignTo, assignFrom) {
  Object.keys(assignFrom).forEach(function (key) {
    assignTo[key] = assignFrom[key];
  });
}
export function isStateValid(state) {
  if (!state || !isPlainJsonObject(state)) {
    return false;
  } else {
    return true;
  }
}
export function computeFeature(ccUniqueKey, state) {
  var stateKeys = Object.keys(state);
  var stateKeysStr = stateKeys.sort().join('|');
  return ccUniqueKey + "/" + stateKeysStr;
}
export default {
  makeError: makeError,
  isHotReloadMode: isHotReloadMode,
  makeCcClassContext: makeCcClassContext,
  makeStateMail: makeStateMail,
  makeUniqueCcKey: makeUniqueCcKey,
  makeHandlerKey: makeHandlerKey,
  isActionTypeValid: isActionTypeValid,
  isModuleNameValid: isModuleNameValid,
  isModuleNameCcLike: isModuleNameCcLike,
  isModuleStateValid: isModuleStateValid,
  isCcOptionValid: isCcOptionValid,
  isCcActionValid: isCcActionValid,
  isPrefixedKeyValid: isPrefixedKeyValid,
  isPlainJsonObject: isPlainJsonObject,
  isObjectNotNull: isObjectNotNull,
  isValueNotNull: isValueNotNull,
  isStateValid: isStateValid,
  disassembleActionType: disassembleActionType,
  verboseInfo: verboseInfo,
  bindThis: bindThis,
  ccClassDisplayName: ccClassDisplayName,
  clone: clone,
  verifyKeys: verifyKeys,
  color: color,
  styleStr: styleStr,
  justWarning: justWarning,
  justTip: justTip,
  safeGetObjectFromObject: safeGetObjectFromObject,
  safeGetArrayFromObject: safeGetArrayFromObject,
  safeAssignObjectValue: safeAssignObjectValue,
  computeFeature: computeFeature
};