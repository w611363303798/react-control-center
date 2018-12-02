import ccContext from '../cc-context';
import util from '../support/util';
import { ERR } from '../support/constant';
var vbi = util.verboseInfo;
export default function (ccClassKey, ccInstanceKey, method) {
  var _ref$method;

  var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext) {
    var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey));
    if (ccContext.isStrict) throw err;else return console.error(err);
  }

  var ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
  var ref = classContext.ccKey_componentRef_[ccKey];

  if (!ref) {
    var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey + "/ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


    return console.error(_err.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
}