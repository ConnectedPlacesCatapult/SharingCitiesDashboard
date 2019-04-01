import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  SAVE_LAYOUT_FULFILLED,
  SAVE_LAYOUT_DISMISSED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
  PROMPT_WIDGET_DELETE,
  CANCEL_WIDGET_DELETE,
  DELETE_WIDGET_FULFILLED,
  RESET_STATE
} from "./../constants";

const initialState = {
  layout: [],
  widgets: [],
  fetching: false,
  fetched: false,
  layoutChanged: 0,
  layoutSaved: false,
  deleteWidgetDialogOpen: false,
  widgetToDelete: null,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case FETCH_LAYOUT: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_LAYOUT_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        layout: action.payload,
        layoutSaved: false
      }
    }

    case FETCH_LAYOUT_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case UPDATE_LAYOUT: {
      return {
        ...state,
        layout: action.payload,
        layoutChanged: state.layoutChanged + 1
      }
    }

    case SAVE_LAYOUT_FULFILLED: {
      return {
        ...state,
        layoutChanged: 1,
        layoutSaved: true
      }
    }

    case SAVE_LAYOUT_DISMISSED: {
      return {
        ...state,
        layoutChanged: 1,
      }
    }

    case FETCH_WIDGETS: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_WIDGETS_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        widgets: action.payload,
      }
    }

    case FETCH_WIDGETS_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case PROMPT_WIDGET_DELETE: {
      return {
        ...state,
        deleteWidgetDialogOpen: true,
        widgetToDelete: action.widgetToDelete,
      }
    }

    case CANCEL_WIDGET_DELETE: {
      return {
        ...state,
        deleteWidgetDialogOpen: false,
        widgetToDelete: null,
      }
    }

    case DELETE_WIDGET_FULFILLED: {
      return {
        ...state,
        fetching: false,
        deleteWidgetDialogOpen: false,
      }
    }

    case RESET_STATE: {
      return initialState
    }

  }

  return state;
}
