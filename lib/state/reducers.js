"use strict";

exports.__esModule = true;
exports.textsReducer = void 0;

var _actions = require("./actions");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/** Reducer for global text overlay state */
var textsReducer = function textsReducer(state, action) {
  var _extends2, _extends3, _extends4, _extends5, _extends6;

  if (state === void 0) {
    state = {};
  }

  switch (action.type) {
    case _actions.PluginActionTypes.DISCOVERED_TEXT:
      return _extends({}, state, (_extends2 = {}, _extends2[action.targetId] = _extends({}, state[action.targetId], {
        canvasId: action.targetId,
        source: action.textUri,
        sourceType: action.sourceType
      }), _extends2));

    case _actions.PluginActionTypes.REQUEST_TEXT:
      return _extends({}, state, (_extends3 = {}, _extends3[action.targetId] = _extends({}, state[action.targetId], {
        canvasId: action.targetId,
        isFetching: true,
        source: action.textUri
      }), _extends3));

    case _actions.PluginActionTypes.RECEIVE_TEXT:
      {
        var currentText = state[action.targetId]; // Don't overwrite the current text if we already have an OCR-sourced
        // text that was completely fetched without an error

        var skipText = currentText !== undefined && !currentText.error && !currentText.isFetching && currentText.sourceType === 'ocr';
        if (skipText) return state;
      }
      return _extends({}, state, (_extends4 = {}, _extends4[action.targetId] = _extends({}, state[action.targetId], {
        canvasId: action.targetId,
        isFetching: false,
        source: action.textUri,
        sourceType: action.sourceType,
        text: action.parsedText
      }), _extends4));

    case _actions.PluginActionTypes.RECEIVE_TEXT_FAILURE:
      return _extends({}, state, (_extends5 = {}, _extends5[action.targetId] = _extends({}, state[action.targetId], {
        canvasId: action.targetId,
        error: action.error,
        isFetching: false,
        source: action.textUri,
        sourceType: action.sourceType
      }), _extends5));

    case _actions.PluginActionTypes.RECEIVE_COLORS:
      return _extends({}, state, (_extends6 = {}, _extends6[action.targetId] = _extends({}, state[action.targetId], {
        bgColor: action.bgColor,
        textColor: action.textColor
      }), _extends6));

    default:
      return state;
  }
};

exports.textsReducer = textsReducer;