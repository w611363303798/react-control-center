import register from './register';
import { MODULE_DEFAULT } from '../support/constant';
export default function (ccClassKey, stateToPropMapping, isPropStateModuleMode, module) {
  if (isPropStateModuleMode === void 0) {
    isPropStateModuleMode = false;
  }

  if (module === void 0) {
    module = MODULE_DEFAULT;
  }

  return register(ccClassKey, {
    module: module,
    stateToPropMapping: stateToPropMapping,
    isPropStateModuleMode: isPropStateModuleMode
  });
}