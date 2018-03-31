import * as actionTypes from './rank';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  cheat: false
};

const rankReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_GET_DATA:
      return { ...state, isLoading: true, data: null, error: null };
    case actionTypes.SUCCESS_GET_DATA:
      return { ...state, isLoading: false, data: action.data, cheat: action.cheat };
    case actionTypes.FAIL_GET_DATA:
      return { ...state, isLoading: false, error: action.error };
    default:
      return { ...state }
  }
};

export default rankReducer;
