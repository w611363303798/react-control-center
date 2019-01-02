import ccContext from '../../cc-context';
/****
 * pick one ccInstance ref randomly
 */

export default function (module) {
  var ccKey_ref_ = ccContext.ccKey_ref_,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
  var ccKeys;

  if (module) {
    var ccClassKeys = moduleName_ccClassKeys_[module];

    if (ccClassKeys.length === 0) {
      throw new Error("no ccClass found for module" + module + "!");
    }

    var oneCcClassKey = ccClassKeys[0];
    var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

    if (!ccClassContext) {
      throw new Error("no ccClassContext found for ccClassKey" + oneCcClassKey + "!");
    }

    ccKeys = ccClassContext.ccKeys;
  } else {
    ccKeys = Object.keys(ccKey_ref_);
  }

  if (ccKeys.length === 0) {
    throw new Error('no ccInstance found for any ccClass!');
  }

  var oneRef = ccKey_ref_[ccKeys[0]];

  if (!oneRef) {
    throw new Error('cc found no ref!');
  }

  return oneRef;
}