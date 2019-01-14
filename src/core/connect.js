import register from './register';
import { MODULE_DEFAULT } from '../support/constant';

export default function (ccClassKey, stateToPropMapping, module = MODULE_DEFAULT) {
  return register(ccClassKey, { module, stateToPropMapping });
}