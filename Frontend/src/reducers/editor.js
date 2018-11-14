import {
  PURGE_EDITOR,
  SET_MAP_TILE_LAYER,
  SET_PLOT_DESCRIPTION,
  SET_PLOT_ENCODING,
  SET_PLOT_TYPE,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
} from "./../constants";

const initialState = {
  name: '',
  type: null,
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
    isHeatMap: false,
    tileLayer: null,
    data: {
      type: "FeatureCollection",
      features: [],
    },
  },
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case PURGE_EDITOR: {
      return initialState
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
            encoding: action.payload,
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
