import {
  FETCH_USERS,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED,
  PROMPT_USER_DELETE,
  CANCEL_USER_DELETE,
  DELETE_USER_FULFILLED
} from "./../constants";

const initialState = {
  users: [],
  fetching: false,
  fetched: false,
  deleteUserDialogOpen: false,
  error: null,
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

  }

  return state;
}