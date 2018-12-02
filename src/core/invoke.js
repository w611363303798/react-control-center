import ccContext from '../cc-context';
import util from '../support/util';
import { ERR } from '../support/constant';

const vbi = util.verboseInfo;

export default function (ccClassKey, ccInstanceKey, method, ...args) {
  const classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
  if (!classContext) {
    const err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi(` ccClassKey:${ccClassKey}`));
    if (ccContext.isStrict) throw err;
    else return console.error(err);
  }

  const ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
  const ref = classContext.ccKey_componentRef_[ccKey];
  if(!ref){
    const err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(` ccClassKey:${ccClassKey}/ccKey:${ccInstanceKey}`));
    // only error, the target instance may has been unmounted really!
    return console.error(err.message);
  }

  var fn = ref[method];
  if(!fn){
    const err = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(` method:${method}`));
    return console.error(err.message);
  }
  ref[method].call(ref, ...args);
}