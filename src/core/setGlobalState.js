import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE, MODULE_GLOBAL } from '../support/constant';
import * as helper from './helper';
import cc from '../cc-context';

/****
 * if you are sure this state is really belong to global state, call cc.setGlobalState,
 * cc will only pass this state to global module
 */
export default function (state, throwError = false) {
  try {
    const ref = helper.pickOneRef();
    ref.setGlobalState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message)
  }
}