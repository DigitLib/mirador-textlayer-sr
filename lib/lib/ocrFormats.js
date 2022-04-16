"use strict";

exports.__esModule = true;
exports.parseAlto = parseAlto;
exports.parseHocr = parseHocr;
exports.parseIiifAnnotations = parseIiifAnnotations;
exports.parseOcr = parseOcr;

var _max = _interopRequireDefault(require("lodash/max"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var parser = new DOMParser();
/** Parse hOCR attributes from a node's title attribute */

function parseHocrAttribs(titleAttrib) {
  var vals = titleAttrib.split(';').map(function (x) {
    return x.trim();
  });
  return vals.reduce(function (acc, val) {
    var key = val.split(' ')[0]; // Special handling for bounding boxes, convert them to a number[4]

    if (key === 'bbox') {
      acc[key] = val.split(' ').slice(1, 5).map(function (x) {
        return Number.parseInt(x, 10);
      });
    } else {
      acc[key] = val.split(' ').slice(1, 5).join(' ');
    }

    return acc;
  }, {});
}
/** Parse an hOCR node */


function parseHocrNode(node, endOfLine, scaleFactor) {
  if (endOfLine === void 0) {
    endOfLine = false;
  }

  if (scaleFactor === void 0) {
    scaleFactor = 1;
  }

  var _parseHocrAttribs$bbo = parseHocrAttribs(node.title).bbox.map(function (dim) {
    return dim * scaleFactor;
  }),
      ulx = _parseHocrAttribs$bbo[0],
      uly = _parseHocrAttribs$bbo[1],
      lrx = _parseHocrAttribs$bbo[2],
      lry = _parseHocrAttribs$bbo[3];

  var style = node.getAttribute('style');

  if (style) {
    style = style.replace(/font-size:.+;/, '');
  }

  var spans = [{
    height: lry - uly,
    style: style,
    text: node.textContent,
    width: lrx - ulx,
    x: ulx,
    y: uly,
    isExtra: false
  }]; // Add an extra space span if the following text node contains something

  if (node.nextSibling instanceof Text) {
    var extraText = node.nextSibling.wholeText.replace(/\s+/, ' ');

    if (endOfLine) {
      // We don't need trailing whitespace
      extraText = extraText.trimEnd();
    }

    if (extraText.length > 0) {
      spans.push({
        height: lry - uly,
        text: extraText,
        x: lrx,
        y: uly,
        // NOTE: This span has no width initially, will be set when we encounter
        //       the next word. (extra spans always fill the area between two words)
        isExtra: true
      });
    }
  }

  var lastSpan = spans.slice(-1)[0];

  if (endOfLine && lastSpan.text.slice(-1) !== "\xAD") {
    // Add newline if the line does not end on a hyphenation (a soft hyphen)
    lastSpan.text += '\n';
  }

  return spans;
}
/** Parse an hOCR document */


function parseHocr(hocrText, referenceSize) {
  var doc = parser.parseFromString(hocrText, 'text/html');
  var pageNode = doc.querySelector('div.ocr_page');
  var pageSize = parseHocrAttribs(pageNode.title).bbox;
  var scaleFactor = 1;

  if (pageSize[2] !== referenceSize.width || pageSize[3] !== referenceSize.height) {
    var scaleFactorX = referenceSize.width / pageSize[2];
    var scaleFactorY = referenceSize.height / pageSize[3];
    var scaledWidth = Math.round(scaleFactorY * pageSize[2]);
    var scaledHeight = Math.round(scaleFactorX * pageSize[3]);

    if (scaledWidth !== referenceSize.width || scaledHeight !== referenceSize.height) {
      console.warn("Differing scale factors for x and y axis: x=" + scaleFactorX + ", y=" + scaleFactorY);
    }

    scaleFactor = scaleFactorX;
  }

  var lines = []; // FIXME: Seems to be an eslint bug: https://github.com/eslint/eslint/issues/12117
  // eslint-disable-next-line no-unused-vars

  for (var _iterator = _createForOfIteratorHelperLoose(pageNode.querySelectorAll('span.ocr_line, span.ocrx_line')), _step; !(_step = _iterator()).done;) {
    var lineNode = _step.value;
    var wordNodes = lineNode.querySelectorAll('span.ocrx_word');

    if (wordNodes.length === 0) {
      lines.push(parseHocrNode(lineNode, true, scaleFactor));
    } else {
      var _spans$slice$filter;

      var line = parseHocrNode(lineNode, true, scaleFactor)[0];
      var spans = []; // eslint-disable-next-line no-unused-vars

      for (var _iterator2 = _createForOfIteratorHelperLoose(wordNodes.entries()), _step2; !(_step2 = _iterator2()).done;) {
        var _spans$slice$filter2;

        var _step2$value = _step2.value,
            i = _step2$value[0],
            wordNode = _step2$value[1];
        var textSpans = parseHocrNode(wordNode, i === wordNodes.length - 1, scaleFactor); // Calculate width of previous extra span

        var previousExtraSpan = (_spans$slice$filter2 = spans.slice(-1).filter(function (s) {
          return s.isExtra;
        })) === null || _spans$slice$filter2 === void 0 ? void 0 : _spans$slice$filter2[0];

        if (previousExtraSpan) {
          var _extraWidth = textSpans[0].x - previousExtraSpan.x;

          if (_extraWidth === 0) {
            _extraWidth = 0.0001;
            previousExtraSpan.x -= _extraWidth;
          }

          previousExtraSpan.width = _extraWidth;
        }

        spans.push.apply(spans, textSpans);
      } // Update with of extra span at end of line


      var endExtraSpan = (_spans$slice$filter = spans.slice(-1).filter(function (s) {
        return s.isExtra;
      })) === null || _spans$slice$filter === void 0 ? void 0 : _spans$slice$filter[0];

      if (endExtraSpan) {
        var extraWidth = line.x + line.width - endExtraSpan.x;

        if (extraWidth === 0) {
          extraWidth = 0.0001;
          endExtraSpan.x -= extraWidth;
        }

        endExtraSpan.width = extraWidth;
      }

      line.spans = spans;
      line.text = spans.map(function (w) {
        return w.text;
      }).join('').trim();
      lines.push(line);
    }
  }

  return {
    height: pageSize[3] * scaleFactor,
    lines: lines,
    width: pageSize[2] * scaleFactor
  };
}
/** Create CSS directives from an ALTO TextStyle node */


function altoStyleNodeToCSS(styleNode) {
  // NOTE: We don't map super/subscript, since it would change the font size
  var fontStyleMap = {
    bold: 'font-weight: bold',
    italics: 'font-style: italic',
    smallcaps: 'font-variant: small-caps',
    underline: 'text-decoration: underline'
  };
  var styles = [];

  if (styleNode.hasAttribute('FONTFAMILY')) {
    styles.push("font-family: " + styleNode.getAttribute('FONTFAMILY'));
  }

  if (styleNode.hasAttribute('FONTTYPE')) {
    styles.push("font-type: " + styleNode.getAttribute('FONTTYPE'));
  }

  if (styleNode.hasAttribute('FONTCOLOR')) {
    styles.push("color: #" + styleNode.getAttribute('FONTCOLOR'));
  }

  if (styleNode.hasAttribute('FONTSTYLE')) {
    var altoStyle = styleNode.getAttribute('FONTSTYLE');

    if (altoStyle in fontStyleMap) {
      styles.push(fontStyleMap[altoStyle]);
    }
  }

  return styles.join(';');
}
/**
 * Parse an ALTO document.
 *
 * Needs access to the (unscaled) target image size since it ALTO uses 10ths of
 * millimeters for units by default and we need pixels.
 */


function parseAlto(altoText, imgSize) {
  var _doc$querySelector;

  var doc = parser.parseFromString(altoText, 'text/xml'); // We assume ALTO is set as the default namespace

  /** Namespace resolver that forrces the ALTO namespace */

  var measurementUnit = (_doc$querySelector = doc.querySelector('alto > Description > MeasurementUnit')) === null || _doc$querySelector === void 0 ? void 0 : _doc$querySelector.textContent;
  var pageElem = doc.querySelector('alto > Layout > Page, alto > Layout > Page > PrintSpace');
  var pageWidth = Number.parseInt(pageElem.getAttribute('WIDTH'), 10);
  var pageHeight = Number.parseInt(pageElem.getAttribute('HEIGHT'), 10);
  var scaleFactorX = 1.0;
  var scaleFactorY = 1.0;

  if (measurementUnit !== 'pixel') {
    scaleFactorX = imgSize.width / pageWidth;
    scaleFactorY = imgSize.height / pageHeight;
    pageWidth *= scaleFactorX;
    pageHeight *= scaleFactorY;
  }

  var styles = {};
  var styleElems = doc.querySelectorAll('alto > Styles > TextStyle');

  for (var _iterator3 = _createForOfIteratorHelperLoose(styleElems), _step3; !(_step3 = _iterator3()).done;) {
    var styleNode = _step3.value;
    styles[styleNode.getAttribute('ID')] = altoStyleNodeToCSS(styleNode);
  }

  var hasSpaces = doc.querySelector('SP') !== null;
  var lines = [];
  var lineEndsHyphenated = false;

  for (var _iterator4 = _createForOfIteratorHelperLoose(doc.querySelectorAll('TextLine')), _step4; !(_step4 = _iterator4()).done;) {
    var lineNode = _step4.value;
    var line = {
      height: Number.parseInt(lineNode.getAttribute('HEIGHT'), 10) * scaleFactorY,
      text: '',
      width: Number.parseInt(lineNode.getAttribute('WIDTH'), 10) * scaleFactorX,
      spans: [],
      x: Number.parseInt(lineNode.getAttribute('HPOS'), 10) * scaleFactorX,
      y: Number.parseInt(lineNode.getAttribute('VPOS'), 10) * scaleFactorY
    };
    var textNodes = lineNode.querySelectorAll('String, SP, HYP');

    for (var _iterator5 = _createForOfIteratorHelperLoose(textNodes.entries()), _step5; !(_step5 = _iterator5()).done;) {
      var _step5$value = _step5.value,
          textIdx = _step5$value[0],
          textNode = _step5$value[1];
      var endOfLine = textIdx === textNodes.length - 1;
      var styleRefs = textNode.getAttribute('STYLEREFS');
      var style = null;

      if (styleRefs !== null) {
        style = styleRefs.split(' ').map(function (refId) {
          return styles[refId];
        }).filter(function (s) {
          return s !== undefined;
        }).join('');
      }

      var width = Number.parseInt(textNode.getAttribute('WIDTH'), 10) * scaleFactorX;
      var height = Number.parseInt(textNode.getAttribute('HEIGHT'), 10) * scaleFactorY;

      if (Number.isNaN(height)) {
        height = line.height;
      }

      var x = Number.parseInt(textNode.getAttribute('HPOS'), 10) * scaleFactorX;
      var y = Number.parseInt(textNode.getAttribute('VPOS'), 10) * scaleFactorY;

      if (Number.isNaN(y)) {
        y = line.y;
      }

      if (textNode.tagName === 'String' || textNode.tagName === 'HYP') {
        var _line$spans$slice$fil;

        var text = textNode.getAttribute('CONTENT'); // Update the width of a preceding extra space span to fill the area
        // between the previous word and this one.

        var previousExtraSpan = (_line$spans$slice$fil = line.spans.slice(-1).filter(function (s) {
          return s.isExtra;
        })) === null || _line$spans$slice$fil === void 0 ? void 0 : _line$spans$slice$fil[0];

        if (previousExtraSpan) {
          var extraWidth = x - previousExtraSpan.x; // Needed to force browsers to render the whitespace

          if (extraWidth === 0) {
            extraWidth = 0.0001;
            previousExtraSpan.x -= extraWidth;
          }

          previousExtraSpan.width = extraWidth;
        }

        line.spans.push({
          isExtra: false,
          x: x,
          y: y,
          width: width,
          height: height,
          text: text,
          style: style
        }); // Add extra space span if ALTO does not encode spaces itself

        if (!hasSpaces && !endOfLine) {
          line.spans.push({
            isExtra: true,
            x: x + width,
            y: y,
            height: height,
            text: ' ' // NOTE: Does not have width initially, will be set when we encounter
            //       the next proper word span

          });
        }

        lineEndsHyphenated = textNode.tagName === 'HYP';
      } else if (textNode.tagName === 'SP') {
        // Needed to force browsers to render the whitespace
        if (width === 0) {
          width = 0.0001;
          x -= width;
        }

        line.spans.push({
          isExtra: false,
          x: x,
          y: y,
          width: width,
          height: height,
          text: ' '
        });
      }
    }

    if (line.spans.length === 0) {
      continue;
    }

    if (!lineEndsHyphenated) {
      line.spans.slice(-1)[0].text += '\n';
    }

    lineEndsHyphenated = false;
    line.text = line.spans.map(function (_ref) {
      var text = _ref.text;
      return text;
    }).join('');
    lines.push(line);
  }

  return {
    height: pageHeight,
    lines: lines,
    width: pageWidth
  };
}
/** Helper to calculate a rough fallback image size from the line coordinates */


function getFallbackImageSize(lines) {
  return {
    width: (0, _max["default"])(lines.map(function (_ref2) {
      var x = _ref2.x,
          width = _ref2.width;
      return x + width;
    })),
    height: (0, _max["default"])(lines.map(function (_ref3) {
      var y = _ref3.y,
          height = _ref3.height;
      return y + height;
    }))
  };
}
/**
 * Parse an OCR document (currently hOCR or ALTO)
 *
 * @param {string} ocrText  ALTO or hOCR markup
 * @param {object} referenceSize Reference size to scale coordinates to
 */


function parseOcr(ocrText, referenceSize) {
  var parse;

  if (ocrText.indexOf('<alto') >= 0) {
    parse = parseAlto(ocrText, referenceSize);
  } else {
    parse = parseHocr(ocrText, referenceSize);
  }

  if (!parse.width || !parse.height) {
    parse = _extends({}, parse, getFallbackImageSize(parse.lines));
  }

  return parse;
}
/** Parse OCR data from IIIF annotations.
 *
 * Annotations should be pre-filtered so that they all refer to a single canvas/page.
 * Annotations should only contain a single text granularity, that is either line or word.
 *
 * @param annos IIIF annotations with a plaintext body and line or word granularity
 * @param renderedWidth Reference width of the rendered target image
 * @param renderedHeight Reference height of the rendered target image
 * @param scaleFactor Factor to apply to coordinates to convert from canvas size to rendered size
 * @returns parsed OCR boxes
 */


function parseIiifAnnotations(annos, imgSize) {
  var fragmentPat = /.+#xywh=(\d+),(\d+),(\d+),(\d+)/g; // TODO: Handle word-level annotations
  // See if we can tell from the annotations themselves if it targets a line

  var lineAnnos = annos.filter(function (anno) {
    return anno.textGranularity === 'line' || // IIIF Text Granularity
    anno.dcType === 'Line';
  } // Europeana
  );
  var targetAnnos = lineAnnos.length > 0 ? lineAnnos : annos;
  var boxes = targetAnnos.map(function (anno) {
    var text;

    if (anno.resource) {
      var _anno$resource$chars;

      text = (_anno$resource$chars = anno.resource.chars) !== null && _anno$resource$chars !== void 0 ? _anno$resource$chars : anno.resource.value;
    } else {
      text = anno.body.value;
    }

    var target = anno.target || anno.on;
    target = Array.isArray(target) ? target[0] : target;

    var _target$matchAll$next = target.matchAll(fragmentPat).next().value.slice(1, 5),
        x = _target$matchAll$next[0],
        y = _target$matchAll$next[1],
        width = _target$matchAll$next[2],
        height = _target$matchAll$next[3];

    return {
      height: parseInt(height, 10),
      text: text,
      width: parseInt(width, 10),
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    };
  });
  return _extends({}, imgSize !== null && imgSize !== void 0 ? imgSize : getFallbackImageSize(boxes), {
    lines: boxes
  });
}