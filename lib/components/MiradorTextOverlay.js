"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _PageTextDisplay = _interopRequireDefault(require("./PageTextDisplay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** Overlay that renders OCR or transcription text in a SVG.
 *
 * Synchronizes the text position to the underlying OpenSeadragon viewer viewport so that
 * every line or word (depending on the granularity of the text/transcription) is rendered
 * at the correct position.
 */
var MiradorTextOverlay = /*#__PURE__*/function (_Component) {
  _inheritsLoose(MiradorTextOverlay, _Component);

  /** Register refs that allow us to directly access the actual render components */
  function MiradorTextOverlay(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _defineProperty(_assertThisInitialized(_this), "shouldRenderPage", function (_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          lines = _ref.lines;

      return lines && lines.length > 0 && lines.some(function (_ref2) {
        var text = _ref2.text,
            spans = _ref2.spans;
        return text || spans && spans.length > 0;
      });
    });

    _this.renderRefs = [/*#__PURE__*/_react["default"].createRef(), /*#__PURE__*/_react["default"].createRef()];
    _this.containerRef = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }
  /** Register OpenSeadragon callback on initial mount */


  var _proto = MiradorTextOverlay.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props = this.props,
        enabled = _this$props.enabled,
        viewer = _this$props.viewer;

    if (enabled && viewer) {
      this.registerOsdCallback();
    }

    this.patchAnnotationOverlay();
  }
  /** Register OpenSeadragon callback when viewport changes */
  ;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props2 = this.props,
        enabled = _this$props2.enabled,
        viewer = _this$props2.viewer,
        pageTexts = _this$props2.pageTexts,
        textColor = _this$props2.textColor,
        bgColor = _this$props2.bgColor,
        useAutoColors = _this$props2.useAutoColors,
        visible = _this$props2.visible,
        selectable = _this$props2.selectable;
    var opacity = this.props.opacity;
    this.patchAnnotationOverlay(); // OSD instance becomes available, register callback

    if (enabled && viewer && viewer !== prevProps.viewer) {
      this.registerOsdCallback();
    } // Newly enabled, force initial setting of state from OSD


    var newlyEnabled = this.shouldRender() && !this.shouldRender(prevProps) || pageTexts.filter(this.shouldRenderPage).length !== prevProps.pageTexts.filter(this.shouldRenderPage).length;

    if (newlyEnabled) {
      this.onUpdateViewport();
    }

    if (selectable !== prevProps.selectable) {
      this.renderRefs.filter(function (ref) {
        return ref.current;
      }).forEach(function (ref) {
        return ref.current.updateSelectability(selectable);
      });
    } // Manually update SVG colors for performance reasons
    // eslint-disable-next-line require-jsdoc


    var hasPageColors = function hasPageColors(text) {
      if (text === void 0) {
        text = {};
      }

      return text.textColor !== undefined;
    };

    if (visible !== prevProps.visible || opacity !== prevProps.opacity || bgColor !== prevProps.bgColor || textColor !== prevProps.textColor || useAutoColors !== prevProps.useAutoColors || pageTexts.filter(hasPageColors).length !== prevProps.pageTexts.filter(hasPageColors).length) {
      if (!visible) {
        opacity = 0;
      }

      this.renderRefs.forEach(function (ref, idx) {
        if (!ref.current) {
          return;
        }

        var fg = textColor;
        var bg = bgColor;

        if (useAutoColors) {
          var _pageTexts$idx = pageTexts[idx],
              newFg = _pageTexts$idx.textColor,
              newBg = _pageTexts$idx.bgColor;

          if (newFg) {
            fg = newFg;
            bg = newBg;
          }
        }

        ref.current.updateColors(fg, bg, opacity);
      });
    }
  }
  /** OpenSeadragon viewport update callback */
  ;

  _proto.onUpdateViewport = function onUpdateViewport() {
    // Do nothing if the overlay is not currently rendered
    if (!this.shouldRender) {
      return;
    }

    var _this$props3 = this.props,
        viewer = _this$props3.viewer,
        canvasWorld = _this$props3.canvasWorld; // Determine new scale factor and position for each page

    var vpBounds = viewer.viewport.getBounds(true);
    var viewportZoom = viewer.viewport.getZoom(true);

    if (this.containerRef.current) {
      var _viewer$container = viewer.container,
          containerWidth = _viewer$container.clientWidth,
          containerHeight = _viewer$container.clientHeight;
      var flip = viewer.viewport.getFlip();
      var rotation = viewer.viewport.getRotation();
      var transforms = [];

      if (flip) {
        transforms.push("translate(" + containerWidth + "px, 0px)");
        transforms.push('scale(-1, 1)');
      }

      if (rotation !== 0) {
        switch (rotation) {
          case 90:
            transforms.push("translate(" + containerWidth + "px, 0px)");
            break;

          case 180:
            transforms.push("translate(" + containerWidth + "px, " + containerHeight + "px)");
            break;

          case 270:
            transforms.push("translate(0px, " + containerHeight + "px)");
            break;

          default:
            console.error("Unsupported rotation: " + rotation);
        }

        transforms.push("rotate(" + rotation + "deg)");
      }

      this.containerRef.current.style.transform = transforms.join(' ');
    }

    for (var itemNo = 0; itemNo < viewer.world.getItemCount(); itemNo += 1) {
      // Skip update if we don't have a reference to the PageTextDisplay instance
      if (!this.renderRefs[itemNo].current) {
        // eslint-disable-next-line no-continue
        continue;
      }

      var img = viewer.world.getItemAt(itemNo);
      var canvasDims = canvasWorld.canvasDimensions[itemNo];
      var canvasWorldOffset = itemNo > 0 ? img.source.dimensions.x - canvasDims.width + canvasWorld.canvasDimensions[itemNo - 1].width : 0;
      var canvasWorldScale = img.source.dimensions.x / canvasDims.width;
      this.renderRefs[itemNo].current.updateTransforms(img.viewportToImageZoom(viewportZoom), vpBounds.x * canvasWorldScale - canvasWorldOffset, vpBounds.y * canvasWorldScale);
    }
  }
  /** If the page should be rendered */
  ;

  /** If the overlay should be rendered at all */
  _proto.shouldRender = function shouldRender(props) {
    var _ref3 = props !== null && props !== void 0 ? props : this.props,
        enabled = _ref3.enabled,
        pageTexts = _ref3.pageTexts;

    return enabled && pageTexts.length > 0;
  }
  /** Update container dimensions and page scale/offset every time the OSD viewport changes. */
  ;

  _proto.registerOsdCallback = function registerOsdCallback() {
    var viewer = this.props.viewer;
    viewer.addHandler('update-viewport', this.onUpdateViewport.bind(this));
  }
  /**
   * Patch the neighboring AnnotationOverlay container to work with the text overlay.
   *
   * FIXME: This is almost criminally hacky and brittle.
   *
   * If Mirador renders an annotation overlay, it can either:
   * - be rendered above the text overlay and intercept pointer events,
   *   preventing selection
   * - or be rendered below the text overlay, i.e. we occlude the annotations
   *
   * To fix both cases, we hard-code the z-index on the annotation overlay so
   * it's always above us and set `pointer-events` to `none` if selectability
   * is active (this has the effect of the annotation overlay becoming
   * 'transparent' to pointer events, i.e. they reach us and allow the user
   * to select text).
   *
   * We have to resort to manual DOM-wrangling since an attempt at using a
   * wrapping plugin component around `AnnotationOverlay` fails on multiple
   * levels:
   * - Adjusting the styles on the wrapping element itself fails since the
   *   annotation overlay renders with `React.createPortal`, i.e. outside of the
   *   plugin components's DOM subtree.
   * - Accessing the `ref` on `AnnotationOverlay` fails since we can't get a
   *   handle on it via `props.children` in the wrapping component
   *
   *  So this is it, it's ugly, it's brittle, it's painful, but it works (for now...).
   */
  ;

  _proto.patchAnnotationOverlay = function patchAnnotationOverlay() {
    var _this$containerRef$cu, _this$containerRef$cu2;

    var _this$props4 = this.props,
        enabled = _this$props4.enabled,
        selectable = _this$props4.selectable;

    if (!enabled) {
      return;
    }

    var annoCanvasContainer = (_this$containerRef$cu = this.containerRef.current) === null || _this$containerRef$cu === void 0 ? void 0 : (_this$containerRef$cu2 = _this$containerRef$cu.parentElement // This selector will currently only match the AnnotationOverlay's `canvas` node
    .querySelector('div.openseadragon-canvas > div > canvas')) === null || _this$containerRef$cu2 === void 0 ? void 0 : _this$containerRef$cu2.parentElement;

    if (annoCanvasContainer) {
      annoCanvasContainer.style.zIndex = 100;
      annoCanvasContainer.style.pointerEvents = selectable ? 'none' : null;
    }
  }
  /** Render the text overlay SVG */
  ;

  _proto.render = function render() {
    var _this2 = this;

    var _this$props5 = this.props,
        pageTexts = _this$props5.pageTexts,
        selectable = _this$props5.selectable,
        visible = _this$props5.visible,
        viewer = _this$props5.viewer,
        opacity = _this$props5.opacity,
        textColor = _this$props5.textColor,
        bgColor = _this$props5.bgColor,
        useAutoColors = _this$props5.useAutoColors,
        fontFamily = _this$props5.fontFamily;

    if (!this.shouldRender() || !viewer || !pageTexts) {
      return null;
    }

    return /*#__PURE__*/_reactDom["default"].createPortal( /*#__PURE__*/_react["default"].createElement("div", {
      ref: this.containerRef,
      style: {
        position: 'absolute',
        display: selectable || visible ? null : 'none'
      }
    }, pageTexts.map(function (page, idx) {
      if (!page || !_this2.shouldRenderPage(page)) {
        return null;
      }

      var lines = page.lines,
          source = page.source,
          pageWidth = page.width,
          pageHeight = page.height,
          pageFg = page.textColor,
          pageBg = page.bgColor;
      return /*#__PURE__*/_react["default"].createElement(_PageTextDisplay["default"], {
        ref: _this2.renderRefs[idx],
        key: source,
        lines: lines,
        source: source,
        selectable: selectable,
        visible: visible,
        opacity: opacity,
        width: pageWidth,
        height: pageHeight,
        textColor: textColor,
        fontFamily: fontFamily,
        bgColor: bgColor,
        useAutoColors: useAutoColors,
        pageColors: pageFg ? {
          textColor: pageFg,
          bgColor: pageBg
        } : undefined
      });
    })), viewer.canvas);
  };

  return MiradorTextOverlay;
}(_react.Component);

MiradorTextOverlay.propTypes = process.env.NODE_ENV !== "production" ? {
  canvasWorld: _propTypes["default"].object,
  // eslint-disable-line react/forbid-prop-types
  enabled: _propTypes["default"].bool,
  opacity: _propTypes["default"].number,
  pageTexts: _propTypes["default"].array,
  // eslint-disable-line react/forbid-prop-types
  selectable: _propTypes["default"].bool,
  viewer: _propTypes["default"].object,
  // eslint-disable-line react/forbid-prop-types
  visible: _propTypes["default"].bool,
  textColor: _propTypes["default"].string,
  fontFamily: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)]),
  bgColor: _propTypes["default"].string,
  useAutoColors: _propTypes["default"].bool
} : {};
MiradorTextOverlay.defaultProps = {
  canvasWorld: undefined,
  enabled: true,
  opacity: 0.75,
  pageTexts: undefined,
  selectable: true,
  viewer: undefined,
  visible: false,
  textColor: '#000000',
  fontFamily: undefined,
  bgColor: '#ffffff',
  useAutoColors: true
};
var _default = MiradorTextOverlay;
exports["default"] = _default;
module.exports = exports.default;