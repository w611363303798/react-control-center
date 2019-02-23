import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';

export default function (event, ...args) {
  try {
    const ref = pickOneRef();
    ref.$$emit(event, ...args);
  } catch (err) {
    util.justWarning(err.message)
  }
}