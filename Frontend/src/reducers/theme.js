import { ADD_THEME, TOGGLE_THEME } from "../actions/types";

export default (state = [], action = {}) => {
  switch (action.type) {
    case ADD_THEME:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          expanded: false,
        }
      ];

    case TOGGLE_THEME:
      return state.map(theme =>
        (theme.id === action.id)
          ? {...theme, expanded: !theme.expanded}
          : theme
      );

    default:
      return state
  }
}
