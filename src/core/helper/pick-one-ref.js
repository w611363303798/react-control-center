import ccContext from '../../cc-context';

/****
 * pick one ccInstance ref randomly
 */
export default function (module) {
  const { ccKey_ref_, moduleName_ccClassKeys_, ccClassKey_ccClassContext_ } = ccContext;

  let ccKeys;
  if (module) {
    const ccClassKeys = moduleName_ccClassKeys_[module];
    if (ccClassKeys.length === 0) {
      throw new Error(`no ccClass found for module${module}!`);
    }

    const oneCcClassKey = ccClassKeys[0];
    const ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];
    if (!ccClassContext) {
      throw new Error(`no ccClassContext found for ccClassKey${oneCcClassKey}!`);
    }
    ccKeys = ccClassContext.ccKeys;
  } else {
    ccKeys = Object.keys(ccKey_ref_);
  }

  if (ccKeys.length === 0) {
    throw new Error('no ccInstance found for any ccClass!');
  }
  const oneRef = ccKey_ref_[ccKeys[0]];
  if (!oneRef) {
    throw new Error('cc found no ref!');
  }
  return oneRef;
}