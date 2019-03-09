import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';

export default function (event, option, ...args) {
  if (event === undefined) {
    throw new Error(`api doc: cc.emitWith(event:String, option:{module?:String, ccClassKey?:String, identity?:String} ...args)`);
  }

  try {
    const ref = pickOneRef();
    ref.$$emitWith(event, option, ...args);
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}