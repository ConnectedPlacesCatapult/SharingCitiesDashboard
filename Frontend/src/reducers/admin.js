import {
  FETCH_USERS,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED,
  PROMPT_USER_DELETE,
  CANCEL_USER_DELETE,
  DELETE_USER_FULFILLED,
  FETCH_IMPORTER_STATUSES,
  FETCH_IMPORTER_STATUSES_FULFILLED,
  FETCH_IMPORTER_STATUSES_REJECTED,
  NOT_AUTHORISED_TO_VIEW_USERS,
  NOT_AUTHORISED_TO_VIEW_IMPORTERS,
  RESET_STATE
} from "./../constants";

const initialState = {
  users: [],
  importers: [],
  fetching: false,
  fetched: false,
  deleteUserDialogOpen: false,
  error: null,
  hideUsers: false,
  hideImporters: false
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case FETCH_USERS: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_USERS_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        users: action.payload.users,
      }
    }

    case FETCH_USERS_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case FETCH_IMPORTER_STATUSES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_IMPORTER_STATUSES_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        importers: action.payload,
      }
    }

    case FETCH_IMPORTER_STATUSES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case PROMPT_USER_DELETE: {
      return {
        ...state,
        deleteUserDialogOpen: true,
        userToDelete: action.userToDelete,
      }
    }

    case CANCEL_USER_DELETE: {
      return {
        ...state,
        deleteUserDialogOpen: false,
        widgetToDelete: null,
      }
    }

    case DELETE_USER_FULFILLED: {
      return {
        ...state,
        deleteUserDialogOpen: false,
      }
    }

    case NOT_AUTHORISED_TO_VIEW_USERS: {
      return {
        ...state,
        hideUsers: true,
      }
    }

    case NOT_AUTHORISED_TO_VIEW_IMPORTERS: {
      return {
        ...state,
        hideImporters: true,
      }
    }

    case RESET_STATE: {
      return initialState
    }

  }

  return state;
}
