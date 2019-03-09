import { CC_DISPATCHER, ERR } from '../../support/constant';
import ccContext from '../../cc-context';
import util from '../../support/util';
var ccKey_ref_ = ccContext.ccKey_ref_;
export default function () {
  var ref = ccKey_ref_[CC_DISPATCHER];

  if (!ref) {
    throw util.makeError(ERR.CC_NO_DISPATCHER_FOUND);
  }

  return ref;
}