import { ADD_NOTE, EDIT_NOTE, ACTIVE_NOTE, INACTIVE_NOTE, STATUS_ACTIVE, STATUS_INACTIVE, CHANGE_DELETED_TAG, TAG_OTHER } from '../actions/actions';

function notesReducer(notes = [], action) {
  switch(action.type) {
    case ADD_NOTE:
      return [
        ...notes,
        {
          id: action.id,
          title: action.title,
          content: action.content,
          dueDate: action.dueDate,
          tag: action.tag,
          createdDate: action.createdDate,
          status: action.status,
        }
      ];
    case EDIT_NOTE:
      return notes.map(note => note.id === action.id ?
          { ...note, 
            title: action.title, 
            content: action.content, 
            dueDate: action.dueDate, 
            tag: action.tag,
          } 
          : note
        );
    case CHANGE_DELETED_TAG:
      return notes.map((note) => {
        const modifiedTagArr = note.tag.filter((tagName) => {
          return tagName !== action.deletedTag;
        })
        if(modifiedTagArr.length > 0) {
          return { ...note, tag: modifiedTagArr };
        } else {
          return { ...note, tag: [ TAG_OTHER ] };
        }
      });
    case ACTIVE_NOTE:
      return notes.map(note => note.id === action.id ? { ...note, status: STATUS_ACTIVE} : note);
    case INACTIVE_NOTE:
      return notes.map(note => note.id === action.id ? { ...note, status: STATUS_INACTIVE} : note);
    default:
      return notes;
  }
}

export default notesReducer;