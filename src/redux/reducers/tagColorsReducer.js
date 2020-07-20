import { REMOVE_COLOR, ADD_COLOR } from '../actions/actions';

const initialState = ["none", "magenta", "red", "volcano", "gold", "lime", "green", "cyan", "blue", "purple"];

function tagColorsReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_COLOR:
      if(action.color !== "none") {
        return [
          ...state,
          action.color
        ];
      } else {
        return state;
      }
    case REMOVE_COLOR:
      if(action.color !== "none") {
        return state.filter(color => color !== action.color);
      } else {
        return state;
      }
    default:
      return state;
  }
}

export default tagColorsReducer;