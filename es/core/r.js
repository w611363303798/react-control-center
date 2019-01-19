import register from './register';
/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.sharedStateKeys is called s for short 
 * option.globalStateKeys is called g for short 
 * option.isSingle is called is for short 
 * option.asyncLifecycleHook is called as for short 
 * option.reducerModule is called re for short 
 * option.extendInputClass is called ex for short 
 */

export default function (ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      module = _ref.m,
      sharedStateKeys = _ref.s,
      globalStateKeys = _ref.g,
      isSingle = _ref.is,
      asyncLifecycleHook = _ref.as,
      reducerModule = _ref.re,
      extendInputClass = _ref.ex;

  return register(ccClassKey, {
    extendInputClass: extendInputClass,
    module: module,
    sharedStateKeys: sharedStateKeys,
    globalStateKeys: globalStateKeys,
    isSingle: isSingle,
    asyncLifecycleHook: asyncLifecycleHook,
    reducerModule: reducerModule
  });
}