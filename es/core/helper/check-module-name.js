import { isModuleNameCcLike, isModuleNameValid, verboseInfo, makeError } from '../../support/util';
import { ERR } from '../../support/constant';
import ccContext from '../../cc-context';
export default function (moduleName, checkForReducer) {
  if (checkForReducer === void 0) {
    checkForReducer = false;
  }

  var _state = ccContext.store._state;
  var _reducer = ccContext.reducer._reducer;

  if (!isModuleNameValid(moduleName)) {
    throw makeError(ERR.CC_MODULE_NAME_INVALID, verboseInfo(" moduleName:" + moduleName + " is invalid!"));
  }

  if (isModuleNameCcLike(moduleName)) {
    throw makeError(ERR.CC_MODULE_KEY_CC_FOUND);
  }

  if (checkForReducer) {
    if (_reducer[moduleName]) {
      throw makeError(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, verboseInfo("moduleName:" + moduleName));
    }
  } else {
    if (_state[moduleName]) {
      throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo("moduleName:" + moduleName));
    }
  }
}