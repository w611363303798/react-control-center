import mapSharedKeyToGlobal from './map-shared-key-to-global';

export default function (moduleName, moduleSharedKeyToGlobalKeyConfig) {
  const sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
  const sLen = sharedKeys.length;
  for (let k = 0; k < sLen; k++) {
    const sharedKey = sharedKeys[k];
    const globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];
    mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
  }
}