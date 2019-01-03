"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = _interopRequireDefault(require("../../support/util"));

var _setState = _interopRequireDefault(require("./set-state"));

function _default(module) {
  return function (state) {
    try {
      (0, _setState.default)(module, state, true);
    } catch (err) {
      _ccContext.default.store.setState(module, state); //store this state;


      _util.default.justTip("no ccInstance found for module " + module + " currently, cc will just store it, lately ccInstance will pick this state to render");
    }
  };
}