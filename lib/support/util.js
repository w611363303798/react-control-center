"use strict";

exports.__esModule = true;
exports.isHotReloadMode = isHotReloadMode;
exports.bindThis = bindThis;
exports.isValueNotNull = isValueNotNull;
exports.isObjectNotNull = isObjectNotNull;
exports.isPlainJsonObject = isPlainJsonObject;
exports.isActionTypeValid = isActionTypeValid;
exports.makeError = makeError;
exports.makeCcClassContext = makeCcClassContext;
exports.makeStateMail = makeStateMail;
exports.makeUniqueCcKey = makeUniqueCcKey;
exports.isModuleNameValid = isModuleNameValid;
exports.isModuleNameCcLike = isModuleNameCcLike;
exports.isModuleStateValid = isModuleStateValid;
exports.verifyNamespacedActionType = verifyNamespacedActionType;
exports.isCcOptionValid = isCcOptionValid;
exports.isCcActionValid = isCcActionValid;
exports.disassembleActionType = disassembleActionType;
exports.verboseInfo = verboseInfo;
exports.ccClassDisplayName = ccClassDisplayName;
exports.clone = clone;
exports.verifyKeys = verifyKeys;
exports.color = color;
exports.styleStr = styleStr;
exports.justWarning = justWarning;
exports.justTip = justTip;
exports.safeGetObjectFromObject = safeGetObjectFromObject;
exports.safeGetArrayFromObject = safeGetArrayFromObject;
exports.default = void 0;

var _constant = require("./constant");

function isHotReloadMode() {
  return window && window.webpackHotUpdate;
}

function bindThis(_this, methods) {
  methods.forEach(function (method) {
    return _this[method] = _this[method].bind(_this);
  });
}

function isValueNotNull(value) {
  return !(value === null || value === undefined);
}

function isObjectNotNull(object) {
  if (object === null || object === undefined) {
    return false;
  } else if (Object.keys(object).length > 0) {
    return true;
  } else {
    return false;
  }
}

function isPlainJsonObject(obj, canBeArray) {
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

function isActionTypeValid(type) {
  if (typeof type !== 'string') {
    return false;
  } else {
    if (type.length === 0) return false;else return true;
  }
}

function makeError(code, extraMessage) {
  var message = _constant.ERR_MESSAGE[code] || '';
  if (extraMessage) message += extraMessage;
  if (!message) message = "undefined message for code:" + code;
  var error = new Error(message);
  error.code = code;
  return error;
}

function makeCcClassContext(module, sharedStateKeys, globalStateKeys) {
  return {
    module: module,
    sharedStateKeys: sharedStateKeys,
    globalStateKeys: globalStateKeys,
    ccKeys: []
  };
}

function makeStateMail(ccUniqueKey, ccOption, module, type, cb) {
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


function makeUniqueCcKey(ccClassKey, ccKey) {
  return ccClassKey + "/" + ccKey;
}

function isModuleNameValid(moduleName) {
  return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
}

function isModuleNameCcLike(moduleName) {
  var name = moduleName.toLowerCase();
  return name === _constant.MODULE_CC;
}

function isModuleStateValid(state) {
  return isPlainJsonObject(state);
}

function verifyNamespacedActionType(actionType, allowSlashCountZero) {
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


function isCcOptionValid(ccOption) {
  return isPlainJsonObject(ccOption);
}

function isCcActionValid(action) {
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

function disassembleActionType(namespacedActionType) {
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
      moduleName: _constant.MODULE_GLOBAL,
      actionType: actionType
    };
  }
}

function verboseInfo(info) {
  return " --verbose-info: " + info;
}

function ccClassDisplayName(className) {
  return "CC(" + className + ")";
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function verifyKeys(keys1, keys2) {
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

function color(color) {
  if (color === void 0) {
    color = 'green';
  }

  return "color:" + color + ";border:1px solid " + color;
}

function styleStr(str) {
  return "%c" + str;
}

function justWarning(err) {
  console.error(' ------------ CC WARNING ------------');
  if (err instanceof Error) console.error(err.message);else console.error(err);
}

function justTip(msg) {
  console.error(' ------------ CC TIP ------------');
  console.error("%c" + msg, 'color:green;border:1px solid green;');
}

function safeGetObjectFromObject(object, key) {
  var childrenObject = object[key];

  if (!childrenObject) {
    childrenObject = object[key] = {};
  }

  return childrenObject;
}

function safeGetArrayFromObject(object, key) {
  var childrenArray = object[key];

  if (!childrenArray) {
    childrenArray = object[key] = [];
  }

  return childrenArray;
}

var _default = {
  makeError: makeError,
  isHotReloadMode: isHotReloadMode,
  makeCcClassContext: makeCcClassContext,
  makeStateMail: makeStateMail,
  makeUniqueCcKey: makeUniqueCcKey,
  isActionTypeValid: isActionTypeValid,
  isModuleNameValid: isModuleNameValid,
  isModuleNameCcLike: isModuleNameCcLike,
  isModuleStateValid: isModuleStateValid,
  isCcOptionValid: isCcOptionValid,
  isCcActionValid: isCcActionValid,
  isPlainJsonObject: isPlainJsonObject,
  isObjectNotNull: isObjectNotNull,
  isValueNotNull: isValueNotNull,
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
  safeGetArrayFromObject: safeGetArrayFromObject
};
exports.default = _default;