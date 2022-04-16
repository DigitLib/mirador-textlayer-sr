"use strict";

exports.__esModule = true;
exports.getWindowTextOverlayOptions = exports.getTextsForVisibleCanvases = exports.getTexts = void 0;

var _reselect = require("reselect");

var _selectors = require("mirador/dist/es/src/state/selectors");

var _utils = require("mirador/dist/es/src/state/selectors/utils");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var defaultConfig = {
  // Enable the text selection and display feature
  enabled: true,
  // Default opacity of text overlay
  opacity: 1.0,
  // Make text selectable by default
  selectable: false,
  // Overlay text overlay by default
  visible: false,
  // Try to automatically determine the text and background color
  useAutoColors: true,
  // Color of rendered text, used as a fallback if auto-detection is enabled and fails
  textColor: '#000000',
  // Color of line background, used as a fallback if auto-detection is enabled and fails
  bgColor: '#ffffff'
};
/** Selector to get text display options for a given window */

var getWindowTextOverlayOptions = (0, _reselect.createSelector)([_selectors.getWindowConfig, _selectors.getTheme], function (_ref, _ref2) {
  var textOverlay = _ref.textOverlay;
  var fontFamily = _ref2.typography.fontFamily;
  return _extends({
    fontFamily: fontFamily
  }, defaultConfig, textOverlay !== null && textOverlay !== void 0 ? textOverlay : {});
});
/** Selector to get all loaded texts */

exports.getWindowTextOverlayOptions = getWindowTextOverlayOptions;

var getTexts = function getTexts(state) {
  return (0, _utils.miradorSlice)(state).texts;
};
/** Selector for text on all visible canvases */


exports.getTexts = getTexts;
var getTextsForVisibleCanvases = (0, _reselect.createSelector)([_selectors.getVisibleCanvases, getTexts], function (canvases, allTexts) {
  if (!allTexts || !canvases) return [];
  var texts = canvases.map(function (canvas) {
    return allTexts[canvas.id];
  });

  if (texts.every(function (t) {
    return t === undefined;
  })) {
    return [];
  }

  return texts;
});
exports.getTextsForVisibleCanvases = getTextsForVisibleCanvases;