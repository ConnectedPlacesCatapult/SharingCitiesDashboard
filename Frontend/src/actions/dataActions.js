import axios from "axios";
import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
} from "./../constants";

export const fetchAttributeData = (themeId, subthemeId, grouped=true, perSensor=true, harmonisingMethod='long', limit=100) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;
    const themes = currentState.themes.themes;

    // gather all selected attributes
    // ToDo :: limit this to search only the current theme?
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

    // ToDo :: tidy this
    axios({
      url: config.apiRoot,
      method: 'get',
      params: {
        themeId,
        subthemeId,
        attributedata: selectedAttributes.join(),
        grouped,
        per_sensor: perSensor,
        harmonising_method: harmonisingMethod,
        limit,
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: {
            data: response.data,
            query: {
              themeId,
              subthemeId,
              attributedata: selectedAttributes.join(),
              grouped,
              per_sensor: perSensor,
              harmonising_method: harmonisingMethod,
              limit,
            },
          },
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
