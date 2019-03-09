import ccContext from '../../cc-context';
import { ERR } from '../../support/constant';
import util from '../../support/util';
var me = util.makeError,
    vbi = util.verboseInfo,
    ss = util.styleStr,
    cl = util.color;
var ccKey_insCount = {};

function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
  function setRef() {
    ccContext.ccKey_ref_[ccUniqueKey] = ref;
    ccKeys.push(ccUniqueKey);
    ccContext.ccKey_option_[ccUniqueKey] = option;
  }

  incCcKeyInsCount(ccUniqueKey);

  if (delayMs) {
    setTimeout(setRef, delayMs);
  } else {
    setRef();
  }
}

export function incCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 1;else ccKey_insCount[ccUniqueKey] += 1;
}
export function decCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 0;else ccKey_insCount[ccUniqueKey] -= 1;
}
export function getCcKeyInsCount(ccUniqueKey) {
  if (ccKey_insCount[ccUniqueKey] === undefined) return 0;else return ccKey_insCount[ccUniqueKey];
}
export default function (ref, isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption, forCcFragment) {
  if (forCcFragment === void 0) {
    forCcFragment = false;
  }

  var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
  var ccKeys = classContext.ccKeys;

  if (ccContext.isDebug) {
    console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
  }

  if (!util.isCcOptionValid(ccOption)) {
    throw me(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
  }

  var isHot = util.isHotReloadMode();

  if (forCcFragment === true) {
    var fragmentCcKeys = ccContext.fragmentCcKeys;

    if (fragmentCcKeys.includes(ccKey)) {
      throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("<CcFragment ccKey=\"" + ccKey + "\" />")); // if(isHot){
      //   util.justWarning(`cc found you supply a duplicate ccKey:${ccKey} to CcFragment, but now cc is running in hot reload mode, so if this message is wrong, you can ignore it.`);
      // }else{
      //   throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`<CcFragment ccKey="${ccKey}" />`));
      // }
    } else {
      fragmentCcKeys.push(ccKey);
    }
  }

  if (ccKeys.includes(ccUniqueKey)) {
    if (isHot) {
      var insCount = getCcKeyInsCount(ccUniqueKey);
      if (isSingle && insCount > 1) throw me(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi("ccClass:" + ccClassKey));

      if (insCount > 2) {
        // now cc can make sure the ccKey duplicate
        throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
      } // just warning


      util.justWarning("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
      // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
      // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
      // so cc set ref later

      setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption, 600);
    } else {
      throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
    }
  } else {
    setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption);
  }

  return classContext;
}