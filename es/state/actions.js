"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginActionTypes = void 0;
exports.discoveredText = discoveredText;
exports.receiveColors = receiveColors;
exports.receiveText = receiveText;
exports.receiveTextFailure = receiveTextFailure;
exports.requestColors = requestColors;
exports.requestText = requestText;
var PluginActionTypes = {
  DISCOVERED_TEXT: 'mirador-textoverlay/DISCOVERED_TEXT',
  RECEIVE_TEXT: 'mirador-textoverlay/RECEIVE_TEXT',
  RECEIVE_TEXT_FAILURE: 'mirador-textoverlay/RECEIVE_TEXT_FAILURE',
  REQUEST_TEXT: 'mirador-textoverlay/REQUEST_TEXT',
  REQUEST_COLORS: 'mirador-textoverlay/REQUEST_COLORS',
  RECEIVE_COLORS: 'mirador-textoverlay/RECEIVE_COLORS'
};
/**
 * discoveredText: action creator
 *
 * @param {String} targetId
 * @param {String} textUri
 */

exports.PluginActionTypes = PluginActionTypes;

function discoveredText(targetId, textUri, sourceType) {
  if (sourceType === void 0) {
    sourceType = 'ocr';
  }

  return {
    targetId: targetId,
    textUri: textUri,
    sourceType: sourceType,
    type: PluginActionTypes.DISCOVERED_TEXT
  };
}
/**
 * requestText - action creator
 *
 * @param  {String} targetId
 * @param  {String} textUri
 * @param   {object} canvasSize
 * @memberof ActionCreators
 */


function requestText(targetId, textUri, canvasSize) {
  return {
    canvasSize: canvasSize,
    targetId: targetId,
    textUri: textUri,
    type: PluginActionTypes.REQUEST_TEXT
  };
}
/**
 * receiveText - action creator
 *
 * @param  {String} targetId
 * @param  {String} textUri
 * @param  {Object} parsedText
 * @memberof ActionCreators
 */


function receiveText(targetId, textUri, sourceType, parsedText) {
  return {
    parsedText: parsedText,
    sourceType: sourceType,
    targetId: targetId,
    textUri: textUri,
    type: PluginActionTypes.RECEIVE_TEXT
  };
}
/**
 * receiveTextFailure - action creator
 *
 * @param  {String} targetId
 * @param  {String} textUri
 * @param  {String} error
 * @memberof ActionCreators
 */


function receiveTextFailure(targetId, textUri, error) {
  return {
    error: error,
    targetId: targetId,
    textUri: textUri,
    type: PluginActionTypes.RECEIVE_TEXT_FAILURE
  };
}
/**
 * requestColors - action creator
 * @param {string} targetId
 * @param {string} infoId
 */


function requestColors(targetId, infoId) {
  return {
    targetId: targetId,
    infoId: infoId,
    type: PluginActionTypes.REQUEST_COLORS
  };
}
/**
 * receiveColors - action creator
 * @param {string} windowId
 * @param {string} targetId
 * @param {string} textColor
 * @param {string} bgColor
 */


function receiveColors(targetId, textColor, bgColor) {
  return {
    targetId: targetId,
    textColor: textColor,
    bgColor: bgColor,
    type: PluginActionTypes.RECEIVE_COLORS
  };
}