import {
  EDITOR_CLOSE,
  EDITOR_OPEN,
  EDITOR_SET_WIDGET_PROPERTY,
  EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  EDITOR_SET_WIDGET_QUERY_PROPERTY,
  WIDGET_TYPE_ALERT,
  WIDGET_TYPE_FORECAST,
  WIDGET_TYPE_MAP,
  WIDGET_TYPE_PLOT,
} from './../constants';

const FCC_CONFIG = require('./../../fcc.config');

const initialState = {
  open: false,
  mode: null,
  widget: null,
};

const getWidgetDefaultProperties = (currentProperties) => {
  const { type } = currentProperties;

  const defaultProperties = {
    ...currentProperties,
    name: FCC_CONFIG.widgetEditorDefaults.widgetName,
    description: FCC_CONFIG.widgetEditorDefaults.widgetDescription,
    width: FCC_CONFIG.widgetEditorDefaults.widgetWidth,
    height: FCC_CONFIG.widgetEditorDefaults.widgetHeight,
    isStatic: FCC_CONFIG.widgetEditorDefaults.widgetIsStatic,
    config: {},
    queryParams: {},
  };

  switch (type) {

    case WIDGET_TYPE_ALERT: {
      return {
        ...defaultProperties,
        config: {
          ...defaultProperties.config,
          something: "dlkfjslkjsdn",
        }
      }
    }

    case WIDGET_TYPE_FORECAST: {
      return {
        ...defaultProperties,
      }
    }

    case WIDGET_TYPE_MAP: {
      return {
        ...defaultProperties,
        config: {
          ...defaultProperties.config,
          center: FCC_CONFIG.widgetEditorDefaults.mapCenter,
          bounds: null,
          markerAttribute: FCC_CONFIG.widgetEditorDefaults.mapMarkerAttribute,
          markerColor: FCC_CONFIG.widgetEditorDefaults.mapMarkerColor,
          markerRadius: FCC_CONFIG.widgetEditorDefaults.mapMarkerRadius,
          showHeatmap: FCC_CONFIG.widgetEditorDefaults.mapShowHeatmap,
          tileLayer: FCC_CONFIG.widgetEditorDefaults.mapTileLayer,
          tooltipFields: FCC_CONFIG.widgetEditorDefaults.mapTooltipFields,
          zoom: FCC_CONFIG.widgetEditorDefaults.mapZoom,
        },
        queryParams: {
          ...defaultProperties.queryParams,
          grouped: true,
          harmonising_method: "long",
          limit: 100,
          per_sensor: true,
        }
      }
    }

    case WIDGET_TYPE_PLOT: {
      return {
        ...defaultProperties,
        config: {
          ...defaultProperties.config,
          ...FCC_CONFIG.editorDefaultConfig.plot,
        },
        queryParams: {
          ...defaultProperties.queryParams,
          grouped: true,
          harmonising_method: "long",
          limit: 100,
          per_sensor: true,
        }
      }
    }
  }
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case EDITOR_CLOSE: {
      return {
        ...state,
        open: false,
      }
    }

    case EDITOR_OPEN: {
      // ToDo :: catch "add" mode here and populate widget properties with defaults depending on the type
      const { mode, widgetProperties } = action.payload;

      if (mode === "edit") {
        return {
          ...state,
          open: true,
          mode,
          widget: widgetProperties,
        }
      } else {
        return {
          ...state,
          open: true,
          mode,
          widget: getWidgetDefaultProperties(widgetProperties)
        }
      }
    }

    case EDITOR_SET_WIDGET_PROPERTY: {
      return {
        ...state,
        widget: {
          ...state.widget,
          [action.payload.property]: action.payload.value,
        },
      }
    }

    case EDITOR_SET_WIDGET_CONFIG_PROPERTY: {
      return {
        ...state,
        widget: {
          ...state.widget,
          config: {
            ...state.widget.config,
            [action.payload.property]: action.payload.value,
          },
        },
      }
    }

    case EDITOR_SET_WIDGET_QUERY_PROPERTY: {
      return {
        ...state,
        widget: {
          ...state.widget,
          queryParams: {
            ...state.widget.queryParams,
            [action.payload.property]: action.payload.value,
          }
        }
      }
    }

  }

  return initialState
}
