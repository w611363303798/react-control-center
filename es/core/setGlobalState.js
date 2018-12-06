import ccContext from '../cc-context';
import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE } from '../support/constant';
var ccKey_ref_ = ccContext.ccKey_ref_;
export default function (state) {
  var refKeys = Object.keys(ccKey_ref_);

  if (refKeys.length === 0) {
    return util.justWarning('no CCInstance found for any CCClass!');
  }

  var oneRef = ccKey_ref_[refKeys[0]];

  if (!oneRef) {
    return util.justWarning('cc found no ref!');
  }

  oneRef.setGlobalState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
}