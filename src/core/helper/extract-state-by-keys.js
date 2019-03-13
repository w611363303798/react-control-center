import { isStateValid, isObjectNotNull } from '../../support/util';

export default function (state, stateKeys, returnNullIfEmpty = false) {
  const partialState = {};
  if (!isStateValid(state) || !isObjectNotNull(state)) {
    return { partialState: returnNullIfEmpty ? null : partialState, isStateEmpty: true };
  }
  let isStateEmpty = true;
  stateKeys.forEach(key => {
    const value = state[key];
    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return { partialState, isStateEmpty };
}