import util from '../../support/util';
import { BROADCAST_TRIGGERED_BY_CC_API_SET_STATE } from '../../support/constant';
import pickOneRef from './pick-one-ref';

export default function (module, state, throwError = false) {
  try {
    const ref = pickOneRef(module);
    ref.setState(state, BROADCAST_TRIGGERED_BY_CC_API_SET_STATE);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}