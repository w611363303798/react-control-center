import util from '../support/util';
import ccContext from '../cc-context';
import pickOneRef from './helper/pick-one-ref';
export default function (action, payLoadWhenActionIsString, _temp) {
  var _ref = _temp === void 0 ? [] : _temp,
      ccClassKey = _ref[0],
      ccKey = _ref[1],
      throwError = _ref[2];

  try {
    if (ccClassKey && ccKey) {
      var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      var targetRef = ccContext.refs[uKey];

      if (!targetRef) {
        throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
      } else {
        targetRef.$$dispatch(action, payLoadWhenActionIsString);
      }
    } else {
      var ref = pickOneRef();
      ref.$$dispatchForModule(action, payLoadWhenActionIsString);
    }
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}