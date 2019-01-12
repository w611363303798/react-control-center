import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';

export default function (event, option, ...args) {
  try {
    const ref = pickOneRef();
    ref.$$emitWith(event, option, ...args);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}