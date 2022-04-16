"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _colorManipulator = require("@material-ui/core/styles/colorManipulator");

var _withStyles = _interopRequireDefault(require("@material-ui/core/styles/withStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** Styles for the overlay SVG */
var styles = function styles(theme) {
  var _theme$textOverlay$ov, _theme$textOverlay, _theme$textOverlay$se, _theme$textOverlay2, _theme$textOverlay$se2, _theme$textOverlay3, _theme$textOverlay$se3, _theme$textOverlay4;

  return {
    textOverlay: {
      'font-family': (_theme$textOverlay$ov = theme === null || theme === void 0 ? void 0 : (_theme$textOverlay = theme.textOverlay) === null || _theme$textOverlay === void 0 ? void 0 : _theme$textOverlay.overlayFont) !== null && _theme$textOverlay$ov !== void 0 ? _theme$textOverlay$ov : 'sans-serif',
      '& ::selection': {
        fill: (_theme$textOverlay$se = theme === null || theme === void 0 ? void 0 : (_theme$textOverlay2 = theme.textOverlay) === null || _theme$textOverlay2 === void 0 ? void 0 : _theme$textOverlay2.selectionTextColor) !== null && _theme$textOverlay$se !== void 0 ? _theme$textOverlay$se : 'rgba(255, 255, 255, 1)',
        // For Chrome
        color: (_theme$textOverlay$se2 = theme === null || theme === void 0 ? void 0 : (_theme$textOverlay3 = theme.textOverlay) === null || _theme$textOverlay3 === void 0 ? void 0 : _theme$textOverlay3.selectionTextColor) !== null && _theme$textOverlay$se2 !== void 0 ? _theme$textOverlay$se2 : 'rgba(255, 255, 255, 1)',
        // For Firefox
        'background-color': (_theme$textOverlay$se3 = theme === null || theme === void 0 ? void 0 : (_theme$textOverlay4 = theme.textOverlay) === null || _theme$textOverlay4 === void 0 ? void 0 : _theme$textOverlay4.selectionBackgroundColor) !== null && _theme$textOverlay$se3 !== void 0 ? _theme$textOverlay$se3 : 'rgba(0, 55, 255, 1)'
      }
    }
  };
};
/** Check if we're running in Gecko */


function runningInGecko() {
  return navigator.userAgent.indexOf('Gecko/') >= 0;
}
/** Page Text Display component that is optimized for fast panning/zooming
 *
 * NOTE: This component is doing stuff that is NOT RECOMMENDED GENERALLY, like
 *       hacking shouldComponentUpdate to not-rerender on every prop change,
 *       setting styles manually via DOM refs, etc. This was all done to reach
 *       higher frame rates.
 */


var PageTextDisplay = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PageTextDisplay, _React$Component);

  /** Set up refs for direct transforms and pointer callback registration */
  function PageTextDisplay(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _defineProperty(_assertThisInitialized(_this), "onPointerDown", function (evt) {
      var selectable = _this.props.selectable;

      if (!selectable) {
        return;
      }

      evt.stopPropagation();
    });

    _this.containerRef = /*#__PURE__*/_react["default"].createRef();
    _this.textContainerRef = /*#__PURE__*/_react["default"].createRef();
    _this.boxContainerRef = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }
  /** Register pointerdown handler on SVG container */


  var _proto = PageTextDisplay.prototype;

  _proto.componentDidMount = function componentDidMount() {
    // FIXME: We should be able to use React for this, but it somehow doesn't work
    this.textContainerRef.current.addEventListener('pointerdown', this.onPointerDown); // For mobile Safari <= 12.2

    this.textContainerRef.current.addEventListener('touchstart', this.onPointerDown);
  }
  /** Only update the component when the source changed (i.e. we need to re-render the text).
   *
   * Yes, this is a horrible, horrible, hack, that will bite us in the behind at
   * some point, and is going to trip someone up terribly while debugging in the future,
   * but this *seriously* helps with performance.
   */
  ;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var source = this.props.source;
    return nextProps.source !== source;
  }
  /** Swallow pointer events if selection is enabled */
  ;

  /** Update the CSS transforms for the SVG container, i.e. scale and move the text overlay
   *
   * Intended to be called by the parent component. We use direct DOM access for this instead
   * of props since it is *significantly* faster (30fps vs 60fps on my machine).
   */
  _proto.updateTransforms = function updateTransforms(scaleFactor, x, y) {
    if (!this.containerRef.current) {
      return;
    }

    var _this$props = this.props,
        width = _this$props.width,
        height = _this$props.height; // Scaling is done from the center of the container, so we have to update the
    // horizontal and vertical offsets we got from OSD.

    var translateX = (scaleFactor - 1) * width / 2 + x * scaleFactor * -1;
    var translateY = (scaleFactor - 1) * height / 2 + y * scaleFactor * -1;
    var containerTransforms = ["translate(" + translateX + "px, " + translateY + "px)", "scale(" + scaleFactor + ")"];
    this.containerRef.current.style.display = null;
    this.containerRef.current.style.transform = containerTransforms.join(' ');
  }
  /** Update the opacity of the text and rects in the SVG.
   *
   * Again, intended to be called from the parent, again for performance reasons.
   */
  ;

  _proto.updateColors = function updateColors(textColor, bgColor, opacity) {
    if (!this.textContainerRef.current || !this.boxContainerRef.current) {
      return;
    } // We need to apply the colors to the individual rects and texts instead of
    // one of the containers, since otherwise the user's selection highlight would
    // become transparent as well or disappear entirely.


    for (var _iterator = _createForOfIteratorHelperLoose(this.boxContainerRef.current.querySelectorAll('rect')), _step; !(_step = _iterator()).done;) {
      var rect = _step.value;
      rect.style.fill = (0, _colorManipulator.fade)(bgColor, opacity);
    }

    for (var _iterator2 = _createForOfIteratorHelperLoose(this.textContainerRef.current.querySelectorAll('text')), _step2; !(_step2 = _iterator2()).done;) {
      var text = _step2.value;
      text.style.fill = (0, _colorManipulator.fade)(textColor, opacity);
    }
  }
  /** Update the selectability of the text nodes.
   *
   * Again, intended to be called from the parent, again for performance reasons.
   */
  ;

  _proto.updateSelectability = function updateSelectability(selectable) {
    if (!this.textContainerRef.current) {
      return;
    }

    this.textContainerRef.current.parentElement.style.userSelect = selectable ? 'text' : 'none';
  }
  /** Render the page overlay */
  ;

  _proto.render = function render() {
    var _this$props2 = this.props,
        selectable = _this$props2.selectable,
        visible = _this$props2.visible,
        lines = _this$props2.lines,
        pageWidth = _this$props2.width,
        pageHeight = _this$props2.height,
        opacity = _this$props2.opacity,
        textColor = _this$props2.textColor,
        bgColor = _this$props2.bgColor,
        useAutoColors = _this$props2.useAutoColors,
        pageColors = _this$props2.pageColors,
        classes = _this$props2.classes;
    var containerStyle = {
      // This attribute seems to be the key to enable GPU-accelerated scaling and translation
      // (without using translate3d) and achieve 60fps on a regular laptop even with huge objects.
      willChange: 'transform',
      position: 'absolute',
      display: 'none' // will be cleared by first update

    };
    var svgStyle = {
      left: 0,
      top: 0,
      width: pageWidth,
      height: pageHeight,
      userSelect: selectable ? 'text' : 'none',
      whiteSpace: 'pre'
    };
    var fg = textColor;
    var bg = bgColor;

    if (useAutoColors && pageColors) {
      fg = pageColors.textColor;
      bg = pageColors.bgColor;
    }

    var renderOpacity = !visible && selectable ? 0 : opacity;
    var boxStyle = {
      fill: (0, _colorManipulator.fade)(bg, renderOpacity)
    };
    var textStyle = {
      fill: (0, _colorManipulator.fade)(fg, renderOpacity)
    };
    var renderLines = lines.filter(function (l) {
      return l.width > 0 && l.height > 0;
    });
    /* Firefox/Gecko does not currently support the lengthAdjust parameter on
     * <tspan> Elements, only on <text> (https://bugzilla.mozilla.org/show_bug.cgi?id=890692).
     *
     * Using <text> elements for spans (and skipping the line-grouping) works fine
     * in Firefox, but breaks selection behavior in Chrome (the selected text contains
     * a newline after every word).
     *
     * So we have to go against best practices and use user agent sniffing to determine dynamically
     * how to render lines and spans, sorry :-/ */

    var isGecko = runningInGecko(); // eslint-disable-next-line require-jsdoc

    var LineWrapper = function LineWrapper(_ref) {
      var children = _ref.children;
      return /*#__PURE__*/_react["default"].createElement("text", {
        style: textStyle
      }, children);
    }; // eslint-disable-next-line react/jsx-props-no-spreading, require-jsdoc


    var SpanElem = function SpanElem(props) {
      return /*#__PURE__*/_react["default"].createElement("tspan", props);
    };

    if (isGecko) {
      // NOTE: Gecko really works best with a flattened bunch of text nodes. Wrapping the
      //       lines in a <g>, e.g. breaks text selection in similar ways to the below
      //       WebKit-specific note, for some reason ¯\_(ツ)_/¯
      LineWrapper = _react["default"].Fragment; // eslint-disable-next-line react/jsx-props-no-spreading, require-jsdoc

      SpanElem = function SpanElem(props) {
        return /*#__PURE__*/_react["default"].createElement("text", _extends({
          style: textStyle
        }, props));
      };
    }

    return /*#__PURE__*/_react["default"].createElement("div", {
      ref: this.containerRef,
      style: containerStyle
    }, /*#__PURE__*/_react["default"].createElement("svg", {
      style: _extends({}, svgStyle, {
        userSelect: 'none'
      })
    }, /*#__PURE__*/_react["default"].createElement("g", {
      ref: this.boxContainerRef
    }, renderLines.map(function (line) {
      return /*#__PURE__*/_react["default"].createElement("rect", {
        key: "rect-" + line.x + "." + line.y,
        x: line.x,
        y: line.y,
        width: line.width,
        height: line.height,
        style: boxStyle
      });
    }))), /*#__PURE__*/_react["default"].createElement("svg", {
      style: _extends({}, svgStyle, {
        position: 'absolute'
      }),
      className: classes.textOverlay
    }, /*#__PURE__*/_react["default"].createElement("g", {
      ref: this.textContainerRef
    }, renderLines.map(function (line) {
      return line.spans ? /*#__PURE__*/_react["default"].createElement(LineWrapper, {
        key: "line-" + line.x + "-" + line.y
      }, line.spans.filter(function (w) {
        return w.width > 0 && w.height > 0;
      }).map(function (_ref2) {
        var x = _ref2.x,
            y = _ref2.y,
            width = _ref2.width,
            text = _ref2.text;
        return /*#__PURE__*/_react["default"].createElement(SpanElem, {
          key: "text-" + x + "-" + y,
          x: x,
          y: line.y + line.height * 0.75,
          textLength: width,
          fontSize: line.height * 0.75 + "px",
          lengthAdjust: "spacingAndGlyphs"
        }, text);
      })) : /*#__PURE__*/_react["default"].createElement("text", {
        key: "line-" + line.x + "-" + line.y,
        x: line.x,
        y: line.y + line.height * 0.75,
        textLength: line.width,
        fontSize: line.height + "px",
        lengthAdjust: "spacingAndGlyphs",
        style: textStyle
      }, line.text);
    }))));
  };

  return PageTextDisplay;
}(_react["default"].Component);

PageTextDisplay.propTypes = process.env.NODE_ENV !== "production" ? {
  classes: _propTypes["default"].objectOf(_propTypes["default"].string),
  selectable: _propTypes["default"].bool.isRequired,
  visible: _propTypes["default"].bool.isRequired,
  opacity: _propTypes["default"].number.isRequired,
  textColor: _propTypes["default"].string.isRequired,
  bgColor: _propTypes["default"].string.isRequired,
  useAutoColors: _propTypes["default"].bool.isRequired,
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  lines: _propTypes["default"].array.isRequired,
  source: _propTypes["default"].string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageColors: _propTypes["default"].object
} : {};
PageTextDisplay.defaultProps = {
  classes: {},
  pageColors: undefined
};

var _default = (0, _withStyles["default"])(styles)(PageTextDisplay);

exports["default"] = _default;
module.exports = exports.default;