import ccContext from '../cc-context';
import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE } from '../support/constant';

const { ccKey_ref_ } = ccContext;

export default function (state) {
  const refKeys = Object.keys(ccKey_ref_);
  if (refKeys.length === 0) {
    return util.justWarning('no CCInstance found for any CCClass!')
  }
  const oneRef = ccKey_ref_[refKeys[0]];
  if(!oneRef){
    return util.justWarning('cc found no ref!')
  }
  oneRef.setGlobalState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
}