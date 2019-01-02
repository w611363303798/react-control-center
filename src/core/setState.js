import util from '../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_STATE } from '../support/constant';
import * as helper from './helper';

export default function (module, state) {
  try {
    const ref = helper.pickOneRef(module);
    ref.setState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
  } catch (err) {
    util.justWarning(err.message)
  }
}