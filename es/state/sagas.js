"use strict";

var _regeneratorRuntime2 = require("@babel/runtime/regenerator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = textSaga;
exports.discoverExternalOcr = discoverExternalOcr;
exports.fetchAndProcessOcr = fetchAndProcessOcr;
exports.fetchAnnotationResource = fetchAnnotationResource;
exports.fetchColors = fetchColors;
exports.fetchExternalAnnotationResourceIIIFv3 = fetchExternalAnnotationResourceIIIFv3;
exports.fetchExternalAnnotationResources = fetchExternalAnnotationResources;
exports.fetchExternalAnnotationResourcesIIIFv2 = fetchExternalAnnotationResourcesIIIFv2;
exports.fetchOcrMarkup = fetchOcrMarkup;
exports.injectTranslations = injectTranslations;
exports.loadImageData = loadImageData;
exports.onConfigChange = onConfigChange;
exports.processTextsFromAnnotations = processTextsFromAnnotations;
exports.processTextsFromAnnotationsIIIFv2 = processTextsFromAnnotationsIIIFv2;
exports.processTextsFromAnnotationsIIIFv3 = processTextsFromAnnotationsIIIFv3;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _effects = require("redux-saga/effects");

var _isomorphicUnfetch = _interopRequireDefault(require("isomorphic-unfetch"));

var _actionTypes = _interopRequireDefault(require("mirador/dist/es/src/state/actions/action-types"));

var _actions = require("mirador/dist/es/src/state/actions");

var _selectors = require("mirador/dist/es/src/state/selectors");

var _MiradorCanvas = _interopRequireDefault(require("mirador/dist/es/src/lib/MiradorCanvas"));

var _actions2 = require("./actions");

var _selectors2 = require("./selectors");

var _locales = _interopRequireDefault(require("../locales"));

var _ocrFormats = require("../lib/ocrFormats");

var _color = require("../lib/color");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _marked = /*#__PURE__*/_regeneratorRuntime2.mark(discoverExternalOcr),
    _marked2 = /*#__PURE__*/_regeneratorRuntime2.mark(fetchAndProcessOcr),
    _marked3 = /*#__PURE__*/_regeneratorRuntime2.mark(fetchExternalAnnotationResourcesIIIFv2),
    _marked4 = /*#__PURE__*/_regeneratorRuntime2.mark(fetchExternalAnnotationResourceIIIFv3),
    _marked5 = /*#__PURE__*/_regeneratorRuntime2.mark(processTextsFromAnnotationsIIIFv2),
    _marked6 = /*#__PURE__*/_regeneratorRuntime2.mark(processTextsFromAnnotationsIIIFv3),
    _marked7 = /*#__PURE__*/_regeneratorRuntime2.mark(onConfigChange),
    _marked8 = /*#__PURE__*/_regeneratorRuntime2.mark(injectTranslations),
    _marked9 = /*#__PURE__*/_regeneratorRuntime2.mark(fetchColors),
    _marked10 = /*#__PURE__*/_regeneratorRuntime2.mark(textSaga);

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var charFragmentPattern = /^(.+)#char=(\d+),(\d+)$/;
/** Check if an annotation has external resources that need to be loaded */

function hasExternalResource(anno) {
  var _anno$resource, _anno$body;

  return ((_anno$resource = anno.resource) === null || _anno$resource === void 0 ? void 0 : _anno$resource.chars) === undefined && ((_anno$body = anno.body) === null || _anno$body === void 0 ? void 0 : _anno$body.value) === undefined && Object.keys(anno.resource).length === 1 && anno.resource['@id'] !== undefined;
}
/** Checks if a given resource points to an ALTO OCR document */


var isAlto = function isAlto(resource) {
  return resource && (resource.format === 'application/xml+alto' || resource.profile && resource.profile.startsWith('http://www.loc.gov/standards/alto/'));
};
/** Checks if a given resource points to an hOCR document */


var isHocr = function isHocr(resource) {
  return resource && (resource.format === 'text/vnd.hocr+html' || resource.profile && (resource.profile === 'https://github.com/kba/hocr-spec/blob/master/hocr-spec.md' || resource.profile.startsWith('http://kba.cloud/hocr-spec/') || resource.profile.startsWith('http://kba.github.io/hocr-spec/')));
};
/** Checks if a given annotationJson has the type "AnnotationPage", introduced
 * in IIIF v3 (and therefore assumes IIIF 3.0).
 * @param annotationJson Annotation-like json sturct
 */


var naiveIIIFv3Check = function naiveIIIFv3Check(annotationJson) {
  return annotationJson && annotationJson.type && annotationJson.type === 'AnnotationPage';
};
/** Wrapper around fetch() that returns the content as text */


function fetchOcrMarkup(_x) {
  return _fetchOcrMarkup.apply(this, arguments);
}
/** Saga for discovering external OCR on visible canvases and requesting it if not yet loaded */


function _fetchOcrMarkup() {
  _fetchOcrMarkup = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
    var resp;
    return _regenerator["default"].wrap(function _callee$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return (0, _isomorphicUnfetch["default"])(url);

          case 2:
            resp = _context11.sent;
            return _context11.abrupt("return", resp.text());

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee);
  }));
  return _fetchOcrMarkup.apply(this, arguments);
}

function discoverExternalOcr(_ref) {
  var _yield$select$textOve;

  var visibleCanvasIds, windowId, _ref2, enabled, selectable, visible, canvases, visibleCanvases, texts, _iterator, _step, canvas, _canvas$__jsonld, width, height, seeAlso, _seeAlso$id, _texts$canvas$id, ocrSource, alreadyHasText, miradorCanvas, image, infoId;

  return _regenerator["default"].wrap(function discoverExternalOcr$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          visibleCanvasIds = _ref.visibleCanvases, windowId = _ref.windowId;
          _context.next = 3;
          return (0, _effects.select)(_selectors.getWindowConfig, {
            windowId: windowId
          });

        case 3:
          _context.t1 = _yield$select$textOve = _context.sent.textOverlay;
          _context.t0 = _context.t1 !== null;

          if (!_context.t0) {
            _context.next = 7;
            break;
          }

          _context.t0 = _yield$select$textOve !== void 0;

        case 7:
          if (!_context.t0) {
            _context.next = 11;
            break;
          }

          _context.t2 = _yield$select$textOve;
          _context.next = 12;
          break;

        case 11:
          _context.t2 = {
            enabled: false
          };

        case 12:
          _ref2 = _context.t2;
          enabled = _ref2.enabled;
          selectable = _ref2.selectable;
          visible = _ref2.visible;

          if (enabled) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return");

        case 18:
          _context.next = 20;
          return (0, _effects.select)(_selectors.getCanvases, {
            windowId: windowId
          });

        case 20:
          canvases = _context.sent;
          visibleCanvases = (canvases || []).filter(function (c) {
            return visibleCanvasIds.includes(c.id);
          });
          _context.next = 24;
          return (0, _effects.select)(_selectors2.getTexts);

        case 24:
          texts = _context.sent;
          _iterator = _createForOfIteratorHelperLoose(visibleCanvases);

        case 26:
          if ((_step = _iterator()).done) {
            _context.next = 51;
            break;
          }

          canvas = _step.value;
          _canvas$__jsonld = canvas.__jsonld, width = _canvas$__jsonld.width, height = _canvas$__jsonld.height;
          seeAlso = (Array.isArray(canvas.__jsonld.seeAlso) ? canvas.__jsonld.seeAlso : [canvas.__jsonld.seeAlso]).filter(function (res) {
            return isAlto(res) || isHocr(res);
          })[0];

          if (!(seeAlso !== undefined)) {
            _context.next = 49;
            break;
          }

          ocrSource = (_seeAlso$id = seeAlso.id) !== null && _seeAlso$id !== void 0 ? _seeAlso$id : seeAlso['@id']; // IIIF 3.0 compat (id vs @id)

          alreadyHasText = ((_texts$canvas$id = texts[canvas.id]) === null || _texts$canvas$id === void 0 ? void 0 : _texts$canvas$id.source) === ocrSource;

          if (!alreadyHasText) {
            _context.next = 35;
            break;
          }

          return _context.abrupt("continue", 49);

        case 35:
          if (!(selectable || visible)) {
            _context.next = 40;
            break;
          }

          _context.next = 38;
          return (0, _effects.put)((0, _actions2.requestText)(canvas.id, ocrSource, {
            height: height,
            width: width
          }));

        case 38:
          _context.next = 42;
          break;

        case 40:
          _context.next = 42;
          return (0, _effects.put)((0, _actions2.discoveredText)(canvas.id, ocrSource));

        case 42:
          // Get the IIIF Image Service from the canvas to determine text/background colors
          // NOTE: We don't do this in the `fetchColors` saga, since it's kind of a pain to get
          // a canvas object from an id, and we have one already here, so it's just simpler.
          miradorCanvas = new _MiradorCanvas["default"](canvas);
          image = miradorCanvas.iiifImageResources[0];
          infoId = image === null || image === void 0 ? void 0 : image.getServices()[0].id;

          if (infoId) {
            _context.next = 47;
            break;
          }

          return _context.abrupt("return");

        case 47:
          _context.next = 49;
          return (0, _effects.put)((0, _actions2.requestColors)(canvas.id, infoId));

        case 49:
          _context.next = 26;
          break;

        case 51:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
/** Saga for fetching OCR and parsing it */


function fetchAndProcessOcr(_ref3) {
  var targetId, textUri, canvasSize, text, parsedText;
  return _regenerator["default"].wrap(function fetchAndProcessOcr$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          targetId = _ref3.targetId, textUri = _ref3.textUri, canvasSize = _ref3.canvasSize;
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _effects.call)(fetchOcrMarkup, textUri);

        case 4:
          text = _context2.sent;
          _context2.next = 7;
          return (0, _effects.call)(_ocrFormats.parseOcr, text, canvasSize);

        case 7:
          parsedText = _context2.sent;
          _context2.next = 10;
          return (0, _effects.put)((0, _actions2.receiveText)(targetId, textUri, 'ocr', parsedText));

        case 10:
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](1);
          _context2.next = 16;
          return (0, _effects.put)((0, _actions2.receiveTextFailure)(targetId, textUri, _context2.t0));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, null, [[1, 12]]);
}
/** Fetch external annotation resource JSON */


function fetchAnnotationResource(_x2) {
  return _fetchAnnotationResource.apply(this, arguments);
}
/** Saga for fetching external annotation resources */


function _fetchAnnotationResource() {
  _fetchAnnotationResource = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee2(url) {
    var resp;
    return _regenerator["default"].wrap(function _callee2$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return (0, _isomorphicUnfetch["default"])(url);

          case 2:
            resp = _context12.sent;
            return _context12.abrupt("return", resp.json());

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchAnnotationResource.apply(this, arguments);
}

function fetchExternalAnnotationResources(_ref4) {
  var targetId = _ref4.targetId,
      annotationId = _ref4.annotationId,
      annotationJson = _ref4.annotationJson;

  if (naiveIIIFv3Check(annotationJson)) {
    // We treat this as IIIF 3.0
    fetchExternalAnnotationResourceIIIFv3({
      targetId: targetId,
      annotationId: annotationId,
      annotationJson: annotationJson
    });
  } else {
    // We treat this as IIIF 2.x
    fetchExternalAnnotationResourcesIIIFv2({
      targetId: targetId,
      annotationId: annotationId,
      annotationJson: annotationJson
    });
  }
}
/** Fetching external annotation resources IIIF 2.x style */


function fetchExternalAnnotationResourcesIIIFv2(_ref5) {
  var targetId, annotationId, annotationJson, resourceUris, contents, contentMap, completedAnnos;
  return _regenerator["default"].wrap(function fetchExternalAnnotationResourcesIIIFv2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          targetId = _ref5.targetId, annotationId = _ref5.annotationId, annotationJson = _ref5.annotationJson;

          if (annotationJson.resources.some(hasExternalResource)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return");

        case 3:
          resourceUris = (0, _uniq["default"])(annotationJson.resources.map(function (anno) {
            return anno.resource['@id'].split('#')[0];
          }));
          _context3.next = 6;
          return (0, _effects.all)(resourceUris.map(function (uri) {
            return (0, _effects.call)(fetchAnnotationResource, uri);
          }));

        case 6:
          contents = _context3.sent;
          contentMap = Object.fromEntries(contents.map(function (c) {
            var _c$id;

            return [(_c$id = c.id) !== null && _c$id !== void 0 ? _c$id : c['@id'], c];
          }));
          completedAnnos = annotationJson.resources.map(function (anno) {
            if (!hasExternalResource(anno)) {
              return anno;
            }

            var match = anno.resource['@id'].match(charFragmentPattern);

            if (!match) {
              var _contentMap$anno$reso;

              return _extends({}, anno, {
                resource: (_contentMap$anno$reso = contentMap[anno.resource['@id']]) !== null && _contentMap$anno$reso !== void 0 ? _contentMap$anno$reso : anno.resource
              });
            }

            var wholeResource = contentMap[match[1]];
            var startIdx = Number.parseInt(match[2], 10);
            var endIdx = Number.parseInt(match[3], 10);
            var partialContent = wholeResource.value.substring(startIdx, endIdx);
            return _extends({}, anno, {
              resource: _extends({}, anno.resource, {
                value: partialContent
              })
            });
          });
          _context3.next = 11;
          return (0, _effects.put)((0, _actions.receiveAnnotation)(targetId, annotationId, _extends({}, annotationJson, {
            resources: completedAnnos
          })));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3);
}
/** Fetching external annotation resources IIIF 3.0 style */


function fetchExternalAnnotationResourceIIIFv3(_ref6) {
  var targetId, annotationId, annotationJson, resourceUris, contents, contentMap, completedAnnos;
  return _regenerator["default"].wrap(function fetchExternalAnnotationResourceIIIFv3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          targetId = _ref6.targetId, annotationId = _ref6.annotationId, annotationJson = _ref6.annotationJson;

          if (annotationJson.items.some(hasExternalResource)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return");

        case 3:
          resourceUris = (0, _uniq["default"])(annotationJson.items.map(function (anno) {
            return anno.body.id.split('#')[0];
          }));
          _context4.next = 6;
          return (0, _effects.all)(resourceUris.map(function (uri) {
            return (0, _effects.call)(fetchAnnotationResource, uri);
          }));

        case 6:
          contents = _context4.sent;
          contentMap = Object.fromEntries(contents.map(function (c) {
            var _c$id2;

            return [(_c$id2 = c.id) !== null && _c$id2 !== void 0 ? _c$id2 : c['@id'], c];
          }));
          completedAnnos = annotationJson.items.map(function (anno) {
            if (!hasExternalResource(anno)) {
              return anno;
            }

            var match = anno.body.id.match(charFragmentPattern);

            if (!match) {
              var _contentMap$anno$body;

              return _extends({}, anno, {
                resource: (_contentMap$anno$body = contentMap[anno.body.id]) !== null && _contentMap$anno$body !== void 0 ? _contentMap$anno$body : anno.resource
              });
            }

            var wholeResource = contentMap[match[1]];
            var startIdx = Number.parseInt(match[2], 10);
            var endIdx = Number.parseInt(match[3], 10);
            var partialContent = wholeResource.value.substring(startIdx, endIdx);
            return _extends({}, anno, {
              resource: _extends({}, anno.resource, {
                value: partialContent
              })
            });
          });
          _context4.next = 11;
          return (0, _effects.put)((0, _actions.receiveAnnotation)(targetId, annotationId, _extends({}, annotationJson, {
            resources: completedAnnos
          })));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4);
}
/** Saga for processing texts from IIIF annotations */


function processTextsFromAnnotations(_ref7) {
  var targetId = _ref7.targetId,
      annotationId = _ref7.annotationId,
      annotationJson = _ref7.annotationJson;

  if (naiveIIIFv3Check(annotationJson)) {
    // IIIF v3
    processTextsFromAnnotationsIIIFv3({
      targetId: targetId,
      annotationId: annotationId,
      annotationJson: annotationJson
    });
  } else {
    // IIIF v2 and Europeana IIIF 2.0
    processTextsFromAnnotationsIIIFv2({
      targetId: targetId,
      annotationId: annotationId,
      annotationJson: annotationJson
    });
  }
}
/** Saga for processing texts from IIIF annotations IIIF 2.x */


function processTextsFromAnnotationsIIIFv2(_ref8) {
  var targetId, annotationId, annotationJson, contentAsTextAnnos, parsed;
  return _regenerator["default"].wrap(function processTextsFromAnnotationsIIIFv2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          targetId = _ref8.targetId, annotationId = _ref8.annotationId, annotationJson = _ref8.annotationJson;
          // Check if the annotation contains "content as text" resources that
          // we can extract text with coordinates from
          contentAsTextAnnos = annotationJson.resources.filter(function (anno) {
            var _anno$resource$Type;

            return anno.motivation === 'supplementing' || // IIIF 3.0
            ((_anno$resource$Type = anno.resource['@type']) === null || _anno$resource$Type === void 0 ? void 0 : _anno$resource$Type.toLowerCase()) === 'cnt:contentastext' || // IIIF 2.0
            ['Line', 'Word'].indexOf(anno.dcType) >= 0;
          } // Europeana IIIF 2.0
          );

          if (!(contentAsTextAnnos.length > 0)) {
            _context5.next = 8;
            break;
          }

          _context5.next = 5;
          return (0, _effects.call)(_ocrFormats.parseIiifAnnotations, contentAsTextAnnos);

        case 5:
          parsed = _context5.sent;
          _context5.next = 8;
          return (0, _effects.put)((0, _actions2.receiveText)(targetId, annotationId, 'annos', parsed));

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked5);
}
/** Saga for processing texts from IIIF annotations IIIF 3.0 */


function processTextsFromAnnotationsIIIFv3(_ref9) {
  var targetId, annotationId, annotationJson, contentAsTextAnnos, parsed;
  return _regenerator["default"].wrap(function processTextsFromAnnotationsIIIFv3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          targetId = _ref9.targetId, annotationId = _ref9.annotationId, annotationJson = _ref9.annotationJson;
          // Check if the annotation contains "TextualBody" resources that
          // we can extract text with coordinates from
          contentAsTextAnnos = annotationJson.resources.filter(function (anno) {
            return anno.motivation === 'supplementing' && anno.type === 'Annotation' && anno.body && anno.body.type === 'TextualBody';
          } // See https://www.w3.org/TR/annotation-model/#embedded-textual-body
          );

          if (!(contentAsTextAnnos.length > 0)) {
            _context6.next = 8;
            break;
          }

          _context6.next = 5;
          return (0, _effects.call)(_ocrFormats.parseIiifAnnotations, contentAsTextAnnos);

        case 5:
          parsed = _context6.sent;
          _context6.next = 8;
          return (0, _effects.put)((0, _actions2.receiveText)(targetId, annotationId, 'annos', parsed));

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked6);
}
/** Saga for requesting texts when display or selection is newly enabled */


function onConfigChange(_ref10) {
  var _payload$textOverlay;

  var payload, windowId, _ref11, enabled, selectable, visible, texts, needFetching, needsDiscovery, visibleCanvases, canvasIds;

  return _regenerator["default"].wrap(function onConfigChange$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          payload = _ref10.payload, windowId = _ref10.id;
          _ref11 = (_payload$textOverlay = payload.textOverlay) !== null && _payload$textOverlay !== void 0 ? _payload$textOverlay : {}, enabled = _ref11.enabled, selectable = _ref11.selectable, visible = _ref11.visible;

          if (!(!enabled || !selectable && !visible)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return");

        case 4:
          _context7.next = 6;
          return (0, _effects.select)(_selectors2.getTextsForVisibleCanvases, {
            windowId: windowId
          });

        case 6:
          texts = _context7.sent;
          // Check if any of the texts need fetching
          needFetching = texts.filter(function (_ref12) {
            var sourceType = _ref12.sourceType,
                text = _ref12.text;
            return sourceType === 'ocr' && text === undefined;
          }); // Check if we need to discover external OCR

          needsDiscovery = texts.length === 0 || texts.filter(function (_temp) {
            var _ref13 = _temp === void 0 ? {} : _temp,
                sourceType = _ref13.sourceType;

            return sourceType === 'annos';
          }).length > 0;

          if (!(needFetching.length === 0 && !needsDiscovery)) {
            _context7.next = 11;
            break;
          }

          return _context7.abrupt("return");

        case 11:
          _context7.next = 13;
          return (0, _effects.select)(_selectors.getVisibleCanvases, {
            windowId: windowId
          });

        case 13:
          visibleCanvases = _context7.sent;
          _context7.next = 16;
          return (0, _effects.all)(needFetching.map(function (_ref14) {
            var canvasId = _ref14.canvasId,
                source = _ref14.source;

            var _visibleCanvases$find = visibleCanvases.find(function (c) {
              return c.id === canvasId;
            }).__jsonld,
                width = _visibleCanvases$find.width,
                height = _visibleCanvases$find.height;

            return (0, _effects.put)((0, _actions2.requestText)(canvasId, source, {
              height: height,
              width: width
            }));
          }));

        case 16:
          if (!needsDiscovery) {
            _context7.next = 20;
            break;
          }

          canvasIds = visibleCanvases.map(function (c) {
            return c.id;
          });
          _context7.next = 20;
          return (0, _effects.call)(discoverExternalOcr, {
            visibleCanvases: canvasIds,
            windowId: windowId
          });

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, _marked7);
}
/** Inject translation keys for this plugin into thte config */


function injectTranslations() {
  return _regenerator["default"].wrap(function injectTranslations$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return (0, _effects.put)((0, _actions.updateConfig)({
            translations: _locales["default"]
          }));

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  }, _marked8);
}
/** Load image data for image */


function loadImageData(_x3) {
  return _loadImageData.apply(this, arguments);
}
/** Try to determine text and background color for the target */


function _loadImageData() {
  _loadImageData = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee3(imgUrl) {
    return _regenerator["default"].wrap(function _callee3$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt("return", new Promise(function (resolve, reject) {
              var img = new Image();
              img.crossOrigin = 'Anonymous';

              img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, img.width, img.height).data);
              };

              img.onerror = reject;
              img.src = imgUrl;
            }));

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee3);
  }));
  return _loadImageData.apply(this, arguments);
}

function fetchColors(_ref15) {
  var targetId, infoId, infoResp, serviceId, _infoSuccess$infoJson, _yield$race, infoSuccess, infoFailure, imgUrl, imgData, _yield$call, textColor, bgColor;

  return _regenerator["default"].wrap(function fetchColors$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          targetId = _ref15.targetId, infoId = _ref15.infoId;
          _context9.next = 3;
          return (0, _effects.select)(_selectors.selectInfoResponse, {
            infoId: infoId
          });

        case 3:
          infoResp = _context9.sent;
          serviceId = infoResp === null || infoResp === void 0 ? void 0 : infoResp.id;

          if (serviceId) {
            _context9.next = 14;
            break;
          }

          _context9.next = 8;
          return (0, _effects.race)({
            success: (0, _effects.take)(function (a) {
              return a.type === _actionTypes["default"].RECEIVE_INFO_RESPONSE && a.infoId === infoId;
            }),
            failure: (0, _effects.take)(function (a) {
              return a.type === _actionTypes["default"].RECEIVE_INFO_RESPONSE_FAILURE && a.infoId === infoId;
            })
          });

        case 8:
          _yield$race = _context9.sent;
          infoSuccess = _yield$race.success;
          infoFailure = _yield$race.failure;

          if (!infoFailure) {
            _context9.next = 13;
            break;
          }

          return _context9.abrupt("return");

        case 13:
          serviceId = (_infoSuccess$infoJson = infoSuccess.infoJson) === null || _infoSuccess$infoJson === void 0 ? void 0 : _infoSuccess$infoJson['@id'];

        case 14:
          _context9.prev = 14;
          // FIXME: This assumes a Level 2 endpoint, we should probably use one of the sizes listed
          //        explicitely in the info response instead.
          imgUrl = serviceId + "/full/200,/0/default.jpg";
          _context9.next = 18;
          return (0, _effects.call)(loadImageData, imgUrl);

        case 18:
          imgData = _context9.sent;
          _context9.next = 21;
          return (0, _effects.call)(_color.getPageColors, imgData);

        case 21:
          _yield$call = _context9.sent;
          textColor = _yield$call.textColor;
          bgColor = _yield$call.bgColor;
          _context9.next = 26;
          return (0, _effects.put)((0, _actions2.receiveColors)(targetId, textColor, bgColor));

        case 26:
          _context9.next = 31;
          break;

        case 28:
          _context9.prev = 28;
          _context9.t0 = _context9["catch"](14);
          console.error(_context9.t0); // NOP

        case 31:
        case "end":
          return _context9.stop();
      }
    }
  }, _marked9, null, [[14, 28]]);
}
/** Root saga for the plugin */


function textSaga() {
  return _regenerator["default"].wrap(function textSaga$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _effects.all)([(0, _effects.takeEvery)(_actionTypes["default"].IMPORT_CONFIG, injectTranslations), (0, _effects.takeEvery)(_actionTypes["default"].RECEIVE_ANNOTATION, fetchExternalAnnotationResources), (0, _effects.takeEvery)(_actionTypes["default"].RECEIVE_ANNOTATION, processTextsFromAnnotations), (0, _effects.takeEvery)(_actionTypes["default"].SET_CANVAS, discoverExternalOcr), (0, _effects.takeEvery)(_actionTypes["default"].UPDATE_WINDOW, onConfigChange), (0, _effects.takeEvery)(_actions2.PluginActionTypes.REQUEST_TEXT, fetchAndProcessOcr), (0, _effects.takeEvery)(_actions2.PluginActionTypes.REQUEST_COLORS, fetchColors)]);

        case 2:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked10);
}