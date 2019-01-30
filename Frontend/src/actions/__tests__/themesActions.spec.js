import MockStore from 'redux-mock-store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { fetchThemes, toggleThemeSelected } from "./../themesActions";
import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  TOGGLE_THEME_SELECTED,
} from './../../constants';

describe('fetchThemes action', () => {
  let store;
  let httpMock;

  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    httpMock = new MockAdapter(axios);

    const mockStore = MockStore();
    store = mockStore({});
  });

  it('fetches an array of themes', async () => {
    // given
    httpMock.onGet('./../data/tempThemes').reply(200, {
      status: 'success',
      message: '',
    });

    // when
    fetchThemes()(store.dispatch);
    await flushAllPromises();

    // then
    expect(store.getActions()).toEqual([
      { type: FETCH_THEMES },
      { payload: ["Environment", "Transportation"], type: FETCH_THEMES_FULFILLED }
    ]);
  })
});
