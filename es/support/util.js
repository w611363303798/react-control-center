import { ERR_MESSAGE, MODULE_GLOBAL } from './constant';
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
export function verifyActionType(type) {
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
export function makeCcClassContext(module, sharedStateKeys) {
  return {
    module: module,
    sharedStateKeys: sharedStateKeys,
    ccKeys: []
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
  return ccClassKey + "/" + ccKey;
}
export function verifyModuleName(moduleName) {
  return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
}
export function verifyModuleValue(value) {
  return isPlainJsonObject(value);
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
}
export function verifyCcOption(ccOption) {
  return isPlainJsonObject(ccOption);
}
export function verifyCcAction(action) {
  var errMessage = '';

  if (!action) {
    errMessage = 'trying to dispatch an null action is meaningless!';
  } else {
    var type = action.type,
        payload = action.payload;

    if (!verifyActionType(type)) {
      errMessage += 'action type must be string and length must LTE 1! ';
    }

    if (!isPlainJsonObject(payload, true)) {
      errMessage += 'payload must be a plain json object! ';
    }
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
  return "CC" + className;
}
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export default {
  makeError: makeError,
  isHotReloadMode: isHotReloadMode,
  makeCcClassContext: makeCcClassContext,
  makeStateMail: makeStateMail,
  makeUniqueCcKey: makeUniqueCcKey,
  verifyActionType: verifyActionType,
  verifyModuleName: verifyModuleName,
  verifyModuleValue: verifyModuleValue,
  verifyCcOption: verifyCcOption,
  verifyCcAction: verifyCcAction,
  isPlainJsonObject: isPlainJsonObject,
  isValueNotNull: isValueNotNull,
  disassembleActionType: disassembleActionType,
  verboseInfo: verboseInfo,
  bindThis: bindThis,
  ccClassDisplayName: ccClassDisplayName,
  clone: clone
};