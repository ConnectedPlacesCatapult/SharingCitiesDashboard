import { ADD_WIDGET, EDIT_WIDGET, DELETE_WIDGET } from "./types";

let nextWidgetId = 0;

export function addWidget(stuff) {
  return {
    type: ADD_WIDGET,
    id: nextWidgetId++,
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
