"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TextSelectIcon;

var _react = _interopRequireDefault(require("react"));

var _SvgIcon = _interopRequireDefault(require("@material-ui/core/SvgIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * TextSelectIcon ~
 */
function TextSelectIcon(props) {
  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-props-no-spreading
    _react["default"].createElement(_SvgIcon["default"], _extends({
      viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/_react["default"].createElement("path", {
      d: "M13 19a1 1 0 0 0 1 1h2v2h-2.5c-.55 0-1.5-.45-1.5-1c0 .55-.95 1-1.5 1H8v-2h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H8V2h2.5c.55 0 1.5.45 1.5 1c0-.55.95-1 1.5-1H16v2h-2a1 1 0 0 0-1 1v14z"
    }))
  );
}