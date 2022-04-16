"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _MiradorMenuButton = require("mirador/dist/es/src/components/MiradorMenuButton");

var _TextFields = _interopRequireDefault(require("@material-ui/icons/TextFields"));

var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));

var _Subject = _interopRequireDefault(require("@material-ui/icons/Subject"));

var _Opacity = _interopRequireDefault(require("@material-ui/icons/Opacity"));

var _Palette = _interopRequireDefault(require("@material-ui/icons/Palette"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _useTheme2 = _interopRequireDefault(require("@material-ui/core/styles/useTheme"));

var _makeStyles = _interopRequireDefault(require("@material-ui/core/styles/makeStyles"));

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _colorManipulator = require("@material-ui/core/styles/colorManipulator");

var _TextSelectIcon = _interopRequireDefault(require("../TextSelectIcon"));

var _ButtonContainer = _interopRequireDefault(require("./ButtonContainer"));

var _OpacityWidget = _interopRequireDefault(require("./OpacityWidget"));

var _ColorWidget = _interopRequireDefault(require("./ColorWidget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var useStyles = (0, _makeStyles["default"])(function (_ref) {
  var _bubbleContainer;

  var palette = _ref.palette,
      breakpoints = _ref.breakpoints;
  var bubbleBg = palette.shades.main;
  return {
    bubbleContainer: (_bubbleContainer = {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: (0, _colorManipulator.fade)(bubbleBg, 0.8),
      borderRadius: function borderRadius(props) {
        return [[25, 25, 25, 25]];
      },
      position: 'absolute',
      right: 8,
      // The mirador-image-tools plugin renders itself at the same position,
      // so if it's active, position the menu lower
      top: function top(props) {
        return props.imageToolsEnabled ? 66 : 8;
      },
      zIndex: 999
    }, _bubbleContainer[breakpoints.down('sm')] = {
      flexDirection: 'column',
      top: function top(props) {
        return 8;
      },
      // FIXME: Needs to be a func for some reason
      right: function right(props) {
        return props.imageToolsEnabled ? 66 : 8;
      },
      borderRadius: function borderRadius(props) {
        return [[25, 25, 25, !props.textsFetching && props.open && props.showColorPicker ? 0 : 25]];
      }
    }, _bubbleContainer)
  };
});
/** Control text overlay settings  */

var OverlaySettings = function OverlaySettings(_ref2) {
  var _pageColors$map$filte, _pageColors$map$filte2;

  var windowTextOverlayOptions = _ref2.windowTextOverlayOptions,
      imageToolsEnabled = _ref2.imageToolsEnabled,
      textsAvailable = _ref2.textsAvailable,
      textsFetching = _ref2.textsFetching,
      updateWindowTextOverlayOptions = _ref2.updateWindowTextOverlayOptions,
      t = _ref2.t,
      pageColors = _ref2.pageColors,
      containerId = _ref2.containerId;
  var enabled = windowTextOverlayOptions.enabled,
      visible = windowTextOverlayOptions.visible,
      selectable = windowTextOverlayOptions.selectable,
      opacity = windowTextOverlayOptions.opacity,
      defaultTextColor = windowTextOverlayOptions.textColor,
      defaultBgColor = windowTextOverlayOptions.bgColor,
      useAutoColors = windowTextOverlayOptions.useAutoColors;

  var _useState = (0, _react.useState)(enabled && (visible || selectable)),
      open = _useState[0],
      setOpen = _useState[1];

  var _useState2 = (0, _react.useState)(false),
      showOpacitySlider = _useState2[0],
      setShowOpacitySlider = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      showColorPicker = _useState3[0],
      setShowColorPicker = _useState3[1];

  var theme = (0, _useTheme2["default"])();
  var isSmallDisplay = (0, _useMediaQuery["default"])(theme.breakpoints.down('sm'));

  var _useTheme = (0, _useTheme2["default"])(),
      palette = _useTheme.palette;

  var bubbleBg = palette.shades.main;
  var bubbleFg = palette.getContrastText(bubbleBg);
  var toggledBubbleBg = (0, _colorManipulator.fade)(bubbleFg, 0.25);
  var classes = useStyles({
    imageToolsEnabled: imageToolsEnabled,
    open: open,
    showColorPicker: showColorPicker,
    textsFetching: textsFetching
  });
  var textColor = useAutoColors ? (_pageColors$map$filte = pageColors.map(function (cs) {
    return cs.textColor;
  }).filter(function (x) {
    return x;
  })[0]) !== null && _pageColors$map$filte !== void 0 ? _pageColors$map$filte : defaultTextColor : defaultTextColor;
  var bgColor = useAutoColors ? (_pageColors$map$filte2 = pageColors.map(function (cs) {
    return cs.bgColor;
  }).filter(function (x) {
    return x;
  })[0]) !== null && _pageColors$map$filte2 !== void 0 ? _pageColors$map$filte2 : defaultBgColor : defaultBgColor;
  var showAllButtons = open && !textsFetching;

  if (!enabled || !textsAvailable) {
    return null;
  }
  /** Button for toggling the menu  */


  var toggleButton = /*#__PURE__*/_react["default"].createElement(_ButtonContainer["default"], {
    withBorder: !textsFetching && open && isSmallDisplay
  }, /*#__PURE__*/_react["default"].createElement(_MiradorMenuButton.MiradorMenuButton, {
    containerId: containerId,
    "aria-expanded": showAllButtons,
    "aria-haspopup": true,
    "aria-label": open ? t('collapseTextOverlayOptions') : t('expandTextOverlayOptions'),
    disabled: textsFetching,
    onClick: function onClick() {
      return setOpen(!open);
    }
  }, showAllButtons ? /*#__PURE__*/_react["default"].createElement(_Close["default"], null) : /*#__PURE__*/_react["default"].createElement(_Subject["default"], null)));

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "MuiPaper-elevation4 " + classes.bubbleContainer
  }, isSmallDisplay && toggleButton, showAllButtons && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_ButtonContainer["default"], {
    withBorder: true,
    paddingPrev: isSmallDisplay ? 8 : 0,
    paddingNext: 8
  }, /*#__PURE__*/_react["default"].createElement(_MiradorMenuButton.MiradorMenuButton, {
    containerId: containerId,
    "aria-label": t('textSelect'),
    onClick: function onClick() {
      return updateWindowTextOverlayOptions(_extends({}, windowTextOverlayOptions, {
        selectable: !selectable
      }));
    },
    "aria-pressed": selectable,
    style: {
      backgroundColor: selectable && toggledBubbleBg
    }
  }, /*#__PURE__*/_react["default"].createElement(_TextSelectIcon["default"], null))), /*#__PURE__*/_react["default"].createElement(_ButtonContainer["default"], {
    paddingPrev: 8
  }, /*#__PURE__*/_react["default"].createElement(_MiradorMenuButton.MiradorMenuButton, {
    containerId: containerId,
    "aria-label": t('textVisible'),
    onClick: function onClick() {
      updateWindowTextOverlayOptions(_extends({}, windowTextOverlayOptions, {
        visible: !visible
      }));

      if (showOpacitySlider && visible) {
        setShowOpacitySlider(false);
      }

      if (showColorPicker && visible) {
        setShowColorPicker(false);
      }
    },
    "aria-pressed": visible,
    style: {
      backgroundColor: visible && toggledBubbleBg
    }
  }, /*#__PURE__*/_react["default"].createElement(_TextFields["default"], null))), /*#__PURE__*/_react["default"].createElement(_ButtonContainer["default"], null, /*#__PURE__*/_react["default"].createElement(_MiradorMenuButton.MiradorMenuButton, {
    id: "text-opacity-slider-label",
    containerId: containerId,
    disabled: !visible,
    "aria-label": t('textOpacity'),
    "aria-controls": "text-opacity-slider",
    "aria-expanded": showOpacitySlider,
    onClick: function onClick() {
      return setShowOpacitySlider(!showOpacitySlider);
    },
    style: {
      backgroundColor: showOpacitySlider && (0, _colorManipulator.fade)(bubbleFg, 0.1)
    }
  }, /*#__PURE__*/_react["default"].createElement(_Opacity["default"], null)), visible && showOpacitySlider && /*#__PURE__*/_react["default"].createElement(_OpacityWidget["default"], {
    t: t,
    opacity: opacity,
    onChange: function onChange(newOpacity) {
      return updateWindowTextOverlayOptions(_extends({}, windowTextOverlayOptions, {
        opacity: newOpacity
      }));
    }
  })), /*#__PURE__*/_react["default"].createElement(_ButtonContainer["default"], {
    withBorder: !isSmallDisplay,
    paddingNext: isSmallDisplay ? 0 : 8
  }, /*#__PURE__*/_react["default"].createElement(_MiradorMenuButton.MiradorMenuButton, {
    id: "color-picker-label",
    containerId: containerId,
    disabled: !visible,
    "aria-label": t('colorPicker'),
    "aria-controls": "color-picker",
    "aria-expanded": showColorPicker,
    onClick: function onClick() {
      return setShowColorPicker(!showColorPicker);
    },
    style: {
      backgroundColor: showColorPicker && (0, _colorManipulator.fade)(bubbleFg, 0.1)
    }
  }, /*#__PURE__*/_react["default"].createElement(_Palette["default"], null)), visible && showColorPicker && /*#__PURE__*/_react["default"].createElement(_ColorWidget["default"], {
    t: t,
    containerId: containerId,
    bgColor: bgColor,
    textColor: textColor,
    pageColors: pageColors,
    useAutoColors: useAutoColors,
    onChange: function onChange(newOpts) {
      return updateWindowTextOverlayOptions(_extends({}, windowTextOverlayOptions, newOpts));
    }
  }))), textsFetching && /*#__PURE__*/_react["default"].createElement(_CircularProgress["default"], {
    disableShrink: true,
    size: 50,
    style: {
      position: 'absolute'
    }
  }), !isSmallDisplay && toggleButton);
};

OverlaySettings.propTypes = process.env.NODE_ENV !== "production" ? {
  containerId: _propTypes["default"].string.isRequired,
  imageToolsEnabled: _propTypes["default"].bool.isRequired,
  t: _propTypes["default"].func.isRequired,
  textsAvailable: _propTypes["default"].bool.isRequired,
  textsFetching: _propTypes["default"].bool.isRequired,
  updateWindowTextOverlayOptions: _propTypes["default"].func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  windowTextOverlayOptions: _propTypes["default"].object.isRequired,
  pageColors: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    textColor: _propTypes["default"].string,
    bgColor: _propTypes["default"].string
  })).isRequired
} : {};
var _default = OverlaySettings;
exports["default"] = _default;
module.exports = exports.default;