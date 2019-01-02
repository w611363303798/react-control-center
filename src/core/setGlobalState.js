import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE } from '../support/constant';
import * as helper from './helper';

/****
 * if you are sure this state is really belong to global state, call cc.setGlobalState,
 * cc will only pass this state to global module
 */
export default function (state) {
  try {
    const ref = helper.pickOneRef();
    ref.setGlobalState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
  } catch (err) {
    util.justWarning(err.message)
  }
}