"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _makeStyles = _interopRequireDefault(require("@material-ui/core/styles/makeStyles"));

var _color = require("../../lib/color");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable jsx-a11y/label-has-associated-control */
var useStyles = (0, _makeStyles["default"])({
  container: {
    width: 48,
    height: 48,
    padding: 8,
    boxSizing: 'border-box'
  },
  input: {
    display: 'inline-block',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: function backgroundColor(_ref) {
      var color = _ref.color,
          autoColors = _ref.autoColors;
      var validColors = (autoColors !== null && autoColors !== void 0 ? autoColors : []).filter(function (c) {
        return c;
      });

      if (validColors.length !== 2) {
        var _validColors$;

        return (_validColors$ = validColors === null || validColors === void 0 ? void 0 : validColors[0]) !== null && _validColors$ !== void 0 ? _validColors$ : color;
      }

      return color;
    },
    backgroundImage: function backgroundImage(_ref2) {
      var _validColors$2, _validColors$3;

      var color = _ref2.color,
          autoColors = _ref2.autoColors;
      var validColors = (autoColors !== null && autoColors !== void 0 ? autoColors : []).filter(function (c) {
        return c;
      });

      if (validColors.length !== 2) {
        return 'none';
      }

      return "linear-gradient(90deg, " + ((_validColors$2 = validColors[0]) !== null && _validColors$2 !== void 0 ? _validColors$2 : color) + " 50%, " + ((_validColors$3 = validColors[1]) !== null && _validColors$3 !== void 0 ? _validColors$3 : color) + " 50%)";
    }
  }
});
/** Input to select a color */

var ColorInput = function ColorInput(_ref3) {
  var color = _ref3.color,
      _onChange = _ref3.onChange,
      title = _ref3.title,
      autoColors = _ref3.autoColors,
      className = _ref3.className;
  var classes = useStyles({
    color: color,
    autoColors: autoColors
  }); // We rely on the browser behavior that clicking on an input's label is equivalent
  // to clicking the input to show a custom color picker button.
  // However, mobile Safari doesn't show the picker if we `display: none` the actual input,
  // so we use some CSS voodoo (Tailwind's `sr-only` utility) to visually hide it...

  return /*#__PURE__*/_react["default"].createElement("label", {
    className: classes.container + " " + className
  }, /*#__PURE__*/_react["default"].createElement("div", {
    title: title,
    className: "MuiPaper-elevation2 " + classes.input
  }), /*#__PURE__*/_react["default"].createElement("input", {
    type: "color",
    value: (0, _color.toHexRgb)(autoColors && autoColors[0] ? autoColors[0] : color),
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0
    },
    onChange: function onChange(evt) {
      return _onChange(evt.target.value);
    },
    onInput: function onInput(evt) {
      return _onChange(evt.target.value);
    }
  }));
};

ColorInput.propTypes = process.env.NODE_ENV !== "production" ? {
  className: _propTypes["default"].string,
  color: _propTypes["default"].string.isRequired,
  onChange: _propTypes["default"].func.isRequired,
  title: _propTypes["default"].string.isRequired,
  autoColors: _propTypes["default"].arrayOf(_propTypes["default"].string)
} : {};
ColorInput.defaultProps = {
  autoColors: undefined,
  className: ''
};
var _default = ColorInput;
exports["default"] = _default;