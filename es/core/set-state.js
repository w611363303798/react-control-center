import setState from './helper/set-state';
export default function (module, state, lazyMs, throwError) {
  if (lazyMs === void 0) {
    lazyMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  if (module === undefined && state === undefined) {
    throw new Error("api doc: cc.setState(module:String, state:Object, lazyMs?:Number, throwError?:Boolean)");
  }

  setState(module, state, lazyMs, throwError);
}
;