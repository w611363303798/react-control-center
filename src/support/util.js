
import { ERR_MESSAGE, MODULE_GLOBAL } from './constant';

export function isHotReloadMode() {
  return window && window.webpackHotUpdate;
}

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

export function isActionTypeValid(type) {
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
  return error;
}

export function makeCcClassContext(module, sharedStateKeys, globalStateKeys) {
  return {
    module,
    sharedStateKeys,
    globalStateKeys,
    ccKeys: [],
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

export function isModuleNameValid(moduleName) {
  return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
}

export function isModuleStateValid(state) {
  return isPlainJsonObject(state);
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

// todo, modify verify rule
export function isCcOptionValid(ccOption) {
  return isPlainJsonObject(ccOption);
}

export function isCcActionValid(action) {
  let errMessage = '';
  if (!action) {
    errMessage = 'trying to dispatch an null action is meaningless!';
  } else {
    const { type, payload } = action;
    if (!isActionTypeValid(type)) {
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

export function ccClassDisplayName(className) {
  return `CC(${className})`
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function verifyKeys(keys1, keys2) {
  let duplicate = false, notArray = false, keyElementNotString = false;
  if (!Array.isArray(keys1)) return { duplicate, notArray: true, keyElementNotString };
  if (!Array.isArray(keys2)) return { duplicate, notArray: true, keyElementNotString };
  const len1 = keys1.length;
  const len2 = keys2.length;
  outLoop: for (let i = 0; i < len1; i++) {
    const tmpKey = keys1[i];
    if (typeof tmpKey !== 'string') {
      keyElementNotString = true;
      break outLoop;
    }
    for (let j = 0; j < len2; j++ ) {
      const tmpKey2 = keys2[j];
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
  return { duplicate, notArray, keyElementNotString };
}

export function color(color = 'green') {
  return `color:${color};border:1px solid ${color}`;
}

export function styleStr(str){
  return `%c${str}`;
}

export function justWarning(err) {
  console.error(' ------------ CC WARNING ------------');
  if (err instanceof Error) console.error(err.message);
  else console.error(err);
}

export default {
  makeError,
  isHotReloadMode,
  makeCcClassContext,
  makeStateMail,
  makeUniqueCcKey,
  isActionTypeValid,
  isModuleNameValid,
  isModuleStateValid,
  isCcOptionValid,
  isCcActionValid,
  isPlainJsonObject,
  isValueNotNull,
  disassembleActionType,
  verboseInfo,
  bindThis,
  ccClassDisplayName,
  clone,
  verifyKeys,
  color,
  styleStr,
  justWarning,
}