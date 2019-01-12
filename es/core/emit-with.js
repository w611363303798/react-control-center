import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';
export default function (event, option) {
  try {
    var ref = pickOneRef();

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    ref.$$emitWith.apply(ref, [event, option].concat(args));
  } catch (err) {
    if (throwError) throw err;else util.justWarning(err.message);
  }
}