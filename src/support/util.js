
import { ERR_MESSAGE, MODULE_GLOBAL } from './constant';

export function bindThis(_this, methods) {
  methods.forEach(method => _this[method] = _this[method].bind(_this));
}

export function isValueNotNull(value) {
  return !(value === null || value === undefined);
}

export function isPlainJsonObject(obj, canBeArray = false) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      if (canBeArray) return true;
      else return false;
    }
    return true;
  } else {
    return false;
  }
}

export function verifyActionType(type) {
  if (typeof type !== 'string') {
    return false
  } else {
    if (type.length === 0) return false;
    else return true;
  }
}

export function makeError(code, extraMessage) {
  let message = ERR_MESSAGE[code] || '';
  if (extraMessage) message += extraMessage;
  if (!message) message = `undefined message for code:${code}`;
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function makeCcClassContext(module, sharedStateKeys) {
  return {
    module,
    sharedStateKeys,
    ccKeys: [],
    ccKey_componentRef_: {},
    ccKey_option_: {},
  }
}

export function makeStateMail(ccUniqueKey, ccOption, module, type, cb) {
  const mail = {}
  Object.defineProperty(mail, 'ccUniqueKey', { configurable: false, enumerable: true, writable: false, value: ccUniqueKey });
  Object.defineProperty(mail, 'ccOption', { configurable: false, enumerable: true, writable: false, value: ccOption });
  Object.defineProperty(mail, 'module', { configurable: false, enumerable: true, writable: false, value: module });
  Object.defineProperty(mail, 'type', { configurable: false, enumerable: true, writable: false, value: type });
  Object.defineProperty(mail, 'state', { configurable: true, enumerable: true, writable: true, value: {} });
  Object.defineProperty(mail, 'cb', { configurable: true, enumerable: true, writable: true, value: () => { } });
  return mail;
}

// !!! different ccClass enable own a same key
export function makeUniqueCcKey(ccClassKey, ccKey) {
  return `${ccClassKey}/${ccKey}`;
}

export function verifyModuleName(moduleName) {
  return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
}

export function verifyModuleValue(value) {
  return isPlainJsonObject(value);
}

export function verifyNamespacedActionType(actionType, allowSlashCountZero = true) {
  const isOk = /^[\$\#\/\&a-zA-Z0-9_-]+$/.test(actionType);
  if (isOk) {
    const charArr = actionType.split('');
    let slashCount = charArr.filter(char => char === '/').length;
    if (slashCount !== 1) {
      if (slashCount === 0) {
        if (allowSlashCountZero) return true;
        else return false;
      } else {
        return false
      }
    } else {
      if (charArr[0] === '/' || charArr[charArr.length - 1] === '/') {
        return false
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
  let errMessage = '';
  if (!action) {
    errMessage = 'trying to dispatch an null action is meaningless!';
  } else {
    const { type, payload } = action;
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
    const [moduleName, actionType] = namespacedActionType.split('/');
    return { moduleName, actionType };
  } else {
    return { moduleName: MODULE_GLOBAL, actionType }
  }
}

export function verboseInfo(info) {
  return ` --verbose-info: ${info}`;
}

export default {
  makeError,
  makeCcClassContext,
  makeStateMail,
  makeUniqueCcKey,
  verifyActionType,
  verifyModuleName,
  verifyModuleValue,
  verifyCcOption,
  verifyCcAction,
  isPlainJsonObject,
  isValueNotNull,
  disassembleActionType,
  verboseInfo,
  bindThis,
}