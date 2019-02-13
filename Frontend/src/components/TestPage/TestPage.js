import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { darken, lighten } from "@material-ui/core/styles/colorManipulator";

import L from 'leaflet';

const TEST_DATA = [
  {
    "Timestamp": 1548460800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "5.4",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548460800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "-2.5",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1548460800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "11.2",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548460800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "10.5",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548460800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "7.7",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548460800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5.5",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548547200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "6.3",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548547200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "5.9",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1548547200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "5.6",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548547200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5.6",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548547200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "4.8",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548547200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "5.1",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548633600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "5.1",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548633600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "7.4",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548633600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "6.5",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1548633600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "7.6",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548633600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "5.5",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548633600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "6.4",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548720000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "12.6",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548720000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "8.8",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548720000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "20.1",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548806400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "3.6",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548806400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "4.6",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548806400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "4.5",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548806400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "5.3",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548806400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "13",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548806400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548810000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "14.2",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548810000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "4.7",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548810000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5.1",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548810000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "10.7",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548810000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "6.5",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548810000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "3.5",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548813600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "4",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548813600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "5.5",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548813600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "8.2",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548813600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "3.7",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548813600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "3",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548817200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "6.3",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548817200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "5.4",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548817200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "3.1",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548817200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "3.6",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548817200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "2.9",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548820800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "4.7",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548820800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "2.5",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548820800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "4.5",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548820800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "6.8",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548820800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "2.1",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548824400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "9",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548824400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "3.4",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548824400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "3.8",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548824400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "3.9",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548824400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "3.8",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548828000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "8.4",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548828000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "-1.5",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548828000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548828000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "3.5",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548828000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "8.5",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548831600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "4.1",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548831600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "11.2",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548831600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "4.6",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548831600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "0.5",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548831600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "11.8",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548835200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5.3",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548835200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "6.8",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548835200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "14.4",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548892800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "26.9",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548892800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "12.4",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548892800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "26.1",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548892800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "840c6d44-03e0-4df0-85eb-75c311107d25",
    "Value": "12.1",
    "Name": "BX2",
    "Latitude": 51.4906102082,
    "Longitude": 0.1589144939
  },
  {
    "Timestamp": 1548892800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "29.9",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548979200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "9.5",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1548979200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "3.9",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1548979200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "5",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1548979200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "4.3",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1548979200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "4.8",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549065600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "7.9",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549065600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "7.7",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1549065600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "8.8",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549065600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "8.4",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549065600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "10.9",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549152000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "6.3",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549152000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "9.3",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549152000000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "7.4",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549238400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "2.6",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549238400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "3.3",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549238400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "7.7",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549238400000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "11.4",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "13.6",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "20.9",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "16.5",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "10.4",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "2.7",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "7.9",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "3.7",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "2.4",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "2.2",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "2.4",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "5.1",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "FINE",
    "Attribute_Table": "FINE_2211a34b_c472_4310_9a54_2d35c8cfdb1c",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "0.6",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "60bd5e24-49f5-49b5-8dc2-be4932fba2cf",
    "Value": "60.2",
    "Name": "BT5",
    "Latitude": 51.552656,
    "Longitude": -0.248774
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "60bd5e24-49f5-49b5-8dc2-be4932fba2cf",
    "Value": "18.4",
    "Name": "BT5",
    "Latitude": 51.552656,
    "Longitude": -0.248774
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "60bd5e24-49f5-49b5-8dc2-be4932fba2cf",
    "Value": "10.9",
    "Name": "BT5",
    "Latitude": 51.552656,
    "Longitude": -0.248774
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "82.3",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "27.3",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "dab0f36f-a630-4095-a8e6-0fe4114dc053",
    "Value": "20.6",
    "Name": "BT4",
    "Latitude": 51.552476,
    "Longitude": -0.258089
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "34.6",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "5.5",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "0.7",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "c0721c2b-8b49-44d0-b49e-665a317b27ff",
    "Value": "45.7",
    "Name": "BG1",
    "Latitude": 51.563752,
    "Longitude": 0.177891
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "c0721c2b-8b49-44d0-b49e-665a317b27ff",
    "Value": "11.6",
    "Name": "BG1",
    "Latitude": 51.563752,
    "Longitude": 0.177891
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "c0721c2b-8b49-44d0-b49e-665a317b27ff",
    "Value": "7.1",
    "Name": "BG1",
    "Latitude": 51.563752,
    "Longitude": 0.177891
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
    "Value": "49.7",
    "Name": "MY1",
    "Latitude": 51.52254,
    "Longitude": -0.15459
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
    "Value": "41.5",
    "Name": "MY1",
    "Latitude": 51.52254,
    "Longitude": -0.15459
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7fc6d044-350e-4353-959e-9be070424864",
    "Value": "13.2",
    "Name": "CR5",
    "Latitude": 51.411349,
    "Longitude": -0.12311
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7fc6d044-350e-4353-959e-9be070424864",
    "Value": "6.3",
    "Name": "CR5",
    "Latitude": 51.411349,
    "Longitude": -0.12311
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "551dca00-cac3-4edc-8293-0a023a89518a",
    "Value": "11.2",
    "Name": "GN0",
    "Latitude": 51.490532,
    "Longitude": 0.074003
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "551dca00-cac3-4edc-8293-0a023a89518a",
    "Value": "5.7",
    "Name": "GN0",
    "Latitude": 51.490532,
    "Longitude": 0.074003
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "4760b3a5-59b1-4d51-aa84-f234124db81c",
    "Value": "17",
    "Name": "CD1",
    "Latitude": 51.544219,
    "Longitude": -0.175284
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "4760b3a5-59b1-4d51-aa84-f234124db81c",
    "Value": "12.4",
    "Name": "CD1",
    "Latitude": 51.544219,
    "Longitude": -0.175284
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
    "Value": "6.7",
    "Name": "BX1",
    "Latitude": 51.4659832747,
    "Longitude": 0.184877127
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
    "Value": "2.3",
    "Name": "BX1",
    "Latitude": 51.4659832747,
    "Longitude": 0.184877127
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "e021b6ab-5eca-4490-b0c9-21d47d9b8957",
    "Value": "27.1",
    "Name": "BT6",
    "Latitude": 51.537799,
    "Longitude": -0.247793
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "e021b6ab-5eca-4490-b0c9-21d47d9b8957",
    "Value": "27.1",
    "Name": "BT6",
    "Latitude": 51.537799,
    "Longitude": -0.247793
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "56fd6318-7233-40e2-a6aa-39971baba22e",
    "Value": "27.2",
    "Name": "HV3",
    "Latitude": 51.572976,
    "Longitude": 0.179079
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "56fd6318-7233-40e2-a6aa-39971baba22e",
    "Value": "7.3",
    "Name": "HV3",
    "Latitude": 51.572976,
    "Longitude": 0.179079
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "a6ad5d2e-a1fb-4d05-a9d5-9cb680cd5abc",
    "Value": "19",
    "Name": "HV1",
    "Latitude": 51.5207874593,
    "Longitude": 0.2054607057
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "a6ad5d2e-a1fb-4d05-a9d5-9cb680cd5abc",
    "Value": "5",
    "Name": "HV1",
    "Latitude": 51.5207874593,
    "Longitude": 0.2054607057
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
    "Value": "8.7",
    "Name": "GB6",
    "Latitude": 51.4563,
    "Longitude": 0.085606
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
    "Value": "1.9",
    "Name": "GB6",
    "Latitude": 51.4563,
    "Longitude": 0.085606
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d3a7b126-e21f-4684-b8ad-1b3bb7e5fa4a",
    "Value": "13.9",
    "Name": "CT3",
    "Latitude": 51.5138471784,
    "Longitude": -0.0777656818
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d3a7b126-e21f-4684-b8ad-1b3bb7e5fa4a",
    "Value": "12.7",
    "Name": "CT3",
    "Latitude": 51.5138471784,
    "Longitude": -0.0777656818
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7f95c811-819f-4c5d-913b-4d58e6b7c140",
    "Value": "31.6",
    "Name": "HG1",
    "Latitude": 51.599302,
    "Longitude": -0.068218
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7f95c811-819f-4c5d-913b-4d58e6b7c140",
    "Value": "24",
    "Name": "HG1",
    "Latitude": 51.599302,
    "Longitude": -0.068218
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
    "Value": "10.9",
    "Name": "GR9",
    "Latitude": 51.456357,
    "Longitude": 0.040725
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
    "Value": "8.3",
    "Name": "GR9",
    "Latitude": 51.456357,
    "Longitude": 0.040725
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "0ce44b08-e28b-4ed6-8eca-cebfb6db0bde",
    "Value": "24.7",
    "Name": "GR7",
    "Latitude": 51.472504,
    "Longitude": -0.012381
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "0ce44b08-e28b-4ed6-8eca-cebfb6db0bde",
    "Value": "13",
    "Name": "GR7",
    "Latitude": 51.472504,
    "Longitude": -0.012381
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "82cedcc6-ab40-495f-98fe-c7dfe1d397eb",
    "Value": "21.1",
    "Name": "EI1",
    "Latitude": 51.5236078191,
    "Longitude": -0.2655026318
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "82cedcc6-ab40-495f-98fe-c7dfe1d397eb",
    "Value": "18.6",
    "Name": "EI1",
    "Latitude": 51.5236078191,
    "Longitude": -0.2655026318
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "4ecc8379-5fe1-4a84-affa-6f9f4c6b8ea4",
    "Value": "13.8",
    "Name": "EA8",
    "Latitude": 51.518948,
    "Longitude": -0.265617
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "4ecc8379-5fe1-4a84-affa-6f9f4c6b8ea4",
    "Value": "9.8",
    "Name": "EA8",
    "Latitude": 51.518948,
    "Longitude": -0.265617
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "95be4085-d732-4227-ab2b-e944ce7f6df0",
    "Value": "64.1",
    "Name": "CT6",
    "Latitude": 51.510499,
    "Longitude": -0.091634
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "95be4085-d732-4227-ab2b-e944ce7f6df0",
    "Value": "62.7",
    "Name": "CT6",
    "Latitude": 51.510499,
    "Longitude": -0.091634
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "fd36e6dd-f8be-43ac-8ea2-48e6c756a612",
    "Value": "33.7",
    "Name": "EA6",
    "Latitude": 51.53085,
    "Longitude": -0.292488
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "fd36e6dd-f8be-43ac-8ea2-48e6c756a612",
    "Value": "29.5",
    "Name": "EA6",
    "Latitude": 51.53085,
    "Longitude": -0.292488
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "f5289022-ec7e-4ff8-9acd-4211e947b952",
    "Value": "22.1",
    "Name": "EN5",
    "Latitude": 51.613865,
    "Longitude": -0.125338
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "f5289022-ec7e-4ff8-9acd-4211e947b952",
    "Value": "13.5",
    "Name": "EN5",
    "Latitude": 51.613865,
    "Longitude": -0.125338
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d7981b2e-4dec-420c-8bc7-40b7ddc5429e",
    "Value": "23.6",
    "Name": "EN4",
    "Latitude": 51.614864007,
    "Longitude": -0.0507658364
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d7981b2e-4dec-420c-8bc7-40b7ddc5429e",
    "Value": "16",
    "Name": "EN4",
    "Latitude": 51.614864007,
    "Longitude": -0.0507658364
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "95e12467-be3e-4bf2-92ea-29bd1bf5a698",
    "Value": "11.4",
    "Name": "LW2",
    "Latitude": 51.474954,
    "Longitude": -0.039641
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "95e12467-be3e-4bf2-92ea-29bd1bf5a698",
    "Value": "8.9",
    "Name": "LW2",
    "Latitude": 51.474954,
    "Longitude": -0.039641
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
    "Value": "8.5",
    "Name": "GN3",
    "Latitude": 51.486957,
    "Longitude": 0.095111
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
    "Value": "4.8",
    "Name": "GN3",
    "Latitude": 51.486957,
    "Longitude": 0.095111
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7dac8e6e-d45b-4bb9-8512-06527d7229f1",
    "Value": "12.5",
    "Name": "HR1",
    "Latitude": 51.617327,
    "Longitude": -0.298775
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7dac8e6e-d45b-4bb9-8512-06527d7229f1",
    "Value": "9.2",
    "Name": "HR1",
    "Latitude": 51.617327,
    "Longitude": -0.298775
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "31.9",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "36.5",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "31.8",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "17.7",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
    "Value": "21",
    "Name": "HI0",
    "Latitude": 51.496309,
    "Longitude": -0.460826
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
    "Value": "19.9",
    "Name": "HI0",
    "Latitude": 51.496309,
    "Longitude": -0.460826
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "066a1847-2e01-4b36-959e-786ceff01173",
    "Value": "17.3",
    "Name": "LW1",
    "Latitude": 51.445468,
    "Longitude": -0.020266
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "066a1847-2e01-4b36-959e-786ceff01173",
    "Value": "10.4",
    "Name": "LW1",
    "Latitude": 51.445468,
    "Longitude": -0.020266
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "5c257148-13ca-410a-8e7c-c313b769ec75",
    "Value": "24.7",
    "Name": "HR2",
    "Latitude": 51.588417,
    "Longitude": -0.362989
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "5c257148-13ca-410a-8e7c-c313b769ec75",
    "Value": "16.8",
    "Name": "HR2",
    "Latitude": 51.588417,
    "Longitude": -0.362989
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "dd302595-54c8-424d-ac28-e15820612fb6",
    "Value": "23.4",
    "Name": "IS6",
    "Latitude": 51.557895,
    "Longitude": -0.106989
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "dd302595-54c8-424d-ac28-e15820612fb6",
    "Value": "19.6",
    "Name": "IS6",
    "Latitude": 51.557895,
    "Longitude": -0.106989
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "c212151b-09b0-4634-802b-131fb8777935",
    "Value": "31.6",
    "Name": "IS2",
    "Latitude": 51.555378,
    "Longitude": -0.116146
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "c212151b-09b0-4634-802b-131fb8777935",
    "Value": "27.4",
    "Name": "IS2",
    "Latitude": 51.555378,
    "Longitude": -0.116146
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
    "Value": "10.3",
    "Name": "KC1",
    "Latitude": 51.5210467476,
    "Longitude": -0.2134921396
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
    "Value": "7.2",
    "Name": "KC1",
    "Latitude": 51.5210467476,
    "Longitude": -0.2134921396
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "88566b68-78ae-43f3-bb48-76801fb6b5b3",
    "Value": "16.8",
    "Name": "LB6",
    "Latitude": 51.4282131429,
    "Longitude": -0.1318686388
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "88566b68-78ae-43f3-bb48-76801fb6b5b3",
    "Value": "9.1",
    "Name": "LB6",
    "Latitude": 51.4282131429,
    "Longitude": -0.1318686388
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "3004cb8a-2e0d-4d7c-b4ac-5985d83418c1",
    "Value": "30.7",
    "Name": "LB5",
    "Latitude": 51.485486774,
    "Longitude": -0.1245452348
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "3004cb8a-2e0d-4d7c-b4ac-5985d83418c1",
    "Value": "20.1",
    "Name": "LB5",
    "Latitude": 51.485486774,
    "Longitude": -0.1245452348
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
    "Value": "28.8",
    "Name": "TH4",
    "Latitude": 51.5150461674,
    "Longitude": -0.0084184927
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
    "Value": "29.9",
    "Name": "TH4",
    "Latitude": 51.5150461674,
    "Longitude": -0.0084184927
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7475490b-3d67-4bcc-9cbe-75b6dd574f49",
    "Value": "18.6",
    "Name": "RI1",
    "Latitude": 51.480189,
    "Longitude": -0.237335
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "7475490b-3d67-4bcc-9cbe-75b6dd574f49",
    "Value": "10.3",
    "Name": "RI1",
    "Latitude": 51.480189,
    "Longitude": -0.237335
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "56c745cd-ad6d-4550-bd9d-556979b1fc05",
    "Value": "2",
    "Name": "ST4",
    "Latitude": 51.3586596125,
    "Longitude": -0.1497239466
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "56c745cd-ad6d-4550-bd9d-556979b1fc05",
    "Value": "2.9",
    "Name": "ST4",
    "Latitude": 51.3586596125,
    "Longitude": -0.1497239466
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "20",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "a74808e6-c537-4a26-8133-d4407fb37a1e",
    "Value": "14.7",
    "Name": "RB4",
    "Latitude": 51.57661,
    "Longitude": 0.030858
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d36ee57b-a5cd-4dea-81e6-e9c0fb37bc76",
    "Value": "8.2",
    "Name": "SK5",
    "Latitude": 51.4804994936,
    "Longitude": -0.0595528933
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d36ee57b-a5cd-4dea-81e6-e9c0fb37bc76",
    "Value": "3.1",
    "Name": "SK5",
    "Latitude": 51.4804994936,
    "Longitude": -0.0595528933
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
    "Value": "7.6",
    "Name": "RI2",
    "Latitude": 51.476168,
    "Longitude": -0.230427
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
    "Value": "3.8",
    "Name": "RI2",
    "Latitude": 51.476168,
    "Longitude": -0.230427
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "83c7f4f6-ca98-40b6-a091-c3b28b206626",
    "Value": "24.7",
    "Name": "TH2",
    "Latitude": 51.5225294861,
    "Longitude": -0.0421550992
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "83c7f4f6-ca98-40b6-a091-c3b28b206626",
    "Value": "24",
    "Name": "TH2",
    "Latitude": 51.5225294861,
    "Longitude": -0.0421550992
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "abf2dd0b-ad88-43ae-8c39-57fcf289d5b0",
    "Value": "23.7",
    "Name": "ST6",
    "Latitude": 51.377923,
    "Longitude": -0.240414
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "abf2dd0b-ad88-43ae-8c39-57fcf289d5b0",
    "Value": "6.8",
    "Name": "ST6",
    "Latitude": 51.377923,
    "Longitude": -0.240414
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "3704c8e1-d93b-4efa-9c69-d4fda8fc805e",
    "Value": "33",
    "Name": "ST5",
    "Latitude": 51.3892869045,
    "Longitude": -0.1416615248
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "3704c8e1-d93b-4efa-9c69-d4fda8fc805e",
    "Value": "3.2",
    "Name": "ST5",
    "Latitude": 51.3892869045,
    "Longitude": -0.1416615248
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "32ff0ea1-0365-4c30-b96f-06bb1a55ed74",
    "Value": "19.5",
    "Name": "WM5",
    "Latitude": 51.5119769826,
    "Longitude": -0.1216272033
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "32ff0ea1-0365-4c30-b96f-06bb1a55ed74",
    "Value": "14.8",
    "Name": "WM5",
    "Latitude": 51.5119769826,
    "Longitude": -0.1216272033
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d33635e2-d1a5-48bb-b37f-8c6ea9b6786e",
    "Value": "14.9",
    "Name": "WA2",
    "Latitude": 51.456962,
    "Longitude": -0.191074
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "d33635e2-d1a5-48bb-b37f-8c6ea9b6786e",
    "Value": "9.5",
    "Name": "WA2",
    "Latitude": 51.456962,
    "Longitude": -0.191074
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "4265769a-3c04-421d-b55f-8c474e4c41d5",
    "Value": "9.6",
    "Name": "BG2",
    "Latitude": 51.529389,
    "Longitude": 0.132857
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "4265769a-3c04-421d-b55f-8c474e4c41d5",
    "Value": "4.9",
    "Name": "BG2",
    "Latitude": 51.529389,
    "Longitude": 0.132857
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "NO2",
    "Attribute_Table": "NO2_33f935da_323d_45f8_87cb_ba58f75b4482",
    "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
    "Value": "8.1",
    "Name": "GR4",
    "Latitude": 51.45258,
    "Longitude": 0.070766
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "36.2",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "1f43b87d-002e-45b0-a6a4-5f5aeaf70f52",
    "Value": "64.5",
    "Name": "BQ7",
    "Latitude": 51.4946486813,
    "Longitude": 0.1372791112
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
    "Value": "3.7",
    "Name": "MY1",
    "Latitude": 51.52254,
    "Longitude": -0.15459
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
    "Value": "10.4",
    "Name": "MY1",
    "Latitude": 51.52254,
    "Longitude": -0.15459
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "8eaa7e71-8fb2-4463-bb60-6d2f5d0371fb",
    "Value": "32.4",
    "Name": "MY1",
    "Latitude": 51.52254,
    "Longitude": -0.15459
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
    "Value": "39.5",
    "Name": "BX1",
    "Latitude": 51.4659832747,
    "Longitude": 0.184877127
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "9913f9d3-b6ec-4406-b652-37d0de9e70c3",
    "Value": "67",
    "Name": "BX1",
    "Latitude": 51.4659832747,
    "Longitude": 0.184877127
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
    "Value": "2",
    "Name": "GB6",
    "Latitude": 51.4563,
    "Longitude": 0.085606
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
    "Value": "34.6",
    "Name": "GB6",
    "Latitude": 51.4563,
    "Longitude": 0.085606
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "596f0ecf-a9ba-4c0d-9064-7e6a222fc56d",
    "Value": "61.9",
    "Name": "GB6",
    "Latitude": 51.4563,
    "Longitude": 0.085606
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
    "Value": "-0.1",
    "Name": "GR9",
    "Latitude": 51.456357,
    "Longitude": 0.040725
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
    "Value": "37.2",
    "Name": "GR9",
    "Latitude": 51.456357,
    "Longitude": 0.040725
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "29b2881d-9930-4ff1-aa28-2f56bc1fa756",
    "Value": "55.6",
    "Name": "GR9",
    "Latitude": 51.456357,
    "Longitude": 0.040725
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
    "Value": "4.7",
    "Name": "GN3",
    "Latitude": 51.486957,
    "Longitude": 0.095111
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
    "Value": "35.3",
    "Name": "GN3",
    "Latitude": 51.486957,
    "Longitude": 0.095111
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "14261bfc-2d11-4c35-9a27-a73c724e6904",
    "Value": "59.9",
    "Name": "GN3",
    "Latitude": 51.486957,
    "Longitude": 0.095111
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "1.5",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "20.8",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "0c3ad903-1512-4775-bac9-d1ca91ebed51",
    "Value": "39.5",
    "Name": "HK6",
    "Latitude": 51.526454,
    "Longitude": -0.08491
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "18.6",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "47f20356-7bf6-4ce0-b5d7-4123c44f8229",
    "Value": "45.2",
    "Name": "GR8",
    "Latitude": 51.486884,
    "Longitude": 0.017901
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
    "Value": "23.9",
    "Name": "HI0",
    "Latitude": 51.496309,
    "Longitude": -0.460826
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "0a15b00f-7b10-427c-8c5c-8c7fcf4edb13",
    "Value": "46.1",
    "Name": "HI0",
    "Latitude": 51.496309,
    "Longitude": -0.460826
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
    "Value": "-2.6",
    "Name": "KC1",
    "Latitude": 51.5210467476,
    "Longitude": -0.2134921396
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
    "Value": "32.3",
    "Name": "KC1",
    "Latitude": 51.5210467476,
    "Longitude": -0.2134921396
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "d7ce4006-0a32-4734-bd55-fc19b225aa14",
    "Value": "55.8",
    "Name": "KC1",
    "Latitude": 51.5210467476,
    "Longitude": -0.2134921396
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
    "Value": "15.3",
    "Name": "TH4",
    "Latitude": 51.5150461674,
    "Longitude": -0.0084184927
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "53f43c22-962c-4385-8070-7ec664a33755",
    "Value": "30",
    "Name": "TH4",
    "Latitude": 51.5150461674,
    "Longitude": -0.0084184927
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
    "Value": "9.3",
    "Name": "RI2",
    "Latitude": 51.476168,
    "Longitude": -0.230427
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
    "Value": "39.9",
    "Name": "RI2",
    "Latitude": 51.476168,
    "Longitude": -0.230427
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "77aca2bd-a825-476e-bc1d-9462b52b2924",
    "Value": "66.5",
    "Name": "RI2",
    "Latitude": 51.476168,
    "Longitude": -0.230427
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
    "Value": "0.8",
    "Name": "GR4",
    "Latitude": 51.45258,
    "Longitude": 0.070766
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
    "Value": "0.8",
    "Name": "GR4",
    "Latitude": 51.45258,
    "Longitude": 0.070766
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "5876bb67-8750-4c9e-88ff-b22099eae25b",
    "Value": "64.2",
    "Name": "GR4",
    "Latitude": 51.45258,
    "Longitude": 0.070766
  },
  {
    "Timestamp": 1549324800000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
    "Value": "2.4",
    "Name": "BL0",
    "Latitude": 51.522287,
    "Longitude": -0.125848
  },
  {
    "Timestamp": 1549411200000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
    "Value": "33.5",
    "Name": "BL0",
    "Latitude": 51.522287,
    "Longitude": -0.125848
  },
  {
    "Timestamp": 1549497600000,
    "Attribute_Name": "O3",
    "Attribute_Table": "O3_b7f8bc31_5636_4b0c_a43f_72fe7ea36067",
    "Sensor_id": "9a172223-a1c1-456c-b8ae-da31b0cbd4a1",
    "Value": "73",
    "Name": "BL0",
    "Latitude": 51.522287,
    "Longitude": -0.125848
  }
];

const CONFIG = {
  params: {
    center: [51.505, -0.09],
    zoomControl: false,
    zoom: 13,
    maxZoom: 19,
    minZoom: 11,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true
  },
  tileLayer: {
    uri: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    params: {
      minZoom: 11,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  }
};

const ATTRIBUTES = [
  { name: 'NO2', color: "rgba(213, 74, 68, 0.8)", },
  { name: 'O3', color: "rgba(68, 213, 190, 0.8)", },
  { name: 'FINE', color: "rgba(218, 45, 248, 0.8)", },
];

const formatData = (data = []) => {
  return data.map((feature) => ({
    type: "Feature",
    properties: getFeatureProperties(feature),
    geometry: {
      type: "Point",
      coordinates: [feature["Longitude"], feature["Latitude"]],
    },
  }))
};

const getFeatureProperties = (feature) => {
  return Object.keys(feature)
    .filter((key) => !['Latitude', 'Longitude'].includes(key))
    .reduce((obj, key) => {
      obj[key] = feature[key];
      return obj
    }, {})
};







const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  leafletContainer: {
    height: '800px',
    width: '1000px',
    margin: '0 auto',
  },
});

class TestPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      // data: {},
      // layersControl: null,
      // baseLayers: [],
      // overlays: [],
      // tileLayer: null,
      // dataLayers: [],
    };

    this._mapNode = null;
  }

  componentDidMount() {
    if (!this.state.map) {
      this.init(this._mapNode);
    }
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.state.map.remove();
  }

  init = (id) => {
    if (this.state.map) return;

    const featuresArray = formatData(TEST_DATA);

    const data = {
      type: "FeatureCollection",
      features: featuresArray,
    };

    this.setValueLimits(featuresArray);

    const map = L.map(id, CONFIG.params);

    const baseLayers = {
      "baseLayer": L.tileLayer(CONFIG.tileLayer.uri, CONFIG.tileLayer.params).addTo(map),
    };

    let overlays = {};
    for (let attr of ATTRIBUTES) {
      let options = {
        filter: (feature) => { return feature.properties["Attribute_Name"] === attr.name },
        onEachFeature: (feature, layer) => {
          let popupContent = `<h4>Sensor ${feature.properties.Name}</h4><p>${feature.properties.Attribute_Name}: ${feature.properties.Value}</p>`;
          layer.bindPopup(popupContent);
        },
        pointToLayer: (feature, latlng) => {
          let markerParams = {
            center: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
            radius: this.getMarkerRadius(10, feature.properties.Value),
            stroke: false,
            fillColor: this.getMarkerColor(attr.color, feature.properties.Value),
            //fillOpacity: 0.8,
          };

          return L.circleMarker(latlng, markerParams);
        }
      };

      overlays[attr.name] = L.geoJson(data, options).addTo(map)
    }

    L.control.layers(baseLayers, overlays).addTo(map);

    this.setState({ map });
  };

  getMarkerColor = (baseColor, val) => {
    const diff = this.maxValue - this.minValue;
    const step = diff / 5;

    switch(true) {
      case val > (4 * step) + this.minValue:
        return lighten(baseColor, 0.5);
      case val > (3 * step) + this.minValue:
        return lighten(baseColor, 0.25);
      case val > (2 * step) + this.minValue:
        return baseColor;
      case val > step + this.minValue:
        return darken(baseColor, 0.25);
      default:
        return darken(baseColor, 0.5);
    }
  };

  getMarkerRadius = (base, val) => {
    return base * ((val - this.minValue) / (this.maxValue - this.minValue))
  };

  setValueLimits = (features) => {
    let min = null;
    let max = null;
    let watchedAttribute = 'Value';

    for (let feature of features) {
      let attributeValue = feature.properties[watchedAttribute];

      if (Number.isInteger(attributeValue) || parseFloat(attributeValue)) {
        if (attributeValue < min || min === null) min = attributeValue;
        if (attributeValue > max || max === null) max = attributeValue;
      }
    }

    this.minValue = min;
    this.maxValue = max;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div id="leafletContainer" className={classes.leafletContainer} ref={(node) => this._mapNode = node} />
      </div>
    )
  }
}

TestPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

TestPage = withStyles(styles)(TestPage);

export default TestPage
