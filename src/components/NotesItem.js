import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment';
import { editNote, activeNote, inactiveNote, TAG_ALL, STATUS_ACTIVE, STATUS_INACTIVE } from '../redux/actions/actions';
import { Button, Row, Col, Tag, Icon, Tooltip, Modal, Input, Select, DatePicker } from 'antd';
import './NoteForm_List.css';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

class NotesItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editNoteModalVisible: false,
      editNoteData: {},
      newTitleInput: '',
      newContentInput: '',
      newDateSelect: [],
      newTagSelect: undefined,
    };
  }

  showEditModal = (note) => {
    const oldTag = note.tag.map( tagName => tagName.substring(4, tagName.length).toLowerCase());
    this.setState((prevState) => ({
      ...prevState,
      editNoteModalVisible: true,
      editNoteData: note,
      newDateSelect: note.dueDate,
      newTagSelect: oldTag,
    }));
  };

  handleNewTitleInput = (event) => {
    this.setState({ newTitleInput: event.target.value });
  }

  handleNewContentInput = (event) => {
    this.setState({ newContentInput: event.target.value });
  }

  handleNewDateInput = (value) => {
    const newDateArr = [value[0].format("DD/MM/YYYY, HH:mm"), value[1].format("DD/MM/YYYY, HH:mm")]
    this.setState({ newDateSelect: newDateArr })
  }

  handleNewTagSelect = (value) => {
    this.setState({ newTagSelect: value });
  }

  handleSubmitEditNote = () => {
    let newTitle, newContent, newTag;
    const newDueDate = this.state.newDateSelect;
    const { editNoteData } = this.state;

    if(this.state.newTitleInput) {
      newTitle = this.state.newTitleInput;
    } else {
      newTitle = editNoteData.title;
    }

    if(this.state.newContentInput) {
      newContent = this.state.newContentInput;
    } else {
      newContent = editNoteData.content;
    }

    if(this.state.newTagSelect) {
      const newTagSelect = this.state.newTagSelect;
      newTag = newTagSelect.map(tagName => 'TAG_' + tagName.toUpperCase());
    } else {
      newTag = editNoteData.tag;
    }

    this.props.editNote(editNoteData.id, newTitle, newContent, newDueDate, newTag);
    this.handleModalCancel();
  }

  handleModalCancel = () => {
    this.setState(prevState => ({
      ...prevState,
      editNoteModalVisible: false,
      editNoteData: {},
      newTitleInput: '',
      newContentInput: '',
      newDateSelect: [],
      newTagSelect: undefined,
    }));
  };

  render() {
    const { searchInput, searchType } = this.props;
    let visibility = this.props.visibility;
    let tagFilter = this.props.tagFilter;
    let notes = this.props.notes.filter(note => note.status === visibility);

    let tagsItem = this.props.tags;
    const tagsName = tagsItem.map((tag) => {
      return tag.tagName.substring(4,tag.tagName.length).toLowerCase();
    })

    let filteredNotes, displayNotes;
    const dateFormat = "DD/MM/YYYY, HH:mm";

    const { editNoteData, newDateSelect } = this.state;
/*     if( this.state.editNoteModalVisible ) {
      oldTag = editNoteData.tag.map( tagName => tagName.substring(4, tagName.length).toLowerCase());
    } */

    if(notes.length > 0) {
      if (tagFilter === TAG_ALL) {
        filteredNotes = notes;
      } else {
        filteredNotes = notes.filter((note) => {
          const taggedNote = note.tag.filter((tagName) => {
            return tagName === tagFilter;
          })

          if(taggedNote.length > 0) {
            return true;
          } else {
            return false;
          }
        });
      }

      if (searchType === 'title') {
        displayNotes = filteredNotes.filter(note => note.title.toLowerCase().search(searchInput) >= 0);
      } else {
        displayNotes = filteredNotes.filter(note => note.content.toLowerCase().search(searchInput) >= 0);
      }

      return (
        <>
          <Row style={{ marginTop: "20px" }}>
            <Col>
              <ul id="note-list-ul">
                {displayNotes.map((note, index) => (
                  <li key={note.id} className="note-list-li" style={{ backgroundColor: index % 2 === 0 ? "#f7f7f7" : "white" }}>
                    <Row>
                      <Col span={4}>
                        {note.tag.map((noteTag) => (
                          <Row style={{ marginBottom: "5px" }}>
                            <Tag color={
                              tagsItem.filter((tagData) => {
                                return tagData.tagName === noteTag;
                              })[0].tagColor} /* Get tag color by compare with tag database */
                            >
                              { noteTag.substring(4, noteTag.length).toLowerCase() }
                            </Tag>
                          </Row>
                        ))}
                      </Col>
                      <Col span={16}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>  
                        <hr />    
                        <span>Due: {note.dueDate[0]} to {note.dueDate[1]}</span>
                        <br />
                        <span className="txt-date">created: {note.createdDate}</span>
                      </Col>
                      <Col span={4} style={{ textAlign: 'right', height: '100%' }}>
                        <Row>
                          <Tooltip title="Active">
                            <Button type="primary" icon="arrow-left" shape="circle" size="small"
                              disabled={ visibility === STATUS_ACTIVE ? true : false } 
                              onClick={() => this.props.activeNote(note.id)}
                            />
                          </Tooltip>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Tooltip title="Edit">
                            <Button type="primary" icon="edit" shape="circle" size="small" 
                              onClick={() => this.showEditModal(note)}
                            />
                          </Tooltip>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Tooltip title="Delete">
                            <Button type="danger" icon="close" shape="circle" size="small"
                              disabled={ visibility === STATUS_INACTIVE ? true : false } 
                              onClick={() => this.props.inactiveNote(note.id)}
                            />
                          </Tooltip>
                        </Row>
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
          <Modal
            title="Note Editor"
            centered
            visible={ this.state.editNoteModalVisible }
            onCancel={this.handleModalCancel}
            footer={[
              <Button type="danger" onClick={ this.handleModalCancel }>
                Cancel
              </Button>,
              <Button type="primary" onClick={ this.handleSubmitEditNote }>
                Confirm
              </Button>
            ]}
          >
            <span>Title:</span>
            <Input
              prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={ editNoteData.title }
              className="edit-modal-input"
              onChange={ this.handleNewTitleInput }
              value={ this.state.newTitleInput }
            />
            <span>Content:</span>
            <TextArea 
              rows={5} 
              placeholder={ editNoteData.content } 
              className="edit-modal-input"
              onChange={ this.handleNewContentInput }
              value={ this.state.newContentInput }
            />
            <span>Due date:</span>
            <RangePicker 
              value={ newDateSelect.length > 0 ? [ moment(newDateSelect[0], dateFormat), moment(newDateSelect[1], dateFormat) ] : ''}
              style={{ width: "100%"}} 
              showTime={{ format: "HH:mm" }} 
              format="DD/MM/YYYY, HH:mm" 
              className="edit-modal-input"
              onChange={ this.handleNewDateInput }
              onOk={ this.handleNewDateInput }
            />
            <span>Tag:</span>
            <Select
              mode="multiple"
              /* defaultValue={ oldTag } */
              onChange={ this.handleNewTagSelect }
              style={{ width: "100%" }}
              className="edit-modal-input"
              value={ this.state.newTagSelect }
            >
              {tagsName.map((tag) => (
                <Option key={tag}>{tag}</Option>
              ))}
            </Select>
          </Modal>
        </>
      )
    } else {
      return (
        <Row style={{ marginTop: "20px" }} type="flex" justify="center">
          <span id="empty-notice"><Icon type="file-exclamation" /> Empty Note</span>
        </Row>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    visibility: state.visibility,
    tagFilter: state.tagFilter,
    tags: state.tags,
  }
}

const mapDispatchToProps = {
  activeNote: activeNote,
  inactiveNote: inactiveNote,
  editNote: editNote,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesItem)