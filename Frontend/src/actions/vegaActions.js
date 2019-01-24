import {
  VEGA_SET_WIDTH,
  VEGA_SET_HEIGHT,
  VEGA_SET_TITLE,
  VEGA_SET_NAME,
  VEGA_SET_DESCRIPTION,


  VEGA_ADD_LAYER,
  VEGA_REMOVE_LAYER,
  VEGA_SET_LAYER_MARK,
  VEGA_SET_DATA,
  VEGA_ADD_LAYER_ENCODING_CHANNEL,
  VEGA_SET_LAYER_ENCODING_CHANNEL,
  VEGA_REMOVE_LAYER_ENCODING_CHANNEL,
} from './../constants';

export const setWidth = (width) => ({
  type: VEGA_SET_WIDTH,
  payload: width,
});

export const setHeight = (height) => ({
  type: VEGA_SET_HEIGHT,
  payload: height,
});

export const setTitle = (title) => ({
  type: VEGA_SET_TITLE,
  payload: title,
});

export const setName = (name) => ({
  type: VEGA_SET_NAME,
  payload: name,
});

export const setDescription = (description) => ({
  type: VEGA_SET_DESCRIPTION,
  payload: description,
});



export const addLayer = () => ({
  type: VEGA_ADD_LAYER,
});

export const removeLayer = (layerIndex) => ({
  type: VEGA_REMOVE_LAYER,
  payload: layerIndex,
});

export const setData = (data) => ({
  type: VEGA_SET_DATA,
  payload: data,
});

export const setLayerMark = (layerIndex, mark) => ({
  type: VEGA_SET_LAYER_MARK,
  payload: {
    layerIndex,
    mark,
  },
});

export const addLayerEncodingChannel = (layerIndex, channelType) => ({
  type: VEGA_ADD_LAYER_ENCODING_CHANNEL,
  payload: {
    layerIndex,
    channelType,
  },
});

export const setLayerEncodingChannel = (layerIndex, channelIndex, channel) => ({
  type: VEGA_SET_LAYER_ENCODING_CHANNEL,
  payload: {
    layerIndex,
    channelIndex,
    channel,
  },
});

export const removeLayerEncodingChannel = (layerIndex, channelIndex) => ({
  type: VEGA_REMOVE_LAYER_ENCODING_CHANNEL,
  payload: {
    layerIndex,
    channelIndex,
  },
});
