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

const initialState = {
  temp: {
    layer: {},
    channel: {},
    property: {},
  },
  spec: {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    width: 640,
    height: 480,
    title: "plot title",
    name: "plot name",
    description: "plot description",
    data: {
      values: [],
    },
    transform: [],
    layer: [
      {
        mark: "point",
        encoding: {
          x: {
            field: "Timestamp",
            type: "temporal",
          },
          y: {
            field: "Value",
            type: "quantitative"
          },
          color: {
            field: "Attribute_Name",
            type: "nominal",
          },
        },
      },
      {
        mark: "line",
        encoding: {
          x: {
            "field": "Timestamp",
            "type": "temporal"
          },
          y: {
            "field": "Value",
            "type": "quantitative",
            "aggregate": "mean"
          },
          color: {
            "field": "Attribute_Name",
            "type": "nominal"
          },
        },
      },
    ],
  },
  data: {
    values: [
      {
        "Timestamp": 1545177600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545177600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545181200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.75,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545181200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545264000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.8,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545264000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545350400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.8,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545350400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545436800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545436800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545523200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545609600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545696000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 2.2,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545696000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545782400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545782400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545868800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.2,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545868800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.8,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545955200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.55,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545955200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.95,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545958800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545958800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545962400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.5,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545962400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.2,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545966000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.5,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545966000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.2,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545969600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545969600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.1,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545973200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545973200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.0,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545976800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545976800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.1,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545980400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545987600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.5,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545987600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.1,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545991200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545991200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.0,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545994800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545994800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.0,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1545998400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1545998400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546002000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546002000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546005600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546005600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546009200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546009200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546012800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.2,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546012800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546016400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546016400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546020000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546020000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546041600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546041600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546045200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546045200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546048800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546048800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546387200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546387200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546390800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546390800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546394400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546394400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546394400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 5.8,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 5.3,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 6.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 5.6,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 5.5,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 7.0,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546398000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 4.8,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 5.5,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 6.8,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 6.3,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 5.9,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 12.9,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546401600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 5.5,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 5.2,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 5.4,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 5.9,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 6.2,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 11.9,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546405200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 6.5,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 6.1,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 8.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 7.3,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 6.3,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 6.6,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546408800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 7.0,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 7.7,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 8.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 7.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.2,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 4.6,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546412400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 7.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 6.55,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 10.65,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.05,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.85,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 10.4,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546473600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 6.7,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546477200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 9.7,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546477200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.4,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546477200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 8.6,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546477200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 7.4,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546480800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 9.8,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546480800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 5.9,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546480800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 8.45,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546480800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 6.3,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546484400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 7.8,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546484400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.1,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546484400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 9.1,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546484400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 5.1,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.3,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 10.5,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 15.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.7,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 14.6,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546560000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 11.0,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.3,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 11.3,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 13.4,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 13.0,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 10.5,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 18.7,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546646400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 17.1,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.3,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 13.0,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 10.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 17.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 8.7,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 19.9,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546732800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 14.8,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 9.8,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 13.4,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 15.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 11.2,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 17.5,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546819200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 13.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.8,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 3.3,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 2.7,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 4.7,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 3.0,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 11.4,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 3.9,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546905600000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 59.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546909200000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 61.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546909200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 66.9,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1546909200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 55.1,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1546909200000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 51.3,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546912800000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 62.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546912800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 68.0,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1546912800000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 50.5,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 8.1,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 8.4,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 9.3,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 6.3,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 3.9,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 7.2,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 30.1,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 21.5,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 21.3,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 34.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 33.2,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 21.3,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 34.5,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 30.6,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 29.3,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 20.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 40.65,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 16.0,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 27.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1546992000000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 17.4,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546995600000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 50.0,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546995600000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 47.3,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1546995600000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 26.7,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1546995600000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 25.4,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1546999200000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 24.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1546999200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 32.6,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1546999200000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 15.5,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 7.4,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 7.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.7,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.0,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 8.7,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 7.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 23.7,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 23.6,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 19.3,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 22.9,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 16.6,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 27.5,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 28.25,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 26.6,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 21.6,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 19.0,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 17.1,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547078400000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 14.9,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547082000000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 28.9,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1547082000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 26.6,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1547082000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 20.8,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1547082000000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 14.8,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547085600000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 28.6,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1547085600000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 20.2,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1547085600000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 14.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.8,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 10.8,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 20.6,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 20.2,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 26.3,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 10.0,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 0.1,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.6,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 13.05,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 17.3,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 25.3,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 24.8,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 6.9,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 10.8,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 31.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547164800000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 18.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 25.3,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 14.5,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 10.2,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 15.05,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 19.75,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 19.5,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 24.9,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 22.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 15.0,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 20.2,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 29.25,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547168400000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 18.5,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 16.2,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 1.3,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 16.5,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 22.6,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 21.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 8.5,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 33.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547172000000,
        "Attribute_Name": "O3",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 25.1,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547175600000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 17.6,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1547175600000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 26.9,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547175600000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 2.7,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1547175600000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 30.9,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      }
    ]
  }
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case PLOT_SET_PROPERTY: {
      return {
        ...state,
        spec: {
          ...state.spec,
          [action.payload.name]: action.payload.value,
        },
      }
    }

    case PLOT_ADD_LAYER: {

      // ToDo :: better way of adding layer without having to use default values?
      // ToDo :: add empty layer object to temp until it's a valid vega object?
      // ToDo :: check if order of layers affects the plot
      // ToDo :: used in PlotPage class

      const newLayer = {
        mark: action.payload.mark,
        encoding: action.payload.encoding,
      };

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer,
            newLayer,
          ],
        },
      }
    }

    case PLOT_DELETE_LAYER: {
      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [...state.spec.layer].filter((layer, i) => i !== action.payload),

        },
      }
    }

    case PLOT_SET_LAYER_MARK: {
      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};
      updatedLayer.mark = action.payload.mark;

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ],
        },
      }
    }

    case PLOT_ADD_LAYER_ENCODING_CHANNEL: {
      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};
      updatedLayer.encoding[action.payload.channelKey] = {};

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ],
        }
      }
    }

    case PLOT_DELETE_LAYER_ENCODING_CHANNEL: {
      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};

      delete updatedLayer.encoding[action.payload.channelKey];

      return {
        ...state,
        layer: [
          ...state.spec.layer.slice(0, action.payload.layerIndex),
          updatedLayer,
          ...state.spec.layer.slice(action.payload.layerIndex + 1),
        ],
      }
    }

    case PLOT_SET_LAYER_ENCODING_CHANNEL_KEY: {
      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};
      updatedLayer.encoding[action.payload.newChannelKey] = updatedLayer.encoding[action.payload.currentChannelKey];

      delete updatedLayer.encoding[action.payload.currentChannelKey];

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ],
        }
      }
    }

    case PLOT_SET_LAYER_ENCODING_CHANNEL_PROPERTY_KEY: {

      // ToDo :: check if this updates the Select menu items for the property values when changed

      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};
      updatedLayer.encoding[action.payload.channelKey][action.payload.newPropertyKey] = updatedLayer.encoding[action.payload.channelKey][action.payload.currentPropertyKey];

      delete updatedLayer.encoding[action.payload.channelKey][action.payload.currentPropertyKey];

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ],
        }
      }
    }

    case PLOT_SET_LAYER_ENCODING_CHANNEL_PROPERTY_VALUE: {
      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};
      updatedLayer.encoding[action.payload.channelKey][action.payload.propertyKey] = action.payload.newValue;

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ]
        }
      }
    }

    case PLOT_ADD_LAYER_ENCODING_CHANNEL_PROPERTY: {

      // ToDo :: should this add an empty object to temp?
      // ToDo :: Does it need property key and value? -- YES - this is the only way that actually works

      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};
      updatedLayer.encoding[action.payload.channelKey][action.payload.propertyKey] = action.payload.propertyValue;

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ]
        }
      }
    }

    case PLOT_DELETE_LAYER_ENCODING_CHANNEL_PROPERTY: {
      const updatedLayer = {...state.spec.layer[action.payload.layerIndex]};

      delete updatedLayer.encoding[action.payload.channelKey][action.payload.propertyKey];

      return {
        ...state,
        spec: {
          ...state.spec,
          layer: [
            ...state.spec.layer.slice(0, action.payload.layerIndex),
            updatedLayer,
            ...state.spec.layer.slice(action.payload.layerIndex + 1),
          ]
        }
      }
    }
    
  }

  return state
}
