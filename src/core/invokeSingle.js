import ccContext from '../cc-context';
import invoke from './invoke';
import util from '../support/util';
import { ERR } from '../support/constant';

const vbi = util.verboseInfo;
const { ccClassKey_ccClassContext_, ccKey_ref_ } = ccContext;

export default function (ccClassKey, method, ...args) {
  const classContext = ccClassKey_ccClassContext_[ccClassKey];
  if (!classContext.isSingle) {
    const err = util.makeError(ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE, vbi(`ccClassKey:${ccClassKey}`));
    // only error, the target instance may has been unmounted really!
    return console.error(err.message);
  }
  invoke(ccClassKey, ccClassKey, method, ...args);
}