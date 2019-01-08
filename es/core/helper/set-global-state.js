import util from '../../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE, MODULE_GLOBAL } from '../../support/constant';
import pickOneRef from './pick-one-ref';
/****
 * if you are sure this state is really belong to global state, call cc.setGlobalState,
 * cc will only pass this state to global module
 */

export default function (state, throwError) {
  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = pickOneRef();
    ref.$$changeState(state, {
      module: MODULE_GLOBAL,
      stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      broadcastTriggeredBy: BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE
    });
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}