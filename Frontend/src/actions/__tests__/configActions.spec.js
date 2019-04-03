import MockStore from 'redux-mock-store';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { fetchConfig } from './../configActions';
import {
  FETCH_CONFIG,
  FETCH_CONFIG_FULFILLED,
  FETCH_CONFIG_REJECTED,
} from "./../../constants";

describe('fetchConfig action', () => {
  let store;
  let httpMock;

  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    httpMock = new MockAdapter(axios);

    const mockStore = MockStore();
    store = mockStore({});
  });

  it('fetches an object of options from a file', async () => {
    // given
    httpMock.onGet('./../../../fcc.config').reply(200, {
      status: 'success',
      message: '',
    });

    // when
    fetchConfig()(store.dispatch);
    await flushAllPromises();

    // then
    expect(store.getActions()).toEqual([
      { type: FETCH_CONFIG },
      { payload: { siteName: "Test Website" }, type: FETCH_CONFIG_FULFILLED }
    ]);
  })
});
