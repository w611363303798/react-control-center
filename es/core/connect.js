import _extends from "@babel/runtime/helpers/esm/extends";
import register from './register';
export default function (ccClassKey, stateToPropMapping, option) {
  if (option === void 0) {
    option = {};
  }

  var mergedOption = _extends({}, option, {
    stateToPropMapping: stateToPropMapping
  });

  return register(ccClassKey, mergedOption);
}