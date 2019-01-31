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
  active: {
    themeId: null,
    subthemeId: null,
    attributeIds: [],
  },
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

      // multiple themes can be "selected" concurrently
      // only one theme can be "active" concurrently
      // "active" state stores the id of the last theme to be "selected"

      const newThemes = [...state.themes];
      const newActive = {...state.active};

      const themeToToggle = newThemes.find(theme => theme.id === action.payload);


      if (state.active.themeId === action.payload) {
        // theme was already active - deactivate it
        newActive.themeId = null;
      } else {
        // replace current active theme with this one
        newActive.themeId = action.payload;
      }

      let newActiveThemeId;
      let newActiveSubthemeId;
      let newActiveAttributeIds;


      // if clicked theme is already the active one deactivate it

      // if this was already the active themeId keep it the same
      if (state.active.themeId === action.payload) {

        newActiveThemeId = state.active.themeId;
        newActiveSubthemeId = state.active.subthemeId;
        newActiveAttributeIds = state.active.attributeIds;

      } else {

        // new theme clicked

        // if this theme was already selected we're just deselecting it
        if (themeToToggle.isSelected) {

          // we're just deselecting the theme, not making it active
          newActiveThemeId = state.active.themeId;
          newActiveSubthemeId = state.active.subthemeId;
          newActiveAttributeIds = state.active.attributeIds;

        } else {

          // otherwise we're good to mark this theme as the active one
          newActiveThemeId = action.payload;
          newActiveSubthemeId = null;
          newActiveAttributeIds = [];

        }
      }

      themeToToggle.isSelected = !themeToToggle.isSelected;

      return {
        ...state,
        themes: newThemes,
        active: {
          ...state.active,
          themeId: newActiveThemeId,
          subthemeId: newActiveSubthemeId,
          attributeIds: newActiveAttributeIds,
        },
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

      // only allow one subtheme to be selected at one time
      const newThemes = [...state.themes];

      // store this for working out active subtheme
      let subthemeWasSelected = false;

      // set selected status to false for all subthemes
      for (let theme of newThemes) {
        for (let subtheme of theme.subthemes) {
          if (theme.id === action.payload.themeId && subtheme.id === action.payload.subthemeId) {
            subthemeWasSelected = subtheme.isSelected;
            subtheme.isSelected = !subtheme.isSelected;
          } else {
            //subtheme.isSelected = false;
          }
        }
      }

      // old way allows subthemes of different themes to be selected

      /*const newThemes = [...state.themes];
      const parentTheme = newThemes.find(theme => theme.id === action.payload.themeId);
      const subthemeToToggle = parentTheme.subthemes.find(subtheme => subtheme.id === action.payload.subthemeId);*/

      let newActiveThemeId;
      let newActiveSubthemeId;
      let newActiveAttributeIds;

      // if this subtheme is within the active theme
      if (state.active.themeId === action.payload.themeId) {

        // retain the active themeId
        newActiveThemeId = state.active.themeId;

        // if this subtheme was already active
        if (state.active.subthemeId === action.payload.subthemeId) {

          // we're just deselecting the subtheme. keep it active
          newActiveSubthemeId = state.active.subthemeId;

        } else {

          // new subtheme clicked within the active theme

          // if clicked subtheme was already selected we're just deselecting it
          if (subthemeWasSelected) {

            // retain the active subthemeId
            newActiveSubthemeId = state.active.subthemeId;

          } else {

            // mark the clicked subtheme as active
            newActiveSubthemeId = action.payload.subthemeId;

          }
        }
      } else {

        // subtheme clicked from within a different theme

        // if the subtheme was already selected we're just deselecting it
        if (subthemeWasSelected) {

          newActiveThemeId = state.active.themeId;
          newActiveSubthemeId = state.active.subthemeId;

        } else {

          // new subtheme being selected in new theme
          newActiveThemeId = action.payload.themeId;
          newActiveSubthemeId = action.payload.subthemeId;

        }
      }

      //subthemeToToggle.isSelected = !subthemeToToggle.isSelected;

      return {
        ...state,
        themes: newThemes,
        active: {
          ...state.active,
          themeId: newActiveThemeId,
          subthemeId: newActiveSubthemeId,
          attributeIds: newActiveAttributeIds,
        },
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

      // ToDo :: work out active attributeIds
      let newActiveAttributeIds;

      // if attribute was already selected
      /*if (state.active.attributeIds.indexOf(action.payload.attributeId) !== -1) {
        // remove it
        newActiveAttributeIds = state.active.attributeIds.filter(id => id !== action.payload.attributeId);
      } else {
        // add it
        newActiveAttributeIds = [...state.active.attributeIds, action.payload.attributeId];
      }*/

      attributeToToggle.isSelected = !attributeToToggle.isSelected;

      //console.log(newActiveAttributeIds);

      return {
        ...state,
        themes: newThemes,
        active: {
          ...state.active,
          //attributeIds: newActiveAttributeIds,
        },
      }
    }
  }

  return state
}
