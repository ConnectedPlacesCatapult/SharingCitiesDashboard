import {
  PLOT_SET_PROPERTY,
  PLOT_SET_LAYER_MARK,
  PLOT_SET_LAYER_ENCODING_CHANNEL_KEY,
  PLOT_SET_LAYER_ENCODING_CHANNEL_PROPERTY_KEY,
  PLOT_SET_LAYER_ENCODING_CHANNEL_PROPERTY_VALUE,
  PLOT_ADD_LAYER,
  PLOT_DELETE_LAYER,
  PLOT_ADD_LAYER_ENCODING_CHANNEL,
  PLOT_DELETE_LAYER_ENCODING_CHANNEL,
  PLOT_ADD_LAYER_ENCODING_CHANNEL_PROPERTY,
  PLOT_DELETE_LAYER_ENCODING_CHANNEL_PROPERTY,
} from './../constants';

export const setPlotProperty = (name, value) => ({
  type: PLOT_SET_PROPERTY,
  payload: {
    name,
    value,
  },
});

export const addPlotLayer = (mark, encoding) => ({
  type: PLOT_ADD_LAYER,
  payload: {
    mark,
    encoding,
  },
});

export const deletePlotLayer = (layerIndex) => ({
  type: PLOT_DELETE_LAYER,
  payload: layerIndex,
});

export const setPlotLayerMark = (layerIndex, mark) => ({
  type: PLOT_SET_LAYER_MARK,
  payload: {
    layerIndex,
    mark,
  }
});

export const addPlotLayerEncodingChannel = (layerIndex, channelKey) => ({
  type: PLOT_ADD_LAYER_ENCODING_CHANNEL,
  payload: {
    layerIndex,
    channelKey,
  },
});

export const deletePlotLayerEncodingChannel = (layerIndex, channelKey) => ({
  type: PLOT_DELETE_LAYER_ENCODING_CHANNEL,
  payload: {
    layerIndex,
    channelKey,
  },
});

export const setPlotLayerEncodingChannelKey = (layerIndex, currentChannelKey, newChannelKey) => ({
  type: PLOT_SET_LAYER_ENCODING_CHANNEL_KEY,
  payload: {
    layerIndex,
    currentChannelKey,
    newChannelKey,
  },
});

export const setPlotLayerEncodingChannelPropertyKey = (layerIndex, channelKey, currentPropertyKey, newPropertyKey) => ({
  type: PLOT_SET_LAYER_ENCODING_CHANNEL_PROPERTY_KEY,
  payload: {
    layerIndex,
    channelKey,
    currentPropertyKey,
    newPropertyKey,
  },
});

export const setPlotLayerEncodingChannelPropertyValue = (layerIndex, channelKey, propertyKey, newValue) => ({
  type: PLOT_SET_LAYER_ENCODING_CHANNEL_PROPERTY_VALUE,
  payload: {
    layerIndex,
    channelKey,
    propertyKey,
    newValue,
  },
});

export const addPlotLayerEncodingChannelProperty = (layerIndex, channelKey, propertyKey, propertyValue) => ({
  type: PLOT_ADD_LAYER_ENCODING_CHANNEL_PROPERTY,
  payload: {
    layerIndex,
    channelKey,
    propertyKey,
    propertyValue,
  },
});

export const deletePlotLayerEncodingChannelProperty = (layerIndex, channelKey, propertyKey) => ({
  type: PLOT_DELETE_LAYER_ENCODING_CHANNEL_PROPERTY,
  payload: {
    layerIndex,
    channelKey,
    propertyKey,
  }
});
