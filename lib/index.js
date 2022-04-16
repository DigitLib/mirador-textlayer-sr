"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _actions = require("mirador/dist/es/src/state/actions");

var _selectors = require("mirador/dist/es/src/state/selectors");

var _reducers = require("./state/reducers");

var _sagas = _interopRequireDefault(require("./state/sagas"));

var _selectors2 = require("./state/selectors");

var _MiradorTextOverlay = _interopRequireDefault(require("./components/MiradorTextOverlay"));

var _OverlaySettings = _interopRequireDefault(require("./components/settings/OverlaySettings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _default = [{
  component: _MiradorTextOverlay["default"],
  mapStateToProps: function mapStateToProps(state, _ref) {
    var windowId = _ref.windowId;
    return _extends({
      pageTexts: (0, _selectors2.getTextsForVisibleCanvases)(state, {
        windowId: windowId
      }).map(function (canvasText) {
        if (canvasText === undefined || canvasText.isFetching) {
          return undefined;
        }

        return _extends({}, canvasText.text, {
          source: canvasText.source,
          textColor: canvasText.textColor,
          bgColor: canvasText.bgColor
        });
      }),
      windowId: windowId
    }, (0, _selectors2.getWindowTextOverlayOptions)(state, {
      windowId: windowId
    }));
  },
  mode: 'add',
  reducers: {
    texts: _reducers.textsReducer
  },
  saga: _sagas["default"],
  target: 'OpenSeadragonViewer'
}, {
  component: _OverlaySettings["default"],
  mapDispatchToProps: function mapDispatchToProps(dispatch, _ref2) {
    var windowId = _ref2.windowId;
    return {
      updateWindowTextOverlayOptions: function updateWindowTextOverlayOptions(options) {
        return dispatch((0, _actions.updateWindow)(windowId, {
          textOverlay: options
        }));
      }
    };
  },
  mapStateToProps: function mapStateToProps(state, _ref3) {
    var windowId = _ref3.windowId;

    var _getWindowConfig = (0, _selectors.getWindowConfig)(state, {
      windowId: windowId
    }),
        _getWindowConfig$imag = _getWindowConfig.imageToolsEnabled,
        imageToolsEnabled = _getWindowConfig$imag === void 0 ? false : _getWindowConfig$imag;

    return {
      containerId: (0, _selectors.getContainerId)(state),
      imageToolsEnabled: imageToolsEnabled,
      textsAvailable: (0, _selectors2.getTextsForVisibleCanvases)(state, {
        windowId: windowId
      }).length > 0,
      textsFetching: (0, _selectors2.getTextsForVisibleCanvases)(state, {
        windowId: windowId
      }).some(function (t) {
        return t === null || t === void 0 ? void 0 : t.isFetching;
      }),
      pageColors: (0, _selectors2.getTextsForVisibleCanvases)(state, {
        windowId: windowId
      }).filter(function (p) {
        return p !== undefined;
      }).map(function (_ref4) {
        var textColor = _ref4.textColor,
            bgColor = _ref4.bgColor;
        return {
          textColor: textColor,
          bgColor: bgColor
        };
      }),
      windowTextOverlayOptions: (0, _selectors2.getWindowTextOverlayOptions)(state, {
        windowId: windowId
      })
    };
  },
  mode: 'add',
  target: 'OpenSeadragonViewer'
}];
exports["default"] = _default;
module.exports = exports.default;