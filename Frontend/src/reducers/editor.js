import {
  PURGE_EDITOR,
  SET_MAP_CAN_MAP,
  SET_MAP_CENTER,
  SET_MAP_DATA,
  SET_MAP_HEATMAP_ATTRIBUTE,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
  SET_PLOT_DATA,
  SET_PLOT_DESCRIPTION,
  SET_PLOT_ENCODING,
  SET_PLOT_TYPE,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
} from "./../constants";

const initialState = {
  name: '',
  type: null,
  canMap: false,
  plotConfig: {
    spec: {
      description: "",
      mark: "",
      encoding: {},
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
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case PURGE_EDITOR: {
      return initialState
    }

    case SET_MAP_CAN_MAP: {
      return {
        ...state,
        canMap: action.payload,
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

    case SET_PLOT_DESCRIPTION: {
      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          spec: {
            ...state.plotConfig.spec,
            description: action.payload,
          }
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
            encoding:  {
              ...state.plotConfig.spec.encoding,
              [action.payload.axis]: {
                field: action.payload.field,
                type: action.payload.type,
              },
            },
          }
        }
      }
    }

    case SET_PLOT_TYPE: {
      return {
        ...state,
        plotConfig: {
          ...state.plotConfig,
          spec: {
            ...state.plotConfig.spec,
            mark: action.payload,
          }
        },
      }
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
  }

  return state
}
