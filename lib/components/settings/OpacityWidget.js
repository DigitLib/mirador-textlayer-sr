"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _makeStyles = _interopRequireDefault(require("@material-ui/core/styles/makeStyles"));

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _colorManipulator = require("@material-ui/core/styles/colorManipulator");

var _core = require("@material-ui/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var useStyles = (0, _makeStyles["default"])(function (_ref) {
  var _root;

  var palette = _ref.palette,
      breakpoints = _ref.breakpoints;
  var bubbleBg = palette.shades.main;
  return {
    root: (_root = {
      backgroundColor: (0, _colorManipulator.fade)(bubbleBg, 0.8),
      borderRadius: [[0, 0, 25, 25]],
      height: 150,
      padding: [[16, 8, 8, 8]],
      position: 'absolute',
      top: 48,
      zIndex: 100
    }, _root[breakpoints.down('sm')] = {
      top: 'auto',
      right: 48,
      height: 'auto',
      width: 150,
      borderRadius: [[25, 0, 0, 25]],
      // Truncate right box shadow
      clipPath: 'inset(-8px 0 -8px -8px)',
      paddingTop: 12,
      paddingBottom: 2
    }, _root)
  };
});
/** Widget to control the opacity of the displayed text */

var OpacityWidget = function OpacityWidget(_ref2) {
  var opacity = _ref2.opacity,
      _onChange = _ref2.onChange,
      t = _ref2.t;
  var classes = useStyles();
  var theme = (0, _core.useTheme)();
  var isSmallDisplay = (0, _useMediaQuery["default"])(theme.breakpoints.down('sm'));
  return /*#__PURE__*/_react["default"].createElement("div", {
    "data-test-id": "text-opacity-slider",
    id: "text-opacity-slider",
    "aria-labelledby": "text-opacity-slider-label",
    className: "MuiPaper-elevation4 " + classes.root
  }, /*#__PURE__*/_react["default"].createElement(_Slider["default"], {
    orientation: isSmallDisplay ? 'horizontal' : 'vertical',
    min: 1,
    max: 100,
    value: opacity * 100,
    getAriaValueText: function getAriaValueText(value) {
      return t('opacityCurrentValue', {
        value: value
      });
    },
    onChange: function onChange(evt, val) {
      return _onChange(val / 100.0);
    }
  }));
};

OpacityWidget.propTypes = process.env.NODE_ENV !== "production" ? {
  opacity: _propTypes["default"].number.isRequired,
  onChange: _propTypes["default"].func.isRequired,
  t: _propTypes["default"].func.isRequired
} : {};
var _default = OpacityWidget;
exports["default"] = _default;
module.exports = exports.default;