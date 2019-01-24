import axios from "axios";
import {
  DISCARD_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
  PURGE_DATA,
} from "./../constants";

/*export const discardAttributeData = (themeId, subthemeId, attributeId, attributeName) => ({
  type: DISCARD_ATTRIBUTE_DATA,
  payload: { themeId, subthemeId, attributeId, attributeName },
});*/

const getSelectedAttributes = () => {



};

export const fetchAttributeData = (grouped, perSensor) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;
    const themes = currentState.themes.themes;
    //const selectedAttributes = getSelectedAttributes();

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

    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axios({
      url: config.apiRoot,
      method: 'get',
      params: {
        attributedata: selectedAttributes.join(),
        //grouped: grouped,
        //per_sensor: perSensor,
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

export const fetchAttributeDataOld = (themeId, subthemeId, attributeId, attributeName) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    // get currently selected attributes for this theme & subtheme

    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axios({
      url: config.apiRoot,
      method: 'get',
      params: {
        attributedata: attributeName,
        grouped: true,
        per_sensor: true,
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: {
            themeId,
            subthemeId,
            attributes: {

            },
            attributeId,
            attributeName,
            data: response.data,
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

/*export const purgeData = () => ({
  type: PURGE_DATA,
});*/
