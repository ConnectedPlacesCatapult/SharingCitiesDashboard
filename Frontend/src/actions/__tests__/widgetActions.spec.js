import configureStore from 'redux-mock-store';
import * as editorActions from './../widgetActions';
import {
  PURGE_EDITOR,
  SET_MAP_DATA,
  SET_MAP_PROPERTY,
  SET_PLOT_DATA,
  SET_PLOT_ENCODING,
  SET_PLOT_PROPERTY,
  SET_WIDGET_PROPERTY,
  TOGGLE_MAP_TOOLTIP_FIELD,
} from "./../../constants";

const mockStore = configureStore();
const store = mockStore();

describe('editorActions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  describe('purgeEditor', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: PURGE_EDITOR,
        }
      ];

      store.dispatch(editorActions.purgeEditor());

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapData', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_DATA,
          payload: [{a: 1}],
        }
      ];

      store.dispatch(editorActions.setMapData([{a: 1}]));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setMapProperty', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_MAP_PROPERTY,
          payload: {
            property: 'markerAttribute',
            value: 'Value',
          },
        }
      ];

      store.dispatch(editorActions.setMapProperty('markerAttribute', 'Value'));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setPlotData', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_DATA,
          payload: [{a: 1}],
        },
      ];

      store.dispatch(editorActions.setPlotData([{ a: 1 }]));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setPlotEncoding', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_ENCODING,
          payload: {
            x: {
              field: "Timestamp",
              type: "temporal",
            },
            y: {
              field: "Value",
              type: "quantitative",
            },
          },
        },
      ];

      store.dispatch(editorActions.setPlotEncoding({
        x: {
          field: "Timestamp",
          type: "temporal",
        },
        y: {
          field: "Value",
          type: "quantitative",
        },
      }));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setPlotProperty', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_PLOT_PROPERTY,
          payload: {
            property: "width",
            value: 450,
          },
        },
      ];

      store.dispatch(editorActions.setPlotProperty("width", 450));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('setWidgetProperty', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: SET_WIDGET_PROPERTY,
          payload: {
            property: 'name',
            value: 'test widget',
          },
        },
      ];

      store.dispatch(editorActions.setWidgetProperty('name', 'test widget'));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  describe('toggleMapTooltipField', () => {
    test('Dispatches the correct action and payload', () => {
      let expectedActions = [
        {
          type: TOGGLE_MAP_TOOLTIP_FIELD,
          payload: {
            field: 'Value',
            checked: true,
          },
        },
      ];

      store.dispatch(editorActions.toggleMapTooltipField('Value', true));

      expect(store.getActions()).toEqual(expectedActions)
    })
  });
});
