"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var vbi = _util.default.verboseInfo;

function _default(ccClassKey, ccInstanceKey, method) {
  var _ref$method;

  var classContext = _ccContext.default.ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext) {
    var err = _util.default.makeError(_constant.ERR.CC_CLASS_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey));

    if (_ccContext.default.isStrict) throw err;else return console.error(err);
  }

  var ccKey = _util.default.makeUniqueCcKey(ccClassKey, ccInstanceKey);

  var ref = classContext.ccKey_componentRef_[ccKey];

  if (!ref) {
    var _err = _util.default.makeError(_constant.ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey + "/ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


    return console.error(_err.message);
  }

  var fn = ref[method];

  if (!fn) {
    var _err2 = _util.default.makeError(_constant.ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(" method:" + method));

    return console.error(_err2.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
}