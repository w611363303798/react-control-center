import register from './register';
import { MODULE_DEFAULT } from '../support/constant';

export default function (ccClassKey, stateToPropMapping, {
  isPropStateModuleMode = false,
  module = MODULE_DEFAULT,
  extendReactComponent = false,
} = {}) {
  return register(ccClassKey, { module, stateToPropMapping, isPropStateModuleMode, extendReactComponent });
}