import { axiosInstance } from './../api/axios';
import { getUserID } from './../api/session';
import {
  EDITOR_CLOSE,
  EDITOR_GET_THEME_TREE,
  EDITOR_GET_THEME_TREE_FULFILLED,
  EDITOR_GET_THEME_TREE_REJECTED,
  EDITOR_MODE_ADD,
  EDITOR_MODE_EDIT,
  EDITOR_OPEN,
  EDITOR_SAVE_WIDGET,
  EDITOR_SAVE_WIDGET_FULFILLED,
  EDITOR_SAVE_WIDGET_REJECTED,
  EDITOR_SET_WIDGET_PROPERTY,
  EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  EDITOR_SET_WIDGET_QUERY_PROPERTY,
  HIDE_NOTIFICATION,
  WIDGET_TYPE_ALERT,
  WIDGET_TYPE_FORECAST,
  WIDGET_TYPE_MAP,
  WIDGET_TYPE_PLOT,
} from './../constants';
import { fetchLayout, fetchWidgets } from './dashboardActions';

export const closeEditor = () => ({
  type: EDITOR_CLOSE,
});

export const getThemeTree = () =>  {
  return (dispatch) => {
    dispatch({
      type: EDITOR_GET_THEME_TREE,
    });

    const requestData = {
      user_id: getUserID(),
    };

    axiosInstance
      .get('/admin/themes/get_tree', requestData)
      .then((response) => {

        dispatch({
          type: EDITOR_GET_THEME_TREE_FULFILLED,
          payload: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: EDITOR_GET_THEME_TREE_REJECTED,
          payload: error,
        })
      })
  }
};

export const openEditor = (mode, widgetProperties=null) => ({
  type: EDITOR_OPEN,
  payload: {
    mode,
    widgetProperties,
  },
});

export const saveWidget = (mode, widget) => {
  return (dispatch, getState) => {
    dispatch({
      type: EDITOR_SAVE_WIDGET,
    });

    // remove data if it's a forecast or a plot
    if (widget.type === WIDGET_TYPE_FORECAST || widget.type === WIDGET_TYPE_PLOT) {
      widget.config.data = { values: [] };
    }

    const currentState = getState();

    const requestData = {
      userID: currentState.user.user.id,
      data: widget,
    };

    // include a widgetId if we are updating a widget
    if (mode === EDITOR_MODE_EDIT) {
      requestData.widget_id = widget.i;
    }

    axiosInstance.post("widgets/create_widget", requestData).then((response) => {

      console.log('requestData', requestData)

      // hold off on updating dashboard if this is an alert widget - there's more to be done
      if (widget.type !== WIDGET_TYPE_ALERT) {
        dispatch(fetchWidgets());
        dispatch(fetchLayout());
      }

      dispatch({
        type: EDITOR_SAVE_WIDGET_FULFILLED,
        payload: response.data,
      });

      // handle adding or updating alerts for alert widgets
      if (widget.type === WIDGET_TYPE_ALERT) {
        const alertPayload = {
          activated: widget.config.activated,
          attribute_id: widget.config.attributeId,
          max_threshold: widget.config.maxThreshold,
          min_threshold: widget.config.minThreshold,
        };

        let alertEndpoint = "/alert";

        if (mode === EDITOR_MODE_ADD) {

          alertPayload.user_id = currentState.user.user.id;
          alertPayload.widget_id = response.data.widget.id;

          alertEndpoint += "/create_alert";

        } else {
          alertPayload.alert_id = widget.config.alertId;
          alertPayload.widget_id = widget.i;

          alertEndpoint += "/update_alert";
        }

        axiosInstance
          .post(alertEndpoint, alertPayload)
          .then((response) => {

            // if the alert widget was newly created it needs to be updated with the new alertId
            if (mode === EDITOR_MODE_ADD) {
              axiosInstance
                .post("widgets/create_widget", {
                  userID: currentState.user.user.id,
                  data: {
                    ...widget,
                    config: {
                      ...widget.config,
                      alertId: response.data.id,
                    }
                  },
                  widget_id: alertPayload.widget_id,
                })
                .then((response) => {
                  // both widget and it's alert are now up to date
                  dispatch(fetchWidgets());
                  dispatch(fetchLayout());
                })
                .catch((error) => {
                  dispatch({
                    type: EDITOR_SAVE_WIDGET_REJECTED,
                    payload: error,
                  });
                })
              ;
            } else {
              dispatch(fetchWidgets());
              dispatch(fetchLayout());
            }
          })
          .catch((error) => {
            dispatch({
              type: EDITOR_SAVE_WIDGET_REJECTED,
              payload: error,
            });
          })
        ;
      }

      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
    })
      .catch((error) => {
        dispatch({
          type: EDITOR_SAVE_WIDGET_REJECTED,
          payload: error,
        });

        setTimeout(() => {
          dispatch({
            type: HIDE_NOTIFICATION,
          })
        }, 5000)
      });
  };
};

export const setWidgetProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetConfigProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetQueryProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_QUERY_PROPERTY,
  payload: {
    property,
    value,
  },
});
