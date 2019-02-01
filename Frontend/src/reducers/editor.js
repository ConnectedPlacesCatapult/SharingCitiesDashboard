import {
  PURGE_EDITOR,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
  SET_PLOT_DATA,
  SET_PLOT_PROPERTY,
  SET_PLOT_ENCODING,
  SET_MAP_CENTER,
  SET_MAP_DATA,
  SET_MAP_IS_MAPPABLE,
  SET_MAP_MARKER_ATTRIBUTE,
  SET_MAP_MARKER_COLOR,
  SET_MAP_MARKER_OPACITY,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
  TOGGLE_MAP_TOOLTIP_FIELD
} from "./../constants";

const initialState = {
  isMappable: false,
  name: '',
  type: null,
  plotConfig: {
    spec: {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
      width: 640,
      height: 480,
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
    markerOpacity: 1,
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

    case SET_WIDGET_NAME: {
      return {
        ...state,
        name: action.payload,
      }
    }

    case SET_WIDGET_TYPE: {
      return {
        ...state,
        type: action.payload,
      }
    }

    case SET_PLOT_DATA: {
      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          data: {
            ...state.plotConfig.data,
            values: action.payload,
          }
        }
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

    case SET_PLOT_ENCODING: {
      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          spec: {
            ...state.plotConfig.spec,
            encoding: action.payload,
          }
        }
      }
    }

    case SET_MAP_CENTER: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          center: [action.payload.lat, action.payload.lng],
        },
      }
    }

    case SET_MAP_DATA: {
      const formatted = action.payload.map((feature, i) => {
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
          }
        }
      }
    }

    case SET_MAP_IS_MAPPABLE: {
      return {
        ...state,
        isMappable: action.payload,
      }
    }

    case SET_MAP_MARKER_ATTRIBUTE: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          markerAttribute: action.payload,
        }
      }
    }

    case SET_MAP_MARKER_COLOR: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          markerColor: action.payload,
        }
      }
    }

    case SET_MAP_MARKER_OPACITY: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          markerOpacity: action.payload,
        }
      }
    }

    case SET_MAP_SHOW_HEATMAP: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          showHeatmap: action.payload,
        }
      }
    }

    case SET_MAP_TILE_LAYER: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          tileLayer: action.payload,
        }
      }
    }

    case SET_MAP_ZOOM: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          zoom: action.payload,
        }
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
