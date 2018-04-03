import { getCitys } from '../services/api'

export default {
  namespace: 'citys',

  state: {
    data: [],
    citysList:[],
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(getCitys, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if(callback) callback(response);
    },
    *fetchCity({ payload,callback }, { call, put }) {
      payload.type = 'city';
      const response = yield call(getCitys, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if(callback) callback(response);
    },
    *fetchInit({callback }, { call, put }) {
      const response = yield call(getCitys, {parentCode:1});
      yield put({
        type: 'citysList',
        payload: response,
      });
      if(callback) callback(response);
    },

  },

  reducers: {
    set(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    citysList(state, action) {
      return {
        ...state,
        citysList: action.payload,
      };
    },
    clear() {
      return {
        data: [],
        citysList:[],
      };
    },
  },
};
