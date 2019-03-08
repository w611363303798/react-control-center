import util from '../../support/util';
export default function (propState, propKey, propValue, isPropStateModuleMode, module) {
  if (isPropStateModuleMode) {
    var modulePropState = util.safeGetObjectFromObject(propState, module);
    modulePropState[propKey] = propValue;
  } else {
    propState[propKey] = propValue;
  }
}