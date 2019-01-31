import axios from "axios";
import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
} from "./../constants";

export const fetchAttributeData = (grouped, perSensor) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;
    const themes = currentState.themes.themes;

    // gather all selected attributes
    let selectedAttributes = [];
    for (let theme of themes) {
      for (let subtheme of theme.subthemes) {
        for (let attribute of subtheme.attributes) {
          if (attribute.isSelected) {
            selectedAttributes = [...selectedAttributes, attribute.name]
          }
        }
      }
    }

    // catch no attributes selected
    if (!selectedAttributes.length) {
      dispatch({
        type: FETCH_ATTRIBUTE_DATA_FULFILLED,
        payload: [],
      });

      return
    }

    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axios({
      url: config.apiRoot,
      method: 'get',
      params: {
        attributedata: selectedAttributes.join(),
        grouped: grouped,
        per_sensor: perSensor,
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: response.data,
        })
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_REJECTED,
          payload: err,
        })
      })
  }
};
