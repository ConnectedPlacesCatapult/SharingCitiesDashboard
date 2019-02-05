import axios from "axios";
import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
} from "./../constants";

export const fetchAttributeData = (themeId, subthemeId, queryParams = {}) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;
    const themes = currentState.themes.themes;

    // gather all selected attributes
    const selectedAttributes = themes.find((theme) => theme.id === themeId)
      .subthemes.find((subtheme) => subtheme.id === subthemeId)
      .attributes.filter((attr) => attr.isSelected)
      .map((attr) => attr.name)
    ;

    // catch no attributes selected
    if (!selectedAttributes.length) {
      dispatch({
        type: FETCH_ATTRIBUTE_DATA_FULFILLED,
        payload: {
          themeId,
          subthemeId,
          queryParams: {
            ...queryParams,
            attributedata: selectedAttributes.join(),
          },
          data: [],
        },
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
        ...queryParams,
        attributedata: selectedAttributes.join(),
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: {
            themeId,
            subthemeId,
            queryParams: {
              ...queryParams,
              attributedata: selectedAttributes.join(),
            },
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
