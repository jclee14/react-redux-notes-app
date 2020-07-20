import { ADD_TAG, REMOVE_TAG } from '../actions/actions';

const initialState = [
  { tagName: 'TAG_GENERAL', tagColor: 'geekblue'},
  { tagName: 'TAG_IMPORTANT', tagColor: 'orange'},
  { tagName: 'TAG_OTHER', tagColor: ''}
]

function tagsReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_TAG:
      return [
        ...state,
        {
          tagName: action.tagName,
          tagColor: action.tagColor
        }
      ];
    case REMOVE_TAG:
      return state.filter(tagData => tagData.tagName !== action.tagName);
    default:
      return state;
  }
}

export default tagsReducer;