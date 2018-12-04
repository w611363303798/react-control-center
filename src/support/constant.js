

export const MODULE_GLOBAL = '$$global';
export const MODULE_CC = '$$cc';
export const MODULE_CC_LIKE = [MODULE_CC, '$$cC', '$$Cc', '$$CC'];

export const CHANGE_BY_SELF = 1;
export const SYNC_FROM_CC_INSTANCE = 2;
export const SYNC_FROM_CC_STORE = 3;
export const BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = 1;
export const BROADCAST_TRIGGERED_BY_CC_TOP_METHOD = 2;//to be add!

export const ERR = {
  CC_ALREADY_STARTUP: 1000,
  CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
  CC_CLASS_KEY_DUPLICATE: 1002,
  CC_CLASS_NOT_FOUND: 1003,
  CC_CLASS_STORE_MODULE_INVALID: 1004,
  CC_CLASS_REDUCER_MODULE_INVALID: 1005,
  CC_CLASS_INSTANCE_KEY_DUPLICATE: 1006,
  CC_CLASS_INSTANCE_OPTION_INVALID: 1007,
  CC_CLASS_INSTANCE_NOT_FOUND: 1008,
  CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1009,
  CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1010,
  CC_CLASS_INSTANCE_MORE_THAN_ONE: 1011,
  CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE: 1012,
  MODULE_KEY_CC_FOUND: 1100,
  STORE_KEY_NAMING_INVALID: 1101,
  STORE_MODULE_VALUE_INVALID: 1102,
  REDUCER_ACTION_TYPE_NAMING_INVALID: 1201,
  REDUCER_ACTION_TYPE_NO_MODULE: 1202,
  // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,
}

export const ERR_MESSAGE = {
  [ERR.CC_ALREADY_STARTUP]: 'react-controller-center startup method con only be invoked one time by user! ',
  [ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE]: 'you are trying register a module class but cc startup with non module mode! ',
  [ERR.CC_CLASS_KEY_DUPLICATE]: 'ccClassKey duplicate while you register a react class!  ',
  [ERR.CC_CLASS_NOT_FOUND]: 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ',
  [ERR.CC_CLASS_STORE_MODULE_INVALID]: 'ccClass ccOption module value is invalid, can not match it in store! ',
  [ERR.CC_CLASS_REDUCER_MODULE_INVALID]: 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ',
  [ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE]: `ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   `,
  [ERR.CC_CLASS_INSTANCE_OPTION_INVALID]: 'ccOption must be a plain json object! ',
  [ERR.CC_CLASS_INSTANCE_NOT_FOUND]: 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ',
  [ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND]: 'ccClass instance method not found, make sure the instance include the method! ',
  [ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID]: 'ccClass instance invoke callWith method with invalid args! ',
  [ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE]: 'ccClass is declared as singleton, now cc found you are trying new another one instance! ',
  [ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE]: 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ',
  [ERR.MODULE_KEY_CC_FOUND]: 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it in you store or reducers! ',
  [ERR.STORE_KEY_NAMING_INVALID]: `module name is invalid, /^[\$\#\&a-zA-Z0-9_-]+$/.test() is false. `,
  [ERR.STORE_MODULE_VALUE_INVALID]: `module state of store must be a plain json object! `,
  [ERR.REDUCER_ACTION_TYPE_NAMING_INVALID]: `action type's naming is invalid, correct one may like: fooModule/fooType. `,
  [ERR.REDUCER_ACTION_TYPE_NO_MODULE]: `action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!`,
  // [ERR.REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE]: `reducer key is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in reducer keys!`,
}

export default {
  MODULE_GLOBAL,
  MODULE_CC,
  MODULE_CC_LIKE,
  ERR,
  ERR_MESSAGE,
  CHANGE_BY_SELF,
  SYNC_FROM_CC_INSTANCE,
  SYNC_FROM_CC_STORE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  BROADCAST_TRIGGERED_BY_CC_TOP_METHOD,
}
