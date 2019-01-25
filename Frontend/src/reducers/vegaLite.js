import {
  VEGA_LITE_SET_PROPERTY,
  VEGA_LITE_SET_ENCODING_CHANNEL,
} from './../constants';

const initialState = {
  spec: {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    width: 640,
    height: 480,
    title: "plot title",
    data: {
      values: [],
    },
    mark: "point",
    encoding: {
      "x": {
        "field": "Timestamp",
        "type": "temporal",
        "timeUnit": "year",
      },
      "y": {
        "field": "Value",
        "type": "quantitative",
      },
    },
  },
  data: {
    values: [
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
        "Timestamp": 1547078400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
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
        "Timestamp": 1547251200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.2,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547251200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547337600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547337600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547424000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547510400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547510400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547596800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547596800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547683200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547683200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547769600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547769600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547773200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547773200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.65,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547776800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547780400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547780400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547784000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.5,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547784000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547787600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547787600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547791200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547791200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547794800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547794800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547798400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.4,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547798400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.8,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547798400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 10.2,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.8,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 9.1,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 7.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 13.3,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.9,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 12.4,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547802000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 21.8,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547805600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 6.9,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547805600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 19.6,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547805600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 8.8,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547805600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 13.1,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 10.8,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 12.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 20.1,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 8.4,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 10.7,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547809200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 24.1,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.7,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 9.0,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 11.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 21.4,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 10.3,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 10.7,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547812800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 24.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547816400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.6,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547816400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.6,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547816400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 8.8,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547816400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 11.4,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547816400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 22.0,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1547856000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.2,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547856000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.5,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547856000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 5.8,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547856000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547856000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 4.9,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.3,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 12.4,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 14.7,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 18.4,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 14.8,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 21.3,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1547942400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 19.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.5,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 15.3,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 14.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 26.4,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 12.5,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 35.7,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548028800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 27.7,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548032400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.7,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548036000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.8,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548039600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548043200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.8,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548046800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548050400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548054000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.0,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548057600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.2,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548061200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 1.2,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548064800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.9,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 4.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 4.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 3.3,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 15.8,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548115200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 2.6,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.9,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 8.0,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 2.0,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 6.8,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 3.6,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 7.8,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548201600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 4.5,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 5.4,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": -0.7,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 3.4,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 2.8,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 7.0,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 3.1,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 51.9,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 37.9,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 53.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 38.9,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 52.6,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 43.4,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 41.9,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 35.9,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 54.7,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 40.7,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548205200000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 62.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.9,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 3.0,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 0.0,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 3.2,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 3.3,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 11.55,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 3.0,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 42.3,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 43.9,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 26.9,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 53.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 24.8,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 41.9,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 6.6,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 47.5,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 46.4,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 34.4,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 29.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 54.5,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 47.1,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548208800000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 56.2,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.9,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 2.9,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 1.2,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 3.5,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 3.5,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 6.3,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 3.8,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 45.9,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 35.8,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 24.9,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 51.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 25.4,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 33.9,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 6.2,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 44.4,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 38.4,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 16.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 49.7,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 45.7,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548212400000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 45.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 0.9,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 4.8,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 2.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 5.1,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 4.7,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 10.7,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 5.3,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 38.3,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 27.3,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 22.5,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 41.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 25.6,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 31.4,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 23.4,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 35.8,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 25.9,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 29.9,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 39.3,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 47.5,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548216000000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 34.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 4.9,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 2.1,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 6.1,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 5.7,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 10.4,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 5.4,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 24.5,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 20.2,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 23.95,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 36.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 24.0,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 16.0,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 29.6,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 36.0,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 51.9,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 23.3,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 39.9,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548219600000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 29.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 4.9,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 3.9,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.1,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 5.9,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 8.2,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 7.1,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 42.4,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 37.3,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 30.1,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
        "Value": 6.9,
        "Name": "GR9",
        "Latitude": 51.456357,
        "Longitude": 0.040725
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 14.0,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 32.5,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 34.6,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 54.4,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 46.15,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 18.9,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 26.7,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548223200000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 50.2,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.0,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 7.2,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 5.5,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 8.8,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.1,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
        "Value": 8.2,
        "Name": "RB4",
        "Latitude": 51.57661,
        "Longitude": 0.030858
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 8.7,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 22.2,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 50.5,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
        "Value": 37.9,
        "Name": "GN3",
        "Latitude": 51.486957,
        "Longitude": 0.095111
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 24.1,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
        "Value": 23.05,
        "Name": "GR8",
        "Latitude": 51.486884,
        "Longitude": 0.017901
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 33.0,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
        "Value": 43.8,
        "Name": "GR4",
        "Latitude": 51.45258,
        "Longitude": 0.070766
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 55.9,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 42.2,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 18.6,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
        "Value": 15.8,
        "Name": "BL0",
        "Latitude": 51.522287,
        "Longitude": -0.125848
      },
      {
        "Timestamp": 1548226800000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 58.1,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "CO",
        "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
        "Value": 1.1,
        "Name": "MY1",
        "Latitude": 51.52254,
        "Longitude": -0.15459
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "CO",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 0.4,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 4.6,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
        "Value": 7.6,
        "Name": "BX2",
        "Latitude": 51.4906102082,
        "Longitude": 0.1589144939
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "FINE",
        "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
        "Value": 9.0,
        "Name": "BT4",
        "Latitude": 51.552476,
        "Longitude": -0.258089
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
        "Value": 41.5,
        "Name": "HI0",
        "Latitude": 51.496309,
        "Longitude": -0.460826
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
        "Value": 52.0,
        "Name": "HK6",
        "Latitude": 51.526454,
        "Longitude": -0.08491
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
        "Value": 27.0,
        "Name": "BQ7",
        "Latitude": 51.4946486813,
        "Longitude": 0.1372791112
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
        "Value": 26.4,
        "Name": "TH4",
        "Latitude": 51.5150461674,
        "Longitude": -0.0084184927
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
        "Value": 37.9,
        "Name": "GB6",
        "Latitude": 51.4563,
        "Longitude": 0.085606
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
        "Value": 56.4,
        "Name": "RI2",
        "Latitude": 51.476168,
        "Longitude": -0.230427
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
        "Value": 34.4,
        "Name": "BX1",
        "Latitude": 51.4659832747,
        "Longitude": 0.184877127
      },
      {
        "Timestamp": 1548230400000,
        "Attribute_Name": "O3",
        "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
        "Value": 57.3,
        "Name": "KC1",
        "Latitude": 51.5210467476,
        "Longitude": -0.2134921396
      }
    ]
  }
};

export default (state=initialState, action={}) => {
  switch (action.type) {

  }

  return state
}
