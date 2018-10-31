import { ADD_THEME } from "./types";

let nextThemeId = 0;

export function addTheme(theme) {
  return {
    type: ADD_THEME,
    id: nextThemeId++,
    text: theme,
  }
}
