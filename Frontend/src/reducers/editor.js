import {
  PURGE_EDITOR,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
  SET_PLOT_DATA,
  SET_PLOT_PROPERTY,
  SET_PLOT_ENCODING,
  SET_MAP_CENTER,
  SET_MAP_DATA,
  SET_MAP_HEATMAP_ATTRIBUTE,
  SET_MAP_IS_MAPPABLE,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
} from "./../constants";

const initialState = {
  name: '',
  type: null,
  isMappable: false,
  plotConfig: {
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
      values: [],
    },
  },
  mapConfig: {
    center: [],
    data: {
      type: "FeatureCollection",
      features: [],
    },
    showHeatmap: false,
    heatmapAttribute: null,
    tileLayer: null,
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
            .filter(key => !['lat', 'lon'].includes(key))
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
            coordinates: [feature.lon, feature.lat],
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

    case SET_MAP_HEATMAP_ATTRIBUTE: {
      return {
        ...state,
        mapConfig: {
          ...state.mapConfig,
          heatmapAttribute: action.payload,
        }
      }
    }

    case SET_MAP_IS_MAPPABLE: {
      return {
        ...state,
        isMappable: action.payload,
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

  }

  return state
}
