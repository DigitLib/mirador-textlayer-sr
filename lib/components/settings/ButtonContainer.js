"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _makeStyles = _interopRequireDefault(require("@material-ui/core/styles/makeStyles"));

var _colorManipulator = require("@material-ui/core/styles/colorManipulator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var useStyles = (0, _makeStyles["default"])(function (_ref) {
  var _root;

  var palette = _ref.palette,
      breakpoints = _ref.breakpoints;
  var bubbleBg = palette.shades.main;
  var bubbleFg = palette.getContrastText(bubbleBg);
  var borderImgRight = 'linear-gradient(' + ("to bottom, " + (0, _colorManipulator.fade)(bubbleFg, 0) + " 20%, ") + ((0, _colorManipulator.fade)(bubbleFg, 0.2) + " 20% 80%, ") + ((0, _colorManipulator.fade)(bubbleFg, 0) + " 80%)");
  var borderImgBottom = borderImgRight.replace('to bottom', 'to right');
  return {
    root: (_root = {
      display: 'flex',
      padding: function padding(_ref2) {
        var paddingPrev = _ref2.paddingPrev,
            paddingNext = _ref2.paddingNext;
        return [[0, paddingNext !== null && paddingNext !== void 0 ? paddingNext : 0, 0, paddingPrev !== null && paddingPrev !== void 0 ? paddingPrev : 0]];
      },
      borderRight: function borderRight(_ref3) {
        var withBorder = _ref3.withBorder;
        return withBorder ? "1px solid " + (0, _colorManipulator.fade)(bubbleFg, 0.2) : 'none';
      },
      borderImageSlice: function borderImageSlice(_ref4) {
        var withBorder = _ref4.withBorder;
        return withBorder ? 1 : 'unset';
      },
      borderImageSource: borderImgRight,
      flexDirection: 'column'
    }, _root[breakpoints.down('sm')] = {
      flexDirection: 'row',
      borderRight: function borderRight(props) {
        return 'none';
      },
      // FIXME: Needs to be a func for some reason
      borderBottom: function borderBottom(_ref5) {
        var withBorder = _ref5.withBorder;
        return withBorder ? "1px solid " + (0, _colorManipulator.fade)(bubbleFg, 0.2) : 'none';
      },
      borderImageSource: borderImgBottom,
      padding: function padding(_ref6) {
        var paddingPrev = _ref6.paddingPrev,
            paddingNext = _ref6.paddingNext;
        return [[paddingPrev !== null && paddingPrev !== void 0 ? paddingPrev : 0, 0, paddingNext !== null && paddingNext !== void 0 ? paddingNext : 0, 0]];
      }
    }, _root)
  };
});
/** Container for a settings button */

var ButtonContainer = function ButtonContainer(_ref7) {
  var children = _ref7.children,
      withBorder = _ref7.withBorder,
      paddingPrev = _ref7.paddingPrev,
      paddingNext = _ref7.paddingNext;
  var classes = useStyles({
    withBorder: withBorder,
    paddingPrev: paddingPrev,
    paddingNext: paddingNext
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.root
  }, children);
};

ButtonContainer.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes["default"].node.isRequired,
  withBorder: _propTypes["default"].bool,
  paddingNext: _propTypes["default"].number,
  paddingPrev: _propTypes["default"].number
} : {};
ButtonContainer.defaultProps = {
  withBorder: false,
  paddingNext: undefined,
  paddingPrev: undefined
};
var _default = ButtonContainer;
exports["default"] = _default;
module.exports = exports.default;