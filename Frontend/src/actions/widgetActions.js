import {ADD_WIDGET, EDIT_WIDGET, DELETE_WIDGET } from "./types";

export function addWidget(stuff) {
  return {
    type: ADD_WIDGET,
    id: nextThemeId++,
    text: theme,
  }
}

export function editWidget(stuff) {
  return {
    type: EDIT_WIDGET,
  }
}

export function deleteWidget(id) {
  return {
    type: DELETE_WIDGET,
  }
}
