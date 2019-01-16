import { isStateValid, isObjectNotNull } from '../../support/util';

export default function (state, targetKeys) {
  if (!isStateValid(state) || !isObjectNotNull(state)) {
    return { partialState: {}, isStateEmpty: true };
  }
  const partialState = {};
  let isStateEmpty = true;
  targetKeys.forEach(key => {
    const value = state[key];
    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return { partialState, isStateEmpty };
}