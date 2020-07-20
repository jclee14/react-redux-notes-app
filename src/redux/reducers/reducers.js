import { combineReducers } from 'redux';
import notesReducer from './notesReducer';
import visibilityReducer from './visibilityReducer';
import idReducer from './idReducer';
import tagFilterReducer from './tagFilterReducer';
import tagsReducer from './tagsReducer';
import tagColorsReducer from './tagColorsReducer';

const reducers = combineReducers({
  notes: notesReducer,
  visibility: visibilityReducer,
  nextID: idReducer,
  tagFilter: tagFilterReducer,
  tags: tagsReducer,
  tagColors: tagColorsReducer,
});

export default reducers;