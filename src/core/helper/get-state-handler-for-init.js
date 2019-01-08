import ccContext from '../../cc-context';
import util from '../../support/util';
import { MODULE_GLOBAL } from '../../support/constant';
import setState from './set-state';
import getAndStoreValidGlobalState from './get-and-store-valid-global-state';
import extractStateByKeys from './extract-state-by-keys';

export default function (module) {
  return state => {
    try {
      setState(module, state, true);
    } catch (err) {
      if (module == MODULE_GLOBAL) {
        getAndStoreValidGlobalState(state);
      } else {
        const sharedStateKeys = ccContext.moduleName_sharedStateKeys_[module];
        if (!sharedStateKeys) {
          return util.justWarning(`invalid module ${module}`);
        }
        const validState = extractStateByKeys(state, sharedStateKeys);
        ccContext.store.setState(module, validState);//store this state;
      }

      util.justTip(`no ccInstance found for module ${module} currently, cc will just store it, lately ccInstance will pick this state to render`);
    }
  }
}
