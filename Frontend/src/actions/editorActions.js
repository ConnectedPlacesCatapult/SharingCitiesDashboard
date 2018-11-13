import {
  PURGE_EDITOR,
  SET_CURRENT_WIDGET,
} from "./types";

export function purgeEditor() {
  return {
    type: PURGE_EDITOR,
  }
}
