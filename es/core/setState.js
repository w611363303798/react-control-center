import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_STATE } from '../support/constant';
import cc from '../cc-context';
import * as helper from './helper';
export default function (module, state) {
  try {
    var ref = helper.pickOneRef(module);
    ref.setState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
  } catch (err) {
    cc.store.setState(module, state); //store this state;

    util.justWarning(err.message);
  }
}