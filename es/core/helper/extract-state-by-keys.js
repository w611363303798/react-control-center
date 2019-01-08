import { isStateValid, isObjectNotNull } from '../../support/util';
export default function (state, targetKeys) {
  if (!isStateValid(state) || !isObjectNotNull(state)) {
    return {
      partialState: {},
      isStateEmpty: true
    };
  }

  var partialState = {};
  var isStateEmpty = true;
  targetKeys.forEach(function (key) {
    var value = state[key];

    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return {
    partialState: partialState,
    isStateEmpty: isStateEmpty
  };
}