import axios from "axios";
import {
  DISCARD_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
  PURGE_DATA,
} from "./../constants";

export const discardAttributeData = (themeId, subthemeId, attributeId, attributeName) => ({
  type: DISCARD_ATTRIBUTE_DATA,
  payload: { themeId, subthemeId, attributeId, attributeName },
});

export const fetchAttributeData = (themeId, subthemeId, attributeId, attributeName) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axios({
      url: config.apiRoot,
      method: 'get',
      params: {
        attributedata: attributeName,
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: {
            themeId,
            subthemeId,
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

export const purgeData = () => ({
  type: PURGE_DATA,
});
