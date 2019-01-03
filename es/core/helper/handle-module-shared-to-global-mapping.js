import mapSharedKeyToGlobal from './map-shared-key-to-global';
export default function (moduleName, moduleSharedKeyToGlobalKeyConfig) {
  var sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
  var sLen = sharedKeys.length;

  for (var k = 0; k < sLen; k++) {
    var sharedKey = sharedKeys[k];
    var globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];
    mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
  }
}