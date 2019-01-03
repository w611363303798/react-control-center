var _ERR_MESSAGE;

export var MODULE_GLOBAL = '$$global';
export var MODULE_DEFAULT = '$$default';
export var MODULE_CC = '$$cc';
export var CHANGE_BY_SELF = 1;
export var SYNC_FROM_CC_INSTANCE_SHARED_STATE = 2;
export var SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE = 3;
export var SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE = 4;
export var BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = 1;
export var BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = 2;
export var BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = 3;
export var BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = 4;
export var ERR = {
  CC_ALREADY_STARTUP: 1000,
  CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
  CC_MODULE_NAME_DUPLICATE: 1002,
  CC_REGISTER_A_CC_CLASS: 1003,
  CC_MODULE_KEY_CC_FOUND: 1004,
  CC_MODULE_NAME_INVALID: 1005,
  CC_STORE_STATE_INVALID: 1006,
  CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE: 1007,
  CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1008,
  CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1009,
  CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1010,
  CC_CLASS_KEY_DUPLICATE: 1100,
  CC_CLASS_NOT_FOUND: 1101,
  CC_CLASS_STORE_MODULE_INVALID: 1102,
  CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED: 1103,
  CC_CLASS_REDUCER_MODULE_INVALID: 1104,
  CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE: 1105,
  CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
  CC_CLASS_INSTANCE_OPTION_INVALID: 1201,
  CC_CLASS_INSTANCE_NOT_FOUND: 1202,
  CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1203,
  CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1204,
  CC_CLASS_INSTANCE_MORE_THAN_ONE: 1205,
  CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS: 1206,
  CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS: 1207,
  CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY: 1300,
  CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT: 1301,
  CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS: 1400,
  CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE: 1401,
  CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY: 1402,
  CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT: 1403,
  CC_REDUCER_ACTION_TYPE_NAMING_INVALID: 1500,
  CC_REDUCER_ACTION_TYPE_NO_MODULE: 1501,
  CC_REDUCER_MODULE_NAME_DUPLICATE: 1502 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

};
export var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = 'globalStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE] = 'some keys of configured global state have been included in store.globalState', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE);
export default {
  MODULE_GLOBAL: MODULE_GLOBAL,
  MODULE_DEFAULT: MODULE_DEFAULT,
  MODULE_CC: MODULE_CC,
  ERR: ERR,
  ERR_MESSAGE: ERR_MESSAGE,
  CHANGE_BY_SELF: CHANGE_BY_SELF,
  SYNC_FROM_CC_INSTANCE_SHARED_STATE: SYNC_FROM_CC_INSTANCE_SHARED_STATE,
  SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE: SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE,
  SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE: SYNC_FROM_CC_INSTANCE_GLOBAL_PARTIAL_STATE_AND_SHARED_STATE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD: BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE: BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE: BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE
};