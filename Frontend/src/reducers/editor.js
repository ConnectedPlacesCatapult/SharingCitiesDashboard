import {
  PURGE_EDITOR,
  SET_PLOT_TYPE,
  SET_WIDGET_TYPE,
  WIDGET_TYPE_MAP,
  WIDGET_TYPE_PLOT,
} from "./../actions/types";

const initialState = {
  title: null,
  type: null,
  spec: null,
  data: null,
  isHeatMap: false,
  tileLayer: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case PURGE_EDITOR: {
      return initialState
    }

    case SET_PLOT_TYPE: {
      if (state.type === WIDGET_TYPE_PLOT) {
        return {
          ...state,
          spec: {
            ...state.spec,
            mark: action.payload,
          },
        }
      }
    }

    case SET_WIDGET_TYPE: {
      switch (action.payload) {
        case WIDGET_TYPE_PLOT: {

          console.log('plot');

          return {
            ...state,
            type: action.payload,
            spec: {
              description: "",
              mark: "",
              encoding: {},
            },
            data: {
              values: [],
            },
          }
        }

        case WIDGET_TYPE_MAP: {
          return {
            ...state,
            type: action.payload,
            isHeatMap: false,
            tileLayer: null,
            spec: null,
            data: {
              type: "FeatureCollection",
              features: [],
            }
          }
        }
      }
    }
  }

  return state
}
