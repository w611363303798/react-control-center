import ccContext from '../cc-context';
import util from '../support/util';
import { ERR } from '../support/constant';
var vbi = util.verboseInfo;
var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
    ccKey_ref_ = ccContext.ccKey_ref_;
export default function (ccClassKey, ccInstanceKey, method) {
  var _ref$method;

  var classContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext) {
    var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey));
    if (ccContext.isStrict) throw err;else return console.error(err);
  }

  var ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
  var ref = ccKey_ref_[ccKey];

  if (!ref) {
    var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey + "/ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


    return console.error(_err.message);
  }

  var fn = ref[method];

  if (!fn) {
    var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(" method:" + method));

    return console.error(_err2.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
}