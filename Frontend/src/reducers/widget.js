import {
  DATA_FORMAT_OTHER,
  DATA_FORMAT_RAW,
  DATA_FORMAT_WIDE,
  PURGE_EDITOR,
  SET_DATA_FORMAT,
  SET_MAP_DATA,
  SET_MAP_PROPERTY,
  SET_PLOT_DATA,
  SET_PLOT_ENCODING,
  SET_PLOT_PROPERTY,
  SET_WIDGET_PROPERTY,
  TOGGLE_MAP_TOOLTIP_FIELD
} from "./../constants";

const initialState = {
  isMappable: false,
  name: '',
  type: null,
  dataFormat: DATA_FORMAT_WIDE,
  rawData: [],
  plotConfig: {
    spec: {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      width: 640,
      height: 480,
      autosize: {
        type: "fit",
        contains: "padding"
      },
      data: {
        values: [],
      },
      mark: "point",
      encoding: {
        "x": {
          "field": "Timestamp",
          "type": "temporal",
        },
        "y": {
          "field": "Value",
          "type": "quantitative",
        },
        "color": {
          "field": "Attribute_Name",
          "type": "nominal",
        },
      },
    },
    data: {
      values: [],
    },
  },
  mapConfig: {
    center: [],
    data: {
      type: "FeatureCollection",
      features: [],
    },
    markerAttribute: null,
    markerColor: '#00ff00',
    markerRadius: 10,
    showHeatmap: false,
    tileLayer: null,
    tooltipFields: [],
    zoom: 0,
  },
  alertConfig: {},
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case PURGE_EDITOR: {
      return initialState
    }

    case SET_DATA_FORMAT: {
      // ToDo :: parse the data here??

      return {
        ...state,
        dataFormat: action.payload,
      }
    }

    case SET_MAP_DATA: {
      const flattened = action.payload.map((attr) => attr['Attribute_Values']).flat()

      const formatted = flattened.map((feature) => {
        function getProperties(feature) {
          return Object.keys(feature)
            .filter(key => !['Latitude', 'Longitude'].includes(key))
            .reduce((obj, key) => {
              obj[key] = feature[key];
              return obj;
            }, {})
        }

        return {
          type: "Feature",
          properties: getProperties(feature),
          geometry: {
            type: "Point",
            coordinates: [feature["Longitude"], feature["Latitude"]],
          },
        }
      });

      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          data: {
            ...state.mapConfig.data,
            features: formatted,
          },
        },
      }
    }

    case SET_MAP_PROPERTY: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          [action.payload.property]: action.payload.value,
        },
      }
    }

    case SET_PLOT_DATA: {

      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          data: {
            ...state.plotConfig.data,
            values: action.payload.map((attr) => attr['Attribute_Values']).flat(),
          },
        },
      }
    }

    case SET_PLOT_ENCODING: {
      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          spec: {
            ...state.plotConfig.spec,
            encoding: action.payload,
          },
        },
      }
    }

    case SET_PLOT_PROPERTY: {
      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          spec: {
            ...state.plotConfig.spec,
            [action.payload.property]: action.payload.value,
          },
        },
      }
    }

    case SET_WIDGET_PROPERTY: {
      return {
        ...state,
        [action.payload.property]: action.payload.value,
      }
    }

    case TOGGLE_MAP_TOOLTIP_FIELD: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          tooltipFields: action.payload.checked
            ? [...state.mapConfig.tooltipFields, action.payload.field]
            : [...state.mapConfig.tooltipFields].filter(item => item !== action.payload.field),
        },
      }
    }

  }

  return state
}
