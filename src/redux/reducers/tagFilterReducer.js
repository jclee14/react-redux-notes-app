import { CHANGE_TAG, TAG_ALL } from '../actions/actions';

function tagFilterReducer(tagFilter = TAG_ALL, action) {
    switch(action.type) {
      case CHANGE_TAG:
        return action.tag;
      default:
        return tagFilter;
    }
}

export default tagFilterReducer;