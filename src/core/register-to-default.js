import register from './register';
import { MODULE_DEFAULT } from '../support/constant';

export default function (ccClassKey, option = {}) {
  if (!option.sharedStateKeys) option.sharedStateKeys = 'all';
  option.module = MODULE_DEFAULT;
  register(ccClassKey, option);
}