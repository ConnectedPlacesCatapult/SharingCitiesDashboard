import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  TOGGLE_THEME_SELECTED,
  FETCH_SUBTHEMES,
  FETCH_SUBTHEMES_FULFILLED,
  FETCH_SUBTHEMES_REJECTED,
  TOGGLE_SUBTHEME_SELECTED,
  FETCH_ATTRIBUTES,
  FETCH_ATTRIBUTES_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
  TOGGLE_ATTRIBUTE_SELECTED,
} from "./../constants";

const initialState = {
  themes: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_THEMES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_THEMES_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        themes: action.payload.map(theme => {
          return {
            id: theme.id,
            name: theme.Name,
            subthemes: [],
            isSelected: false,
          }
        }),
      }
    }

    case FETCH_THEMES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case TOGGLE_THEME_SELECTED: {
      const newThemes = [...state.themes];

      const themeToToggle = newThemes.find(theme => theme.id === action.payload);
      themeToToggle.isSelected = !themeToToggle.isSelected;

      return {
        ...state,
        themes: newThemes,
      }
    }

    case FETCH_SUBTHEMES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_SUBTHEMES_FULFILLED: {
      const newThemes = [...state.themes];

      newThemes.find(theme => theme.id === action.payload.themeId).subthemes = action.payload.subthemes.map(subtheme => {
        return {
          id: subtheme.id,
          name: subtheme.Name,
          attributes: [],
          isSelected: false,
        }
      });

      return {
        ...state,
        fetching: false,
        fetched: true,
        themes: newThemes,
      }
    }

    case FETCH_SUBTHEMES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case TOGGLE_SUBTHEME_SELECTED: {
      const newThemes = [...state.themes];
      const parentTheme = newThemes.find(theme => theme.id === action.payload.themeId);
      const subthemeToToggle = parentTheme.subthemes.find(subtheme => subtheme.id === action.payload.subthemeId);

      subthemeToToggle.isSelected = !subthemeToToggle.isSelected;

      return {
        ...state,
        themes: newThemes,
      }
    }

    case FETCH_ATTRIBUTES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_ATTRIBUTES_FULFILLED: {
      const newThemes = [...state.themes];
      const parentTheme = newThemes.find(theme => theme.id === action.payload.themeId);
      const parentSubtheme = parentTheme.subthemes.find(subtheme => subtheme.id === action.payload.subthemeId);

      parentSubtheme.attributes = action.payload.attributes.map(attribute => {
        return {
          id: attribute.id,
          name: attribute.name,
          tableName: attribute['table_name'],
          subthemeId: attribute['Sub Theme id'],
          unit: attribute['Unit'],
          unitValue: attribute['Unit Value'],
          description: attribute['Description'],
          isSelected: false,
        }
      });

      return {
        ...state,
        fetching: false,
        fetched: true,
        themes: newThemes,
      }
    }

    case FETCH_ATTRIBUTES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case TOGGLE_ATTRIBUTE_SELECTED: {
      const newThemes = [...state.themes];
      const parentTheme = newThemes.find(theme => theme.id === action.payload.themeId);
      const parentSubtheme = parentTheme.subthemes.find(subtheme => subtheme.id === action.payload.subthemeId);
      const attributeToToggle = parentSubtheme.attributes.find(attr => attr.id === action.payload.attributeId);

      attributeToToggle.isSelected = !attributeToToggle.isSelected;

      return {
        ...state,
        themes: newThemes,
      }
    }
  }

  return state
}
