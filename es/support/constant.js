var _ERR_MESSAGE;

export var MODULE_GLOBAL = '$$global';
export var MODULE_CC = '$$cc';
export var MODULE_CC_LIKE = [MODULE_CC, '$$cC', '$$Cc', '$$CC'];
export var ERR = {
  CC_ALREADY_STARTUP: 1000,
  CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
  CC_CLASS_KEY_DUPLICATE: 1002,
  CC_CLASS_NOT_FOUND: 1003,
  CC_CLASS_INSTANCE_KEY_NOT_FOUND: 1004,
  CC_CLASS_INSTANCE_KEY_DUPLICATE: 1005,
  CC_CLASS_INSTANCE_OPTION_INVALID: 1006,
  CC_CLASS_INSTANCE_NOT_FOUND: 1007,
  CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1007,
  STORE_KEY_CC_FOUND: 1100,
  STORE_KEY_NAMING_INVALID: 1101,
  STORE_MODULE_VALUE_INVALID: 1102,
  REDUCER_ACTION_TYPE_NAMING_INVALID: 1201,
  REDUCER_ACTION_TYPE_NO_MODULE: 1202,
  REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203
};
export var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_NOT_FOUND] = 'ccKey must be supply to props while new a CCReactComponent!  ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.STORE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it in you store! ', _ERR_MESSAGE[ERR.STORE_KEY_NAMING_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.STORE_MODULE_VALUE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE] = "reducer key is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in reducer keys!", _ERR_MESSAGE);
export default {
  MODULE_GLOBAL: MODULE_GLOBAL,
  MODULE_CC: MODULE_CC,
  MODULE_CC_LIKE: MODULE_CC_LIKE,
  ERR: ERR,
  ERR_MESSAGE: ERR_MESSAGE
};