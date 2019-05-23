// admin
export const FETCH_USERS = "FETCH_USERS";
export const FETCH_USERS_FULFILLED = "FETCH_USERS_FULFILLED";
export const FETCH_USERS_REJECTED = "FETCH_USERS_REJECTED";
export const CREATE_NEW_USER_FULFILLED = "CREATE_NEW_USER_FULFILLED";
export const CREATE_NEW_USER_REJECTED = "CREATE_NEW_USER_REJECTED";
export const PROMPT_USER_DELETE = "PROMPT_USER_DELETE";
export const CANCEL_USER_DELETE = "CANCEL_USER_DELETE";
export const DELETE_USER_FULFILLED = "DELETE_USER_FULFILLED";
export const DELETE_USER_REJECTED = "DELETE_USER_REJECTED";
export const FETCH_IMPORTER_STATUSES = "FETCH_IMPORTER_STATUSES;";
export const FETCH_IMPORTER_STATUSES_FULFILLED = "FETCH_IMPORTER_STATUSES_FULFILLED";
export const FETCH_IMPORTER_STATUSES_REJECTED = "FETCH_IMPORTER_STATUSES_REJECTED";
export const RERUN_IMPORTER = "RERUN_IMPORTER";
export const RERUN_IMPORTER_FULFILLED = "RERUN_IMPORTER_FULFILLED";
export const RERUN_IMPORTER_REJECTED = "RERUN_IMPORTER_REJECTED";

// api
export const SAVE_WIDGET_FULFILLED = "SAVE_WIDGET_FULFILLED";
export const SAVE_WIDGET_REJECTED = "SAVE_WIDGET_REJECTED";

// dataTable
export const FETCH_ATTRIBUTE_DATA = "FETCH_ATTRIBUTE_DATA";
export const FETCH_ATTRIBUTE_DATA_FULFILLED = "FETCH_ATTRIBUTE_DATA_FULFILLED";
export const FETCH_ATTRIBUTE_DATA_REJECTED = "FETCH_ATTRIBUTE_DATA_REJECTED";
export const FETCH_ATTRIBUTES = "FETCH_ATTRIBUTES";
export const FETCH_ATTRIBUTES_FULFILLED = "FETCH_ATTRIBUTES_FULFILLED";
export const FETCH_ATTRIBUTES_REJECTED = "FETCH_ATTRIBUTES_REJECTED";
export const FETCH_SUBTHEMES = "FETCH_SUBTHEMES";
export const FETCH_SUBTHEMES_FULFILLED = "FETCH_SUBTHEMES_FULFILLED";
export const FETCH_SUBTHEMES_REJECTED = "FETCH_SUBTHEMES_REJECTED";
export const FETCH_THEMES = "FETCH_THEMES";
export const FETCH_THEMES_FULFILLED = "FETCH_THEMES_FULFILLED";
export const FETCH_THEMES_REJECTED = "FETCH_THEMES_REJECTED";
export const REMOVE_ATTRIBUTE_DATA = "REMOVE_ATTRIBUTE_DATA";
export const SET_ACTIVE_TAB_ATTRIBUTE = "SET_ACTIVE_TAB_ATTRIBUTE";
export const TOGGLE_ATTRIBUTE_SELECTED = "TOGGLE_ATTRIBUTE_SELECTED";
export const TOGGLE_SUBTHEME_SELECTED = "TOGGLE_SUBTHEME_SELECTED";
export const TOGGLE_THEME_SELECTED = "TOGGLE_THEME_SELECTED";

// exports
export const EXPORT_DATA = "EXPORT_DATA";
export const EXPORT_DATA_FULFILLED = "EXPORT_DATA_FULFILLED";
export const EXPORT_DATA_REJECTED = "EXPORT_DATA_REJECTED";

// editor
export const EDITOR_CLOSE = "EDITOR_CLOSE";
export const EDITOR_GET_THEME_TREE = "EDITOR_GET_THEME_TREE";
export const EDITOR_GET_THEME_TREE_FULFILLED = "EDITOR_GET_THEME_TREE_FULFILLED";
export const EDITOR_GET_THEME_TREE_REJECTED = "EDITOR_GET_THEME_TREE_REJECTED";
export const EDITOR_MODE_ADD = "add";
export const EDITOR_MODE_EDIT = "edit";
export const EDITOR_OPEN = "EDITOR_OPEN";
export const EDITOR_SAVE_WIDGET = "EDITOR_SAVE_WIDGET";
export const EDITOR_SAVE_WIDGET_FULFILLED = "EDITOR_SAVE_WIDGET_FULFILLED";
export const EDITOR_SAVE_WIDGET_REJECTED = "EDITOR_SAVE_WIDGET_REJECTED";
export const EDITOR_SET_WIDGET_PROPERTY = "EDITOR_SET_WIDGET_PROPERTY";
export const EDITOR_SET_WIDGET_CONFIG_PROPERTY = "EDITOR_SET_WIDGET_CONFIG_PROPERTY";
export const EDITOR_SET_WIDGET_QUERY_PROPERTY = "EDITOR_SET_WIDGET_QUERY_PROPERTY";
export const WIDGET_TYPE_ALERT = "alert";
export const WIDGET_TYPE_FORECAST = "forecast";
export const WIDGET_TYPE_MAP = "map";
export const WIDGET_TYPE_PLOT = "plot";

// dashboard
export const DELETE_WIDGET = "DELETE_WIDGET";
export const DELETE_WIDGET_FULFILLED = "DELETE_WIDGET_FULFILLED";
export const DELETE_WIDGET_REJECTED = "DELETE_WIDGET_REJECTED";
export const FETCH_LAYOUT = "FETCH_LAYOUT";
export const FETCH_LAYOUT_FULFILLED = "FETCH_LAYOUT_FULFILLED";
export const FETCH_LAYOUT_REJECTED = "FETCH_LAYOUT_REJECTED";
export const UPDATE_LAYOUT = "UPDATE_LAYOUT";
export const FETCH_WIDGETS = "FETCH_WIDGETS";
export const FETCH_WIDGETS_FULFILLED = "FETCH_WIDGETS_FULFILLED";
export const FETCH_WIDGETS_REJECTED = "FETCH_WIDGETS_REJECTED";
export const SAVE_LAYOUT = "SAVE_LAYOUT";
export const SAVE_LAYOUT_FULFILLED = "SAVE_LAYOUT_FULFILLED";
export const SAVE_LAYOUT_REJECTED = "SAVE_LAYOUT_REJECTED";
export const SAVE_LAYOUT_DISMISSED = "SAVE_LAYOUT_DISMISSED";

// notifications
export const HIDE_NOTIFICATION = "HIDE_NOTIFICATION";

// shared
export const RESET_STATE = "RESET_STATE";
export const NOT_AUTHORISED_TO_VIEW_IMPORTERS = "NOT_AUTHORISED_TO_VIEW_IMPORTERS";
export const NOT_AUTHORISED_TO_VIEW_USERS = "NOT_AUTHORISED_TO_VIEW_USERS";

// user
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const SET_CURRENT_USER_REJECTED = "SET_CURRENT_USER_REJECTED";
export const REQUEST_PASSWORD_FULFILLED = "REQUEST_PASSWORD_FULFILLED";
export const REQUEST_PASSWORD_REJECTED = "REQUEST_PASSWORD_REJECTED";
export const LOGIN_FULFILLED = "LOGIN_FULFILLED";
export const LOGIN_REJECTED = "LOGIN_REJECTED";
export const CLEAR_LOGIN_ERRORS = "CLEAR_LOGIN_ERRORS";
export const REGISTER_FULFILLED = "REGISTER_FULFILLED";
export const REGISTER_REJECTED = "REGISTER_REJECTED";
export const SHOW_CHANGE_PASSWORD = "SHOW_CHANGE_PASSWORD";
export const HIDE_CHANGE_PASSWORD = "HIDE_CHANGE_PASSWORD";
export const PASSWORD_CHANGE_FULFILLED = "PASSWORD_CHANGE_FULFILLED";
export const PASSWORD_CHANGE_REJECTED = "PASSWORD_CHANGE_REJECTED";

// forecasts
export const MAPE_RATING_BAD = "extremely unreliable";
export const MAPE_RATING_FAIR = "fairly reliable";
export const MAPE_RATING_GOOD = "quite reliable";

// query params
export const QUERY_PARAMS = {
  ATTRIBUTE: "attribute",
  ATTRIBUTE_DATA: "attributedata",
  DATE_FROM: "fromdate",
  DATE_TO: "todate",
  FREQUENCY: "freq",
  GROUPED: "grouped",
  HARMONISING_METHOD: "harmonising_method",
  HARMONISING_METHOD_LONG: "long",
  HARMONISING_METHOD_WIDE: "wide",
  LIMIT: "limit",
  OFFSET: "offset",
  PER_SENSOR: "per_sensor",
  PREDICTIONS: "predictions",
  PREDICTIONS_N: "n_predictions",
  SENSOR: "sensor",
  SENSOR_ATTRIBUTE: "sensorattribute",
  SENSOR_ID: "sensorid",
  SENSOR_NAME: "sensorname",
  SUBTHEME_ID: "subtheme",
  THEME_ID: "theme",
};

// vegaLite
export const VEGA_LITE_MARKS = [
  "bar",
  "circle",
  "square",
  "tick",
  "line",
  "area",
  "point",
  "rule",
  "geoshape",
  "text",
];
export const VEGA_LITE_ENCODING_CHANNELS = [
  "x",
  "y",
  "color",
  "tooltip",
  //"x2",
  //"y2",
  "longitude",
  "latitude",
  "longitude2",
  "latitude2",
  //"color",
  //"opacity",
  "fillOpacity",
  "strokeOpacity",
  "strokeWidth",
  "size",
  "shape",
  "text",
  "tooltip",
  "href",
  "key",
  "order",
  "detail",
  "row",
  "column",
];
export const VEGA_LITE_DATA_TYPES = [
  "quantitative",
  "temporal",
  "ordinal",
  "nominal",
  "geojson",
];
export const VEGA_LITE_TIME_UNITS = [
  "year",
  "yearquarter",
  "yearquartermonth",
  "yearmonth",
  "yearmonthdate",
  "yearmonthdatehours",
  "yearmonthdatehoursminutes",
  "yearmonthdatehoursminutesseconds",
  "quarter",
  "quartermonth",
  "month",
  "monthdate",
  "date",
  "day",
  "hours",
  "hoursminutes",
  "hoursminutesseconds",
  "minutes",
  "minutesseconds",
  "seconds",
  "secondsmilliseconds",
  "milliseconds",
];
export const VEGA_LITE_AGGREGATE_OPERATIONS = [
  "count",
  "valid",
  "missing",
  "distinct",
  "sum",
  "mean",
  "average",
  "variance",
  "variancep",
  "stdev",
  "stdevp",
  "stderr",
  "median",
  "q1",
  "q3",
  "ci0",
  "ci1",
  "min",
  "max",
  "argmin",
  "argmax",
];
export const VEGA_LITE_FIELDS = (() => {
  return [
    {
      name: "field",
      type: "DataFieldName",
      required: true,
      default: "Timestamp",
    },
    {
      name: "type",
      type: VEGA_LITE_DATA_TYPES,
      required: true,
      default: VEGA_LITE_DATA_TYPES[0],
    },
    {
      name: "bin",
      type: Boolean,
      required: false,
      default: false,
    },
    {
      name: "timeUnit",
      type: VEGA_LITE_TIME_UNITS,
      required: false,
      default: VEGA_LITE_TIME_UNITS[0],
    },
    {
      name: "aggregate",
      type: VEGA_LITE_AGGREGATE_OPERATIONS,
      required: false,
      default: VEGA_LITE_AGGREGATE_OPERATIONS[5],
    },
    {
      name: "title",
      type: String,
      required: false,
      default: "",
    },
    //"scale",
    //"axis",
    //"legend",
    //"format",
    //"stack",
    //"sort",
    //"condition",
  ]
})();
