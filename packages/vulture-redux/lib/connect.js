'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connect;
var defaultMapStateToData = function defaultMapStateToData() {
  return {};
};
var defaultMapDispatchToData = function defaultMapDispatchToData(dispatch) {
  return { dispatch: dispatch };
};
var defaultMergeData = function defaultMergeData(stateData, dispatchData, ownData) {
  return _extends({}, ownData, stateData, dispatchData);
};

function connect() {
  var mapStateToData = arguments.length <= 0 || arguments[0] === undefined ? defaultMapStateToData : arguments[0];
  var mapDispatchToData = arguments.length <= 1 || arguments[1] === undefined ? defaultMapDispatchToData : arguments[1];
  var mergeData = arguments.length <= 2 || arguments[2] === undefined ? defaultMergeData : arguments[2];

  return function (component) {
    return function connectedComponent(ownData) {
      if (!ownData || !ownData.store.dispatch || !ownData.store.getState) {
        throw new Error('To connect to redux, the first argument must be an object with a store property.');
      }

      var _ownData$store = ownData.store;
      var getState = _ownData$store.getState;
      var dispatch = _ownData$store.dispatch;

      var state = getState();
      var stateData = mapStateToData(state, ownData);
      var dispatchData = mapDispatchToData(dispatch, ownData);
      var mergedData = mergeData(stateData, dispatchData, ownData);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return component.call.apply(component, [this, mergedData].concat(args));
    };
  };
}