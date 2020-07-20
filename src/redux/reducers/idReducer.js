import { ID_INCREASE } from '../actions/actions';

function idReducer(id = 1, action) {
  switch(action.type) {
    case ID_INCREASE:
      return id+1;
    default:
      return id;
  }
}

export default idReducer;