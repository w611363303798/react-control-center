"use strict";

exports.__esModule = true;
exports.default = _default;

var _util = require("../../support/util");

function _default(state, stateKeys) {
  if (!(0, _util.isStateValid)(state) || !(0, _util.isObjectNotNull)(state)) {
    return {
      partialState: {},
      isStateEmpty: true
    };
  }

  var partialState = {};
  var isStateEmpty = true;
  stateKeys.forEach(function (key) {
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