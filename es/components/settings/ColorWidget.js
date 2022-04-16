"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _MiradorMenuButton = require("mirador/dist/es/src/components/MiradorMenuButton");

var _SettingsBackupRestore = _interopRequireDefault(require("@material-ui/icons/SettingsBackupRestore"));

var _makeStyles = _interopRequireDefault(require("@material-ui/core/styles/makeStyles"));

var _colorManipulator = require("@material-ui/core/styles/colorManipulator");

var _ColorInput = _interopRequireDefault(require("./ColorInput"));

var _color = require("../../lib/color");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var useStyles = (0, _makeStyles["default"])(function (_ref) {
  var _root, _foreground, _background;

  var palette = _ref.palette,
      breakpoints = _ref.breakpoints;
  var bubbleBg = palette.shades.main;
  return {
    root: (_root = {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 48,
      zIndex: 100,
      borderRadius: [[0, 0, 25, 25]],
      backgroundColor: (0, _colorManipulator.fade)(bubbleBg, 0.8)
    }, _root[breakpoints.down('sm')] = {
      flexDirection: 'row',
      right: 48,
      top: 'auto',
      borderRadius: [[25, 0, 0, 25]],
      // Truncate right box shadow
      clipPath: 'inset(-8px 0 -8px -8px)'
    }, _root),
    foreground: (_foreground = {
      height: 40,
      padding: [[8, 8, 0, 8]],
      margin: function margin(props) {
        return [[props.showResetButton ? -12 : 0, 0, 0, 0]];
      }
    }, _foreground[breakpoints.down('sm')] = {
      height: 48,
      width: 40,
      padding: [[8, 0, 8, 8]],
      marginTop: 0,
      margin: function margin(props) {
        return [[0, 0, 0, props.showResetButton ? -12 : 0]];
      }
    }, _foreground),
    background: (_background = {
      marginTop: -6,
      zIndex: -5,
      height: 40,
      padding: [[0, 8, 8, 8]]
    }, _background[breakpoints.down('sm')] = {
      height: 48,
      width: 40,
      padding: [[8, 8, 8, 0]],
      marginTop: 0,
      marginLeft: -6
    }, _background)
  };
});
/** Widget to update text and background color */

var ColorWidget = function ColorWidget(_ref2) {
  var textColor = _ref2.textColor,
      bgColor = _ref2.bgColor,
      _onChange = _ref2.onChange,
      t = _ref2.t,
      pageColors = _ref2.pageColors,
      useAutoColors = _ref2.useAutoColors,
      containerId = _ref2.containerId;
  var showResetButton = !useAutoColors && pageColors && pageColors.some(function (c) {
    return c && (c.textColor || c.bgColor);
  });
  var classes = useStyles({
    showResetButton: showResetButton
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "MuiPaper-elevation4 " + classes.root
  }, showResetButton && /*#__PURE__*/_react["default"].createElement(_MiradorMenuButton.MiradorMenuButton, {
    containerId: containerId,
    "aria-label": t('resetTextColors'),
    onClick: function onClick() {
      var _pageColors$map$filte, _pageColors$map$filte2;

      return _onChange({
        useAutoColors: true,
        textColor: (_pageColors$map$filte = pageColors.map(function (cs) {
          return cs.textColor;
        }).filter(function (x) {
          return x;
        })[0]) !== null && _pageColors$map$filte !== void 0 ? _pageColors$map$filte : textColor,
        bgColor: (_pageColors$map$filte2 = pageColors.map(function (cs) {
          return cs.bgColor;
        }).filter(function (x) {
          return x;
        })[0]) !== null && _pageColors$map$filte2 !== void 0 ? _pageColors$map$filte2 : bgColor
      });
    }
  }, /*#__PURE__*/_react["default"].createElement(_SettingsBackupRestore["default"], null)), /*#__PURE__*/_react["default"].createElement(_ColorInput["default"], {
    title: t('textColor'),
    autoColors: useAutoColors ? pageColors.map(function (colors) {
      return colors.textColor;
    }) : undefined,
    color: textColor,
    onChange: function onChange(color) {
      var _pageColors$;

      // Lackluster way to check if selection was canceled: The chance of users picking
      // the exact same colors as the autodetected one is extremely slim, so if we get that,
      // the user probably aborted the color picking and we don't have to update the color
      // settings.
      if (useAutoColors && color === (0, _color.toHexRgb)(pageColors === null || pageColors === void 0 ? void 0 : (_pageColors$ = pageColors[0]) === null || _pageColors$ === void 0 ? void 0 : _pageColors$.bgColor)) {
        return;
      }

      _onChange({
        textColor: color,
        bgColor: bgColor,
        useAutoColors: false
      });
    },
    className: classes.foreground
  }), /*#__PURE__*/_react["default"].createElement(_ColorInput["default"], {
    title: t('backgroundColor'),
    color: bgColor,
    autoColors: useAutoColors ? pageColors.map(function (colors) {
      return colors.bgColor;
    }) : undefined,
    onChange: function onChange(color) {
      var _pageColors$2;

      // See comment on previous ColorInput onChange callback
      if (useAutoColors && color === (0, _color.toHexRgb)(pageColors === null || pageColors === void 0 ? void 0 : (_pageColors$2 = pageColors[0]) === null || _pageColors$2 === void 0 ? void 0 : _pageColors$2.bgColor)) {
        return;
      }

      _onChange({
        bgColor: color,
        textColor: textColor,
        useAutoColors: false
      });
    },
    className: classes.background
  }));
};

ColorWidget.propTypes = process.env.NODE_ENV !== "production" ? {
  containerId: _propTypes["default"].string.isRequired,
  textColor: _propTypes["default"].string.isRequired,
  bgColor: _propTypes["default"].string.isRequired,
  onChange: _propTypes["default"].func.isRequired,
  t: _propTypes["default"].func.isRequired,
  useAutoColors: _propTypes["default"].bool.isRequired,
  pageColors: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    textColor: _propTypes["default"].string,
    bgColor: _propTypes["default"].string
  })).isRequired
} : {};
var _default = ColorWidget;
exports["default"] = _default;