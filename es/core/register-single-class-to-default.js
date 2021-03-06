import register from './register';
import { MODULE_DEFAULT } from '../support/constant';
export default function (ccClassKey, option) {
  if (option === void 0) {
    option = {};
  }

  if (!option.sharedStateKeys) option.sharedStateKeys = '*';
  option.module = MODULE_DEFAULT;
  option.isSingle = true;
  return register(ccClassKey, option);
}