import register from './register';
import { MODULE_DEFAULT } from '../support/constant';
export default function (ccClassKey, stateToPropMapping, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$isPropStateModul = _ref.isPropStateModuleMode,
      isPropStateModuleMode = _ref$isPropStateModul === void 0 ? false : _ref$isPropStateModul,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
      _ref$extendReactCompo = _ref.extendReactComponent,
      extendReactComponent = _ref$extendReactCompo === void 0 ? false : _ref$extendReactCompo;

  return register(ccClassKey, {
    module: module,
    stateToPropMapping: stateToPropMapping,
    isPropStateModuleMode: isPropStateModuleMode,
    extendReactComponent: extendReactComponent
  });
}