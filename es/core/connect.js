import _extends from "@babel/runtime/helpers/esm/extends";
import register from './register';
/**
 * 
 * @param {*} ccClassKey 
 * @param {object} stateToPropMapping { (moduleAndStateKey): (mappedStateKeyInPropState) }
 * @param {object} option 
 * @param {boolean} [option.extendInputClass] default is true
 * @param {boolean} [option.isSingle] default is false
 * @param {boolean} [option.isPropStateModuleMode] 
 * @param {boolean} [option.asyncLifecycleHook] 
 * @param {string} [option.module]
 * @param {Array<string>} [option.sharedStateKeys]
 * @param {Array<string>} [option.globalStateKeys]
 */

export default function (ccClassKey, stateToPropMapping, option) {
  if (option === void 0) {
    option = {};
  }

  var mergedOption = _extends({}, option, {
    stateToPropMapping: stateToPropMapping
  });

  return register(ccClassKey, mergedOption);
}