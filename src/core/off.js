import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';

export default function (event, option) {
  try {
    const ref = pickOneRef();
    ref.$$off(event, option);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}