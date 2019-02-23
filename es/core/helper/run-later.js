var feature_timerId = {};
export default (function (cb, feature, lazyMs) {
  if (lazyMs === void 0) {
    lazyMs = 1000;
  }

  var timerId = feature_timerId[feature];
  if (timerId) clearTimeout(timerId);
  feature_timerId[feature] = setTimeout(function () {
    delete feature_timerId[feature];
    cb();
  }, lazyMs);
});