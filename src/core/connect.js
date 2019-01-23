import register from './register';

export default function (ccClassKey, stateToPropMapping, option = {}) {
  const mergedOption = { ...option, stateToPropMapping }
  return register(ccClassKey, mergedOption);
}